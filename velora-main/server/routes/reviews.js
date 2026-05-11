const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');

// Bulk averages — must be BEFORE /:productId
router.get('/averages', async (req, res) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean);
    if (!ids.length) return res.json([]);
    const mongoose = require('mongoose');
    const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));
    const results = await Review.aggregate([
      { $match: { product: { $in: objectIds } } },
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    res.json(results.map(r => ({ productId: r._id, avg: Math.round(r.avg * 10) / 10, count: r.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create review
router.post('/:productId', protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) return res.status(400).json({ message: 'Rating and comment are required' });
    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating,
      comment,
    });
    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already reviewed this product' });
    res.status(500).json({ message: err.message });
  }
});

// Update review
router.put('/:productId', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { user: req.user.id, product: req.params.productId },
      { rating: req.body.rating, comment: req.body.comment },
      { new: true }
    ).populate('user', 'name');
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete review
router.delete('/:productId', protect, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ user: req.user.id, product: req.params.productId });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
