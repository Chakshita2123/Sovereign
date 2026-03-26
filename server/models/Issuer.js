// ─── Issuer Schema (Lectures 33-36) ───────────────────────────────────────────
// Mongoose schema for credential issuers (universities, government, employers).
// Replaces the flat JSON objects in data/issuers.json.
//
// Design decisions:
//   - `stats` as a nested subdocument — atomically updated with $inc
//   - `templates`, `recentIssuances`, `bulkJobs`, `chartData` as Mixed arrays
//     for flexibility — each issuer type has different data shapes
//   - Virtual `credentialCount` computed from stats.totalIssued
//   - Pre-save hook generates `id` slug from `name` if not set

const mongoose = require('mongoose');

// ── Stats Sub-Schema ──────────────────────────────────────────────────────────
const statsSchema = new mongoose.Schema(
  {
    totalIssued:      { type: Number, default: 0 },
    revokedToday:     { type: Number, default: 0 },
    pendingDelivery:  { type: Number, default: 0 },
    activeTemplates:  { type: Number, default: 0 },
    credentialHealth: { type: Number, default: 100 },
  },
  { _id: false }
);

// ── Main Issuer Schema ────────────────────────────────────────────────────────
const issuerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      default: '',
    },
    did: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Government', 'University', 'Employer', 'Healthcare', 'Financial', 'Other'],
      default: 'Other',
      alias: 'type', // maps route field name `type` to `category`
    },
    country: {
      type: String,
      default: 'India',
    },
    city: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '🏢',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    onboardedAt: {
      type: Date,
      default: Date.now,
    },

    // ── Nested Data ─────────────────────────────────────────────────────────
    stats: {
      type: statsSchema,
      default: () => ({}),
    },
    templates: {
      type: [String],
      default: [],
    },
    recentIssuances: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    bulkJobs: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    chartData: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    // ── Legacy compat fields from route usage ───────────────────────────────
    credentialsIssued: {
      type: Number,
      default: 0,
    },
    activeTemplates: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Virtual: credentialCount ─────────────────────────────────────────────────
// Computed from stats.totalIssued — no storage overhead
issuerSchema.virtual('credentialCount').get(function () {
  return this.stats?.totalIssued || this.credentialsIssued || 0;
});

// ─── Pre-save Hook: Auto-generate ID slug ─────────────────────────────────────
// If `id` is not set, generate from `name`:
//   "Indian Institute of Technology, Delhi" → "iss-indian-institute-of"
issuerSchema.pre('save', function (next) {
  if (!this.id && this.name) {
    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .slice(0, 3)
      .join('-');
    this.id = `iss-${slug}`;
  }
  next();
});

module.exports = mongoose.model('Issuer', issuerSchema);
