import axios from 'axios';

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

export default api;