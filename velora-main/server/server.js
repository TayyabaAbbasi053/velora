// server.js
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

// Manual CORS middleware (Express 5 compatible)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load routes immediately
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/wishlist',  require('./routes/wishlist'));

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
}).then(() => {
  console.log('MongoDB Connected ✅');

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

module.exports = app; // ✅ added for Vercel