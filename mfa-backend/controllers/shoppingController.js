const shoppingRepository = require('../repositories/shoppingRepository');

exports.getShoppingList = async (req, res) => {
  try {
    // req.user.familyId provient de notre middleware d'authentification !
    const shoppingList = await shoppingRepository.findShoppingListByFamilyId(req.user.familyId);
    if (!shoppingList) {
      return res.status(404).json({ message: "Aucune liste trouvée pour cette famille." });
    }

    res.status(200).json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la liste." });
  }
};

exports.createShoppingArticle = async (req, res) => {
  try {
    // On crée l'article en le liant à la liste trouvée
    const newArticle = await shoppingRepository.createArticle(
      req.user.familyId,
      req.user.userId,   // On trace qui a créé l'article
      req.body
    );

    if (!newArticle) {
      return res.status(404).json({ message: "Article non créé : Aucune liste trouvée pour cette famille." });
    }

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'article." });
  }
};

exports.updateShoppingArticle = async (req, res) => {
  try {
    const Article = await shoppingRepository.getArticleByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!Article) {
      return res.status(404).json({ message: "Article introuvable ou non autorisé pour votre famille." });
    }

    const updatedArticle = await shoppingRepository.updateArticle(
      Article,
      req.body
    );

    res.status(200).json({ message: "Article mis à jour avec succès.", Article: updatedArticle });
  } catch (error) {
    console.error(error);
    // Erreur validation client
    if (error.message.startsWith('Champs invalides')) {

        return res.status(400).json({
            message: error.message
        });
    }
    //erreur serveur
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'article." });
  }
};

exports.deleteShoppingArticle = async (req, res) => {
  try {
    const Article = await shoppingRepository.getArticleByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!Article) {
      return res.status(404).json({ message: "Article introuvable ou non autorisé pour votre famille." });
    }

    await shoppingRepository.deleteArticle(Article);

    res.status(200).json({ message: "Article supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'article." });
  }
};