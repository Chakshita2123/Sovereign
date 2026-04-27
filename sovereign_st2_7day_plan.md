# Sovereign — ST2 Seven-Day Work Plan
### Lectures 25–48 | Middleware · SSR · MongoDB · Sessions · JWT · Socket.io

---

## Overview

| Day | Focus | Lectures | Phase |
|-----|-------|----------|-------|
| Day 1 | Production Middleware | 25–28 | Phase 1 |
| Day 2 | EJS Server-Side Rendering | 29–32 | Phase 2 |
| Day 3 | MongoDB + Mongoose Setup | 33–36 | Phase 3 (Part A) |
| Day 4 | Mongoose Models + Migration | 33–36 | Phase 3 (Part B) |
| Day 5 | Sessions, Cookies & Portal Auth | 37–40 | Phase 4 |
| Day 6 | JWT Authentication + Passport.js | 41–44 | Phase 5 |
| Day 7 | Real-Time with Socket.io | 45–48 | Phase 6 |

---

## Day 1 — Production Middleware Layer
**Lectures 25–28 | Theme: Middleware lifecycle, error handling, body-parser**

### Goal
Transform the basic Express setup into a hardened, production-ready middleware chain. Every incoming request should be rate-limited, validated, traced, and responded to with structured errors.

### Installs
```bash
cd server
npm install helmet express-rate-limit express-validator compression uuid
```

### Tasks

**Task 1 — Security headers with Helmet**
- Add `helmet()` as the very first middleware in `server.js`
- This sets 11 security headers in one line (X-Frame-Options, Content-Security-Policy, etc.)
- Add a comment block explaining what each header protects against

```js
// server.js
const helmet = require('helmet');
app.use(helmet()); // Sets X-Frame-Options, Content-Security-Policy, HSTS, etc.
```

**Task 2 — Rate Limiting**
- Create `middleware/rateLimiter.js`
- Apply a global limiter (100 req / 15 min) and a stricter one for auth routes (10 req / 15 min)

```js
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  message: { success: false, error: 'Too many requests, slow down.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many auth attempts.' }
});

module.exports = { globalLimiter, authLimiter };
```

**Task 3 — Request ID Tracing**
- Create `middleware/requestId.js`
- Attach a `uuid` to every `req` object and send it back as `X-Request-Id` response header
- This lets you trace any error back to the exact request

```js
// middleware/requestId.js
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
};
```

**Task 4 — Validation Middleware**
- Create `middleware/validate.js`
- Export a `validateBody(schema)` higher-order function using `express-validator`
- Apply to POST routes in `routes/credentials.js` and `routes/identity.js`

```js
// middleware/validate.js
const { validationResult } = require('express-validator');

const validateBody = (rules) => [
  ...rules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateBody };
```

**Task 5 — Upgrade errorHandler.js**
- Modify `middleware/errorHandler.js` to return structured JSON with `code`, `message`, `requestId`, and `timestamp`
- Add a `notFound` handler for unmatched routes

**Task 6 — Compression**
- Add `compression()` middleware — gzip all responses automatically

```js
// server.js
const compression = require('compression');
app.use(compression());
```

**Task 7 — Upgrade /api/health**
- Return DB connection status, memory usage, uptime, and Node version

### Files Modified / Created
| File | Status |
|------|--------|
| `middleware/rateLimiter.js` | ✅ New |
| `middleware/requestId.js` | ✅ New |
| `middleware/validate.js` | ✅ New |
| `middleware/errorHandler.js` | 🔧 Modified |
| `server.js` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] `GET /api/health` shows memory, uptime, environment
- [ ] `curl` any route 101 times — 101st returns 429 Too Many Requests
- [ ] POST with missing fields returns `{ success: false, errors: [...] }` with field names
- [ ] Every response has an `X-Request-Id` header

### Resume Bullets
- Implemented rate-limiting (100 req/15 min) and Helmet security headers guarding against OWASP Top 10
- Built reusable request-validation middleware with structured 422 error responses
- Added end-to-end request tracing via UUID injection middleware

---

## Day 2 — Server-Side Rendering with EJS
**Lectures 29–32 | Theme: SSR vs CSR, template engines, EJS partials**

### Goal
Add a server-rendered portal alongside the React SPA. This demonstrates you understand *when* to use SSR (admin dashboards, printable pages, SEO) vs CSR (interactive wallet UI).

### Installs
```bash
cd server
npm install ejs method-override
```

### Tasks

**Task 1 — Configure EJS as view engine**
```js
// server.js
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

**Task 2 — Create base layout partial**
- Create `views/layouts/base.ejs`
- Include a `<head>` with Bootstrap CDN (no extra install), a nav bar, and `<%- body %>`
- This demonstrates EJS partials with `<%- include('layouts/base', { body: ... }) %>`

**Task 3 — Issuer Portal page**
- Create `views/issuer-portal.ejs`
- Loop over issuers from the DB using `<% issuers.forEach(issuer => { %>`
- Show each issuer as a card with name, type, credential count, and an Issue button

**Task 4 — Credential Report page**
- Create `views/credential-report.ejs`
- A printable credential verification report — triggered by `GET /portal/report/:id`
- Include a `window.print()` button and print-friendly CSS in a `<style>` block

**Task 5 — API Docs page**
- Create `views/api-docs.ejs`
- A live, server-rendered API reference that lists every route
- The route list comes from a JS array passed in `res.render()` — not hardcoded HTML

**Task 6 — Create portal routes**
- Create `routes/portal.js`
- `GET /portal` → `res.render('issuer-portal', { issuers })`
- `GET /portal/report/:id` → fetch credential from fileDb → `res.render('credential-report', { credential })`
- `GET /api-docs` → `res.render('api-docs', { routes: apiRouteList })`

### Files Modified / Created
| File | Status |
|------|--------|
| `views/layouts/base.ejs` | ✅ New |
| `views/issuer-portal.ejs` | ✅ New |
| `views/credential-report.ejs` | ✅ New |
| `views/api-docs.ejs` | ✅ New |
| `routes/portal.js` | ✅ New |
| `server.js` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] `http://localhost:3001/portal` loads a real HTML page (not JSON)
- [ ] `http://localhost:3001/portal/report/:id` shows a printable credential card
- [ ] `http://localhost:3001/api-docs` renders a live list of all API routes
- [ ] All pages use the shared `base.ejs` layout partial

### Resume Bullets
- Built a server-side rendered issuer portal using EJS template engine with partials and layout inheritance
- Demonstrated SSR vs CSR: EJS for crawlable admin pages, React for interactive wallet UI
- Generated server-rendered printable credential verification reports with print-optimised CSS

---

## Day 3 — MongoDB + Mongoose Setup (Part A)
**Lectures 33–36 | Theme: NoSQL databases, MongoDB, connecting with Mongoose**

### Goal
Set up MongoDB Atlas, connect it to Express, and create all Mongoose schemas. This is the most impactful single change in ST2 — replacing JSON files with a real database.

### Installs
```bash
cd server
npm install mongoose dotenv
```

### Preparation
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) — free M0 tier
2. Create a cluster → Database Access → Add user (username + password)
3. Network Access → Allow from anywhere (0.0.0.0/0) for dev
4. Get the connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/sovereign`
5. Add to `server/.env`: `MONGO_URI=mongodb+srv://...`

### Tasks

**Task 1 — Database connection module**
- Create `config/database.js`
- Include retry logic, event listeners (connected, error, disconnected), and graceful shutdown

```js
// config/database.js
const mongoose = require('mongoose');

const connect = async () => {
  mongoose.connection.on('connected', () => console.log('✅ MongoDB connected'));
  mongoose.connection.on('error',     (e) => console.error('❌ MongoDB error:', e));
  mongoose.connection.on('disconnected', () => console.log('⚠️  MongoDB disconnected'));

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGINT)');
  process.exit(0);
});

module.exports = { connect };
```

**Task 2 — Connect at server startup**
```js
// server.js
const { connect } = require('./config/database');
connect(); // non-blocking — server starts, DB connects in background
```

**Task 3 — Update /api/health to show DB status**
```js
mongoose.connection.readyState
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
```

**Task 4 — Credential schema**
- Create `models/Credential.js`
- Fields: `id`, `type`, `holder`, `issuer`, `issuedDate`, `expiryDate`, `status`, `metadata`, `zkpProofs`
- Add compound index on `{ holder: 1, status: 1 }` for dashboard queries

**Task 5 — Identity (DID) schema**
- Create `models/Identity.js`
- Fields: `did`, `controller`, `verificationMethods`, `services`, `trustScore`, `created`, `keyRotations`
- Add unique index on `did`

### Files Modified / Created
| File | Status |
|------|--------|
| `config/database.js` | ✅ New |
| `models/Credential.js` | ✅ New |
| `models/Identity.js` | ✅ New |
| `server/.env` | 🔧 Modified |
| `server/.env.example` | 🔧 Modified |
| `server.js` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] Server logs `✅ MongoDB connected` on startup
- [ ] `GET /api/health` shows `db: "connected"`
- [ ] `mongoose.connection.readyState === 1` in the Node REPL
- [ ] No errors in the terminal when running `npm run dev`

### Resume Bullets
- Connected Express to MongoDB Atlas using Mongoose with retry logic and graceful shutdown handlers
- Designed NoSQL schemas for SSI credentials and DIDs with appropriate indexes for query patterns

---

## Day 4 — Mongoose Models + Data Migration (Part B)
**Lectures 33–36 | Theme: ODM, CRUD with Mongoose, migration scripts**

### Goal
Create the remaining schemas, rewrite the data layer to use Mongoose instead of fs/JSON files, and migrate existing seed data into MongoDB.

### Tasks

**Task 1 — Issuer schema**
- Create `models/Issuer.js`
- Fields: `id`, `name`, `type` (Government/University/Employer/etc.), `did`, `credentials`, `stats`, `verified`
- Add a virtual `credentialCount` that computes from `credentials.length`

**Task 2 — Activity schema**
- Create `models/Activity.js`
- Fields: `type`, `description`, `actor`, `target`, `metadata`, `timestamp`, `read`
- Add TTL index: `{ timestamp: 1 }, { expireAfterSeconds: 7776000 }` (90 days auto-delete)

**Task 3 — Rewrite utils/fileDb.js → utils/db.js**
- Replace all `fs.readFile` / `JSON.parse` / `fs.writeFile` with Mongoose methods
- Keep the same function signatures so routes don't need changes yet

```js
// Before (fileDb.js)
const getAll = async (collection) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

// After (db.js)
const getAll = async (Model, filter = {}) => {
  return Model.find(filter).lean();
};
```

**Task 4 — Update all route files**
- Import Mongoose models instead of fileDb utilities in `routes/credentials.js`, `routes/identity.js`, `routes/issuer.js`, `routes/activity.js`
- Use `Model.find()`, `Model.findById()`, `new Model({}).save()`, `Model.findByIdAndUpdate()`, `Model.findByIdAndDelete()`

**Task 5 — Pre-save lifecycle hooks**
- In `Credential.js`: pre-save hook to auto-set `updatedAt`
- In `Identity.js`: pre-save hook to validate DID format with a regex
- In `Issuer.js`: pre-save hook to generate `id` slug from `name` if not set

**Task 6 — Write migration script**
- Create `utils/migrate.js`
- Reads `data/*.json`, maps each record to a Mongoose model, inserts with `Model.insertMany()`
- Skips records that already exist (upsert by `id`)
- Run once: `node utils/migrate.js`

```js
// utils/migrate.js
const { connect } = require('../config/database');
const Credential = require('../models/Credential');
const credentials = require('../data/credentials.json');

(async () => {
  await connect();
  for (const c of credentials) {
    await Credential.findOneAndUpdate({ id: c.id }, c, { upsert: true });
  }
  console.log(`✅ Migrated ${credentials.length} credentials`);
  process.exit(0);
})();
```

### Files Modified / Created
| File | Status |
|------|--------|
| `models/Issuer.js` | ✅ New |
| `models/Activity.js` | ✅ New |
| `utils/db.js` | ✅ New |
| `utils/migrate.js` | ✅ New |
| `routes/credentials.js` | 🔧 Modified |
| `routes/identity.js` | 🔧 Modified |
| `routes/issuer.js` | 🔧 Modified |
| `routes/activity.js` | 🔧 Modified |
| `utils/fileDb.js` | 🔧 Deprecated |

### End-of-Day Checkpoint
- [ ] `node utils/migrate.js` exits with `✅ Migrated N records` for each collection
- [ ] `GET /api/credentials` returns data from MongoDB (verify in Atlas UI)
- [ ] `POST /api/credentials` creates a real MongoDB document with `_id`
- [ ] `DELETE /api/credentials/:id` removes the document from Atlas
- [ ] No JSON file reads remaining in any route file

### Resume Bullets
- Migrated file-based JSON storage to MongoDB with Mongoose ODM, including an idempotent migration script
- Implemented pre-save lifecycle hooks for timestamp management, DID validation, and slug generation
- Added TTL index on activity logs for automatic 90-day data expiry

---

## Day 5 — Sessions, Cookies & Portal Authentication
**Lectures 37–40 | Theme: Session management, cookies, express-session**

### Goal
Protect the EJS issuer portal with session-based authentication. Visitors must log in before accessing `/portal`. This demonstrates the full cookie-session lifecycle.

### Installs
```bash
cd server
npm install express-session connect-mongo bcrypt
```

### Tasks

**Task 1 — Configure express-session with MongoDB store**
```js
// server.js
const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(session({
  secret: process.env.SESSION_SECRET,     // long random string in .env
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,                        // JS cannot access cookie
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    sameSite: 'lax',                       // CSRF protection
    maxAge: 1000 * 60 * 60 * 24,          // 24 hours
  }
}));
```

**Task 2 — Flash messages middleware**
- Without installing connect-flash, implement a lightweight version:
```js
// middleware/flash.js
module.exports = (req, res, next) => {
  res.locals.flash = req.session.flash || {};
  delete req.session.flash;
  next();
};
```
- Access in EJS: `<% if (flash.success) { %><div class="alert alert-success">...</div><% } %>`

**Task 3 — Session auth guard middleware**
- Create `middleware/sessionAuth.js`
```js
module.exports = (req, res, next) => {
  if (req.session && req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect('/portal/login');
};
```

**Task 4 — Login page (EJS)**
- Create `views/login.ejs` — a clean HTML form with email + password fields
- Add Bootstrap validation classes on submit error

**Task 5 — Login/Logout routes**
- Create `routes/auth-portal.js`:
  - `GET /portal/login` → `res.render('login', { error: null })`
  - `POST /portal/login` → compare password with `bcrypt.compare()` → set `req.session.user` → redirect to `/portal`
  - `GET /portal/logout` → `req.session.destroy()` → clear cookie → redirect to `/portal/login`
- Hard-code one admin user in `.env` for now (`ADMIN_EMAIL`, `ADMIN_PASS_HASH`) — Day 6 adds the full User model

**Task 6 — Protect portal routes**
- Apply `sessionAuth` middleware to all `/portal` routes except `/portal/login`
```js
// routes/portal.js
const sessionAuth = require('../middleware/sessionAuth');
router.use(sessionAuth); // protects all routes in this router
```

**Task 7 — Show session info in portal nav**
- Display `req.session.user.email` in the nav bar: `<%= user.email %>`
- Pass `user: req.session.user` in every `res.render()` call via `res.locals`

### Files Modified / Created
| File | Status |
|------|--------|
| `middleware/sessionAuth.js` | ✅ New |
| `middleware/flash.js` | ✅ New |
| `views/login.ejs` | ✅ New |
| `routes/auth-portal.js` | ✅ New |
| `server.js` | 🔧 Modified |
| `routes/portal.js` | 🔧 Modified |
| `server/.env` | 🔧 Modified |
| `server/.env.example` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] Visiting `http://localhost:3001/portal` redirects to `/portal/login`
- [ ] Logging in sets a `connect.sid` cookie (visible in browser DevTools → Application → Cookies)
- [ ] Logging out destroys the session and clears the cookie
- [ ] Session survives a server restart (stored in MongoDB — check Atlas `sessions` collection)
- [ ] Wrong password shows a flash error on the login page

### Resume Bullets
- Implemented server-side session management with MongoDB-backed session store for restart persistence
- Secured admin portal with session authentication, cookie hardening (httpOnly, sameSite, secure), and flash messaging
- Demonstrated full session lifecycle: creation, persistence, guard middleware, and destruction

---

## Day 6 — JWT Authentication + Passport.js
**Lectures 41–44 | Theme: Bcrypt, JWT tokens, Passport strategies**

### Goal
Add full API authentication. The React wallet and all API consumers must present a valid JWT. This protects every `/api` route and adds role-based access (holder / issuer / verifier).

### Installs
```bash
cd server
npm install jsonwebtoken passport passport-local passport-jwt

cd ../client
npm install   # no new client deps needed
```

### Tasks

**Task 1 — User model**
- Create `models/User.js`
- Fields: `email`, `passwordHash`, `role` (enum: holder/issuer/verifier), `name`, `did`
- Pre-save hook: `this.passwordHash = await bcrypt.hash(this.password, 12)` (use a virtual `password` field)
- Instance method: `user.comparePassword(candidate)` → `bcrypt.compare(candidate, this.passwordHash)`

**Task 2 — Passport configuration**
- Create `config/passport.js`
- Strategy 1 — `passport-local`: look up user by email, call `user.comparePassword()`
- Strategy 2 — `passport-jwt`: extract Bearer token from Authorization header, verify with `JWT_SECRET`, attach `req.user`

```js
// config/passport.js
const { Strategy: LocalStrategy }  = require('passport-local');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

module.exports = (passport) => {
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return done(null, false);
    return done(null, user);
  }));

  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  }, async (payload, done) => {
    const user = await User.findById(payload.sub);
    return user ? done(null, user) : done(null, false);
  }));
};
```

**Task 3 — Auth routes**
- Create `routes/auth.js`:
  - `POST /api/auth/register` → validate body → create User → return JWT
  - `POST /api/auth/login` → passport.authenticate('local') → sign JWT → return `{ token, user }`
  - `GET /api/auth/me` → JWT guard → return `req.user`

```js
// Sign JWT helper
const signToken = (user) => jwt.sign(
  { sub: user._id, role: user.role, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

**Task 4 — JWT guard middleware**
- Create `middleware/auth.js`
```js
const passport = require('passport');
const jwtAuth  = passport.authenticate('jwt', { session: false });

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, error: 'Forbidden — insufficient role' });
  }
  next();
};

module.exports = { jwtAuth, requireRole };
```

**Task 5 — Protect all API routes**
```js
// server.js — apply after route registration
const { jwtAuth } = require('./middleware/auth');
app.use('/api/credentials', jwtAuth, credentialRoutes);
app.use('/api/identity',    jwtAuth, identityRoutes);
app.use('/api/issuers',     jwtAuth, issuerRoutes);
app.use('/api/activity',    jwtAuth, activityRoutes);
// /api/auth and /api/health remain public
```

**Task 6 — Role-based route guards**
```js
// routes/issuer.js
const { requireRole } = require('../middleware/auth');
router.post('/:id/issue', requireRole('issuer', 'verifier'), issueCredential);
router.post('/:id/bulk',  requireRole('issuer'), bulkIssue);
```

**Task 7 — Update React frontend**
- Add `authService.ts` to `client/src/app/services/`
- Store JWT in a React state variable (not localStorage — security best practice)
- Add `Authorization: Bearer <token>` header to all axios/fetch calls in `api.ts`
- Add a login screen to the React app that calls `POST /api/auth/login`

### Files Modified / Created
| File | Status |
|------|--------|
| `models/User.js` | ✅ New |
| `routes/auth.js` | ✅ New |
| `config/passport.js` | ✅ New |
| `middleware/auth.js` | ✅ New |
| `client/src/app/services/authService.ts` | ✅ New |
| `server.js` | 🔧 Modified |
| `client/src/app/services/api.ts` | 🔧 Modified |
| `server/.env` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] `POST /api/auth/register` returns `{ token, user }` with a valid JWT
- [ ] `POST /api/auth/login` with wrong password returns `401 Unauthorized`
- [ ] `GET /api/credentials` without a token returns `401 Unauthorized`
- [ ] `GET /api/credentials` with `Authorization: Bearer <token>` returns data
- [ ] Issuer-only routes return `403 Forbidden` when called with a holder token
- [ ] React app login flow works end-to-end

### Resume Bullets
- Built end-to-end authentication: bcrypt (cost factor 12) password hashing, JWT access tokens, two Passport.js strategies
- Implemented role-based access control (holder/issuer/verifier) with guard middleware on sensitive routes
- Secured all API endpoints with JWT; React frontend stores tokens in memory for XSS protection

---

## Day 7 — Real-Time with Socket.io
**Lectures 45–48 | Theme: Full-duplex communication, WebSockets, Socket.io**

### Goal
Add live event notifications to the Sovereign dashboard. When a credential is issued or a proof request is approved, the holder sees it instantly — no page refresh, no polling.

### Installs
```bash
cd server
npm install socket.io

cd ../client
npm install socket.io-client
```

### Tasks

**Task 1 — Attach Socket.io to the HTTP server**
- In `server.js`, switch from `app.listen()` to `http.createServer(app)` so Socket.io can share the HTTP server

```js
// server.js
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: config.ALLOWED_ORIGINS, methods: ['GET', 'POST'] }
});

// Pass io to routes that need to emit events
app.set('io', io);

server.listen(config.PORT, config.HOST, () => { /* existing startup log */ });
```

**Task 2 — Connection handler + room architecture**
```js
// server.js
io.on('connection', (socket) => {
  console.log(`⚡ Socket connected: ${socket.id}`);

  // Each holder joins their own room by DID so events are targeted
  socket.on('join:wallet', ({ did }) => {
    socket.join(`wallet:${did}`);
    console.log(`  → joined room wallet:${did}`);
  });

  socket.on('disconnect', () => {
    console.log(`  ⚡ Socket disconnected: ${socket.id}`);
  });
});
```

**Task 3 — Socket event manager utility**
- Create `utils/socketManager.js`
- Export typed emit helpers — routes call these instead of touching `io` directly

```js
// utils/socketManager.js
const getIo = (app) => app.get('io');

const notifyCredentialIssued = (app, holderDid, credential) => {
  getIo(app).to(`wallet:${holderDid}`).emit('credential:issued', { credential });
};

const notifyProofRequest = (app, holderDid, proofRequest) => {
  getIo(app).to(`wallet:${holderDid}`).emit('proof:request', { proofRequest });
};

const notifyProofApproved = (app, holderDid, proofId) => {
  getIo(app).to(`wallet:${holderDid}`).emit('proof:approved', { proofId });
};

const notifyCredentialExpiring = (app, holderDid, credential) => {
  getIo(app).to(`wallet:${holderDid}`).emit('credential:expiring', { credential });
};

module.exports = { notifyCredentialIssued, notifyProofRequest, notifyProofApproved, notifyCredentialExpiring };
```

**Task 4 — Wire events into existing routes**
```js
// routes/credentials.js — after saving a new credential
const { notifyCredentialIssued } = require('../utils/socketManager');

router.post('/', jwtAuth, async (req, res) => {
  const credential = await new Credential(req.body).save();
  notifyCredentialIssued(req.app, credential.holder, credential);
  res.status(201).json({ success: true, data: credential });
});
```
- `routes/activity.js` → emit after `POST /api/activity/proof-requests/:id/approve`
- `routes/issuer.js`   → emit after `POST /api/issuers/:id/issue`

**Task 5 — React useSocket() hook**
- Create `client/src/app/hooks/useSocket.ts`

```ts
// client/src/app/hooks/useSocket.ts
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

export const useSocket = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.did) return;
    const socket = io('http://localhost:3001', { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join:wallet', { did: user.did });
    });

    return () => { socket.disconnect(); };
  }, [user?.did]);

  return socketRef.current;
};
```

**Task 6 — Live activity feed in React dashboard**
```ts
// client/src/app/pages/Dashboard.tsx
const socket = useSocket();

useEffect(() => {
  if (!socket) return;

  socket.on('credential:issued', ({ credential }) => {
    setActivities(prev => [{ type: 'issued', credential, timestamp: new Date() }, ...prev]);
    toast.success(`New credential: ${credential.type}`);
  });

  socket.on('proof:approved', ({ proofId }) => {
    setActivities(prev => [{ type: 'proof_approved', proofId, timestamp: new Date() }, ...prev]);
  });

  return () => {
    socket.off('credential:issued');
    socket.off('proof:approved');
  };
}, [socket]);
```

**Task 7 — Real-time badge on nav**
- Add an unread notification badge to the React nav bar
- Increment a counter on any socket event, reset on page visit

### Files Modified / Created
| File | Status |
|------|--------|
| `utils/socketManager.js` | ✅ New |
| `client/src/app/hooks/useSocket.ts` | ✅ New |
| `server.js` | 🔧 Modified |
| `routes/credentials.js` | 🔧 Modified |
| `routes/activity.js` | 🔧 Modified |
| `routes/issuer.js` | 🔧 Modified |
| `client/src/app/pages/Dashboard.tsx` | 🔧 Modified |

### End-of-Day Checkpoint
- [ ] Server logs `⚡ Socket connected:` when browser opens the React app
- [ ] Server logs `→ joined room wallet:<did>` after login
- [ ] `POST /api/credentials` via Postman causes the React dashboard to update live — no refresh
- [ ] `POST /api/activity/proof-requests/:id/approve` emits a visible toast in React
- [ ] Disconnecting (close browser tab) logs `⚡ Socket disconnected`

### Resume Bullets
- Integrated Socket.io for full-duplex communication — live credential issuance and proof approval notifications
- Built a `useSocket()` React hook with room-based architecture; notifications are targeted to the correct DID holder
- Eliminated API polling from the dashboard by replacing it with WebSocket event subscriptions

---

## Final Checklist — Is Sovereign ST2 Resume-Ready?

### Architecture
- [ ] MongoDB Atlas with 4 Mongoose schemas, indexes, and lifecycle hooks
- [ ] JWT + Passport.js auth protecting all API routes
- [ ] Role-based access control (holder / issuer / verifier)
- [ ] Session-based EJS portal with MongoDB session store
- [ ] Socket.io real-time events with room-based targeting
- [ ] EJS SSR portal running alongside the React CSR app
- [ ] Helmet + rate-limiting + request validation + compression

### Code Quality
- [ ] All routes use `async/await` with `try/catch` wired to the error handler
- [ ] No hardcoded secrets — everything in `.env` (`.env.example` committed)
- [ ] `.gitignore` covers `node_modules/`, `.env`, `data/*.json`
- [ ] README updated with new setup steps (MONGO_URI, SESSION_SECRET, JWT_SECRET)
- [ ] Comments on every middleware explaining the "why" (for curriculum coverage proof)

### What to Demo in an Interview
1. Open the app — show the React wallet with live data from MongoDB Atlas
2. Postman: `POST /api/auth/login` → copy the JWT
3. Postman: `GET /api/credentials` without token → show 401
4. Postman: `GET /api/credentials` with token → show data
5. Split screen: trigger `POST /api/issuers/:id/issue` in Postman, watch the React dashboard update live via Socket.io
6. Browser DevTools → Network → WS tab → show the Socket.io messages flowing

---

*Sovereign SSI Platform — ST2 Work Plan | Generated March 2026*
