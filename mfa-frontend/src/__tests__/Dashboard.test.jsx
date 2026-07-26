import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import Dashboard from '../pages/Dashboard';
import api from '../services/api';

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('Dashboard', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Mock par défaut
   */
  const mockApi = ({
    items = [],
    articles = [],
    events = [],
  } = {}) => {

    vi.mocked(api.get).mockImplementation((url) => {

      switch (url) {

        case '/items':
          return Promise.resolve({
            data: {
              TodoItems: items
            }
          });

        case '/articles':
          return Promise.resolve({
            data: {
              Articles: articles
            }
          });

        case '/events':
          return Promise.resolve({
            data: {
              Events: events
            }
          });

        default:
          return Promise.reject(new Error(`URL inconnue : ${url}`));
      }

    });

  };

  it('devrait afficher le titre du dashboard', async () => {

    mockApi();

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      await screen.findByRole('heading', {
        name: /tableau de bord familial/i
      })
    ).toBeInTheDocument();

  });

  it('devrait calculer correctement les indicateurs', async () => {

    mockApi({

      items: [
        { statut: 'encours', priorite: true },
        { statut: 'encours', priorite: false },
        { statut: 'encours', priorite: false },
        { statut: 'termine', priorite: false },
        { statut: 'encours', priorite: false },
      ],

      articles: [
        { statut: true },
        { statut: true },
        { statut: false },
      ],

      events: []

    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {

      expect(screen.getByText("4")).toBeInTheDocument(); // tâches actives

      expect(screen.getByText("2")).toBeInTheDocument(); // articles

      expect(
        screen.getByText(/1 tâche\(s\) avec priorité critique/i)
      ).toBeInTheDocument();

    });

  });

  it('devrait afficher le prochain rendez-vous', async () => {

    mockApi({

      events: [
        {
          intitule: 'Dentiste',
          dateDebut: '2099-12-31T10:00:00',
          lieu: 'Lyon'
        }
      ]

    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/Dentiste/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Lyon/i)
    ).toBeInTheDocument();

  });

  it('devrait afficher "Aucun événement à venir"', async () => {

    mockApi({
      events: []
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(
      await screen.findByText(/Aucun événement à venir/i)
    ).toBeInTheDocument();

  });

  it('devrait appeler les trois endpoints', async () => {

    mockApi();

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {

      expect(api.get).toHaveBeenCalledTimes(3);

      expect(api.get).toHaveBeenCalledWith('/items');
      expect(api.get).toHaveBeenCalledWith('/articles');
      expect(api.get).toHaveBeenCalledWith('/events');

    });

  });

});