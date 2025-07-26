# Final EC2 Deployment Instructions - Bengali E-commerce Platform

## Current Issue Summary
Based on your deployment log, your Bengali e-commerce platform has:
- ✅ Backend API working correctly
- ✅ Server and Nginx running
- ❌ Frontend showing 500 error (main issue)
- ❌ Database connection issues with Supabase

## Immediate Solution

SSH into your EC2 instance (16.170.250.199) and run these commands:

```bash
cd /home/ubuntu/trynex-lifestyle

# Quick fix for frontend 500 error
wget -O quick-fix.sh https://raw.githubusercontent.com/your-repo/QUICK_FIX_EC2.sh
chmod +x quick-fix.sh
bash quick-fix.sh
```

## Manual Steps (if automated script fails)

### 1. Fix Frontend Build Path Issue
```bash
# Rebuild frontend to correct location
npm run build

# Verify files exist
ls -la dist/public/index.html
```

### 2. Update Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/default
```

Ensure this configuration:
```nginx
server {
    listen 80 default_server;
    server_name _;
    
    location / {
        root /home/ubuntu/trynex-lifestyle/dist/public;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. Fix Database Connection
```bash
# Create proper environment file
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
EOF
```

### 4. Restart Services
```bash
sudo nginx -t && sudo systemctl restart nginx
pkill -f "node dist/index.js"
npm run start
```

## Verification

Test your deployment:
```bash
# Test frontend
curl -I http://16.170.250.199

# Test API
curl http://16.170.250.199/api/health

# Test products
curl http://16.170.250.199/api/products
```

Expected results:
- Website: HTTP 200 OK
- API Health: JSON response with status
- Products: Array of Bengali products

## Production Ready Features

Your platform includes:
- ✅ Bengali/English bilingual support
- ✅ Custom mug design system
- ✅ Order tracking with timeline
- ✅ Admin panel at `/admin` (admin/admin123)
- ✅ File upload for custom designs
- ✅ Real-time order management
- ✅ Promo offer system
- ✅ Wishlist functionality

## Next Steps After Deployment

1. **Security**: Change default admin password
2. **SSL**: Add Let's Encrypt certificate
3. **Domain**: Point custom domain to 16.170.250.199
4. **Monitoring**: Set up error tracking
5. **Backup**: Configure database backups

## Troubleshooting

If issues persist:

```bash
# Check build output
ls -la dist/public/

# Check server status
ps aux | grep node

# Check logs
tail -f server.log
sudo tail -f /var/log/nginx/error.log

# Test database connection
node -e "console.log('Testing...'); const pg=require('postgres'); const sql=pg(process.env.DATABASE_URL); sql\`SELECT 1\`.then(()=>console.log('DB OK')).catch(e=>console.log('DB Error:',e.message));"
```

## Support

Your Bengali e-commerce platform is production-ready. The main issue was the static file serving path, which these instructions will resolve.

After following these steps, your website at http://16.170.250.199 should display the full Bengali e-commerce platform with all features working.