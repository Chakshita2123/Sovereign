/**
 * middleware/flash.js — Lightweight Flash Messages
 * Lectures 37-40: Session management, cookies
 * 
 * Flash messages are one-time messages that survive a single redirect.
 * They are stored in the session, read once, then deleted.
 * 
 * How it works:
 *   1. A route sets req.session.flash = { error: 'Wrong password' }
 *   2. After redirect, this middleware copies flash to res.locals
 *   3. EJS templates read res.locals.flash (e.g., flash.error)
 *   4. The flash is deleted — next request sees no flash
 * 
 * This avoids installing connect-flash by using express-session directly.
 */

module.exports = (req, res, next) => {
  // Copy flash data from session to res.locals (accessible in EJS templates)
  res.locals.flash = req.session.flash || {};

  // Delete from session so it only shows once (one-time message)
  delete req.session.flash;

  next();
};
