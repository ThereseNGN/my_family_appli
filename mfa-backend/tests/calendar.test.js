const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');

let authToken; // Cette variable va stocker le token pour nos tests

beforeAll(async () => {
  // 1. Réinitialisation complète de la base de test
  await sequelize.sync({ force: true });
  // 2. SEEDING TECHNIQUE : On crée un utilisateur de test pour générer un Token
  await request(app)
    .post('/api/auth/register')
    .send({
      nom: 'Legrand',
      prenom: 'Jean',
      email: 'jean@legrand.com',
      password: 'SuperPassword123!',
      role: 'admin'
    });
  // 3. On connecte cet utilisateur pour récupérer le Token JWT
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'jean@legrand.com',
      password: 'SuperPassword123!'
    });

  authToken = loginRes.body.token; // Le token est sauvegardé pour toute la suite
});

afterAll(async () => {
  await sequelize.close();
});

describe('API Calendar', () => {
    it('Devrait rejeter un événement dont la date de fin est antérieure à la date de début', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        intitule: 'Rendez-vous médical',
        dateDebut: '2026-09-10T14:00:00Z',
        dateFin: '2026-09-10T10:00:00Z' // Incohérence temporelle
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors[0].msg).toBe('La date de fin ne peut pas être antérieure à la date de début.');
  });
});