// backend/controllers/itemController.js
const ItemRepository = require('../patterns/ItemRepository');
const ItemFactory = require('../patterns/ItemFactory');
const UpdateStockCommand = require('../patterns/UpdateStockCommand');
const { AlertContext, ThresholdAlertStrategy } = require('../patterns/AlertStrategy');

const alertContext = new AlertContext(new ThresholdAlertStrategy());

const getItems = async (req, res) => {
  try {
    const items = await ItemRepository.findAll(req.query);
    const itemsWithStatus = items.map(item => ({
      ...item.toObject(),
      alertStatus: alertContext.evaluate(item)
    }));
    res.status(200).json({ success: true, data: itemsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addItem = async (req, res) => {
  try {
    const itemData = ItemFactory.create(req.body);
    const newItem = await ItemRepository.create(itemData);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params; // item ID comes from URL
    const itemData = ItemFactory.create(req.body); // validate/transform request body

    const updatedItem = await ItemRepository.update(id, itemData);

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


const updateItemStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityChange } = req.body;
    const command = new UpdateStockCommand(id, quantityChange);
    const updatedItem = await command.execute();
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ItemRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch(error) {
     res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getItems, addItem, updateItemStock, updateItem, deleteItem };