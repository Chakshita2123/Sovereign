// ─── Identity (DID) Schema (Lectures 33-36) ──────────────────────────────────
// Mongoose schema for Decentralised Identifiers (DIDs).
// Replaces the flat JSON objects in data/dids.json.
//
// Design decisions:
//   - `did` is the primary identifier (unique index) — follows W3C DID spec
//   - `verificationMethods` stores public keys for signature verification
//   - `services` stores DIDComm endpoints and other service references
//   - `keyRotations` provides an audit trail for key changes
//   - `trustScore` is a computed value based on credential history (0-100)

const mongoose = require('mongoose');

// ── Verification Method Sub-Schema ────────────────────────────────────────────
// Each DID can have multiple verification methods (keys)
const verificationMethodSchema = new mongoose.Schema(
  {
    id:                  { type: String, required: true },
    type:                { type: String, required: true },
    publicKeyMultibase:  { type: String, required: true },
  },
  { _id: false } // sub-documents don't need their own _id
);

// ── Service Endpoint Sub-Schema ───────────────────────────────────────────────
const serviceSchema = new mongoose.Schema(
  {
    id:               { type: String, required: true },
    type:             { type: String, required: true },
    serviceEndpoint:  { type: String, required: true },
  },
  { _id: false }
);

// ── Key Rotation History Sub-Schema ───────────────────────────────────────────
const keyRotationSchema = new mongoose.Schema(
  {
    keyId:     { type: String, required: true },
    rotatedAt: { type: Date, required: true },
    reason:    { type: String, default: '' },
  },
  { _id: false }
);

// ── Main Identity Schema ──────────────────────────────────────────────────────
const identitySchema = new mongoose.Schema(
  {
    did: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    controller: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'deactivated', 'revoked'],
      default: 'active',
    },

    // ── Cryptographic Keys ──────────────────────────────────────────────────
    verificationMethods: {
      type: [verificationMethodSchema],
      default: [],
      alias: 'verificationMethod', // maps existing seed data field name
    },

    // ── Service Endpoints ───────────────────────────────────────────────────
    services: {
      type: [serviceSchema],
      default: [],
      alias: 'service', // maps existing seed data field name
    },

    // ── Trust & History ─────────────────────────────────────────────────────
    trustScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50,
    },
    keyRotations: {
      type: [keyRotationSchema],
      default: [],
      alias: 'keyHistory', // maps existing seed data field name
    },

    // ── Timestamps from seed data ───────────────────────────────────────────
    created: {
      type: Date,
      default: Date.now,
    },
    updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Pre-save Hook: Validate DID format ───────────────────────────────────────
// W3C DID spec: did:<method>:<method-specific-id>
// Examples: did:indy:sovrin:AaravSharma8Ps2k3nQ7vLh1TzW5
const DID_REGEX = /^did:[a-z0-9]+:[a-z0-9]+:.+$/i;

identitySchema.pre('save', function (next) {
  if (this.did && !DID_REGEX.test(this.did)) {
    return next(new Error(`Invalid DID format: ${this.did}. Must match did:<method>:<network>:<id>`));
  }
  this.updated = new Date();
  next();
});

module.exports = mongoose.model('Identity', identitySchema);
