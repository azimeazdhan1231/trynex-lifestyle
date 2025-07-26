# EC2 Instance Connection & Deployment Troubleshooting

## Your Instance Details
- **Instance IP**: 16.170.226.244
- **Elastic IP**: 13.61.71.120
- **Status**: Connection Failed (from screenshot)

## Step 1: Fix Instance Connection Issues

### 1.1 Check Instance Status
1. Go to AWS Console → EC2 → Instances
2. Find your instance
3. Check the "Instance State" - it should be "running"
4. If it's "stopped", select it and click "Start instance"

### 1.2 Check Security Group Settings
1. Select your instance
2. Go to "Security" tab
3. Click on the Security Group name
4. Ensure these rules exist in "Inbound rules":
   ```
   Type: SSH (22)    Source: Your IP (or 0.0.0.0/0 for anywhere)
   Type: HTTP (80)   Source: 0.0.0.0/0
   Type: HTTPS (443) Source: 0.0.0.0/0
   Type: Custom TCP Port: 5000 Source: 0.0.0.0/0
   ```

### 1.3 Verify Key Pair
Make sure you have the correct .pem file downloaded when you created the instance.

## Step 2: Connect to Your Instance

### Method 1: Using EC2 Instance Connect (Easiest)
1. Go to AWS Console → EC2 → Instances
2. Select your instance
3. Click "Connect" button
4. Choose "EC2 Instance Connect"
5. Click "Connect" - this opens a browser-based terminal

### Method 2: Using SSH with Terminal
```bash
# Make sure your key file has correct permissions
chmod 400 your-key-file.pem

# Connect using the Elastic IP
ssh -i your-key-file.pem ubuntu@13.61.71.120
```

## Step 3: Complete Website Deployment

Once connected, run these commands step by step:

### 3.1 Update System and Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install other tools
sudo apt install -y git nginx postgresql postgresql-contrib

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
```

### 3.2 Setup PostgreSQL Database
```bash
# Install and start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE trynex_db;
CREATE USER trynex_user WITH ENCRYPTED PASSWORD 'TrynexSecure2025!';
GRANT ALL PRIVILEGES ON DATABASE trynex_db TO trynex_user;
ALTER USER trynex_user CREATEDB;
\quit
EOF

# Test database connection
psql -h localhost -U trynex_user -d trynex_db -c "SELECT 'Database ready!';"
```

### 3.3 Deploy Your Application
```bash
# Clone your project (you'll need to upload your code)
# For now, let's create the project structure
mkdir -p /home/ubuntu/trynex-ecommerce
cd /home/ubuntu/trynex-ecommerce

# Create package.json
cat > package.json << 'EOF'
{
  "name": "trynex-ecommerce",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "tsc",
    "db:push": "drizzle-kit push:pg"
  },
  "dependencies": {
    "express": "^4.18.2",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "drizzle-orm": "^0.29.3",
    "postgres": "^3.4.3"
  }
}
EOF
```

### 3.4 Upload Your Code Files
You need to transfer your project files to the EC2 instance. Here are three methods:

#### Method A: Using SCP (if you have SSH access)
```bash
# From your local machine, upload your project
scp -i your-key-file.pem -r ./trynex-project ubuntu@13.61.71.120:/home/ubuntu/
```

#### Method B: Using Git (Recommended)
```bash
# On EC2 instance, clone from GitHub
git clone https://github.com/your-username/trynex-ecommerce.git
cd trynex-ecommerce
npm install
```

#### Method C: Upload via AWS Console
1. Create a ZIP file of your project
2. Upload to S3 bucket
3. Download on EC2 instance

### 3.5 Configure Environment Variables
```bash
# Create environment file
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://trynex_user:TrynexSecure2025!@localhost:5432/trynex_db
PGUSER=trynex_user
PGPASSWORD=TrynexSecure2025!
PGDATABASE=trynex_db
PGHOST=localhost
PGPORT=5432
EOF
```

### 3.6 Setup Database Schema
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push
```

### 3.7 Start Application with PM2
```bash
# Start the application
pm2 start npm --name "trynex-app" -- run dev

# Save PM2 configuration
pm2 save
pm2 startup
# Follow the command it gives you (copy and paste it)

# Check status
pm2 status
```

### 3.8 Configure Nginx
```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 13.61.71.120;

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
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/trynex /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Step 4: Quick File Transfer Solution

If you can't use Git, here's how to transfer your files:

### 4.1 Create Application Files Manually
```bash
# Create directory structure
mkdir -p /home/ubuntu/trynex-ecommerce/{server,client/src,shared}

# Create main server file
cat > /home/ubuntu/trynex-ecommerce/server/index.ts << 'EOF'
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('client/dist'));

app.get('/api/test', (req, res) => {
  res.json({ message: 'Trynex E-commerce API is running!', timestamp: new Date().toISOString() });
});

app.get('*', (req, res) => {
  res.json({ message: 'Trynex E-commerce - Coming Soon!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Trynex E-commerce server running on port ${PORT}`);
});
EOF
```

## Step 5: Test Your Deployment

### 5.1 Test Application
```bash
# Check if PM2 is running your app
pm2 status

# Check application logs
pm2 logs trynex-app

# Test API endpoint
curl http://localhost:5000/api/test
```

### 5.2 Test External Access
Open your browser and go to:
- `http://13.61.71.120` (your Elastic IP)
- `http://13.61.71.120/api/test`

## Common Issues and Solutions

### Issue 1: Can't Connect to Instance
**Solution:**
1. Check instance is running in AWS Console
2. Verify Security Group allows SSH (port 22)
3. Use EC2 Instance Connect instead of SSH

### Issue 2: Nginx Error
**Solution:**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Issue 3: PM2 App Not Starting
**Solution:**
```bash
# Check PM2 logs
pm2 logs trynex-app

# Restart the app
pm2 restart trynex-app

# Check Node.js is installed
node --version
```

### Issue 4: Database Connection Error
**Solution:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test database connection
psql -h localhost -U trynex_user -d trynex_db
```

## Quick Commands Reference

```bash
# Check all services
sudo systemctl status nginx postgresql
pm2 status

# Restart everything
sudo systemctl restart nginx postgresql
pm2 restart all

# View logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
sudo journalctl -u postgresql

# Test connections
curl http://localhost:5000/api/test
curl http://13.61.71.120/api/test
```

## Next Steps After Basic Setup

1. Upload your complete project files
2. Configure your actual database schema
3. Set up SSL certificate
4. Configure domain name (optional)
5. Set up automated backups

Your website will be accessible at: **http://13.61.71.120**