# 🚀 EXACT DEPLOYMENT STEPS - Follow This Order

## Current Status: ✅ Ready to Deploy
- Backend API: Working ✅
- Database: Connected to Supabase ✅
- Frontend: Functional ✅
- Code: Complete ✅

---

## STEP 1: GITHUB SETUP (5 minutes)

### 1A: Prepare Files
```bash
# Create .gitignore if not exists
echo "node_modules/
.env
.env.local
uploads/
dist/
*.log" > .gitignore
```

### 1B: Initialize Git
```bash
git init
git add .
git commit -m "Complete Bengali e-commerce platform"
```

### 1C: Create GitHub Repository
1. Go to **github.com**
2. Click **"New Repository"**
3. Repository name: **`trynex-lifestyle`**
4. Set to **Public**
5. Click **"Create Repository"**

### 1D: Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/trynex-lifestyle.git
git branch -M main
git push -u origin main
```

---

## STEP 2: NETLIFY FRONTEND (10 minutes)

### 2A: Deploy to Netlify
1. Go to **netlify.com**
2. Click **"New site from Git"**
3. Choose **GitHub**
4. Select **`trynex-lifestyle`** repository

### 2B: Build Settings
```
Base directory: (leave empty)
Build command: npm run build
Publish directory: dist
```

### 2C: Environment Variables (IMPORTANT!)
Go to **Site Settings → Environment Variables** and add:
```
VITE_API_URL = http://YOUR_EC2_IP:5000
VITE_SUPABASE_URL = https://ickclyevpbgmppqizfov.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
```

**Note**: Update `VITE_API_URL` after creating EC2 in Step 3

---

## STEP 3: AWS EC2 BACKEND (20 minutes)

### 3A: Create EC2 Instance
1. Login to **AWS Console**
2. Go to **EC2 Dashboard**
3. Click **"Launch Instance"**

**Settings:**
```
Name: trynex-backend
AMI: Ubuntu Server 22.04 LTS
Instance Type: t3.micro (Free Tier)
Key Pair: Create new or use existing
```

**Security Groups:**
```
SSH (22): Your IP only
HTTP (80): 0.0.0.0/0
HTTPS (443): 0.0.0.0/0
Custom TCP (5000): 0.0.0.0/0
```

4. Click **"Launch Instance"**
5. **Note down your Public IP address**

### 3B: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 3C: Install Dependencies
```bash
# Update system
sudo apt update

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 and Git
sudo npm install -g pm2
sudo apt install git -y
```

### 3D: Setup Project
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/trynex-lifestyle.git
cd trynex-lifestyle

# Install dependencies
npm install

# Build project
npm run build
```

### 3E: Environment Variables
```bash
# Create .env file
nano .env

# Add these exact lines:
DATABASE_URL=postgresql://postgres.ickclyevpbgmppqizfov:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
PORT=5000
NODE_ENV=production
```

### 3F: Start Application
```bash
# Start with PM2
pm2 start dist/server/index.js --name trynex-backend

# Make it restart on boot
pm2 startup
pm2 save
```

### 3G: Test Backend
```bash
curl http://localhost:5000/api/products
```

---

## STEP 4: CONNECT FRONTEND TO BACKEND (5 minutes)

### 4A: Update Netlify Environment
1. Go to **Netlify Dashboard**
2. Your Site → **Site Settings** → **Environment Variables**
3. Edit `VITE_API_URL` to: **`http://YOUR_EC2_PUBLIC_IP:5000`**

### 4B: Redeploy Frontend
1. In Netlify: **Deploys** → **Trigger Deploy** → **Deploy Site**
2. Wait for deployment to complete

---

## STEP 5: FINAL TESTING (5 minutes)

### 5A: Test Backend API
```bash
curl http://YOUR_EC2_IP:5000/api/products
```

### 5B: Test Complete Website
1. Visit your **Netlify URL**
2. Check if products load
3. Test shopping cart
4. Test checkout process

---

## 🎉 YOU'RE LIVE!

**Your Website URLs:**
- **Frontend**: https://your-site-name.netlify.app
- **Backend**: http://your-ec2-ip:5000
- **Database**: Already configured ✅

**Monthly Cost**: ~$5-10 for EC2

---

## ⚠️ IMPORTANT NOTES

1. **Replace placeholders:**
   - `YOUR_USERNAME` with your GitHub username
   - `YOUR_EC2_PUBLIC_IP` with actual EC2 IP
   - `your-key.pem` with your actual key file

2. **Security:**
   - Never share your .pem key file
   - Keep your Supabase credentials secure

3. **Support:**
   - If PM2 stops: `pm2 restart trynex-backend`
   - Check logs: `pm2 logs trynex-backend`

---

**READY TO START? Begin with STEP 1 and follow exactly. Your website will be live in 45 minutes!**