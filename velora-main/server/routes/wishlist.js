const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require auth
router.use(protect);

// Get user's wishlist
router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json(wishlist ? wishlist.products : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add product to wishlist
router.post('/:productId', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [req.params.productId] });
    } else {
      if (wishlist.products.includes(req.params.productId)) {
        return res.status(400).json({ message: 'Product already in wishlist' });
      }
      wishlist.products.push(req.params.productId);
      await wishlist.save();
    }
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove product from wishlist
router.delete('/:productId', async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });
    wishlist.products = wishlist.products.filter(p => p.toString() !== req.params.productId);
    await wishlist.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
