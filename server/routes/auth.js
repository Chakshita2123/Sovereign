/**
 * routes/auth.js — JWT Authentication Routes
 * Lectures 41-44: Registration, login, token management
 * 
 * Routes:
 *   POST /api/auth/register  → create User, return JWT (public)
 *   POST /api/auth/login     → verify credentials, return JWT (public)
 *   GET  /api/auth/me        → return current user from JWT (protected)
 * 
 * Token format (JWT payload):
 *   { sub: user._id, role: user.role, email: user.email }
 *   Signed with JWT_SECRET, expires in 24h
 * 
 * Security notes:
 *   - Passwords are hashed with bcrypt (cost 12) in the User model pre-save hook
 *   - JWT is stateless — no server-side session needed for API access
 *   - Token should be stored in memory on the client (not localStorage) for XSS safety
 */

const express  = require('express');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const router   = express.Router();

const User = require('../models/User');
const { jwtAuth } = require('../middleware/auth');

// ── JWT Helper ────────────────────────────────────────────────────────────────
// Signs a JWT with the user's ID, role, and email.
// The token expires in 24 hours — client must re-login after that.
const JWT_SECRET  = process.env.JWT_SECRET || 'sovereign-jwt-dev-secret';
const JWT_EXPIRES = '24h';

const signToken = (user) => jwt.sign(
  {
    sub:   user._id,        // subject — standard JWT claim
    role:  user.role,
    email: user.email,
  },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES }
);

// ─── POST /api/auth/register ──────────────────────────────────────────────────
// Creates a new user account and returns a JWT token.
// The client can immediately use this token for authenticated API calls.
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;

    // ── Validate input ──────────────────────────────────────────────────────
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'email, password, and name are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // ── Check if email already exists ───────────────────────────────────────
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'An account with this email already exists',
      });
    }

    // ── Create user ─────────────────────────────────────────────────────────
    // The virtual `password` field triggers the pre-save bcrypt hook
    const user = new User({
      email,
      name,
      role: role || 'holder',    // default to holder if not specified
      passwordHash: 'placeholder', // will be replaced by pre-save hook
    });
    user.password = password;    // triggers virtual → pre-save hook hashes it
    await user.save();

    // ── Sign JWT and respond ────────────────────────────────────────────────
    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id:    user._id,
        email: user.email,
        name:  user.name,
        role:  user.role,
      },
    });
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(err);
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Authenticates with email + password using Passport's local strategy.
// Returns a JWT token that the client sends on all subsequent API calls.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: info?.message || 'Invalid email or password',
      });
    }

    // ── Sign JWT and respond ────────────────────────────────────────────────
    const token = signToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id:    user._id,
        email: user.email,
        name:  user.name,
        role:  user.role,
      },
    });
  })(req, res, next);
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// Returns the current authenticated user's profile.
// Protected by jwtAuth — requires a valid Bearer token.
// This lets the React frontend verify the token is still valid on page load.
router.get('/me', jwtAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id:    req.user._id,
      email: req.user.email,
      name:  req.user.name,
      role:  req.user.role,
      did:   req.user.did,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
