const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authorised — no token provided' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised — invalid or expired token' });
  }

  const admin = await Admin.findById(decoded.id).select('-passwordHash');
  if (!admin) {
    return res.status(401).json({ message: 'Not authorised — admin account no longer exists' });
  }

  req.admin = admin;
  next();
});

module.exports = { protect };
