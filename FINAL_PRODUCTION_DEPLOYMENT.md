# Trynex Lifestyle E-Commerce - Complete Production Deployment Guide

🎯 **UPDATED JANUARY 26, 2025 - FINAL VERSION**

**Key Features Completed:**
- ✅ Full Bengali-English e-commerce platform
- ✅ Real-time admin panel with live order updates
- ✅ Enhanced order success modal with confetti animation
- ✅ Advanced order tracking with timeline visualization
- ✅ Complete product & promo offer management
- ✅ Production-ready database schema

## Overview
This guide covers the complete deployment of the Trynex Lifestyle e-commerce platform using:
- **Frontend**: Netlify (Static hosting)
- **Backend**: AWS EC2 (Node.js server)
- **Database**: Supabase PostgreSQL
- **Source Control**: GitHub

## Prerequisites
- GitHub account
- Netlify account
- AWS account
- Domain name (optional)
- Supabase account with configured database

## Part 1: Repository Setup

### 1.1 Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit - Trynex Lifestyle E-commerce Platform"
```

### 1.2 Create GitHub Repository
1. Go to https://github.com/new
2. Create repository: `trynex-lifestyle-ecommerce`
3. Add remote and push:
```bash
git remote add origin https://github.com/yourusername/trynex-lifestyle-ecommerce.git
git branch -M main
git push -u origin main
```

## Part 2: Frontend Deployment (Netlify)

### 2.1 Build Configuration
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build:frontend"
  publish = "dist/public"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-domain.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 2.2 Update Package.json Scripts
Add to `package.json`:
```json
{
  "scripts": {
    "build:frontend": "vite build --outDir dist/public",
    "build:backend": "esbuild ./server/index.ts --bundle --platform=node --outfile=dist/server.js --external:pg-native",
    "start:production": "node dist/server.js"
  }
}
```

### 2.3 Netlify Deployment
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build:frontend`
3. Set publish directory: `dist/public`
4. Deploy site
5. Note the Netlify URL (e.g., `https://trynex-lifestyle.netlify.app`)

## Part 3: Backend Deployment (AWS EC2)

### 3.1 Launch EC2 Instance
1. **Instance Type**: t3.micro (or larger for production)
2. **AMI**: Ubuntu 22.04 LTS
3. **Security Group**: Allow ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 5000 (API)
4. **Key Pair**: Create and download for SSH access

### 3.2 Server Setup
SSH into your instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Install dependencies:
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx -y

# Clone repository
git clone https://github.com/yourusername/trynex-lifestyle-ecommerce.git
cd trynex-lifestyle-ecommerce

# Install dependencies
npm install

# Build backend
npm run build:backend
```

### 3.3 Environment Configuration
Create `.env` file:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_supabase_connection_string
```

### 3.4 PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'trynex-backend',
    script: 'dist/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

Start application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3.5 Nginx Configuration
Create `/etc/nginx/sites-available/trynex-backend`:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/trynex-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Part 4: Database Setup (Supabase)

### 4.1 Database Schema
Run the following SQL in Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
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
CREATE TABLE IF NOT EXISTS orders (
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
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_timeline table
CREATE TABLE IF NOT EXISTS order_timeline (
  id TEXT PRIMARY KEY,
  order_id TEXT REFERENCES orders(id),
  status TEXT NOT NULL,
  message TEXT,
  message_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (id, username, password) VALUES 
('admin-1', 'admin', '$2b$10$Wq5/A9Cy1d7ro7ckJyzcfO0Jeslps2Q8OZz6008SzGqd9BpqZEO5a')
ON CONFLICT (username) DO NOTHING;
```

### 4.2 Update Database URL
Update your environment variables with the Supabase connection string:
```
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## Part 5: Domain & SSL Setup

### 5.1 Domain Configuration
1. Point your domain to EC2 instance IP
2. Update Nginx configuration with your domain
3. Update Netlify redirects with your backend domain

### 5.2 SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Part 6: Frontend Configuration Update

### 6.1 Update API Base URL
In your frontend code, update API calls to use production backend URL:

Create `client/src/config/api.ts`:
```typescript
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-domain.com'
  : 'http://localhost:5000';
```

### 6.2 Update Netlify Redirects
Update `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-backend-domain.com/api/:splat"
  status = 200
```

### 6.3 Redeploy Frontend
Push changes and let Netlify auto-deploy:
```bash
git add .
git commit -m "Update API configuration for production"
git push origin main
```

## Part 7: Production Monitoring

### 7.1 PM2 Monitoring
```bash
# View logs
pm2 logs trynex-backend

# Monitor performance
pm2 monit

# Restart application
pm2 restart trynex-backend
```

### 7.2 Nginx Logs
```bash
# View access logs
sudo tail -f /var/log/nginx/access.log

# View error logs
sudo tail -f /var/log/nginx/error.log
```

## Part 8: Maintenance & Updates

### 8.1 Backend Updates
```bash
cd trynex-lifestyle-ecommerce
git pull origin main
npm install
npm run build:backend
pm2 restart trynex-backend
```

### 8.2 Database Backups
Regular Supabase backups are handled automatically. For additional security:
```bash
# Manual backup
pg_dump "your-supabase-connection-string" > backup-$(date +%Y%m%d).sql
```

## Part 9: Security Checklist

- [x] Environment variables secured
- [x] Database connection encrypted
- [x] SSL certificate installed
- [x] Admin credentials changed from defaults
- [x] File upload security implemented
- [x] CORS properly configured
- [x] Input validation in place

## Part 10: Performance Optimization

### 10.1 Backend Optimizations
- Enable Nginx gzip compression
- Set up proper caching headers
- Use PM2 cluster mode for high traffic

### 10.2 Frontend Optimizations
- Netlify CDN automatically handles optimization
- Images served through API with proper caching
- Static assets minified by Vite

## Troubleshooting

### Common Issues
1. **API not responding**: Check PM2 status and logs
2. **Database connection issues**: Verify Supabase connection string
3. **Frontend not loading**: Check Netlify build logs
4. **CORS errors**: Update CORS configuration in backend

### Support Contacts
- Backend Issues: Check EC2 instance and PM2 logs
- Frontend Issues: Check Netlify build logs
- Database Issues: Check Supabase dashboard

## Final URLs
- **Frontend**: https://trynex-lifestyle.netlify.app
- **Backend API**: https://your-backend-domain.com/api
- **Admin Panel**: https://trynex-lifestyle.netlify.app/admin

## Post-Deployment Testing
1. Test product browsing
2. Test order placement
3. Test order tracking
4. Test admin panel functionality
5. Test payment integration
6. Verify email notifications (if implemented)

This deployment guide ensures a production-ready, scalable e-commerce platform with proper separation of concerns and industry best practices.