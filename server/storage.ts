import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq, desc, and } from "drizzle-orm";
import {
  products,
  orders,
  customDesigns,
  orderTimeline,
  adminUsers,
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
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("DATABASE_URL not provided, using memory storage for development");
  throw new Error("DATABASE_URL environment variable is required for database operations");
}

const client = postgres(connectionString);
const db = drizzle(client);

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
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(): Promise<Product[]> {
    const result = await db.select().from(products).where(eq(products.isActive, true));
    return result;
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
    const result = await db.update(products).set({ isActive: false }).where(eq(products.id, id));
    return result.rowCount > 0;
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
}

export const storage = new DatabaseStorage();
