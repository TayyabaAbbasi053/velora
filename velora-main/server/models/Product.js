// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: String, required: true },          // e.g. "PKR 2,500"
  description: { type: String, default: '' },
  category: { type: String, required: true },       // Women | Men | Hair care | Baby care | Health And Skin Care
  subcategory: { type: String, default: '' },       // Fragrance | Makeup | Grooming
  group: { type: String, default: '' },             // Eye | Face | Lip | Cheek
  image: { type: String, default: '' },             // relative path: /uploads/filename.jpg
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 100, min: 0 },
}, { timestamps: true });

productSchema.index({ category: 1, subcategory: 1, group: 1 });

module.exports = mongoose.model('Product', productSchema);
