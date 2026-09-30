function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
  }
  if (err.name === 'CastError') {
    // Don't echo the attacker-controlled value back into the response.
    return res.status(400).json({ message: 'Invalid id' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: 'A record with these details already exists' });
  }

  const status = err.statusCode || 500;

  // Anything we didn't specifically recognise above is an unexpected server
  // error (a bug, a DB hiccup, a bad env var, ...). The full detail is
  // already logged via console.error(err) — never send err.message itself
  // to the client, since it can contain internal paths, driver/library
  // names, or other details that help an attacker map out the system.
  if (status >= 500) {
    return res.status(status).json({ message: 'Something went wrong on our end. Please try again later.' });
  }

  // Below 500, the message was written by our own code (e.g. a controller's
  // res.status(400)/(404) calls never reach this handler at all — this
  // covers errors thrown with a deliberate statusCode < 500), so it's safe
  // to send as-is.
  res.status(status).json({ message: err.message || 'Request failed' });
}

module.exports = { notFound, errorHandler };
