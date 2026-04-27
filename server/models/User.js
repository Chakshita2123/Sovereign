/**
 * models/User.js — User Schema for Authentication
 * Lectures 41-44: Bcrypt, JWT, Passport.js
 * 
 * This model represents an authenticated user of the Sovereign platform.
 * 
 * Security features:
 *   - Virtual `password` field — the plain-text password is NEVER stored
 *   - Pre-save hook hashes with bcrypt (cost factor 12) — ~250ms per hash
 *   - Instance method `comparePassword()` — constant-time comparison (timing-safe)
 *   - Role enum — holder / issuer / verifier — used for RBAC
 * 
 * Why cost factor 12?
 *   bcrypt cost is exponential: factor 12 = 2^12 = 4096 rounds.
 *   This takes ~250ms to compute — fast enough for login, slow enough to
 *   make brute-force attacks impractical (~4 passwords/sec vs millions).
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const SALT_ROUNDS = 12; // 2^12 = 4096 hashing rounds

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,       // always store lowercase — case-insensitive login
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  passwordHash: {
    type: String,
    required: true,
    select: false,         // NEVER return passwordHash in queries by default
  },
  role: {
    type: String,
    enum: {
      values: ['holder', 'issuer', 'verifier'],
      message: 'Role must be holder, issuer, or verifier',
    },
    default: 'holder',
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  did: {
    type: String,
    default: null,         // linked DID — set when user creates/imports a DID
  },
}, {
  timestamps: true,        // auto createdAt + updatedAt
  toJSON: {
    transform: (doc, ret) => {
      // Remove sensitive fields when converting to JSON
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    },
  },
});

// ── Virtual `password` field ──────────────────────────────────────────────────
// This allows us to set `user.password = 'plain'` and have the pre-save hook
// hash it automatically. The plain-text password is NEVER stored in the DB.
userSchema.virtual('password').set(function (value) {
  this._password = value; // temporary storage for pre-save hook
});

// ── Pre-save hook: Hash password ──────────────────────────────────────────────
// Runs before every save(). If _password is set (via virtual), hash it.
// This demonstrates Mongoose middleware (lifecycle hooks) — Lecture 41.
userSchema.pre('save', async function () {
  if (!this._password) return;
  this.passwordHash = await bcrypt.hash(this._password, SALT_ROUNDS);
});

// ── Instance method: Compare password ─────────────────────────────────────────
// bcrypt.compare() is constant-time — prevents timing attacks where an attacker
// could measure response time to determine how many characters matched.
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Must explicitly select passwordHash since it's excluded by default
  const user = await this.constructor.findById(this._id).select('+passwordHash');
  if (!user || !user.passwordHash) return false;
  return bcrypt.compare(candidatePassword, user.passwordHash);
};

// ── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
