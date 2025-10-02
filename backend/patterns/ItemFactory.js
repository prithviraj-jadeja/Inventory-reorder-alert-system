// backend/patterns/ItemFactory.js
class ItemFactory {
    static create(requestBody) {
      const { name, quantity, reorderLevel, unit, supplier, leadTime, category, cost } = requestBody;
      const itemData = {
        name,
        quantity: Number(quantity) || 0,
        reorderLevel: Number(reorderLevel) || 10,
        unit: unit || 'pcs',
        supplier: (typeof supplier === 'string') ? { name: supplier.trim() } : supplier,
        leadTime: Number(leadTime) || 7,
        category: category || 'General',
        cost: Number(cost) || 0,
      };
      if (itemData.quantity < 0) throw new Error("Quantity cannot be negative.");
      return itemData;
    }
  }
  module.exports = ItemFactory;