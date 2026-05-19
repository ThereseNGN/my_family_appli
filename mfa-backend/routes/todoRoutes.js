const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');

// On protège cette route avec le middleware !
router.get('/', authMiddleware, todoController.getTodoList);
router.post('/', authMiddleware, todoController.createTodoItem);
router.put('/:id', authMiddleware, todoController.updateTodoItem);
router.delete('/:id', authMiddleware, todoController.deleteTodoItem);

module.exports = router;