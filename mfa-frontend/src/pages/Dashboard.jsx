import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    itemsCount: 0,
    urgentitemsCount: 0,
    articlesCount: 0,
    nextEvent: null
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Exécution de requêtes parallèles (Pattern Pro Promise.all)
    Promise.all([
      api.get('/items'),
      api.get('/articles'),
      api.get('/events')
    ])
    .then(([itemsRes, articlesRes, eventsRes]) => {
      const items = itemsRes.data.TodoItems || [];
      const articles = articlesRes.data.Articles || [];
      const events = eventsRes.data.Events || [];

      // 1. Filtrage des tâches actives (non terminées)
      const activeItems = items.filter(i => i.statut !== 'termine');
      const urgentItems = activeItems.filter(i => i.priorite === true);

      // 2. Filtrage des articles restant à acheter
      const activeArticles = articles.filter(a => a.statut === true);

      // 3. Calcul du prochain événement dans le futur
      const maintenant = new Date();
      const futursEvents = events
        .filter(e => new Date(e.dateDebut) >= maintenant)
        .sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut)); // Tri chronologique
        // attention ! fonction filter retourne un TABLEAU
      setStats({
        itemsCount: activeItems.length,
        urgentItemsCount: urgentItems.length,
        articlesCount: activeArticles.length,
        nextEvent: futursEvents.length > 0 ? futursEvents[0] : null 
      });
      setLoading(false);
    })
    .catch(err => {
      console.error("Erreur lors de l'agrégation du Dashboard :", err);
      setLoading(false);
    });
  }, []);

  // Fonction utilitaire pour formater la date du prochain rendez-vous
  const formatProchainEvent = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="text-center mt-5">Calcul des indicateurs familiaux...</div>;

  return (
    <div className="container mt-3 mb-5">
      <h3 className="mb-4">🏠 Tableau de bord familial</h3>
      <p className="text-muted">Ravi de vous revoir ! Voici un aperçu de la maison aujourd'hui :</p>

      <div className="row g-3 mt-2">
        {/* Carte To-do List */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-start border-4 border-warning" style={{ cursor: 'pointer' }} onClick={() => navigate('/items')}>
            <div className="card-body">
              <h5 className="card-title text-muted small uppercase fw-bold">📝 Tâches en cours</h5>
              <div className="d-flex align-items-baseline gap-2 mt-2">
                <span className="fs-1 fw-bold text-dark">{stats.itemsCount}</span>
                <span className="text-muted small">actives</span>
              </div>
              {stats.urgentItemsCount > 0 && (
                <div className="alert alert-danger py-1 px-2 mt-2 small mb-0">
                  ⚠️ {stats.urgentItemsCount} tâche(s) avec priorité critique !
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Carte Liste de courses */}
        <div className="col-md-6 col-lg-4">
          <div className="card h-100 shadow-sm border-start border-4 border-primary" style={{ cursor: 'pointer' }} onClick={() => navigate('/articles')}>
            <div className="card-body">
              <h5 className="card-title text-muted small uppercase fw-bold">🛒 Courses à faire</h5>
              <div className="d-flex align-items-baseline gap-2 mt-2">
                <span className="fs-1 fw-bold text-dark">{stats.articlesCount}</span>
                <span className="text-muted small">articles à acheter</span>
              </div>
              <p className="text-primary small mt-2 mb-0">Ouvrir la liste ➔</p>
            </div>
          </div>
        </div>

        {/* Carte Prochain Rendez-vous */}
        <div className="col-md-12 col-lg-4">
          <div className="card h-100 shadow-sm border-start border-4 border-success" style={{ cursor: 'pointer' }} onClick={() => navigate('/events')}>
            <div className="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 className="card-title text-muted small uppercase fw-bold">📅 Prochain rendez-vous</h5>
                {stats.nextEvent ? (
                  <div className="mt-3">
                    <h6 className="mb-1 text-success fw-bold">{stats.nextEvent.intitule}</h6>
                    <span className="badge bg-light text-dark border small">
                      🗓️ {formatProchainEvent(stats.nextEvent.dateDebut)}
                    </span>
                    {stats.nextEvent.lieu && (
                      <p className="text-muted small mb-0 mt-1">📍 {stats.nextEvent.lieu}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted small mt-3 mb-0">Aucun événement à venir.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;