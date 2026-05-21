const eventRepository = require('../repositories/eventRepository');

exports.getFamilyCalendar = async (req, res) => {
  try {
    // req.user.familyId provient de notre middleware d'authentification !
    const calendar = await eventRepository.findCalendarByFamilyId(req.user.familyId);
    if (!calendar) {
      return res.status(404).json({ message: "Aucun calendrier trouvé pour cette famille." });
    }

    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du calendrier." });
  }
};

exports.createFamilyEvent = async (req, res) => {
  try {
    // On crée l'évènement en le liant au calendrier trouvé
    const newEvent = await eventRepository.createEvent(
      req.user.familyId,
      req.user.userId,   // On trace qui a créé l'évènement
      req.body
    );

    if (!newEvent) {
      return res.status(404).json({ message: "Évènement non créé : Aucun calendrier trouvé pour cette famille." });
    }

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'évènement." });
  }
};

exports.updateFamilyEvent = async (req, res) => {
  try {
    const event = await eventRepository.getEventByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!event) {
      return res.status(404).json({ message: "Évènement introuvable ou non autorisé pour votre famille." });
    }

    const updatedEvent = await eventRepository.updateEvent(
      event,
      req.body
    );

    res.status(200).json({ message: "Évènement mis à jour avec succès.", event: updatedEvent });
  } catch (error) {
    console.error(error);
    // Erreur validation client
    if (error.message.startsWith('Champs invalides')) {

        return res.status(400).json({
            message: error.message
        });
    }
    //erreur serveur
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'évènement." });
  }
};

exports.deleteFamilyEvent = async (req, res) => {
  try {
    const event = await eventRepository.getEventByIdAndFamilyId(
    req.params.id,
    req.user.familyId
    );
    if (!event) {
      return res.status(404).json({ message: "Évènement introuvable ou non autorisé pour votre famille." });
    }

    await eventRepository.deleteEvent(event);

    res.status(200).json({ message: "Évènement supprimé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'évènement." });
  }
};