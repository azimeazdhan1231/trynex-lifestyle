import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertCustomDesignSchema, insertOrderTimelineSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create order
  app.post("/api/orders", upload.single('paymentScreenshot'), async (req, res) => {
    try {
      const orderData = JSON.parse(req.body.orderData);
      const validatedOrder = insertOrderSchema.parse(orderData);
      
      if (req.file) {
        validatedOrder.paymentScreenshot = `/uploads/${req.file.filename}`;
      }
      
      const order = await storage.createOrder(validatedOrder);
      
      // Create custom designs if provided
      if (req.body.customDesigns) {
        const customDesigns = JSON.parse(req.body.customDesigns);
        for (const design of customDesigns) {
          await storage.createCustomDesign({
            ...design,
            orderId: order.id,
          });
        }
      }
      
      res.json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  // Upload custom design files
  app.post("/api/designs/upload", upload.array('designs', 5), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      
      const filePaths = (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`);
      res.json({ files: filePaths });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  // Get order by tracking ID
  app.get("/api/orders/track/:trackingId", async (req, res) => {
    try {
      const order = await storage.getOrderByTrackingId(req.params.trackingId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const timeline = await storage.getOrderTimeline(order.id);
      res.json({ order, timeline });
    } catch (error) {
      res.status(500).json({ message: "Failed to track order" });
    }
  });

  // Admin login
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const isValid = await storage.verifyAdminPassword(username, password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      res.json({ admin: { id: admin!.id, username: admin!.username, role: admin!.role } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin: Get all orders
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  // Admin: Update order status
  app.put("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Admin: Create product
  app.post("/api/admin/products", async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Admin: Update product
  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Admin: Delete product
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const success = await storage.deleteProduct(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
