const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['hair', 'beauty', 'advanced'], required: true },
    description: { type: String, default: '' },
    price: { type: Number, default: null }, // null = "price on consultation"
    priceNote: { type: String, default: '' }, // e.g. "From", "Starting at"
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

serviceSchema.index({ category: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
