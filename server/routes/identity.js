
const express = require('express');
const { body } = require('express-validator');
const router  = express.Router();

// ── Day 4: Mongoose models replace fileDb ──────────────────────────────────────
const Identity = require('../models/Identity');
const db       = require('../utils/db');
const { generateDID, buildDIDDocument, isValidDID } = require('../utils/didUtils');
const { asyncWrapper } = require('../middleware/errorHandler');
const { validateBody } = require('../middleware/validate');

// ─── GET /api/identity/:did ───────────────────────────────────────────────────
// Resolves a DID to its DID Document (the W3C DID Resolution spec)
// ROUTE PARAMETER: :did — the DID string (URL-encoded)
router.get('/:did', asyncWrapper(async (req, res) => {
  // req.params.did is the raw DID string (may need decoding if URL-encoded)
  const did = decodeURIComponent(req.params.did);

  // Validate DID format
  if (!isValidDID(did)) {
    const err = new Error('Invalid DID format');
    err.statusCode = 400; throw err;
  }

  // Look up in MongoDB
  const record = await Identity.findOne({ did }).lean();

  if (!record) {
    const err = new Error('DID not found');
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
  const record = await Identity.findOne({ did }).lean();
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
// LECTURE 25-28: Input validation using express-validator middleware
router.post('/create', validateBody([
  body('ownerName').notEmpty().withMessage('ownerName is required'),
]), asyncWrapper(async (req, res) => {
  const { ownerName, keyType = 'Ed25519', method = 'indy' } = req.body;

  const newDID = generateDID(method);
  const didDocument = buildDIDDocument(newDID);

  const record = await db.create(Identity, {
    did: newDID,
    controller: ownerName,
    status: 'active',
    created: new Date().toISOString(),
    lastRotated: null,
    trustScore: 72, // initial score before full setup
  });

  res.status(201).json({ success: true, data: { ...record, didDocument } });
}));

// ─── PATCH /api/identity/:did/rotate ──────────────────────────────────────────
// Simulates rotating the signing keys for a DID
router.patch('/:did/rotate', asyncWrapper(async (req, res) => {
  const did = decodeURIComponent(req.params.did);
  const record = await Identity.findOne({ did }).lean();
  if (!record) { const e = new Error('DID not found'); e.statusCode = 404; throw e; }

  const updated = await Identity.findOneAndUpdate(
    { did },
    {
      $set: {
        lastRotated: new Date().toISOString().split('T')[0],
        trustScore: Math.min(100, (record.trustScore || 72) + 10),
      },
    },
    { returnDocument: 'after', lean: true }
  );

  res.json({
    success: true,
    message: 'Keys rotated successfully',
    data: updated,
  });
}));

module.exports = router;
