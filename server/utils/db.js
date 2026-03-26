// ─── Mongoose CRUD Utility (Lectures 33-36) ───────────────────────────────────
// Replaces utils/fileDb.js — same function signatures, Mongoose under the hood.
//
// Before (fileDb.js):  readAll(filePath)         → read JSON file
// After  (db.js):      readAll(Model, filter)    → Model.find(filter).lean()
//
// .lean() returns plain JS objects instead of Mongoose documents — faster,
// and matches the old fileDb behavior (routes expect plain objects).

const { v4: uuidv4 } = require('uuid');

/**
 * Get all documents from a collection.
 * @param {mongoose.Model} Model - Mongoose model
 * @param {Object} filter - MongoDB filter query
 * @returns {Promise<Array>}
 */
const readAll = async (Model, filter = {}) => {
  return Model.find(filter).lean();
};

/**
 * Find a single document by its custom `id` field.
 * @param {mongoose.Model} Model
 * @param {string} id - Custom id (e.g., "cred-001")
 * @returns {Promise<Object|null>}
 */
const findById = async (Model, id) => {
  return Model.findOne({ id }).lean();
};

/**
 * Find documents by a specific field value.
 * @param {mongoose.Model} Model
 * @param {string} field
 * @param {*} value
 * @returns {Promise<Array>}
 */
const findBy = async (Model, field, value) => {
  return Model.find({ [field]: value }).lean();
};

/**
 * Create a new document.
 * @param {mongoose.Model} Model
 * @param {Object} data
 * @returns {Promise<Object>}
 */
const create = async (Model, data) => {
  const doc = new Model({
    id: data.id || uuidv4(),
    ...data,
  });
  const saved = await doc.save();
  return saved.toObject();
};

/**
 * Update a document by its custom `id` field.
 * @param {mongoose.Model} Model
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object|null>}
 */
const update = async (Model, id, updates) => {
  const updated = await Model.findOneAndUpdate(
    { id },
    { $set: updates },
    { new: true, lean: true }
  );
  return updated;
};

/**
 * Remove a document by its custom `id` field.
 * @param {mongoose.Model} Model
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const remove = async (Model, id) => {
  const deleted = await Model.findOneAndDelete({ id }).lean();
  return deleted;
};

module.exports = {
  readAll,
  findById,
  findBy,
  create,
  update,
  remove,
};
