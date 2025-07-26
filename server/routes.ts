import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertCustomDesignSchema, insertOrderTimelineSchema, insertPromoOfferSchema } from "@shared/schema";
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
    // Skip validation if no file provided
    if (!file) {
      return cb(null, true);
    }
    
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

  // Create order - handle multiple files
  app.post("/api/orders", upload.fields([
    { name: 'paymentScreenshot', maxCount: 1 },
    { name: 'customDesignFiles', maxCount: 10 }
  ]), async (req, res) => {
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
        total: total.toString(),
        status: 'pending',
        items: JSON.stringify(items)
      };
      
      const validatedOrder = insertOrderSchema.parse(completeOrderData);
      
      // Handle file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.paymentScreenshot?.[0]) {
        validatedOrder.paymentScreenshot = `/uploads/${files.paymentScreenshot[0].filename}`;
      }
      
      const order = await storage.createOrder(validatedOrder);
      
      // Create initial order timeline entry
      await storage.addOrderTimelineEntry({
        orderId: order.id,
        status: 'pending',
        message: 'অর্ডার গ্রহণ করা হয়েছে এবং যাচাই করা হচ্ছে',
        messageEn: 'Order received and being verified'
      });
      
      // Create custom designs if provided
      if (req.body.customDesigns) {
        const customDesigns = JSON.parse(req.body.customDesigns);
        const customDesignFiles = files?.customDesignFiles || [];
        
        for (let i = 0; i < customDesigns.length; i++) {
          const design = customDesigns[i];
          const designFile = customDesignFiles[i];
          
          await storage.createCustomDesign({
            ...design,
            orderId: order.id,
            designFile: designFile ? `/uploads/${designFile.filename}` : design.designFile
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

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      // Test database connection
      const products = await storage.getProducts();
      const dbStatus = products ? "connected" : "disconnected";
      
      res.json({ 
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: dbStatus,
        server: "running",
        environment: process.env.NODE_ENV || "development"
      });
    } catch (error) {
      res.status(503).json({ 
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "error",
        error: (error as Error).message
      });
    }
  });

  // Test endpoint for debugging
  app.get("/api/test", (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: "Server is working", timestamp: new Date().toISOString() });
  });

  // Create default admin user (for initial setup)
  app.post("/api/admin/create-default", async (req, res) => {
    try {
      const { username = 'admin', password = 'admin123' } = req.body;
      
      // Check if admin already exists
      const existingAdmin = await storage.getAdminByUsername(username);
      if (existingAdmin) {
        return res.json({ message: "Admin user already exists", username });
      }
      
      const admin = await storage.createAdmin({ username, password, role: 'admin' });
      res.json({ message: "Default admin created", username: admin.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to create admin user" });
    }
  });

  // Simple admin login for testing
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    
    // Direct credential check
    if (username === 'admin' && password === 'admin123') {
      return res.json({ 
        admin: { 
          id: 'admin-1', 
          username: 'admin', 
          role: 'admin' 
        } 
      });
    }
    
    res.status(401).json({ message: "Invalid credentials" });
  });

  // Admin: Get all orders with real-time support
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      
      // Add CORS headers for real-time polling
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', '0');
      
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

  // Admin: Get all promo offers
  app.get("/api/admin/promo-offers", async (req, res) => {
    try {
      const offers = await storage.getPromoOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promo offers" });
    }
  });

  // Admin: Create promo offer
  app.post("/api/admin/promo-offers", async (req, res) => {
    try {
      const offer = await storage.createPromoOffer(req.body);
      res.json(offer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create promo offer" });
    }
  });

  // Admin: Update promo offer
  app.put("/api/admin/promo-offers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Updating promo offer ${id} with data:`, req.body);
      const updated = await storage.updatePromoOffer(id, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Promo offer not found" });
      }
      console.log(`Promo offer updated successfully:`, updated);
      res.json(updated);
    } catch (error) {
      console.error('Error updating promo offer:', error);
      res.status(500).json({ message: "Failed to update promo offer" });
    }
  });

  // Admin: Delete promo offer
  app.delete("/api/admin/promo-offers/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deletePromoOffer(id);
      if (!deleted) {
        return res.status(404).json({ message: "Promo offer not found" });
      }
      res.json({ message: "Promo offer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promo offer" });
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

  // Search products with YouTube-like algorithm (matching query against multiple fields)
  app.get("/api/products/search/:query", async (req, res) => {
    try {
      const q = req.params.query;
      if (!q || typeof q !== 'string') {
        return res.json([]);
      }
      
      const allProducts = await storage.getProducts();
      const query = q.toLowerCase().trim();
      
      // Score-based search algorithm like YouTube
      const scoredProducts = allProducts.map(product => {
        let score = 0;
        
        // Exact matches get highest score
        if (product.name.toLowerCase().includes(query)) score += 10;
        if (product.nameBn.toLowerCase().includes(query)) score += 10;
        if (product.description?.toLowerCase().includes(query)) score += 8;
        if (product.descriptionBn?.toLowerCase().includes(query)) score += 8;
        if (product.category.toLowerCase().includes(query)) score += 6;
        if (product.subcategory?.toLowerCase().includes(query)) score += 6;
        
        // Tags and features matching
        product.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(query)) score += 5;
        });
        
        product.features?.forEach(feature => {
          if (feature.toLowerCase().includes(query)) score += 3;
        });
        
        product.featuresBn?.forEach(feature => {
          if (feature.toLowerCase().includes(query)) score += 3;
        });
        
        // Partial word matching
        const words = query.split(' ');
        words.forEach(word => {
          if (word.length > 2) {
            if (product.name.toLowerCase().includes(word)) score += 2;
            if (product.nameBn.toLowerCase().includes(word)) score += 2;
          }
        });
        
        return { ...product, searchScore: score };
      });
      
      // Filter and sort by score
      const results = scoredProducts
        .filter(p => p.searchScore > 0)
        .sort((a, b) => b.searchScore - a.searchScore)
        .slice(0, 20); // Return top 20 results
        
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Promo Offers API
  app.get("/api/promo-offers", async (req, res) => {
    try {
      const offers = await storage.getActivePromoOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promo offers" });
    }
  });

  app.get("/api/promo-offers/popup", async (req, res) => {
    try {
      const offers = await storage.getPopupPromoOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch popup offers" });
    }
  });

  // Admin: Promo Offers Management
  app.get("/api/admin/promo-offers", async (req, res) => {
    try {
      const offers = await storage.getPromoOffers();
      res.json(offers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promo offers" });
    }
  });

  app.post("/api/admin/promo-offers", async (req, res) => {
    try {
      const offer = await storage.createPromoOffer(req.body);
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: "Invalid promo offer data" });
    }
  });

  app.put("/api/admin/promo-offers/:id", async (req, res) => {
    try {
      const offer = await storage.updatePromoOffer(req.params.id, req.body);
      if (!offer) {
        return res.status(404).json({ message: "Promo offer not found" });
      }
      res.json(offer);
    } catch (error) {
      res.status(400).json({ message: "Invalid promo offer data" });
    }
  });

  app.delete("/api/admin/promo-offers/:id", async (req, res) => {
    try {
      const success = await storage.deletePromoOffer(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Promo offer not found" });
      }
      res.json({ message: "Promo offer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promo offer" });
    }
  });

  // Wishlist API
  app.get("/api/wishlist/:userId", async (req, res) => {
    try {
      const wishlist = await storage.getWishlist(req.params.userId);
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wishlist" });
    }
  });

  app.post("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      const wishlistItem = await storage.addToWishlist(req.params.userId, req.params.productId);
      res.json(wishlistItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to add to wishlist" });
    }
  });

  app.delete("/api/wishlist/:userId/:productId", async (req, res) => {
    try {
      const success = await storage.removeFromWishlist(req.params.userId, req.params.productId);
      if (!success) {
        return res.status(404).json({ message: "Wishlist item not found" });
      }
      res.json({ message: "Removed from wishlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });

  app.get("/api/wishlist/:userId/:productId/check", async (req, res) => {
    try {
      const isInWishlist = await storage.isInWishlist(req.params.userId, req.params.productId);
      res.json({ inWishlist: isInWishlist });
    } catch (error) {
      res.status(500).json({ message: "Failed to check wishlist" });
    }
  });

  // Admin: Populate sample Bengali products for production
  app.post("/api/admin/populate-sample-data", async (req, res) => {
    try {
      console.log("Populating sample Bengali products...");
      
      const bengaliProducts = [
        {
          id: "premium-love-mug",
          name: "Premium Love Mug",
          nameBn: "প্রিমিয়াম লাভ মগ",
          description: "Express your love with this beautiful ceramic mug featuring elegant Bengali calligraphy",
          descriptionBn: "এই সুন্দর সিরামিক মগটি দিয়ে আপনার ভালোবাসা প্রকাশ করুন, যাতে রয়েছে মার্জিত বাংলা ক্যালিগ্রাফি",
          price: 550,
          originalPrice: 650,
          category: "mugs",
          subcategory: "love",
          image: "/api/placeholder/300/300",
          tags: ["love", "valentine", "gift", "ceramic"],
          features: ["Premium quality ceramic", "Dishwasher safe", "Custom Bengali text", "Perfect gift"],
          featuresBn: ["প্রিমিয়াম মানের সিরামিক", "ডিশওয়াশার নিরাপদ", "কাস্টম বাংলা টেক্সট", "পারফেক্ট উপহার"],
          isActive: true,
          stock: 50,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "family-bond-mug",
          name: "Family Bond Mug",
          nameBn: "পরিবারিক বন্ধন মগ",
          description: "Celebrate family relationships with beautiful Bengali family quotes",
          descriptionBn: "সুন্দর বাংলা পারিবারিক উক্তি দিয়ে পরিবারিক সম্পর্ক উদযাপন করুন",
          price: 500,
          originalPrice: 600,
          category: "mugs",
          subcategory: "family",
          image: "/api/placeholder/300/300",
          tags: ["family", "parents", "siblings", "bond"],
          features: ["High-quality print", "Fade resistant", "Microwave safe", "11oz capacity"],
          featuresBn: ["উচ্চ মানের প্রিন্ট", "ফেইড প্রতিরোধী", "মাইক্রোওয়েভ নিরাপদ", "১১ আউন্স ক্ষমতা"],
          isActive: true,
          stock: 35,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "success-motivation-mug",
          name: "Success Motivation Mug",
          nameBn: "সফলতার অনুপ্রেরণা মগ",
          description: "Start your day with powerful Bengali motivational quotes",
          descriptionBn: "শক্তিশালী বাংলা অনুপ্রেরণামূলক উক্তি দিয়ে আপনার দিন শুরু করুন",
          price: 480,
          originalPrice: 580,
          category: "mugs",
          subcategory: "motivation",
          image: "/api/placeholder/300/300",
          tags: ["success", "motivation", "inspiration", "quotes"],
          features: ["Inspiring Bengali quotes", "Premium ceramic", "Comfortable handle", "Daily motivation"],
          featuresBn: ["অনুপ্রেরণামূলক বাংলা উক্তি", "প্রিমিয়াম সিরামিক", "আরামদায়ক হ্যান্ডেল", "দৈনিক অনুপ্রেরণা"],
          isActive: true,
          stock: 42,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "friendship-special-mug", 
          name: "Friendship Special Mug",
          nameBn: "বন্ধুত্বের বিশেষ মগ",
          description: "Perfect gift for your best friend with heartwarming Bengali friendship quotes",
          descriptionBn: "হৃদয়স্পর্শী বাংলা বন্ধুত্বের উক্তি সহ আপনার সেরা বন্ধুর জন্য নিখুঁত উপহার",
          price: 520,
          originalPrice: 620,
          category: "mugs",
          subcategory: "friendship",
          image: "/api/placeholder/300/300",
          tags: ["friendship", "bestfriend", "gift", "quotes"],
          features: ["Friendship quotes", "Durable material", "Gift wrapping available", "Personalization option"],
          featuresBn: ["বন্ধুত্বের উক্তি", "টেকসই উপাদান", "গিফট র‍্যাপিং সুবিধা", "ব্যক্তিগতকরণ বিকল্প"],
          isActive: true,
          stock: 28,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "cultural-pride-mug",
          name: "Bengali Cultural Pride Mug",
          nameBn: "বাঙালি সাংস্কৃতিক গর্ব মগ",
          description: "Showcase your Bengali heritage with traditional designs and cultural motifs",
          descriptionBn: "ঐতিহ্যবাহী ডিজাইন এবং সাংস্কৃতিক মোটিফ দিয়ে আপনার বাঙালি ঐতিহ্য প্রদর্শন করুন",
          price: 580,
          originalPrice: 680,
          category: "mugs",
          subcategory: "cultural",
          image: "/api/placeholder/300/300", 
          tags: ["bengali", "culture", "heritage", "traditional"],
          features: ["Traditional Bengali art", "Cultural motifs", "Premium finish", "Heritage collection"],
          featuresBn: ["ঐতিহ্যবাহী বাঙালি শিল্প", "সাংস্কৃতিক মোটিফ", "প্রিমিয়াম ফিনিশ", "ঐতিহ্য সংগ্রহ"],
          isActive: true,
          stock: 25,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      // Insert products into database
      let insertedProducts = [];
      for (const product of bengaliProducts) {
        try {
          const created = await storage.createProduct(product);
          insertedProducts.push(created);
        } catch (error) {
          console.log(`Product ${product.id} might already exist, skipping...`);
        }
      }

      console.log(`✅ Successfully populated ${insertedProducts.length} Bengali products`);
      res.json({ 
        message: `Successfully populated ${insertedProducts.length} Bengali products`,
        products: insertedProducts.length
      });
    } catch (error) {
      console.error("Error populating sample data:", error);
      res.status(500).json({ message: "Failed to populate sample data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
