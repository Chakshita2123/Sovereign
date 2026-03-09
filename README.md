# Sovereign — Personal Data Wallet (SSI Platform)
### Full-Stack Integration | Project Based Evaluation-I | Lectures 1-24

---

## 🚀 Quick Start (3 commands)

```bash
# 1. Install all dependencies
npm run install:all

# 2. Seed the mock dataset (run once)
npm run seed

# 3. Start both frontend + backend together
npm run dev
```

- **Frontend (React/Vite):** http://localhost:5173
- **Backend (Express API):** http://localhost:3001
- **API Health:** http://localhost:3001/api/health

---

## 📁 Project Structure

```
sovereign/
├── package.json          ← Root: runs both client + server via concurrently
│
├── client/               ← React + Vite + TypeScript Frontend
│   ├── src/
│   │   └── app/
│   │       ├── pages/            ← Dashboard pages
│   │       ├── components/       ← UI components (shadcn/ui + Radix)
│   │       ├── services/
│   │       │   └── api.ts        ← ★ API service layer (connects to backend)
│   │       └── data/
│   │           └── mockData.ts   ← Fallback data (used if backend is offline)
│   └── vite.config.ts    ← Proxy: /api → http://localhost:3000
│
└── server/               ← Node.js + Express Backend
    ├── server.js         ← ★ Main Express app (Lectures 17-24)
    ├── http-demo.js      ← Raw Node.js HTTP module demo (Lectures 13-16)
    ├── file-handling-demo.js ← fs module demo (Lectures 5-8)
    ├── config/index.js   ← module.exports demo (Lectures 13-16)
    ├── middleware/
    │   ├── logger.js     ← Custom middleware (Lectures 17-20)
    │   └── errorHandler.js ← Exception handling (Lectures 21-24)
    ├── routes/
    │   ├── credentials.js ← CRUD + ZKP endpoints (Lectures 21-24)
    │   ├── identity.js   ← DID management (Lectures 21-24)
    │   ├── issuer.js     ← Issuer portal API (Lectures 21-24)
    │   ├── activity.js   ← Activity feed (Lectures 21-24)
    │   └── dashboard.js  ← Aggregated KPIs (Lectures 21-24)
    ├── utils/
    │   ├── seedData.js   ← ★ Mock dataset (Lectures 5-8)
    │   ├── fileDb.js     ← File-based CRUD (Lectures 5-8, 13-16)
    │   └── didUtils.js   ← DID/VC business logic (Lectures 13-16)
    └── data/             ← JSON data files (created by seedData.js)
        ├── credentials.json
        ├── dids.json
        ├── issuers.json
        ├── activities.json
        ├── proof-requests.json
        └── kpi.json
```

---

## 📚 Curriculum Coverage Map

| Lectures | Topics | Files in This Project |
|---|---|---|
| **1-4** | Client-Server Architecture, request handling | README, `server.js` (architecture comments) |
| **5-8** | Node.js setup, fs module, file handling | `file-handling-demo.js`, `utils/seedData.js`, `utils/fileDb.js` |
| **9-12** | Node.js advantages, async I/O, event loop | `utils/fileDb.js` (async readFile), `utils/didUtils.js` |
| **13-16** | HTTP module, endpoints, NPM, modules | `http-demo.js`, `config/index.js`, `utils/didUtils.js`, `package.json` |
| **17-20** | Express framework, middleware chain | `server.js` (top half), `middleware/logger.js` |
| **21-24** | Static files, routing, response methods, exceptions | `server.js` (full), all `routes/`, `middleware/errorHandler.js` |

---

## 🗄️ Mock Dataset

The dataset is modelled on **Indian government issuers and institutions** since real authorisation 
from government bodies is not available for this evaluation project.

### Personas (from PRD)
| Persona | Holder | Credentials |
|---|---|---|
| Aarav Sharma | Job Applicant | Aadhaar, IIT Delhi B.Tech, Infosys Employment, PAN, CBSE XII, Health Insurance |
| Dr. Priya Venkataraman | Doctor | NMC Medical Registration (expiring) |
| Raju Bhatia | Govt Service User | Parivahan Driving Licence |

### Issuers in Dataset
- **UIDAI** — Aadhaar Identity (Government)
- **IIT Delhi** — B.Tech Degree (University)
- **Infosys** — Employment Verification (Employer)
- **NMC** — Medical Registration (Regulator)
- **Parivahan Sewa** — Driving Licence (Government)
- **Income Tax Dept** — PAN Card (Government)
- **CBSE** — Class XII Marksheet (Education Board)
- **HDFC ERGO** — Health Insurance (Insurance)

### Verifiers in Mock Proof Requests
- Infosys HR Portal (hiring)
- HDFC Bank Digital KYC (account opening)
- Ola Cabs Driver Verification (gig onboarding)

---

## 🔌 API Endpoints

```
GET  /api/health                       Server health check
GET  /api/dashboard                    Full overview data (KPIs + activities)
GET  /api/dashboard/kpi                Just KPI numbers

GET  /api/credentials                  All credentials
GET  /api/credentials/:id              Single credential
POST /api/credentials                  Create credential
PUT  /api/credentials/:id              Update credential
DELETE /api/credentials/:id            Delete credential
POST /api/credentials/:id/share        Share (generates ZKP proof)
POST /api/credentials/:id/zkp          Generate selective disclosure proof

GET  /api/identity                     All DIDs
GET  /api/identity/:did                Resolve a DID
POST /api/identity                     Create new DID
POST /api/identity/:did/rotate         Key rotation
GET  /api/identity/:did/score          Identity trust score

GET  /api/issuers                      All issuer organisations
GET  /api/issuers/:id                  Specific issuer
GET  /api/issuers/:id/stats            Issuer statistics
POST /api/issuers/:id/issue            Issue a credential
POST /api/issuers/:id/bulk             Bulk issuance
GET  /api/issuers/:id/export           Export (file download demo)

GET  /api/activity                     Activity feed
POST /api/activity                     Log activity event
GET  /api/activity/proof-requests      Pending proof requests
POST /api/activity/proof-requests/:id/approve  Approve request
POST /api/activity/proof-requests/:id/deny     Deny request
```

---

## 🏃 Running Individual Demos

```bash
# Raw HTTP module (Lectures 13-16) — no Express
cd server && node http-demo.js
# Visit: http://localhost:3001

# File system operations demo (Lectures 5-8)
cd server && node file-handling-demo.js

# Main Express server only
cd server && node server.js

# Frontend only (uses mock data fallback if backend offline)
cd client && npm run dev
```

---

## ⚙️ How Frontend ↔ Backend Integration Works

```
Browser (React App @ :5173)
        ↓  fetch('/api/credentials')
Vite Dev Server (proxy in vite.config.ts)
        ↓  forwards to http://localhost:3001/api/credentials
Express Server (server.js @ :3001)
        ↓  routes/credentials.js
        ↓  utils/fileDb.js → data/credentials.json
        ↑  JSON response { success: true, data: [...] }
React Component updates state → UI re-renders
```

If the backend is **not running**, the frontend gracefully falls back to the 
built-in `mockData.ts` — so the UI always works.

---

*Sovereign — Personal Data Wallet | SSI Platform | March 2026*
