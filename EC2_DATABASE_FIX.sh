#!/bin/bash

# Database Connection Fix for EC2 Deployment
# This script specifically addresses Supabase connection issues

echo "🗄️ EC2 Database Connection Fix for Bengali E-commerce"
echo "=================================================="

# Navigate to project directory
cd /home/ubuntu/trynex-lifestyle

# Create proper environment configuration with SSL
echo "🔧 Setting up database environment..."
cat > .env << 'EOF'
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connect_timeout=10
EOF

echo "✅ Environment file created"

# Test database connection
echo "🧪 Testing database connection..."
node -e "
const postgres = require('postgres');

const connectionString = 'postgresql://postgres:usernameamit333@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require&connect_timeout=10';

console.log('Testing Supabase connection...');
const sql = postgres(connectionString, {
  max: 1,
  ssl: 'require',
  connect_timeout: 10,
  connection: {
    application_name: 'bengali-ecommerce-ec2'
  }
});

sql\`SELECT 1 as test, now() as timestamp\`
  .then(result => {
    console.log('✅ Database connection successful!');
    console.log('Result:', result[0]);
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Database connection failed:');
    console.log('Error:', err.message);
    console.log('Code:', err.code);
    
    if (err.message.includes('Tenant or user not found')) {
      console.log('');
      console.log('🔍 This error suggests:');
      console.log('1. Invalid username/password');
      console.log('2. Database URL is incorrect');
      console.log('3. Supabase project is not accessible');
      console.log('');
      console.log('Please verify your Supabase credentials!');
    }
    
    process.exit(1);
  });
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection test passed"
    
    # Try to push schema
    echo "🔄 Pushing database schema..."
    npm run db:push
    
    if [ $? -eq 0 ]; then
        echo "✅ Database schema updated successfully"
        
        # Restart server to use new database connection
        echo "🔄 Restarting server with new database config..."
        pkill -f "node dist/index.js" 2>/dev/null || true
        sleep 2
        nohup npm run start > server.log 2>&1 &
        
        echo "⏳ Waiting for server to start..."
        sleep 5
        
        # Test API with database
        echo "🧪 Testing API with database connection..."
        if curl -f http://localhost:5000/api/products > /dev/null 2>&1; then
            echo "✅ API responding successfully"
            
            # Try to populate sample data
            echo "📦 Populating Bengali sample products..."
            RESULT=$(curl -s -X POST http://localhost:5000/api/admin/populate-sample-data)
            echo "Population result: $RESULT"
            
            if echo "$RESULT" | grep -q "success"; then
                echo "✅ Sample data populated successfully"
            else
                echo "⚠️ Sample data population had issues"
            fi
            
        else
            echo "❌ API not responding after restart"
        fi
        
    else
        echo "❌ Database schema push failed"
        echo "This might be due to:"
        echo "1. Invalid database credentials"
        echo "2. Network connectivity issues"
        echo "3. Database permissions"
    fi
    
else
    echo "❌ Database connection test failed"
    echo ""
    echo "🔧 Troubleshooting steps:"
    echo "1. Verify your Supabase project is active"
    echo "2. Check if the database URL is correct"
    echo "3. Ensure the password is correct"
    echo "4. Test network connectivity to Supabase"
    echo ""
    echo "Alternative: Use local PostgreSQL database"
    echo "Run: sudo -u postgres createdb bengali_ecommerce"
    echo "Then update DATABASE_URL to: postgresql://postgres:your_password@localhost:5432/bengali_ecommerce"
fi

echo ""
echo "🎯 Database fix completed!"
echo "Check server logs: tail -f server.log"