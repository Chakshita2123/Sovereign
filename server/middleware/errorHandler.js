
const { appendLog } = require('../utils/fileDb');
const path = require('path');

const ERROR_LOG = path.join(__dirname, '..', 'data', 'errors.log');

// ─── 404 HANDLER — Not Found ──────────────────────────────────────────────────
// This middleware runs after all routes — if nothing matched, it's a 404.
// LECTURE 21-24: Response Methods — res.status().json()
function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.url}`);
  error.statusCode = 404;
  next(error); // pass to the error handler below
}

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────────────────────
// Express identifies error middleware by its 4-argument signature.
// MUST be registered LAST in server.js (after all routes).
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message || 'Internal Server Error';
  const timestamp  = new Date().toISOString();

  // ── Log the error to file (LECTURE 5-8: fs.appendFile) ──────────────────
  const logEntry = `[${timestamp}] ${statusCode} ${req.method} ${req.url} — ${message}`;
  appendLog(ERROR_LOG, logEntry).catch(() => {}); // don't crash if log fails

  // ── Console output ────────────────────────────────────────────────────────
  if (statusCode >= 500) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${logEntry}`);
    if (err.stack) console.error(err.stack);
  }

  // ── JSON Response (LECTURE 21-24: Response Methods) ──────────────────────
  // res.status() sets HTTP status code
  // res.json()   sends JSON and sets Content-Type: application/json
  res.status(statusCode).json({
    success: false,
    error: {
      code:    statusCode,
      message: message,
      // Only expose stack trace in development — never in production
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
    timestamp,
    path: req.url,
  });
}

function asyncWrapper(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = { notFound, errorHandler, asyncWrapper };
