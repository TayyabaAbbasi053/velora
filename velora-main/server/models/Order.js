// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: String,
      quantity: { type: Number, default: 1 },
      image: String,
    }
  ],
  total: { type: String },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
