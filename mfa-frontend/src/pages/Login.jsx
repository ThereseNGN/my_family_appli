import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  // Déclaration des états (State) pour stocker ce que l'utilisateur tape
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  
  // Hook de React Router pour forcer le changement de page
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement classique de la page web
    try {
      // Appel au Back-end
      const reponse = await api.post('/auth/login', { email, password });
      
      // Si succès : on sauvegarde le Token dans le coffre-fort du navigateur
      localStorage.setItem('token', reponse.data.token);
      
      // On redirige vers le futur tableau de bord
      navigate('/dashboard');
    } catch (err) {
      setErreur("Identifiants incorrects. Veuillez réessayer.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Connexion</h2>
        
        {/* Affichage conditionnel de l'erreur */}
        {erreur && <div className="alert alert-danger">{erreur}</div>}
        
        <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;