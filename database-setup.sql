-- Complete SQL Database Setup for Trynex Bengali E-commerce Platform
-- This script creates all necessary tables with proper relationships and indexes

-- Drop existing tables if they exist (in correct order to avoid foreign key constraints)
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS order_timeline CASCADE;
DROP TABLE IF EXISTS custom_designs CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS promo_offers CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table with expanded categories
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    description TEXT,
    description_bn TEXT,
    category TEXT NOT NULL, -- mugs, tshirts, keychains, water-bottles, gift-for-him, etc.
    subcategory TEXT, -- love-mug, magic-mug, etc.
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image TEXT,
    images TEXT[] DEFAULT '{}',
    is_customizable BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    features TEXT[] DEFAULT '{}',
    features_bn TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tracking_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    district TEXT NOT NULL,
    thana TEXT NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL, -- Array of cart items
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_number TEXT,
    payment_screenshot TEXT,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, processing, ready, shipped, delivered
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom designs table for custom design page
CREATE TABLE custom_designs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT REFERENCES orders(id),
    product_type TEXT NOT NULL, -- printed-mug, water-tumbler, t-shirt, picture-frame, wallet, custom-letter
    design_file TEXT NOT NULL,
    design_data JSONB, -- Canvas data for positioning, rotation, etc.
    instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order timeline for tracking
CREATE TABLE order_timeline (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT REFERENCES orders(id) NOT NULL,
    status TEXT NOT NULL,
    message TEXT,
    message_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotional offers table
CREATE TABLE promo_offers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    discount_percentage INTEGER NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    show_as_popup BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE wishlist (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id TEXT, -- For now we'll use session ID
    product_id TEXT REFERENCES products(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, -- hashed
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_in_stock ON products(in_stock);
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_timeline_order_id ON order_timeline(order_id);
CREATE INDEX idx_custom_designs_order_id ON custom_designs(order_id);
CREATE INDEX idx_promo_offers_is_active ON promo_offers(is_active);
CREATE INDEX idx_promo_offers_show_as_popup ON promo_offers(show_as_popup);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX idx_admin_users_username ON admin_users(username);

-- Insert sample data
INSERT INTO products (id, name, name_bn, description, description_bn, category, subcategory, price, original_price, image, images, is_customizable, is_featured, in_stock, features, features_bn, tags, specifications) VALUES
('1', 'Premium Love Mug', 'প্রিমিয়াম লাভ মগ', 'Beautiful ceramic mug perfect for couples', 'কাপলদের জন্য নিখুঁত সুন্দর সিরামিক মগ', 'mugs', 'love-mug', 550, 650, '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, ARRAY['Dishwasher safe', 'Microwave safe', 'Premium ceramic'], ARRAY['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'প্রিমিয়াম সিরামিক'], ARRAY['love', 'couple', 'gift'], '{"material": "ceramic", "capacity": "350ml"}'),

('2', 'Magic Color Change Mug', 'ম্যাজিক কালার চেঞ্জ মগ', 'Color changing mug that reveals design when hot', 'গরম হলে ডিজাইন প্রকাশ করে এমন রঙ পরিবর্তনকারী মগ', 'mugs', 'magic-mug', 750, 850, '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, ARRAY['Color changing', 'Heat sensitive', 'Premium ceramic'], ARRAY['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক'], ARRAY['magic', 'surprise', 'gift'], '{"material": "ceramic", "capacity": "330ml"}'),

('3', 'Custom Couple T-Shirt', 'কাস্টম কাপল টি-শার্ট', 'Comfortable couple t-shirt with custom design', 'কাস্টম ডিজাইন সহ আরামদায়ক কাপল টি-শার্ট', 'tshirts', 'couple-tshirt', 1100, 1300, '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, ARRAY['100% Cotton', 'Available in all sizes', 'Custom printing'], ARRAY['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং'], ARRAY['couple', 'tshirt', 'romance'], '{"material": "cotton", "sizes": ["S", "M", "L", "XL"]}'),

('4', 'Premium Steel Water Bottle', 'প্রিমিয়াম স্টিল ওয়াটার বোতল', 'Eco-friendly steel water bottle with custom design', 'কাস্টম ডিজাইন সহ ইকো-ফ্রেন্ডলি স্টিল ওয়াটার বোতল', 'water-bottles', 'steel-bottle', 800, 950, '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], true, true, true, ARRAY['Stainless steel', 'Temperature retention', 'BPA free'], ARRAY['স্টেইনলেস স্টিল', 'তাপমাত্রা ধরে রাখে', 'বিপিএ মুক্ত'], ARRAY['bottle', 'steel', 'eco-friendly'], '{"material": "stainless steel", "capacity": "500ml"}'),

('5', 'Luxury Gift Hamper', 'লাক্সারি গিফট হ্যাম্পার', 'Premium gift hamper with multiple items', 'একাধিক আইটেম সহ প্রিমিয়াম গিফট হ্যাম্পার', 'premium-luxury-gift-hampers', 'luxury-hamper', 2500, 3000, '/api/placeholder/300/300', ARRAY['/api/placeholder/300/300'], false, true, true, ARRAY['Multiple items', 'Premium packaging', 'Perfect for gifts'], ARRAY['একাধিক আইটেম', 'প্রিমিয়াম প্যাকেজিং', 'উপহারের জন্য নিখুঁত'], ARRAY['luxury', 'hamper', 'gift'], '{"items": 5, "packaging": "premium box"}');

-- Insert sample promotional offers
INSERT INTO promo_offers (id, title, title_bn, description, description_bn, discount_percentage, valid_until, is_active, show_as_popup, image) VALUES
('promo-1', 'Mega Sale 2024', 'মেগা সেল ২০২৪', 'Get up to 50% off on all products!', 'সকল পণ্যে ৫০% পর্যন্ত ছাড়!', 50, NOW() + INTERVAL '30 days', true, true, '/api/placeholder/400/200'),
('promo-2', 'New Year Special', 'নববর্ষ স্পেশাল', 'Celebrate with custom designs!', 'কাস্টম ডিজাইন দিয়ে উদযাপন করুন!', 30, NOW() + INTERVAL '60 days', true, false, '/api/placeholder/400/200');

-- Insert default admin user
INSERT INTO admin_users (id, username, password, role, is_active) VALUES
('admin-1', 'admin', 'admin123', 'admin', true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for orders table
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust as needed for your deployment)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;