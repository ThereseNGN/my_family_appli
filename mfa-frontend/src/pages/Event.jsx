import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Event = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/event')
      .then(res => setEvents(res.data.Events))
      .catch(err => console.error("Erreur chargement:", err));
  }, []);

   // Fonction de formatage date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Fonction de formatage heure
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <h3>Mes Évènements</h3>
      <ul className="list-group">
        {events.map(event => (
          <li key={event.id} className="list-group-item d-flex justify-content-between">
            <div>
              <strong>{event.intitule}</strong>
              {event.description && (
                <div className="text-muted small">
                  {event.description}
                </div>
              )}
            </div>
            <span className='badge bg-success'>
              {event.lieu}
              {' • '}
              {formatDate(event.dateDebut)}
              {' à '}
              {formatTime(event.dateDebut)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Event;