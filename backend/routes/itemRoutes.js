// backend/routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const { getItems, addItem, updateItemStock, deleteItem } = require('../controllers/itemController');

router.use(protect);

router.get('/', getItems);
router.post('/', addItem);
router.patch('/:id/stock', updateItemStock); // Changed to PATCH for semantic stock updates
router.delete('/:id', deleteItem);

// Note: The general PUT route for updating all fields can be added back if needed,
// but the Command pattern for stock is a great specific example.

module.exports = router;