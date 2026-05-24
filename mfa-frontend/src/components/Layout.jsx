import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-dark bg-primary p-3">
        <span className="navbar-brand">MyFamilyAppli</span>
        <button className="btn btn-outline-light" onClick={() => navigate('/')}>🏠 Tableau de bord</button>
        <button className="btn btn-outline-light" onClick={handleLogout}>Déconnexion</button>
      </nav>
      
      <main className="container mt-4">
        {/* Outlet = afficher la page enfant (Items, Articles, etc.) */}
        <Outlet />
      </main>
      
      {/* Footer navigation simple */}
      <footer className="fixed-bottom bg-light p-2 mt-3 border-top text-center d-flex justify-content-around">
        <button className="btn btn-link text-decoration-none" onClick={() => navigate('/items')}>📝 Todo List</button>
        <button className="btn btn-link text-decoration-none" onClick={() => navigate('/articles')}>🛒 Courses</button>
        <button className="btn btn-link text-decoration-none" onClick={() => navigate('/events')}>📅 Calendrier</button>
      </footer>
    </div>
  );
};

export default Layout;