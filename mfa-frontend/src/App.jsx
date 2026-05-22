import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Todos from './pages/Todos';
import Event from './pages/Event';
import Article from './pages/Shopping';
import Layout from './components/Layout';

function App() {
  return (
    <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
        
          {/* Toutes les routes protégées par PrivateRoute seront des enfants du Layout */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/todos" />} />
              <Route path="todos" element={<Todos />} />
              <Route path="shopping" element={<Article />} />
              <Route path="event" element={<Event />} />
            </Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;