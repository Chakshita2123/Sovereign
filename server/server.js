
const express = require('express');  // NPM: installed via `npm install express`
const cors    = require('cors');     // NPM: Cross-Origin Resource Sharing
const morgan  = require('morgan');   // NPM: HTTP request logger
const path    = require('path');     // Built-in: file path utilities
const fs      = require('fs');       // Built-in: file system

// ─── IMPORTING OUR CUSTOM MODULES ────────────────────────────────────────────
// Each of these files uses module.exports — demonstrating file dependency
const config     = require('./config');               // config/index.js
const logger     = require('./middleware/logger');     // custom logger middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');

// ─── IMPORTING ROUTE MODULES ──────────────────────────────────────────────────
// express.Router() instances — each handles a namespace of routes
const credentialRoutes = require('./routes/credentials'); // /api/credentials
const identityRoutes   = require('./routes/identity');    // /api/identity
const issuerRoutes     = require('./routes/issuer');      // /api/issuers
const activityRoutes   = require('./routes/activity');    // /api/activity
const dashboardRoutes  = require('./routes/dashboard');   // /api/dashboard

// ─── ENSURE DATA DIRECTORY EXISTS (File Handling — Lectures 5-8) ─────────────
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
  console.log(`📁 Created data directory: ${config.DATA_DIR}`);
}

// express() returns an Application object. This is the core of Express.
// Under the hood, it wraps Node's http.createServer() (which we saw in http-demo.js)
const app = express();


// ── 1. CORS Middleware ────────────────────────────────────────────────────────
// Allows the React frontend (localhost:5173) to call this API.
// Without this, browsers block cross-origin requests.
app.use(cors({
  origin: config.ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ── 2. Body Parsers ───────────────────────────────────────────────────────────
// express.json()           — parses JSON bodies → req.body
// express.urlencoded()     — parses HTML form bodies → req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 3. Request Logger ────────────────────────────────────────────────────────
// morgan: standard logging (combined format)
// logger: our custom middleware that also writes to data/access.log
if (config.isDev) {
  app.use(morgan('dev'));      // colorized short format in development
} else {
  app.use(morgan('combined')); // Apache-style logs in production
}
app.use(logger); // our custom logger (middleware/logger.js)

// express.static() is a built-in middleware that serves files from a directory.
// Any file in the /public folder is served at its filename:
//   GET /index.html    → public/index.html
//   GET /styles.css    → public/styles.css
//   GET /              → public/index.html (if it exists)
app.use(express.static(path.join(__dirname, 'public')));

// ═════════════════════════════════════════════════════════════════
// API ROUTES
// app.use('/prefix', router) mounts the router at /prefix
// ═════════════════════════════════════════════════════════════════

// ── API Health Check ──────────────────────────────────────────────────────────
// Inline route handler (not in a separate file) — demonstrates single handler
app.get('/api/health', (req, res) => {
  // RESPONSE METHOD: res.json()
  res.json({
    status:      'ok',
    project:     'Sovereign SSI Platform',
    version:     '1.0.0',
    environment: config.NODE_ENV,
    uptime:      `${Math.round(process.uptime())}s`,
    memory:      `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
    timestamp:   new Date().toISOString(),
    endpoints: {
      credentials: '/api/credentials',
      identity:    '/api/identity',
      issuers:     '/api/issuers',
      activity:    '/api/activity',
    },
  });
});

// inside these router files (routes/*.js)
app.use('/api/credentials', credentialRoutes); // routes/credentials.js
app.use('/api/identity',    identityRoutes);   // routes/identity.js
app.use('/api/issuers',     issuerRoutes);     // routes/issuer.js
app.use('/api/activity',    activityRoutes);   // routes/activity.js
app.use('/api/dashboard',   dashboardRoutes);  // routes/dashboard.js
// res.sendFile() streams a file from disk directly to the client.
// This demonstrates "Handling static pages with file stream"
app.get('/api-docs', (req, res) => {
  const docsPath = path.join(__dirname, 'public', 'api-docs.html');
  if (fs.existsSync(docsPath)) {
    res.sendFile(docsPath); // streams the file — efficient for large HTML pages
  } else {
    // RESPONSE METHOD: res.redirect() — redirect to another URL
    res.redirect('/');
  }
});

// ─── Catch-All: Redirect unknown GET routes to the frontend ───────────────────
// Any non-API GET request is sent to the frontend (React SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // RESPONSE METHOD: res.status().send()
    res.status(404).send('Frontend not found. Make sure to build the React app first.');
  }
});
app.use(notFound);      // 404 handler — route not matched
app.use(errorHandler);  // global error handler — logs and returns JSON

app.listen(config.PORT, config.HOST, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║            SOVEREIGN — SSI Platform Backend                 ║');
  console.log('║            Node.js + Express   Lectures 1-24                ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Server  : http://${config.HOST}:${config.PORT}                              ║`);
  console.log(`║  Env     : ${config.NODE_ENV.padEnd(51)}║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  API Endpoints                                               ║');
  console.log(`║  GET  /api/health                (health check)             ║`);
  console.log(`║  *    /api/credentials           (credential CRUD)          ║`);
  console.log(`║  *    /api/identity              (DID management)           ║`);
  console.log(`║  *    /api/issuers               (issuer portal)            ║`);
  console.log(`║  *    /api/activity              (activity feed)            ║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  Demo files                                                  ║');
  console.log('║  node http-demo.js       (raw HTTP module, port 3002)        ║');
  console.log('║  node file-handling-demo.js  (fs module demo)               ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1); // mandatory restart after uncaught exception
});

module.exports = app; // export for testing
