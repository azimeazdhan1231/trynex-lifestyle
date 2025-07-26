# EC2 Deployment Commands for Your Bengali E-commerce Site

You're already connected to your EC2 instance. Run these commands in order:

## Step 1: System Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential tools
sudo apt install -y git nginx postgresql postgresql-contrib unzip

# Install PM2 globally
sudo npm install -g pm2

# Verify installations
node --version
npm --version
pm2 --version
```

## Step 2: Database Setup
```bash
# Start PostgreSQL
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
```

## Step 3: Upload Your Project Files
Choose one of these methods:

### Method A: Create project structure manually
```bash
mkdir -p /home/ubuntu/trynex-ecommerce
cd /home/ubuntu/trynex-ecommerce
```

### Method B: If you have GitHub repo
```bash
git clone https://github.com/your-username/trynex-ecommerce.git
cd trynex-ecommerce
```

## Step 4: Install Dependencies and Start
```bash
# Install project dependencies
npm install

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

# Build the project
npm run build

# Start with PM2
pm2 start npm --name "trynex-app" -- run dev

# Save PM2 configuration
pm2 save
pm2 startup
```

## Step 5: Configure Nginx
```bash
# Create Nginx configuration
sudo cat > /etc/nginx/sites-available/trynex << 'EOF'
server {
    listen 80;
    server_name 51.21.144.52;

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

## Step 6: Test Your Deployment
```bash
# Check PM2 status
pm2 status

# Test local access
curl http://localhost:5000

# Check logs
pm2 logs trynex-app
```

Your website will be accessible at: **http://51.21.144.52**

Start with Step 1 and let me know when you complete each step!