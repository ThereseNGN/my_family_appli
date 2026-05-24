import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);  

  // états pour le formulaire de création
  const [nomNouvelArticle, setNomNouvelArticle] = useState('');

  //1. Chargement initial de la liste de courses
  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/articles')
      .then(res => {
        setArticles(res.data.Articles);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement de la liste des courses :", err);
        setLoading(false);
      }); 
  }, []);

  // 2. ACTION : Créer un article (POST)
  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!nomNouvelArticle.trim()) return;

    try {
      // Envoi au Back-end (statut par défaut à true = "À acheter")
      const res = await api.post('/articles', { 
        nom: nomNouvelArticle,
        statut: true 
      });
      
      // Mise à jour de l'état local : on ajoute le nouvel article créé à la liste
      setArticles([...articles, res.data]);
      setNomNouvelArticle(''); // On vide le champs de saisie
    } catch (err) {
      console.error("Erreur lors de la création de l'article :", err);
    }
  };

  // 3. ACTION : Inverser le statut (A acheter <-> En stock) (PUT)
  const handleToggleStatut = async (id, currentStatut) => {
    try {
      // envoi de la modification au Back-end (PUT /api/articles/:id)
      const res = await api.put(`/articles/${id}`, { statut: !currentStatut });
      
      // mise à jour de l'état local React pour éviter de recharger la page
      setArticles(articles.map(art => art.id === id ? { ...art, statut: !currentStatut } : art));
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'article :", err);
    }
  };

  // 4. ACTION : Supprimer l'article (DELETE)
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
      try {
        await api.delete(`/articles/${id}`);
        // On filtre l'état local pour enlever l'article supprimé
        setArticles(articles.filter(art => art.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression de l'article :", err);
      }
    }
  };

  if (loading) return <div className="text-center mt-5">Chargement de la liste de courses...</div>;

  return (
    <div className="container mt-3">
      <h3 className="mb-4">🛒 Liste de courses de la famille</h3>

      {/* Formulaire d'ajout Mobile-First */}
      <form onSubmit={handleAddArticle} className="input-group mb-4 shadow-sm">
        <input
          type="text"
          className="form-control"
          placeholder="Ex: Lait, Pommes..."
          value={nomNouvelArticle}
          onChange={(e) => setNomNouvelArticle(e.target.value)}
          maxLength={50}
        />
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>

      {articles.length === 0 ? (
        <p className="text-muted">Aucun article dans la liste.</p>
      ) : (
        <ul className="list-group mb-5">
          {articles.map(article => (
            <li key={article.id} className="list-group-item d-flex justify-content-between align-items-center animate__animated animate__fadeIn">
              <div 
                className="d-flex align-items-center gap-3" 
                onClick={() => handleToggleStatut(article.id, article.statut)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
              >
                <span className="fs-4">{article.statut ? '⬜' : '✅'}</span>
                <span className={article.statut ? 'fw-bold' : 'text-decoration-line-through text-muted'}>
                  {article.nom}
                </span>
              </div>
              
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm" onClick={() => handleDelete(article.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Articles;