// backend/patterns/ItemRepository.js
const Item = require('../models/Item');

class ItemRepository {
  async findById(id) {
    return Item.findById(id);
  }

  async findAll(filter = {}, options = {}) {
    const { limit = 50, skip = 0, sort = { name: 'asc' } } = options;
    return Item.find(filter).sort(sort).skip(skip).limit(limit);
  }

  async create(itemData) {
    const item = new Item(itemData);
    return item.save();
  }

  async update(id, itemData) {
    return Item.findByIdAndUpdate(id, itemData, { new: true, runValidators: true });
  }

  async delete(id) {
    return Item.findByIdAndDelete(id);
  }
}
module.exports = new ItemRepository();