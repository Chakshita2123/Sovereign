// ─── REQUEST ID TRACING MIDDLEWARE ─────────────────────────────────────────────
// Lecture 25-28: Middleware lifecycle — every request gets a unique UUID
//
// Why this matters:
//   - Debugging: trace any error log back to the exact HTTP request
//   - Monitoring: correlate frontend errors with backend logs
//   - Support: users can report X-Request-Id for faster issue resolution
//
// The UUID is attached to req.id AND sent as a response header (X-Request-Id)

const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // Generate a unique ID for this request
  req.id = uuidv4();

  // Expose it in the response so clients/debugging tools can see it
  res.setHeader('X-Request-Id', req.id);

  next();
};
