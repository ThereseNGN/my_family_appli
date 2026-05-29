const { Family, User, TodoList, ShoppingList, Calendar } = require('../models');

// Recherche un utilisateur par son adresse email
exports.findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Recherche une famille par son ID
exports.findFamilyById = async (familyId) => {
  return await Family.findByPk(familyId);
};

// Crée une nouvelle famille et génère automatiquement ses 3 listes associées
exports.createFamilyWithLists = async (nomFamille) => {
  // 1. Création de la famille
  const newFamily = await Family.create({ nom: nomFamille });
  
  // 2. Création des listes rattachées à cet ID
  await TodoList.create({ familyId: newFamily.id });
  await ShoppingList.create({ familyId: newFamily.id });
  await Calendar.create({ familyId: newFamily.id });

  return newFamily;
};

//Crée un nouvel utilisateur
exports.createUser = async (userData) => {
  return await User.create(userData);
};