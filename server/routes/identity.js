
const express = require('express');
const router  = express.Router();

const db       = require('../utils/fileDb');
const { generateDID, buildDIDDocument, isValidDID } = require('../utils/didUtils');
const { asyncWrapper } = require('../middleware/errorHandler');
const { FILES } = require('../config');

// ─── GET /api/identity/:did ───────────────────────────────────────────────────
// Resolves a DID to its DID Document (the W3C DID Resolution spec)
// ROUTE PARAMETER: :did — the DID string (URL-encoded)
router.get('/:did', asyncWrapper(async (req, res) => {
  // req.params.did is the raw DID string (may need decoding if URL-encoded)
  const did = decodeURIComponent(req.params.did);

  // Validate DID format
  if (!isValidDID(did)) {
    const err = new Error(`Invalid DID format: ${did}`);
    err.statusCode = 400; throw err;
  }

  // Look up in our data store
  const dids = await db.readAll(FILES.DIDS);
  const record = dids.find(d => d.did === did);

  if (!record) {
    const err = new Error(`DID not found: ${did}`);
    err.statusCode = 404; throw err;
  }

  // Build the DID Document
  const didDocument = buildDIDDocument(did);

  // RESPONSE METHOD: res.json()
  res.json({
    success: true,
    data: {
      ...record,
      didDocument,
    },
  });
}));

// ─── GET /api/identity/:did/score ─────────────────────────────────────────────
// Returns the security score for a DID identity
router.get('/:did/score', asyncWrapper(async (req, res) => {
  const did = decodeURIComponent(req.params.did);
  const dids = await db.readAll(FILES.DIDS);
  const record = dids.find(d => d.did === did);
  if (!record) { const e = new Error('DID not found'); e.statusCode = 404; throw e; }

  // Score factors
  const factors = {
    keyRotationRecent:   record.lastRotated ? 25 : 0,
    biometricEnabled:    20,
    backupCompleted:     20,
    multiKeySetup:       15,
    zkpCapable:          20,
  };

  const totalScore = Object.values(factors).reduce((a, b) => a + b, 0);

  res.json({
    success: true,
    data: {
      did,
      score: totalScore,
      maxScore: 100,
      factors,
      grade: totalScore >= 90 ? 'A' : totalScore >= 70 ? 'B' : 'C',
    },
  });
}));

// ─── POST /api/identity/create ────────────────────────────────────────────────
// Creates a new DID identity for a user
router.post('/create', asyncWrapper(async (req, res) => {
  const { ownerName, keyType = 'Ed25519', method = 'indy' } = req.body;

  if (!ownerName) {
    const err = new Error('ownerName is required'); err.statusCode = 400; throw err;
  }

  const newDID = generateDID(method);
  const didDocument = buildDIDDocument(newDID);

  const record = await db.create(FILES.DIDS, {
    did: newDID,
    owner: ownerName,
    method,
    keyType,
    status: 'active',
    created: new Date().toISOString().split('T')[0],
    lastRotated: null,
    securityScore: 72, // initial score before full setup
    didDocument,
  });

  res.status(201).json({ success: true, data: record });
}));

// ─── PATCH /api/identity/:did/rotate ──────────────────────────────────────────
// Simulates rotating the signing keys for a DID
router.patch('/:did/rotate', asyncWrapper(async (req, res) => {
  const did = decodeURIComponent(req.params.did);
  const dids = await db.readAll(FILES.DIDS);
  const index = dids.findIndex(d => d.did === did);
  if (index === -1) { const e = new Error('DID not found'); e.statusCode = 404; throw e; }

  const updated = await db.update(FILES.DIDS, dids[index].id, {
    lastRotated: new Date().toISOString().split('T')[0],
    securityScore: Math.min(100, (dids[index].securityScore || 72) + 10),
  });

  res.json({
    success: true,
    message: 'Keys rotated successfully',
    data: updated,
  });
}));

module.exports = router;
