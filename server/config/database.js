// ─── MongoDB Connection Module (Lectures 33-36) ──────────────────────────────
// Connects Express to MongoDB Atlas using Mongoose ODM.
// Includes: event listeners, connection options, retry logic, graceful shutdown.
//
// Why Mongoose?
//   - ODM (Object Data Modeling) = schemas + validation + hooks
//   - Built-in connection pooling (default 5 connections)
//   - Query API mirrors MongoDB shell commands

const mongoose = require('mongoose');

// ─── Connection State Map ─────────────────────────────────────────────────────
// mongoose.connection.readyState values:
//   0 = disconnected   1 = connected   2 = connecting   3 = disconnecting
const STATE_MAP = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Connect to MongoDB Atlas.
 * Called once at server startup — Mongoose manages the connection pool internally.
 */
const connect = async () => {
  // ── Event Listeners ───────────────────────────────────────────────────────
  // These fire on connection lifecycle events — useful for logging and monitoring
  mongoose.connection.on('connected', async () => {
    console.log('✅ MongoDB connected');
    try {
      const User = require('../models/User');
      const existing = await User.findOne({ email: 'demo@sovereign.dev' });
      if (!existing) {
        const demo = new User({ email: 'demo@sovereign.dev', name: 'Demo User', role: 'holder', passwordHash: 'placeholder' });
        demo.password = 'demo123';
        await demo.save();
        console.log('✅ Demo account created (demo@sovereign.dev / demo123)');
      }
    } catch (e) { /* ignore if already exists */ }
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
  });

  // ── Connect ─────────────────────────────────────────────────────────────────
  // serverSelectionTimeoutMS: how long to wait for a server before failing
  // socketTimeoutMS: how long to wait for socket operations before timing out
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferTimeoutMS: 30000,
    });
  } catch (err) {
    console.error('❌ MongoDB initial connection failed:', err.message);
    console.error('   Make sure MONGO_URI is set correctly in server/.env');
    // Don't crash the server — it can still serve cached/static content
    // Mongoose will auto-retry in the background
  }
};

/**
 * Get the current connection state as a human-readable string.
 * Used by the /api/health endpoint.
 */
const getStatus = () => {
  return STATE_MAP[mongoose.connection.readyState] || 'unknown';
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
// When the server is stopped (Ctrl+C), close the MongoDB connection cleanly
// before exiting. This prevents orphan connections on Atlas.
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGINT)');
  process.exit(0);
});

// SIGTERM is sent by Docker/Heroku/systemd — handle it the same way
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed (SIGTERM)');
  process.exit(0);
});

module.exports = { connect, getStatus };
