const Product = require('../models/Product');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/products?search=shampoo
const getProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const products = await Product.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(products);
});

const getProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ order: 1, createdAt: 1 });
  res.json(products);
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

module.exports = { getProducts, getProductsAdmin, createProduct, updateProduct, deleteProduct };
