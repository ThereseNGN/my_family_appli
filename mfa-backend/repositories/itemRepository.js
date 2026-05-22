const { TodoList, TodoItem } = require('../models');

// Récupérer la liste de tâches de la famille de l'utilisateur connecté
exports.findTodoListByFamilyId = async (familyId) => {
  return await TodoList.findOne({
    where: { familyId },
    include: [TodoItem] // Inclut automatiquement les tâches liées
  });
};

exports.createItem = async (familyId, userId, data) => {
  const todoList = await TodoList.findOne({
    where: { familyId }
  });
  return await TodoItem.create({
    ...data,
    todoListId: todoList.id, // ID extrait automatiquement, pas du client !
    userId: userId,   // On trace qui a créé la tâche
  });
};

exports.getItemByIdAndFamilyId = async (id, familyId) => {
  // 1. On cherche l'item ET on vérifie qu'il appartient à la liste de la famille de l'utilisateur
  return targetItem = await TodoItem.findOne({
    where: { id: id },
    include: {
        model: TodoList,
        where: { familyId: familyId } // Sécurité : lock par famille
    }
  });
}

exports.updateItem = async (todoItem, data) => {
  const allowedFields = [
   'intitule',
   'description',
   'deadline',
   'priorite',
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
      todoItem[field] = data[field];
   }
});
  return await todoItem.save();
}

exports.deleteItem = async (todoItem) => {
  // Suppression définitive de la ligne en BDD
  return await todoItem.destroy();
}
