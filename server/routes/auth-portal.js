/**
 * routes/auth-portal.js — Portal Authentication Routes
 * Lectures 37-40: Sessions, cookies, bcrypt password hashing
 * 
 * Handles login/logout for the EJS issuer portal.
 * Uses a hardcoded admin user from .env (Day 6 adds the full User model).
 * 
 * Routes:
 *   GET  /portal/login  → render login page
 *   POST /portal/login  → authenticate with bcrypt → set session → redirect
 *   GET  /portal/logout → destroy session → clear cookie → redirect
 * 
 * Security features:
 *   - bcrypt.compare() for constant-time password checking (prevents timing attacks)
 *   - Session regeneration on login (prevents session fixation attacks)
 *   - Cookie cleared on logout (full session lifecycle)
 *   - Flash messages for user feedback
 */

const express = require('express');
const bcrypt  = require('bcrypt');
const router  = express.Router();

// ─── GET /portal/login ────────────────────────────────────────────────────────
// Renders the login page. This route is NOT protected by sessionAuth.
// If user is already logged in, redirect them to the portal.
router.get('/login', (req, res) => {
  // If already authenticated, skip the login page
  if (req.session && req.session.user) {
    return res.redirect('/portal');
  }

  res.render('login', {
    pageTitle: 'Login',
    pageDescription: 'Sign in to the Sovereign Issuer Portal',
    activePage: 'login',
    error: null,
  });
});

// ─── POST /portal/login ──────────────────────────────────────────────────────
// Authenticates the user with email + password (bcrypt comparison).
// On success: sets req.session.user, redirects to portal (or returnTo URL).
// On failure: re-renders login page with flash error message.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Validate input ──────────────────────────────────────────────────────
    if (!email || !password) {
      req.session.flash = { error: 'Email and password are required.' };
      return res.redirect('/portal/login');
    }

    // ── Check against admin credentials from .env ───────────────────────────
    // Day 6 replaces this with a full User model + Passport.js
    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassHash = process.env.ADMIN_PASS_HASH;

    if (!adminEmail || !adminPassHash) {
      console.error('❌ ADMIN_EMAIL or ADMIN_PASS_HASH not set in .env');
      req.session.flash = { error: 'Server configuration error. Contact admin.' };
      return res.redirect('/portal/login');
    }

    // ── Compare email (case-insensitive) ────────────────────────────────────
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      req.session.flash = { error: 'Invalid email or password.' };
      return res.redirect('/portal/login');
    }

    // ── Compare password with bcrypt ────────────────────────────────────────
    // bcrypt.compare() is constant-time — prevents timing-based attacks
    const isMatch = await bcrypt.compare(password, adminPassHash);
    if (!isMatch) {
      req.session.flash = { error: 'Invalid email or password.' };
      return res.redirect('/portal/login');
    }

    // ── Authentication successful ───────────────────────────────────────────
    // Regenerate session ID to prevent session fixation attacks
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        req.session.flash = { error: 'Login failed. Please try again.' };
        return res.redirect('/portal/login');
      }

      // Set the user object in the session
      req.session.user = {
        email: adminEmail,
        role: 'admin',
        loginAt: new Date().toISOString(),
      };

      // Flash success message
      req.session.flash = { success: `Welcome back, ${adminEmail}!` };

      // Redirect to the original URL they were trying to visit, or /portal
      const returnTo = req.session.returnTo || '/portal';
      delete req.session.returnTo;

      // Save session before redirect to ensure data persists
      req.session.save((saveErr) => {
        if (saveErr) console.error('Session save error:', saveErr);
        res.redirect(returnTo);
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    req.session.flash = { error: 'An unexpected error occurred.' };
    res.redirect('/portal/login');
  }
});

// ─── GET /portal/logout ──────────────────────────────────────────────────────
// Destroys the session, clears the cookie, and redirects to login.
// This demonstrates the full session lifecycle: create → use → destroy.
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err);
    }

    // Clear the session cookie from the browser
    // 'connect.sid' is the default cookie name for express-session
    res.clearCookie('connect.sid');

    // Redirect to login page
    res.redirect('/portal/login');
  });
});

module.exports = router;
