/**
 * routes/dashboard.js — Dashboard KPI & Overview Data
 * Day 4: Migrated from fileDb to Mongoose models
 */
const express = require('express');
const router  = express.Router();

// ── Mongoose models ───────────────────────────────────────────────────────────
const Credential   = require('../models/Credential');
const Activity     = require('../models/Activity');
const ProofRequest = require('../models/ProofRequest');
const Issuer       = require('../models/Issuer');
const { asyncWrapper } = require('../middleware/errorHandler');

// GET /api/dashboard — full dashboard data in one call
router.get('/', asyncWrapper(async (req, res) => {
  const [credentials, activities, proofRequests, issuers] = await Promise.all([
    Credential.find().lean(),
    Activity.find().sort({ timestamp: -1 }).lean(),
    ProofRequest.find().lean(),
    Issuer.find().lean(),
  ]);

  // Compute live KPIs from the data
  const expiring = credentials.filter(c => c.status === 'expiring').length;
  const verified = credentials.filter(c => c.status === 'verified').length;

  const kpi = {
    totalCredentials: credentials.length,
    totalCredentialsTrend: 8.3,
    activeVerifications: proofRequests.filter(r => r.status === 'pending').length,
    activeVerificationsTrend: 12.5,
    credentialsExpiring: expiring,
    credentialsExpiringTrend: -25.0,
    securityScore: 91,
  };

  // Issuer summary across all issuers
  const issuerStats = issuers.reduce((acc, iss) => ({
    totalIssued:       acc.totalIssued + (iss.stats?.totalIssued || 0),
    revokedToday:      acc.revokedToday + (iss.stats?.revokedToday || 0),
    pendingDelivery:   acc.pendingDelivery + (iss.stats?.pendingDelivery || 0),
    activeTemplates:   acc.activeTemplates + (iss.stats?.activeTemplates || 0),
  }), { totalIssued: 0, revokedToday: 0, pendingDelivery: 0, activeTemplates: 0 });

  res.json({
    success: true,
    data: {
      kpi,
      issuerStats: { ...issuerStats, credentialHealth: 97.8 },
      recentActivities: activities.slice(0, 8),
      pendingProofRequests: proofRequests.filter(r => r.status === 'pending'),
    },
  });
}));

// GET /api/dashboard/kpi — just KPI numbers
router.get('/kpi', asyncWrapper(async (req, res) => {
  const credentials = await Credential.find().lean();
  res.json({ success: true, data: {
    totalCredentials: credentials.length,
    securityScore: 91,
    credentialsExpiring: credentials.filter(c => c.status === 'expiring').length,
  }});
}));

module.exports = router;
