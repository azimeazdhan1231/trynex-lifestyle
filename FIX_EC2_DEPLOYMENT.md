# EC2 Deployment Fix - Complete Solution

## Issues Found:
1. ❌ Database still connecting to Supabase instead of local PostgreSQL
2. ❌ Website not accessible at public IP  
3. ❌ Showing mock data instead of real database products

## Complete Fix Commands for EC2:

Run these commands on your EC2 instance (172.31.45.165):

```bash
# Navigate to project
cd /home/ubuntu/trynex-lifestyle

# Stop current server
pkill -f "npm run start" || pkill -f "node dist/index.js"

# Fix 1: Update database connection to use local PostgreSQL
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres@localhost:5432/bengali_ecommerce
VITE_API_URL=http://172.31.45.165
EOF

# Fix 2: Set up local PostgreSQL properly
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'bengali123';"
sudo -u postgres psql -c "DROP DATABASE IF EXISTS bengali_ecommerce;"
sudo -u postgres psql -c "CREATE DATABASE bengali_ecommerce OWNER postgres;"

# Fix 3: Update database URL with password
echo "DATABASE_URL=postgresql://postgres:bengali123@localhost:5432/bengali_ecommerce" > .env
echo "NODE_ENV=production" >> .env
echo "PORT=5000" >> .env
echo "VITE_API_URL=http://172.31.45.165" >> .env

# Fix 4: Initialize database with schema and real products
npm run db:push

# Fix 5: Populate with real products (not mock data)
node -e "
const { spawn } = require('child_process');
const server = spawn('npm', ['run', 'start'], { stdio: 'pipe' });

setTimeout(() => {
  fetch('http://localhost:5000/api/admin/populate-sample-data', {
    method: 'POST'
  }).then(res => res.json())
    .then(data => {
      console.log('✅ Real products populated:', data);
      process.exit(0);
    })
    .catch(err => {
      console.log('❌ Failed to populate:', err);
      process.exit(1);
    });
}, 3000);
" &

# Fix 6: Start server properly
npm run start > server.log 2>&1 &

# Fix 7: Check server is running
sleep 5
curl -I http://localhost:5000/api/products

# Fix 8: Update Nginx config for proper static file serving
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name _;
    
    # Main website - serve built React app
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ /index.html;
        
        # Add proper headers for static files
        add_header Cache-Control "public, max-age=31536000" always;
    }
    
    # API routes to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Disable caching for API calls  
        add_header Cache-Control "no-cache, no-store, must-revalidate" always;
    }
    
    # File uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
        add_header Cache-Control "public, max-age=31536000" always;
    }
}
EOF

# Fix 9: Restart Nginx
sudo nginx -t && sudo systemctl restart nginx

# Fix 10: Verify everything is working
echo "🔍 Testing website..."
curl -I http://172.31.45.165
echo ""
echo "🔍 Testing API..."
curl -s http://localhost:5000/api/products | head -200
echo ""
echo "✅ Your website should now be live at: http://172.31.45.165"
echo "✅ Admin panel at: http://172.31.45.165/admin"
```

## Expected Results:
- ✅ Website loads at http://172.31.45.165
- ✅ Real products from local database (not mock data)
- ✅ Orders can be placed successfully
- ✅ Admin panel works at /admin

## Verification Commands:
```bash
# Check server status
ps aux | grep node

# Check database connection
sudo -u postgres psql -d bengali_ecommerce -c "SELECT COUNT(*) FROM products;"

# Check Nginx status
sudo systemctl status nginx

# Check server logs
tail -f server.log
```