// ─── Proof Request Schema (Lectures 33-36) ────────────────────────────────────
// Mongoose schema for proof/verification requests from verifiers.
// Replaces the flat JSON objects in data/proof-requests.json.

const mongoose = require('mongoose');

// ── Requested Field Sub-Schema ────────────────────────────────────────────────
const requestedFieldSchema = new mongoose.Schema(
  {
    field:        { type: String, required: true },
    zkpPredicate: { type: String, default: null },
  },
  { _id: false }
);

const proofRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    verifierName: {
      type: String,
      required: true,
    },
    verifierLogo: {
      type: String,
      default: '🔍',
    },
    verifierDID: {
      type: String,
      default: null,
    },
    holderDid: {
      type: String,
      default: null,
    },
    holder: {
      type: String,
      default: null,
    },
    requestedFields: {
      type: [requestedFieldSchema],
      default: [],
    },
    purpose: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'expired'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('ProofRequest', proofRequestSchema);
