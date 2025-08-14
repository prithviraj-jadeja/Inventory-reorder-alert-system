const Item = require("../models/Item");
const getItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  const { name, quantity, reorderLevel, unit, supplier } = req.body;
  try {
    const item = await Item.create({
      name,
      quantity,
      reorderLevel,
      unit,
      supplier,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { name, quantity, reorderLevel, unit, supplier } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.name=name || item.name;
    item.quantity = quantity || item.quantity;
    item.reorderLevel = reorderLevel || item.reorderLevel;
    item.unit = unit || item.unit;
    item.supplier = supplier || item.supplier;

    const updatedItem = await item.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    await item.remove();
    res.json({ message: "Item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
function isLowStock(item) {
  return item.quantity <= item.reorderLevel;
};
const lowStock=async(req,res)=>{
  const items = await Item.find({ });
  const low = items.filter(isLowStock);
  res.json(low);
};
module.exports = { getItems, addItem, updateItem, deleteItem,lowStock };

