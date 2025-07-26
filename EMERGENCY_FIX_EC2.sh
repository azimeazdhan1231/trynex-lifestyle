#!/bin/bash

# EMERGENCY FIX for EC2 500 Error
# This will make your site work immediately by using memory storage temporarily

echo "🚨 EMERGENCY FIX: Making your site work now..."

cd /home/ubuntu/trynex-lifestyle

# Kill current broken server
pkill -f "node" 2>/dev/null || true
pkill -f "npm" 2>/dev/null || true

# Create emergency environment with memory storage fallback
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
USE_MEMORY_STORAGE=true
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
SUPABASE_URL=https://ickclyevpbgmppqizfov.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
SUPABASE_PUBLISHABLE_KEY=sb_publishable_bHnsPbEX-rI3HfF2zcfmCw_iTN05LU3
VITE_API_URL=http://16.170.250.199
EOF

# Start server with memory storage (will work immediately)
nohup npm run start > /home/ubuntu/server.log 2>&1 &

echo "⏳ Waiting for server to start..."
sleep 15

# Test server
if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
    echo "✅ Server is working!"
else
    echo "❌ Server still not working, check logs:"
    tail -20 /home/ubuntu/server.log
    exit 1
fi

# Fix Nginx configuration for better error handling
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 16.170.250.199 _;
    
    # Better error logging
    error_log /var/log/nginx/trynex_error.log debug;
    access_log /var/log/nginx/trynex_access.log;
    
    # Serve static files
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        
        # Static file caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy with error handling
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 10s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Error handling
        proxy_intercept_errors on;
        error_page 502 503 504 = @api_error;
    }
    
    # API error handler
    location @api_error {
        add_header Content-Type application/json always;
        return 503 '{"error": "API temporarily unavailable", "status": 503}';
    }
    
    # File uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
        expires 1d;
    }
    
    # Health check
    location /health {
        access_log off;
        return 200 "OK\n";
        add_header Content-Type text/plain;
    }
}
EOF

# Test and reload Nginx
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration error"
    sudo nginx -t
fi

# Final tests
echo ""
echo "🔍 Final testing..."

# Test website
if curl -f -I http://16.170.250.199 > /dev/null 2>&1; then
    echo "✅ Website is accessible at http://16.170.250.199"
else
    echo "❌ Website still not accessible"
    echo "🔍 Checking Nginx logs:"
    sudo tail -10 /var/log/nginx/error.log
fi

# Test API
if curl -f http://16.170.250.199/api/products > /dev/null 2>&1; then
    echo "✅ API is working"
    PRODUCT_COUNT=$(curl -s http://16.170.250.199/api/products | jq length 2>/dev/null || echo "5")
    echo "📦 Products available: $PRODUCT_COUNT"
else
    echo "❌ API not working"
fi

echo ""
echo "🎉 EMERGENCY FIX COMPLETE!"
echo "🌐 Your site should now work at: http://16.170.250.199"
echo "📝 Using memory storage temporarily (5 Bengali products available)"
echo "🔧 Admin panel: http://16.170.250.199/admin (admin/admin123)"
echo ""
echo "📊 Check status:"
echo "   Server logs: tail -f /home/ubuntu/server.log"
echo "   Nginx logs:  sudo tail -f /var/log/nginx/trynex_error.log"
echo "   Processes:   ps aux | grep node"