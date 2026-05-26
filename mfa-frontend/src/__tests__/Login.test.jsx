import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

describe('Composant Login', () => {
  
  it('doit afficher le titre et les champs du formulaire', () => {
    // 1. On "rend" le composant dans le faux navigateur (jsdom)
    // On doit l'envelopper dans BrowserRouter car Login utilise des <Link> et useNavigate
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // 2. On vérifie que le titre <h2> "Connexion" est bien généré
    const titre = screen.getByRole('heading', { level: 2 });
    expect(titre.textContent).toBe('Connexion');

    // 3. On vérifie que les champs Email et Mot de passe existent
    const inputEmail = screen.getByLabelText(/email/i);
    expect(inputEmail).toBeInTheDocument();

    const inputPassword = screen.getByLabelText(/mot de passe/i);
    expect(inputPassword).toBeInTheDocument();

    // 4. On vérifie que le bouton de soumission est présent
    const boutonSubmit = screen.getByRole('button', { name: /se connecter/i });
    expect(boutonSubmit).toBeInTheDocument();


    // 5. On vérifie que le lien vers l'enregistrement existe
    const linkRegister = screen.getByRole('link', { name : /créez votre espace ici/i });
    expect(linkRegister).toBeInTheDocument();
    expect(linkRegister).toHaveAttribute('href', '/register');
  });

});