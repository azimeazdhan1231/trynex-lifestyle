# Complete Deployment Guide: Netlify + AWS EC2

This guide covers the complete deployment of your Trynex Lifestyle e-commerce platform with frontend on Netlify and backend on AWS EC2.

## Architecture Overview

```
Frontend (Netlify) ←→ Backend API (AWS EC2) ←→ Database (Supabase PostgreSQL)
```

## Part 1: Backend Deployment on AWS EC2

### Step 1: Launch EC2 Instance

1. **AWS Console Setup**
   ```
   Service: EC2
   AMI: Ubuntu Server 22.04 LTS
   Instance Type: t3.small (recommended) or t2.micro (free tier)
   Storage: 20GB gp3
   ```

2. **Security Group Configuration**
   ```
   SSH (22): Your IP only
   HTTP (80): 0.0.0.0/0
   HTTPS (443): 0.0.0.0/0
   Custom TCP (5000): 0.0.0.0/0 (API port)
   ```

3. **Key Pair**
   - Create new key pair
   - Download .pem file securely

### Step 2: Server Setup

```bash
# Connect to your instance
ssh -i "your-key.pem" ubuntu@your-public-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2, Nginx, Git
sudo npm install -g pm2
sudo apt install nginx git -y

# Verify installations
node --version  # Should show v20.x
npm --version
pm2 --version
```

### Step 3: Deploy Backend Code

```bash
# Clone your repository
cd /var/www
sudo git clone https://github.com/yourusername/trynex-ecommerce.git
sudo chown -R ubuntu:ubuntu trynex-ecommerce
cd trynex-ecommerce

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 4: Environment Configuration

```bash
# Create production environment
sudo nano .env
```

Add these variables:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.ickclyevpbgmppqizfov:your-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
UPLOAD_DIR=/var/www/trynex-ecommerce/uploads
CORS_ORIGIN=https://your-netlify-site-name.netlify.app
```

```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads

# Push database schema
npm run db:push
```

### Step 5: PM2 Process Management

```bash
# Create PM2 ecosystem file
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'trynex-api',
    script: 'server/index.ts',
    interpreter: 'npx',
    interpreter_args: 'tsx',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/www/trynex-ecommerce/logs/err.log',
    out_file: '/var/www/trynex-ecommerce/logs/out.log',
    log_file: '/var/www/trynex-ecommerce/logs/combined.log'
  }]
};
```

```bash
# Create logs directory
mkdir -p logs

# Start application
pm2 start ecosystem.config.js

# Setup auto-start
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

### Step 6: Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/trynex-api
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or IP
    
    client_max_body_size 10M;
    
    # Serve uploaded files
    location /uploads/ {
        alias /var/www/trynex-ecommerce/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "https://your-netlify-site.netlify.app";
    }
    
    # API routes
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://your-netlify-site.netlify.app";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization";
        add_header Access-Control-Allow-Credentials "true";
        
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://your-netlify-site.netlify.app";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Allow-Credentials "true";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 200;
        }
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:5000/health;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trynex-api /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### Step 7: SSL Certificate (Optional)

```bash
# Install Certbot
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

## Part 2: Frontend Deployment on Netlify

### Step 1: Prepare Frontend

Update your frontend configuration:

```bash
# Create production environment file
echo "VITE_API_URL=https://your-ec2-domain.com" > .env.production
```

Update `client/src/lib/queryClient.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = `${API_BASE_URL}${queryKey[0]}`;
        const response = await fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
```

### Step 2: Build and Deploy

```bash
# Build frontend
npm run build

# Create redirects file
echo '/api/* https://your-ec2-domain.com/api/:splat 200
/* /index.html 200' > dist/public/_redirects
```

### Step 3: Deploy to Netlify

**Option A: Manual Deploy**
1. Go to [netlify.com](https://netlify.com) and log in
2. Click "Add new site" → "Deploy manually"
3. Drag and drop your `dist/public` folder

**Option B: GitHub Deploy (Recommended)**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist/public`
5. Add environment variable: `VITE_API_URL=https://your-ec2-domain.com`

### Step 4: Custom Domain (Optional)

1. In Netlify dashboard: Site settings → Domain management
2. Add custom domain
3. Update DNS records at your registrar:
   ```
   Type: A, Name: @, Value: 75.2.60.5
   Type: CNAME, Name: www, Value: your-site.netlify.app
   ```

## Part 3: Database Setup (Already Done)

Your Supabase PostgreSQL database is already configured and working.

## Part 4: Testing Your Deployment

### Backend Testing

```bash
# Test API endpoints
curl https://your-ec2-domain.com/api/products
curl https://your-ec2-domain.com/health

# Check PM2 status
pm2 status
pm2 logs trynex-api
```

### Frontend Testing

1. Visit your Netlify site
2. Test all functionality:
   - Browse products
   - Add to cart
   - Place orders
   - Admin panel
   - Order tracking

### Integration Testing

1. Open browser developer tools
2. Check Network tab for API calls
3. Verify requests go to EC2 backend
4. Test file uploads
5. Verify order placement works

## Part 5: Monitoring and Maintenance

### Backend Monitoring

```bash
# Check application logs
pm2 logs trynex-api

# Check system resources
htop
df -h

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Automated Backups

```bash
# Create backup script
nano ~/backup-script.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/trynex-ecommerce/uploads/

# Keep only last 7 days
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

```bash
# Make executable and add to crontab
chmod +x ~/backup-script.sh
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-script.sh
```

## Part 6: Performance Optimization

### Backend Optimization

1. **PM2 Cluster Mode**
   ```javascript
   // In ecosystem.config.js
   instances: 'max', // Use all CPU cores
   ```

2. **Nginx Gzip**
   ```nginx
   # In /etc/nginx/nginx.conf
   gzip on;
   gzip_vary on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

### Frontend Optimization

Netlify automatically provides:
- Global CDN
- Asset optimization
- Compression
- HTTP/2

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Update backend CORS settings
   - Check Nginx CORS headers
   - Verify frontend API URL

2. **File Upload Issues**
   - Check Nginx `client_max_body_size`
   - Verify upload directory permissions
   - Check PM2 logs for multer errors

3. **Database Connection Issues**
   - Verify DATABASE_URL
   - Check Supabase connection limits
   - Review database logs

4. **SSL Issues**
   - Renew certificates: `sudo certbot renew`
   - Check certificate status: `sudo certbot certificates`

## Cost Estimation

### AWS EC2
- **t2.micro (Free Tier)**: $0/month (first year)
- **t3.small (Recommended)**: ~$15-20/month
- **Data Transfer**: ~$0.09/GB

### Netlify
- **Starter**: Free (100GB bandwidth)
- **Pro**: $19/month (1TB bandwidth)

### Supabase
- **Free Tier**: $0/month (500MB database)
- **Pro**: $25/month (8GB database)

**Total Monthly Cost**: $15-65 depending on tier selections

## Production Checklist

### Backend Checklist
- [ ] EC2 instance running
- [ ] PM2 process active
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Database connected
- [ ] Environment variables set
- [ ] Uploads directory configured
- [ ] Backups scheduled
- [ ] Logs configured
- [ ] Security group configured

### Frontend Checklist
- [ ] Build successful
- [ ] Deployed to Netlify
- [ ] Custom domain configured
- [ ] API endpoints updated
- [ ] CORS working
- [ ] All pages loading
- [ ] Forms submitting
- [ ] File uploads working
- [ ] Mobile responsive
- [ ] Performance optimized

## Final Steps

1. **Update replit.md** with deployment details
2. **Test complete user journey**
3. **Monitor for 24 hours**
4. **Set up alerts** for downtime
5. **Document any custom configurations**

Your Trynex Lifestyle e-commerce platform is now fully deployed and ready for production use!

## Support

For ongoing support:
1. Monitor PM2 and Nginx logs
2. Check Netlify build logs
3. Monitor database performance
4. Set up uptime monitoring
5. Regular security updates

Your Bengali e-commerce platform is now live and serving customers professionally!