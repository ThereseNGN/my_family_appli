const { ShoppingList, Article } = require('../models');

// Récupérer la liste de courses de la famille de l'utilisateur connecté
exports.findShoppingListByFamilyId = async (familyId) => {
  return await ShoppingList.findOne({
    where: { familyId },
    include: [Article] // Inclut automatiquement les articles liés
  });
};

exports.createArticle = async (familyId, userId, data) => {
  const shoppingList = await ShoppingList.findOne({
    where: { familyId }
  });
  return await Article.create({
    ...data,
    shoppingListId: shoppingList.id, // ID extrait automatiquement, pas du client !
    userId: userId,   // On trace qui a créé l'article
  });
};

exports.getArticleByIdAndFamilyId = async (id, familyId) => {
  // 1. On cherche l'article ET on vérifie qu'il appartient à la liste de la famille de l'utilisateur
  return targetArticle = await Article.findOne({
    where: { id: id },
    include: {
        model: ShoppingList,
        where: { familyId: familyId } // Sécurité : lock par famille
    }
  });
}

exports.updateArticle = async (Article, data) => {
  const allowedFields = [
   'nom',
   'statut'
];

  // Vérification champs invalides
  const receivedFields = Object.keys(data);

  const invalidFields = receivedFields.filter(
      field => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {

      throw new Error(
          `Champs invalides : ${invalidFields.join(', ')}`
      );
  }

    // 2. Mise à jour des champs s'ils sont fournis dans la requête
  allowedFields.forEach(field => {
   if (data[field] !== undefined) {
      Article[field] = data[field];
   }
});
  return await Article.save();
}

exports.deleteArticle = async (Article) => {
  // Suppression définitive de la ligne en BDD
  return await Article.destroy();
}