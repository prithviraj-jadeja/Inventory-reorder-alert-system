const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 10 },
    unit: { type: String, default: 'pcs' },
    supplier: { type: String },
  }
);

module.exports = mongoose.model('Item', itemSchema);