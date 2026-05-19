const { TodoList, TodoItem } = require('../models');

// Récupérer la liste de tâches de la famille de l'utilisateur connecté
exports.getTodoList = async (req, res) => {
  try {
    // req.user.familyId provient de notre middleware d'authentification !
    const todoList = await TodoList.findOne({
      where: { familyId: req.user.familyId },
      include: [TodoItem] // Inclut automatiquement les tâches liées
    });

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
    const { intitule, description, deadline, priorite, statut } = req.body;

    // 1. On cherche la liste de la famille de l'utilisateur connecté
    const todoList = await TodoList.findOne({ 
      where: { familyId: req.user.familyId } 
    });

    if (!todoList) {
      return res.status(404).json({ message: "Aucune liste trouvée pour cette famille." });
    }

    // 2. On crée l'item en le liant à la liste trouvée
    const newItem = await TodoItem.create({
      intitule,
      description,
      deadline,
      priorite,
      statut,
      todoListId: todoList.id, // ID extrait automatiquement, pas du client !
      userId: req.user.userId   // On trace qui a créé la tâche
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche." });
  }
};

exports.updateTodoItem = async (req, res) => {
  try {
    const { id } = req.params; // L'ID de la tâche passe par l'URL : /api/todos/:id
    const { intitule, description, deadline, priorite, statut } = req.body;

    // 1. On cherche l'item ET on vérifie qu'il appartient à la liste de la famille de l'utilisateur
    const todoItem = await TodoItem.findOne({
      where: { id: id },
      include: {
        model: TodoList,
        where: { familyId: req.user.familyId } // Sécurité : lock par famille
      }
    });

    if (!todoItem) {
      return res.status(404).json({ message: "Tâche introuvable ou non autorisée pour votre famille." });
    }

    // 2. Mise à jour des champs s'ils sont fournis dans la requête
    if (intitule !== undefined) todoItem.intitule = intitule;
    if (description !== undefined) todoItem.description = description;
    if (deadline !== undefined) todoItem.deadline = deadline;
    if (priorite !== undefined) todoItem.priorite = priorite;
    if (statut !== undefined) todoItem.statut = statut;

    await todoItem.save();

    res.status(200).json({ message: "Tâche mise à jour avec succès.", todoItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche." });
  }
};

exports.deleteTodoItem = async (req, res) => {
  try {
    const { id } = req.params;

    const todoItem = await TodoItem.findOne({
      where: { id: id },
      include: {
        model: TodoList,
        where: { familyId: req.user.familyId }
      }
    });

    if (!todoItem) {
      return res.status(404).json({ message: "Tâche introuvable ou non autorisée." });
    }

    // Suppression définitive de la ligne en BDD
    await todoItem.destroy();

    res.status(200).json({ message: "Tâche supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche." });
  }
};