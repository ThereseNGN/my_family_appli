import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Items = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/items')
      .then(res => setItems(res.data.TodoItems))
      .catch(err => console.error("Erreur chargement:", err));
  }, []);

  return (
    <div>
      <h3>Mes Tâches "To do"</h3>
      <ul className="list-group">
        {items.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between">
            {item.intitule}
            <span className={`badge ${item.statut === 'termine' ? 'bg-success' : 'bg-warning text-dark'}`}>
              {item.statut}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Items;