const request = require('supertest');
const app = require('../app');
const { sequelize, User, Family } = require('../models');

// SEEDING AUTOMATISÉ : Avant tous les tests, on recrée les tables à zéro
beforeAll(async () => {
  await sequelize.sync({ force: true }); // force: true vide complètement la base de test
});

// NETTOYAGE : Après tous les tests, on coupe la connexion à la BDD
afterAll(async () => {
  await sequelize.close();
});

describe('API Authentification', () => {
  
  it('Devrait créer une nouvelle famille et un utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'TestFamily',
        prenom: 'Admin',
        email: 'admin@test.com',
        password: 'Password123!',
        role: 'admin'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Famille et utilisateur créés avec succès !');
    expect(res.body.user).toHaveProperty('email', 'admin@test.com');
  });

  it('Devrait refuser une inscription avec un email non valide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'FailFamily',
        prenom: 'Fail',
        email: 'mauvais-email',
        password: 'Password123!',
        role: 'user'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});