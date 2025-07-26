const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const cors = require('cors');

// Import routes - using dynamic import for ES modules
let routes;

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [`http://${process.env.PUBLIC_IP}`, 'http://localhost:3000']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist', 'public')));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes - load dynamically
async function loadRoutes() {
  try {
    const routesModule = await import('./server/routes.js');
    routes = routesModule.default || routesModule;
    
    // Apply API routes
    app.use('/api', routes);
    
    console.log('✅ Routes loaded successfully');
  } catch (error) {
    console.error('❌ Error loading routes:', error);
    
    // Fallback basic routes
    app.get('/api/health', (req, res) => {
      res.json({ status: 'OK', message: 'Bengali E-commerce API is running' });
    });
    
    app.get('/api/products', (req, res) => {
      res.json([
        {
          id: '1',
          name: 'Premium Love Mug',
          nameBn: 'প্রিমিয়াম ভালোবাসার মগ',
          price: 550,
          description: 'Perfect mug for your loved ones',
          descriptionBn: 'আপনার প্রিয়জনদের জন্য নিখুঁত মগ',
          image: '/api/placeholder/300/300',
          category: 'mugs',
          categoryBn: 'মগ',
          inStock: true,
          featured: true
        }
      ]);
    });
  }
}

// Placeholder image endpoint
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  
  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#666" text-anchor="middle" dy=".3em">
        ${width}×${height}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Catch all handler for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Initialize server
async function startServer() {
  try {
    await loadRoutes();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Bengali E-commerce Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌍 Access at: http://localhost:${PORT}`);
      
      if (process.env.PUBLIC_IP) {
        console.log(`🌐 Public access: http://${process.env.PUBLIC_IP}:${PORT}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 Received SIGINT, shutting down gracefully');
  process.exit(0);
});

startServer();