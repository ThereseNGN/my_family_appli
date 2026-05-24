import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [isJoining, setIsJoining] = useState(false); // Mode bascule
  const [nomFamille, setNomFamille] = useState('');
  const [familyId, setFamilyId] = useState(''); // Pour le cas d'un membre invité
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    
    // Payload dynamique envoyé à l'API
    const payload = {
      prenom,
      email,
      password,
      role,
      // Si on rejoint, on passe le familyId, sinon on passe le nom pour créer la famille
      ...(isJoining ? { familyId: parseInt(familyId) } : { nom: nomFamille })
    };

    try {
      // Appel à API Back-end
      await api.post('/auth/register', payload);

      setSucces(true);
      // Redirection vers le login après 4 secondes pour laisser le temps de lire
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (err) {
      setErreur(err.response?.data?.message || "Une erreur est survenue lors de l'inscription.");
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6 col-lg-4">
        <h2 className="text-center mb-4">Rejoindre MyFamilyAppli</h2>

        {erreur && <div className="alert alert-danger">{erreur}</div>}
        {succes && (
          <div className="alert alert-success">
            🎉 Compte créé avec succès ! Redirection vers la page de connexion...
          </div>
        )}

        {/* Onglets de sélection de mode*/}
        <div className="btn-group w-100 mb-4 shadow-sm">
          <button 
            className={`btn btn-${!isJoining ? 'primary' : 'outline-primary'}`}
            onClick={() => { setIsJoining(false); setErreur(''); }}
          >
            Nouvelle Famille
          </button>
          <button 
            className={`btn btn-${isJoining ? 'primary' : 'outline-primary'}`}
            onClick={() => { setIsJoining(true); setErreur(''); }}
          >
            Rejoindre un espace
          </button>
        </div>

        <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-3">
          {!isJoining ? (
            <div className="mb-3">
                <label className="form-label">Nom de la famille</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Legrand"
                  value={nomFamille}
                  onChange={(e) => setNomFamille(e.target.value)}
                  required={!isJoining}
                />
            </div>
          ) : (
            <div className="mb-3">
              <label className="form-label">Identifiant Numérique Famille (ID)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ex: 4"
                value={familyId}
                onChange={(e) => setFamilyId(e.target.value)}
                required={isJoining}
              />
            </div>
          )}
            <div className="mb-3">
                <label className="form-label">Votre Prénom</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Jean"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Votre Rôle</label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="admin ou user"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Adresse Email</label>
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
            <button type="submit" className="btn btn-success w-100" disabled={succes}>
                {!isJoining ? "Créer l'espace familial" : "Valider mon inscription"}
            </button>
        </form>

        <div className="text-center">
          <p className="small text-muted">
            Déjà membre ? <Link to="/login">Connectez-vous ici</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;