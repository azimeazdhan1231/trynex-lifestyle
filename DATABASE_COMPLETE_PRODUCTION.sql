-- Trynex Lifestyle E-Commerce Database - Complete Production Schema
-- Execute this SQL in your Supabase SQL Editor

-- Drop existing tables if they exist (for fresh setup)
DROP TABLE IF EXISTS order_timeline CASCADE;
DROP TABLE IF EXISTS custom_designs CASCADE;
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS promo_offers CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Create products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT,
  description_bn TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  price TEXT NOT NULL,
  original_price TEXT,
  image TEXT,
  images TEXT[],
  is_customizable BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  features TEXT[],
  features_bn TEXT[],
  tags TEXT[],
  specifications JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  tracking_id TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  district TEXT NOT NULL,
  thana TEXT NOT NULL,
  address TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  payment_number TEXT,
  notes TEXT,
  items JSONB NOT NULL,
  total TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create promo_offers table
CREATE TABLE promo_offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_bn TEXT,
  description TEXT,
  description_bn TEXT,
  discount_percentage INTEGER,
  discount_amount TEXT,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  show_as_popup BOOLEAN DEFAULT false,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_timeline table
CREATE TABLE order_timeline (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  message_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create custom_designs table
CREATE TABLE custom_designs (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wishlist table
CREATE TABLE wishlist (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample products
INSERT INTO products (id, name, name_bn, description, description_bn, category, subcategory, price, original_price, image, images, is_customizable, is_featured, in_stock, is_active, features, features_bn, tags, specifications) VALUES
('1', 'Premium Love Mug', 'প্রিমিয়াম লাভ মগ', 'Beautiful ceramic mug perfect for couples', 'কাপলদের জন্য নিখুঁত সুন্দর সিরামিক মগ', 'mugs', 'love-mug', '550', '650', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, true, ARRAY['Dishwasher safe', 'Microwave safe', 'Premium ceramic'], ARRAY['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক'], ARRAY['love', 'couple', 'gift'], '{"material":"ceramic","capacity":"350ml"}'::jsonb),

('2', 'Magic Color Change Mug', 'ম্যাজিক কালার চেঞ্জ মগ', 'Color changing mug that reveals design when hot', 'গরম হলে ডিজাইন প্রকাশ করে এমন রঙ পরিবর্তনকারী মগ', 'mugs', 'magic-mug', '750', '850', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, true, ARRAY['Color changing', 'Heat sensitive', 'Premium ceramic'], ARRAY['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক'], ARRAY['magic', 'surprise', 'gift'], '{"material":"ceramic","capacity":"330ml"}'::jsonb),

('3', 'Custom Couple T-Shirt', 'কাস্টম কাপল টি-শার্ট', 'Comfortable couple t-shirt with custom design', 'কাস্টম ডিজাইন সহ আরামদায়ক কাপল টি-শার্ট', 'tshirts', 'couple-tshirt', '1100', '1300', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, true, ARRAY['100% Cotton', 'Available in all sizes', 'Custom printing'], ARRAY['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং'], ARRAY['couple', 'tshirt', 'romance'], '{"material":"cotton","sizes":["S","M","L","XL"]}'::jsonb),

('4', 'Premium Steel Water Bottle', 'প্রিমিয়াম স্টিল ওয়াটার বোতল', 'Eco-friendly steel water bottle with custom design', 'কাস্টম ডিজাইন সহ ইকো-ফ্রেন্ডলি স্টিল ওয়াটার বোতল', 'water-bottles', 'steel-bottle', '800', '950', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, true, ARRAY['Stainless steel', 'Temperature retention', 'BPA free'], ARRAY['স্টেইনলেস স্টিল', 'তাপমাত্রা ধরে রাখে', 'বিপিএ মুক্ত'], ARRAY['bottle', 'steel', 'eco-friendly'], '{"material":"stainless steel","capacity":"500ml"}'::jsonb),

('5', 'Luxury Gift Hamper', 'লাক্সারি গিফট হ্যাম্পার', 'Premium gift hamper with multiple items', 'একাধিক আইটেম সহ প্রিমিয়াম গিফট হ্যাম্পার', 'premium-luxury-gift-hampers', 'luxury-hamper', '2500', '3000', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], false, true, true, true, ARRAY['Multiple items', 'Premium packaging', 'Perfect for gifts'], ARRAY['একাধিক আইটেম', 'প্রিমিয়াম প্যাকেজিং', 'উপহারের জন্য নিখুঁত'], ARRAY['luxury', 'hamper', 'gift'], '{"items":5,"packaging":"premium box"}'::jsonb),

('6', 'Anniversary Special Mug', 'অ্যানিভার্সারি স্পেশাল মগ', 'Special ceramic mug for anniversary celebration', 'অ্যানিভার্সারি উদযাপনের জন্য বিশেষ সিরামিক মগ', 'mugs', 'anniversary-mug', '600', '700', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, true, ARRAY['Anniversary design', 'Premium quality', 'Gift wrapped'], ARRAY['অ্যানিভার্সারি ডিজাইন', 'প্রিমিয়াম কোয়ালিটি', 'গিফট র্যাপড'], ARRAY['anniversary', 'couple', 'celebration'], '{"material":"ceramic","capacity":"350ml"}'::jsonb),

('7', 'Personalized Phone Case', 'পার্সোনালাইজড ফোন কেস', 'Custom phone case with your design', 'আপনার ডিজাইন সহ কাস্টম ফোন কেস', 'phone-cases', 'custom-case', '450', '550', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, false, true, true, ARRAY['Durable material', 'Perfect fit', 'Custom printing'], ARRAY['টেকসই উপাদান', 'পারফেক্ট ফিট', 'কাস্টম প্রিন্টিং'], ARRAY['phone', 'case', 'custom'], '{"material":"silicone","compatibility":"all models"}'::jsonb),

('8', 'Custom Key Chain', 'কাস্টম কী চেইন', 'Personalized keychain with photo or text', 'ছবি বা টেক্সট সহ পার্সোনালাইজড কীচেইন', 'keychains', 'photo-keychain', '250', '300', '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, false, true, true, ARRAY['Metal finish', 'Photo quality print', 'Compact size'], ARRAY['মেটাল ফিনিশ', 'ফটো কোয়ালিটি প্রিন্ট', 'কমপ্যাক্ট সাইজ'], ARRAY['keychain', 'photo', 'gift'], '{"material":"metal","size":"small"}'::jsonb);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (id, username, password, role) VALUES 
('admin-1', 'admin', '$2b$10$Wq5/A9Cy1d7ro7ckJyzcfO0Jeslps2Q8OZz6008SzGqd9BpqZEO5a', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample promo offers
INSERT INTO promo_offers (id, title, title_bn, description, description_bn, discount_percentage, valid_until, is_active, show_as_popup, image) VALUES
('promo-1', 'Mega Sale 2024', 'মেগা সেল ২০২৪', 'Get 20% off on all products this month!', 'এই মাসে সব প্রোডাক্টে ২০% ছাড়!', 20, '2025-12-31 23:59:59', true, true, '/api/placeholder/400/200'),

('promo-2', 'Couple Special', 'কাপল স্পেশাল', 'Buy 2 mugs and get 1 free!', '২টি মগ কিনুন এবং ১টি ফ্রি পান!', 33, '2025-08-31 23:59:59', true, false, '/api/placeholder/400/200'),

('promo-3', 'New Year Offer', 'নববর্ষ অফার', 'Special discount for new year celebration', 'নববর্ষ উদযাপনের জন্য বিশেষ ছাড়', 15, '2025-04-30 23:59:59', true, false, '/api/placeholder/400/200');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_tracking ON orders(tracking_id);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_timeline_order ON order_timeline(order_id);
CREATE INDEX idx_promo_offers_active ON promo_offers(is_active);
CREATE INDEX idx_promo_offers_popup ON promo_offers(show_as_popup);

-- Create update trigger for products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_offers_updated_at BEFORE UPDATE ON promo_offers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Verification queries (run these to verify the setup)
-- SELECT 'Products count: ' || COUNT(*) FROM products;
-- SELECT 'Admin users count: ' || COUNT(*) FROM admin_users;
-- SELECT 'Promo offers count: ' || COUNT(*) FROM promo_offers;

COMMIT;