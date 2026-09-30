const express = require('express');
const {
  getGallery,
  getGalleryAdmin,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { galleryCreateValidator, galleryUpdateValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getGallery);
router.get('/admin', protect, getGalleryAdmin);
router.post('/', protect, galleryCreateValidator, validate, createGalleryImage);
router.put('/:id', protect, galleryUpdateValidator, validate, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
