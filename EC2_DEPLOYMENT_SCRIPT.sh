#!/bin/bash

# Complete EC2 deployment script for Bengali E-commerce
# IP: 16.170.250.199
# Database: Supabase (not local)

echo "🚀 Starting deployment to EC2 (16.170.250.199) with Supabase database"

# Stop any existing processes
sudo pkill -f "node" 2>/dev/null || true
sudo pkill -f "npm" 2>/dev/null || true

# Clean up and get fresh code
cd /home/ubuntu
rm -rf trynex-lifestyle

# Clone latest version
git clone https://github.com/azimeazdhan1231/trynex-lifestyle.git
cd trynex-lifestyle

# Create production environment with your Supabase credentials
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://ickclyevpbgmppqizfov.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
SUPABASE_PUBLISHABLE_KEY=sb_publishable_bHnsPbEX-rI3HfF2zcfmCw_iTN05LU3
VITE_API_URL=http://16.170.250.199
EOF

echo "✅ Environment configured"

# Install dependencies
npm install
echo "✅ Dependencies installed"

# Initialize database schema in Supabase
npm run db:push
echo "✅ Database schema pushed to Supabase"

# Build application
npm run build
echo "✅ Application built"

# Start server in background
nohup npm run start > /home/ubuntu/server.log 2>&1 &
echo "✅ Server started"

# Wait for server to be ready
sleep 15

# Test server is running
if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
    echo "✅ Server is responding"
else
    echo "❌ Server not responding, check logs:"
    tail -20 /home/ubuntu/server.log
    exit 1
fi

# Populate real Bengali products in Supabase
echo "📦 Populating Bengali products in Supabase database..."
POPULATE_RESULT=$(curl -s -X POST http://localhost:5000/api/admin/populate-sample-data 2>/dev/null)
echo "📦 Populate result: $POPULATE_RESULT"

# Configure Nginx for new IP
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 16.170.250.199 _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # Serve React frontend
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            add_header Cache-Control "public, max-age=31536000";
        }
    }
    
    # Proxy API requests to backend
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
        
        # No caching for API
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }
    
    # File uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/trynex /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx configured and reloaded"
else
    echo "❌ Nginx configuration error"
    sudo nginx -t
    exit 1
fi

# Test the deployment
echo ""
echo "🔍 Testing deployment..."

# Test website
if curl -f -I http://16.170.250.199 > /dev/null 2>&1; then
    echo "✅ Website is accessible at http://16.170.250.199"
else
    echo "❌ Website not accessible"
fi

# Test API
if curl -f http://16.170.250.199/api/products > /dev/null 2>&1; then
    echo "✅ API is working"
    PRODUCT_COUNT=$(curl -s http://16.170.250.199/api/products | jq length 2>/dev/null || echo "unknown")
    echo "📦 Products in database: $PRODUCT_COUNT"
else
    echo "❌ API not working"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "🌐 Website: http://16.170.250.199"
echo "🔧 Admin Panel: http://16.170.250.199/admin (admin/admin123)"
echo "📊 Server logs: tail -f /home/ubuntu/server.log"
echo "📊 Nginx logs: sudo tail -f /var/log/nginx/error.log"

# Show final status
ps aux | grep -E "(node|npm)" | grep -v grep
echo "✅ Server processes running above"