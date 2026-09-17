const express = require('express');
const { getSiteContent, updateSiteContent } = require('../controllers/siteContentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getSiteContent);
router.put('/:key', protect, updateSiteContent);

module.exports = router;
