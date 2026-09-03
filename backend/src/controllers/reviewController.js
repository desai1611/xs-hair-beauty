const Review = require('../models/Review');
const asyncHandler = require('../utils/asyncHandler');

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
  res.json(reviews);
});

const getReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ order: 1, createdAt: -1 });
  res.json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json(review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  res.json({ message: 'Review deleted' });
});

module.exports = { getReviews, getReviewsAdmin, createReview, updateReview, deleteReview };
