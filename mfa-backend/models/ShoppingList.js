const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShoppingList = sequelize.define('ShoppingList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Ma liste de courses',
  },
}, { timestamps: true });

module.exports = ShoppingList;