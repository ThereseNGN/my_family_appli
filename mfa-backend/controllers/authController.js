const { Family, User, TodoList, ShoppingList } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

exports.registerUser = async (currentRequest, currentResponse) => {
  // 1. Récupération des erreurs d'Express-Validator
  const errors = validationResult(currentRequest);
  if (!errors.isEmpty()) {
    return currentResponse.status(400).json({ errors: errors.array() });
  }

  try {
    const { nom, prenom, email, password, role, familyId } = currentRequest.body;

    // 2. Vérification de l'existence de l'utilisateur
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return currentResponse.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    // 3. Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    let targetFamilyId = familyId;

    // 4. Création ou Liaison de Famille
    if (!targetFamilyId) {
      // CAS 1 : Premier membre, on crée la famille et SES listes uniques
      const newFamily = await Family.create({ nom: nom });
      targetFamilyId = newFamily.id;
      // 4b. Création AUTOMATIQUE de sa TodoList et ShoppingList (Contrainte 1-1)
      await TodoList.create({ familyId: targetFamilyId, nom: `To-do List de la famille ${nom}` });
      await ShoppingList.create({ familyId: targetFamilyId, nom: `Liste de courses de la famille ${nom}` });
    } else {
      // CAS 2 : Le membre rejoint, on vérifie que la famille existe
      const existingFamily = await Family.findByPk(targetFamilyId);
      if (!existingFamily) {
        return currentResponse.status(404).json({ message: "La famille spécifiée n'existe pas." });
      }
    }    

    // 5. Création de l'Utilisateur lié à cette famille (targetFamilyId)
    const newUser = await User.create({
      prenom,
      email,
      password: hashedPassword,
      role: role || 'user',
      familyId: targetFamilyId
    });

    // 6. Réponse en cas de succès
    return currentResponse.status(201).json({
      message: "Famille et utilisateur créés avec succès !",
      user: {
        id: newUser.id,
        prenom: newUser.prenom,
        email: newUser.email,
        role: newUser.role,
        familyId: newUser.familyId
      }
    });

  } catch (error) {
    console.error(error);
    return currentResponse.status(500).json({ message: "Erreur lors de l'inscription.", error: error.message });
  }
};