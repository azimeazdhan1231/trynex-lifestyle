import { pgTable, text, integer, decimal, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Products table with expanded categories
export const products = pgTable("products", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  nameBn: text("name_bn").notNull(),
  description: text("description"),
  descriptionBn: text("description_bn"),
  category: text("category").notNull(), // mugs, tshirts, keychains, water-bottles, gift-for-him, etc.
  subcategory: text("subcategory"), // love-mug, magic-mug, etc.
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  image: text("image"),
  images: text("images").array().default([]),
  isCustomizable: boolean("is_customizable").default(false),
  isFeatured: boolean("is_featured").default(false),
  inStock: boolean("in_stock").default(true),
  features: text("features").array().default([]),
  featuresBn: text("features_bn").array().default([]),
  tags: text("tags").array().default([]),
  specifications: jsonb("specifications").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  trackingId: text("tracking_id").notNull().unique(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  district: text("district").notNull(),
  thana: text("thana").notNull(),
  address: text("address").notNull(),
  items: jsonb("items").notNull(), // Array of cart items
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  deliveryCharge: decimal("delivery_charge", { precision: 10, scale: 2 }).default("60"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentNumber: text("payment_number"),
  paymentScreenshot: text("payment_screenshot"),
  status: text("status").notNull().default("pending"), // pending, confirmed, processing, ready, shipped, delivered
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Custom designs table for custom design page
export const customDesigns = pgTable("custom_designs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").references(() => orders.id),
  productType: text("product_type").notNull(), // printed-mug, water-tumbler, t-shirt, picture-frame, wallet, custom-letter
  designFile: text("design_file").notNull(),
  designData: jsonb("design_data"), // Canvas data for positioning, rotation, etc.
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Order timeline for tracking
export const orderTimeline = pgTable("order_timeline", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  orderId: text("order_id").references(() => orders.id).notNull(),
  status: text("status").notNull(),
  message: text("message"),
  messageEn: text("message_en"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin users
export const adminUsers = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").unique().notNull(),
  password: text("password").notNull(), // hashed
  role: text("role").notNull().default("admin"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas
export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const insertCustomDesignSchema = createInsertSchema(customDesigns);
export const selectCustomDesignSchema = createSelectSchema(customDesigns);
export type InsertCustomDesign = z.infer<typeof insertCustomDesignSchema>;
export type CustomDesign = typeof customDesigns.$inferSelect;

export const insertOrderTimelineSchema = createInsertSchema(orderTimeline);
export const selectOrderTimelineSchema = createSelectSchema(orderTimeline);
export type InsertOrderTimeline = z.infer<typeof insertOrderTimelineSchema>;
export type OrderTimeline = typeof orderTimeline.$inferSelect;

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

// Product categories for the expanded catalog
export const PRODUCT_CATEGORIES = {
  mugs: {
    id: 'mugs',
    name: 'Mugs',
    nameBn: 'প্রিমিয়াম সিরামিক মগ',
    priceFrom: 550,
    subcategories: ['love-mug', 'magic-mug', 'ceramic-mug', 'custom-mug']
  },
  tshirts: {
    id: 'tshirts',
    name: 'T-Shirts',
    nameBn: 'আরামদায়ক টি-শার্ট',
    priceFrom: 550,
    subcategories: ['custom-tshirt', 'couple-tshirt', 'kids-tshirt']
  },
  keychains: {
    id: 'keychains',
    name: 'Keychains',
    nameBn: 'স্টাইলিশ চাবির চেইন',
    priceFrom: 400,
    subcategories: ['metal-keychain', 'acrylic-keychain', 'custom-keychain']
  },
  waterBottles: {
    id: 'water-bottles',
    name: 'Water Bottles',
    nameBn: 'ইকো-ফ্রেন্ডলি বোতল',
    priceFrom: 800,
    subcategories: ['steel-bottle', 'glass-bottle', 'custom-bottle']
  },
  giftForHim: {
    id: 'gift-for-him',
    name: 'Gift for Him',
    nameBn: '🎁 স্পেশাল',
    priceFrom: 600,
    subcategories: ['wallet', 'watch', 'accessories']
  },
  giftForHer: {
    id: 'gift-for-her',
    name: 'Gift for Her',
    nameBn: '💝 এক্সক্লুসিভ',
    priceFrom: 550,
    subcategories: ['jewelry', 'accessories', 'beauty']
  },
  giftForParents: {
    id: 'gift-for-parents',
    name: 'Gift for Parents',
    nameBn: '❤️ ভালোবাসা',
    priceFrom: 700,
    subcategories: ['photo-frame', 'customized-gifts']
  },
  giftsForBabies: {
    id: 'gifts-for-babies',
    name: 'Gifts for Babies',
    nameBn: '🍼 সেফ',
    priceFrom: 450,
    subcategories: ['baby-mug', 'baby-clothes', 'toys']
  },
  forCouple: {
    id: 'for-couple',
    name: 'For Couple',
    nameBn: '💑 রোমান্টিক',
    priceFrom: 1100,
    subcategories: ['couple-mug', 'couple-tshirt', 'couple-accessories']
  },
  premiumLuxuryGiftHampers: {
    id: 'premium-luxury-gift-hampers',
    name: 'Premium Luxury Gift Hampers',
    nameBn: '🎁 লাক্সারি',
    priceFrom: 2000,
    subcategories: ['luxury-hamper', 'premium-collection']
  },
  chocolatesFlowers: {
    id: 'chocolates-flowers',
    name: 'Chocolates & Flowers',
    nameBn: '🍫🌹 রোমান্টিক',
    priceFrom: 800,
    subcategories: ['chocolate-box', 'flower-arrangement', 'combo-pack']
  }
} as const;

// Custom design product types
export const CUSTOM_DESIGN_PRODUCTS = {
  'printed-mug': { name: 'Printed Mug', nameBn: 'প্রিন্টেড মগ', price: 550 },
  'water-tumbler': { name: 'Water Tumbler', nameBn: 'ওয়াটার টাম্বলার', price: 800 },
  't-shirt': { name: 'T-Shirt', nameBn: 'টি-শার্ট', price: 550 },
  'picture-frame': { name: 'Picture Frame', nameBn: 'ছবির ফ্রেম', price: 700 },
  'wallet': { name: 'Wallet', nameBn: 'ওয়ালেট', price: 900 },
  'custom-letter': { name: 'Custom Letter', nameBn: 'কাস্টম চিঠি', price: 400 }
} as const;