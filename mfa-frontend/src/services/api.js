import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL du serveur Node.js/Docker
});

// MIDDLEWARE FRONT : Intercepte chaque requête sortante pour lui greffer le Token s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Le navigateur cherchera le badge ici
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. Intercepteur de RÉPONSE : Gère les erreurs entrantes de manière globale
api.interceptors.response.use(
  (response) => {
    // Si la requête réussit (code 2xx), on laisse passer la réponse
    return response; 
  },
  (error) => {
    // Si le serveur est totalement injoignable (éteint ou planté)
    if (!error.response) {
      toast.error("Impossible de contacter le serveur. Veuillez vérifier votre connexion.");
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Gestion des codes d'erreur HTTP classiques
    switch (status) {
      case 401:
        // 401 : Token expiré ou absent
        toast.warning("Votre session a expiré ou est invalide. Redirection en cours...");
        localStorage.removeItem('token');
        // Redirection après 4sec vers le login
        setTimeout(() => {
          window.location.href = '/login'; 
        }, 3000);  
        break;
      
      case 403:
        toast.error("Vous n'avez pas l'autorisation d'effectuer cette action.");
        break;
        
      case 404:
        // Optionnel : ne rien faire globalement pour les 404, ou afficher une info
        break;

      case 500:
        toast.error("Oups ! Une erreur interne du serveur est survenue.");
        break;

      default:
        // Affiche le message d'erreur renvoyé par votre back-end (ex: "Champs invalides")
        if (data && data.message) {
          toast.error(data.message);
        }
        break;
    }

    return Promise.reject(error);
  }
);

export default api;