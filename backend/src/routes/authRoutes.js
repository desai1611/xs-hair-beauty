const express = require('express');
const rateLimit = require('express-rate-limit');
const { login, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { loginValidator } = require('../middleware/validators');

const router = express.Router();

// Brute-force protection: without this, a password could be guessed by
// automated trial-and-error with no limit on attempts.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts — please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, loginValidator, validate, login);
router.get('/me', protect, me);

module.exports = router;
