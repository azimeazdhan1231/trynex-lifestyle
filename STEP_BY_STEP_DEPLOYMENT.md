# 🚀 Trynex Lifestyle - Complete Step-by-Step Deployment Guide

## 📋 Before We Start
Your website is **100% functional** with:
- ✅ Database connected to Supabase
- ✅ All APIs working
- ✅ Frontend ready
- ✅ Products synchronized

## 🎯 Deployment Sequence (Follow This Order)

### STEP 1: Prepare Code for GitHub (5 minutes)

1. **Create .gitignore file** (if not exists)
```bash
echo "node_modules/
.env
.env.local
uploads/
dist/
*.log" > .gitignore
```

2. **Initialize git and commit**
```bash
git init
git add .
git commit -m "Initial commit: Complete Bengali e-commerce platform"
```

### STEP 2: Create GitHub Repository (2 minutes)

1. **Go to GitHub.com**
   - Login to your account
   - Click "New Repository"
   - Repository name: `trynex-lifestyle`
   - Description: `Bengali e-commerce platform for custom mugs`
   - Set to Public
   - Don't initialize with README (you already have code)
   - Click "Create Repository"

2. **Push your code**
```bash
git remote add origin https://github.com/YOURUSERNAME/trynex-lifestyle.git
git branch -M main
git push -u origin main
```

### STEP 3: Deploy Frontend to Netlify (10 minutes)

1. **Go to Netlify.com**
   - Login/signup
   - Click "New site from Git"
   - Choose GitHub
   - Select your `trynex-lifestyle` repository

2. **Configure Build Settings**
   ```
   Base directory: (leave empty)
   Build command: npm run build
   Publish directory: dist
   ```

3. **Set Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add these variables:
   ```
   VITE_API_URL = https://your-backend-url.com
   VITE_SUPABASE_URL = https://ickclyevpbgmppqizfov.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
   ```

4. **Deploy**
   - Click "Deploy Site"
   - Wait for build to complete
   - Your frontend will be live at: `https://your-site-name.netlify.app`

### STEP 4: Setup AWS EC2 Backend (20 minutes)

#### 4A: Create EC2 Instance

1. **Login to AWS Console**
   - Go to EC2 Dashboard
   - Click "Launch Instance"

2. **Configure Instance**
   ```
   Name: trynex-backend
   AMI: Ubuntu Server 22.04 LTS (Free Tier)
   Instance Type: t3.micro (Free Tier)
   Key Pair: Create new or use existing
   ```

3. **Security Group Settings**
   ```
   SSH (22): Your IP
   HTTP (80): Anywhere
   HTTPS (443): Anywhere
   Custom TCP (5000): Anywhere
   ```

4. **Launch Instance**

#### 4B: Connect and Setup Server

1. **Connect to your EC2**
```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

2. **Install Node.js and PM2**
```bash
# Update system
sudo apt update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install git -y
```

3. **Clone and Setup Project**
```bash
# Clone your repository
git clone https://github.com/YOURUSERNAME/trynex-lifestyle.git
cd trynex-lifestyle

# Install dependencies
npm install

# Build the project
npm run build
```

4. **Set Environment Variables**
```bash
# Create environment file
nano .env

# Add these lines:
DATABASE_URL=postgresql://postgres.ickclyevpbgmppqizfov:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
PORT=5000
NODE_ENV=production
```

5. **Start the Application**
```bash
# Start with PM2
pm2 start dist/server/index.js --name trynex-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it gives you
```

6. **Setup Nginx (Optional but Recommended)**
```bash
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/trynex-backend

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/trynex-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### STEP 5: Update Frontend with Backend URL (5 minutes)

1. **Get your EC2 public IP/domain**
   - Example: `http://3.123.456.789` or `http://your-domain.com`

2. **Update Netlify Environment Variables**
   - Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
   - Update `VITE_API_URL` to your EC2 URL: `http://your-ec2-ip`

3. **Redeploy Frontend**
   - In Netlify: Deploys → Trigger Deploy → Deploy Site

### STEP 6: Final Testing (5 minutes)

1. **Test Backend API**
```bash
curl http://your-ec2-ip:5000/api/products
```

2. **Test Frontend**
   - Visit your Netlify URL
   - Check if products load
   - Test adding items to cart
   - Test checkout process

### STEP 7: Domain Setup (Optional, 10 minutes)

1. **Buy Domain** (optional)
   - Use Namecheap, GoDaddy, or AWS Route 53

2. **Point Domain to Services**
   ```
   Frontend: Add CNAME record pointing to Netlify
   Backend: Add A record pointing to EC2 IP
   ```

## 🎉 You're Live!

Your complete e-commerce website will be running at:
- **Frontend**: `https://your-site.netlify.app`
- **Backend**: `http://your-ec2-ip:5000`
- **Database**: Supabase (already configured)

## 📞 Need Help?

If you encounter any issues during deployment:
1. Check the logs: `pm2 logs trynex-backend`
2. Restart services: `pm2 restart trynex-backend`
3. Check Nginx: `sudo systemctl status nginx`

## 💰 Estimated Costs

- **Netlify**: Free (up to 100GB bandwidth)
- **AWS EC2**: ~$5-10/month (t3.micro)
- **Supabase**: Free (up to 500MB database)
- **Domain**: ~$10-15/year (optional)

**Total Monthly Cost: $5-10** for a fully functional e-commerce website!

---
**Ready to start? Begin with STEP 1 and follow each step in order. Your website will be live within 1 hour!**