// ─── Credential Schema (Lectures 33-36) ───────────────────────────────────────
// Mongoose schema for Verifiable Credentials stored in MongoDB.
// Replaces the flat JSON objects in data/credentials.json.
//
// Design decisions:
//   - `id` field mirrors existing seed data IDs (e.g., "cred-001") for migration
//   - `claims` stored as an array of Mixed objects — flexible for different credential types
//   - `metadata` as a nested subdocument with issuerDID, schemaID, proofType
//   - Compound index on { holder: 1, status: 1 } — optimises dashboard "show my verified creds"

const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema(
  {
    // ── Core Fields ───────────────────────────────────────────────────────────
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    holder: {
      type: String,       // DID of the credential holder
      default: null,
    },
    holderDID: {
      type: String,       // DID of the credential holder (used by routes)
      default: null,
    },
    title: {
      type: String,       // Human-readable credential title
      default: null,
    },
    holderName: {
      type: String,       // Human-readable holder name
      default: null,
    },
    issuer: {
      type: String,       // Issuer organisation name
      required: true,
    },
    issuerLogo: {
      type: String,       // Emoji or URL for the issuer logo
      default: null,
    },

    // ── Dates ─────────────────────────────────────────────────────────────────
    issuedDate: {
      type: String,       // ISO date string (e.g., "2023-07-22")
      alias: 'issueDate', // maps existing seed data field name
    },
    expiryDate: {
      type: String,
      default: null,
    },

    // ── Status ────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['verified', 'pending', 'revoked', 'expiring'],
      default: 'pending',
    },

    // ── Claims & Proofs ───────────────────────────────────────────────────────
    claims: {
      type: [mongoose.Schema.Types.Mixed], // flexible for different credential types
      default: [],
    },
    metadata: {
      issuerDID: { type: String, default: null },
      schemaID:  { type: String, default: null },
      proofType: { type: String, default: null },
    },
    zkpProofs: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // ── W3C Verifiable Credential (optional) ─────────────────────────────────
    w3cCredential: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    // ── Schema Options ────────────────────────────────────────────────────────
    timestamps: true,                // auto-adds createdAt, updatedAt
    toJSON: { virtuals: true },      // include virtuals in JSON output
    toObject: { virtuals: true },
  }
);

// ─── Compound Index ───────────────────────────────────────────────────────────
// Optimises the dashboard query: "Get all credentials for holder X with status Y"
// MongoDB uses B-tree indexes — compound indexes work left-to-right (holder first)
credentialSchema.index({ holder: 1, status: 1 });

// ─── Pre-save Hook: Auto-set updatedAt ────────────────────────────────────────
// Mongoose `timestamps` handles this for `updatedAt`, but this hook ensures
// consistency even when using findOneAndUpdate (which bypasses save hooks).
credentialSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// ─── Export Model ─────────────────────────────────────────────────────────────
module.exports = mongoose.model('Credential', credentialSchema);
