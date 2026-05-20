const express = require('express');
const { sequelize } = require('./models'); // Importe la BDD et les modèles associés
const authRoutes = require('./routes/authRoutes'); // Importe les routes
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const shoppingRoutes = require('./routes/shoppingRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/shopping', shoppingRoutes);

module.exports = app;