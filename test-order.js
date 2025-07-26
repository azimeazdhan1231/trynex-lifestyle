// Simple test to verify order placement works
const testOrder = async () => {
  try {
    const orderData = {
      customerName: "Test Customer",
      customerPhone: "01234567890", 
      district: "Dhaka",
      thana: "Dhanmondi",
      address: "123 Test Street",
      items: JSON.stringify([{
        id: "1",
        name: "Premium Love Mug",
        price: 550,
        quantity: 1
      }]),
      paymentMethod: "bkash",
      paymentNumber: "01234567890",
      total: "610" // 550 + 60 delivery
    };

    const formData = new FormData();
    formData.append('orderData', JSON.stringify(orderData));

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    console.log('Order test result:', result);
    
    if (response.ok) {
      console.log('✅ Order placement works!');
      console.log('📋 Tracking ID:', result.trackingId);
    } else {
      console.log('❌ Order placement failed:', result.message);
    }
  } catch (error) {
    console.log('❌ Error testing order:', error.message);
  }
};

testOrder();