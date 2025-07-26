# Fix EC2 500 Internal Server Error

## Issues Found:
1. ❌ Supabase database connection failing ("Tenant or user not found")
2. ❌ Frontend showing 500 error while API works
3. ❌ Nginx proxy configuration issue

## Complete Fix Commands

SSH into your EC2 and run these commands:

```bash
# Check current status
cd /home/ubuntu/trynex-lifestyle
tail -20 /home/ubuntu/server.log
sudo tail -10 /var/log/nginx/error.log

# Stop current server
pkill -f "node" 2>/dev/null || true
pkill -f "npm" 2>/dev/null || true

# Fix 1: Update database connection for Supabase
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
SUPABASE_URL=https://ickclyevpbgmppqizfov.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
SUPABASE_PUBLISHABLE_KEY=sb_publishable_bHnsPbEX-rI3HfF2zcfmCw_iTN05LU3
VITE_API_URL=http://16.170.250.199
EOF

# Fix 2: Restart server with proper error handling
npm run start > /home/ubuntu/server.log 2>&1 &

# Wait for server
sleep 10

# Fix 3: Test API directly
curl -I http://localhost:5000/api/products

# Fix 4: Improved Nginx configuration
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 16.170.250.199 _;
    
    # Serve static files first
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ @fallback;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Fallback to index.html for SPA routes
    location @fallback {
        try_files /index.html =404;
    }
    
    # API proxy with better error handling
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
        
        # Handle server errors
        proxy_intercept_errors on;
        error_page 502 503 504 /50x.html;
    }
    
    # File uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
        expires 1d;
    }
    
    # Custom error page
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# Test everything
echo "🔍 Testing fixes..."
curl -I http://16.170.250.199
curl -I http://16.170.250.199/api/products

echo "📊 Server status:"
ps aux | grep -E "(node|npm)" | grep -v grep

echo "📊 Recent server logs:"
tail -10 /home/ubuntu/server.log

echo "✅ Fix completed!"
echo "🌐 Try accessing: http://16.170.250.199"
```

## If Still Getting 500 Error:

```bash
# Check detailed server logs
tail -50 /home/ubuntu/server.log

# Check if server is actually running on port 5000
netstat -tlnp | grep 5000

# Restart with memory storage temporarily
echo "USE_MEMORY_STORAGE=true" >> .env
pkill -f "node"
npm run start > /home/ubuntu/server.log 2>&1 &

# Test again
curl -I http://16.170.250.199
```

The main issue is likely the Supabase connection failing. The fallback to memory storage should make the site work while we debug the database connection.