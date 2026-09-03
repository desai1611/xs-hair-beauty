const express = require('express');
const {
  getGallery,
  getGalleryAdmin,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getGallery);
router.get('/admin', protect, getGalleryAdmin);
router.post('/', protect, createGalleryImage);
router.put('/:id', protect, updateGalleryImage);
router.delete('/:id', protect, deleteGalleryImage);

module.exports = router;
