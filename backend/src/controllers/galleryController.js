const GalleryImage = require('../models/GalleryImage');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/gallery?page=hair&category=colour
const getGallery = asyncHandler(async (req, res) => {
  const { page, category } = req.query;
  const filter = { isActive: true };
  if (page) filter.page = page;
  if (category) filter.category = category;

  const images = await GalleryImage.find(filter).sort({ order: 1, createdAt: -1 });
  res.json(images);
});

const getGalleryAdmin = asyncHandler(async (req, res) => {
  const images = await GalleryImage.find().sort({ page: 1, order: 1 });
  res.json(images);
});

const createGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.create(req.body);
  res.status(201).json(image);
});

const updateGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!image) return res.status(404).json({ message: 'Image not found' });
  res.json(image);
});

const deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) return res.status(404).json({ message: 'Image not found' });
  res.json({ message: 'Image deleted' });
});

module.exports = {
  getGallery,
  getGalleryAdmin,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
};
