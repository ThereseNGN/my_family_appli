import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  
  // Si token présent, on affiche l'Outlet (le contenu), sinon on renvoie au Login
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;