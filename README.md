# Chemphys3D

ChemPhys 3D est une plateforme révolutionnaire de visualisation scientifique en 3D, conçue pour transformer l'apprentissage de la chimie et de la physique en une expérience immersive et interactive.

## Ce qui est inclus

- Site web complet avec une page d'accueil, une bibliothèque d'expériences, un assistant IA, une offre Premium et un panneau d'administration.
- Backend Node.js + Express pour servir les données et gérer l'activation Premium.
- Simulation de connexion Google Sign-In via saisie d'adresse Gmail.
- Système d'activation Premium par code unique lié à l'adresse Gmail.
- Panneau d'administration sécurisé par clé et gestion d'ajout d'expériences.
- Visualisation 3D intégrée dans le header via Three.js.

## Fichiers principaux

- `index.html` : structure de la page et sections principales.
- `styles.css` : styles modernes et responsives pour le site.
- `app.js` : logique frontend, connexion, bibliothèque, assistant IA, activation Premium, administration et visualisation 3D.
- `server.js` : backend Express pour les API de connexion, d'activation Premium et d'administration.
- `package.json` : dépendances et scripts du projet.
- `data/experiences.json` : catalogue initial d'expériences.
- `data/users.json` : stockage local des utilisateurs pour la démo.

## Installation et exécution

```bash
cd /workspaces/Chemphys3D
npm install
npm start
```

Puis ouvrez `http://127.0.0.1:3000`.

## Utilisation

- Connexion Gmail : utilisez une adresse `@gmail.com` pour simuler Google Sign-In.
- Expériences gratuites : chaque utilisateur démarre avec 10 essais gratuits.
- Activation Premium : utilisez le code unique généré à partir de l'adresse Gmail.
- Administration : utilisez la clé `chemphys-admin` pour ouvrir le panneau et ajouter de nouvelles expériences.

## Notes techniques

- Le backend enregistre les utilisateurs dans `data/users.json` et la bibliothèque dans `data/experiences.json`.
- La visualisation 3D est fournie par Three.js via CDN dans `index.html`.
- Le code Premium est dérivé de l'adresse Gmail pour garantir un lien stable entre compte et activation.

## Améliorations possibles

- Intégration Google Sign-In réelle avec OAuth et client ID.
- Base de données persistante (MongoDB, PostgreSQL, SQLite).
- API IA réelle pour générer des explications dynamiques en temps réel.
- Authentification utilisateur sécurisée et sessions backend.
