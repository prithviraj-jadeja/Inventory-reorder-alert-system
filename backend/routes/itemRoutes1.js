
const express = require('express');
const { getItems, addItem, updateItem, deleteItem,lowStock } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getItems).post(protect, addItem);
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);
router.get('/low-stock', lowStock);

module.exports = router;
