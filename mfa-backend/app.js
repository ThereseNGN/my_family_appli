const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // Importe la BDD et les modèles associés
const authRoutes = require('./routes/authRoutes'); // Importe les routes
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes')
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // On autorise uniquement notre Front-end Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Les méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'] // Les en-têtes acceptés (dont notre token !)
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);

module.exports = app;