import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // états pour le formulaire de création
  const [intituleNouvelItem, setIntituleNouvelItem] = useState('');
  const [descriptionNouvelItem, setDescriptionNouvelItem] = useState('');
  const [prioriteNouvelItem, setPrioriteNouvelItem] = useState(false);
  const [deadlineNouvelItem, setDeadlineNouvelItem] = useState('');

  //1. Chargement initial de la to-do list  
  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/items')
      .then(res => {
        setItems(res.data.TodoItems);
        setLoading(false);
      })        
      .catch(err => {
        console.error("Erreur lors du chargement de la to-do liste :", err);
        setLoading(false);
      });
  }, []);

  // 2. ACTION : Créer une tâche (POST)
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!intituleNouvelItem.trim()) return;

    try {
      // Envoi au Back-end
      const res = await api.post('/items', {
        intitule : intituleNouvelItem,
        description : descriptionNouvelItem,
        priorite: prioriteNouvelItem,
        deadline: deadlineNouvelItem || null,
        statut: 'a_faire' // Valeur par défaut
      });
      
      // Mise à jour de l'état local : on ajoute la nouvelle tâche créé à la liste
      setItems([...items, res.data]);
      // On vide les champs de saisie
      setIntituleNouvelItem('');
      setDescriptionNouvelItem('');
      setPrioriteNouvelItem(false);
      setDeadlineNouvelItem('');
    } catch (err) {
      console.error("Erreur lors de la création de la tâche :", err);
    }
  };

  // 3. ACTION : Modifier le statut ENUM (PUT) via le menu déroulant
  const handleStatusChange = async (id, nouveauStatut) => {
    try {
      await api.put(`/items/${id}`, { statut: nouveauStatut });
      
      // On met à jour l'état React pour répercuter le changement visuel
      setItems(items.map(item => item.id === id ? { ...item, statut: nouveauStatut } : item));
    } catch (err) {
      console.error("Erreur lors du changement de statut de la tâche :", err);
    }
  };

  const handlePriorityChange = async (id, nouvellePriorite) => {
    try {
      await api.put(`/items/${id}`, { priorite: nouvellePriorite });
      
      // On met à jour l'état React pour répercuter le changement visuel
      setItems(items.map(item => item.id === id ? { ...item, priorite: nouvellePriorite } : item));
    } catch (err) {
      console.error("Erreur lors du changement de statut de la tâche :", err);
    }
  };

  // 4. ACTION : Supprimer une tâche (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette tâche définitivement ?")) {
      try {
        await api.delete(`/items/${id}`);
        setItems(items.filter(item => item.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression de la tâche:", err);
      }
    }
  };

  // Fonction pour attribuer une couleur Bootstrap selon le statut
  const getBadgeColor = (statut) => {
    switch (statut) {
      case 'termine': return 'bg-success text-white';
      case 'en_cours': return 'bg-info text-dark';
      default: return 'bg-warning text-dark';
    }
  };

  const getBadgeColor2 = (priorite) => {
    return priorite
      ? 'bg-warning text-dark'
      : 'bg-success text-white';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) return <div className="text-center mt-5">Chargement de la To-do List...</div>;

  return (
    <div className="container mt-3 mb-5">
      <h3 className="mb-4">📝 To-do List Familiale</h3>

      {/* Formulaire d'ajout de tâche */}
      <form onSubmit={handleAddItem} className="card p-3 mb-4">
        <h5>Nouvelle tâche</h5>
        <div className="mb-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Intitulé de la tâche (ex: Révision voiture)"
            value={intituleNouvelItem}
            onChange={(e) => setIntituleNouvelItem(e.target.value)}
            required
          />
        </div>
        {/* Description */}
        <div className="mb-2">
          <textarea
            className="form-control form-control-sm"
            placeholder="Description (optionnelle)"
            value={descriptionNouvelItem}
            onChange={(e) => setDescriptionNouvelItem(e.target.value)}
            rows="2"
          />
        </div>
        <div className="row g-2 mb-3">
        {/* Deadline */}
        <div className="col-md-6">
          <label className="form-label small">
            Échéance
          </label>
          <input
            type="date"
            className="form-control form-control-sm"
            value={deadlineNouvelItem}
            onChange={(e) =>
              setDeadlineNouvelItem(e.target.value)
            }
          />
        </div>
        {/* Priorité */}
        <div className="col-md-6">

          <label className="form-label small">
            Priorité
          </label>

          <select
            className={`form-select form-select-sm ${
              prioriteNouvelItem
                ? 'bg-warning text-dark'
                : 'bg-success text-white'
            }`}
            value={prioriteNouvelItem ? '1' : '0'}
            onChange={(e) =>
              setPrioriteNouvelItem(e.target.value === '1')
            }
          >
            <option value="0">Standard</option>
            <option value="1">🔥 Urgent</option>
          </select>

        </div>
        </div>


        <button type="submit" className="btn btn-sm btn-primary w-100">Ajouter à la liste</button>
      </form>

      {/* Liste des tâches */}
      {items.length === 0 ? (
        <p className="text-muted text-center">Aucune tâche en cours pour la famille.</p>
      ) : (
        <div className="row g-3">
          {items.map(item => (
            <div key={item.id} className="col-12">
              <div className="card shadow-sm border-start border-2 border-primary">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div>
                    <h6 className={`mb-1 ${item.statut === 'termine' ? 'text-decoration-line-through text-muted' : ''}`}>
                      {item.intitule}
                    </h6>
                    {item.description && <p className="text-muted small mb-0">{item.description}</p>}
                    <div className="d-flex gap-2 flex-wrap">
                      {/* Priorité */}
                      <select
                        className={`form-select form-select-sm ${getBadgeColor2(item.priorite)}`}
                        value={item.priorite ? '1' : '0'}
                        onChange={(e) => handlePriorityChange(item.id, e.target.value === '1')}
                        style={{ width: '130px' }}
                      >
                      <option value="1" >🔥 Urgent</option>
                      <option value="0">Standard</option>
                      </select>
                      
                      {/* Deadline */}
                      {item.deadline && (
                        <span className="badge bg-light text-dark border">
                          ⏰ {formatDate(item.deadline)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2 justify-content-between">
                    {/* Le sélecteur de statut ENUM */}
                    <select
                      className={`form-select form-select-sm ${getBadgeColor(item.statut)} fw-bold`}
                      value={item.statut}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      style={{ width: '130px' }}
                    >
                      <option value="a_faire" className="bg-white text-dark">À faire</option>
                      <option value="en_cours" className="bg-white text-dark">En cours</option>
                      <option value="termine" className="bg-white text-dark">Terminé</option>
                    </select>

                    <button 
                      className="btn btn-sm btn-outline-danger border-0" 
                      onClick={() => handleDelete(item.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Items;