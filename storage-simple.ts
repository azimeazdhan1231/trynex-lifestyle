import { db } from "./db";

export interface Category {
  id: number;
  name: string;
  nameBn: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: number;
  name: string;
  nameBn: string;
  slug: string;
  description: string;
  descriptionBn: string;
  price: string;
  originalPrice: string | null;
  image: string;
  categoryId: number;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  paymentMethod: string;
  totalAmount: string;
  status: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  customText: string | null;
  customColor: string | null;
  customSize: string | null;
  customNotes: string | null;
  price: string;
  product?: Product;
}

class SimpleStorage {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private contacts: any[] = [];
  private newsletters: any[] = [];
  private nextId = 1;
  private nextOrderId = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize categories
    const categories = [
      { name: "Custom T-Shirts", nameBn: "কাস্টম টি-শার্ট", slug: "custom-t-shirts" },
      { name: "Mugs", nameBn: "মাগ", slug: "mugs" },
      { name: "Hoodies", nameBn: "হুডি", slug: "hoodies" },
      { name: "Caps", nameBn: "ক্যাপ", slug: "caps" },
      { name: "Phone Cases", nameBn: "ফোন কেস", slug: "phone-cases" },
      { name: "Keychains", nameBn: "চাবির রিং", slug: "keychains" },
      { name: "Pillows", nameBn: "বালিশ", slug: "pillows" },
      { name: "Tumblers", nameBn: "টাম্বলার", slug: "tumblers" }
    ];

    categories.forEach(cat => {
      this.categories.push({
        ...cat,
        id: this.nextId++,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Initialize products
    const products = [
      // Custom T-Shirts
      {
        name: "Cotton Premium T-Shirt",
        nameBn: "কটন প্রিমিয়াম টি-শার্ট",
        slug: "cotton-premium-t-shirt",
        description: "High-quality cotton t-shirt with custom design printing",
        descriptionBn: "উচ্চ মানের কটন টি-শার্ট কাস্টম ডিজাইন প্রিন্টিং সহ",
        price: "450",
        originalPrice: "600",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        categoryId: 1,
        isFeatured: true,
        tags: ["cotton", "custom", "premium"]
      },
      {
        name: "Drop Shoulder Design T-Shirt",
        nameBn: "ড্রপ শোল্ডার ডিজাইন টি-শার্ট",
        slug: "drop-shoulder-design-t-shirt",
        description: "Trendy drop shoulder style with custom graphics",
        descriptionBn: "কাস্টম গ্রাফিক্স সহ ট্রেন্ডি ড্রপ শোল্ডার স্টাইল",
        price: "550",
        originalPrice: "700",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400",
        categoryId: 1,
        isFeatured: true,
        tags: ["drop-shoulder", "trendy", "custom"]
      },
      {
        name: "Farewell Memory T-Shirt",
        nameBn: "বিদায় স্মৃতি টি-শার্ট",
        slug: "farewell-memory-t-shirt",
        description: "Perfect for school farewell and graduation memories",
        descriptionBn: "স্কুল বিদায় এবং গ্র্যাজুয়েশন স্মৃতির জন্য পারফেক্ট",
        price: "500",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1583743814966-8936f37f743e?w=400",
        categoryId: 1,
        isFeatured: false,
        tags: ["farewell", "graduation", "memory"]
      },
      
      // Mugs
      {
        name: "Love Quote Coffee Mug",
        nameBn: "ভালোবাসার উক্তি কফি মাগ",
        slug: "love-quote-coffee-mug",
        description: "Beautiful ceramic mug with romantic quotes",
        descriptionBn: "রোমান্টিক উক্তি সহ সুন্দর সিরামিক মাগ",
        price: "350",
        originalPrice: "450",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=400",
        categoryId: 2,
        isFeatured: true,
        tags: ["love", "quotes", "ceramic"]
      },
      {
        name: "Mother's Day Special Mug",
        nameBn: "মা দিবস বিশেষ মাগ",
        slug: "mothers-day-special-mug",
        description: "Special mug to show love for your mother",
        descriptionBn: "আপনার মায়ের প্রতি ভালোবাসা প্রকাশের বিশেষ মাগ",
        price: "400",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400",
        categoryId: 2,
        isFeatured: true,
        tags: ["mother", "love", "special"]
      },
      {
        name: "Father's Day Gift Mug",
        nameBn: "বাবা দিবস উপহার মাগ",
        slug: "fathers-day-gift-mug",
        description: "Perfect gift mug for your beloved father",
        descriptionBn: "আপনার প্রিয় বাবার জন্য নিখুঁত উপহার মাগ",
        price: "400",
        originalPrice: null,
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        categoryId: 2,
        isFeatured: false,
        tags: ["father", "gift", "love"]
      },

      // Hoodies
      {
        name: "Premium Cotton Hoodie",
        nameBn: "প্রিমিয়াম কটন হুডি",
        slug: "premium-cotton-hoodie",
        description: "Comfortable and stylish hoodie with custom printing",
        descriptionBn: "কাস্টম প্রিন্টিং সহ আরামদায়ক এবং স্টাইলিশ হুডি",
        price: "1200",
        originalPrice: "1500",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
        categoryId: 3,
        isFeatured: true,
        tags: ["hoodie", "cotton", "comfortable"]
      },

      // Caps
      {
        name: "Custom Baseball Cap",
        nameBn: "কাস্টম বেসবল ক্যাপ",
        slug: "custom-baseball-cap",
        description: "Classic baseball cap with embroidered design",
        descriptionBn: "এমব্রয়ডার করা ডিজাইন সহ ক্লাসিক বেসবল ক্যাপ",
        price: "300",
        originalPrice: "400",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400",
        categoryId: 4,
        isFeatured: false,
        tags: ["cap", "baseball", "embroidered"]
      }
    ];

    products.forEach(prod => {
      this.products.push({
        ...prod,
        id: this.nextId++,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.categories;
  }

  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    const category: Category = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }

  // Products
  async getProducts(filters?: {
    categoryId?: number;
    isFeatured?: boolean;
    limit?: number;
    search?: string;
  }): Promise<Product[]> {
    let filtered = [...this.products];

    if (filters?.categoryId) {
      filtered = filtered.filter(p => p.categoryId === filters.categoryId);
    }

    if (filters?.isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === filters.isFeatured);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.nameBn.includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  async getProduct(id: number): Promise<Product | null> {
    return this.products.find(p => p.id === id) || null;
  }

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product: Product = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.products.findIndex(p => p.id === id);
    if (index > -1) {
      this.products.splice(index, 1);
    }
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    // Populate product details for order items
    return this.orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: this.products.find(p => p.id === item.productId)
      }))
    }));
  }

  async getOrder(id: number): Promise<Order | null> {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;

    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        product: this.products.find(p => p.id === item.productId)
      }))
    };
  }

  async createOrder(orderData: Omit<Order, 'id' | 'items' | 'createdAt' | 'updatedAt'>, items: Omit<OrderItem, 'id' | 'orderId'>[]): Promise<Order> {
    const order: Order = {
      ...orderData,
      id: this.nextOrderId++,
      items: items.map((item, index) => ({
        ...item,
        id: this.nextId++,
        orderId: this.nextOrderId - 1,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.push(order);
    return order;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | null> {
    const order = this.orders.find(o => o.id === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date();
    return order;
  }

  // Contact
  async createContact(data: any): Promise<any> {
    const contact = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.contacts.push(contact);
    return contact;
  }

  // Newsletter
  async subscribeNewsletter(data: any): Promise<any> {
    // Check if email already exists
    const existing = this.newsletters.find(n => n.email === data.email);
    if (existing) {
      throw new Error("Email already subscribed");
    }

    const subscription = {
      ...data,
      id: this.nextId++,
      createdAt: new Date(),
    };
    this.newsletters.push(subscription);
    return subscription;
  }

  // Blog (placeholder)
  async getBlogPosts(filters?: any): Promise<any[]> {
    return [];
  }

  async getBlogPostBySlug(slug: string): Promise<any | null> {
    return null;
  }
}

export const storage = new SimpleStorage();