# TryNex Lifestyle E-Commerce Platform - Complete Deployment Guide

## Project Overview

A comprehensive Bengali e-commerce platform with advanced features:
- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (Supabase)
- **Features**: Wishlist, Order tracking, Promo offers, Custom designs, Multi-language support
- **Social Integration**: Facebook business page and CEO profile

## Prerequisites

1. **Node.js 18+** installed on your machine
2. **Git** for version control
3. **Supabase** account for database
4. **Netlify** account for frontend deployment
5. **AWS** account for EC2 deployment (optional)

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region closest to your users (Singapore for Bangladesh)
4. Set database password

### 1.2 Import Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the content from `DATABASE_COMPLETE_UPDATED.sql`
3. Execute the script to create all tables and sample data

### 1.3 Get Database Credentials
```
Database URL: postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

## Step 2: GitHub Repository Setup

### 2.1 Create Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: TryNex Lifestyle E-commerce Platform"

# Create GitHub repository and push
git remote add origin https://github.com/[USERNAME]/trynex-lifestyle.git
git branch -M main
git push -u origin main
```

### 2.2 Environment Variables
Create `.env` file in root:
```env
# Database
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# Server
PORT=5000
NODE_ENV=production

# Optional: Analytics
GOOGLE_ANALYTICS_ID=your-ga-id
```

## Step 3: Frontend Deployment (Netlify)

### 3.1 Build Configuration
Create `netlify.toml` in root:
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://your-backend-domain.com/api/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_URL = "https://your-backend-domain.com"
```

### 3.2 Deploy to Netlify
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy

### 3.3 Custom Domain (Optional)
1. Purchase domain (e.g., trynex.com.bd)
2. Add to Netlify DNS settings
3. Enable HTTPS

## Step 4: Backend Deployment (Multiple Options)

### Option A: AWS EC2 Deployment

#### 4.1 Launch EC2 Instance
```bash
# Choose Ubuntu 22.04 LTS
# Instance type: t3.micro (free tier) or t3.small
# Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
```

#### 4.2 Server Setup
```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 4.3 Deploy Application
```bash
# Clone repository
git clone https://github.com/[USERNAME]/trynex-lifestyle.git
cd trynex-lifestyle

# Install dependencies
npm install

# Build frontend
npm run build

# Copy .env file with production values
nano .env

# Start application with PM2
pm2 start server/index.ts --name "trynex-backend"
pm2 startup
pm2 save
```

#### 4.4 Nginx Configuration
```nginx
# /etc/nginx/sites-available/trynex
server {
    listen 80;
    server_name your-domain.com;

    # Serve static files
    location / {
        root /home/ubuntu/trynex-lifestyle/dist;
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
sudo certbot --nginx -d your-domain.com
```

### Option B: Railway Deployment (Simpler)

#### 4.1 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add environment variables:
   - `DATABASE_URL`
   - `NODE_ENV=production`
4. Deploy automatically

### Option C: Heroku Deployment

#### 4.1 Heroku Setup
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create trynex-lifestyle

# Set environment variables
heroku config:set DATABASE_URL=your-database-url
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Step 5: Domain and SSL Setup

### 5.1 Domain Configuration
```
A Record: @ -> Your Server IP
A Record: www -> Your Server IP
CNAME: api -> Your Backend Domain
```

### 5.2 SSL Certificate
```bash
# Using Certbot (Let's Encrypt)
sudo certbot --nginx -d trynex.com.bd -d www.trynex.com.bd
```

## Step 6: Monitoring and Maintenance

### 6.1 Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs trynex-backend

# Restart application
pm2 restart trynex-backend
```

### 6.2 Database Backup
```bash
# Daily backup script
#!/bin/bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### 6.3 Nginx Logs
```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## Step 7: Performance Optimization

### 7.1 Frontend Optimization
- Enable Gzip compression in Nginx
- Set proper cache headers
- Optimize images (WebP format)
- Use CDN for static assets

### 7.2 Backend Optimization
- Enable PostgreSQL connection pooling
- Set up Redis for caching (optional)
- Monitor database queries
- Set up load balancing (for high traffic)

## Step 8: Security Checklist

### 8.1 Server Security
```bash
# Configure firewall
sudo ufw enable
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Disable root login
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no

# Update packages regularly
sudo apt update && sudo apt upgrade -y
```

### 8.2 Application Security
- Enable CORS properly
- Use HTTPS everywhere
- Sanitize user inputs
- Regular security audits

## Step 9: Testing Deployment

### 9.1 Frontend Testing
- [ ] Homepage loads correctly
- [ ] Product search works
- [ ] Wishlist functionality
- [ ] Order placement
- [ ] Language switching
- [ ] Mobile responsiveness

### 9.2 Backend Testing
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] File uploads function
- [ ] Order processing
- [ ] Email notifications

## Step 10: Go Live Checklist

### 10.1 Pre-Launch
- [ ] Database populated with real products
- [ ] Payment methods configured
- [ ] Contact information updated
- [ ] Social media links verified
- [ ] Analytics setup
- [ ] Error monitoring enabled

### 10.2 Launch
- [ ] DNS propagated
- [ ] SSL certificate active
- [ ] All functionality tested
- [ ] Performance monitoring active
- [ ] Backup systems running

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Verify Supabase credentials
   - Check network connectivity

2. **Build Failures**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility
   - Verify environment variables

3. **502 Bad Gateway**
   - Check if backend service is running
   - Verify Nginx configuration
   - Check PM2 process status

4. **CORS Errors**
   - Update CORS configuration
   - Check frontend/backend domain matching

## Support and Maintenance

### Regular Tasks
- Weekly database backups
- Monthly security updates
- Quarterly performance reviews
- Analytics monitoring

### Contact Information
- **Business Facebook**: https://www.facebook.com/people/TryNex-Lifestyle/61576151563336/
- **CEO Facebook**: https://www.facebook.com/ahmed.amit.333
- **Email**: info@trynex.com
- **Phone**: +880 1940-689487

---

**Deployment Completed Successfully!** 🎉

Your TryNex Lifestyle e-commerce platform is now ready for production use with all advanced features including wishlist, order tracking, multi-language support, and social media integration.