const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', [
  // Règles de validation
  body('email').trim().isEmail().withMessage('Format de l\'email invalide.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('prenom').notEmpty().trim().withMessage('Le prénom est obligatoire.'),
  body('nom').notEmpty().trim().escape().withMessage('Le nom est obligatoire.'),
  // On accepte soit nom (création) soit familyId (liaison)
  body().custom(body => {
    if (!body.nom && !body.familyId) {
      throw new Error('Vous devez spécifier un nom de famille ou un ID de famille existante.');
    }
    return true;
  })
], authController.registerUser);

module.exports = router;