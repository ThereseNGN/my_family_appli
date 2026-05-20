const express = require('express');
const router = express.Router();
const shoppingController = require('../controllers/shoppingController');
const authMiddleware = require('../middleware/authMiddleware');

// On protège cette route avec le middleware !
router.get('/', authMiddleware, shoppingController.getShoppingList);
router.post('/', authMiddleware, shoppingController.createShoppingArticle);
router.put('/:id', authMiddleware, shoppingController.updateShoppingArticle);
router.delete('/:id', authMiddleware, shoppingController.deleteShoppingArticle);

module.exports = router;