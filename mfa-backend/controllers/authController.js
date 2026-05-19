const { Family, User, TodoList, ShoppingList } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    // 4. Création ou Rejoindre la Famille
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

exports.loginUser = async (currentRequest, currentResponse) => {
  try {
    const { email, password } = currentRequest.body;

    // 1. Vérification de la présence des champs
    if (!email || !password) {
      return currentResponse.status(400).json({ message: "Email et mot de passe requis." });
    }

    // 2. Recherche de l'utilisateur par son email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Message générique par sécurité (on ne dit pas si c'est l'email ou le mdp qui est faux)
      return currentResponse.status(401).json({ message: "Identifiants incorrects." });
    }

    // 3. Comparaison du mot de passe en clair avec le hash en BDD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return currentResponse.status(401).json({ message: "Identifiants incorrects." });
    }

    // 4. Génération du Token JWT
    // On y stocke l'ID de l'utilisateur et son ID de famille (très utile pour la suite)
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role,
        familyId: user.familyId 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Le token expire dans 24 heures
    );

    // 5. Réponse de succès
    return currentResponse.status(200).json({
      message: "Connexion réussie.",
      token: token,
      user: {
        id: user.id,
        prenom: user.prenom,
        role: user.role,
        familyId: user.familyId
      }
    });

  } catch (error) {
    console.error(error);
    return currentResponse.status(500).json({ message: "Erreur serveur lors de la connexion." });
  }
};