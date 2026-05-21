import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Todos from './pages/Todos';
import Layout from './components/Layout';


function App() {
  return (
    <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
        
          {/* Toutes les routes protégées par PrivateRoute seront des enfants du Layout */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<h2>Bienvenue sur votre Dashboard</h2>} />
              <Route path="/todos" element={<Todos />}></Route>
              <Route path="shopping" element={<h2>Page Courses (À coder)</h2>} />
              <Route path="calendar" element={<h2>Page Calendrier (À coder)</h2>} />
            </Route>
          </Route>
        </Routes>
    </Router>
  );
}

export default App;