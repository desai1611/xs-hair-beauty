const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { sendBookingNotification } = require('../utils/mailer');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/bookings  (public contact/booking form)
const createBooking = asyncHandler(async (req, res) => {
  const { name, phone, email, service, message } = req.body;

  const errors = [];
  if (!name || !name.trim()) errors.push('Name is required');
  if (!phone || !phone.trim()) errors.push('Phone number is required');
  if (!email || !EMAIL_RE.test(email)) errors.push('A valid email address is required');
  if (errors.length) return res.status(400).json({ message: errors.join(', ') });

  const booking = await Booking.create({
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    service: service || 'General enquiry',
    message: (message || '').trim(),
  });

  try {
    const sent = await sendBookingNotification(booking);
    if (sent) {
      booking.emailSent = true;
      await booking.save();
    }
  } catch (err) {
    // Booking is already saved — surface the failure in logs but don't fail the request
    console.error('Failed to send booking notification email:', err.message);
  }

  res.status(201).json({
    message: 'Thanks! Your enquiry has been received — we will be in touch shortly.',
    booking,
  });
});

// GET /api/bookings (admin)
const getBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const bookings = await Booking.find(filter).sort({ createdAt: -1 });
  res.json(bookings);
});

// PATCH /api/bookings/:id (admin — update status)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['new', 'contacted', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

// DELETE /api/bookings/:id (admin)
const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json({ message: 'Booking deleted' });
});

module.exports = { createBooking, getBookings, updateBookingStatus, deleteBooking };
