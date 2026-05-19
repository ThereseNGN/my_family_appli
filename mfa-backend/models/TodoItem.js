const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodoItem = sequelize.define('TodoItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  intitule: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  priorite: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },  
  statut: {
    type: DataTypes.ENUM('a_faire','en_cours','termine'),
    allowNull: false,
    defaultValue: 'a_faire',
  },
}, { timestamps: true });

module.exports = TodoItem;