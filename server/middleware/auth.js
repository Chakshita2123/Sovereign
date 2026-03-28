/**
 * middleware/auth.js — JWT Authentication Guard + Role-Based Access Control
 * Lectures 41-44: JWT, Passport.js, RBAC
 * 
 * This module exports two middleware functions:
 * 
 * 1. jwtAuth — verifies the JWT Bearer token on every request.
 *    If the token is missing, expired, or invalid → 401 Unauthorized.
 *    If valid → attaches user to req.user and calls next().
 * 
 * 2. requireRole(...roles) — checks if req.user.role is in the allowed list.
 *    Must be used AFTER jwtAuth (needs req.user to exist).
 *    If role doesn't match → 403 Forbidden.
 * 
 * Usage:
 *   app.use('/api/credentials', jwtAuth, credentialRoutes);          // all need JWT
 *   router.post('/:id/issue', requireRole('issuer', 'verifier'), …); // only issuers/verifiers
 */

const passport = require('passport');

// ── JWT Authentication Guard ──────────────────────────────────────────────────
// passport.authenticate('jwt') runs the JWT strategy defined in config/passport.js.
// { session: false } — we don't create a server-side session for API requests.
// This is the key difference from Day 5's session auth: JWT is STATELESS.
const jwtAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized — valid JWT token required',
        hint: 'Send Authorization: Bearer <token> header. Get a token via POST /api/auth/login',
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

// ── Role-Based Access Control ─────────────────────────────────────────────────
// Higher-order function: requireRole('issuer', 'verifier') returns a middleware.
// Must be used AFTER jwtAuth — it relies on req.user being set.
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized — authentication required before role check',
    });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: `Forbidden — requires role: ${roles.join(' or ')}`,
      yourRole: req.user.role,
    });
  }

  next();
};

module.exports = { jwtAuth, requireRole };
