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
