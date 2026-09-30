const express = require('express');
const {
  getServices,
  getServicesAdmin,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { serviceCreateValidator, serviceUpdateValidator } = require('../middleware/validators');

const router = express.Router();

router.get('/', getServices);
router.get('/admin', protect, getServicesAdmin);
router.post('/', protect, serviceCreateValidator, validate, createService);
router.put('/:id', protect, serviceUpdateValidator, validate, updateService);
router.delete('/:id', protect, deleteService);

module.exports = router;
