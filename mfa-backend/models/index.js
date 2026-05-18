const sequelize = require('../config/database');
const Family = require('./Family');
const User = require('./User');
const TodoList = require('./TodoList');
const TodoItem = require('./TodoItem');
const ShoppingList = require('./ShoppingList');
const Article = require('./Article');

// 1. Relations Famille <-> Utilisateurs
Family.hasMany(User, { foreignKey: 'familyId', onDelete: 'CASCADE' });
User.belongsTo(Family, { foreignKey: 'familyId' });

// 2. Relations Famille <-> Listes (Une famille a 1 ShoppingList et 1 Todo List)
Family.hasOne(TodoList, { foreignKey: 'familyId', onDelete: 'CASCADE' });
TodoList.belongsTo(Family, { foreignKey: 'familyId' });

Family.hasOne(ShoppingList, { foreignKey: 'familyId', onDelete: 'CASCADE' });
ShoppingList.belongsTo(Family, { foreignKey: 'familyId' });

// 3. COMPOSITION : Listes <-> Éléments (TodoItem/Article) (Cascade si la liste est supprimée)
TodoList.hasMany(TodoItem, { foreignKey: 'todoListId', onDelete: 'CASCADE' });
TodoItem.belongsTo(TodoList, { foreignKey: 'todoListId' });

ShoppingList.hasMany(Article, { foreignKey: 'shoppingListId', onDelete: 'CASCADE' });
Article.belongsTo(ShoppingList, { foreignKey: 'shoppingListId' });

// 4. Liaison Utilisateur <-> Éléments (TodoItem/Article)
// Permet de savoir quel membre de la famille a créé ou est assigné à la tâche
User.hasMany(TodoItem, { foreignKey: 'userId', onDelete: 'SET NULL' });
TodoItem.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Article, { foreignKey: 'userId', onDelete: 'SET NULL' });
Article.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Family,
  User,
  TodoList,
  TodoItem,
  ShoppingList,
  Article,
};