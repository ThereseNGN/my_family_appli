const sequelize = require('../config/database');
const Family = require('./Family');
const User = require('./User');

// Définition des relations
Family.hasMany(User, { foreignKey: 'familyId', onDelete: 'CASCADE' });
User.belongsTo(Family, { foreignKey: 'familyId' });

module.exports = {
  sequelize,
  Family,
  User,
};