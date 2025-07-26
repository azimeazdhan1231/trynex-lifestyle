# Netlify Frontend Deployment Guide

This guide will help you deploy your Trynex Lifestyle e-commerce frontend to Netlify while keeping your backend on AWS EC2.

## Prerequisites

- Netlify account (free tier is sufficient)
- GitHub account
- Your backend already deployed on AWS EC2
- Domain name (optional)

## Step 1: Prepare Your Frontend for Production

### 1.1 Update API Endpoints

First, update your frontend to point to your production API:

```bash
# Create production environment file
touch .env.production
```

Add your production API URL:
```env
VITE_API_URL=https://your-ec2-domain.com
# or
VITE_API_URL=https://your-ec2-ip-address
```

### 1.2 Update Frontend Code

Edit `client/src/lib/queryClient.ts` to use environment variable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = `${API_BASE_URL}${queryKey[0]}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      },
    },
  },
});

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
```

### 1.3 Build Frontend

```bash
# Build the frontend for production
npm run build
```

This creates a `dist/public` folder with your production-ready frontend.

## Step 2: Deploy to Netlify

### Method A: Direct Upload (Quickest)

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign up or log in

2. **Deploy Site**
   - Click "Add new site" → "Deploy manually"
   - Drag and drop your `dist/public` folder
   - Your site will be deployed instantly!

3. **Configure Redirects**
   Create `dist/public/_redirects` file:
   ```
   /api/* https://your-ec2-domain.com/api/:splat 200
   /* /index.html 200
   ```

### Method B: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your repository

3. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist/public
   ```

4. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-ec2-domain.com`

5. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy

## Step 3: Custom Domain (Optional)

### 3.1 Add Custom Domain

1. **In Netlify Dashboard**
   - Go to Site settings → Domain management
   - Click "Add custom domain"
   - Enter your domain (e.g., `trynexlifestyle.com`)

2. **Update DNS Settings**
   Go to your domain registrar and update DNS:
   ```
   Type: CNAME
   Name: www
   Value: your-netlify-subdomain.netlify.app

   Type: A
   Name: @
   Value: 75.2.60.5 (Netlify's IP)
   ```

### 3.2 Enable HTTPS

Netlify automatically provides free SSL certificates via Let's Encrypt.

## Step 4: Configure CORS on Backend

Update your AWS EC2 backend to allow requests from Netlify:

```javascript
// In your Express server
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

## Step 5: Test Your Deployment

1. **Frontend Functionality**
   - Browse products
   - Add to cart
   - User registration/login
   - Place test order

2. **API Integration**
   - Check browser network tab
   - Verify API calls reach your EC2 backend
   - Test file uploads work correctly

## Troubleshooting

### Common Issues

1. **API Calls Failing**
   ```
   Solution: Check CORS settings on backend
   Verify VITE_API_URL is correct
   ```

2. **Build Failures**
   ```
   Solution: Check Node.js version compatibility
   Clear npm cache: npm ci
   ```

3. **404 Errors on Page Refresh**
   ```
   Solution: Ensure _redirects file is in place
   /* /index.html 200
   ```

4. **Mixed Content Errors**
   ```
   Solution: Ensure your EC2 API uses HTTPS
   Use SSL certificate on EC2 instance
   ```

## Performance Optimization

### 1. Enable Netlify Features

- **Asset optimization**: Automatically enabled
- **Form handling**: For contact forms
- **Edge functions**: For advanced logic

### 2. CDN Configuration

Netlify automatically provides global CDN for your assets.

### 3. Caching Headers

Add to `netlify.toml`:
```toml
[[headers]]
  for = "/static/*"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"
```

## Monitoring and Analytics

### 1. Netlify Analytics

Enable in site dashboard for visitor insights.

### 2. Error Monitoring

Add error tracking service:
```javascript
// Add to your main App component
window.addEventListener('error', (event) => {
  console.error('Frontend error:', event.error);
  // Send to monitoring service
});
```

## Continuous Deployment

With GitHub integration, every push to main branch automatically:
1. Triggers new build
2. Deploys updated site
3. Invalidates CDN cache

## Cost Estimation

**Netlify Free Tier:**
- 100GB bandwidth/month
- 300 build minutes/month
- Free SSL certificate
- Global CDN

**Pro Features ($19/month):**
- 1TB bandwidth
- Unlimited build minutes
- Advanced forms
- Split testing

## Final Checklist

- [ ] Frontend builds successfully
- [ ] API endpoints updated for production
- [ ] CORS configured on backend
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] _redirects file in place
- [ ] Environment variables set
- [ ] Site functions correctly
- [ ] Mobile responsive
- [ ] Performance optimized

Your Trynex Lifestyle frontend is now live on Netlify with professional hosting, global CDN, and automatic deployments!

## Support

If you encounter issues:
1. Check Netlify build logs
2. Verify EC2 backend is running
3. Test API endpoints directly
4. Check browser console for errors

Your e-commerce site is now professionally deployed and ready for customers!