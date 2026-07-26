# 🏠 MyFamilyAppli - Organisateur Familial Centralisé

Ce projet a été réalisé dans le cadre de la certification RNCP n°37873 de Niveau 6 : **Concepteur Développeur d'Applications**
Il s'agit d'une application Web (Single Page Application) conçue pour faciliter l'organisation quotidienne des familles grâce à des listes partagées et un calendrier commun.

## ✨ Fonctionnalités Principales

- **🔐 Authentification & Sécurité :** Inscription, connexion, et gestion sécurisée par jetons (JWT). Possibilité de créer une famille ou de rejoindre une famille existante via l'Id Famille.
- **📊 Tableau de Bord (Dashboard) :** Vue d'ensemble des indicateurs clés (tâches actives, urgences, courses restantes, prochain rendez-vous).
- **📝 To-do List Interactive :** Création de tâches, assignation de priorités, deadlines et gestion des statuts (À faire, En cours, Terminé).
- **🛒 Liste de Courses :** Ajout rapide d'articles et basculement instantané du statut (À acheter / En stock).
- **📅 Calendrier Partagé :** Interface graphique (FullCalendar) pour planifier, visualiser et gérer les évènements familiaux.

## 🛠️ Stack Technique

Cette application repose sur une architecture découplée (séparation du Front-end et du Back-end) :

**Front-end :**

- React (via Vite)
- React Router DOM (Routage sécurisé)
- Axios (Intercepteurs HTTP)
- Bootstrap & React Toastify (UI/UX)
- Vitest & React Testing Library (Tests unitaires)

**Back-end :**

- Node.js & Express
- Sequelize (ORM)
- Bcryptjs & JsonWebToken (Sécurité)
- Jest & Supertest (Tests d'intégration API)

**Base de Données & DevOps :**

- MySQL 8.0
- Docker & Docker Compose (Conteneurisation totale)
- Nginx (Serveur web de production Front-end)

## 🚀 Installation & Lancement (Déploiement Docker)

L'application est entièrement conteneurisée pour garantir un déploiement fluide sur n'importe quel environnement.

### Prérequis

- Avoir [Docker](https://www.docker.com/) et Docker Compose installés sur votre machine.
- Avoir les ports `5173`, `5000` et `3306` libres sur votre machine hôte.

### Démarrage rapide

1. Clonez ce dépôt sur votre machine locale.
2. Ouvrez un terminal à la racine du projet (où se trouve le fichier `docker-compose.yml`).
3. Lancez la commande suivante :
   ```bash
   docker-compose up --build -d
   Une fois l'orchestration terminée, l'application MyFamilyAppli est accessible via un navigateur : http://localhost:5173

4. Pour stopper les conteneurs (sans perte de données car elles sont persistées dans un volume Docker) :
   ```bash
   docker-compose down
   ```

#### Tests automatisés

1. Tests Back-end (Jest) :
   ```bash
   cd mfa-backend
   npm test
   ```
2. Tests Front-end (Vitest) :
   ```bash
   cd mfa-frontend
   npm test
   ```

##### Historique des versions

| Version | Date       | Auteur         | Modifications |
| ------- | ---------- | -------------- | ------------- |
| 1.0     | 2026-05-26 | Thérèse Nguyen | Création      |
