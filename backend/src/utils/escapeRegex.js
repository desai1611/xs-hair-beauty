// Search text from the URL is used inside a MongoDB $regex. Escaping the
// special characters makes it match literally, so a visitor can't send
// patterns like "(a+)+$" that make the database work very hard (ReDoS).
function escapeRegex(value) {
  return String(value).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { escapeRegex };
