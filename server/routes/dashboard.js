/**
 * routes/dashboard.js — Dashboard KPI & Overview Data

 */
const express = require('express');
const router  = express.Router();
const { readAll } = require('../utils/fileDb');
const { asyncWrapper } = require('../middleware/errorHandler');
const fs   = require('fs');
const path = require('path');

// GET /api/dashboard — full dashboard data in one call
router.get('/', asyncWrapper(async (req, res) => {
  const [credentials, activities, proofRequests, issuers] = await Promise.all([
    readAll('credentials'),
    readAll('activities'),
    readAll('proof-requests'),
    readAll('issuers'),
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
      recentActivities: activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 8),
      pendingProofRequests: proofRequests.filter(r => r.status === 'pending'),
    },
  });
}));

// GET /api/dashboard/kpi — just KPI numbers
router.get('/kpi', asyncWrapper(async (req, res) => {
  const kpPath = path.join(__dirname, '..', 'data', 'kpi.json');
  if (fs.existsSync(kpPath)) {
    const kpi = JSON.parse(fs.readFileSync(kpPath, 'utf8'));
    return res.json({ success: true, data: kpi });
  }
  // Compute on the fly if kpi.json not seeded
  const credentials = await readAll('credentials');
  res.json({ success: true, data: {
    totalCredentials: credentials.length,
    securityScore: 91,
    credentialsExpiring: credentials.filter(c => c.status === 'expiring').length,
  }});
}));

module.exports = router;
