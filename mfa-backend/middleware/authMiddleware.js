const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // 1. Récupération du header 'Authorization'
  const authHeader = req.headers['authorization'];
  
  // Le format attendu est "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Accès refusé : Aucun token fourni." });
  }

  // 2. Vérification du token avec la même clé secrète que lors de la connexion
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Accès refusé : Token invalide ou expiré." });
    }

    // 3. On injecte les infos utilisateur (userId, familyId, role) dans l'objet 'req'
    // Cela nous permettra de les utiliser partout après (pour filtrer les listes par famille)
    req.user = decoded; 
    
    // On passe au contrôleur suivant
    next();
  });
};