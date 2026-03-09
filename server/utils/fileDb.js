

const fs   = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // NPM package — installed via npm install

// ─── LECTURE 5-8: Ensure data directory and file exist ───────────────────────
function ensureFile(filePath, defaultContent = []) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true }); // create nested directories
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 2), 'utf8');
  }
}

// ─── READ ALL: Load entire JSON array from file ───────────────────────────────
// Returns a Promise — async/await compatible
function readAll(filePath) {
  return new Promise((resolve, reject) => {
    ensureFile(filePath);
    // LECTURE 5-8: fs.readFile — async, non-blocking
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(new Error(`FileDB.readAll failed: ${err.message}`));
      try {
        resolve(JSON.parse(data));
      } catch (parseErr) {
        reject(new Error(`FileDB.readAll: invalid JSON in ${filePath}`));
      }
    });
  });
}

// ─── WRITE ALL: Overwrite the entire JSON file ────────────────────────────────
function writeAll(filePath, data) {
  return new Promise((resolve, reject) => {
    ensureFile(filePath);
    // Pretty-print JSON with 2-space indent for human readability
    const content = JSON.stringify(data, null, 2);
    fs.writeFile(filePath, content, 'utf8', (err) => {
      if (err) return reject(new Error(`FileDB.writeAll failed: ${err.message}`));
      resolve(data);
    });
  });
}

// ─── FIND BY ID: Get a single record ─────────────────────────────────────────
async function findById(filePath, id) {
  const records = await readAll(filePath);
  return records.find(r => r.id === id) || null;
}

// ─── FIND BY FIELD: Query records ─────────────────────────────────────────────
async function findBy(filePath, field, value) {
  const records = await readAll(filePath);
  return records.filter(r => r[field] === value);
}

// ─── CREATE: Add a new record ─────────────────────────────────────────────────
// In Sovereign: called when a new credential is received
async function create(filePath, data) {
  const records = await readAll(filePath);
  const newRecord = {
    id: uuidv4(),           // UUID from NPM package — unique identifier
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...data,                // spread operator merges the provided fields
  };
  records.push(newRecord);
  await writeAll(filePath, records);
  return newRecord;
}

// ─── UPDATE: Modify an existing record ───────────────────────────────────────
// In Sovereign: called when a credential's status changes (e.g., expiring)
async function update(filePath, id, updates) {
  const records = await readAll(filePath);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  records[index] = {
    ...records[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    id, // prevent id from being overwritten
  };
  await writeAll(filePath, records);
  return records[index];
}

// ─── REMOVE: Delete a record ──────────────────────────────────────────────────
// In Sovereign: called when a credential is revoked
async function remove(filePath, id) {
  const records = await readAll(filePath);
  const index = records.findIndex(r => r.id === id);
  if (index === -1) return null;
  const [deleted] = records.splice(index, 1);
  await writeAll(filePath, records);
  return deleted;
}

// ─── APPEND TO LOG: Write audit trail ─────────────────────────────────────────
function appendLog(logPath, entry) {
  return new Promise((resolve, reject) => {
    const line = `[${new Date().toISOString()}] ${entry}\n`;
    fs.appendFile(logPath, line, 'utf8', (err) => {
      if (err) return reject(err);
      resolve(line);
    });
  });
}
// This is what other files receive when they require('./utils/fileDb')
module.exports = {
  readAll,
  writeAll,
  findById,
  findBy,
  create,
  update,
  remove,
  appendLog,
  ensureFile,
};
