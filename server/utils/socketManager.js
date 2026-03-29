/**
 * utils/socketManager.js — Socket.io Event Manager
 * Lectures 45-48: Full-duplex communication with WebSockets
 * 
 * This utility provides typed emit helpers for Socket.io events.
 * Routes call these functions instead of touching `io` directly,
 * which keeps socket logic centralised and testable.
 * 
 * Room architecture:
 *   wallet:{did}  — each holder joins their own room by DID
 *   dashboard      — all authenticated dashboard viewers
 * 
 * Events emitted:
 *   credential:issued   — a new credential was issued to a holder
 *   proof:request       — a verifier requested a proof from a holder
 *   proof:approved      — a proof request was approved
 *   credential:expiring — a credential is about to expire
 *   activity:new        — broadcast any new activity to all dashboards
 */

// ── Get the Socket.io instance from the Express app ───────────────────────────
const getIo = (app) => app.get('io');

// ── Notify a specific holder that a credential was issued to them ─────────────
// Targeted: only the holder with matching DID receives this event
const notifyCredentialIssued = (app, holderDid, credential) => {
  const io = getIo(app);
  if (!io) return; // Socket.io not initialised — fail silently
  io.to(`wallet:${holderDid}`).emit('credential:issued', {
    credential,
    timestamp: new Date().toISOString(),
  });
  console.log(`  📡 Emitted credential:issued → wallet:${holderDid}`);
};

// ── Notify a holder of an incoming proof request ──────────────────────────────
const notifyProofRequest = (app, holderDid, proofRequest) => {
  const io = getIo(app);
  if (!io) return;
  io.to(`wallet:${holderDid}`).emit('proof:request', {
    proofRequest,
    timestamp: new Date().toISOString(),
  });
  console.log(`  📡 Emitted proof:request → wallet:${holderDid}`);
};

// ── Notify a holder that their proof was approved ─────────────────────────────
const notifyProofApproved = (app, holderDid, proofId) => {
  const io = getIo(app);
  if (!io) return;
  io.to(`wallet:${holderDid}`).emit('proof:approved', {
    proofId,
    timestamp: new Date().toISOString(),
  });
  console.log(`  📡 Emitted proof:approved → wallet:${holderDid}`);
};

// ── Notify a holder that a credential is expiring soon ────────────────────────
const notifyCredentialExpiring = (app, holderDid, credential) => {
  const io = getIo(app);
  if (!io) return;
  io.to(`wallet:${holderDid}`).emit('credential:expiring', {
    credential,
    timestamp: new Date().toISOString(),
  });
  console.log(`  📡 Emitted credential:expiring → wallet:${holderDid}`);
};

// ── Broadcast a new activity event to all connected dashboard viewers ─────────
// Global: every connected client receives this (for the activity feed)
const broadcastActivity = (app, activity) => {
  const io = getIo(app);
  if (!io) return;
  io.emit('activity:new', {
    activity,
    timestamp: new Date().toISOString(),
  });
  console.log(`  📡 Broadcast activity:new → all clients`);
};

module.exports = {
  notifyCredentialIssued,
  notifyProofRequest,
  notifyProofApproved,
  notifyCredentialExpiring,
  broadcastActivity,
};
