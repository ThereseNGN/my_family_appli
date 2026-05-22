import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Article = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    // Dès que le composant est chargé, on appelle le back-end
    api.get('/shopping')
      .then(res => setArticles(res.data.Articles))
      .catch(err => console.error("Erreur chargement:", err));
  }, []);

  return (
    <div>
      <h3>Mes Articles</h3>
      <ul className="list-group">
        {articles.map(article => (
          <li key={article.id} className="list-group-item d-flex justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <span>
                {article.statut ? '🛒' : '✅'}
              </span>
              <span className={article.statut ? '' : 'text-decoration-line-through text-muted'}>
                {article.nom}
              </span>
            </div>
            <span
              className={`badge ${article.statut ? 'bg-warning text-dark' : 'bg-success'}`}>
             {article.statut ? 'À acheter' : 'En stock'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Article;