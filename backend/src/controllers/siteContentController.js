const SiteContent = require('../models/SiteContent');
const asyncHandler = require('../utils/asyncHandler');
const DEFAULT_SLOTS = require('../seed/siteContentDefaults');

// Ensures every known slot exists in the DB (self-healing — new slots added
// to DEFAULT_SLOTS in future updates appear automatically without a reseed).
async function ensureDefaults() {
  const existing = await SiteContent.find({}, 'key');
  const existingKeys = new Set(existing.map((s) => s.key));
  const missing = DEFAULT_SLOTS.filter((s) => !existingKeys.has(s.key));
  if (missing.length) {
    await SiteContent.insertMany(
      missing.map((s) => ({ key: s.key, label: s.label, type: s.type, value: s.defaultValue || '' }))
    );
  }
}

// GET /api/site-content — public, returns { [key]: { label, type, value } }
const getSiteContent = asyncHandler(async (req, res) => {
  await ensureDefaults();
  const items = await SiteContent.find();
  const map = {};
  items.forEach((item) => {
    map[item.key] = { label: item.label, type: item.type, value: item.value };
  });
  res.json(map);
});

// PUT /api/site-content/:key — admin only, body: { value }
const updateSiteContent = asyncHandler(async (req, res) => {
  await ensureDefaults();
  const { value } = req.body;
  const item = await SiteContent.findOneAndUpdate(
    { key: req.params.key },
    { value: value || '' },
    { returnDocument: 'after' }
  );
  if (!item) return res.status(404).json({ message: `Unknown site content key: ${req.params.key}` });
  res.json(item);
});

module.exports = { getSiteContent, updateSiteContent };
