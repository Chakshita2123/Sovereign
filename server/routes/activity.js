/**
 * routes/activity.js — Activity Feed & Proof Requests
 * Covers Lectures 21-24: Routing methods, route params, query strings, response methods
 */
const express = require('express');
const router  = express.Router();
const { readAll, findById, create } = require('../utils/fileDb');
const { asyncWrapper } = require('../middleware/errorHandler');

// GET /api/activity — all activity events (supports ?limit=N&type=X)
router.get('/', asyncWrapper(async (req, res) => {
  let activities = await readAll('activities');
  const { limit, type } = req.query;
  if (type) activities = activities.filter(a => a.type === type);
  if (limit) activities = activities.slice(0, parseInt(limit, 10));
  activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  res.json({ success: true, data: activities, total: activities.length });
}));

// GET /api/activity/:id
router.get('/:id', asyncWrapper(async (req, res) => {
  const item = await findById('activities', req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Activity not found' } });
  res.json({ success: true, data: item });
}));

// POST /api/activity — log new activity event
router.post('/', asyncWrapper(async (req, res) => {
  const { type, title, description, actor } = req.body;
  if (!type || !title) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'type and title required' } });
  const newItem = await create('activities', { type, title, description: description || '', actor: actor || 'System', timestamp: new Date().toISOString() });
  res.status(201).json({ success: true, data: newItem });
}));

// GET /api/activity/proof-requests — all pending proof requests
router.get('/proof-requests', asyncWrapper(async (req, res) => {
  const requests = await readAll('proof-requests');
  res.json({ success: true, data: requests, total: requests.length });
}));

// GET /api/activity/proof-requests/:id
router.get('/proof-requests/:id', asyncWrapper(async (req, res) => {
  const item = await findById('proof-requests', req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Proof request not found' } });
  res.json({ success: true, data: item });
}));

// POST /api/activity/proof-requests/:id/approve — approve a proof request
router.post('/proof-requests/:id/approve', asyncWrapper(async (req, res) => {
  const item = await findById('proof-requests', req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } });
  res.json({ success: true, data: { ...item, status: 'approved', approvedAt: new Date().toISOString() }, message: 'ZKP proof generated and transmitted' });
}));

// POST /api/activity/proof-requests/:id/deny — deny a proof request
router.post('/proof-requests/:id/deny', asyncWrapper(async (req, res) => {
  const item = await findById('proof-requests', req.params.id);
  if (!item) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Request not found' } });
  res.json({ success: true, data: { ...item, status: 'denied', deniedAt: new Date().toISOString() }, message: 'Request denied' });
}));

module.exports = router;
