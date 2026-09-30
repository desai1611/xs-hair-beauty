const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  createBooking,
  getBookings,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { bookingValidator } = require('../middleware/validators');

const router = express.Router();

// Throttle the public form endpoint to reduce spam/abuse
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many enquiries submitted — please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/', bookingLimiter, bookingValidator, validate, createBooking);
router.get('/', protect, getBookings);
router.patch('/:id', protect, updateBookingStatus);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
