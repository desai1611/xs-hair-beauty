const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    tag: { type: String, default: '' }, // e.g. "New Client", "This Month"
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
