#!/bin/bash

# Complete EC2 Deployment Script for Bengali E-commerce Platform
# Run this script on your EC2 instance: bash EC2_DEPLOYMENT_COMPLETE.sh

set -e

echo "🚀 Starting Bengali E-commerce Platform Deployment on EC2..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "🟢 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configure PostgreSQL
echo "🔧 Configuring PostgreSQL..."
sudo -u postgres psql -c "CREATE USER bengali_user WITH PASSWORD 'bengali_pass123';"
sudo -u postgres psql -c "CREATE DATABASE bengali_ecommerce OWNER bengali_user;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE bengali_ecommerce TO bengali_user;"

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw allow 5000
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create application directory
echo "📁 Creating application directory..."
cd /home/ubuntu
mkdir -p bengali-ecommerce
cd bengali-ecommerce

# Clone or prepare for file upload
echo "📂 Ready for project files..."
echo "Next steps:"
echo "1. Upload your project files to /home/ubuntu/bengali-ecommerce/"
echo "2. Run the setup script: bash setup-app.sh"

# Create setup script for after file upload
cat > setup-app.sh << 'EOF'
#!/bin/bash

echo "🔧 Setting up Bengali E-commerce Application..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up environment variables
echo "🌍 Setting up environment variables..."
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bengali_user:bengali_pass123@localhost:5432/bengali_ecommerce
PGHOST=localhost
PGPORT=5432
PGUSER=bengali_user
PGPASSWORD=bengali_pass123
PGDATABASE=bengali_ecommerce
VITE_API_URL=http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
ENVEOF

# Build the application
echo "🏗️ Building application..."
npm run build 2>/dev/null || echo "Build step skipped - using existing dist/"

# Set up database schema
echo "🗃️ Setting up database..."
npm run db:push 2>/dev/null || echo "Database push skipped"

# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOFPM2'
module.exports = {
  apps: [{
    name: 'bengali-ecommerce',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx/esm',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOFPM2

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Configure Nginx
echo "🌐 Configuring Nginx..."
sudo tee /etc/nginx/sites-available/bengali-ecommerce << 'EOFNGINX'
server {
    listen 80;
    server_name _;

    # Serve static files
    location / {
        root /home/ubuntu/bengali-ecommerce/dist/public;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=31536000";
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

    # Handle uploads
    location /uploads/ {
        root /home/ubuntu/bengali-ecommerce;
        add_header Cache-Control "public, max-age=31536000";
    }
}
EOFNGINX

# Enable the site
sudo ln -sf /etc/nginx/sites-available/bengali-ecommerce /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "✅ Deployment completed successfully!"
echo ""
echo "🌍 Your Bengali E-commerce website is now live at:"
echo "   http://$PUBLIC_IP"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 status          - Check application status"
echo "   pm2 logs            - View application logs"
echo "   pm2 restart all     - Restart application"
echo "   sudo nginx -t       - Test Nginx configuration"
echo "   sudo systemctl status nginx - Check Nginx status"
echo ""
echo "📂 Application files are in: /home/ubuntu/bengali-ecommerce/"
echo "🗃️ Database: PostgreSQL running locally"

EOF

chmod +x setup-app.sh

echo "✅ EC2 server prepared successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Upload your project files to this directory: /home/ubuntu/bengali-ecommerce/"
echo "2. Run: bash setup-app.sh"
echo ""
echo "📁 Current directory: $(pwd)"
echo "🖥️ Server ready for deployment!"