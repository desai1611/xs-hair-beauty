const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    page: { type: String, enum: ['home', 'hair', 'beauty', 'advanced', 'reviews'], required: true },
    category: { type: String, default: 'general' }, // used for filter buttons, e.g. "colour", "cuts"
    image: { type: String, default: '' },
    type: { type: String, enum: ['single', 'before', 'after'], default: 'single' },
    pairKey: { type: String, default: '' }, // links a before/after pair together
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
