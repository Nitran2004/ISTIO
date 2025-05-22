const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';

app.use(express.json());
app.use(cors());

// Simulador de fallos para testing
let failureCount = 0;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service' });
});

// Process payment endpoint
app.post('/payment/process', async (req, res) => {
  const { token, amount, orderId } = req.body;
  
  try {
    // Verificar token con AuthService
    const authResponse = await axios.post(`${AUTH_SERVICE_URL}/auth/verify`, {
      token
    }, {
      timeout: 5000
    });
    
    if (!authResponse.data.valid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    // Simular fallo ocasional para testing circuit breaker
    if (Math.random() < 0.3) { // 30% probabilidad de fallo
      failureCount++;
      throw new Error('Payment processing failed');
    }
    
    // Reset failure count en caso de éxito
    failureCount = 0;
    
    // Simular procesamiento de pago
    const paymentId = `payment_${Date.now()}`;
    
    res.json({
      success: true,
      paymentId,
      orderId,
      amount,
      status: 'completed',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Payment processing error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// Get payment status
app.get('/payment/status/:paymentId', (req, res) => {
  const { paymentId } = req.params;
  
  res.json({
    paymentId,
    status: 'completed',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});