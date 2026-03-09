
const fs   = require('fs');             // File System module — core to Node.js
const path = require('path');           // Helps build cross-platform file paths
const { pipeline } = require('stream'); // Stream utility (Lectures 21-24)

const DEMO_DIR  = path.join(__dirname, 'data');
const DEMO_FILE = path.join(DEMO_DIR, 'demo-output.json');
const LOG_FILE  = path.join(DEMO_DIR, 'demo-log.txt');

console.log('');
console.log('═══════════════════════════════════════════════════');
console.log(' SOVEREIGN — File Handling Demo (Lectures 5-8)    ');
console.log('═══════════════════════════════════════════════════');
console.log('');

// ─── 1. SYNCHRONOUS vs ASYNCHRONOUS file operations ──────────────────────────
// Synchronous: blocks the event loop until done — use only during startup
// Asynchronous: non-blocking, uses callback when done — preferred in production

// ─── SYNC: Check/create data directory ───────────────────────────────────────
if (!fs.existsSync(DEMO_DIR)) {
  fs.mkdirSync(DEMO_DIR, { recursive: true });
  console.log(`✅ Created directory: ${DEMO_DIR}`);
} else {
  console.log(`📁 Directory exists: ${DEMO_DIR}`);
}

// ─── 2. WRITING a file (fs.writeFile — async) ────────────────────────────────
// In Sovereign, this is how we save a new credential to disk.
const sampleCredential = {
  id: 'demo-vc-001',
  type: 'VerifiableCredential',
  issuer: 'did:indy:MIT-Education-Dept',
  issuanceDate: new Date().toISOString(),
  credentialSubject: {
    id: 'did:indy:AlexChen',
    degree: { type: 'BachelorDegree', name: 'Computer Science' }
  }
};

console.log('--- 1. Writing a file (fs.writeFile) ---');
fs.writeFile(DEMO_FILE, JSON.stringify(sampleCredential, null, 2), 'utf8', (err) => {
  if (err) { console.error('Write failed:', err.message); return; }
  console.log(`✅ Written: ${DEMO_FILE}`);

  // ─── 3. READING a file (fs.readFile — async) ─────────────────────────────
  // In Sovereign, this is how we fetch stored credentials.
  console.log('');
  console.log('--- 2. Reading a file (fs.readFile) ---');
  fs.readFile(DEMO_FILE, 'utf8', (err, data) => {
    if (err) { console.error('Read failed:', err.message); return; }
    const parsed = JSON.parse(data);
    console.log(`✅ Read credential: ${parsed.id} | issuer: ${parsed.issuer}`);

    // ─── 4. APPENDING to a file (fs.appendFile) ──────────────────────────
    // In Sovereign, we append audit log entries when credentials are shared.
    console.log('');
    console.log('--- 3. Appending to a file (fs.appendFile) ---');
    const logEntry = `[${new Date().toISOString()}] Credential ${parsed.id} read by system\n`;
    fs.appendFile(LOG_FILE, logEntry, 'utf8', (err) => {
      if (err) { console.error('Append failed:', err.message); return; }
      console.log(`✅ Appended log entry to: ${LOG_FILE}`);

      // ─── 5. LISTING directory contents (fs.readdir) ──────────────────
      console.log('');
      console.log('--- 4. Reading a directory (fs.readdir) ---');
      fs.readdir(DEMO_DIR, (err, files) => {
        if (err) { console.error('Readdir failed:', err.message); return; }
        console.log(`✅ Files in data/: ${files.join(', ')}`);

        // ─── 6. FILE STATS (fs.stat) ─────────────────────────────────
        console.log('');
        console.log('--- 5. File stats (fs.stat) ---');
        fs.stat(DEMO_FILE, (err, stats) => {
          if (err) { console.error('Stat failed:', err.message); return; }
          console.log(`✅ ${path.basename(DEMO_FILE)} — size: ${stats.size} bytes, modified: ${stats.mtime}`);

          // ─── 7. FILE STREAMS (Lectures 21-24) ────────────────────────
          // For large files (e.g., bulk credential exports), streams are
          // more memory-efficient than reading the whole file at once.
          console.log('');
          console.log('--- 6. File Streams (fs.createReadStream) — Lectures 21-24 ---');
          demonstrateStream();
        });
      });
    });
  });
});

// ─── 7. STREAMS — Reading a file piece by piece ──────────────────────────────
// In Sovereign, the Issuer Portal exports thousands of credentials.
// Streams handle this without loading everything into memory.
function demonstrateStream() {
  const streamFile = path.join(DEMO_DIR, 'credentials.json');

  // Check the file exists before streaming
  if (!fs.existsSync(streamFile)) {
    console.log('⚠️  credentials.json not yet created. Run: node utils/seedData.js first');
    showModuleSummary();
    return;
  }

  const readStream  = fs.createReadStream(streamFile, { encoding: 'utf8', highWaterMark: 64 }); // 64 byte chunks
  const writeStream = fs.createWriteStream(path.join(DEMO_DIR, 'stream-copy.json'));

  let chunkCount = 0;

  readStream.on('data', (chunk) => {
    chunkCount++;
    console.log(`  Stream chunk ${chunkCount}: ${chunk.length} bytes received`);
  });

  readStream.on('end', () => {
    console.log(`✅ Stream completed — ${chunkCount} chunks processed`);
    showModuleSummary();
  });

  readStream.on('error', (err) => {
    console.error('Stream error:', err.message);
    showModuleSummary();
  });

  // Pipe: connect read stream to write stream (copy the file)
  readStream.pipe(writeStream);
}

// ─── 8. MODULE SYSTEM — require() vs ES import ───────────────────────────────
// This project uses CommonJS (require). Node.js also supports ES Modules (import).
// "type": "commonjs" in package.json = require()
// "type": "module"  in package.json = import/export
function showModuleSummary() {
  console.log('');
  console.log('--- 7. Module System (Lectures 13-16) ---');
  console.log('  CommonJS (this file)  : const fs = require("fs")');
  console.log('  ES Module syntax      : import fs from "fs"');
  console.log('  Custom module export  : module.exports = { myFunction }');
  console.log('  Custom module import  : const { myFunction } = require("./utils/fileDb")');
  console.log('');
  console.log('  This project exports from:');
  console.log('    utils/fileDb.js   → readAll, writeAll, findById, create, update, remove');
  console.log('    utils/didUtils.js → generateDID, resolveDID, signCredential');
  console.log('    config/index.js   → PORT, DATA_DIR, NODE_ENV');
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log(' File Handling Demo Complete!                       ');
  console.log('═══════════════════════════════════════════════════');
}

// ─── LECTURE 5-8: File watching (bonus — real-time monitoring) ───────────────
// fs.watch() notifies us when a file changes — useful for live credential updates
console.log('');
console.log('--- 8. File Watching (fs.watch) ---');
console.log('ℹ️  Watching data/credentials.json for changes...');
console.log('   (Modify the file in another terminal to see the event)');

try {
  const watcher = fs.watch(DEMO_DIR, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.json')) {
      console.log(`📡 File event: [${eventType}] ${filename} — at ${new Date().toLocaleTimeString()}`);
    }
  });
  // Stop watching after 5 seconds to let the demo run cleanly
  setTimeout(() => { watcher.close(); }, 5000);
} catch (e) {
  console.log('   (fs.watch not supported on this platform for this path)');
}
