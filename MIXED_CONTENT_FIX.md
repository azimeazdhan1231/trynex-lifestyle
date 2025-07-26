# Mixed Content Issue Fix - HTTPS Netlify to HTTP AWS

## Problem Identified ⚠️
Your Netlify site (HTTPS) cannot connect to AWS backend (HTTP) due to **Mixed Content Security Policy**.

- ✅ **Netlify Frontend**: https://trynex-lifestyle.netlify.app/ (HTTPS - Secure)
- ❌ **AWS Backend**: http://16.170.250.199 (HTTP - Not secure)
- 🚫 **Browser blocks**: HTTPS → HTTP requests for security

## Solution Options:

### Option 1: Use HTTP Netlify (Quick Fix)
Change Netlify to serve over HTTP temporarily:
1. In Netlify dashboard → Site settings → Domain management
2. Set "Force HTTPS" to OFF
3. Access site via: http://trynex-lifestyle.netlify.app

### Option 2: Add HTTPS to AWS (Recommended)
Set up SSL certificate on your AWS backend:

**On your EC2 server:**
```bash
# Install Certbot for SSL
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d yourdomain.com

# Update Nginx to serve HTTPS
```

### Option 3: Use Proxy (Alternative)
Add a proxy endpoint in Netlify functions to relay requests to HTTP backend.

## Quick Test Solution:
**On your EC2 server, update the CORS headers:**

```bash
cd /home/ubuntu/trynex-lifestyle
pm2 stop all

cat > https-fix-server.cjs << 'EOF'
const express = require('express');
const app = express();
const PORT = 5000;

// Enhanced CORS for HTTPS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://trynex-lifestyle.netlify.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Your existing product data and routes...
EOF

pm2 start https-fix-server.cjs --name "trynex-https-fix"
```

## Current Status:
- 🎯 **Frontend**: Perfect (Bengali e-commerce working)
- 🎯 **Backend**: Working (5 products available)
- ❌ **Connection**: Blocked by mixed content policy

Choose Option 1 for immediate fix or Option 2 for production-ready solution.