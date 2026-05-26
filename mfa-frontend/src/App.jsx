import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Events from './pages/Events';
import Articles from './pages/Articles';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      
        {/* Toutes les routes protégées par PrivateRoute seront des enfants du Layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="items" element={<Items />} />
            <Route path="articles" element={<Articles />} />
            <Route path="events" element={<Events />} />
          </Route>
        </Route>
      </Routes>
      {/* Configuration globale des notifications (en bas à droite) */}
      <ToastContainer position="bottom-right" autoClose={4000} />
    </Router>
  );
}

export default App;