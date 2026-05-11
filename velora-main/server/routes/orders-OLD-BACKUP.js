// routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const adminAuth = require('../middleware/adminAuth');
const jwt = require('jsonwebtoken');

// Simple user auth middleware (not admin-only)
const userAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /api/orders/guest  → guest checkout (no login required)
router.post('/guest', async (req, res) => {
  try {
    const { orderNumber, items, total, shippingAddress } = req.body;
    const order = await Order.create({
      orderNumber,
      items,
      total,
      shippingAddress,
      status: 'pending',
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('Guest order error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders  → place order (authenticated user)
router.post('/', userAuth, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body;
    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      shippingAddress,
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('User order error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my  → logged-in user's orders
router.get('/my', userAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN ─────────────────────────────────────────────────────────────────

// GET /api/orders  → all orders with customer info
router.get('/', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status  → update order status
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;