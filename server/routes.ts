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
      console.log("Fetching products...");
      const products = await storage.getProducts();
      console.log("Products fetched:", products.length);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products", error: (error as Error).message });
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
      
      // Generate tracking ID
      const trackingId = 'TRX' + Date.now().toString().slice(-6) + Math.random().toString(36).substr(2, 3).toUpperCase();
      
      // Calculate totals
      const items = orderData.items || [];
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      const deliveryCharge = 60;
      const total = subtotal + deliveryCharge;
      
      // Prepare complete order data
      const completeOrderData = {
        ...orderData,
        trackingId,
        subtotal: subtotal.toString(),
        total: total.toString(),
        status: 'pending',
        items: JSON.stringify(items)
      };
      
      const validatedOrder = insertOrderSchema.parse(completeOrderData);
      
      if (req.file) {
        validatedOrder.paymentScreenshot = `/uploads/${req.file.filename}`;
      }
      
      const order = await storage.createOrder(validatedOrder);
      
      // Create initial order timeline entry
      await storage.createOrderTimeline({
        orderId: order.id,
        status: 'pending',
        message: 'অর্ডার গ্রহণ করা হয়েছে এবং যাচাই করা হচ্ছে',
        messageEn: 'Order received and being verified'
      });
      
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

  // Populate sample data endpoint
  app.post("/api/admin/populate-sample-data", async (req, res) => {
    try {
      const sampleProducts = [
        {
          name: 'Premium Love Mug',
          nameBn: 'প্রিমিয়াম লাভ মগ',
          description: 'Beautiful ceramic mug perfect for couples',
          descriptionBn: 'কাপলদের জন্য নিখুঁত সুন্দর সিরামিক মগ',
          category: 'mugs',
          subcategory: 'love-mug',
          price: '550',
          originalPrice: '650',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300'],
          isCustomizable: true,
          isFeatured: true,
          features: ['Dishwasher safe', 'Microwave safe', 'Premium ceramic'],
          featuresBn: ['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক'],
          tags: ['love', 'couple', 'gift'],
          specifications: { material: 'ceramic', capacity: '350ml' }
        },
        {
          name: 'Magic Color Change Mug',
          nameBn: 'ম্যাজিক কালার চেঞ্জ মগ',
          description: 'Color changing mug that reveals design when hot',
          descriptionBn: 'গরম হলে ডিজাইন প্রকাশ করে এমন রঙ পরিবর্তনকারী মগ',
          category: 'mugs',
          subcategory: 'magic-mug',
          price: '750',
          originalPrice: '850',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300'],
          isCustomizable: true,
          isFeatured: true,
          features: ['Color changing', 'Heat sensitive', 'Premium ceramic'],
          featuresBn: ['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক'],
          tags: ['magic', 'surprise', 'gift'],
          specifications: { material: 'ceramic', capacity: '330ml' }
        },
        {
          name: 'Custom Couple T-Shirt',
          nameBn: 'কাস্টম কাপল টি-শার্ট',
          description: 'Comfortable couple t-shirt with custom design',
          descriptionBn: 'কাস্টম ডিজাইন সহ আরামদায়ক কাপল টি-শার্ট',
          category: 'tshirts',
          subcategory: 'couple-tshirt',
          price: '1100',
          originalPrice: '1300',
          image: '/api/placeholder/300/300',
          images: ['/api/placeholder/300/300'],
          isCustomizable: true,
          isFeatured: true,
          features: ['100% Cotton', 'Available in all sizes', 'Custom printing'],
          featuresBn: ['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং'],
          tags: ['couple', 'tshirt', 'romance'],
          specifications: { material: 'cotton', sizes: ['S', 'M', 'L', 'XL'] }
        }
      ];

      for (const productData of sampleProducts) {
        await storage.createProduct(productData);
      }

      res.json({ message: "Sample data populated successfully", count: sampleProducts.length });
    } catch (error) {
      console.error("Error populating sample data:", error);
      res.status(500).json({ message: "Failed to populate sample data" });
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

  // Single image upload for admin
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      res.json({ filePath: `/uploads/${req.file.filename}` });
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

  // Admin: Create default admin user
  app.post("/api/admin/create-default-admin", async (req, res) => {
    try {
      const { username = "admin", password = "admin123" } = req.body;
      
      // Check if admin already exists
      const existing = await storage.getAdminByUsername(username);
      if (existing) {
        return res.status(409).json({ message: "Admin user already exists" });
      }
      
      const admin = await storage.createAdmin({ username, password });
      res.json({ 
        message: "Default admin created successfully", 
        admin: { id: admin.id, username: admin.username, role: admin.role } 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
