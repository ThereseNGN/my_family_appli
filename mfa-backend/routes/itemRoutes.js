const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middleware/authMiddleware');
const { createItemValidator } = require('../validators/itemValidator');

// On protège cette route avec le middleware !
router.get('/', authMiddleware, itemController.getTodoList);
router.post('/', authMiddleware, createItemValidator, itemController.createTodoItem);
router.put('/:id', authMiddleware, itemController.updateTodoItem);
router.delete('/:id', authMiddleware, itemController.deleteTodoItem);

module.exports = router;