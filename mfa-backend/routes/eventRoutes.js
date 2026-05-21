const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// On protège cette route avec le middleware !
router.get('/', authMiddleware, eventController.getFamilyCalendar);
router.post('/', authMiddleware, eventController.createFamilyEvent);
router.put('/:id', authMiddleware, eventController.updateFamilyEvent);
router.delete('/:id', authMiddleware, eventController.deleteFamilyEvent);

module.exports = router;