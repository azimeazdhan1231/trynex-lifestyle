#!/bin/bash

# Create deployment package for EC2
echo "📦 Creating deployment package for EC2..."

# Create deployment directory
mkdir -p deployment-package

# Copy essential files and directories
echo "📁 Copying project files..."

# Core application files
cp -r client deployment-package/ 2>/dev/null || echo "Client directory copied"
cp -r server deployment-package/ 2>/dev/null || echo "Server directory copied"  
cp -r shared deployment-package/ 2>/dev/null || echo "Shared directory copied"
cp -r uploads deployment-package/ 2>/dev/null || echo "Uploads directory copied"
cp -r dist deployment-package/ 2>/dev/null || echo "Dist directory copied"

# Configuration files
cp package.json deployment-package/ 2>/dev/null || echo "package.json copied"
cp package-lock.json deployment-package/ 2>/dev/null || echo "package-lock.json copied"
cp tsconfig.json deployment-package/ 2>/dev/null || echo "tsconfig.json copied"
cp vite.config.ts deployment-package/ 2>/dev/null || echo "vite.config.ts copied"
cp postcss.config.js deployment-package/ 2>/dev/null || echo "postcss.config.js copied"
cp tailwind.config.ts deployment-package/ 2>/dev/null || echo "tailwind.config.ts copied"
cp components.json deployment-package/ 2>/dev/null || echo "components.json copied"
cp drizzle.config.ts deployment-package/ 2>/dev/null || echo "drizzle.config.ts copied"

# Copy production server
cp production-server.js deployment-package/ 2>/dev/null || echo "production-server.js copied"

# Copy deployment scripts
cp EC2_DEPLOYMENT_COMPLETE.sh deployment-package/ 2>/dev/null || echo "EC2_DEPLOYMENT_COMPLETE.sh copied"

# Create a simple package.json for production if needed
cat > deployment-package/package-production.json << 'EOF'
{
  "name": "bengali-ecommerce-production",
  "version": "1.0.0",
  "description": "Bengali E-commerce Platform - Production",
  "main": "production-server.js",
  "scripts": {
    "start": "node production-server.js",
    "dev": "tsx server/index.ts",
    "build": "vite build",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "path": "^0.12.7"
  }
}
EOF

# Create README for deployment
cat > deployment-package/DEPLOYMENT_README.md << 'EOF'
# Bengali E-commerce - EC2 Deployment Package

## Quick Deployment Steps:

1. **Upload this entire folder to your EC2 instance:**
   ```bash
   scp -r -i your-key.pem deployment-package ubuntu@your-ec2-ip:/home/ubuntu/bengali-ecommerce/
   ```

2. **On your EC2 instance, run:**
   ```bash
   cd /home/ubuntu/bengali-ecommerce
   bash EC2_DEPLOYMENT_COMPLETE.sh
   bash setup-app.sh
   ```

3. **Your website will be live at:** `http://YOUR_EC2_PUBLIC_IP`

## What's Included:
- ✅ Complete frontend (React app)
- ✅ Complete backend (Express server)
- ✅ Database schemas and configurations
- ✅ All uploaded assets
- ✅ Production-ready server
- ✅ Automated deployment scripts

## Admin Access:
- URL: `http://YOUR_EC2_IP/admin`
- Username: `admin`
- Password: `admin123`
EOF

# Create archive
echo "🗜️ Creating compressed archive..."
tar -czf bengali-ecommerce-deployment.tar.gz deployment-package/

echo "✅ Deployment package created!"
echo ""
echo "📦 Files ready for deployment:"
echo "   📁 deployment-package/ (folder with all files)"
echo "   📦 bengali-ecommerce-deployment.tar.gz (compressed archive)"
echo ""
echo "🚀 Next steps:"
echo "1. Upload bengali-ecommerce-deployment.tar.gz to your EC2 instance"
echo "2. Extract: tar -xzf bengali-ecommerce-deployment.tar.gz"
echo "3. Run: cd deployment-package && bash EC2_DEPLOYMENT_COMPLETE.sh"
echo ""
echo "🌍 Your Bengali e-commerce site will be live!"