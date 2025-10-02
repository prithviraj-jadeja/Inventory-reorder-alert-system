
const express = require('express');
const { getItems, addItem, updateItem, deleteItem, lowStock, getSuppliers, getAlertStatus, clearAlerts, getDashboardMetrics } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getItems).post(protect, addItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);
router.get('/low-stock', lowStock);
router.get('/suppliers', protect, getSuppliers);

// Observer pattern endpoints
router.get('/alerts/status', protect, getAlertStatus);
router.post('/alerts/clear', protect, clearAlerts);
router.get('/dashboard/metrics', protect, getDashboardMetrics);

module.exports = router;
