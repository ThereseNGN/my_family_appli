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

describe('API To-do List (Sécurisée)', () => {

  it('Devrait refuser l\'accès à la todo list si le Token est absent', async () => {
    const res = await request(app).get('/api/todos');
    
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Accès refusé : Aucun token fourni.');
  });

  it('Devrait autoriser l\'accès et renvoyer la liste (vide au départ) avec un Token valide', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${authToken}`); // Injection du Token dans le Header

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('TodoItems');
    expect(res.body.TodoItems).toEqual([]); // Tableau vide au début
  });

  it('Devrait permettre à l\'utilisateur de créer une tâche', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        intitule: 'Réserver billets de train',
        description: 'A-R Lyon/Paris',
        deadline: '2026-07-15',
        priorite: false,
        statut: 'a_faire'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('intitule', 'Réserver billets de train');
  });
});