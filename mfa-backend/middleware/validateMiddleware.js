const { validationResult } = require('express-validator');

exports.validateRequest = (req, res, next) => {
  // Récupération des erreurs d'Express-Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Le middleware bloque la requête et renvoie l'erreur 400
    return res.status(400).json({ errors: errors.array() });
  }
  // Si tout est valide, le middleware laisse passer au contrôleur/middleware suivant
  next();
};