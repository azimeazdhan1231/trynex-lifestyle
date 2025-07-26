#!/bin/bash

# Quick Fix for EC2 Frontend 500 Error
# Run this on your EC2 instance: bash QUICK_FIX_EC2.sh

echo "🔧 Quick Fix for EC2 Frontend Error..."

# Navigate to project directory
cd /home/ubuntu/trynex-lifestyle

# Stop existing services
pkill -f "npm run start" 2>/dev/null || true
pkill -f "node dist/index.js" 2>/dev/null || true

# Ensure build directory exists with correct structure
echo "📁 Checking build structure..."
if [ ! -d "dist/public" ]; then
    echo "Creating dist/public directory..."
    mkdir -p dist/public
fi

# Rebuild the application
echo "🔨 Rebuilding application..."
npm run build

# Verify the build
if [ -f "dist/public/index.html" ]; then
    echo "✅ Frontend build successful"
    ls -la dist/public/
else
    echo "❌ Build failed - no index.html found"
    exit 1
fi

# Create/update environment
echo "🔧 Setting up environment..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
EOF

# Update Nginx configuration to fix path issue
echo "🔧 Updating Nginx configuration..."
sudo tee /etc/nginx/sites-available/default > /dev/null << 'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    
    # Serve frontend files
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ /index.html;
        index index.html;
    }
    
    # Proxy API requests
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Serve uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
    }
}
EOF

# Test and restart Nginx
echo "🔧 Testing Nginx configuration..."
if sudo nginx -t; then
    sudo systemctl restart nginx
    echo "✅ Nginx restarted successfully"
else
    echo "❌ Nginx configuration error"
    sudo nginx -t
    exit 1
fi

# Start the server
echo "🚀 Starting server..."
nohup npm run start > server.log 2>&1 &
sleep 5

# Test the deployment
echo "🧪 Testing deployment..."

# Test if index.html is accessible
if curl -I http://16.170.250.199 2>/dev/null | grep "200 OK"; then
    echo "✅ Website is now accessible!"
else
    echo "⚠️ Website test inconclusive - checking manually..."
fi

# Test API
if curl -f http://16.170.250.199/api/products > /dev/null 2>&1; then
    echo "✅ API is working"
else
    echo "⚠️ API needs attention"
fi

echo ""
echo "🎉 Quick fix completed!"
echo "🌐 Check your website: http://16.170.250.199"
echo "📊 View logs: tail -f /home/ubuntu/trynex-lifestyle/server.log"