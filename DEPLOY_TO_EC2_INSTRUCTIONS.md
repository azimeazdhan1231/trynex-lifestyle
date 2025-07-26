# Deploy Bengali E-commerce to EC2 - Complete Guide

## Step 1: Prepare EC2 Server

On your EC2 instance, run these commands:

```bash
# Download and run the deployment preparation script
curl -O https://raw.githubusercontent.com/your-repo/EC2_DEPLOYMENT_COMPLETE.sh
chmod +x EC2_DEPLOYMENT_COMPLETE.sh
bash EC2_DEPLOYMENT_COMPLETE.sh
```

Or copy the EC2_DEPLOYMENT_COMPLETE.sh file to your server and run it.

## Step 2: Upload Project Files

You have several options to upload your project files:

### Option A: Using SCP (Recommended)
```bash
# From your local machine, compress and upload the project
tar -czf bengali-ecommerce.tar.gz client server shared package.json package-lock.json tsconfig.json vite.config.ts postcss.config.js tailwind.config.ts components.json uploads dist

# Upload to EC2
scp -i your-key.pem bengali-ecommerce.tar.gz ubuntu@your-ec2-ip:/home/ubuntu/bengali-ecommerce/

# On EC2, extract files
cd /home/ubuntu/bengali-ecommerce
tar -xzf bengali-ecommerce.tar.gz
```

### Option B: Using rsync
```bash
# From your local machine
rsync -av -e "ssh -i your-key.pem" --exclude node_modules --exclude .git . ubuntu@your-ec2-ip:/home/ubuntu/bengali-ecommerce/
```

### Option C: Using Git (if you have a repository)
```bash
# On EC2
cd /home/ubuntu/bengali-ecommerce
git clone https://github.com/your-username/your-repo.git .
```

## Step 3: Complete Deployment

On your EC2 instance:

```bash
cd /home/ubuntu/bengali-ecommerce
bash setup-app.sh
```

## Step 4: Configure for Production

The deployment script will:
- ✅ Install all dependencies
- ✅ Set up PostgreSQL database
- ✅ Configure environment variables
- ✅ Build the application
- ✅ Start the app with PM2
- ✅ Configure Nginx reverse proxy
- ✅ Set up firewall rules

## Step 5: Access Your Live Website

Your website will be available at: `http://YOUR_EC2_PUBLIC_IP`

## Key Files for EC2 Deployment

Make sure these files are included when uploading:

### Required Files:
- `package.json` and `package-lock.json`
- `client/` directory (entire frontend)
- `server/` directory (entire backend)
- `shared/` directory (shared schemas)
- `tsconfig.json`
- `vite.config.ts`
- `postcss.config.js`
- `tailwind.config.ts`
- `components.json`
- `uploads/` directory (existing uploaded files)
- `dist/` directory (if already built)

### Environment Configuration:
The setup script will automatically create `.env` with:
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://bengali_user:bengali_pass123@localhost:5432/bengali_ecommerce
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP
```

## Troubleshooting

### If PM2 fails to start:
```bash
pm2 logs
pm2 restart all
```

### If Nginx fails:
```bash
sudo nginx -t
sudo systemctl status nginx
sudo systemctl restart nginx
```

### If database connection fails:
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

### Check application status:
```bash
pm2 status
curl http://localhost:5000/api/products
```

## Admin Access

After deployment:
- Admin Panel: `http://YOUR_EC2_IP/admin`
- Username: `admin`
- Password: `admin123`

## Security Considerations

For production, consider:
1. Setting up SSL/TLS certificates
2. Changing default admin credentials
3. Setting up database backups
4. Configuring log rotation
5. Setting up monitoring

Your Bengali e-commerce platform will be fully operational with all features including product management, order tracking, and bilingual support!