# Comprehensive Deployment Guide - Trvnex Lifestyle E-commerce Platform

## Project Overview
A Bengali e-commerce platform specializing in custom ceramic mugs with full-stack architecture including React frontend, Express backend, and PostgreSQL database.

## Pre-Deployment Checklist
- [x] Fixed button routing issues in hero section
- [x] Database schema with products, orders, and wishlist functionality
- [x] Authentication-ready structure
- [x] Bilingual support (English/Bengali)
- [x] Real-time product management
- [x] Cart and checkout functionality

---

## 1. GitHub Deployment

### Step 1: Repository Setup
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Bengali e-commerce platform"

# Create GitHub repository
# Go to github.com -> New Repository -> "trvnex-lifestyle-ecommerce"

# Connect to GitHub
git remote add origin https://github.com/yourusername/trvnex-lifestyle-ecommerce.git
git branch -M main
git push -u origin main
```

### Step 2: Environment Variables for GitHub
Create `.env.example` file:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Application Settings
NODE_ENV=production
PORT=5000

# Optional: Add API keys if needed
# STRIPE_SECRET_KEY=sk_live_...
# EMAIL_SERVICE_API_KEY=...
```

### Step 3: GitHub Actions (Optional)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build application
      run: npm run build
    - name: Deploy to server
      # Add your deployment steps here
```

---

## 2. AWS Deployment

### Step 1: AWS EC2 Instance Setup
```bash
# 1. Create EC2 instance (Ubuntu 22.04 LTS)
# 2. Security Group: Allow HTTP (80), HTTPS (443), SSH (22)
# 3. Connect via SSH

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

### Step 2: Application Deployment
```bash
# Clone repository
git clone https://github.com/yourusername/trvnex-lifestyle-ecommerce.git
cd trvnex-lifestyle-ecommerce

# Install dependencies
npm install

# Create production environment file
sudo nano .env
```

Add to `.env`:
```env
DATABASE_URL=postgresql://your-db-connection-string
NODE_ENV=production
PORT=5000
```

### Step 3: Database Setup (AWS RDS)
```bash
# Create PostgreSQL RDS instance
# 1. Go to AWS RDS Console
# 2. Create Database -> PostgreSQL
# 3. Choose production template
# 4. Set master username/password
# 5. Configure VPC security groups
# 6. Note down endpoint URL

# Run database migrations
npm run db:push
```

### Step 4: PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'trvnex-ecommerce',
    script: 'server/index.ts',
    interpreter: 'tsx',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G'
  }]
}
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/trvnex-ecommerce
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trvnex-ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 6: SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 3. Netlify Deployment

### Step 1: Prepare for Netlify
Create `netlify.toml`:
```toml
[build]
  publish = "dist"
  command = "npm run build"

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
```

### Step 2: Netlify Functions Setup
Create `netlify/functions/` directory and move your API routes:

```bash
mkdir -p netlify/functions
```

Create `netlify/functions/api.ts`:
```typescript
import express from 'express';
import serverless from 'serverless-http';
import { router } from '../../server/routes';

const app = express();
app.use('/.netlify/functions/api', router);

export const handler = serverless(app);
```

### Step 3: Database Configuration
```bash
# Use Supabase or Neon for database
# 1. Create Supabase project at supabase.com
# 2. Get connection string
# 3. Add to Netlify environment variables
```

### Step 4: Deploy to Netlify
```bash
# Method 1: Git Integration
# 1. Connect GitHub repository to Netlify
# 2. Set build command: npm run build
# 3. Set publish directory: dist
# 4. Add environment variables

# Method 2: Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Step 5: Environment Variables in Netlify
Go to Netlify Dashboard → Site Settings → Environment Variables:
```
DATABASE_URL = your-supabase-connection-string
NODE_ENV = production
```

---

## 4. Database Migration Scripts

Create `scripts/migrate.ts`:
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function migrate() {
  console.log('Running database migration...');
  // Add any specific migration logic here
  console.log('Migration completed!');
  await client.end();
}

migrate().catch(console.error);
```

---

## 5. Production Environment Setup

### Environment Variables Needed:
```env
# Required
DATABASE_URL=postgresql://...
NODE_ENV=production
PORT=5000

# Optional (for enhanced features)
STRIPE_SECRET_KEY=sk_live_...
EMAIL_SERVICE_API_KEY=...
UPLOAD_SERVICE_URL=...
```

### Security Considerations:
- Use HTTPS only
- Secure database with SSL
- Regular security updates
- Monitor application logs
- Backup database regularly

---

## 6. Monitoring and Maintenance

### Health Checks:
```javascript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version 
  });
});
```

### Logging:
```bash
# View PM2 logs
pm2 logs trvnex-ecommerce

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 7. Post-Deployment Testing

### Test Checklist:
- [ ] Homepage loads correctly
- [ ] Product browsing works
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Language switching
- [ ] Mobile responsiveness
- [ ] Database connectivity
- [ ] Search functionality

### Performance Testing:
```bash
# Test website speed
curl -o /dev/null -s -w "%{time_total}\n" https://your-domain.com

# Monitor server resources
htop
df -h
```

---

## 8. Troubleshooting Common Issues

### Button Routing Issues (Fixed):
- ✅ Added proper Link wrappers to hero buttons
- ✅ "এখনই কিনুন" now routes to `/products`
- ✅ "কাস্টম ডিজাইন" now routes to `/custom-design`

### Database Connection Issues:
```bash
# Test database connection
psql "postgresql://username:password@host:port/database"

# Check environment variables
printenv | grep DATABASE_URL
```

### Build Errors:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

---

## Quick Deployment Commands Summary

### GitHub:
```bash
git add . && git commit -m "Production ready" && git push origin main
```

### AWS:
```bash
pm2 restart trvnex-ecommerce && pm2 save
```

### Netlify:
```bash
netlify deploy --prod
```

---

**Note**: Choose the deployment method that best fits your needs:
- **GitHub**: For code hosting and version control
- **AWS**: For full control and scalability
- **Netlify**: For quick deployment with serverless functions

Your Bengali e-commerce platform is now ready for production deployment! 🚀