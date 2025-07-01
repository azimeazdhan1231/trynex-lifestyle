
# 🚀 TryNex Lifestyle Deployment Guide

## Overview
This guide will help you deploy your TryNex Lifestyle e-commerce website using:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: MongoDB Atlas

## Prerequisites
1. GitHub account
2. Netlify account
3. Render account
4. MongoDB Atlas account

## 📊 Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (choose free tier)

### Step 2: Configure Database
1. Create a database user:
   - Username: `trynex_user`
   - Password: (generate a strong password)
2. Add IP whitelist: `0.0.0.0/0` (allow all IPs)
3. Get connection string:
   - Format: `mongodb+srv://trynex_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trynex?retryWrites=true&w=majority`

## 🖥️ Backend Deployment (Render)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Make sure your `package.json` has correct scripts

### Step 2: Deploy to Render
1. Go to [Render.com](https://render.com)
2. Connect your GitHub account
3. Create new "Web Service"
4. Select your repository
5. Configure:
   - **Name**: `trynex-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`

### Step 3: Set Environment Variables
Add these environment variables in Render:
```
DATABASE_URL=mongodb+srv://trynex_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/trynex?retryWrites=true&w=majority
WHATSAPP_PHONE=8801940689487
NODE_ENV=production
PORT=5000
```

### Step 4: Initialize Data
After deployment, visit: `https://your-backend-url.onrender.com/api/init-data`

## 🌐 Frontend Deployment (Netlify)

### Step 1: Build Configuration
Create `netlify.toml` in your root directory:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Connect your GitHub account
3. Import your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### Step 3: Set Environment Variables
Add this environment variable in Netlify:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

## 🔧 Final Configuration

### Update CORS in Backend
The backend is already configured to allow cross-origin requests.

### Test Your Deployment
1. Visit your Netlify URL
2. Test product browsing
3. Test cart functionality
4. Test order placement
5. Check admin panel at `/admin`

## 📱 WhatsApp Integration

### Setup WhatsApp Business
1. Get a WhatsApp Business account
2. Update the phone number in Render environment variables:
   ```
   WHATSAPP_PHONE=880XXXXXXXXXX
   ```

## 🛍️ Key Features Included

### ✅ Complete E-commerce Functionality
- 8 product categories with sample products
- Custom t-shirts, mugs, tumblers, hoodies, caps, keychains, phone cases, pillows
- Product customization (text, color, size, notes)
- Shopping cart with voucher system
- **Voucher Code**: TRYNEX15 (15% discount)

### ✅ Order Management
- Real-time order tracking
- Admin dashboard
- Customer information management
- WhatsApp integration for orders

### ✅ Professional Features
- Bengali/English bilingual support
- Mobile-responsive design
- SEO optimization
- Professional UI/UX

## 🎯 What You Need to Provide

### Essential Information
1. **MongoDB URI**: Your connection string from Atlas
2. **WhatsApp Number**: Your business WhatsApp number
3. **Render Backend URL**: After deploying backend

### Domain Setup (Optional)
- Custom domain for Netlify
- Custom domain for Render

## 📋 Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Connection string obtained
- [ ] Backend deployed to Render
- [ ] Environment variables set in Render
- [ ] Sample data initialized
- [ ] Frontend deployed to Netlify
- [ ] API URL configured in Netlify
- [ ] Website tested end-to-end
- [ ] Admin panel accessible
- [ ] WhatsApp integration working

## 🔍 Testing Your Website

### Frontend Tests
1. Home page loads correctly
2. Product categories work
3. Product details display
4. Cart functionality works
5. Voucher code TRYNEX15 applies 15% discount
6. Checkout form submits

### Backend Tests
1. API endpoints respond
2. Database connection works
3. Orders are created
4. Admin dashboard loads

### Mobile Tests
1. Responsive design works
2. Touch interactions work
3. Bengali fonts display correctly

## 🆘 Troubleshooting

### Common Issues
1. **CORS errors**: Check API URL in frontend env vars
2. **Database connection**: Verify MongoDB URI
3. **Build failures**: Check Node.js version compatibility
4. **WhatsApp not working**: Verify phone number format

## 🎉 Success!

Once deployed, your website will have:
- Professional e-commerce functionality
- Real-time order management
- WhatsApp customer communication
- Bengali language support
- Mobile optimization
- Voucher system (TRYNEX15)
- Admin dashboard

Your customers can now browse products, customize items, apply vouchers, and place orders!
