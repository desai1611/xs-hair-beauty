const express = require('express');
const {
  getProducts,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { productCreateValidator, productUpdateValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getProducts);
router.get('/admin', protect, getProductsAdmin);
router.post('/', protect, productCreateValidator, validate, createProduct);
router.put('/:id', protect, productUpdateValidator, validate, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
