
const express = require('express');
const router  = express.Router();

// ── Day 4: Mongoose models replace fileDb ──────────────────────────────────────
const Issuer     = require('../models/Issuer');
const Credential = require('../models/Credential');
const db         = require('../utils/db');
const { issueCredential, isValidDID } = require('../utils/didUtils');
const { asyncWrapper } = require('../middleware/errorHandler');

// ─── GET /api/issuers ─────────────────────────────────────────────────────────
router.get('/', asyncWrapper(async (req, res) => {
  const issuers = await db.readAll(Issuer);
  res.json({ success: true, count: issuers.length, data: issuers });
}));

// ─── GET /api/issuers/:id/stats ───────────────────────────────────────────────
// Must be declared before /:id to avoid conflict
router.get('/:id/stats', asyncWrapper(async (req, res) => {
  const issuer = await db.findById(Issuer, req.params.id);
  if (!issuer) { const e = new Error('Issuer not found'); e.statusCode = 404; throw e; }

  // Generate 30-day chart data
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (29 - i));
    return {
      day: `D${i + 1}`,
      date: d.toISOString().split('T')[0],
      issued: Math.floor(200 + Math.sin(i / 4) * 100 + Math.random() * 80),
      revoked: Math.floor(Math.random() * 8),
    };
  });

  res.json({
    success: true,
    data: {
      issuerId: issuer.id,
      totalIssued: issuer.credentialsIssued || issuer.stats?.totalIssued || 0,
      activeTemplates: issuer.activeTemplates || issuer.stats?.activeTemplates || 0,
      health: 98.7,
      chart: chartData,
    },
  });
}));

// ─── GET /api/issuers/:id ─────────────────────────────────────────────────────
router.get('/:id', asyncWrapper(async (req, res) => {
  const issuer = await db.findById(Issuer, req.params.id);
  if (!issuer) { const e = new Error('Issuer not found'); e.statusCode = 404; throw e; }
  res.json({ success: true, data: issuer });
}));

// ─── POST /api/issuers ────────────────────────────────────────────────────────
router.post('/', asyncWrapper(async (req, res) => {
  const { name, did, type } = req.body;
  if (!name || !did || !type) {
    const e = new Error('name, did, type are required'); e.statusCode = 400; throw e;
  }
  if (!isValidDID(did)) {
    const e = new Error(`Invalid DID format: ${did}`); e.statusCode = 400; throw e;
  }
  const issuer = await db.create(Issuer, {
    name, did, category: type,
    credentialsIssued: 0,
    activeTemplates: 0,
    status: 'pending',
  });
  res.status(201).json({ success: true, data: issuer });
}));

// ─── POST /api/issuers/:id/issue ──────────────────────────────────────────────
// Issue a single Verifiable Credential to a holder DID
router.post('/:id/issue', asyncWrapper(async (req, res) => {
  const issuer = await db.findById(Issuer, req.params.id);
  if (!issuer) { const e = new Error('Issuer not found'); e.statusCode = 404; throw e; }

  const { holderDID, credentialType, claims } = req.body;
  if (!holderDID || !credentialType) {
    const e = new Error('holderDID and credentialType are required'); e.statusCode = 400; throw e;
  }

  const credential = issueCredential({
    issuerDID: issuer.did,
    holderDID,
    type: credentialType,
    claims: claims || {},
  });

  // Update issuer's count
  await Issuer.findOneAndUpdate(
    { id: issuer.id },
    { $inc: { credentialsIssued: 1 } }
  );

  res.status(201).json({ success: true, data: credential });
}));

// ─── POST /api/issuers/:id/bulk ────────────────────────────────────────────────
// Bulk issue credentials to a list of holder DIDs
router.post('/:id/bulk', asyncWrapper(async (req, res) => {
  const issuer = await db.findById(Issuer, req.params.id);
  if (!issuer) { const e = new Error('Issuer not found'); e.statusCode = 404; throw e; }

  const { holderDIDs, credentialType, claims } = req.body;
  if (!Array.isArray(holderDIDs) || holderDIDs.length === 0) {
    const e = new Error('holderDIDs must be a non-empty array'); e.statusCode = 400; throw e;
  }

  // Issue to each DID — demonstrate processing multiple items
  const results = holderDIDs.map(holderDID => {
    if (!isValidDID(holderDID)) {
      return { holderDID, status: 'failed', reason: 'Invalid DID format' };
    }
    const credential = issueCredential({
      issuerDID: issuer.did, holderDID, type: credentialType || 'VerifiableCredential', claims: claims || {},
    });
    return { holderDID, status: 'delivered', credentialId: credential.id, credential };
  });

  const delivered = results.filter(r => r.status === 'delivered').length;
  const failed    = results.filter(r => r.status === 'failed').length;

  await Issuer.findOneAndUpdate(
    { id: issuer.id },
    { $inc: { credentialsIssued: delivered } }
  );

  res.json({
    success: true,
    summary: { total: holderDIDs.length, delivered, failed },
    results,
  });
}));

// ─── GET /api/issuers/:id/export ──────────────────────────────────────────────
// Exports credentials as a JSON download
router.get('/:id/export', asyncWrapper(async (req, res) => {
  const issuer = await db.findById(Issuer, req.params.id);
  if (!issuer) { const e = new Error('Issuer not found'); e.statusCode = 404; throw e; }

  // Fetch all credentials from MongoDB and send as downloadable JSON
  const credentials = await db.readAll(Credential);
  const filename = `sovereign-credentials-${new Date().toISOString().split('T')[0]}.json`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/json');
  res.json(credentials);
}));

module.exports = router;
