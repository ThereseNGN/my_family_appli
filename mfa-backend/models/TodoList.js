const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TodoList = sequelize.define('TodoList', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'My Family To-do list',
  },
}, { timestamps: true });

module.exports = TodoList;