#!/bin/bash

# Complete EC2 deployment fix script
# This will fix all database and routing issues

echo "🔧 Starting EC2 deployment fix..."

# Kill any existing servers
pkill -f "npm run start" 2>/dev/null || true
pkill -f "node dist/index.js" 2>/dev/null || true

# Set up local PostgreSQL database
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'bengali123';" 2>/dev/null || true
sudo -u postgres psql -c "DROP DATABASE IF EXISTS bengali_ecommerce;"
sudo -u postgres psql -c "CREATE DATABASE bengali_ecommerce OWNER postgres;"

# Create proper environment file
echo "NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:bengali123@localhost:5432/bengali_ecommerce
VITE_API_URL=http://172.31.45.165" > .env

# Initialize database schema
npm run db:push

# Start server in background
npm run start > server.log 2>&1 &

# Wait for server to start
sleep 5

# Populate with real data
curl -X POST http://localhost:5000/api/admin/populate-sample-data

echo "✅ Deployment fix completed!"
echo "🌍 Website: http://172.31.45.165"
echo "🔧 Admin: http://172.31.45.165/admin"