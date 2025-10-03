
const express = require('express');
const { getItems, addItem, updateItem, deleteItem,lowStock } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');
const itemDecorator = require('./Decorator');
const router = express.Router();

const secure = (h) => itemDecorator.wrap(h, protect); 

router.route('/').get(secure(getItems)).post(secure(addItem));
router.route('/:id').put(secure(updateItem)).delete(secure(deleteItem));
router.get('/low-stock', itemDecorator.wrap(lowStock)); 

module.exports = router;