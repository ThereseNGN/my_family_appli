const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

// Validation pour la création d'une tâche
exports.createItemValidator = [
  body('intitule')
    .notEmpty().withMessage('L\'intitulé est obligatoire.')
    .trim()
    .escape(),
  validateRequest
];