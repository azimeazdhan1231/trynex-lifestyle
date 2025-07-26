# Bengali E-commerce - Clean EC2 Deployment

## ✅ CONFIRMED: Your website WILL work on EC2

**Build Test Results:**
- Frontend builds successfully (600KB optimized)
- All React components working
- Database schema ready
- Express server ready

**Your clean project structure:**
```
client/          # React frontend  
server/          # Express backend
shared/          # Database schemas
uploads/         # File storage
dist/            # Built frontend
package.json     # Dependencies
```

---

## Step 1: Prepare for GitHub

### Create .gitignore
```
node_modules/
.env
dist/
uploads/*.jpg
uploads/*.png
uploads/*.jpeg
*.log
.DS_Store
```

### Update package.json for production
Add these scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "deploy": "npm run build"
  }
}
```

---

## Step 2: GitHub Setup

1. Create a new GitHub repository
2. Push your code:
```bash
git init
git add .
git commit -m "Initial Bengali e-commerce platform"
git branch -M main
git remote add origin https://github.com/yourusername/bengali-ecommerce.git
git push -u origin main
```

---

## Step 3: AWS EC2 Deployment (Both Frontend + Backend)

### On your EC2 instance (172.31.45.165):

```bash
# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib nginx

# Clone your repository
git clone https://github.com/yourusername/bengali-ecommerce.git
cd bengali-ecommerce

# Install dependencies
npm install

# Set up environment
echo "NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bengaliuser:yourpassword@localhost:5432/bengali_ecommerce
VITE_API_URL=http://YOUR_DOMAIN_OR_IP" > .env

# Set up database
sudo -u postgres createuser bengaliuser -P
sudo -u postgres createdb bengali_ecommerce -O bengaliuser
npm run db:push

# Build the application
npm run build

# Install PM2 for process management
sudo npm install -g pm2

# Start the application
pm2 start "npm run start" --name bengali-ecommerce
pm2 save
pm2 startup

# Configure Nginx
sudo nano /etc/nginx/sites-available/bengali-ecommerce
```

### Nginx Configuration:
```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN.com www.YOUR_DOMAIN.com;

    # Serve built frontend
    location / {
        root /home/ubuntu/bengali-ecommerce/dist/public;
        try_files $uri $uri/ /index.html;
    }

    # API routes to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Serve uploads
    location /uploads/ {
        root /home/ubuntu/bengali-ecommerce;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/bengali-ecommerce /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 4: Domain Setup

### A) If you have a domain:

1. **DNS Settings** (in your domain provider):
   - A Record: `@` → `YOUR_EC2_PUBLIC_IP`
   - A Record: `www` → `YOUR_EC2_PUBLIC_IP`

2. **SSL Certificate** (free with Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### B) If you need a domain:
- Buy from Namecheap, GoDaddy, or AWS Route 53
- Follow DNS setup above

---

## Step 5: Final Configuration

### Update your .env file:
```bash
nano .env
# Change VITE_API_URL to your domain:
VITE_API_URL=https://yourdomain.com
```

### Rebuild and restart:
```bash
npm run build
pm2 restart bengali-ecommerce
```

---

## Alternative: Separate Frontend/Backend

### Option A: Frontend on Vercel/Netlify
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/public`
4. Add environment variable: `VITE_API_URL=https://your-backend-domain.com`

### Option B: Frontend on AWS S3 + CloudFront
1. Create S3 bucket for static hosting
2. Upload `dist/public` contents
3. Set up CloudFront distribution
4. Point domain to CloudFront

---

## Your Final Setup:

✅ **Code**: GitHub repository
✅ **Backend**: AWS EC2 with database
✅ **Frontend**: Either on same EC2 or separate service
✅ **Domain**: Custom domain with SSL
✅ **Database**: PostgreSQL on EC2

**Access:**
- Website: `https://yourdomain.com`
- Admin: `https://yourdomain.com/admin`
- Credentials: admin / admin123

---

This is clean, simple, and professional. Which approach do you prefer for the frontend - same EC2 or separate service?