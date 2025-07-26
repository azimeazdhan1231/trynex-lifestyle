// Script to add real business products to database
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.ickclyevpbgmppqizfov:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

const client = postgres(connectionString, {
  max: 1,
  ssl: 'require',
});

const db = drizzle(client);

async function addProducts() {
  try {
    const products = [
      {
        name: 'Custom Love Mug',
        nameBn: 'কাস্টম লাভ মগ',
        description: 'Beautiful personalized ceramic mug perfect for couples and special occasions',
        descriptionBn: 'কাপল এবং বিশেষ অনুষ্ঠানের জন্য নিখুঁত ব্যক্তিগতকৃত সিরামিক মগ',
        category: 'mugs',
        subcategory: 'love-mug',
        price: '550',
        originalPrice: '650',
        image: '/api/placeholder/300/300',
        images: ['/api/placeholder/300/300'],
        isCustomizable: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        features: ['Dishwasher safe', 'Microwave safe', 'Premium ceramic', 'Photo quality printing'],
        featuresBn: ['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক', 'ফটো কোয়ালিটি প্রিন্টিং'],
        tags: ['love', 'couple', 'personalized', 'gift'],
        specifications: { material: 'ceramic', capacity: '350ml', height: '9.5cm', diameter: '8cm' }
      },
      {
        name: 'Magic Color Change Mug',
        nameBn: 'ম্যাজিক কালার চেঞ্জ মগ',
        description: 'Amazing heat-sensitive mug that reveals your custom design when hot liquid is added',
        descriptionBn: 'গরম তরল যোগ করলে আপনার কাস্টম ডিজাইন প্রকাশ করে এমন অদ্ভুত তাপ-সংবেদনশীল মগ',
        category: 'mugs',
        subcategory: 'magic-mug',
        price: '750',
        originalPrice: '850',
        image: '/api/placeholder/300/300',
        images: ['/api/placeholder/300/300'],
        isCustomizable: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        features: ['Color changing technology', 'Premium ceramic', 'Photo quality printing', 'Dishwasher safe'],
        featuresBn: ['কালার চেঞ্জিং প্রযুক্তি', 'প্রিমিয়াম সিরামিক', 'ফটো কোয়ালিটি প্রিন্টিং', 'ডিশওয়াশার নিরাপদ'],
        tags: ['magic', 'color-change', 'personalized', 'unique'],
        specifications: { material: 'ceramic', capacity: '350ml', technology: 'thermochromic' }
      },
      {
        name: 'Custom Couple T-Shirt Set',
        nameBn: 'কাস্টম কাপল টি-শার্ট সেট',
        description: 'Matching personalized t-shirts for couples with your photos and names',
        descriptionBn: 'আপনার ছবি এবং নাম সহ কাপলদের জন্য ম্যাচিং ব্যক্তিগতকৃত টি-শার্ট',
        category: 'tshirts',
        subcategory: 'couple-tshirt',
        price: '1200',
        originalPrice: '1400',
        image: '/api/placeholder/300/300',
        images: ['/api/placeholder/300/300'],
        isCustomizable: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        features: ['100% cotton', 'DTG printing', 'Unisex fit', 'Pre-shrunk fabric'],
        featuresBn: ['১০০% কটন', 'ডিটিজি প্রিন্টিং', 'ইউনিসেক্স ফিট', 'প্রি-শ্রাঙ্ক ফ্যাব্রিক'],
        tags: ['couple', 'tshirt', 'matching', 'personalized'],
        specifications: { material: 'cotton', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['white', 'black', 'red', 'blue'] }
      },
      {
        name: 'Premium Water Bottle',
        nameBn: 'প্রিমিয়াম ওয়াটার বোতল',
        description: 'Stainless steel insulated water bottle with custom engraving',
        descriptionBn: 'কাস্টম খোদাই সহ স্টেইনলেস স্টিল ইনসুলেটেড ওয়াটার বোতল',
        category: 'waterBottles',
        subcategory: 'steel-bottle',
        price: '800',
        originalPrice: '950',
        image: '/api/placeholder/300/300',
        images: ['/api/placeholder/300/300'],
        isCustomizable: true,
        isFeatured: true,
        isActive: true,
        inStock: true,
        features: ['Stainless steel', '24h cold/12h hot', 'Leak proof', 'Custom engraving'],
        featuresBn: ['স্টেইনলেস স্টিল', '২৪ঘ ঠান্ডা/১২ঘ গরম', 'লিক প্রুফ', 'কাস্টম খোদাই'],
        tags: ['water-bottle', 'steel', 'insulated', 'eco-friendly'],
        specifications: { material: 'stainless steel', capacity: '750ml', insulation: 'double wall' }
      }
    ];

    console.log('Adding products to database...');
    
    for (const product of products) {
      await db.execute(`
        INSERT INTO products (name, "nameBn", description, "descriptionBn", category, subcategory, price, "originalPrice", image, images, "isCustomizable", "isFeatured", "isActive", "inStock", features, "featuresBn", tags, specifications)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
        ON CONFLICT (name) DO NOTHING
      `, [
        product.name,
        product.nameBn,
        product.description,
        product.descriptionBn,
        product.category,
        product.subcategory,
        product.price,
        product.originalPrice,
        product.image,
        JSON.stringify(product.images),
        product.isCustomizable,
        product.isFeatured,
        product.isActive,
        product.inStock,
        JSON.stringify(product.features),
        JSON.stringify(product.featuresBn),
        JSON.stringify(product.tags),
        JSON.stringify(product.specifications)
      ]);
    }

    console.log('✅ Products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
}

addProducts();