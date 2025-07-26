-- Complete SQL Script to Populate Trynex Lifestyle Database
-- Run this in your Supabase SQL Editor

-- First, let's ensure the database schema is correct
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add in_stock column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'in_stock') THEN
        ALTER TABLE products ADD COLUMN in_stock boolean DEFAULT true;
    END IF;
    
    -- Ensure created_at exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'created_at') THEN
        ALTER TABLE products ADD COLUMN created_at timestamp DEFAULT NOW();
    END IF;
    
    -- Update any missing columns in orders table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_name') THEN
        ALTER TABLE orders ADD COLUMN customer_name text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_phone') THEN
        ALTER TABLE orders ADD COLUMN customer_phone text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'customer_email') THEN
        ALTER TABLE orders ADD COLUMN customer_email text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'district') THEN
        ALTER TABLE orders ADD COLUMN district text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'thana') THEN
        ALTER TABLE orders ADD COLUMN thana text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'address') THEN
        ALTER TABLE orders ADD COLUMN address text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'items') THEN
        ALTER TABLE orders ADD COLUMN items jsonb NOT NULL DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'subtotal') THEN
        ALTER TABLE orders ADD COLUMN subtotal decimal(10,2) NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'delivery_charge') THEN
        ALTER TABLE orders ADD COLUMN delivery_charge decimal(10,2) DEFAULT 60;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'total') THEN
        ALTER TABLE orders ADD COLUMN total decimal(10,2) NOT NULL DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_method') THEN
        ALTER TABLE orders ADD COLUMN payment_method text NOT NULL DEFAULT '';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'payment_number') THEN
        ALTER TABLE orders ADD COLUMN payment_number text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'notes') THEN
        ALTER TABLE orders ADD COLUMN notes text;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'updated_at') THEN
        ALTER TABLE orders ADD COLUMN updated_at timestamp DEFAULT NOW();
    END IF;
END $$;

-- Clear existing data (optional - remove if you want to keep existing data)
DELETE FROM order_timeline;
DELETE FROM custom_designs;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM admin_users;

-- Insert sample products (excluding id to let it auto-generate)
INSERT INTO products (
    name, 
    name_bn, 
    description, 
    description_bn, 
    category, 
    subcategory, 
    price, 
    original_price, 
    image, 
    images, 
    is_customizable, 
    is_featured, 
    in_stock,
    features, 
    features_bn, 
    tags, 
    specifications
) VALUES 
(
    'Premium Love Mug',
    'প্রিমিয়াম লাভ মগ',
    'Beautiful ceramic mug perfect for couples with custom design options',
    'কাপলদের জন্য কাস্টম ডিজাইন অপশন সহ নিখুঁত সুন্দর সিরামিক মগ',
    'mugs',
    'love-mug',
    '550',
    '650',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300', '/api/placeholder/300/301'],
    true,
    true,
    true,
    ARRAY['Dishwasher safe', 'Microwave safe', 'Premium ceramic', 'Custom design printing'],
    ARRAY['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক', 'কাস্টম ডিজাইন প্রিন্টিং'],
    ARRAY['love', 'couple', 'gift', 'romance'],
    '{"material": "ceramic", "capacity": "350ml", "color": "white", "printArea": "both_sides"}'::jsonb
),
(
    'Magic Color Change Mug',
    'ম্যাজিক কালার চেঞ্জ মগ',
    'Amazing color changing mug that reveals your custom design when filled with hot liquid',
    'গরম তরল দিয়ে ভরলে আপনার কাস্টম ডিজাইন প্রকাশ করে এমন অবিশ্বাস্য রঙ পরিবর্তনকারী মগ',
    'mugs',
    'magic-mug',
    '750',
    '850',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300', '/api/placeholder/300/302'],
    true,
    true,
    true,
    ARRAY['Color changing technology', 'Heat sensitive coating', 'Premium ceramic base', 'Custom design reveal'],
    ARRAY['রঙ পরিবর্তনকারী প্রযুক্তি', 'তাপ সংবেদনশীল আবরণ', 'প্রিমিয়াম সিরামিক বেস', 'কাস্টম ডিজাইন প্রকাশ'],
    ARRAY['magic', 'surprise', 'gift', 'unique'],
    '{"material": "ceramic", "capacity": "330ml", "color": "black_to_white", "technology": "thermochromic"}'::jsonb
),
(
    'Custom Couple T-Shirt Set',
    'কাস্টম কাপল টি-শার্ট সেট',
    'Comfortable matching couple t-shirts with your custom design and text',
    'আপনার কাস্টম ডিজাইন এবং টেক্সট সহ আরামদায়ক ম্যাচিং কাপল টি-শার্ট',
    'tshirts',
    'couple-tshirt',
    '1100',
    '1300',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300', '/api/placeholder/300/303'],
    true,
    true,
    true,
    ARRAY['100% Cotton fabric', 'Available in all sizes', 'High-quality printing', 'Matching pair included'],
    ARRAY['১০০% কটন ফ্যাব্রিক', 'সব সাইজে পাওয়া যায়', 'উচ্চ মানের প্রিন্টিং', 'ম্যাচিং জোড়া অন্তর্ভুক্ত'],
    ARRAY['couple', 'tshirt', 'romance', 'matching'],
    '{"material": "cotton", "sizes": ["S", "M", "L", "XL", "XXL"], "colors": ["white", "black", "navy"], "quantity": 2}'::jsonb
),
(
    'Premium Steel Water Bottle',
    'প্রিমিয়াম স্টিল ওয়াটার বোতল',
    'Eco-friendly stainless steel water bottle with custom engraving options',
    'কাস্টম খোদাই অপশন সহ ইকো-ফ্রেন্ডলি স্টেইনলেস স্টিল ওয়াটার বোতল',
    'water-bottles',
    'steel-bottle',
    '800',
    '950',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300', '/api/placeholder/300/304'],
    true,
    true,
    true,
    ARRAY['Stainless steel 304 grade', 'Temperature retention up to 12 hours', 'BPA free', 'Leak proof design'],
    ARRAY['স্টেইনলেস স্টিল ৩০৪ গ্রেড', '১২ ঘন্টা পর্যন্ত তাপমাত্রা ধরে রাখে', 'বিপিএ মুক্ত', 'লিক প্রুফ ডিজাইন'],
    ARRAY['bottle', 'steel', 'eco-friendly', 'health'],
    '{"material": "stainless_steel_304", "capacity": "500ml", "colors": ["silver", "black", "blue"], "insulation": "double_wall"}'::jsonb
),
(
    'Luxury Gift Hamper Deluxe',
    'লাক্সারি গিফট হ্যাম্পার ডিলাক্স',
    'Premium gift hamper with multiple customized items perfect for special occasions',
    'বিশেষ অনুষ্ঠানের জন্য নিখুঁত একাধিক কাস্টমাইজড আইটেম সহ প্রিমিয়াম গিফট হ্যাম্পার',
    'premium-luxury-gift-hampers',
    'luxury-hamper',
    '2500',
    '3000',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300', '/api/placeholder/300/305'],
    false,
    true,
    true,
    ARRAY['5 premium items included', 'Luxury packaging', 'Perfect for gifting', 'Customizable item selection'],
    ARRAY['৫টি প্রিমিয়াম আইটেম অন্তর্ভুক্ত', 'লাক্সারি প্যাকেজিং', 'উপহারের জন্য নিখুঁত', 'কাস্টমাইজেবল আইটেম নির্বাচন'],
    ARRAY['luxury', 'hamper', 'gift', 'premium'],
    '{"items": 5, "packaging": "premium_wooden_box", "includes": ["mug", "tshirt", "bottle", "keychain", "photo_frame"]}'::jsonb
),
(
    'Personalized Photo Frame',
    'ব্যক্তিগতকৃত ফটো ফ্রেম',
    'Beautiful wooden photo frame with custom engraving for your precious memories',
    'আপনার মূল্যবান স্মৃতির জন্য কাস্টম খোদাই সহ সুন্দর কাঠের ফটো ফ্রেম',
    'home-decor',
    'photo-frame',
    '450',
    '550',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300'],
    true,
    false,
    true,
    ARRAY['Premium wood material', 'Custom engraving available', 'Multiple sizes', 'Glass protection'],
    ARRAY['প্রিমিয়াম কাঠের উপাদান', 'কাস্টম খোদাই উপলব্ধ', 'একাধিক সাইজ', 'কাচের সুরক্ষা'],
    ARRAY['frame', 'photo', 'memory', 'decor'],
    '{"material": "wood", "sizes": ["4x6", "5x7", "8x10"], "glass": "anti_glare", "orientation": "both"}'::jsonb
),
(
    'Custom Keychain Collection',
    'কাস্টম কিচেইন কালেকশন',
    'Durable metal keychain with your custom design, name, or message',
    'আপনার কাস্টম ডিজাইন, নাম বা বার্তা সহ টেকসই ধাতব কিচেইন',
    'accessories',
    'keychain',
    '200',
    '250',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300'],
    true,
    false,
    true,
    ARRAY['Durable metal construction', 'Laser engraving', 'Multiple shapes available', 'Rust resistant'],
    ARRAY['টেকসই ধাতব নির্মাণ', 'লেজার খোদাই', 'একাধিক আকার উপলব্ধ', 'মরিচা প্রতিরোধী'],
    ARRAY['keychain', 'accessory', 'metal', 'portable'],
    '{"material": "stainless_steel", "shapes": ["rectangle", "circle", "heart"], "engraving": "laser", "chain_length": "3cm"}'::jsonb
),
(
    'Premium Ceramic Dinner Set',
    'প্রিমিয়াম সিরামিক ডিনার সেট',
    'Complete dinner set with custom family name or design printing',
    'কাস্টম পারিবারিক নাম বা ডিজাইন প্রিন্টিং সহ সম্পূর্ণ ডিনার সেট',
    'home-decor',
    'dinner-set',
    '3500',
    '4200',
    '/api/placeholder/300/300',
    ARRAY['/api/placeholder/300/300'],
    true,
    true,
    true,
    ARRAY['16-piece complete set', 'Premium ceramic material', 'Dishwasher and microwave safe', 'Custom design printing'],
    ARRAY['১৬ পিস সম্পূর্ণ সেট', 'প্রিমিয়াম সিরামিক উপাদান', 'ডিশওয়াশার এবং মাইক্রোওয়েভ নিরাপদ', 'কাস্টম ডিজাইন প্রিন্টিং'],
    ARRAY['dinner', 'ceramic', 'family', 'kitchen'],
    '{"pieces": 16, "material": "premium_ceramic", "includes": ["plates", "bowls", "cups", "saucers"], "service": "4_person"}'::jsonb
);

-- Insert admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, role) VALUES 
('admin', '$2b$10$K8Z7VlZ8DQB7GhP7LQpCLerK8P2kY7H6EwY7D7B7H7E7F7G7H7I7J7K', 'admin');

-- Insert sample order for demonstration
INSERT INTO orders (
    tracking_id,
    customer_name,
    customer_phone,
    customer_email,
    district,
    thana,
    address,
    items,
    subtotal,
    delivery_charge,
    total,
    payment_method,
    payment_number,
    status,
    notes
) VALUES (
    'TRX-' || EXTRACT(epoch FROM NOW())::bigint,
    'আমিনুল ইসলাম',
    '+8801712345678',
    'aminul@example.com',
    'dhaka',
    'gulshan',
    '১২৩, মেইন স্ট্রিট, গুলশান-১, ঢাকা',
    '[{"id": "1", "name": "Premium Love Mug", "quantity": 2, "price": 550, "customization": "Love You Forever"}]'::jsonb,
    1100.00,
    60.00,
    1160.00,
    'bkash',
    '01712345678',
    'confirmed',
    'দয়া করে সাবধানে প্যাক করুন'
);

-- Verify data insertion
SELECT 'Products inserted: ' || COUNT(*) FROM products;
SELECT 'Admin users inserted: ' || COUNT(*) FROM admin_users;
SELECT 'Sample orders inserted: ' || COUNT(*) FROM orders;

-- Show sample data
SELECT id, name, name_bn, price, category FROM products LIMIT 5;