# AWS EC2 Deployment Guide - Trynex Bengali E-commerce Platform

## Overview
Complete guide to deploy your Bengali e-commerce platform on AWS EC2 with PostgreSQL database, SSL certificates, and production optimizations.

## Prerequisites
- AWS Account with billing enabled
- Domain name (optional but recommended)
- Basic knowledge of SSH and Linux commands

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. **Name**: `Trynex-Ecommerce-Server`
3. **AMI**: Ubuntu Server 22.04 LTS (Free Tier eligible)
4. **Instance Type**: `t2.medium` (minimum recommended for production)
5. **Key Pair**: Create new key pair and download `.pem` file
6. **Security Group**: Create with these rules:
   - SSH (22) - Your IP only
   - HTTP (80) - Anywhere (0.0.0.0/0)
   - HTTPS (443) - Anywhere (0.0.0.0/0)
   - Custom TCP (5000) - Anywhere (0.0.0.0/0) [temporary]

### 1.2 Allocate Elastic IP
1. Go to EC2 → Elastic IPs → Allocate Elastic IP
2. Associate with your instance
3. Note down the Elastic IP address

## Step 2: Connect and Setup Server

### 2.1 SSH Connection
```bash
# Make key file secure
chmod 400 your-key.pem

# Connect to instance
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP
```

### 2.2 Update System and Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install additional tools
sudo apt install -y git nginx certbot python3-certbot-nginx pm2 postgresql postgresql-contrib

# Verify installations
node --version
npm --version
nginx -v
```

## Step 3: Setup PostgreSQL Database

**Important:** Follow the detailed PostgreSQL setup guide in `POSTGRESQL_SETUP_GUIDE.md` for complete step-by-step instructions.

### 3.1 Quick Setup Commands
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Access PostgreSQL as admin
sudo -u postgres psql

# Create database and user (copy one by one)
CREATE DATABASE trynex_db;
CREATE USER trynex_user WITH ENCRYPTED PASSWORD 'YourSecurePassword123!';
GRANT ALL PRIVILEGES ON DATABASE trynex_db TO trynex_user;
ALTER USER trynex_user CREATEDB;
\quit

# Configure for local connections
sudo nano /etc/postgresql/14/main/postgresql.conf
# Find: #listen_addresses = 'localhost'
# Change to: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf  
# Add at end: host all all 127.0.0.1/32 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
sudo systemctl enable postgresql
```

**Your Database URL will be:**
```
postgresql://trynex_user:YourSecurePassword123!@localhost:5432/trynex_db
```

### 3.2 Test Database Connection
```bash
# Test local connection
psql -h localhost -U trynex_user -d trynex_db
# Enter password when prompted
\quit
```

## Step 4: Deploy Application

### 4.1 Clone and Setup Application
```bash
# Clone your repository (adjust URL as needed)
git clone https://github.com/your-username/trynex-ecommerce.git
cd trynex-ecommerce

# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2
```

### 4.2 Configure Environment Variables
```bash
# Create production environment file
nano .env.production

# Add these variables:
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://trynex_user:your_secure_password_here@localhost:5432/trynex_db
PGUSER=trynex_user
PGPASSWORD=your_secure_password_here
PGDATABASE=trynex_db
PGHOST=localhost
PGPORT=5432
```

### 4.3 Setup Database Schema
```bash
# Run database setup
npm run db:push

# Optional: Populate with sample data
node populate-database.js
```

### 4.4 Build and Start Application
```bash
# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
# Follow the instructions provided by the startup command
```

### 4.5 Create PM2 Ecosystem File
```bash
# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'trynex-ecommerce',
    script: 'npm',
    args: 'run dev',
    cwd: '/home/ubuntu/trynex-ecommerce',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/home/ubuntu/.pm2/logs/trynex-error.log',
    out_file: '/home/ubuntu/.pm2/logs/trynex-out.log',
    log_file: '/home/ubuntu/.pm2/logs/trynex-combined.log'
  }]
};
EOF
```

## Step 5: Configure Nginx Reverse Proxy

### 5.1 Create Nginx Configuration
```bash
# Create site configuration
sudo nano /etc/nginx/sites-available/trynex

# Add this configuration:
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;

    # Serve static files
    location /uploads/ {
        alias /home/ubuntu/trynex-ecommerce/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API and backend routes
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

    # Frontend routes
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

# Enable the site
sudo ln -s /etc/nginx/sites-available/trynex /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Step 6: Setup SSL Certificate (Optional but Recommended)

### 6.1 Configure Domain (if you have one)
1. Point your domain's A record to your Elastic IP
2. Wait for DNS propagation (5-30 minutes)

### 6.2 Install SSL Certificate
```bash
# Install SSL certificate (replace with your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Step 7: Configure Firewall and Security

### 7.1 Setup UFW Firewall
```bash
# Enable firewall
sudo ufw enable

# Allow essential ports
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw allow 5432/tcp    # PostgreSQL (local only)

# Check status
sudo ufw status
```

### 7.2 Secure PostgreSQL
```bash
# Edit PostgreSQL config for security
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change the line to be more restrictive:
# host all all 127.0.0.1/32 md5  # Local connections only

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Step 8: Setup Monitoring and Logs

### 8.1 Configure Log Rotation
```bash
# Create logrotate configuration
sudo nano /etc/logrotate.d/trynex

# Add:
/home/ubuntu/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

### 8.2 Setup Basic Monitoring
```bash
# Install htop for system monitoring
sudo apt install htop

# Monitor application
pm2 monit

# Check logs
pm2 logs trynex-ecommerce
```

## Step 9: Create Backup Scripts

### 9.1 Database Backup Script
```bash
# Create backup directory
mkdir -p /home/ubuntu/backups

# Create backup script
cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
DB_NAME="trynex_db"
DB_USER="trynex_user"

pg_dump -h localhost -U $DB_USER $DB_NAME > $BACKUP_DIR/trynex_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "trynex_backup_*.sql" -mtime +7 -delete

echo "Database backup completed: trynex_backup_$DATE.sql"
EOF

# Make executable
chmod +x /home/ubuntu/backup-db.sh

# Add to crontab for daily backups at 2 AM
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

## Step 10: Final Configuration and Testing

### 10.1 Update Security Group
1. Go to AWS Console → EC2 → Security Groups
2. Remove port 5000 access (app now runs through Nginx)
3. Keep only ports 22, 80, 443

### 10.2 Test Application
```bash
# Check if application is running
pm2 status

# Test local access
curl http://localhost:5000

# Test external access
curl http://YOUR_ELASTIC_IP
```

### 10.3 Admin Panel Access
- URL: `http://YOUR_DOMAIN_OR_IP/admin`
- Username: `admin`
- Password: `admin123`

## Production Optimizations

### Performance Tuning
```bash
# Optimize PM2 for production
pm2 start ecosystem.config.js --env production -i max

# Enable gzip compression in Nginx
sudo nano /etc/nginx/nginx.conf
# Uncomment gzip settings

# Restart services
sudo systemctl restart nginx
pm2 restart all
```

### Database Optimization
```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/14/main/postgresql.conf

# Add these optimizations:
shared_preload_libraries = 'pg_stat_statements'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Maintenance Commands

```bash
# Application management
pm2 restart trynex-ecommerce
pm2 stop trynex-ecommerce
pm2 delete trynex-ecommerce
pm2 logs trynex-ecommerce

# System updates
sudo apt update && sudo apt upgrade -y

# Database maintenance
sudo -u postgres psql -d trynex_db -c "VACUUM ANALYZE;"

# SSL certificate renewal (automatic)
sudo certbot renew
```

## Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   pm2 logs trynex-ecommerce
   cd /home/ubuntu/trynex-ecommerce
   npm run dev  # Test manually
   ```

2. **Database connection issues**
   ```bash
   sudo systemctl status postgresql
   sudo -u postgres psql -c "\l"  # List databases
   ```

3. **Nginx configuration errors**
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   tail -f /var/log/nginx/error.log
   ```

4. **SSL certificate issues**
   ```bash
   sudo certbot certificates
   sudo certbot renew --dry-run
   ```

## Cost Optimization

### EC2 Instance Types
- **Development/Testing**: t2.micro (Free Tier)
- **Small Production**: t2.small ($16/month)
- **Medium Production**: t2.medium ($33/month)
- **High Traffic**: t3.large ($67/month)

### Additional AWS Services
- **CloudFront CDN**: $1-10/month (recommended)
- **Route 53 DNS**: $0.50/month per domain
- **Elastic Load Balancer**: $16/month (for high availability)
- **RDS PostgreSQL**: $15-50/month (managed database alternative)

## Security Best Practices

1. **Regular Updates**
   - Keep system packages updated
   - Update Node.js and npm regularly
   - Monitor security advisories

2. **Access Control**
   - Use SSH keys only (disable password authentication)
   - Implement fail2ban for SSH protection
   - Regular security group reviews

3. **Monitoring**
   - Set up CloudWatch alerts
   - Monitor application logs
   - Track database performance

4. **Backups**
   - Daily database backups
   - Application file backups
   - Test restore procedures

## Support and Maintenance

### Regular Tasks
- Weekly: Check system resources and logs
- Monthly: Review security updates and patches
- Quarterly: Database maintenance and optimization
- Annually: SSL certificate renewal (if not automatic)

### Monitoring URLs
- Application: `http://YOUR_DOMAIN`
- Admin Panel: `http://YOUR_DOMAIN/admin`
- Server Status: `sudo systemctl status nginx postgresql`
- Application Status: `pm2 status`

---

## Quick Commands Reference

```bash
# Application Control
pm2 restart all
pm2 stop all
pm2 delete all
pm2 logs

# System Services
sudo systemctl restart nginx
sudo systemctl restart postgresql
sudo systemctl status nginx
sudo systemctl status postgresql

# Database
sudo -u postgres psql
\l  # List databases
\c trynex_db  # Connect to database
\dt  # List tables
\quit

# Logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
pm2 logs trynex-ecommerce
```

Your Bengali e-commerce platform is now successfully deployed on AWS EC2 with production-grade configuration, security, and monitoring!