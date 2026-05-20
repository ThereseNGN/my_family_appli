const app = require('./app');
const { sequelize } = require('./models'); // Importe la BDD et les modèles associés
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Test de connexion à la base de données et synchronisation des tables
sequelize.sync({ alter: true }) // 'alter: true' met à jour les tables existantes sans les supprimer, 'force: true' réinitialise les tables y compris les donées !
  .then(() => {
    console.log('✅ Base de données MySQL synchronisée avec succès.');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Impossible de se connecter à la base de données :', error);
  });