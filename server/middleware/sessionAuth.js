/**
 * middleware/sessionAuth.js — Session Authentication Guard
 * Lectures 37-40: Session management, cookies, access control
 * 
 * This middleware protects routes that require authentication.
 * 
 * How it works:
 *   1. Check if req.session.user exists (set during login)
 *   2. If yes → allow the request through (next())
 *   3. If no  → save the requested URL in session.returnTo, then redirect
 *               to the login page. After login, user goes back to their
 *               original destination.
 * 
 * This is the server-side equivalent of a "route guard" in React Router.
 * The key difference: session guards run on the server and control what
 * HTML the browser receives, whereas React guards run in the browser.
 */

module.exports = (req, res, next) => {
  // Check if the user is authenticated via session
  if (req.session && req.session.user) {
    return next(); // User is logged in — proceed to the route handler
  }

  // Save the URL they were trying to visit — used after login for redirect
  req.session.returnTo = req.originalUrl;

  // Redirect to the login page
  res.redirect('/portal/login');
};
