const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statut: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // 0 : pas de besoin, 1 : à acheter
  },
}, { timestamps: true });

module.exports = Article;