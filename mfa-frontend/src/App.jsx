import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Items from './pages/Items';
import Events from './pages/Events';
import Articles from './pages/Articles';
import Layout from './components/Layout';

function App() {
  return (
    <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
        
          {/* Toutes les routes protégées par PrivateRoute seront des enfants du Layout */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/items" />} />
              <Route path="items" element={<Items />} />
              <Route path="articles" element={<Articles />} />
              <Route path="events" element={<Events />} />
            </Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;