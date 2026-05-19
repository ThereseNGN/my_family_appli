const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', [
  // Règles de validation
  body('email').trim().isEmail().withMessage('Format de l\'email invalide.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('prenom').notEmpty().trim().withMessage('Le prénom est obligatoire.'),
    // Le nom n'est obligatoire QUE SI familyId n'est pas fourni
  body('nom')
    .if((value, { req }) => !req.body.familyId) // Condition : si familyId est absent
    .notEmpty().trim().escape().withMessage('Le nom est obligatoire pour créer une nouvelle famille'),
  // Validation globale pour vérifier qu'on a soit nom (création) soit familyId (rejoindre)
  body().custom(body => {
    if (!body.nom && !body.familyId) {
      throw new Error('Vous devez spécifier un nom de famille ou un ID de famille existante.');
    }
    return true;
  })
], authController.registerUser);

router.post('/login', authController.loginUser);

module.exports = router;