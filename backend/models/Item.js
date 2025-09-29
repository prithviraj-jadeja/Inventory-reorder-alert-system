const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 10 },
    unit: { type: String, default: 'pcs' },
    supplier: { 
      name: { type: String },
      contactInfo: { type: String },
      leadTime: { type: Number, default: 7, min: 1 } // days
    },
    leadTime: { type: Number, required: true, default: 7, min: 1 }, // days
    deliveryDate: { type: Date },
    lastOrderDate: { type: Date },
    expectedDeliveryDate: { type: Date },
    category: { type: String, default: 'General' },
    cost: { type: Number, min: 0 },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }]
  },
  {
    timestamps: true // Adds createdAt and updatedAt fields
  }
);

// Virtual for calculating days until stockout
itemSchema.virtual('daysUntilStockout').get(function() {
  if (this.quantity <= 0) return 0;
  // This is a simplified calculation - in reality, you'd need usage rate
  return Math.ceil(this.quantity / 1); // Assuming 1 unit per day usage
});

// Virtual for stock status
itemSchema.virtual('stockStatus').get(function() {
  if (this.quantity <= 0) return 'Out of Stock';
  if (this.quantity <= this.reorderLevel * 0.5) return 'Critical';
  if (this.quantity <= this.reorderLevel * 0.8) return 'Urgent';
  if (this.quantity <= this.reorderLevel) return 'Low Stock';
  return 'In Stock';
});

// Method to calculate delivery date
itemSchema.methods.calculateDeliveryDate = function(orderDate = new Date()) {
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + this.leadTime);
  return deliveryDate;
};

// Method to check if item needs reordering
itemSchema.methods.needsReorder = function() {
  return this.quantity <= this.reorderLevel;
};

// Method to get reorder urgency
itemSchema.methods.getReorderUrgency = function() {
  if (this.quantity <= 0) return 'Critical';
  if (this.quantity <= this.reorderLevel * 0.5) return 'Critical';
  if (this.quantity <= this.reorderLevel * 0.8) return 'Urgent';
  if (this.quantity <= this.reorderLevel) return 'Low';
  return 'Normal';
};

// Pre-save middleware to calculate delivery date if not provided
itemSchema.pre('save', function(next) {
  if (this.isModified('leadTime') || this.isModified('lastOrderDate')) {
    if (this.lastOrderDate) {
      this.expectedDeliveryDate = this.calculateDeliveryDate(this.lastOrderDate);
    }
  }
  next();
});

// Index for better query performance
itemSchema.index({ name: 'text', supplier: 'text', category: 'text' });
itemSchema.index({ quantity: 1, reorderLevel: 1 });
itemSchema.index({ deliveryDate: 1 });
itemSchema.index({ isActive: 1 });

module.exports = mongoose.model('Item', itemSchema);