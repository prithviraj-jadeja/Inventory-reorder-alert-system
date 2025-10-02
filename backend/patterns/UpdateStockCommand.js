// backend/patterns/UpdateStockCommand.js
const ItemRepository = require('./ItemRepository');

class Command {
  async execute() { throw new Error('Execute method must be implemented.'); }
}

class UpdateStockCommand extends Command {
  constructor(itemId, quantityChange) {
    super();
    this.itemId = itemId;
    this.quantityChange = Number(quantityChange);
  }

  async execute() {
    if (isNaN(this.quantityChange)) throw new Error('Quantity change must be a number.');
    const item = await ItemRepository.findById(this.itemId);
    if (!item) throw new Error(`Item with ID ${this.itemId} not found.`);
    const newQuantity = item.quantity + this.quantityChange;
    if (newQuantity < 0) throw new Error(`Stock update would result in a negative quantity.`);
    return ItemRepository.update(this.itemId, { quantity: newQuantity });
  }
}
module.exports = UpdateStockCommand;