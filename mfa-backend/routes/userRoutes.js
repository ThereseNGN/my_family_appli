const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// On injecte le middleware avant le contrôleur
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ 
        message: "Accès autorisé", 
        userInfo: req.user // Ces données viennent du middleware !
    });
});

module.exports = router;