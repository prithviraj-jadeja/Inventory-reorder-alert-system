const Item = require("../models/Item");
const { ItemAlertDecorator, ItemDeliveryDecorator } = require("../models/Item");
const AlertManager = require("../observers/AlertManager");
const AlertTableObserver = require("../observers/AlertTableObserver");
const NotificationObserver = require("../observers/NotificationObserver");
const DashboardObserver = require("../observers/DashboardObserver");

// Initialize AlertManager and observers
const alertManager = new AlertManager();
const alertTableObserver = new AlertTableObserver();
const notificationObserver = new NotificationObserver();
const dashboardObserver = new DashboardObserver();

// Subscribe observers to AlertManager
alertManager.subscribe(alertTableObserver);
alertManager.subscribe(notificationObserver);
alertManager.subscribe(dashboardObserver);
const getItems = async (req, res) => {
  try {
    const { 
      search, 
      supplier, 
      minQuantity, 
      maxQuantity, 
      lowStock,
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Text search across name and supplier
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Supplier filter
    if (supplier) {
      filter.supplier = { $regex: supplier, $options: 'i' };
    }
    
    // Quantity range filters
    if (minQuantity || maxQuantity) {
      filter.quantity = {};
      if (minQuantity) filter.quantity.$gte = parseInt(minQuantity);
      if (maxQuantity) filter.quantity.$lte = parseInt(maxQuantity);
    }
    
    // Low stock filter
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$quantity', '$reorderLevel'] };
    }

    // Build sort object
    const sortOptions = {};
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const itemsRaw = await Item.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Decorate each item with alert status and delivery date
    const items = itemsRaw.map(item => {
      const alertDecorator = new ItemAlertDecorator(item);
      const deliveryDecorator = new ItemDeliveryDecorator(item);
      return {
        ...item.toObject(),
        alertStatus: alertDecorator.getAlertStatus(),
        deliveryDate: deliveryDecorator.getDeliveryDate(),
      };
    });

    // Get total count for pagination info
    const totalItems = await Item.countDocuments(filter);

    // Check for low stock alerts using Observer pattern
    alertManager.checkLowStock(itemsRaw);

    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / parseInt(limit)),
        totalItems,
        hasNext: skip + items.length < totalItems,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  const { name, quantity, reorderLevel, unit, supplier, leadTime, category, cost, description, tags } = req.body;
  try {
    // Handle supplier field - if it's a string, convert to object format
    let supplierData = supplier;
    if (typeof supplier === 'string' && supplier.trim()) {
      supplierData = { name: supplier.trim() };
    }
    
    const item = await Item.create({
      name,
      quantity,
      reorderLevel,
      unit,
      supplier: supplierData,
      leadTime,
      category,
      cost,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  const { name, quantity, reorderLevel, unit, supplier, leadTime, category, cost, description, tags } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Handle supplier field - if it's a string, convert to object format
    let supplierData = supplier;
    if (typeof supplier === 'string' && supplier.trim()) {
      supplierData = { name: supplier.trim() };
    }

    item.name = name || item.name;
    item.quantity = quantity || item.quantity;
    item.reorderLevel = reorderLevel || item.reorderLevel;
    item.unit = unit || item.unit;
    item.supplier = supplierData || item.supplier;
    item.leadTime = leadTime || item.leadTime;
    item.category = category || item.category;
    item.cost = cost || item.cost;
    item.description = description || item.description;
    if (tags) {
      item.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

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
const lowStock = async (req, res) => {
  try {
    const itemsRaw = await Item.find({});
    // Decorate items with alert status
    const low = itemsRaw
      .map(item => {
        const alertDecorator = new ItemAlertDecorator(item);
        return {
          ...item.toObject(),
          alertStatus: alertDecorator.getAlertStatus(),
        };
      })
      .filter(item => item.alertStatus === 'Low Stock' || item.alertStatus === 'Critical' || item.alertStatus === 'Urgent');

    // Use Observer pattern to check and notify about low stock
    alertManager.checkLowStock(itemsRaw);

    res.json(low);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSuppliers = async (req, res) => {
  try {
    const items = await Item.find({ supplier: { $exists: true, $ne: null, $ne: '' } });
    const suppliers = items
      .map(item => {
        if (typeof item.supplier === 'object' && item.supplier?.name) {
          return item.supplier.name;
        }
        return item.supplier;
      })
      .filter(supplier => supplier && supplier.trim())
      .filter((supplier, index, array) => array.indexOf(supplier) === index); // Remove duplicates
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Observer pattern management endpoints
const getAlertStatus = async (req, res) => {
  try {
    const currentAlerts = alertManager.getCurrentAlerts();
    const alertHistory = alertManager.getAlertHistory();
    const observerCount = alertManager.getObserverCount();
    
    res.json({
      currentAlerts,
      alertHistory: alertHistory.slice(-10), // Last 10 entries
      observerCount,
      observers: {
        alertTable: alertTableObserver.getStatus(),
        notification: notificationObserver.getStats(),
        dashboard: dashboardObserver.getStatus()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearAlerts = async (req, res) => {
  try {
    alertManager.clearAlerts();
    res.json({ message: 'Alerts cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboardMetrics = async (req, res) => {
  try {
    const metrics = dashboardObserver.getMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getItems, 
  addItem, 
  updateItem, 
  deleteItem, 
  lowStock, 
  getSuppliers,
  getAlertStatus,
  clearAlerts,
  getDashboardMetrics
};

