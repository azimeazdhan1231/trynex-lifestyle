#!/bin/bash

# Complete EC2 Deployment Script for Bengali E-commerce Platform
# This script fixes all deployment issues on Ubuntu 24.04 EC2

set -e  # Exit on any error

echo "🚀 Starting Complete EC2 Deployment for Bengali E-commerce Platform..."

# Configuration
DOMAIN="16.170.250.199"
PROJECT_DIR="/home/ubuntu/trynex-lifestyle"
NGINX_CONFIG="/etc/nginx/sites-available/default"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Kill any existing processes
print_status "Stopping existing services..."
pkill -f "npm run start" 2>/dev/null || true
pkill -f "node dist/index.js" 2>/dev/null || true
sudo systemctl stop nginx 2>/dev/null || true

# Install required packages
print_status "Installing required packages..."
sudo apt update
sudo apt install -y curl nginx postgresql postgresql-contrib jq

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Navigate to project directory
cd $PROJECT_DIR

# Create production environment file with proper database configuration
print_status "Setting up environment configuration..."
cat > .env << EOF
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
VITE_API_URL=http://${DOMAIN}
EOF

# Install dependencies
print_status "Installing dependencies..."
npm install --production=false

# Build the application
print_status "Building the application..."
npm run build

# Verify build output exists
if [ ! -f "dist/public/index.html" ]; then
    print_error "Build failed - index.html not found in dist/public/"
    exit 1
fi

print_status "Build successful - frontend assets created"

# Setup database schema
print_status "Setting up database schema..."
npm run db:push || print_warning "Database schema push failed - continuing with deployment"

# Create nginx configuration
print_status "Configuring Nginx..."
sudo tee $NGINX_CONFIG > /dev/null << EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Main website route
    location / {
        root $PROJECT_DIR/dist/public;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
    
    # File uploads
    location /uploads/ {
        root $PROJECT_DIR;
        expires 1M;
        add_header Cache-Control "public";
    }
    
    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000/api/health;
    }
}
EOF

# Test nginx configuration
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_status "Nginx configuration is valid"
else
    print_error "Nginx configuration is invalid"
    exit 1
fi

# Start nginx
sudo systemctl enable nginx
sudo systemctl start nginx
print_status "Nginx started successfully"

# Start the application server
print_status "Starting application server..."
nohup npm run start > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
print_status "Waiting for server to start..."
sleep 10

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    print_status "Server started successfully (PID: $SERVER_PID)"
else
    print_error "Server failed to start"
    echo "Server log:"
    tail -20 server.log
    exit 1
fi

# Wait for API to be ready
print_status "Waiting for API to be ready..."
for i in {1..30}; do
    if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
        break
    fi
    sleep 2
    echo -n "."
done
echo

# Test the deployment
print_status "Testing deployment..."

# Test website
if curl -f -I http://$DOMAIN > /dev/null 2>&1; then
    print_status "Website is accessible at http://$DOMAIN"
else
    print_warning "Website accessibility test failed - checking logs..."
    echo "Nginx error log:"
    sudo tail -10 /var/log/nginx/error.log
fi

# Test API
if curl -f http://$DOMAIN/api/products > /dev/null 2>&1; then
    print_status "API is working"
    PRODUCT_COUNT=$(curl -s http://$DOMAIN/api/products | jq length 2>/dev/null || echo "unknown")
    print_status "Products in database: $PRODUCT_COUNT"
else
    print_warning "API test failed"
fi

# Populate sample data
print_status "Populating sample Bengali products..."
POPULATE_RESULT=$(curl -s -X POST http://localhost:5000/api/admin/populate-sample-data || echo '{"message":"Failed to populate"}')
echo "Populate result: $POPULATE_RESULT"

# Create systemd service for auto-restart
print_status "Creating systemd service..."
sudo tee /etc/systemd/system/bengali-ecommerce.service > /dev/null << EOF
[Unit]
Description=Bengali E-commerce Platform
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$PROJECT_DIR
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable bengali-ecommerce
print_status "Systemd service created and enabled"

# Final status check
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
print_status "Website: http://$DOMAIN"
print_status "Admin Panel: http://$DOMAIN/admin (admin/admin123)"
echo "=========================================="

# Show file structure verification
echo "📁 Build verification:"
echo "Frontend build: $(ls -la dist/public/index.html 2>/dev/null && echo "✅ Found" || echo "❌ Missing")"
echo "Backend build: $(ls -la dist/index.js 2>/dev/null && echo "✅ Found" || echo "❌ Missing")"

# Show process status
echo ""
echo "🔍 Service Status:"
echo "Server PID: $SERVER_PID ($(ps -p $SERVER_PID > /dev/null && echo "Running" || echo "Stopped"))"
echo "Nginx: $(sudo systemctl is-active nginx)"

# Show useful commands
echo ""
echo "📊 Useful Commands:"
echo "View server logs: tail -f $PROJECT_DIR/server.log"
echo "View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "Restart server: sudo systemctl restart bengali-ecommerce"
echo "Restart nginx: sudo systemctl restart nginx"

print_status "Deployment script completed successfully!"