/**
 * routes/portal.js — Server-Side Rendered Portal Routes
 * Lectures 29-32: EJS templates, SSR vs CSR, template partials
 * 
 * These routes render HTML pages using EJS — demonstrating when to use
 * server-side rendering (admin dashboards, printable pages, SEO)
 * vs client-side rendering (React wallet UI).
 */

const express = require('express');
const router  = express.Router();

const db      = require('../utils/fileDb');
const { FILES } = require('../config');

// ─── GET /portal ──────────────────────────────────────────────────────────────
// Renders the Issuer Portal — a server-side rendered admin dashboard
// Data comes from issuers.json via fileDb, passed to the EJS template
router.get('/', async (req, res, next) => {
  try {
    const issuers = await db.readAll(FILES.ISSUERS);
    res.render('issuer-portal', {
      issuers,
      pageTitle: 'Issuer Portal',
      pageDescription: 'Manage credential issuers on the Sovereign SSI Platform',
      activePage: 'portal',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /portal/report/:id ──────────────────────────────────────────────────
// Renders a printable credential verification report
// Fetches a single credential by ID and passes it to the EJS template
router.get('/report/:id', async (req, res, next) => {
  try {
    const credential = await db.findById(FILES.CREDENTIALS, req.params.id);

    if (!credential) {
      return res.status(404).render('layouts/base', {
        pageTitle: 'Credential Not Found',
        activePage: 'portal',
        body: `
          <div class="sv-card text-center" style="margin-top: 4rem;">
            <i class="bi bi-exclamation-triangle-fill" style="font-size: 3rem; color: #f59e0b;"></i>
            <h3 class="fw-bold mt-3">Credential Not Found</h3>
            <p class="text-muted">No credential with ID <code>${req.params.id}</code> exists.</p>
            <a href="/portal" class="btn mt-2" style="background: var(--sv-primary); color: white;">
              <i class="bi bi-arrow-left me-1"></i>Back to Portal
            </a>
          </div>
        `,
      });
    }

    res.render('credential-report', {
      credential,
      pageTitle: `Report: ${credential.type}`,
      pageDescription: `Verification report for ${credential.type} issued by ${credential.issuer}`,
      activePage: 'portal',
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api-docs ────────────────────────────────────────────────────────────
// Renders a server-side API reference page
// The route list is defined here as a JS array — NOT hardcoded in the HTML
router.get('/docs', async (req, res, next) => {
  try {
    const routes = [
      // Health
      { method: 'GET', path: '/api/health', description: 'System health check — memory, uptime, Node version', group: '🔧 System' },

      // Credentials
      { method: 'GET',    path: '/api/credentials',           description: 'List all credentials (supports ?status, ?type, ?search filters)', group: '📜 Credentials' },
      { method: 'GET',    path: '/api/credentials/stats',     description: 'Aggregate credential statistics by status and type', group: '📜 Credentials' },
      { method: 'GET',    path: '/api/credentials/status/:stat', description: 'Filter credentials by status (verified, pending, revoked, expiring)', group: '📜 Credentials' },
      { method: 'GET',    path: '/api/credentials/:id',       description: 'Get a single credential by ID', group: '📜 Credentials' },
      { method: 'POST',   path: '/api/credentials',           description: 'Create a new verifiable credential (validated: title, type, issuer)', group: '📜 Credentials' },
      { method: 'PUT',    path: '/api/credentials/:id',       description: 'Full replace of a credential record', group: '📜 Credentials' },
      { method: 'PATCH',  path: '/api/credentials/:id',       description: 'Partial update (e.g., change status only)', group: '📜 Credentials' },
      { method: 'DELETE', path: '/api/credentials/:id',       description: 'Revoke and remove a credential', group: '📜 Credentials' },
      { method: 'POST',   path: '/api/credentials/:id/share', description: 'Generate a share token + QR code for selective disclosure', group: '📜 Credentials' },
      { method: 'POST',   path: '/api/credentials/:id/zkp',   description: 'Generate a Zero-Knowledge Proof for a credential', group: '📜 Credentials' },

      // Identity / DID
      { method: 'GET',   path: '/api/identity/:did',        description: 'Resolve a DID to its DID Document (W3C spec)', group: '🆔 Identity (DID)' },
      { method: 'GET',   path: '/api/identity/:did/score',  description: 'Security score breakdown for a DID identity', group: '🆔 Identity (DID)' },
      { method: 'POST',  path: '/api/identity/create',      description: 'Create a new DID identity (validated: ownerName)', group: '🆔 Identity (DID)' },
      { method: 'PATCH', path: '/api/identity/:did/rotate', description: 'Rotate signing keys for a DID', group: '🆔 Identity (DID)' },

      // Issuers
      { method: 'GET',  path: '/api/issuers',              description: 'List all registered credential issuers', group: '🏢 Issuers' },
      { method: 'GET',  path: '/api/issuers/:id',          description: 'Get a single issuer by ID', group: '🏢 Issuers' },
      { method: 'GET',  path: '/api/issuers/:id/stats',    description: '30-day issuance chart data for an issuer', group: '🏢 Issuers' },
      { method: 'POST', path: '/api/issuers',              description: 'Register a new issuer (requires: name, did, type)', group: '🏢 Issuers' },
      { method: 'POST', path: '/api/issuers/:id/issue',    description: 'Issue a single Verifiable Credential to a holder DID', group: '🏢 Issuers' },
      { method: 'POST', path: '/api/issuers/:id/bulk',     description: 'Bulk-issue credentials to multiple holder DIDs', group: '🏢 Issuers' },
      { method: 'GET',  path: '/api/issuers/:id/export',   description: 'Download credentials.json as a file', group: '🏢 Issuers' },

      // Activity
      { method: 'GET',  path: '/api/activity',                           description: 'Activity feed (supports ?limit, ?type filters)', group: '📊 Activity' },
      { method: 'GET',  path: '/api/activity/:id',                       description: 'Get a single activity event', group: '📊 Activity' },
      { method: 'POST', path: '/api/activity',                           description: 'Log a new activity event (requires: type, title)', group: '📊 Activity' },
      { method: 'GET',  path: '/api/activity/proof-requests',            description: 'List pending proof requests', group: '📊 Activity' },
      { method: 'GET',  path: '/api/activity/proof-requests/:id',        description: 'Get a single proof request', group: '📊 Activity' },
      { method: 'POST', path: '/api/activity/proof-requests/:id/approve', description: 'Approve a proof request — generates ZKP', group: '📊 Activity' },
      { method: 'POST', path: '/api/activity/proof-requests/:id/deny',   description: 'Deny a proof request', group: '📊 Activity' },

      // Dashboard
      { method: 'GET', path: '/api/dashboard',     description: 'Full dashboard payload — KPIs, issuer stats, activities, proof requests', group: '📈 Dashboard' },
      { method: 'GET', path: '/api/dashboard/kpi', description: 'KPI numbers only', group: '📈 Dashboard' },

      // Portal (SSR)
      { method: 'GET', path: '/portal',            description: 'Server-rendered issuer portal (EJS)', group: '🌐 Portal (SSR)' },
      { method: 'GET', path: '/portal/report/:id', description: 'Printable credential verification report', group: '🌐 Portal (SSR)' },
      { method: 'GET', path: '/api-docs',          description: 'This page — live API documentation', group: '🌐 Portal (SSR)' },
    ];

    res.render('api-docs', {
      routes,
      pageTitle: 'API Documentation',
      pageDescription: 'Complete API reference for the Sovereign SSI Platform',
      activePage: 'api-docs',
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
