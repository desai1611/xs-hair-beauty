const express = require('express');
const {
  getOffers,
  getOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { offerCreateValidator, offerUpdateValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getOffers);
router.get('/admin', protect, getOffersAdmin);
router.post('/', protect, offerCreateValidator, validate, createOffer);
router.put('/:id', protect, offerUpdateValidator, validate, updateOffer);
router.delete('/:id', protect, deleteOffer);

module.exports = router;
