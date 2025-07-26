# PostgreSQL Setup Guide for AWS EC2 - Step by Step

## What is PostgreSQL?
PostgreSQL is a powerful database system that will store all your website data (products, orders, users, etc.). Think of it as a secure filing cabinet for your e-commerce site.

## Step-by-Step PostgreSQL Setup

### Step 1: Install PostgreSQL
```bash
# Update your system first
sudo apt update

# Install PostgreSQL and additional tools
sudo apt install postgresql postgresql-contrib -y

# Check if installation was successful
sudo systemctl status postgresql
```

You should see "active (running)" in green text.

### Step 2: Access PostgreSQL for the First Time
```bash
# Switch to the postgres user (the database administrator)
sudo -u postgres psql
```

You'll see a prompt that looks like: `postgres=#`

### Step 3: Create Your Database and User
Copy and paste these commands one by one in the PostgreSQL prompt:

```sql
-- Create a database for your website
CREATE DATABASE trynex_db;

-- Create a user account for your application
CREATE USER trynex_user WITH ENCRYPTED PASSWORD 'MySecurePassword123!';

-- Give the user full access to the database
GRANT ALL PRIVILEGES ON DATABASE trynex_db TO trynex_user;

-- Allow the user to create additional tables if needed
ALTER USER trynex_user CREATEDB;

-- Exit PostgreSQL
\quit
```

**Important:** Replace `'MySecurePassword123!'` with your own strong password. Remember this password!

### Step 4: Test Your Database Connection
```bash
# Test if you can connect with your new user
psql -h localhost -U trynex_user -d trynex_db
```

It will ask for the password you created. Type it and press Enter.
If successful, you'll see: `trynex_db=#`

Type `\quit` to exit.

### Step 5: Configure PostgreSQL for Your Application

#### 5.1 Find PostgreSQL Version
```bash
# Check which version is installed
sudo -u postgres psql -c "SELECT version();"
```

You'll see something like "PostgreSQL 14.x" or "PostgreSQL 15.x". Remember this number.

#### 5.2 Edit Configuration Files
Replace `14` with your PostgreSQL version number:

```bash
# Edit the main configuration file
sudo nano /etc/postgresql/14/main/postgresql.conf
```

**What to do in this file:**
1. Press `Ctrl + W` to search
2. Type `listen_addresses` and press Enter
3. Find the line that looks like: `#listen_addresses = 'localhost'`
4. Remove the `#` and change it to: `listen_addresses = '*'`
5. Press `Ctrl + X`, then `Y`, then Enter to save

#### 5.3 Configure Access Permissions
```bash
# Edit the access control file
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

**What to do in this file:**
1. Scroll to the bottom of the file
2. Add this line at the end:
```
host    all             all             127.0.0.1/32            md5
```
3. Press `Ctrl + X`, then `Y`, then Enter to save

### Step 6: Restart PostgreSQL
```bash
# Restart PostgreSQL to apply changes
sudo systemctl restart postgresql

# Make sure it starts automatically when server reboots
sudo systemctl enable postgresql

# Check if it's running properly
sudo systemctl status postgresql
```

### Step 7: Create Your Database URL
Your application needs a connection string. It looks like this:

```
postgresql://trynex_user:MySecurePassword123!@localhost:5432/trynex_db
```

**Format explanation:**
- `postgresql://` - tells the app it's a PostgreSQL database
- `trynex_user` - your database username
- `MySecurePassword123!` - your password
- `localhost` - since database is on same server
- `5432` - PostgreSQL default port
- `trynex_db` - your database name

### Step 8: Test Everything Works
```bash
# Test connection one more time
psql -h localhost -U trynex_user -d trynex_db -c "SELECT 'Database connection successful!';"
```

If you see "Database connection successful!", everything is working!

## Common Issues and Solutions

### Issue 1: "psql: command not found"
**Solution:** PostgreSQL isn't installed properly
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib -y
```

### Issue 2: "FATAL: password authentication failed"
**Solution:** Wrong password or user doesn't exist
```bash
# Reset the user password
sudo -u postgres psql
ALTER USER trynex_user WITH PASSWORD 'YourNewPassword';
\quit
```

### Issue 3: "could not connect to server"
**Solution:** PostgreSQL service isn't running
```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Issue 4: Can't edit configuration files
**Solution:** Need proper permissions
```bash
# Make sure you use sudo
sudo nano /etc/postgresql/14/main/postgresql.conf
```

## What's Next?

After PostgreSQL is set up:

1. **For Development:** Your app can connect using the database URL
2. **For Production:** You'll use this same setup but with stronger security
3. **For Backups:** We'll set up automatic backups later

## Security Notes

1. **Never share your database password**
2. **Use strong passwords (12+ characters with numbers and symbols)**
3. **The database is only accessible from your server (localhost)**
4. **For production, we'll add more security layers**

## Quick Reference Commands

```bash
# Start PostgreSQL
sudo systemctl start postgresql

# Stop PostgreSQL
sudo systemctl stop postgresql

# Check status
sudo systemctl status postgresql

# Connect as admin
sudo -u postgres psql

# Connect as your user
psql -h localhost -U trynex_user -d trynex_db

# List all databases
\l

# List all tables in current database
\dt

# Exit PostgreSQL
\quit
```

Your PostgreSQL database is now ready for your e-commerce application!