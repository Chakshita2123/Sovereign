// ─── RATE LIMITING MIDDLEWARE ──────────────────────────────────────────────────
// Lecture 25-28: Middleware lifecycle — rate limiting protects against DDoS and brute force
// express-rate-limit tracks request counts per IP using an in-memory store (default)
//
// Two limiters:
//   globalLimiter — 100 requests per 15 min window (general API protection)
//   authLimiter  — 10 requests per 15 min window (brute-force login prevention)

const rateLimit = require('express-rate-limit');

// ── Global Rate Limiter ────────────────────────────────────────────────────────
// Applied to all routes via app.use() in server.js
// standardHeaders: true → sends RateLimit-* headers (RateLimit-Limit, RateLimit-Remaining)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15-minute window
  max: 100,                    // 100 requests per window per IP
  standardHeaders: true,       // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,        // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests, slow down.',
  },
});

// ── Auth Route Rate Limiter ────────────────────────────────────────────────────
// Stricter limit for authentication endpoints — prevents brute-force attacks
// Applied only to /api/auth routes in server.js
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15-minute window
  max: 10,                     // Only 10 auth attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many auth attempts. Please try again later.',
  },
});

module.exports = { globalLimiter, authLimiter };
