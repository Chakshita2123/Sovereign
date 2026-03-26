// ─── Activity Schema (Lectures 33-36) ─────────────────────────────────────────
// Mongoose schema for activity feed events (credential received, shared, etc.).
// Replaces the flat JSON objects in data/activities.json.
//
// Design decisions:
//   - TTL index on `timestamp` — MongoDB auto-deletes documents after 90 days
//     (7,776,000 seconds). This prevents unbounded collection growth.
//   - `read` field for notification badge tracking
//   - `metadata` as Mixed for flexible event-specific data

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['received', 'shared', 'expiring', 'rotated', 'revoked', 'system'],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    actor: {
      type: String,
      default: 'System',
    },
    target: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── TTL Index ────────────────────────────────────────────────────────────────
// MongoDB automatically deletes documents 90 days after their `timestamp`.
// This prevents the activity collection from growing unbounded.
// 90 days = 7,776,000 seconds
activitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

module.exports = mongoose.model('Activity', activitySchema);
