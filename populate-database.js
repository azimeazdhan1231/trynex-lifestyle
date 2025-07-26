import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { products } from './shared/schema.js';

const connectionString = "postgresql://postgres.ickclyevpbgmppqizfov:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres";

const client = postgres(connectionString, { ssl: 'require' });
const db = drizzle(client);

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
  },
  {
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
    features: ['Stainless steel', 'Temperature retention', 'BPA free'],
    featuresBn: ['স্টেইনলেস স্টিল', 'তাপমাত্রা ধরে রাখে', 'বিপিএ মুক্ত'],
    tags: ['bottle', 'steel', 'eco-friendly'],
    specifications: { material: 'stainless steel', capacity: '500ml' }
  },
  {
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
    features: ['Multiple items', 'Premium packaging', 'Perfect for gifts'],
    featuresBn: ['একাধিক আইটেম', 'প্রিমিয়াম প্যাকেজিং', 'উপহারের জন্য নিখুঁত'],
    tags: ['luxury', 'hamper', 'gift'],
    specifications: { items: 5, packaging: 'premium box' }
  }
];

console.log('Populating database with sample products...');

try {
  for (const product of sampleProducts) {
    await db.insert(products).values(product);
    console.log(`Added product: ${product.name}`);
  }
  console.log('Database populated successfully!');
} catch (error) {
  console.error('Error populating database:', error);
} finally {
  await client.end();
}