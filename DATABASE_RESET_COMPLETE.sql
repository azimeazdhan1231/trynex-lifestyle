-- COMPLETE DATABASE RESET AND RECREATION FOR TRYNEX LIFESTYLE
-- WARNING: This will delete ALL existing data and recreate the database from scratch
-- Make sure to backup any important data before running this script

-- =========================================
-- STEP 1: DROP ALL EXISTING TABLES
-- =========================================

-- Drop tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS promo_offers CASCADE;
DROP TABLE IF EXISTS order_timeline CASCADE;
DROP TABLE IF EXISTS custom_designs CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS schema_versions CASCADE;

-- Drop any existing functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- =========================================
-- STEP 2: ENABLE REQUIRED EXTENSIONS
-- =========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- STEP 3: CREATE ALL TABLES FROM SCRATCH
-- =========================================

-- 1. Schema Versions Table (for tracking database changes)
CREATE TABLE schema_versions (
    version TEXT PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Admin Users Table
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Products Table
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

-- 4. Orders Table
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

-- 5. Custom Designs Table
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

-- 6. Order Timeline Table
CREATE TABLE order_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    message TEXT,
    message_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Promo Offers Table
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

-- 8. Wishlist Table
CREATE TABLE wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL, -- For guest users, use session ID or device ID
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- =========================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =========================================

-- Products indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_in_stock ON products(in_stock) WHERE in_stock = true;
CREATE INDEX idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_products_name_bn ON products USING gin(to_tsvector('simple', name_bn));

-- Orders indexes
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);

-- Other indexes
CREATE INDEX idx_order_timeline_order_id ON order_timeline(order_id);
CREATE INDEX idx_order_timeline_created_at ON order_timeline(created_at DESC);
CREATE INDEX idx_custom_designs_order_id ON custom_designs(order_id);
CREATE INDEX idx_promo_offers_active ON promo_offers(is_active) WHERE is_active = true;
CREATE INDEX idx_promo_offers_popup ON promo_offers(show_as_popup) WHERE show_as_popup = true;
CREATE INDEX idx_promo_offers_valid ON promo_offers(valid_until);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);

-- =========================================
-- STEP 5: CREATE TRIGGER FUNCTIONS
-- =========================================

-- Updated_at trigger function
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

-- =========================================
-- STEP 6: INSERT FRESH SAMPLE DATA
-- =========================================

-- Insert schema version
INSERT INTO schema_versions (version, description) 
VALUES ('2.0.0', 'Complete reset with all TryNex Lifestyle features - January 2024');

-- Create fresh admin user (password: admin123)
INSERT INTO admin_users (username, password, role) 
VALUES ('admin', crypt('admin123', gen_salt('bf')), 'admin');

-- Insert sample products with enhanced data
INSERT INTO products (
    name, name_bn, description, description_bn, category, subcategory, 
    price, original_price, image, is_featured, is_customizable, in_stock,
    features, features_bn, tags, specifications
) VALUES 
(
    'Premium Ceramic Mug',
    'প্রিমিয়াম সিরামিক মগ',
    'High-quality ceramic mug perfect for your morning coffee. Dishwasher and microwave safe.',
    'আপনার সকালের কফির জন্য উচ্চ মানের সিরামিক মগ। ডিশওয়াশার এবং মাইক্রোওয়েভ নিরাপদ।',
    'mugs',
    'ceramic-mug',
    650.00,
    750.00,
    '/api/placeholder/300/300',
    true,
    true,
    true,
    ARRAY['Dishwasher safe', 'Microwave safe', 'Durable ceramic', '330ml capacity'],
    ARRAY['ডিশওয়াশার নিরাপদ', 'মাইক্রোওয়েভ নিরাপদ', 'টেকসই সিরামিক', '৩৩০মিলি ধারণক্ষমতা'],
    ARRAY['mug', 'coffee', 'ceramic', 'gift'],
    '{"material": "ceramic", "capacity": "330ml", "color": "white", "weight": "350g"}'::jsonb
),
(
    'Magic Color Changing Mug',
    'ম্যাজিক কালার চেঞ্জিং মগ',
    'Amazing mug that changes color when hot liquid is poured. Perfect surprise gift for loved ones.',
    'গরম তরল ঢাললে রং পরিবর্তন হয় এমন অদ্ভুত মগ। প্রিয়জনদের জন্য নিখুঁত সারপ্রাইজ গিফট।',
    'mugs',
    'magic-mug',
    950.00,
    1100.00,
    '/api/placeholder/300/300',
    true,
    true,
    true,
    ARRAY['Color changing', 'Heat sensitive', 'Premium ceramic', 'Surprise effect'],
    ARRAY['রঙ পরিবর্তনকারী', 'তাপ সংবেদনশীল', 'প্রিমিয়াম সিরামিক', 'সারপ্রাইজ ইফেক্ট'],
    ARRAY['magic', 'surprise', 'gift', 'special'],
    '{"material": "ceramic", "capacity": "330ml", "feature": "thermochromic", "temperature": "60°C+"}'::jsonb
),
(
    'Custom Couple T-Shirt',
    'কাস্টম কাপল টি-শার্ট',
    'Comfortable couple t-shirt with custom design printing. Available in all sizes with premium cotton fabric.',
    'কাস্টম ডিজাইন প্রিন্টিং সহ আরামদায়ক কাপল টি-শার্ট। প্রিমিয়াম কটন ফেব্রিক দিয়ে সব সাইজে পাওয়া যায়।',
    'tshirts',
    'couple-tshirt',
    1100.00,
    1300.00,
    '/api/placeholder/300/300',
    true,
    true,
    true,
    ARRAY['100% Cotton', 'Available in all sizes', 'Custom printing', 'Comfortable fit'],
    ARRAY['১০০% কটন', 'সব সাইজে পাওয়া যায়', 'কাস্টম প্রিন্টিং', 'আরামদায়ক ফিট'],
    ARRAY['couple', 'tshirt', 'romance', 'custom'],
    '{"material": "cotton", "sizes": ["S", "M", "L", "XL"], "colors": ["white", "black", "red"], "print": "DTG"}'::jsonb
),
(
    'Personalized Photo Frame',
    'ব্যক্তিগত ছবির ফ্রেম',
    'Beautiful wooden photo frame with custom engraving. Perfect for gifting memories.',
    'কাস্টম খোদাই সহ সুন্দর কাঠের ছবির ফ্রেম। স্মৃতি উপহার দেওয়ার জন্য নিখুঁত।',
    'gifts',
    'photo-frame',
    850.00,
    1000.00,
    '/api/placeholder/300/300',
    true,
    true,
    true,
    ARRAY['Wooden frame', 'Custom engraving', 'Multiple sizes', 'Premium quality'],
    ARRAY['কাঠের ফ্রেম', 'কাস্টম খোদাই', 'একাধিক সাইজ', 'প্রিমিয়াম মান'],
    ARRAY['frame', 'photo', 'gift', 'memory'],
    '{"material": "wood", "sizes": ["4x6", "5x7", "8x10"], "finish": "natural"}'::jsonb
),
(
    'Custom Keychain',
    'কাস্টম চাবির রিং',
    'Personalized keychain with your name or message. Durable and stylish accessory.',
    'আপনার নাম বা বার্তা সহ ব্যক্তিগত চাবির রিং। টেকসই এবং স্টাইলিশ এক্সেসরি।',
    'accessories',
    'keychain',
    250.00,
    300.00,
    '/api/placeholder/300/300',
    false,
    true,
    true,
    ARRAY['Personalized text', 'Durable material', 'Multiple colors', 'Compact size'],
    ARRAY['ব্যক্তিগত টেক্সট', 'টেকসই উপাদান', 'একাধিক রঙ', 'কমপ্যাক্ট সাইজ'],
    ARRAY['keychain', 'personalized', 'accessory', 'small gift'],
    '{"material": "metal", "colors": ["silver", "gold", "black"], "size": "5cm"}'::jsonb
);

-- Insert fresh promo offers
INSERT INTO promo_offers (
    title, title_bn, description, description_bn, 
    discount_percentage, valid_until, is_active, show_as_popup
) VALUES 
(
    'New Year Mega Sale 2024',
    'নববর্ষ মেগা সেল ২০২৪',
    'Get up to 50% off on all products! Limited time offer for new year celebration.',
    'সকল পণ্যে ৫০% পর্যন্ত ছাড়! নববর্ষ উদযাপনের জন্য সীমিত সময়ের অফার।',
    50,
    NOW() + INTERVAL '30 days',
    true,
    true
),
(
    'Valentine Special Offer',
    'ভালোবাসা দিবস স্পেশাল অফার',
    'Special discount on couple items and custom gifts for Valentine''s Day!',
    'ভালোবাসা দিবসের জন্য কাপল আইটেম এবং কাস্টম গিফটে বিশেষ ছাড়!',
    30,
    NOW() + INTERVAL '45 days',
    true,
    false
),
(
    'Buy 2 Get 1 Free',
    '২টি কিনুন ১টি ফ্রি পান',
    'Buy any 2 mugs and get 1 mug absolutely free! Mix and match available.',
    'যেকোনো ২টি মগ কিনুন এবং ১টি মগ একদম ফ্রি পান! মিক্স এবং ম্যাচ করা যাবে।',
    33,
    NOW() + INTERVAL '60 days',
    true,
    false
);

-- Insert sample order timeline statuses for reference
-- (These will be created automatically when orders are placed)

-- =========================================
-- STEP 7: CREATE VIEWS FOR REPORTING
-- =========================================

-- View for active products with stock
CREATE VIEW active_products AS
SELECT * FROM products 
WHERE is_active = true AND in_stock = true
ORDER BY is_featured DESC, created_at DESC;

-- View for recent orders
CREATE VIEW recent_orders AS
SELECT 
    o.*,
    COUNT(ot.id) as timeline_entries
FROM orders o
LEFT JOIN order_timeline ot ON o.id = ot.order_id
WHERE o.created_at >= NOW() - INTERVAL '30 days'
GROUP BY o.id
ORDER BY o.created_at DESC;

-- View for popular products (based on wishlist count)
CREATE VIEW popular_products AS
SELECT 
    p.*,
    COUNT(w.id) as wishlist_count
FROM products p
LEFT JOIN wishlist w ON p.id = w.product_id
WHERE p.is_active = true
GROUP BY p.id
ORDER BY wishlist_count DESC, p.created_at DESC;

-- =========================================
-- STEP 8: GRANT PERMISSIONS
-- =========================================

-- Grant permissions for authenticated users (if using RLS)
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =========================================
-- STEP 9: ADD COMMENTS FOR DOCUMENTATION
-- =========================================

COMMENT ON TABLE products IS 'Product catalog with Bengali and English support';
COMMENT ON TABLE orders IS 'Customer orders with delivery information and tracking';
COMMENT ON TABLE custom_designs IS 'Custom design requests associated with orders';
COMMENT ON TABLE order_timeline IS 'Order status tracking timeline with bilingual messages';
COMMENT ON TABLE promo_offers IS 'Promotional offers and discounts with popup support';
COMMENT ON TABLE wishlist IS 'Customer wishlist items for guest and registered users';
COMMENT ON TABLE admin_users IS 'Admin user accounts for backend management';

COMMENT ON COLUMN orders.tracking_id IS 'Unique tracking identifier for customer order lookup';
COMMENT ON COLUMN products.specifications IS 'JSON object containing product specifications';
COMMENT ON COLUMN promo_offers.show_as_popup IS 'Whether to show this offer as a popup modal';
COMMENT ON COLUMN wishlist.user_id IS 'User identifier - can be session ID for guest users';

-- =========================================
-- VERIFICATION QUERIES
-- =========================================

-- Run these queries to verify the database setup
SELECT 'Database reset completed successfully!' as status;

SELECT 
    'Tables created: ' || COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

SELECT 
    'Sample products: ' || COUNT(*) as product_count
FROM products;

SELECT 
    'Promo offers: ' || COUNT(*) as offer_count
FROM promo_offers;

SELECT 
    'Admin users: ' || COUNT(*) as admin_count
FROM admin_users;

-- =========================================
-- COMPLETION MESSAGE
-- =========================================

DO $$
BEGIN
    RAISE NOTICE '============================================';
    RAISE NOTICE 'TryNex Lifestyle Database Reset Complete!';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Fresh database created with:';
    RAISE NOTICE '- All tables recreated from scratch';
    RAISE NOTICE '- Sample products and promo offers added';
    RAISE NOTICE '- Default admin user created (admin/admin123)';
    RAISE NOTICE '- All indexes and triggers configured';
    RAISE NOTICE '- Database ready for production use';
    RAISE NOTICE '============================================';
END $$;