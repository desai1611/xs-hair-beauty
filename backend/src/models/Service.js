const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['hair', 'beauty', 'advanced'], required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: null }, // null = "price on consultation"
    priceNote: { type: String, default: '' }, // e.g. "From", "Only"
    duration: { type: String, default: '' }, // e.g. "45 min", "2 hr" — as listed on Fresha
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false }, // "Most popular" badge + homepage spotlight
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
