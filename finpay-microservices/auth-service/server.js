const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'finpay-secret-key';

app.use(express.json());
app.use(cors());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'auth-service' });
});

app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username && password) {
    const token = jwt.sign(
      { username, userId: Date.now() },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({
      success: true,
      token,
      message: 'Authentication successful'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/auth/verify', (req, res) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Invalid token'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
