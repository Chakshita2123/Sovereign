/**
 * config/passport.js — Passport.js Strategy Configuration
 * Lectures 41-44: Authentication strategies, JWT, Passport.js
 * 
 * Passport.js uses a "strategy" pattern — each authentication method
 * (local email/password, JWT, OAuth, etc.) is a separate plugin.
 * 
 * Strategy 1 — passport-local:
 *   Authenticates with email + password. Used for POST /api/auth/login.
 *   Looks up user by email, calls user.comparePassword().
 * 
 * Strategy 2 — passport-jwt:
 *   Authenticates with a JWT Bearer token from the Authorization header.
 *   Used for protecting API routes. Verifies token signature and expiry,
 *   then attaches the user to req.user.
 * 
 * Why two strategies?
 *   - Local: for the login endpoint (user sends credentials)
 *   - JWT: for all subsequent requests (user sends token)
 *   This is the standard stateless REST API authentication pattern.
 */

const { Strategy: LocalStrategy }  = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/User');

module.exports = (passport) => {
  // ── Strategy 1: Local (email + password) ──────────────────────────────────
  // Used only on POST /api/auth/login
  // usernameField: tells Passport to look for `email` instead of `username`
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email (case-insensitive due to lowercase: true in schema)
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Compare with bcrypt (constant-time)
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        // Authentication successful — pass user to the route handler
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

  // ── Strategy 2: JWT (Bearer token) ────────────────────────────────────────
  // Used on ALL protected API routes via middleware/auth.js
  // Extracts token from: Authorization: Bearer <token>
  // Verifies signature + expiry using JWT_SECRET
  passport.use(new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'sovereign-jwt-dev-secret',
    },
    async (payload, done) => {
      try {
        // payload.sub contains the user._id (set during token signing)
        const user = await User.findById(payload.sub);

        if (!user) {
          return done(null, false); // token valid but user deleted
        }

        // Attach user to req.user — available in all route handlers
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  ));
};
