// Strips MongoDB operator keys (anything starting with "$") and dotted keys
// out of user-supplied input, recursively. Without this, a request body like
// { "email": { "$ne": null }, "password": { "$ne": null } } could be used to
// bypass a query such as Admin.findOne({ email }) — Mongo would treat $ne as
// an operator instead of a literal value. This runs on body, query and
// params for every request, before it reaches any route.
//
// Mutates objects in place rather than reassigning req.query/req.body —
// Express 5 defines req.query as a getter with no setter, so
// `req.query = ...` throws. Deleting keys on the existing object is safe.
function stripInPlace(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    // Also drop keys that could tamper with an object's prototype (mongoose advisories
    // about inherited properties / prototype pollution).
    if (key.startsWith('$') || key.includes('.') || key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
      continue;
    }
    if (obj[key] && typeof obj[key] === 'object') stripInPlace(obj[key]);
  }
}

function sanitizeInput(req, res, next) {
  stripInPlace(req.body);
  stripInPlace(req.query);
  stripInPlace(req.params);
  next();
}

module.exports = { sanitizeInput };
