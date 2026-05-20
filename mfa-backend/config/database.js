const { Sequelize } = require('sequelize');
require('dotenv').config();

// on modifie le nom de la base de données en mode test
const dbName = process.env.NODE_ENV === 'test' ? 'myfamilyapp_test_db' : process.env.DB_NAME;

const sequelize = new Sequelize(
  dbName,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false, // Évite de surcharger la console avec le SQL brut pour le moment
  }
);

module.exports = sequelize;