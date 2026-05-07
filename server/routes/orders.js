const express = require('express');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
  res.json(orders);
});

module.exports = router;