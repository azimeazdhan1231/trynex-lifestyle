# Complete Deployment Guide - Trynex Bengali E-commerce Platform

This comprehensive guide covers deployment to GitHub, Netlify, and AWS for the full-stack Bengali e-commerce platform.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Setup](#database-setup)
3. [Environment Variables](#environment-variables)
4. [GitHub Deployment](#github-deployment)
5. [Netlify Deployment](#netlify-deployment)
6. [AWS Deployment](#aws-deployment)
7. [Production Checklist](#production-checklist)

## Project Overview

**Trynex** is a comprehensive Bengali e-commerce platform specializing in personalized ceramic mugs and custom merchandise with the following stack:

- **Frontend**: React, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **Features**: Full bilingual support (English/Bengali), real-time product management, advanced cart system, order tracking, admin panel
- **Database**: PostgreSQL with comprehensive schema

## Database Setup

### Complete SQL Schema

Execute this SQL script to set up your production database:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table with expanded categories
CREATE TABLE products (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
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
    items JSONB NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    payment_number TEXT,
    payment_screenshot TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom designs table
CREATE TABLE custom_designs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id TEXT REFERENCES orders(id),
    product_type TEXT NOT NULL,
    design_file TEXT NOT NULL,
    design_data JSONB,
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
    user_id TEXT,
    product_id TEXT REFERENCES products(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users
CREATE TABLE admin_users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
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

-- Insert default admin user
INSERT INTO admin_users (id, username, password, role, is_active) VALUES
('admin-1', 'admin', 'admin123', 'admin', true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Environment Variables

Create these environment files for different environments:

### `.env` (Local Development)
```env
# Database Connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/trynex_db

# Supabase Configuration (if using Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Server Configuration
PORT=5000
NODE_ENV=development

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### `.env.production` (Production)
```env
# Database Connection (Use your production database URL)
DATABASE_URL=postgresql://username:password@host:port/database

# Server Configuration
PORT=5000
NODE_ENV=production

# Admin Configuration (Use strong passwords)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password-here
```

## GitHub Deployment

### 1. Initialize Git Repository

```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: Trynex Bengali E-commerce Platform"

# Add remote origin
git remote add origin https://github.com/yourusername/trynex-ecommerce.git
git branch -M main
git push -u origin main
```

### 2. GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Trynex E-commerce

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: trynex_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
      env:
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/trynex_test
    
    - name: Build application
      run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to production
      # Add your deployment steps here
      run: echo "Deploy to your chosen platform"
```

## Netlify Deployment

### 1. Build Configuration

Create `netlify.toml`:

```toml
[build]
  base = "."
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

### 2. Netlify Functions Setup

Create `netlify/functions/api.js`:

```javascript
import express from 'express';
import serverless from 'serverless-http';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Import your existing server routes
const app = express();

// Database connection
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString, { ssl: 'require' });
const db = drizzle(client);

// Add all your existing routes here
// (Copy from server/routes.ts)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes here...

export const handler = serverless(app);
```

### 3. Package.json Scripts

Update your `package.json`:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "netlify dev",
    "build:netlify": "npm run build && npm run build:functions",
    "build:functions": "netlify-lambda build netlify/functions"
  },
  "devDependencies": {
    "netlify-lambda": "^2.0.16",
    "serverless-http": "^3.2.0"
  }
}
```

### 4. Deployment Steps

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

### 5. Environment Variables (Netlify)

Set these in Netlify Dashboard > Site Settings > Environment Variables:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NODE_ENV=production`

## AWS Deployment

### 1. EC2 Instance Setup

```bash
# Launch EC2 instance (Ubuntu 22.04 LTS)
# Connect to instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install PostgreSQL (if not using external DB)
sudo apt install postgresql postgresql-contrib -y
```

### 2. Application Deployment

```bash
# Clone repository
git clone https://github.com/yourusername/trynex-ecommerce.git
cd trynex-ecommerce

# Install dependencies
npm install

# Create production build
npm run build

# Create ecosystem file for PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'trynex-ecommerce',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
      DATABASE_URL: 'your-production-db-url'
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 3. Nginx Configuration

```nginx
# /etc/nginx/sites-available/trynex
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Serve static files
    location / {
        root /home/ubuntu/trynex-ecommerce/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trynex /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 4. RDS Database Setup

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier trynex-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password your-password \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-your-security-group \
  --db-subnet-group-name your-subnet-group
```

### 5. S3 for File Storage (Optional)

```javascript
// Add to your server configuration
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// File upload handler
const uploadToS3 = (file, key) => {
  return s3.upload({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  }).promise();
};
```

## Production Checklist

### Security
- [ ] Change default admin credentials
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up proper CORS headers
- [ ] Implement rate limiting
- [ ] Sanitize user inputs
- [ ] Set secure environment variables

### Performance
- [ ] Enable database connection pooling
- [ ] Implement Redis caching
- [ ] Optimize images and static assets
- [ ] Enable gzip compression
- [ ] Set up CDN for static files

### Monitoring
- [ ] Set up application logging
- [ ] Implement error tracking (Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up database backups
- [ ] Monitor server resources

### Database
- [ ] Run all migrations
- [ ] Set up automated backups
- [ ] Configure connection pooling
- [ ] Optimize database queries
- [ ] Set up monitoring

### Final Steps
- [ ] Test all features in production
- [ ] Verify admin panel functionality
- [ ] Test order placement and tracking
- [ ] Verify Bengali text rendering
- [ ] Test mobile responsiveness
- [ ] Verify email notifications (if implemented)

## Support and Maintenance

### Regular Tasks
1. **Database Backups**: Schedule daily automated backups
2. **Security Updates**: Keep dependencies updated
3. **Performance Monitoring**: Monitor response times and errors
4. **Content Updates**: Regular product and promotional updates
5. **User Analytics**: Track user behavior and conversion rates

### Troubleshooting Common Issues

**Database Connection Issues:**
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT NOW();"

# Test application database queries
curl -X GET http://your-domain.com/api/products
```

**Build Issues:**
```bash
# Clear build cache
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

**Admin Panel Access:**
```bash
# Reset admin password in database
psql $DATABASE_URL -c "UPDATE admin_users SET password = 'newpassword' WHERE username = 'admin';"
```

---

This deployment guide provides comprehensive instructions for deploying the Trynex Bengali e-commerce platform to multiple cloud providers. Choose the deployment method that best fits your requirements and infrastructure preferences.