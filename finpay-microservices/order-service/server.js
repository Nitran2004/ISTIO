const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3003;
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3002';

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service' });
});

// Create order endpoint
app.post('/order/create', async (req, res) => {
  const { token, items, totalAmount } = req.body;
  
  try {
    const orderId = `order_${Date.now()}`;
    
    // Procesar pago
    const paymentResponse = await axios.post(`${PAYMENT_SERVICE_URL}/payment/process`, {
      token,
      amount: totalAmount,
      orderId
    }, {
      timeout: 10000
    });
    
    if (paymentResponse.data.success) {
      res.json({
        success: true,
        orderId,
        paymentId: paymentResponse.data.paymentId,
        items,
        totalAmount,
        status: 'confirmed',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed'
      });
    }
    
  } catch (error) {
    console.error('Order creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Order creation failed',
      error: error.message
    });
  }
});

// Get order status
app.get('/order/status/:orderId', (req, res) => {
  const { orderId } = req.params;
  
  res.json({
    orderId,
    status: 'confirmed',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});