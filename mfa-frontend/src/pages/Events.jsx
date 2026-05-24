import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // états pour le formulaire de création
  const [intituleNouvelEvent, setIntituleNouvelEvent] = useState('');
  const [descriptionNouvelEvent, setDescriptionNouvelEvent] = useState('');
  const [dateDebutNouvelEvent, setDateDebutNouvelEvent] = useState('');
  const [dateFinNouvelEvent, setDateFinNouvelEvent] = useState('');
  const [lieuNouvelEvent, setLieuNouvelEvent] = useState('');

  //1. Chargement initial du calendrier
  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/events')
      .then(res => {
        // Traduction des données API vers FullCalendar
        const formattedEvents = res.data.Events.map(event => ({
          id: event.id,
          title: event.intitule,
          start: event.dateDebut,
          end: event.dateFin,
          extendedProps: {
            description: event.description,
            lieu: event.lieu
          }
        }));
        setEvents(formattedEvents);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement du calendrier :", err);
        setLoading(false);
      });
  }, []);

  // 2. ACTION : Ajouter un événement (POST)
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!intituleNouvelEvent.trim() || !dateDebutNouvelEvent || !dateFinNouvelEvent) return;

    try {
      // Envoi au Back-end
      const res = await api.post('/events', {
        intitule : intituleNouvelEvent,
        description : descriptionNouvelEvent,
        dateDebut : dateDebutNouvelEvent,
        dateFin : dateFinNouvelEvent,
        lieu : lieuNouvelEvent
      });

      // On formate le nouvel événement créé pour l'ajouter directement à l'affichage
      const newEventFormatted = {
        id: res.data.id,
        title: res.data.intitule,
        start: res.data.dateDebut,
        end: res.data.dateFin,
        extendedProps: {
          description: res.data.description,
          lieu: res.data.lieuNouvelEvent
        }
      };

      setEvents([...events, newEventFormatted]);
      
      // Reset du formulaire : on vide les champs de saisie
      setIntituleNouvelEvent('');
      setDescriptionNouvelEvent('');
      setDateDebutNouvelEvent('');
      setDateFinNouvelEvent('');
      setLieuNouvelEvent('');
    } catch (err) {
      console.error("Erreur lors de la création de l'évènement :", err);
    }
  };

  // 3. ACTION : Clic sur un évènement
  const handleEventClick = (clickInfo) => {
    const desc = clickInfo.event.extendedProps.description || "Aucune description";
    const lieu = clickInfo.event.extendedProps.lieu ? `📍 Lieu : ${clickInfo.event.extendedProps.lieu}` : "";
    alert(`📅 Événement : ${clickInfo.event.title}\nDescription : ${desc}\n${lieu}`);
  };

  if (loading) return <div className="text-center mt-5">Chargement du calendrier familial...</div>;

  return (
    <div className="container mt-3 mb-5">
      <h3 className="mb-4">📅 Calendrier de la Famille</h3>

      {/* Rendu graphique de FullCalendar */}
      <div className="card shadow-sm p-2 mb-4" style={{ minHeight: '200px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          locale="fr" // Interface en français
          buttonText={{ today: "Aujourd'hui" }}
          headerToolbar={{
            left: 'prev,next',
            center: 'title',
            right: 'today'
          }}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      {/* Formulaire d'ajout rapide (Card compacte pour écran mobile) */}
      <form onSubmit={handleAddEvent} className="card p-3 mb-4 shadow-sm">
        <h5>Ajouter un rendez-vous</h5>
        <div className="row g-2">
          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Nom de l'événement (ex: RDV Dentiste Lucas)"
              value={intituleNouvelEvent}
              onChange={(e) => setIntituleNouvelEvent(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label small mb-0">Début</label>
            <input
              type="datetime-local"
              className="form-control form-control-sm"
              value={dateDebutNouvelEvent}
              onChange={(e) => setDateDebutNouvelEvent(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label small mb-0">Fin</label>
            <input
              type="datetime-local"
              className="form-control form-control-sm"
              value={dateFinNouvelEvent}
              onChange={(e) => setDateFinNouvelEvent(e.target.value)}
              required
            />
          </div>
          <div className="col-12">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Lieu (optionnel)"
              value={lieuNouvelEvent}
              onChange={(e) => setLieuNouvelEvent(e.target.value)}
            />
          </div>
          <div className="col-12">
            <textarea
              className="form-control form-control-sm"
              placeholder="Notes complémentaires"
              value={descriptionNouvelEvent}
              onChange={(e) => setDescriptionNouvelEvent(e.target.value)}
              rows="2"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-sm btn-primary mt-3 w-100">Enregistrer l'évènement</button>
      </form>

    </div>
  );
};

export default Events;