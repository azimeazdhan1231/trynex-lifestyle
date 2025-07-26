-- Complete Supabase SQL Export for TryNex Lifestyle E-Commerce Platform
-- Generated: January 2024
-- This script creates all necessary tables, indexes, and relationships

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables if they exist (use with caution in production)
-- DROP TABLE IF EXISTS wishlist CASCADE;
-- DROP TABLE IF EXISTS promo_offers CASCADE;
-- DROP TABLE IF EXISTS order_timeline CASCADE;
-- DROP TABLE IF EXISTS custom_designs CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS admin_users CASCADE;

-- 1. Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    description TEXT,
    description_bn TEXT,
    category TEXT NOT NULL,
    subcategory TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image TEXT,
    images TEXT[] DEFAULT '{}',
    in_stock BOOLEAN NOT NULL DEFAULT true,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_customizable BOOLEAN NOT NULL DEFAULT false,
    features TEXT[] DEFAULT '{}',
    features_bn TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    district TEXT NOT NULL,
    thana TEXT NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_number TEXT,
    payment_screenshot TEXT,
    items JSONB NOT NULL DEFAULT '[]',
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Custom Designs Table
CREATE TABLE custom_designs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    design_type TEXT NOT NULL CHECK (design_type IN ('text', 'image', 'photo')),
    design_data JSONB NOT NULL DEFAULT '{}',
    design_files TEXT[] DEFAULT '{}',
    instructions TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Timeline Table
CREATE TABLE order_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    message TEXT,
    message_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Promo Offers Table
CREATE TABLE promo_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    description TEXT NOT NULL,
    description_bn TEXT NOT NULL,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    show_as_popup BOOLEAN NOT NULL DEFAULT false,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Wishlist Table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- For now using string, in production would be UUID referencing users table
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_timeline_order_id ON order_timeline(order_id);
CREATE INDEX idx_custom_designs_order_id ON custom_designs(order_id);
CREATE INDEX idx_promo_offers_active ON promo_offers(is_active) WHERE is_active = true;
CREATE INDEX idx_promo_offers_popup ON promo_offers(show_as_popup) WHERE show_as_popup = true;
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- 1. Create default admin user
INSERT INTO admin_users (username, password) 
VALUES ('admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;

-- 2. Insert sample products
INSERT INTO products (
    name, name_bn, description, description_bn, category, subcategory, 
    price, original_price, image, is_featured, is_customizable, 
    features, features_bn, tags, specifications
) VALUES 
(
    'Premium Ceramic Mug',
    'প্রিমিয়াম সিরামিক মগ',
    'High-quality ceramic mug perfect for your morning coffee',
    'আপনার সকালের কফির জন্য উচ্চ মানের সিরামিক মগ',
    'mugs',
    'ceramic-mug',
    650.00,
    750.00,
    '/api/placeholder/300/300',
    true,
    true,
    ARRAY['Dishwasher safe', 'Microwave safe', 'Durable ceramic'],
    ARRAY['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'টেকসই সিরামিক'],
    ARRAY['mug', 'coffee', 'ceramic'],
    '{"material": "ceramic", "capacity": "330ml", "color": "white"}'::jsonb
),
(
    'Magic Color Changing Mug',
    'ম্যাজিক কালার চেঞ্জিং মগ',
    'Amazing mug that changes color when hot liquid is poured',
    'গরম তরল ঢাললে রং পরিবর্তন হয় এমন অদ্ভুত মগ',
    'mugs',
    'magic-mug',
    950.00,
    1100.00,
    '/api/placeholder/300/300',
    true,
    true,
    ARRAY['Color changing', 'Heat sensitive', 'Premium ceramic'],
    ARRAY['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক'],
    ARRAY['magic', 'surprise', 'gift'],
    '{"material": "ceramic", "capacity": "330ml"}'::jsonb
),
(
    'Custom Couple T-Shirt',
    'কাস্টম কাপল টি-শার্ট',
    'Comfortable couple t-shirt with custom design',
    'কাস্টম ডিজাইন সহ আরামদায়ক কাপল টি-শার্ট',
    'tshirts',
    'couple-tshirt',
    1100.00,
    1300.00,
    '/api/placeholder/300/300',
    true,
    true,
    ARRAY['100% Cotton', 'Available in all sizes', 'Custom printing'],
    ARRAY['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং'],
    ARRAY['couple', 'tshirt', 'romance'],
    '{"material": "cotton", "sizes": ["S", "M", "L", "XL"]}'::jsonb
);

-- 3. Insert sample promo offers
INSERT INTO promo_offers (
    title, title_bn, description, description_bn, 
    discount_percentage, valid_until, is_active, show_as_popup
) VALUES 
(
    'Mega Sale 2024',
    'মেগা সেল ২০২৪',
    'Get up to 50% off on all products!',
    'সকল পণ্যে ৫০% পর্যন্ত ছাড়!',
    50,
    NOW() + INTERVAL '30 days',
    true,
    true
),
(
    'New Year Special',
    'নববর্ষ স্পেশাল',
    'Celebrate with custom designs!',
    'কাস্টম ডিজাইন দিয়ে উদযাপন করুন!',
    30,
    NOW() + INTERVAL '60 days',
    true,
    false
);

-- Create RLS (Row Level Security) policies if needed
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- etc.

-- Grant necessary permissions
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE products IS 'Product catalog with Bengali and English support';
COMMENT ON TABLE orders IS 'Customer orders with delivery information';
COMMENT ON TABLE custom_designs IS 'Custom design requests associated with orders';
COMMENT ON TABLE order_timeline IS 'Order status tracking timeline';
COMMENT ON TABLE promo_offers IS 'Promotional offers and discounts';
COMMENT ON TABLE wishlist IS 'Customer wishlist items';
COMMENT ON TABLE admin_users IS 'Admin user accounts for backend management';

-- Database schema version
INSERT INTO public.schema_versions (version, description, applied_at) 
VALUES ('1.0.0', 'Initial TryNex Lifestyle schema with all core tables', NOW())
ON CONFLICT DO NOTHING;

-- Create schema_versions table if it doesn't exist
CREATE TABLE IF NOT EXISTS schema_versions (
    version TEXT PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON DATABASE current_database() IS 'TryNex Lifestyle E-Commerce Platform Database - Complete schema with all features';