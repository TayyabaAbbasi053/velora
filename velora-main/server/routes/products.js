// routes/products.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

// Multer config – store images in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB

// ─── PUBLIC ────────────────────────────────────────────────────────────────

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category)    filter.category    = req.query.category;
    if (req.query.subcategory) filter.subcategory = req.query.subcategory;
    if (req.query.group)       filter.group       = req.query.group;
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/stats  – dashboard summary
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const all = await Product.find({});
    res.json({
      total:      all.length,
      lowStock:   all.filter(p => p.stock > 0 && p.stock < 10).length,
      outOfStock: all.filter(p => p.stock === 0).length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products/seed-bulk  – import catalog without duplicates
router.post('/seed-bulk', adminAuth, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ message: 'Expected an array' });
    let created = 0, skipped = 0;
    for (const item of items) {
      const exists = await Product.findOne({ name: item.name });
      if (exists) { skipped++; continue; }
      await Product.create({
        name:        item.name,
        price:       item.price,
        description: item.description || '',
        category:    item.category,
        subcategory: item.subcategory || '',
        group:       item.group || '',
        image:       '',
        featured:    false,
        stock:       item.stock ?? 100,
      });
      created++;
    }
    res.json({ created, skipped });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── ADMIN ─────────────────────────────────────────────────────────────────

// POST /api/products  → create with image upload
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, subcategory, group, featured, stock } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';
    const product = await Product.create({
      name, price, description, category,
      subcategory: subcategory || '',
      group:       group || '',
      image:       imagePath,
      featured:    featured === 'true',
      stock:       parseInt(stock) || 100,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/products/:id  → update (image optional)
router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category, subcategory, group, featured, stock } = req.body;
    const update = {
      name, price, description, category, subcategory, group,
      featured: featured === 'true',
      stock:    parseInt(stock) || 0,
    };
    if (req.file) {
      const old = await Product.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      update.image = `/uploads/${req.file.filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/products/:id/stock  → quick stock update
router.patch('/:id/stock', adminAuth, async (req, res) => {
  try {
    const stock = Math.max(0, parseInt(req.body.stock) || 0);
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/products/:id
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    if (product.image) {
      const imgPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
