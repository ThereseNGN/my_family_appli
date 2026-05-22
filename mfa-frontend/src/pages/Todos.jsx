import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Todos = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/todos')
      .then(res => setTasks(res.data.TodoItems))
      .catch(err => console.error("Erreur chargement:", err));
  }, []);

  return (
    <div>
      <h3>Mes Tâches "To do"</h3>
      <ul className="list-group">
        {tasks.map(task => (
          <li key={task.id} className="list-group-item d-flex justify-content-between">
            {task.intitule}
            <span className={`badge ${task.statut === 'termine' ? 'bg-success' : 'bg-warning text-dark'}`}>
              {task.statut}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;