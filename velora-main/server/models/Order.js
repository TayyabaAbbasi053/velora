// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String },                                      // e.g. VLR-847291
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },       // optional (guest orders have no user)
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: false, default: null },
      name: String,
      price: String,
      quantity: { type: Number, default: 1 },
      image: String,
    }
  ],
  total: { type: String },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    fullName: String,
    email: String,       // guest email for contact
    phone: String,
    address: String,
    city: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);