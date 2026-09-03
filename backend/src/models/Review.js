const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    serviceLabel: { type: String, default: '' }, // e.g. "Hair Colour Client"
    rating: { type: Number, min: 1, max: 5, required: true },
    quote: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
