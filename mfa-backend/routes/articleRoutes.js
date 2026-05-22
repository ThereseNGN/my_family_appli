const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');

// On protège cette route avec le middleware !
router.get('/', authMiddleware, articleController.getShoppingList);
router.post('/', authMiddleware, articleController.createShoppingArticle);
router.put('/:id', authMiddleware, articleController.updateShoppingArticle);
router.delete('/:id', authMiddleware, articleController.deleteShoppingArticle);

module.exports = router;