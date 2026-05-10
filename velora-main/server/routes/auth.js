// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed admin
router.post('/seed-admin', async (req, res) => {
  if (req.headers['x-seed-secret'] !== process.env.SEED_SECRET) return res.status(403).json({ message: 'Forbidden' });
  try {
    const existing = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (existing) return res.json({ message: 'Admin already exists' });
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({ name: 'Admin', email: process.env.ADMIN_EMAIL, password: hashed, isAdmin: true });
    res.json({ message: 'Admin created ✅' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// First-time admin setup
router.post('/setup-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ isAdmin: true });
    if (adminExists) return res.status(403).json({ message: 'An admin account already exists. Use the login form.' });
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashed, isAdmin: true });
    res.json({ message: 'Admin account created successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;