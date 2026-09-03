const Offer = require('../models/Offer');
const asyncHandler = require('../utils/asyncHandler');

const getOffers = asyncHandler(async (req, res) => {
  const now = new Date();
  const offers = await Offer.find({
    isActive: true,
    $or: [{ expiresAt: null }, { expiresAt: { $gte: now } }],
  }).sort({ order: 1, createdAt: -1 });
  res.json(offers);
});

const getOffersAdmin = asyncHandler(async (req, res) => {
  const offers = await Offer.find().sort({ order: 1, createdAt: -1 });
  res.json(offers);
});

const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(req.body);
  res.status(201).json(offer);
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  res.json(offer);
});

const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer) return res.status(404).json({ message: 'Offer not found' });
  res.json({ message: 'Offer deleted' });
});

module.exports = { getOffers, getOffersAdmin, createOffer, updateOffer, deleteOffer };
