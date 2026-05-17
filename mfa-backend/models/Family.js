const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Family = sequelize.define('Family', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, // Génère automatiquement createdAt et updatedAt (très utile pour le suivi)
});

module.exports = Family;