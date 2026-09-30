const { validationResult } = require('express-validator');

// Runs after a chain of express-validator checks on a route. If any of them
// failed, respond with a single 400 listing every problem instead of letting
// bad data reach the controller/database.
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array().map((e) => e.msg).join(', ') });
  }
  next();
}

module.exports = { validate };
