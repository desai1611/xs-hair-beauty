const express = require('express');
const {
  getOffers,
  getOffersAdmin,
  createOffer,
  updateOffer,
  deleteOffer,
} = require('../controllers/offerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getOffers);
router.get('/admin', protect, getOffersAdmin);
router.post('/', protect, createOffer);
router.put('/:id', protect, updateOffer);
router.delete('/:id', protect, deleteOffer);

module.exports = router;
