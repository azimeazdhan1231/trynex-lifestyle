#!/bin/bash

# EC2 Debugging Tool for Bengali E-commerce Platform
# Run this script to diagnose all deployment issues

echo "🔍 EC2 Deployment Diagnostic Tool"
echo "=================================="

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo "✅ $1"
    else
        echo "❌ $1"
    fi
}

# Basic system info
echo ""
echo "📋 System Information:"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Node.js: $(node --version 2>/dev/null || echo 'Not installed')"
echo "npm: $(npm --version 2>/dev/null || echo 'Not installed')"
echo "Nginx: $(nginx -v 2>&1 || echo 'Not installed')"

# Check project directory
echo ""
echo "📁 Project Structure:"
PROJECT_DIR="/home/ubuntu/trynex-lifestyle"
if [ -d "$PROJECT_DIR" ]; then
    echo "✅ Project directory exists"
    cd "$PROJECT_DIR"
    
    # Check key files
    echo ""
    echo "🔍 Key Files Check:"
    [ -f "package.json" ] && echo "✅ package.json" || echo "❌ package.json missing"
    [ -f "dist/index.js" ] && echo "✅ Backend built (dist/index.js)" || echo "❌ Backend not built"
    [ -f "dist/public/index.html" ] && echo "✅ Frontend built (dist/public/index.html)" || echo "❌ Frontend not built"
    [ -f ".env" ] && echo "✅ Environment file exists" || echo "❌ .env missing"
    
    # Check build directory structure
    echo ""
    echo "📦 Build Directory Contents:"
    if [ -d "dist" ]; then
        echo "dist/ structure:"
        find dist -type f | head -10
    else
        echo "❌ dist/ directory missing"
    fi
    
else
    echo "❌ Project directory not found at $PROJECT_DIR"
    exit 1
fi

# Check processes
echo ""
echo "🔄 Running Processes:"
NODE_PROCESSES=$(ps aux | grep -E "(node|npm)" | grep -v grep | wc -l)
echo "Node processes running: $NODE_PROCESSES"
if [ $NODE_PROCESSES -gt 0 ]; then
    echo "Active Node processes:"
    ps aux | grep -E "(node|npm)" | grep -v grep
fi

# Check ports
echo ""
echo "🌐 Port Status:"
if command -v netstat &> /dev/null; then
    echo "Port 5000 (Backend):"
    netstat -tulpn | grep :5000 || echo "❌ Port 5000 not listening"
    echo "Port 80 (Nginx):"
    netstat -tulpn | grep :80 || echo "❌ Port 80 not listening"
fi

# Check Nginx
echo ""
echo "🔧 Nginx Status:"
if command -v nginx &> /dev/null; then
    sudo systemctl is-active nginx &>/dev/null
    check_status "Nginx service active"
    
    echo "Nginx configuration test:"
    sudo nginx -t
    check_status "Nginx configuration valid"
    
    echo ""
    echo "Current Nginx config:"
    if [ -f "/etc/nginx/sites-available/default" ]; then
        echo "--- /etc/nginx/sites-available/default ---"
        cat /etc/nginx/sites-available/default
    fi
else
    echo "❌ Nginx not installed"
fi

# Test connectivity
echo ""
echo "🧪 Connectivity Tests:"

# Test localhost
echo "Testing localhost:5000..."
curl -I http://localhost:5000/api/products 2>/dev/null | head -1 || echo "❌ Backend API not responding"

# Test external IP
EXTERNAL_IP="16.170.250.199"
echo "Testing $EXTERNAL_IP..."
curl -I http://$EXTERNAL_IP 2>/dev/null | head -1 || echo "❌ External website not responding"

curl -I http://$EXTERNAL_IP/api/products 2>/dev/null | head -1 || echo "❌ External API not responding"

# Check environment variables
echo ""
echo "🔧 Environment Check:"
if [ -f ".env" ]; then
    echo "Environment variables (sensitive data hidden):"
    cat .env | sed 's/password:[^@]*/password:***/' | sed 's/postgresql:\/\/[^:]*:[^@]*@/postgresql:\/\/user:***@/'
else
    echo "❌ .env file missing"
fi

# Check database connectivity
echo ""
echo "🗄️  Database Test:"
if [ -f ".env" ]; then
    source .env
    if [ ! -z "$DATABASE_URL" ]; then
        echo "Testing database connection..."
        node -e "
        const postgres = require('postgres');
        const sql = postgres('$DATABASE_URL');
        sql\`SELECT 1 as test\`.then(() => {
            console.log('✅ Database connection successful');
            process.exit(0);
        }).catch(err => {
            console.log('❌ Database connection failed:', err.message);
            process.exit(1);
        });
        " 2>/dev/null || echo "❌ Database connection test failed"
    fi
fi

# Check logs
echo ""
echo "📊 Recent Logs:"
if [ -f "server.log" ]; then
    echo "Last 10 lines of server.log:"
    tail -10 server.log
else
    echo "❌ No server.log found"
fi

echo ""
echo "Nginx error log (last 5 lines):"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "❌ Cannot read nginx error log"

# Test build process
echo ""
echo "🔨 Build Test:"
echo "Testing if build process works..."
npm run build > build_test.log 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build process successful"
    rm -f build_test.log
else
    echo "❌ Build process failed"
    echo "Build errors:"
    cat build_test.log
fi

# Summary and recommendations
echo ""
echo "==============================================="
echo "🎯 DIAGNOSTIC SUMMARY & RECOMMENDATIONS"
echo "==============================================="

ISSUES_FOUND=false

# Frontend check
if [ ! -f "dist/public/index.html" ]; then
    echo "🔴 CRITICAL: Frontend not built properly"
    echo "   → Run: npm run build"
    ISSUES_FOUND=true
fi

# Backend check
if [ ! -f "dist/index.js" ]; then
    echo "🔴 CRITICAL: Backend not built properly"
    echo "   → Run: npm run build"
    ISSUES_FOUND=true
fi

# Server check
if ! ps aux | grep -q "node dist/index.js"; then
    echo "🔴 CRITICAL: Server not running"
    echo "   → Run: npm run start"
    ISSUES_FOUND=true
fi

# Nginx check
if ! sudo systemctl is-active nginx &>/dev/null; then
    echo "🔴 CRITICAL: Nginx not running"
    echo "   → Run: sudo systemctl start nginx"
    ISSUES_FOUND=true
fi

if [ "$ISSUES_FOUND" = false ]; then
    echo "✅ All major components appear to be working"
    echo "   If website still shows 500 error, check Nginx logs"
else
    echo ""
    echo "🔧 Recommended fix command:"
    echo "   bash QUICK_FIX_EC2.sh"
fi

echo ""
echo "📋 Diagnostic complete!"