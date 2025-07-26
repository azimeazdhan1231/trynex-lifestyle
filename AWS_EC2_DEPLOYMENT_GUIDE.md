# AWS EC2 Deployment Guide for Trynex Lifestyle E-Commerce

This guide provides step-by-step instructions to deploy your Bengali e-commerce application on AWS EC2.

## Prerequisites

Before starting, ensure you have:
- AWS Account with appropriate permissions
- Domain name (optional but recommended)
- SSL certificate (optional but recommended for production)

## Part 1: Setting Up AWS EC2 Instance

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**
   - Go to AWS Management Console
   - Navigate to EC2 service
   - Click "Launch Instance"

2. **Configure Instance**
   ```
   Name: trynex-ecommerce-server
   AMI: Ubuntu Server 22.04 LTS (Free tier eligible)
   Instance Type: t2.micro (Free tier) or t3.small (Recommended for production)
   Key Pair: Create new key pair (save the .pem file securely)
   Security Group: Create new security group with these rules:
   ```

3. **Security Group Configuration**
   ```
   Inbound Rules:
   - SSH (Port 22): Your IP
   - HTTP (Port 80): 0.0.0.0/0
   - HTTPS (Port 443): 0.0.0.0/0
   - Custom TCP (Port 5000): 0.0.0.0/0 (for API)
   - Custom TCP (Port 3000): 0.0.0.0/0 (for frontend dev server, remove in production)
   ```

4. **Launch Instance**
   - Review settings and launch
   - Note down the Public IPv4 address

### Step 2: Connect to Your Instance

```bash
# Replace with your key file and public IP
chmod 400 your-key-file.pem
ssh -i "your-key-file.pem" ubuntu@your-public-ip
```

## Part 2: Server Setup and Configuration

### Step 3: Install Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install Git
sudo apt install git -y

# Verify installations
node --version
npm --version
pm2 --version
nginx -v
```

### Step 4: Clone and Setup Your Application

```bash
# Navigate to web directory
cd /var/www

# Clone your repository (replace with your actual repo URL)
sudo git clone https://github.com/yourusername/trynex-ecommerce.git
sudo chown -R ubuntu:ubuntu trynex-ecommerce
cd trynex-ecommerce

# Install dependencies
npm install

# Build the application
npm run build
```

### Step 5: Environment Configuration

```bash
# Create production environment file
sudo nano .env

# Add these environment variables (update with your actual values):
```

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres.ickclyevpbgmppqizfov:your-password@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=your-super-secret-session-key-here-change-this
UPLOAD_DIR=/var/www/trynex-ecommerce/uploads
```

```bash
# Create uploads directory
mkdir -p uploads
chmod 755 uploads
```

## Part 3: Database Setup

### Step 6: Prepare Database

```bash
# Push database schema to production
npm run db:push

# Populate sample data (optional)
node populate-database.js
```

## Part 4: Process Management with PM2

### Step 7: Setup PM2 Configuration

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
    }
  }]
};
```

```bash
# Start application with PM2
pm2 start ecosystem.config.js

# Enable PM2 startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Save PM2 configuration
pm2 save

# Check application status
pm2 status
pm2 logs trynex-api
```

## Part 5: Nginx Configuration

### Step 8: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
sudo nano /etc/nginx/sites-available/trynex-ecommerce
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain or IP
    
    # Serve static files
    location /uploads/ {
        alias /var/www/trynex-ecommerce/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
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
    }
    
    # Frontend (if serving from same server)
    location / {
        root /var/www/trynex-ecommerce/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/trynex-ecommerce /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Part 6: SSL Certificate (Optional but Recommended)

### Step 9: Install SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symbolic link
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
```

## Part 7: Frontend Deployment (Static Hosting)

### Option A: Serve Frontend from Same Server

The Nginx configuration above already handles this. Your frontend will be available at your domain.

### Option B: Deploy Frontend to Netlify (Recommended)

1. **Build Frontend Locally**
   ```bash
   # On your local machine
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `dist/public` folder
   - Configure redirects by creating `dist/public/_redirects`:
   ```
   /api/* https://your-api-domain.com/api/:splat 200
   /* /index.html 200
   ```

## Part 8: Testing and Monitoring

### Step 10: Verify Deployment

```bash
# Check if API is running
curl http://your-domain.com/api/products

# Check PM2 status
pm2 status
pm2 logs trynex-api

# Check Nginx status
sudo systemctl status nginx

# Check disk space
df -h

# Check memory usage
free -h
```

### Step 11: Setup Monitoring (Optional)

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Setup log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Part 9: Backup and Maintenance

### Step 12: Setup Automated Backups

```bash
# Create backup script
nano ~/backup-script.sh
```

```bash
#!/bin/bash
# Backup script for Trynex E-commerce

# Create backup directory
mkdir -p ~/backups

# Backup uploads directory
tar -czf ~/backups/uploads-$(date +%Y%m%d).tar.gz /var/www/trynex-ecommerce/uploads/

# Keep only last 7 days of backups
find ~/backups -name "uploads-*.tar.gz" -mtime +7 -delete

echo "Backup completed: $(date)"
```

```bash
# Make script executable
chmod +x ~/backup-script.sh

# Add to crontab (daily backups at 2 AM)
crontab -e
# Add this line:
# 0 2 * * * /home/ubuntu/backup-script.sh >> /home/ubuntu/backup.log 2>&1
```

## Part 10: Domain and DNS Setup

### Step 13: Configure DNS

1. **Point Domain to EC2**
   - Go to your domain registrar
   - Create/Update A record: `your-domain.com` → `Your-EC2-Public-IP`
   - Create CNAME record: `www.your-domain.com` → `your-domain.com`

2. **Wait for DNS propagation** (can take 24-48 hours)

## Troubleshooting

### Common Issues and Solutions

1. **Application won't start**
   ```bash
   pm2 logs trynex-api
   # Check for database connection issues
   ```

2. **Nginx 502 Bad Gateway**
   ```bash
   # Check if Node.js app is running
   pm2 status
   # Check Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **File upload issues**
   ```bash
   # Check directory permissions
   ls -la /var/www/trynex-ecommerce/uploads/
   # Fix permissions if needed
   sudo chown -R ubuntu:ubuntu /var/www/trynex-ecommerce/uploads/
   chmod 755 /var/www/trynex-ecommerce/uploads/
   ```

4. **Database connection failed**
   ```bash
   # Check environment variables
   cat .env
   # Test database connection
   node -e "console.log(process.env.DATABASE_URL)"
   ```

## Security Recommendations

1. **Firewall Setup**
   ```bash
   sudo ufw enable
   sudo ufw allow ssh
   sudo ufw allow 'Nginx Full'
   ```

2. **Keep System Updated**
   ```bash
   # Setup automatic security updates
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

3. **Regular Security Audits**
   ```bash
   # Check for vulnerable packages
   npm audit
   npm audit fix
   ```

## Performance Optimization

1. **Enable Gzip Compression**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   # Uncomment gzip settings
   ```

2. **Database Optimization**
   - Monitor query performance
   - Add indexes where needed
   - Consider connection pooling

3. **Monitoring**
   ```bash
   # Install monitoring tools
   sudo apt install htop iotop
   ```

## Estimated Costs

- **t2.micro (Free Tier)**: $0/month for first year
- **t3.small (Production)**: ~$15-20/month
- **Additional costs**: 
  - Domain: ~$10-15/year
  - SSL: Free with Let's Encrypt
  - Data transfer: Varies by usage

## Support

If you encounter issues:

1. Check application logs: `pm2 logs trynex-api`
2. Check system logs: `sudo tail -f /var/log/syslog`
3. Verify configurations match the guide exactly
4. Ensure all environment variables are set correctly

## Post-Deployment Checklist

- [ ] EC2 instance is running and accessible
- [ ] Node.js application starts without errors
- [ ] Database connection is working
- [ ] API endpoints respond correctly
- [ ] File uploads work properly
- [ ] Admin panel is accessible
- [ ] Frontend loads and functions correctly
- [ ] SSL certificate is installed (if applicable)
- [ ] Backups are configured
- [ ] Monitoring is setup
- [ ] DNS is properly configured

Your Trynex Lifestyle e-commerce application should now be live and accessible to customers!

**Important**: Remember to update the API endpoints in your frontend code to point to your production domain instead of localhost before deploying the frontend.