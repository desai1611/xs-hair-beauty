// Server-side validation chains (express-validator). Every field a client
// can submit is checked here for type, format and length before it reaches
// a controller — the client-side form checks are a convenience, not a
// security boundary, so the same rules are enforced again on the server.
const { body } = require('express-validator');

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const bookingValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name is too long'),
  body('phone').trim().notEmpty().withMessage('Phone number is required').isLength({ max: 30 }).withMessage('Phone number is too long'),
  body('email').trim().isEmail().withMessage('A valid email address is required').normalizeEmail(),
  body('service').optional({ checkFalsy: true }).trim().isLength({ max: 150 }).withMessage('Service is too long'),
  body('message').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('Message is too long'),
];

const serviceCreateValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }).withMessage('Name is too long'),
  body('category').isIn(['hair', 'beauty', 'advanced']).withMessage('Category must be hair, beauty or advanced'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('price').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('priceNote').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('image').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('isFeatured').optional().isBoolean().withMessage('isFeatured must be true or false'),
  body('isActive').optional().isBoolean().withMessage('isActive must be true or false'),
  body('order').optional().isInt().withMessage('Order must be a whole number'),
];
const serviceUpdateValidator = serviceCreateValidator.map((chain) => chain.optional());

const productCreateValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 150 }).withMessage('Name is too long'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('brand').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('category').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('image').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('inStock').optional().isBoolean(),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt(),
];
const productUpdateValidator = productCreateValidator.map((chain) => chain.optional());

const offerCreateValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title is too long'),
  body('tag').optional({ checkFalsy: true }).trim().isLength({ max: 50 }),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 2000 }),
  body('image').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('isActive').optional().isBoolean(),
  body('expiresAt').optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage('Expiry date must be a valid date'),
  body('order').optional().isInt(),
];
const offerUpdateValidator = offerCreateValidator.map((chain) => chain.optional());

const galleryCreateValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title is too long'),
  body('page').isIn(['home', 'hair', 'beauty', 'advanced', 'reviews']).withMessage('Invalid page'),
  body('description').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }),
  body('category').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('image').optional({ checkFalsy: true }).trim().isLength({ max: 500 }),
  body('type').optional().isIn(['single', 'before', 'after']).withMessage('Invalid type'),
  body('pairKey').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('isActive').optional().isBoolean(),
  body('order').optional().isInt(),
];
const galleryUpdateValidator = galleryCreateValidator.map((chain) => chain.optional());

const reviewCreateValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name is too long'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('quote').trim().notEmpty().withMessage('Quote is required').isLength({ max: 2000 }).withMessage('Quote is too long'),
  body('serviceLabel').optional({ checkFalsy: true }).trim().isLength({ max: 100 }),
  body('isPublished').optional().isBoolean(),
  body('order').optional().isInt(),
];
const reviewUpdateValidator = reviewCreateValidator.map((chain) => chain.optional());

module.exports = {
  loginValidator,
  bookingValidator,
  serviceCreateValidator,
  serviceUpdateValidator,
  productCreateValidator,
  productUpdateValidator,
  offerCreateValidator,
  offerUpdateValidator,
  galleryCreateValidator,
  galleryUpdateValidator,
  reviewCreateValidator,
  reviewUpdateValidator,
};
