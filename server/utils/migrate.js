#!/usr/bin/env node
// ─── JSON → MongoDB Migration Script (Lectures 33-36) ────────────────────────
// Migrates existing seed data from data/*.json files into MongoDB.
//
// Usage:  node utils/migrate.js
//
// This script is idempotent — it uses findOneAndUpdate with upsert: true,
// so running it multiple times won't create duplicates.
// Existing records are updated, new records are inserted.

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { connect } = require('../config/database');
const Credential   = require('../models/Credential');
const Identity     = require('../models/Identity');
const Issuer       = require('../models/Issuer');
const Activity     = require('../models/Activity');
const ProofRequest = require('../models/ProofRequest');

// ── Load JSON data files ──────────────────────────────────────────────────────
const credentials  = require('../data/credentials.json');
const dids         = require('../data/dids.json');
const issuers      = require('../data/issuers.json');
const activities   = require('../data/activities.json');
const proofReqs    = require('../data/proof-requests.json');

/**
 * Upsert an array of records into a Mongoose model.
 * Uses the `id` field as the unique key for matching.
 * @param {string} name - Collection name (for logging)
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Array} records - Array of plain objects to upsert
 * @param {string} idField - Field name to use as unique key (default: 'id')
 */
async function migrateCollection(name, Model, records, idField = 'id') {
  let upserted = 0;
  let updated  = 0;

  for (const record of records) {
    const key = record[idField];
    if (!key) {
      console.warn(`  ⚠️  Skipping record without ${idField} in ${name}`);
      continue;
    }

    const result = await Model.findOneAndUpdate(
      { [idField]: key },
      { $set: record },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // If _id was just created (not previously existing), it's an upsert
    if (result.createdAt && result.updatedAt &&
        Math.abs(result.createdAt - result.updatedAt) < 1000) {
      upserted++;
    } else {
      updated++;
    }
  }

  console.log(`  ✅ ${name}: ${records.length} records (${upserted} inserted, ${updated} updated)`);
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║  SOVEREIGN — JSON → MongoDB Migration                      ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');

  try {
    // Connect to MongoDB
    await connect();
    console.log('');

    // Migrate each collection
    console.log('📦 Migrating collections...');
    await migrateCollection('Credentials',    Credential,   credentials);

    // DIDs need special handling: dids.json uses `id` as the DID string,
    // but the Identity model uses `did` as the field name
    const mappedDids = dids.map(d => ({ ...d, did: d.id || d.did }));
    await migrateCollection('Identities',     Identity,     mappedDids, 'did');

    await migrateCollection('Issuers',        Issuer,       issuers);
    await migrateCollection('Activities',     Activity,     activities);
    await migrateCollection('ProofRequests',  ProofRequest, proofReqs);

    console.log('');
    console.log('✅ Migration complete!');
    console.log('');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.error(err.stack);
  }

  process.exit(0);
})();
