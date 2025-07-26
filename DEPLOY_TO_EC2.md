# Deploy Bengali E-commerce to EC2 (16.170.250.199)

## Complete Deployment Commands

SSH into your EC2 instance and run these commands:

```bash
# Navigate to project directory
cd /home/ubuntu

# Clean up previous deployment
rm -rf trynex-lifestyle
pkill -f "npm" 2>/dev/null || true

# Clone latest code
git clone https://github.com/azimeazdhan1231/trynex-lifestyle.git
cd trynex-lifestyle

# Create production environment file with Supabase database
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://ickclyevpbgmppqizfov.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
SUPABASE_PUBLISHABLE_KEY=sb_publishable_bHnsPbEX-rI3HfF2zcfmCw_iTN05LU3
VITE_API_URL=http://16.170.250.199
EOF

# Install dependencies
npm install

# Push database schema to Supabase
npm run db:push

# Build the application
npm run build

# Start server in background
nohup npm run start > server.log 2>&1 &

# Wait for server to start
sleep 10

# Populate Bengali products in Supabase database
curl -X POST http://localhost:5000/api/admin/populate-sample-data

# Configure Nginx for new IP
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 16.170.250.199;
    
    # Serve React app
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }
    
    # API proxy to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
    
    # File uploads
    location /uploads/ {
        root /home/ubuntu/trynex-lifestyle;
        add_header Cache-Control "public, max-age=86400";
    }
}
EOF

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/trynex /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx

# Test deployment
echo "🔍 Testing website..."
curl -I http://16.170.250.199

echo "🔍 Testing API..."
curl -s http://localhost:5000/api/products | head -100

echo ""
echo "✅ Deployment complete!"
echo "🌐 Website: http://16.170.250.199"
echo "🔧 Admin Panel: http://16.170.250.199/admin"
echo "📊 Check logs: tail -f server.log"
```

## What This Does:

1. **Uses Your Supabase Database**: Connects to your real database, not local storage
2. **Real Bengali Products**: Populates authentic products in your Supabase database  
3. **Proper Nginx Config**: Routes traffic correctly to your new IP
4. **Production Ready**: Builds optimized frontend and starts backend server
5. **Complete Environment**: Sets all your database credentials and API keys

## Expected Results:

- ✅ Website live at http://16.170.250.199
- ✅ Real Bengali products from Supabase database
- ✅ Order placement working with your database
- ✅ Admin panel functional at /admin
- ✅ No memory storage fallback - pure database operation

Run these commands and your site will be live with real data!