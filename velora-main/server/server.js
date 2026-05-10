// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 60000,
  connectTimeoutMS: 30000,
}).then(() => {
  console.log('MongoDB Connected ✅');

  // Load routes AFTER connection is established
  app.use('/api/auth',     require('./routes/auth'));
  app.use('/api/products', require('./routes/products'));
  app.use('/api/orders',   require('./routes/orders'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});