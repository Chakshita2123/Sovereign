/**
 * routes/activity.js — Activity Feed & Proof Requests
 * Day 4: Migrated from fileDb to Mongoose models
 */
const express = require('express');
const router  = express.Router();

// ── Mongoose models ───────────────────────────────────────────────────────────
const Activity     = require('../models/Activity');
const ProofRequest = require('../models/ProofRequest');
const db           = require('../utils/db');
const { asyncWrapper } = require('../middleware/errorHandler');
const { notifyProofApproved, broadcastActivity } = require('../utils/socketManager');

// GET /api/activity — all activity events (supports ?limit=N&type=X)
router.get('/', asyncWrapper(async (req, res) => {
  const { limit, type } = req.query;
  const filter = {};
  if (type) filter.type = type;

  let activities = await Activity.find(filter)
    .sort({ timestamp: -1 })
    .lean();

  if (limit) activities = activities.slice(0, parseInt(limit, 10));
  res.json({ success: true, data: activities, total: activities.length });
}));

// GET /api/activity/proof-requests — all pending proof requests
// ⚠️ Must be before /:id to avoid conflict
router.get('/proof-requests', asyncWrapper(async (req, res) => {
  const requests = await db.readAll(ProofRequest);
  res.json({ success: true, data: requests, total: requests.length });
}));

// GET /api/activity/proof-requests/:id
router.get('/proof-requests/:id', asyncWrapper(async (req, res) => {
  const item = await db.findById(ProofRequest, req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Proof request not found' } });
  res.json({ success: true, data: item });
}));

// POST /api/activity/proof-requests/:id/approve — approve a proof request
router.post('/proof-requests/:id/approve', asyncWrapper(async (req, res) => {
  const item = await db.findById(ProofRequest, req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } });

  const updated = await ProofRequest.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'approved' } },
    { new: true, lean: true }
  );

  // ── Socket.io: Notify holder that proof was approved (Lectures 45-48) ───────
  if (updated.holderDid || updated.holder) {
    notifyProofApproved(req.app, updated.holderDid || updated.holder, updated.id);
  }
  broadcastActivity(req.app, {
    type: 'proof_approved',
    title: `Proof request approved`,
    description: `Proof request ${updated.id} was approved`,
    actor: 'System',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: { ...updated, approvedAt: new Date().toISOString() }, message: 'ZKP proof generated and transmitted' });
}));

// POST /api/activity/proof-requests/:id/deny — deny a proof request
router.post('/proof-requests/:id/deny', asyncWrapper(async (req, res) => {
  const item = await db.findById(ProofRequest, req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } });

  const updated = await ProofRequest.findOneAndUpdate(
    { id: req.params.id },
    { $set: { status: 'denied' } },
    { new: true, lean: true }
  );

  res.json({ success: true, data: { ...updated, deniedAt: new Date().toISOString() }, message: 'Request denied' });
}));

// GET /api/activity/:id
router.get('/:id', asyncWrapper(async (req, res) => {
  const item = await db.findById(Activity, req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } });
  res.json({ success: true, data: item });
}));

// POST /api/activity — log new activity event
router.post('/', asyncWrapper(async (req, res) => {
  const { type, title, description, actor } = req.body;
  if (!type || !title) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'type and title required' } });
  const newItem = await db.create(Activity, { type, title, description: description || '', actor: actor || 'System', timestamp: new Date().toISOString() });
  res.status(201).json({ success: true, data: newItem });
}));

module.exports = router;
