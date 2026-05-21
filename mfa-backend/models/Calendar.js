const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Calendar = sequelize.define('Calendar', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'My Family Calendar',
  },
}, { timestamps: true });

module.exports = Calendar;