const express = require('express');
const {
  getReviews,
  getReviewsAdmin,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { reviewCreateValidator, reviewUpdateValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getReviews);
router.get('/admin', protect, getReviewsAdmin);
router.post('/', protect, reviewCreateValidator, validate, createReview);
router.put('/:id', protect, reviewUpdateValidator, validate, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
