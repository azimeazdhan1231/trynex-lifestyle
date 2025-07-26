# Fix EC2 Connection Issues - Step by Step

## Problem Analysis
From your log, I can see:
- **SSH connection timeout**: `ssh: connect to host 13.61.71.120 port 22: Connection timed out`
- **Running commands locally**: You're on Windows (MINGW64) trying to connect to EC2
- **Missing tools**: npm, pm2 not found because you're on local machine

## Solution: Fix EC2 Connection First

### Step 1: Check EC2 Instance Status
1. Go to **AWS Console** → **EC2** → **Instances**
2. Find your instance with IP `13.61.71.120`
3. Check **Instance State** - must be "running" (green)
4. If it's "stopped", click **Actions** → **Instance State** → **Start**

### Step 2: Fix Security Group (Most Common Issue)
1. Select your instance
2. Click **Security** tab at bottom
3. Click on the **Security Group** name (sg-xxxxxx)
4. Click **Edit inbound rules**
5. Ensure you have these rules:

```
Type: SSH (22)    Protocol: TCP    Port: 22    Source: 0.0.0.0/0
Type: HTTP (80)   Protocol: TCP    Port: 80    Source: 0.0.0.0/0
Type: HTTPS (443) Protocol: TCP    Port: 443   Source: 0.0.0.0/0
Type: Custom TCP  Protocol: TCP    Port: 5000  Source: 0.0.0.0/0
```

6. Click **Save rules**

### Step 3: Use Browser-Based Connection (Easiest)
Since SSH isn't working, use AWS's browser terminal:

1. **AWS Console** → **EC2** → **Instances**
2. **Select your instance**
3. Click **Connect** button (top right)
4. Choose **EC2 Instance Connect**
5. User name: `ubuntu`
6. Click **Connect**

This opens a terminal in your browser - no SSH needed!

### Step 4: Alternative - Systems Manager
If Instance Connect doesn't work:

1. **AWS Console** → **Systems Manager** → **Session Manager**
2. Click **Start session**
3. Select your instance
4. Click **Start session**

## Deploy Your Project to EC2

Once connected via browser terminal, run these commands:

### Step 1: Update System
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
pm2 --version
```

### Step 2: Setup Database
```bash
# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql << 'EOF'
CREATE DATABASE trynex_db;
CREATE USER trynex_user WITH ENCRYPTED PASSWORD 'usernameamit333';
GRANT ALL PRIVILEGES ON DATABASE trynex_db TO trynex_user;
ALTER USER trynex_user CREATEDB;
\quit
EOF
```

### Step 3: Deploy Your Project
```bash
# Clone your project
cd /home/ubuntu
git clone https://github.com/azimeazdhan1231/trynex-lifestyle.git
cd trynex-lifestyle

# Install dependencies
npm install

# Create environment file for production
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://trynex_user:usernameamit333@localhost:5432/trynex_db
SUPABASE_URL=https://ickclyevpbgmppqizfov.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja2NseWV2cGJnbXBwcWl6Zm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MTQxNzYsImV4cCI6MjA2OTA5MDE3Nn0.U51E8uTOxGkA-7qJJKlD2qlJdC0cDMGLkCDdI1IAlD0
EOF

# Setup database schema (if you have drizzle)
npm run db:push

# Start with PM2
pm2 start server/index.ts --name trynex-backend --interpreter tsx
pm2 save
pm2 startup
```

### Step 4: Configure Nginx
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
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Test Your Deployment

```bash
# Check if application is running
pm2 status

# Test locally
curl http://localhost:5000

# Check Nginx
sudo systemctl status nginx
```

Then test in browser: **http://13.61.71.120**

## If SSH Still Doesn't Work

### Option 1: Check Instance Region
Make sure you're looking at the correct AWS region where you created the instance.

### Option 2: Recreate Security Group
1. Create new Security Group with all ports open:
   - SSH (22): 0.0.0.0/0
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - Custom (5000): 0.0.0.0/0

2. Attach to your instance:
   - Actions → Security → Change security groups

### Option 3: Check Network ACLs
1. VPC → Network ACLs
2. Find your subnet's ACL
3. Ensure inbound/outbound rules allow traffic

## Common SSH Issues and Fixes

### Issue 1: Wrong Key File
Make sure you're using the correct .pem file:
```bash
# On Windows (Git Bash)
ssh -i trynex-server-v2.pem ubuntu@13.61.71.120 -v
```

### Issue 2: Key Permissions
```bash
# On Windows (Git Bash)
chmod 600 trynex-server-v2.pem
```

### Issue 3: Wrong Username
Try these usernames:
- `ubuntu` (most common)
- `ec2-user` (Amazon Linux)
- `admin` (Debian)

### Issue 4: Instance Not Ready
Wait 2-3 minutes after starting instance before trying SSH.

## Quick Status Check Commands

Once connected, verify everything:

```bash
# Check all services
sudo systemctl status nginx postgresql
pm2 status

# Check ports
sudo netstat -tulpn | grep :5000
sudo netstat -tulpn | grep :80

# Check logs
pm2 logs trynex-backend
sudo tail -f /var/log/nginx/error.log
```

Your website should be accessible at: **http://13.61.71.120**

## Key Points:
1. **Use browser terminal** if SSH fails
2. **Check security groups** first
3. **Install Node.js on EC2**, not locally
4. **Run PM2 on EC2**, not on Windows
5. **Test step by step** to identify issues