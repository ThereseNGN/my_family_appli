const sequelize = require('../config/database');
const Family = require('./Family');
const User = require('./User');
const TodoList = require('./TodoList');
const TodoItem = require('./TodoItem');
const ShoppingList = require('./ShoppingList');
const Article = require('./Article');
const Calendar = require('./Calendar');
const Event = require('./Event');

// 1. Relations Famille <-> Utilisateurs
Family.hasMany(User, { foreignKey: 'familyId', onDelete: 'CASCADE' });
User.belongsTo(Family, { foreignKey: 'familyId' });

// 2. Relations Famille <-> Listes (Une famille a 1 ShoppingList, 1 Todo List et 1 Calendar)
Family.hasOne(TodoList, { foreignKey: 'familyId', onDelete: 'CASCADE' });
TodoList.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasOne(ShoppingList, { foreignKey: 'familyId', onDelete: 'CASCADE' });
ShoppingList.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasOne(Calendar, { foreignKey: 'familyId', onDelete: 'CASCADE' });
Calendar.belongsTo(Family, { foreignKey: 'familyId' });

// 3. COMPOSITION : Listes <-> Éléments (TodoItem/Article/Event) (Cascade si la liste est supprimée)
TodoList.hasMany(TodoItem, { foreignKey: 'todoListId', onDelete: 'CASCADE' });
TodoItem.belongsTo(TodoList, { foreignKey: 'todoListId' });

ShoppingList.hasMany(Article, { foreignKey: 'shoppingListId', onDelete: 'CASCADE' });
Article.belongsTo(ShoppingList, { foreignKey: 'shoppingListId' });

Calendar.hasMany(Event, { foreignKey: 'calendarId', onDelete: 'CASCADE' });
Event.belongsTo(Calendar, { foreignKey: 'calendarId' });

// 4. Liaison Utilisateur <-> Éléments (TodoItem/Article/Event)
// Permet de savoir quel membre de la famille a créé ou est assigné à la tâche
User.hasMany(TodoItem, { foreignKey: 'userId', onDelete: 'SET NULL' });
TodoItem.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Article, { foreignKey: 'userId', onDelete: 'SET NULL' });
Article.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Event, { foreignKey: 'userId', onDelete: 'SET NULL' });
Event.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Family,
  User,
  TodoList,
  TodoItem,
  ShoppingList,
  Article,
  Calendar,
  Event,
};