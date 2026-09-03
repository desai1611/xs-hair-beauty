const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/services?category=hair&search=colour
const getServices = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const services = await Service.find(filter).sort({ order: 1, createdAt: 1 });
  res.json(services);
});

// GET /api/services/admin (all, including inactive)
const getServicesAdmin = asyncHandler(async (req, res) => {
  const services = await Service.find().sort({ category: 1, order: 1 });
  res.json(services);
});

// POST /api/services
const createService = asyncHandler(async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
});

// PUT /api/services/:id
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json(service);
});

// DELETE /api/services/:id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found' });
  res.json({ message: 'Service deleted' });
});

module.exports = { getServices, getServicesAdmin, createService, updateService, deleteService };
