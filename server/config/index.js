require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') }); // Load .env from server/
const path = require('path');

// ─── Server Configuration ─────────────────────────────────────────────────────
const PORT     = process.env.PORT      || 3001;
const NODE_ENV = process.env.NODE_ENV  || 'development';
const HOST     = process.env.HOST      || 'localhost';

// ─── Data Layer Configuration ─────────────────────────────────────────────────
// Sovereign uses a file-based JSON store (no database needed for Phase 0)
const DATA_DIR = path.join(__dirname, '..', 'data');
const FILES = {
  CREDENTIALS : path.join(DATA_DIR, 'credentials.json'),
  DIDS        : path.join(DATA_DIR, 'dids.json'),
  ISSUERS     : path.join(DATA_DIR, 'issuers.json'),
  ACTIVITIES  : path.join(DATA_DIR, 'activities.json'),
  PROOF_REQS  : path.join(DATA_DIR, 'proof-requests.json'),
};

// ─── Frontend Configuration ───────────────────────────────────────────────────
// The React frontend runs on 5173 (Vite dev) or 4173 (Vite preview)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3001',
  'http://127.0.0.1:5173',
];

// ─── Credential Configuration ─────────────────────────────────────────────────
const CREDENTIAL_TYPES    = ['Education', 'Employment', 'Identity', 'Health', 'Verification'];
const CREDENTIAL_STATUSES = ['verified', 'pending', 'revoked', 'expiring'];
const DID_METHOD          = 'indy'; 
module.exports = {
  PORT,
  NODE_ENV,
  HOST,
  DATA_DIR,
  FILES,
  ALLOWED_ORIGINS,
  CREDENTIAL_TYPES,
  CREDENTIAL_STATUSES,
  DID_METHOD,
  isDev: NODE_ENV === 'development',
  isProd: NODE_ENV === 'production',
};
