
const express        = require('express');         // NPM: installed via `npm install express`
const cors           = require('cors');            // NPM: Cross-Origin Resource Sharing
const morgan         = require('morgan');          // NPM: HTTP request logger
const path           = require('path');            // Built-in: file path utilities
const fs             = require('fs');              // Built-in: file system
const helmet         = require('helmet');          // NPM: Security headers (Lectures 25-28)
const compression    = require('compression');     // NPM: Gzip response compression
const methodOverride = require('method-override'); // NPM: PUT/DELETE from HTML forms (Lectures 29-32)

// ─── IMPORTING OUR CUSTOM MODULES ────────────────────────────────────────────
// Each of these files uses module.exports — demonstrating file dependency
const config     = require('./config');               // config/index.js
const logger     = require('./middleware/logger');     // custom logger middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');
const requestId      = require('./middleware/requestId');     // UUID tracing
const { globalLimiter } = require('./middleware/rateLimiter'); // rate limiting

// ─── IMPORTING ROUTE MODULES ──────────────────────────────────────────────────
// express.Router() instances — each handles a namespace of routes
const credentialRoutes = require('./routes/credentials'); // /api/credentials
const identityRoutes   = require('./routes/identity');    // /api/identity
const issuerRoutes     = require('./routes/issuer');      // /api/issuers
const activityRoutes   = require('./routes/activity');    // /api/activity
const dashboardRoutes  = require('./routes/dashboard');   // /api/dashboard
const portalRoutes     = require('./routes/portal');      // /portal (SSR — Lectures 29-32)

// ─── ENSURE DATA DIRECTORY EXISTS (File Handling — Lectures 5-8) ─────────────
if (!fs.existsSync(config.DATA_DIR)) {
  fs.mkdirSync(config.DATA_DIR, { recursive: true });
  console.log(`📁 Created data directory: ${config.DATA_DIR}`);
}

// express() returns an Application object. This is the core of Express.
// Under the hood, it wraps Node's http.createServer() (which we saw in http-demo.js)
const app = express();

// ── EJS VIEW ENGINE (Lectures 29-32) ──────────────────────────────────────────
// EJS (Embedded JavaScript Templates) — server-side rendering for admin pages,
// printable reports, and SEO-friendly pages. React handles the interactive wallet.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// ── 0. SECURITY HEADERS (Helmet) ──────────────────────────────────────────────
// Helmet sets 11 security-related HTTP headers in one line:
//   X-Content-Type-Options   — prevents MIME-type sniffing
//   X-Frame-Options          — clickjacking protection
//   Strict-Transport-Security — forces HTTPS
//   Content-Security-Policy  — prevents XSS, injection attacks
//   X-DNS-Prefetch-Control   — controls DNS prefetching
//   X-Download-Options       — prevents IE from executing downloads
//   X-Permitted-Cross-Domain — restricts Adobe Flash/PDF cross-domain
//   Referrer-Policy          — controls Referer header leakage
//   X-XSS-Protection         — legacy XSS filter (modern CSP is better)
// MUST be the very first middleware — headers must be set before any response
app.use(helmet());

// ── 0.5 REQUEST ID TRACING ────────────────────────────────────────────────────
// Attaches a UUID to every request (req.id) and sends it as X-Request-Id header
// Enables end-to-end tracing: frontend error → backend log → exact request
app.use(requestId);

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

// ── Method Override (Lectures 29-32) ─────────────────────────────────────────
// HTML forms only support GET and POST. method-override lets us use PUT/DELETE
// from EJS forms via a hidden _method field: <input name="_method" value="DELETE">
app.use(methodOverride('_method'));

// ── 2.5 COMPRESSION ──────────────────────────────────────────────────────────
// Gzip all responses automatically — reduces payload size by ~70%
// Must come after body parsers, before route handlers
app.use(compression());

// ── 2.6 RATE LIMITING ─────────────────────────────────────────────────────────
// Global: 100 requests per 15 min per IP — protects against DDoS
app.use(globalLimiter);

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
// LECTURE 25-28: Production-grade health endpoint with system diagnostics
// Returns: status, memory breakdown, uptime, Node version, environment
app.get('/api/health', (req, res) => {
  const mem = process.memoryUsage();

  res.json({
    status:      'ok',
    project:     'Sovereign SSI Platform',
    version:     '1.0.0',
    environment: config.NODE_ENV,
    uptime:      `${Math.round(process.uptime())}s`,
    node:        process.version,
    platform:    process.platform,
    memory: {
      rss:       `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed:  `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
      external:  `${Math.round(mem.external / 1024 / 1024)}MB`,
    },
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

// ═════════════════════════════════════════════════════════════════
// SERVER-SIDE RENDERED ROUTES (Lectures 29-32)
// These routes render HTML pages using EJS templates.
// SSR is used for: admin dashboards, printable reports, API docs
// CSR (React) is used for: interactive wallet UI
// ═════════════════════════════════════════════════════════════════
app.use('/portal',   portalRoutes);             // /portal (issuer portal, reports)
app.use('/api-docs', (req, res, next) => {       // /api-docs → portal route
  req.url = '/docs';                             // rewrite to /docs handler
  portalRoutes(req, res, next);
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
  console.log('║            Node.js + Express   Lectures 1-32                ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║  Server  : http://${config.HOST}:${config.PORT}                              ║`);
  console.log(`║  Env     : ${config.NODE_ENV.padEnd(51)}║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  Middleware (Lectures 25-28)                                ║');
  console.log('║  ✔ Helmet security headers    ✔ Gzip compression           ║');
  console.log('║  ✔ Rate limiting (100/15min)  ✔ Request ID tracing         ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  SSR Portal (Lectures 29-32)                               ║');
  console.log('║  ✔ EJS view engine            ✔ method-override            ║');
  console.log(`║  GET  /portal                    (issuer portal)            ║`);
  console.log(`║  GET  /portal/report/:id         (credential report)        ║`);
  console.log(`║  GET  /api-docs                  (API reference)            ║`);
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log('║  API Endpoints                                             ║');
  console.log(`║  GET  /api/health                (health check)             ║`);
  console.log(`║  *    /api/credentials           (credential CRUD)          ║`);
  console.log(`║  *    /api/identity              (DID management)           ║`);
  console.log(`║  *    /api/issuers               (issuer portal)            ║`);
  console.log(`║  *    /api/activity              (activity feed)            ║`);
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
