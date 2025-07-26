# Netlify Deployment Guide - Trynex Bengali E-commerce

## Prerequisites ✅
- **Backend**: AWS EC2 server running at http://16.170.250.199 ✅
- **Frontend**: React app configured in `/client` folder ✅  
- **GitHub**: Repository ready for connection ✅

## Step-by-Step Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Netlify deployment with AWS backend"
git push origin main
```

### 2. Deploy to Netlify

#### Option A: Connect GitHub Repository
1. Go to [Netlify](https://netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub account
4. Select your `trynex-lifestyle` repository
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`

#### Option B: Manual Deploy
1. In your local terminal:
```bash
cd client
npm run build
```
2. Drag the `client/dist` folder to Netlify deploy area

### 3. Environment Variables (Important!)
In Netlify dashboard → Site settings → Environment variables:
```
VITE_API_URL = http://16.170.250.199
VITE_BACKEND_URL = http://16.170.250.199/api
```

### 4. Configure Redirects
The `netlify.toml` file is already created in the root with:
- SPA routing support
- Build configuration  
- Environment variables
- Redirect rules

## Expected Result
- **Frontend**: Beautiful Bengali e-commerce site on Netlify
- **Backend**: API and data on AWS EC2 (16.170.250.199)
- **Features**: Full functionality with search, cart, Bengali language

## Troubleshooting

### CORS Issues
If you get CORS errors, make sure your AWS server has:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
```

### Build Errors
Make sure all dependencies are installed:
```bash
cd client
npm install
npm run build
```

### API Connection Issues
Test your backend first:
```bash
curl http://16.170.250.199/api/test
curl http://16.170.250.199/api/products
```

## Final Architecture
```
┌─────────────────┐    HTTP/HTTPS    ┌─────────────────┐
│   Netlify       │ ────────────────► │   AWS EC2       │
│   Frontend      │                  │   Backend API   │
│   (React App)   │                  │   16.170.250.199│
└─────────────────┘                  └─────────────────┘
```

Your complete Bengali e-commerce site will be live with:
- Frontend: Hosted on Netlify (fast, global CDN)
- Backend: Running on AWS EC2 (your data and API)
- Database: PostgreSQL on AWS
- Features: Full Bengali language support, search, cart system