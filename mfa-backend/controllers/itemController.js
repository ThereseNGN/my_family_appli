const itemRepository = require('../repositories/itemRepository');

exports.getTodoList = async (req, res) => {
  try {
    // req.user.familyId provient de notre middleware d'authentification !
    const todoList = await itemRepository.findTodoListByFamilyId(req.user.familyId);
    if (!todoList) {
      return res.status(404).json({ message: "Aucune liste trouvée pour cette famille." });
    }

    res.status(200).json(todoList);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la liste." });
  }
};

exports.createTodoItem = async (req, res) => {
  try {
    // On crée l'item en le liant à la liste trouvée
    const newItem = await itemRepository.createItem(
      req.user.familyId,
      req.user.userId,   // On trace qui a créé la tâche
      req.body
    );

    if (!newItem) {
      return res.status(404).json({ message: "Tâche non créée : Aucune liste trouvée pour cette famille." });
    }

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche." });
  }
};

exports.updateTodoItem = async (req, res) => {
  try {
    const todoItem = await itemRepository.getItemByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!todoItem) {
      return res.status(404).json({ message: "Tâche introuvable ou non autorisée pour votre famille." });
    }

    const updatedItem = await itemRepository.updateItem(
      todoItem,
      req.body
    );

    res.status(200).json({ message: "Tâche mise à jour avec succès.", todoItem: updatedItem });
  } catch (error) {
    console.error(error);
    // Erreur validation client
    if (error.message.startsWith('Champs invalides')) {

        return res.status(400).json({
            message: error.message
        });
    }
    //erreur serveur
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche." });
  }
};

exports.deleteTodoItem = async (req, res) => {
  try {
    const todoItem = await itemRepository.getItemByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!todoItem) {
      return res.status(404).json({ message: "Tâche introuvable ou non autorisée pour votre famille." });
    }

    await itemRepository.deleteItem(todoItem);

    res.status(200).json({ message: "Tâche supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche." });
  }
};