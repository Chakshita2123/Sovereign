

const express = require('express');

// Instead of defining all routes on app, we use mini-routers
// that get mounted at a prefix in server.js.
const router = express.Router();

const db         = require('../utils/fileDb');
const { generateZKPProof, issueCredential } = require('../utils/didUtils');
const { asyncWrapper } = require('../middleware/errorHandler');
const { FILES }  = require('../config');

// ─── GET /api/credentials ─────────────────────────────────────────────────────
// ROUTE HANDLER: returns all credentials, optionally filtered by query params

router.get('/', asyncWrapper(async (req, res) => {
  let credentials = await db.readAll(FILES.CREDENTIALS);

  // QUERY PARAMETER filtering — ?status=verified&type=Education
  const { status, type, search } = req.query;
  if (status)  credentials = credentials.filter(c => c.status === status);
  if (type)    credentials = credentials.filter(c => c.type === type);
  if (search)  credentials = credentials.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  // RESPONSE METHOD: res.json() — sets Content-Type: application/json automatically
  res.json({
    success: true,
    count: credentials.length,
    data: credentials,
  });
}));

// ─── GET /api/credentials/stats ───────────────────────────────────────────────
// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes /:id
// Otherwise Express would interpret 'stats' as an :id value
router.get('/stats', asyncWrapper(async (req, res) => {
  const credentials = await db.readAll(FILES.CREDENTIALS);
  const stats = {
    total:    credentials.length,
    verified: credentials.filter(c => c.status === 'verified').length,
    pending:  credentials.filter(c => c.status === 'pending').length,
    expiring: credentials.filter(c => c.status === 'expiring').length,
    revoked:  credentials.filter(c => c.status === 'revoked').length,
    byType: credentials.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {}),
  };
  res.json({ success: true, data: stats });
}));

// ─── GET /api/credentials/status/:stat ────────────────────────────────────────
// ROUTE PARAMETER: :stat matches any value in that URL segment
router.get('/status/:stat', asyncWrapper(async (req, res) => {
  const { stat } = req.params; // Extract :stat route parameter
  const valid = ['verified', 'pending', 'revoked', 'expiring'];

  if (!valid.includes(stat)) {
    const error = new Error(`Invalid status '${stat}'. Valid: ${valid.join(', ')}`);
    error.statusCode = 400;
    throw error; // asyncWrapper catches this and passes to errorHandler
  }

  const credentials = await db.findBy(FILES.CREDENTIALS, 'status', stat);
  res.json({ success: true, count: credentials.length, data: credentials });
}));

// ─── GET /api/credentials/:id ─────────────────────────────────────────────────
// ROUTE PARAMETER: :id — matches any single URL segment
router.get('/:id', asyncWrapper(async (req, res) => {
  const credential = await db.findById(FILES.CREDENTIALS, req.params.id);

  if (!credential) {
    const error = new Error(`Credential not found: ${req.params.id}`);
    error.statusCode = 404;
    throw error;
  }

  res.json({ success: true, data: credential });
}));

// ─── POST /api/credentials ────────────────────────────────────────────────────
// ROUTING METHOD: POST — create a new credential
router.post('/', asyncWrapper(async (req, res) => {
  const { title, type, issuer, issuerDID, holderDID, claims } = req.body;

  // ── Input validation ─────────────────────────────────────────────────────
  if (!title || !type || !issuer) {
    const error = new Error('Missing required fields: title, type, issuer');
    error.statusCode = 400;
    throw error;
  }

  // ── Build the credential ──────────────────────────────────────────────────
  const w3cCredential = issuerDID && holderDID
    ? issueCredential({ issuerDID, holderDID, type, claims: claims || {} })
    : null;

  const newCredential = await db.create(FILES.CREDENTIALS, {
    title,
    type,
    issuer,
    issuerDID: issuerDID || null,
    holderDID: holderDID || null,
    status: 'pending',
    issuedDate: new Date().toISOString().split('T')[0],
    expiryDate: null,
    claims: claims || [],
    w3cCredential,
  });

  // RESPONSE METHOD: res.status(201).json() — 201 Created
  res.status(201).json({ success: true, data: newCredential });
}));

// ─── PUT /api/credentials/:id ─────────────────────────────────────────────────
// ROUTING METHOD: PUT — replace the entire credential record
router.put('/:id', asyncWrapper(async (req, res) => {
  const existing = await db.findById(FILES.CREDENTIALS, req.params.id);
  if (!existing) {
    const err = new Error(`Credential not found: ${req.params.id}`);
    err.statusCode = 404; throw err;
  }
  const updated = await db.update(FILES.CREDENTIALS, req.params.id, req.body);
  res.json({ success: true, data: updated });
}));

// ─── PATCH /api/credentials/:id ───────────────────────────────────────────────
// ROUTING METHOD: PATCH — partial update (e.g., change status only)
router.patch('/:id', asyncWrapper(async (req, res) => {
  const existing = await db.findById(FILES.CREDENTIALS, req.params.id);
  if (!existing) {
    const err = new Error(`Credential not found: ${req.params.id}`);
    err.statusCode = 404; throw err;
  }
  const updated = await db.update(FILES.CREDENTIALS, req.params.id, req.body);
  res.json({ success: true, data: updated });
}));

// ─── DELETE /api/credentials/:id ──────────────────────────────────────────────
// ROUTING METHOD: DELETE — revoke and remove a credential
router.delete('/:id', asyncWrapper(async (req, res) => {
  const deleted = await db.remove(FILES.CREDENTIALS, req.params.id);
  if (!deleted) {
    const err = new Error(`Credential not found: ${req.params.id}`);
    err.statusCode = 404; throw err;
  }
  // RESPONSE METHOD: res.status(200).json() — return what was deleted
  res.json({ success: true, message: 'Credential revoked', data: deleted });
}));

// ─── POST /api/credentials/:id/share ─────────────────────────────────────────
// NESTED ROUTE: action on a specific resource
router.post('/:id/share', asyncWrapper(async (req, res) => {
  const credential = await db.findById(FILES.CREDENTIALS, req.params.id);
  if (!credential) {
    const err = new Error(`Credential not found: ${req.params.id}`);
    err.statusCode = 404; throw err;
  }

  const { method = 'qr', revealFields = [] } = req.body;
  const shareToken = Buffer.from(`${credential.id}:${Date.now()}`).toString('base64url');

  res.json({
    success: true,
    data: {
      shareToken,
      method,
      revealedFields: revealFields,
      deepLink: `sovereign://present?token=${shareToken}`,
      qrData: `https://sovereign.app/verify/${shareToken}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    },
  });
}));

// ─── POST /api/credentials/:id/zkp ────────────────────────────────────────────
// Generate a Zero-Knowledge Proof for a credential
router.post('/:id/zkp', asyncWrapper(async (req, res) => {
  const credential = await db.findById(FILES.CREDENTIALS, req.params.id);
  if (!credential) {
    const err = new Error(`Credential not found: ${req.params.id}`);
    err.statusCode = 404; throw err;
  }

  const { revealedFields = [], predicates = [] } = req.body;
  const proof = generateZKPProof({ credentialId: credential.id, revealedFields, predicates });

  res.json({ success: true, data: proof });
}));

// Export the router — imported in server.js
module.exports = router;
