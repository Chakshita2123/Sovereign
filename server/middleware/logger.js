
const fs   = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '..', 'data', 'access.log');

// ANSI color codes for colorful console output
const COLORS = {
  GET:    '\x1b[32m',  // green
  POST:   '\x1b[34m',  // blue
  PUT:    '\x1b[33m',  // yellow
  PATCH:  '\x1b[33m',  // yellow
  DELETE: '\x1b[31m',  // red
  reset:  '\x1b[0m',
};

// ─── LOGGER MIDDLEWARE ────────────────────────────────────────────────────────
// Middleware signature: (req, res, next) => void
// - req  : the incoming HTTP request
// - res  : the outgoing HTTP response
// - next : function to pass control to the next middleware/route
function logger(req, res, next) {
  const start = Date.now();

  // Intercept res.end to capture the status code AFTER the route runs
  const originalEnd = res.end.bind(res);
  res.end = function (...args) {
    const duration  = Date.now() - start;
    const method    = req.method;
    const color     = COLORS[method] || '\x1b[0m';
    const statusColor = res.statusCode < 300 ? '\x1b[32m' : res.statusCode < 400 ? '\x1b[33m' : '\x1b[31m';
    const timestamp = new Date().toISOString();

    // ── Console log (colored) ──────────────────────────────────────────────
    console.log(
      `${color}${method}${COLORS.reset} ` +
      `${req.url.padEnd(40)} ` +
      `${statusColor}${res.statusCode}${COLORS.reset} ` +
      `${duration}ms`
    );

    // ── File log (LECTURE 5-8: fs.appendFile) ─────────────────────────────
    const logLine = `[${timestamp}] ${method} ${req.url} ${res.statusCode} ${duration}ms | IP: ${req.ip}\n`;
    fs.appendFile(LOG_FILE, logLine, 'utf8', () => {}); // fire-and-forget

    return originalEnd(...args);
  };

  next(); // IMPORTANT: always call next() to pass to the next middleware
}

module.exports = logger;
