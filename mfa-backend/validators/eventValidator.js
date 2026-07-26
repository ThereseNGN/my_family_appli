const { body } = require('express-validator');
const { validateRequest } = require('../middleware/validateMiddleware');

exports.createEventValidator = [
  body('intitule')
    .notEmpty().withMessage('L\'intitulé de l\'événement est obligatoire.')
    .trim()
    .escape(),
  body('dateDebut')
    .notEmpty().withMessage('La date de début est obligatoire.')
    .isISO8601().withMessage('Format de date de début invalide.'),
  body('dateFin')
    .notEmpty().withMessage('La date de fin est obligatoire.')
    .isISO8601().withMessage('Format de date de fin invalide.')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.dateDebut)) {
        throw new Error('La date de fin ne peut pas être antérieure à la date de début.');
      }
      return true;
    }),
  validateRequest
];