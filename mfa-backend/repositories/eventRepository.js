const { Calendar, Event } = require('../models');

// Récupérer le calendrier (=liste d'évènements) de la famille de l'utilisateur connecté
exports.findCalendarByFamilyId = async (familyId) => {
  return await Calendar.findOne({
    where: { familyId },
    include: [Event] // Inclut automatiquement les évènements liés
  });
};

exports.createEvent = async (familyId, userId, data) => {
  const calendar = await Calendar.findOne({
    where: { familyId }
  });
  return await Event.create({
    ...data,
    calendarId: calendar.id, // ID extrait automatiquement, pas du client !
    userId: userId,   // On trace qui a créé la tâche
  });
};

exports.getEventByIdAndFamilyId = async (id, familyId) => {
  // 1. On cherche l'évènement ET on vérifie qu'il appartient à la liste de la famille de l'utilisateur
  return targetEvent = await Event.findOne({
    where: { id: id },
    include: {
        model: Calendar,
        where: { familyId: familyId } // Sécurité : lock par famille
    }
  });
}

exports.updateEvent = async (event, data) => {
  const allowedFields = [
   'intitule',
   'description',
   'dateDebut',
   'dateFin',
   'lieu'
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
      event[field] = data[field];
   }
});
  return await event.save();
}

exports.deleteEvent = async (event) => {
  // Suppression définitive de la ligne en BDD
  return await event.destroy();
}