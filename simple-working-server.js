const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Simple working API
app.get('/', (req, res) => {
  res.json({
    message: 'Trynex Bengali E-commerce - LIVE!',
    status: 'Working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'API Working Perfect!',
    server: 'AWS EC2',
    status: 'Live'
  });
});

app.get('/api/products', (req, res) => {
  res.json([
    {
      id: "1",
      name: "Premium Love Mug",
      nameBn: "প্রিমিয়াম ভালোবাসার মগ",
      price: 550,
      category: "Mugs"
    },
    {
      id: "2", 
      name: "Custom Photo Mug",
      nameBn: "কাস্টম ফটো মগ",
      price: 650,
      category: "Mugs"
    }
  ]);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Bengali E-commerce is LIVE!');
});