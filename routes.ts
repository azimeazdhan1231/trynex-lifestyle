import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-simple";
import { insertProductSchema, insertOrderSchema, insertContactSchema, insertNewsletterSchema, insertBlogPostSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize sample data endpoint
  app.post("/api/init-data", async (req, res) => {
    try {
      // Create categories
      const categoryData = [
        { name: "Custom T-Shirts", nameBn: "কাস্টম টি-শার্ট", slug: "custom-tshirts" },
        { name: "Custom Mugs", nameBn: "কাস্টম মগ", slug: "custom-mugs" },
        { name: "Custom Tumblers", nameBn: "কাস্টম টাম্বলার", slug: "custom-tumblers" },
        { name: "Custom Hoodies", nameBn: "কাস্টম হুডি", slug: "custom-hoodies" },
        { name: "Custom Caps", nameBn: "কাস্টম ক্যাপ", slug: "custom-caps" },
        { name: "Custom Keychains", nameBn: "কাস্টম কিচেইন", slug: "custom-keychains" },
        { name: "Custom Phone Cases", nameBn: "কাস্টম ফোন কেস", slug: "custom-phone-cases" },
        { name: "Custom Pillows", nameBn: "কাস্টম বালিশ", slug: "custom-pillows" }
      ];

      for (const category of categoryData) {
        try {
          await storage.createCategory(category);
        } catch (e) {
          // Category might already exist, continue
        }
      }

      // Create comprehensive product data for custom printing business
      const productData = [
        // Custom T-Shirts
        {
          name: "Premium Cotton Custom T-Shirt",
          nameBn: "প্রিমিয়াম সুতি কাস্টম টি-শার্ট",
          slug: "premium-cotton-custom-tshirt",
          price: "599",
          originalPrice: "799",
          description: "High-quality 100% cotton t-shirt with your custom design. Perfect for personal or business branding.",
          descriptionBn: "আপনার কাস্টম ডিজাইন সহ উচ্চ মানের ১০০% সুতির টি-শার্ট। ব্যক্তিগত বা ব্যবসায়িক ব্র্যান্ডিংয়ের জন্য উপযুক্ত।",
          categoryId: 1,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          isFeatured: true,
          tags: ["cotton", "custom", "premium", "comfortable"]
        },
        {
          name: "Drop Shoulder Oversized T-Shirt",
          nameBn: "ড্রপ শোল্ডার ওভারসাইজড টি-শার্ট",
          slug: "drop-shoulder-oversized-tshirt",
          price: "699",
          originalPrice: "899",
          description: "Trendy drop shoulder design with custom print. Perfect for casual street style.",
          descriptionBn: "কাস্টম প্রিন্ট সহ ট্রেন্ডি ড্রপ শোল্ডার ডিজাইন। ক্যাজুয়াল স্ট্রিট স্টাইলের জন্য উপযুক্ত।",
          categoryId: 1,
          image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400",
          isFeatured: true,
          tags: ["oversized", "trendy", "street-style", "custom"]
        },
        {
          name: "Farewell Memory T-Shirt",
          nameBn: "বিদায়ী স্মৃতি টি-শার্ট",
          slug: "farewell-memory-tshirt",
          price: "549",
          originalPrice: "699",
          description: "Special farewell design t-shirt with custom names and memories. Perfect for graduation or farewell events.",
          descriptionBn: "কাস্টম নাম এবং স্মৃতি সহ বিশেষ বিদায়ী ডিজাইন টি-শার্ট। স্নাতক বা বিদায়ী অনুষ্ঠানের জন্য উপযুক্ত।",
          categoryId: 1,
          image: "https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=400",
          isFeatured: false,
          tags: ["farewell", "graduation", "memory", "custom"]
        },
        {
          name: "School Rag Day Special T-Shirt",
          nameBn: "স্কুল র‍্যাগ ডে বিশেষ টি-শার্ট",
          slug: "school-rag-day-tshirt",
          price: "499",
          originalPrice: "649",
          description: "Fun and colorful design perfect for school rag day celebrations with custom text and graphics.",
          descriptionBn: "কাস্টম টেক্সট এবং গ্রাফিক্স সহ স্কুল র‍্যাগ ডে উদযাপনের জন্য উপযুক্ত মজাদার এবং রঙিন ডিজাইন।",
          categoryId: 1,
          image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400",
          isFeatured: false,
          tags: ["school", "rag-day", "colorful", "fun"]
        },

        // Custom Mugs
        {
          name: "Love Heart Custom Mug",
          nameBn: "ভালোবাসার হার্ট কাস্টম মগ",
          slug: "love-heart-custom-mug",
          price: "450",
          originalPrice: "550",
          description: "Beautiful heart-shaped design mug perfect for expressing love with custom photo and message.",
          descriptionBn: "কাস্টম ফটো এবং বার্তা সহ ভালোবাসা প্রকাশের জন্য উপযুক্ত সুন্দর হার্ট আকৃতির ডিজাইন মগ।",
          categoryId: 2,
          image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
          isFeatured: true,
          tags: ["love", "heart", "romantic", "custom-photo"]
        },
        {
          name: "Mother's Day Special Mug",
          nameBn: "মা দিবসের বিশেষ মগ",
          slug: "mothers-day-special-mug",
          price: "520",
          originalPrice: "650",
          description: "Special design for Mother's Day with loving messages and custom family photos.",
          descriptionBn: "ভালোবাসার বার্তা এবং কাস্টম পারিবারিক ছবি সহ মা দিবসের জন্য বিশেষ ডিজাইন।",
          categoryId: 2,
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
          isFeatured: true,
          tags: ["mother", "family", "special-occasion", "custom-photo"]
        },
        {
          name: "Father's Day Hero Mug",
          nameBn: "বাবা দিবসের হিরো মগ",
          slug: "fathers-day-hero-mug",
          price: "520",
          originalPrice: "650",
          description: "Celebrate your hero dad with custom design and personal message on this special mug.",
          descriptionBn: "কাস্টম ডিজাইন এবং ব্যক্তিগত বার্তা সহ এই বিশেষ মগে আপনার হিরো বাবাকে উদযাপন করুন।",
          categoryId: 2,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
          isFeatured: false,
          tags: ["father", "hero", "special-occasion", "custom-message"]
        },
        {
          name: "Magic Color Changing Love Mug",
          nameBn: "ম্যাজিক কালার চেঞ্জিং ভালোবাসার মগ",
          slug: "magic-color-changing-love-mug",
          price: "650",
          originalPrice: "800",
          description: "Amazing color-changing mug that reveals your love message when hot liquid is poured.",
          descriptionBn: "অসাধারণ রঙ পরিবর্তনকারী মগ যা গরম তরল ঢালার সময় আপনার ভালোবাসার বার্তা প্রকাশ করে।",
          categoryId: 2,
          image: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400",
          isFeatured: true,
          tags: ["magic", "color-changing", "love", "surprise"]
        },
        {
          name: "Best Friend Forever Mug Set",
          nameBn: "সেরা বন্ধু চিরকালের মগ সেট",
          slug: "best-friend-forever-mug-set",
          price: "899",
          originalPrice: "1199",
          description: "Set of two matching mugs perfect for best friends with custom names and inside jokes.",
          descriptionBn: "কাস্টম নাম এবং অভ্যন্তরীণ জোকস সহ সেরা বন্ধুদের জন্য উপযুক্ত দুটি ম্যাচিং মগের সেট।",
          categoryId: 2,
          image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400",
          isFeatured: false,
          tags: ["friendship", "set", "matching", "custom-names"]
        },

        // Custom Tumblers
        {
          name: "Insulated Steel Tumbler",
          nameBn: "ইনসুলেটেড স্টিল টাম্বলার",
          slug: "insulated-steel-tumbler",
          price: "750",
          originalPrice: "950",
          description: "Keep drinks hot or cold for hours with custom engraving and premium insulation.",
          descriptionBn: "কাস্টম এনগ্রেভিং এবং প্রিমিয়াম ইনসুলেশন সহ ঘন্টার পর ঘন্টা পানীয় গরম বা ঠান্ডা রাখুন।",
          categoryId: 3,
          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          isFeatured: true,
          tags: ["insulated", "steel", "engraving", "premium"]
        },
        {
          name: "Colorful Gradient Tumbler",
          nameBn: "রঙিন গ্রেডিয়েন্ট টাম্বলার",
          slug: "colorful-gradient-tumbler",
          price: "699",
          originalPrice: "849",
          description: "Vibrant gradient colors with custom design perfect for daily hydration in style.",
          descriptionBn: "স্টাইলে দৈনিক হাইড্রেশনের জন্য উপযুক্ত কাস্টম ডিজাইন সহ প্রাণবন্ত গ্রেডিয়েন্ট রং।",
          categoryId: 3,
          image: "https://images.unsplash.com/photo-1582885082427-baac8d7ad7f3?w=400",
          isFeatured: false,
          tags: ["colorful", "gradient", "stylish", "daily-use"]
        },

        // Custom Hoodies
        {
          name: "Premium Custom Hoodie",
          nameBn: "প্রিমিয়াম কাস্টম হুডি",
          slug: "premium-custom-hoodie",
          price: "1299",
          originalPrice: "1599",
          description: "Cozy premium hoodie with custom embroidery or print. Perfect for winter comfort.",
          descriptionBn: "কাস্টম এমব্রয়ডারি বা প্রিন্ট সহ আরামদায়ক প্রিমিয়াম হুডি। শীতের আরামের জন্য উপযুক্ত।",
          categoryId: 4,
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
          isFeatured: true,
          tags: ["hoodie", "premium", "winter", "comfortable"]
        },

        // Custom Caps
        {
          name: "Snapback Custom Cap",
          nameBn: "স্ন্যাপব্যাক কাস্টম ক্যাপ",
          slug: "snapback-custom-cap",
          price: "449",
          originalPrice: "599",
          description: "Trendy snapback cap with custom embroidery. Perfect for casual street style.",
          descriptionBn: "কাস্টম এমব্রয়ডারি সহ ট্রেন্ডি স্ন্যাপব্যাক ক্যাপ। ক্যাজুয়াল স্ট্রিট স্টাইলের জন্য উপযুক্ত।",
          categoryId: 5,
          image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
          isFeatured: false,
          tags: ["cap", "snapback", "trendy", "embroidery"]
        },

        // Custom Keychains
        {
          name: "Acrylic Custom Keychain",
          nameBn: "অ্যাক্রিলিক কাস্টম কিচেইন",
          slug: "acrylic-custom-keychain",
          price: "149",
          originalPrice: "199",
          description: "Durable acrylic keychain with custom design and LED light feature.",
          descriptionBn: "কাস্টম ডিজাইন এবং LED লাইট ফিচার সহ টেকসই অ্যাক্রিলিক কিচেইন।",
          categoryId: 6,
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
          isFeatured: false,
          tags: ["keychain", "acrylic", "LED", "durable"]
        },

        // Custom Phone Cases
        {
          name: "Soft Silicone Custom Phone Case",
          nameBn: "নরম সিলিকন কাস্টম ফোন কেস",
          slug: "soft-silicone-custom-phone-case",
          price: "399",
          originalPrice: "499",
          description: "Soft silicone phone case with custom design. Available for all major phone models.",
          descriptionBn: "কাস্টম ডিজাইন সহ নরম সিলিকন ফোন কেস। সমস্ত প্রধান ফোন মডেলের জন্য উপলব্ধ।",
          categoryId: 7,
          image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400",
          isFeatured: false,
          tags: ["phone-case", "silicone", "protection", "custom"]
        },

        // Custom Pillows
        {
          name: "Memory Foam Custom Pillow",
          nameBn: "মেমোরি ফোম কাস্টম বালিশ",
          slug: "memory-foam-custom-pillow",
          price: "899",
          originalPrice: "1199",
          description: "Comfortable memory foam pillow with custom printed cover. Perfect for personalized home decor.",
          descriptionBn: "কাস্টম প্রিন্টেড কভার সহ আরামদায়ক মেমোরি ফোম বালিশ। ব্যক্তিগতকৃত হোম ডেকরের জন্য উপযুক্ত।",
          categoryId: 8,
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
          isFeatured: false,
          tags: ["pillow", "memory-foam", "comfortable", "home-decor"]
        }
      ];

      for (const product of productData) {
        try {
          await storage.createProduct(product);
        } catch (e) {
          // Product might already exist, continue
        }
      }

      res.json({ message: "Sample data initialized successfully" });
    } catch (error) {
      console.error("Error initializing data:", error);
      res.status(500).json({ message: "Failed to initialize data" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const { category, featured, limit, search } = req.query;
      const products = await storage.getProducts({
        categoryId: category ? parseInt(category as string) : undefined,
        isFeatured: featured === "true",
        limit: limit ? parseInt(limit as string) : undefined,
        search: search as string,
      });
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Categories endpoints
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Orders endpoints
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData, req.body.items);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(parseInt(req.params.id));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      await storage.deleteProduct(productId);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Blog endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const { limit, published } = req.query;
      const posts = await storage.getBlogPosts({
        limit: limit ? parseInt(limit as string) : undefined,
        published: published !== "false",
      });
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Contact form endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json({ message: "Message sent successfully", id: contact.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact data", errors: error.errors });
      }
      console.error("Error creating contact:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const newsletterData = insertNewsletterSchema.parse(req.body);
      const subscription = await storage.subscribeNewsletter(newsletterData);
      res.status(201).json({ message: "Successfully subscribed to newsletter", id: subscription.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid email data", errors: error.errors });
      }
      console.error("Error subscribing to newsletter:", error);
      if (error.message.includes("duplicate")) {
        return res.status(409).json({ message: "Email already subscribed" });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Featured products endpoint
  app.get("/api/featured-products", async (req, res) => {
    try {
      const products = await storage.getProducts({ isFeatured: true, limit: 6 });
      res.json(products);
    } catch (error) {
      console.error("Error fetching featured products:", error);
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, type = "products" } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }

      let results = [];
      if (type === "products") {
        results = await storage.getProducts({ search: q as string });
      } else if (type === "blog") {
        results = await storage.getBlogPosts({ search: q as string });
      }

      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Voucher validation endpoint
  app.post("/api/validate-voucher", async (req, res) => {
    try {
      const { code } = req.body;
      const validVouchers = {
        "TRYNEX15": { discount: 15, type: "percentage", isValid: true },
        "WELCOME10": { discount: 10, type: "percentage", isValid: true }
      };

      const voucher = validVouchers[code.toUpperCase() as keyof typeof validVouchers];
      if (voucher) {
        res.json({ isValid: true, ...voucher });
      } else {
        res.json({ isValid: false, message: "Invalid voucher code" });
      }
    } catch (error) {
      console.error("Error validating voucher:", error);
      res.status(500).json({ message: "Failed to validate voucher" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}