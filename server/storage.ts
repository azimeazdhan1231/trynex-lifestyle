import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, and } from "drizzle-orm";
import {
  products,
  orders,
  customDesigns,
  orderTimeline,
  adminUsers,
  promoOffers,
  wishlist,
  type Product,
  type InsertProduct,
  type Order,
  type InsertOrder,
  type CustomDesign,
  type InsertCustomDesign,
  type OrderTimeline,
  type InsertOrderTimeline,
  type AdminUser,
  type InsertAdminUser,
  type PromoOffer,
  type InsertPromoOffer,
  type Wishlist,
  type InsertWishlist,
  PRODUCT_CATEGORIES,
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.ickclyevpbgmppqizfov:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";
console.log("Attempting database connection to:", connectionString.replace(/:[^:]*@/, ':***@'));

let db: any = null;
let useMemoryStorage = false; // Now using proper database connection

try {
  const client = postgres(connectionString, {
    max: 1,
    ssl: 'require',
    connection: {
      application_name: 'trynex-lifestyle-store'
    }
  });
  db = drizzle(client);
  console.log("Database client initialized successfully");
} catch (error) {
  console.warn("Database connection failed, falling back to memory storage:", (error as Error).message);
  useMemoryStorage = true;
}

console.log("Using storage type:", useMemoryStorage ? "Memory" : "Database");

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderByTrackingId(trackingId: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;

  // Custom Designs
  getCustomDesigns(orderId: string): Promise<CustomDesign[]>;
  createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign>;

  // Order Timeline
  getOrderTimeline(orderId: string): Promise<OrderTimeline[]>;
  addOrderTimelineEntry(entry: InsertOrderTimeline): Promise<OrderTimeline>;

  // Admin Users
  getAdminByUsername(username: string): Promise<AdminUser | undefined>;
  createAdmin(admin: InsertAdminUser): Promise<AdminUser>;
  verifyAdminPassword(username: string, password: string): Promise<boolean>;

  // Promo Offers
  getPromoOffers(): Promise<PromoOffer[]>;
  getActivePromoOffers(): Promise<PromoOffer[]>;
  getPopupPromoOffers(): Promise<PromoOffer[]>;
  createPromoOffer(offer: InsertPromoOffer): Promise<PromoOffer>;
  updatePromoOffer(id: string, offer: Partial<InsertPromoOffer>): Promise<PromoOffer | undefined>;
  deletePromoOffer(id: string): Promise<boolean>;

  // Wishlist
  getWishlist(userId: string): Promise<Wishlist[]>;
  addToWishlist(userId: string, productId: string): Promise<Wishlist>;
  removeFromWishlist(userId: string, productId: string): Promise<boolean>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;
}

// Memory storage as fallback
class MemoryStorage implements IStorage {
  private products: Product[] = [
    {
      id: '1',
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
      isActive: true,
      features: ['Dishwasher safe', 'Microwave safe', 'Premium ceramic'],
      featuresBn: ['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক'],
      tags: ['love', 'couple', 'gift'],
      specifications: { material: 'ceramic', capacity: '350ml' },
      createdAt: new Date(),
    },
    {
      id: '2',
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
      isActive: true,
      features: ['Color changing', 'Heat sensitive', 'Premium ceramic'],
      featuresBn: ['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক'],
      tags: ['magic', 'surprise', 'gift'],
      specifications: { material: 'ceramic', capacity: '330ml' },
      createdAt: new Date(),
    },
    {
      id: '3',
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
      isActive: true,
      features: ['100% Cotton', 'Available in all sizes', 'Custom printing'],
      featuresBn: ['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং'],
      tags: ['couple', 'tshirt', 'romance'],
      specifications: { material: 'cotton', sizes: ['S', 'M', 'L', 'XL'] },
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'Premium Steel Water Bottle',
      nameBn: 'প্রিমিয়াম স্টিল ওয়াটার বোতল',
      description: 'Eco-friendly steel water bottle with custom design',
      descriptionBn: 'কাস্টম ডিজাইন সহ ইকো-ফ্রেন্ডলি স্টিল ওয়াটার বোতল',
      category: 'water-bottles',
      subcategory: 'steel-bottle',
      price: '800',
      originalPrice: '950',
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      isCustomizable: true,
      isFeatured: true,
      isActive: true,
      features: ['Stainless steel', 'Temperature retention', 'BPA free'],
      featuresBn: ['স্টেইনলেস স্টিল', 'তাপমাত্রা ধরে রাখে', 'বিপিএ মুক্ত'],
      tags: ['bottle', 'steel', 'eco-friendly'],
      specifications: { material: 'stainless steel', capacity: '500ml' },
      createdAt: new Date(),
    },
    {
      id: '5',
      name: 'Luxury Gift Hamper',
      nameBn: 'লাক্সারি গিফট হ্যাম্পার',
      description: 'Premium gift hamper with multiple items',
      descriptionBn: 'একাধিক আইটেম সহ প্রিমিয়াম গিফট হ্যাম্পার',
      category: 'premium-luxury-gift-hampers',
      subcategory: 'luxury-hamper',
      price: '2500',
      originalPrice: '3000',
      image: '/api/placeholder/300/300',
      images: ['/api/placeholder/300/300'],
      isCustomizable: false,
      isFeatured: true,
      isActive: true,
      features: ['Multiple items', 'Premium packaging', 'Perfect for gifts'],
      featuresBn: ['একাধিক আইটেম', 'প্রিমিয়াম প্যাকেজিং', 'উপহারের জন্য নিখুঁত'],
      tags: ['luxury', 'hamper', 'gift'],
      specifications: { items: 5, packaging: 'premium box' },
      createdAt: new Date(),
    }
  ];
  private orders: Order[] = [];
  private customDesigns: CustomDesign[] = [];
  private orderTimelineEntries: OrderTimeline[] = [];
  private admins: AdminUser[] = [];
  private promoOffers: PromoOffer[] = [
    {
      id: 'promo-1',
      title: 'Mega Sale 2024',
      titleBn: 'মেগা সেল ২০২৪',
      description: 'Get up to 50% off on all products!',
      descriptionBn: 'সকল পণ্যে ৫০% পর্যন্ত ছাড়!',
      discountPercentage: 50,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isActive: true,
      showAsPopup: true,
      image: '/api/placeholder/400/200',
      createdAt: new Date(),
    },
    {
      id: 'promo-2',
      title: 'New Year Special',
      titleBn: 'নববর্ষ স্পেশাল',
      description: 'Celebrate with custom designs!',
      descriptionBn: 'কাস্টম ডিজাইন দিয়ে উদযাপন করুন!',
      discountPercentage: 30,
      validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isActive: true,
      showAsPopup: false,
      image: '/api/placeholder/400/200',
      createdAt: new Date(),
    }
  ];
  private wishlistItems: Wishlist[] = [];

  async getProducts(): Promise<Product[]> {
    return this.products.filter(p => p.isActive);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.find(p => p.id === id && p.isActive);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const newProduct: Product = {
      id: randomUUID(),
      createdAt: new Date(),
      isActive: true,
      isCustomizable: false,
      isFeatured: false,
      images: [],
      features: [],
      featuresBn: [],
      tags: [],
      specifications: {},
      description: null,
      descriptionBn: null,
      subcategory: null,
      originalPrice: null,
      image: null,
      ...product,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = { ...this.products[index], ...product };
    return this.products[index];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products[index].isActive = false;
    return true;
  }

  async getOrders(): Promise<Order[]> {
    return this.orders.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.find(o => o.id === id);
  }

  async getOrderByTrackingId(trackingId: string): Promise<Order | null> {
    return this.orders.find(o => o.trackingId === trackingId) || null;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const trackingId = `TRX${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const newOrder: Order = {
      id: randomUUID(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      customerEmail: null,
      paymentNumber: null,
      paymentScreenshot: null,
      notes: null,
      deliveryCharge: '60',
      ...order,
      trackingId,
    };
    this.orders.push(newOrder);

    await this.addOrderTimelineEntry({
      orderId: newOrder.id,
      status: "pending",
      message: "অর্ডার গৃহীত হয়েছে",
      messageEn: "Order received",
    });

    return newOrder;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    
    this.orders[index] = { 
      ...this.orders[index], 
      status, 
      updatedAt: new Date() 
    };

    const statusMessages = {
      confirmed: { bn: "অর্ডার কনফার্ম হয়েছে", en: "Order confirmed" },
      processing: { bn: "প্রিন্টিং শুরু", en: "Printing started" },
      ready: { bn: "প্যাকেজিং সম্পন্ন", en: "Packaging completed" },
      shipped: { bn: "ডেলিভারির জন্য পাঠানো হয়েছে", en: "Shipped for delivery" },
      delivered: { bn: "ডেলিভার সম্পন্ন", en: "Delivered" },
    };

    const messages = statusMessages[status as keyof typeof statusMessages];
    if (messages) {
      await this.addOrderTimelineEntry({
        orderId: id,
        status,
        message: messages.bn,
        messageEn: messages.en,
      });
    }

    return this.orders[index];
  }

  async getCustomDesigns(orderId: string): Promise<CustomDesign[]> {
    return this.customDesigns.filter(d => d.orderId === orderId);
  }

  async createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign> {
    const newDesign: CustomDesign = {
      id: randomUUID(),
      createdAt: new Date(),
      orderId: null,
      designData: null,
      instructions: null,
      ...design,
    };
    this.customDesigns.push(newDesign);
    return newDesign;
  }

  async getOrderTimeline(orderId: string): Promise<OrderTimeline[]> {
    return this.orderTimelineEntries
      .filter(t => t.orderId === orderId)
      .sort((a, b) => (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0));
  }

  async addOrderTimelineEntry(entry: InsertOrderTimeline): Promise<OrderTimeline> {
    const newEntry: OrderTimeline = {
      id: randomUUID(),
      createdAt: new Date(),
      message: null,
      messageEn: null,
      ...entry,
    };
    this.orderTimelineEntries.push(newEntry);
    return newEntry;
  }

  async createOrderTimeline(entry: InsertOrderTimeline): Promise<OrderTimeline> {
    return this.addOrderTimelineEntry(entry);
  }

  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    return this.admins.find(a => a.username === username);
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin: AdminUser = {
      id: randomUUID(),
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      ...admin,
      password: hashedPassword,
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compare(password, admin.password);
  }

  // Promo Offers
  async getPromoOffers(): Promise<PromoOffer[]> {
    return this.promoOffers.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getActivePromoOffers(): Promise<PromoOffer[]> {
    return this.promoOffers.filter(offer => 
      offer.isActive && new Date(offer.validUntil) > new Date()
    );
  }

  async getPopupPromoOffers(): Promise<PromoOffer[]> {
    return this.promoOffers.filter(offer => 
      offer.isActive && offer.showAsPopup && new Date(offer.validUntil) > new Date()
    );
  }

  async createPromoOffer(offer: InsertPromoOffer): Promise<PromoOffer> {
    const newOffer: PromoOffer = {
      id: randomUUID(),
      createdAt: new Date(),
      isActive: true,
      showAsPopup: false,
      ...offer,
    };
    this.promoOffers.push(newOffer);
    return newOffer;
  }

  async updatePromoOffer(id: string, offer: Partial<InsertPromoOffer>): Promise<PromoOffer | undefined> {
    const index = this.promoOffers.findIndex(o => o.id === id);
    if (index === -1) return undefined;
    
    this.promoOffers[index] = { ...this.promoOffers[index], ...offer };
    return this.promoOffers[index];
  }

  async deletePromoOffer(id: string): Promise<boolean> {
    const index = this.promoOffers.findIndex(o => o.id === id);
    if (index === -1) return false;
    
    this.promoOffers.splice(index, 1);
    return true;
  }

  // Wishlist
  async getWishlist(userId: string): Promise<Wishlist[]> {
    return this.wishlistItems.filter(item => item.userId === userId);
  }

  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    // Check if already exists
    const existing = this.wishlistItems.find(item => 
      item.userId === userId && item.productId === productId
    );
    
    if (existing) return existing;

    const newWishlistItem: Wishlist = {
      id: randomUUID(),
      userId,
      productId,
      createdAt: new Date(),
    };
    this.wishlistItems.push(newWishlistItem);
    return newWishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const index = this.wishlistItems.findIndex(item => 
      item.userId === userId && item.productId === productId
    );
    
    if (index === -1) return false;
    
    this.wishlistItems.splice(index, 1);
    return true;
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    return this.wishlistItems.some(item => 
      item.userId === userId && item.productId === productId
    );
  }
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const result = await db.select().from(products).where(eq(products.isActive, true));
      return result;
    } catch (error) {
      console.warn("Database operation failed, falling back to memory storage");
      const memoryStorage = new MemoryStorage();
      return await memoryStorage.getProducts();
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(products).where(eq(products.id, id));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const result = await db.insert(products).values(product).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.update(products).set({ isActive: false }).where(eq(products.id, id)).returning();
    return result.length > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const result = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return result;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrderByTrackingId(trackingId: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.trackingId, trackingId));
    return result[0];
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const trackingId = `TRX${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const result = await db.insert(orders).values({
      ...order,
      trackingId,
    }).returning();

    // Add initial timeline entry
    await this.addOrderTimelineEntry({
      orderId: result[0].id,
      status: "pending",
      message: "অর্ডার গৃহীত হয়েছে",
      messageEn: "Order received",
    });

    return result[0];
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const result = await db.update(orders).set({ 
      status,
      updatedAt: new Date(),
    }).where(eq(orders.id, id)).returning();
    
    if (result[0]) {
      // Add timeline entry
      const statusMessages = {
        confirmed: { bn: "অর্ডার কনফার্ম হয়েছে", en: "Order confirmed" },
        processing: { bn: "প্রিন্টিং শুরু", en: "Printing started" },
        ready: { bn: "প্যাকেজিং সম্পন্ন", en: "Packaging completed" },
        shipped: { bn: "ডেলিভারির জন্য পাঠানো হয়েছে", en: "Shipped for delivery" },
        delivered: { bn: "ডেলিভার সম্পন্ন", en: "Delivered" },
      };

      const messages = statusMessages[status as keyof typeof statusMessages];
      if (messages) {
        await this.addOrderTimelineEntry({
          orderId: id,
          status,
          message: messages.bn,
          messageEn: messages.en,
        });
      }
    }

    return result[0];
  }

  // Custom Designs
  async getCustomDesigns(orderId: string): Promise<CustomDesign[]> {
    const result = await db.select().from(customDesigns).where(eq(customDesigns.orderId, orderId));
    return result;
  }

  async createCustomDesign(design: InsertCustomDesign): Promise<CustomDesign> {
    const result = await db.insert(customDesigns).values(design).returning();
    return result[0];
  }

  // Order Timeline
  async getOrderTimeline(orderId: string): Promise<OrderTimeline[]> {
    const result = await db.select().from(orderTimeline)
      .where(eq(orderTimeline.orderId, orderId))
      .orderBy(orderTimeline.createdAt);
    return result;
  }

  async addOrderTimelineEntry(entry: InsertOrderTimeline): Promise<OrderTimeline> {
    const result = await db.insert(orderTimeline).values(entry).returning();
    return result[0];
  }

  async createOrderTimeline(entry: InsertOrderTimeline): Promise<OrderTimeline> {
    return this.addOrderTimelineEntry(entry);
  }

  // Admin Users
  async getAdminByUsername(username: string): Promise<AdminUser | undefined> {
    const result = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return result[0];
  }

  async createAdmin(admin: InsertAdminUser): Promise<AdminUser> {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const result = await db.insert(adminUsers).values({
      ...admin,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async verifyAdminPassword(username: string, password: string): Promise<boolean> {
    const admin = await this.getAdminByUsername(username);
    if (!admin) return false;
    return bcrypt.compare(password, admin.password);
  }

  // Promo Offers
  async getPromoOffers(): Promise<PromoOffer[]> {
    const result = await db.select().from(promoOffers).orderBy(desc(promoOffers.createdAt));
    return result;
  }

  async getActivePromoOffers(): Promise<PromoOffer[]> {
    const result = await db.select().from(promoOffers)
      .where(and(eq(promoOffers.isActive, true)));
    return result;
  }

  async getPopupPromoOffers(): Promise<PromoOffer[]> {
    const result = await db.select().from(promoOffers)
      .where(and(eq(promoOffers.isActive, true), eq(promoOffers.showAsPopup, true)));
    return result;
  }

  async createPromoOffer(offer: InsertPromoOffer): Promise<PromoOffer> {
    const result = await db.insert(promoOffers).values(offer).returning();
    return result[0];
  }

  async updatePromoOffer(id: string, offer: Partial<InsertPromoOffer>): Promise<PromoOffer | undefined> {
    const result = await db.update(promoOffers).set(offer).where(eq(promoOffers.id, id)).returning();
    return result[0];
  }

  async deletePromoOffer(id: string): Promise<boolean> {
    const result = await db.delete(promoOffers).where(eq(promoOffers.id, id)).returning();
    return result.length > 0;
  }

  // Wishlist
  async getWishlist(userId: string): Promise<Wishlist[]> {
    const result = await db.select().from(wishlist).where(eq(wishlist.userId, userId));
    return result;
  }

  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    const result = await db.insert(wishlist).values({ userId, productId }).returning();
    return result[0];
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    const result = await db.delete(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)))
      .returning();
    return result.length > 0;
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const result = await db.select().from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.productId, productId)));
    return result.length > 0;
  }
}

export const storage = useMemoryStorage ? new MemoryStorage() : new DatabaseStorage();
