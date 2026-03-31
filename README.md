# Sovereign — Personal Data Wallet (SSI Platform)
### Full-Stack Integration | Lectures 1-48 | Middleware · SSR · MongoDB · Sessions · JWT · Socket.io

---

## 🚀 Quick Start

```bash
# 1. Install all dependencies (root, client, and server)
npm run install:all

# 2. Configure environment
cp server/.env.example server/.env
# Edit server/.env → set MONGO_URI, SESSION_SECRET, JWT_SECRET

# 3. Seed the database (run once after MongoDB is connected)
npm run seed

# 4. Start both frontend + backend together
npm run dev
```

- **Frontend (React/Vite):** http://localhost:5173
- **Backend (Express API):** http://localhost:3001
- **SSR Portal:** http://localhost:3001/portal
- **API Health:** http://localhost:3001/api/health
- **API Docs:** http://localhost:3001/api-docs

---

## 📁 Project Structure

```
sovereign/
├── package.json            ← Root: runs both client + server via concurrently
│
├── client/                 ← React + Vite + TypeScript Frontend
│   ├── src/
│   │   └── app/
│   │       ├── pages/              ← Dashboard, Wallet, Identity pages
│   │       ├── components/         ← UI components (shadcn/ui + Radix)
│   │       ├── services/
│   │       │   ├── api.ts          ← ★ API service layer (JWT auth headers)
│   │       │   └── authService.ts  ← JWT token management (in-memory)
│   │       ├── hooks/
│   │       │   ├── useSocket.ts    ← Socket.io event subscription hook
│   │       │   └── SocketContext.tsx ← Shared WebSocket provider
│   │       └── data/
│   │           └── mockData.ts     ← Fallback data (if backend offline)
│   └── vite.config.ts      ← Proxy: /api → http://localhost:3001
│
└── server/                 ← Node.js + Express Backend
    ├── server.js           ← ★ Main Express app + Socket.io
    ├── config/
    │   ├── index.js        ← Environment config (dotenv)
    │   ├── database.js     ← MongoDB connection + graceful shutdown
    │   └── passport.js     ← Passport.js Local + JWT strategies
    ├── middleware/
    │   ├── auth.js         ← JWT guard + role-based access control
    │   ├── errorHandler.js ← Structured JSON errors + 404 handler
    │   ├── flash.js        ← One-time session messages
    │   ├── logger.js       ← Custom request logger + file logging
    │   ├── rateLimiter.js  ← Global (100/15min) + Auth (10/15min)
    │   ├── requestId.js    ← UUID tracing (X-Request-Id header)
    │   ├── sessionAuth.js  ← Session-based auth guard for portal
    │   └── validate.js     ← express-validator middleware
    ├── models/
    │   ├── User.js         ← bcrypt hashing, role enum, virtual password
    │   ├── Credential.js   ← W3C Verifiable Credentials
    │   ├── Identity.js     ← DIDs with key rotation history
    │   ├── Issuer.js       ← Credential issuers (gov, university, etc.)
    │   ├── Activity.js     ← TTL-indexed activity feed (90-day expiry)
    │   └── ProofRequest.js ← Verification requests from verifiers
    ├── routes/
    │   ├── auth.js         ← JWT register/login/me
    │   ├── auth-portal.js  ← Session login/logout for SSR portal
    │   ├── credentials.js  ← CRUD + ZKP + share endpoints
    │   ├── identity.js     ← DID management + key rotation
    │   ├── issuer.js       ← Issuer portal + bulk issuance
    │   ├── activity.js     ← Activity feed + proof request actions
    │   ├── dashboard.js    ← Aggregated KPIs
    │   └── portal.js       ← EJS-rendered admin pages
    ├── utils/
    │   ├── db.js           ← Mongoose CRUD utility
    │   ├── socketManager.js ← Socket.io event emitters
    │   ├── didUtils.js     ← DID/VC business logic
    │   ├── seedData.js     ← ★ Mock dataset generator
    │   ├── migrate.js      ← JSON-to-MongoDB migration script
    │   └── fileDb.js       ← Legacy file-based CRUD (deprecated)
    ├── views/              ← EJS templates (SSR portal)
    └── data/               ← JSON data files + logs
```

---

## 📚 Curriculum Coverage Map

| Lectures | Topics | Implementation |
|---|---|---|
| **1-4** | Client-Server Architecture | `server.js` architecture, README |
| **5-8** | Node.js, fs module, file handling | `file-handling-demo.js`, `utils/seedData.js`, `utils/fileDb.js` |
| **9-12** | Async I/O, event loop | `utils/fileDb.js` (async), `utils/didUtils.js` |
| **13-16** | HTTP module, NPM, modules | `http-demo.js`, `config/index.js`, `package.json` |
| **17-20** | Express, middleware chain | `server.js`, `middleware/logger.js` |
| **21-24** | Routing, response methods, exceptions | All `routes/`, `middleware/errorHandler.js` |
| **25-28** | Production middleware | Helmet, rate limiting, validation, compression |
| **29-32** | EJS, SSR vs CSR | `views/`, `routes/portal.js` |
| **33-36** | MongoDB, Mongoose ODM | `config/database.js`, all `models/`, `utils/db.js` |
| **37-40** | Sessions, cookies | `express-session`, MongoStore, `middleware/sessionAuth.js` |
| **41-44** | JWT, Passport.js, bcrypt | `config/passport.js`, `middleware/auth.js`, `models/User.js` |
| **45-48** | Socket.io, WebSockets | `utils/socketManager.js`, `hooks/useSocket.ts` |

---

## 🔐 Authentication

### JWT API Auth (Lectures 41-44)
```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login → get JWT token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use token on protected routes
curl http://localhost:3001/api/credentials \
  -H "Authorization: Bearer <your-token>"
```

### Session Portal Auth (Lectures 37-40)
Visit http://localhost:3001/portal/login and authenticate with the admin credentials from `.env`.

---

## 🔌 API Endpoints

All `/api/*` routes (except `/api/auth` and `/api/health`) require a JWT Bearer token.

```
# System
GET  /api/health                            Health check + DB status

# Auth (public, rate-limited: 10 req/15 min)
POST /api/auth/register                     Create account → JWT
POST /api/auth/login                        Authenticate → JWT
GET  /api/auth/me                           Verify token (protected)

# Credentials (JWT required)
GET    /api/credentials                     List all (supports ?status, ?type, ?search)
GET    /api/credentials/stats               Aggregate stats
GET    /api/credentials/status/:stat        Filter by status
GET    /api/credentials/:id                 Get by ID
POST   /api/credentials                     Create (validated: title, type, issuer)
PUT    /api/credentials/:id                 Full replace
PATCH  /api/credentials/:id                 Partial update
DELETE /api/credentials/:id                 Revoke and remove
POST   /api/credentials/:id/share           Generate share token + QR
POST   /api/credentials/:id/zkp            Generate ZKP proof

# Identity / DID (JWT required)
GET    /api/identity/:did                   Resolve DID to DID Document
GET    /api/identity/:did/score             Security score breakdown
POST   /api/identity/create                 Create new DID (validated: ownerName)
PATCH  /api/identity/:did/rotate            Rotate signing keys

# Issuers (JWT required)
GET    /api/issuers                         List all issuers
GET    /api/issuers/:id                     Get issuer by ID
GET    /api/issuers/:id/stats               30-day chart data
POST   /api/issuers                         Register issuer
POST   /api/issuers/:id/issue               Issue credential (issuer/verifier role)
POST   /api/issuers/:id/bulk                Bulk issue (issuer role only)
GET    /api/issuers/:id/export              Download as JSON

# Activity Feed (JWT required)
GET    /api/activity                        Feed (supports ?limit, ?type)
GET    /api/activity/:id                    Single event
POST   /api/activity                        Log event
GET    /api/activity/proof-requests         List pending requests
GET    /api/activity/proof-requests/:id     Get request
POST   /api/activity/proof-requests/:id/approve   Approve (sends ZKP)
POST   /api/activity/proof-requests/:id/deny      Deny

# Dashboard (JWT required)
GET    /api/dashboard                       Full KPI + stats
GET    /api/dashboard/kpi                   KPI numbers only

# Portal (session auth, SSR)
GET    /portal                              Issuer portal (EJS)
GET    /portal/report/:id                   Credential report (printable)
GET    /portal/login                        Login page
POST   /portal/login                        Authenticate
GET    /portal/logout                       Destroy session
GET    /api-docs                            API documentation page
```

---

## ⚡ Real-Time Events (Socket.io)

| Event | Direction | Description |
|---|---|---|
| `credential:issued` | Server → Holder | New credential issued to wallet |
| `proof:request` | Server → Holder | Verifier requests proof |
| `proof:approved` | Server → Holder | Proof request was approved |
| `credential:expiring` | Server → Holder | Credential expiring soon |
| `activity:new` | Server → All | Broadcast activity to dashboards |

---

## 🗄️ Mock Dataset

Modelled on **Indian government issuers and institutions**.

### Issuers
- **UIDAI** — Aadhaar (Government)
- **IIT Delhi** — B.Tech Degree (University)
- **Infosys** — Employment (Employer)
- **NMC** — Medical Registration (Healthcare)
- **Parivahan Sewa** — Driving Licence (Government)
- **Income Tax Dept** — PAN Card (Government)
- **CBSE** — Class XII Marksheet (Education)
- **HDFC ERGO** — Health Insurance (Financial)

---

## ⚙️ Environment Variables

Copy `server/.env.example` to `server/.env` and configure:

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | ✅ | MongoDB Atlas connection string |
| `SESSION_SECRET` | ✅ | Signs session cookies |
| `JWT_SECRET` | ✅ | Signs JWT access tokens |
| `ADMIN_EMAIL` | ✅ | Portal admin email |
| `ADMIN_PASS_HASH` | ✅ | bcrypt hash of admin password |
| `PORT` | | Server port (default: 3001) |
| `NODE_ENV` | | development / production |

---

*Sovereign — Personal Data Wallet | SSI Platform | March 2026*
