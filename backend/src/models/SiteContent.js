const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    value: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteContent', siteContentSchema);
