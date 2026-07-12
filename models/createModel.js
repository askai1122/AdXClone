const mongoose = require('mongoose');
const { getNextSequence } = require('../utils/sequence');

function createModel(collectionName, fields, options = {}) {
  const { includeDateFilter = false } = options;
  const schemaDefinition = {
    id: { type: Number, unique: true },
    created_at: { type: Date, default: Date.now },
  };

  fields.forEach((field) => {
    schemaDefinition[field] = { type: String, default: '' };
  });

  if (includeDateFilter) {
    schemaDefinition.date_filter = { type: String, default: '' };
  }

  const schema = new mongoose.Schema(schemaDefinition, {
    collection: collectionName,
    versionKey: false,
  });

  schema.pre('save', async function preSave(next) {
    if (!this.id) {
      this.id = await getNextSequence(collectionName);
    }
    next();
  });

  return mongoose.models[collectionName] || mongoose.model(collectionName, schema);
}

module.exports = createModel;
