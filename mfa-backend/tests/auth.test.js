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

  it('Devrait refuser une inscription avec un mot de passe trop court', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'FailFamily',
        prenom: 'Fail',
        email: 'short.password@test.com',
        password: '123!',
        role: 'user'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
  
  it('Devrait refuser une inscription avec un email non valide', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'FailFamily',
        prenom: 'Fail',
        email: 'invalid-email',
        password: 'Password123!',
        role: 'user'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
  });
});

describe('API Connexion', () => {
  
  it('Devrait connecter un utilisateur et renvoyer un JWT', async () => {
    // Préalable : Création de l'utilisateur
    await request(app)
      .post('/api/auth/register')
      .send({
        nom: 'TestFamily',
        prenom: 'Admin',
        email: 'admin@test.com',
        password: 'Password123!',
        role: 'admin'
    });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Password123!'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('Devrait refuser la connexion avec un mot de passe incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'WrongPassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Identifiants incorrects.');
  });

  it('Devrait neutraliser les tentatives d\'injection SQL à la connexion', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: "' OR '1'='1", password: "' OR '1'='1" });

    expect(res.statusCode).toEqual(400);
    expect(res.body).not.toHaveProperty('token');
  });
});