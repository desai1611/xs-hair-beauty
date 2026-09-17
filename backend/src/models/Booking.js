const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    service: { type: String, default: 'General enquiry' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'contacted', 'completed'], default: 'new' },
    emailSent: { type: Boolean, default: false },
    customerEmailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
