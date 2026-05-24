const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const EXPERIENCES_FILE = path.join(DATA_DIR, 'experiences.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ADMIN_KEY = 'chemphys-admin';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
  if (!fs.existsSync(EXPERIENCES_FILE)) {
    fs.writeFileSync(EXPERIENCES_FILE, JSON.stringify([], null, 2), 'utf8');
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content || '[]');
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function buildActivationCode(email) {
  const normalized = email.trim().toLowerCase();
  const secret = 'ChemPhys3D2026-Activation';
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i) + secret.charCodeAt(i % secret.length)) >>> 0;
  }
  const code = hash.toString(36).toUpperCase().slice(0, 6).padStart(6, '0');
  return `CP3D-${code}`;
}

function getUserByEmail(email) {
  const users = readJson(USERS_FILE);
  return users.find((user) => user.email === email) || null;
}

function saveUser(user) {
  const users = readJson(USERS_FILE);
  const index = users.findIndex((item) => item.email === user.email);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  writeJson(USERS_FILE, users);
}

app.get('/api/experiences', (req, res) => {
  const experiences = readJson(EXPERIENCES_FILE);
  res.json({ experiences });
});

app.post('/api/login', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  if (!email || !/^([\w.+\-]+)@gmail\.com$/i.test(email)) {
    return res.status(400).json({ error: 'Adresse Gmail valide requise.' });
  }

  let user = getUserByEmail(email);
  if (!user) {
    user = {
      name: email.split('@')[0],
      email,
      freeRemaining: 10,
      premium: false,
      activatedCode: null,
      signedAt: new Date().toISOString(),
    };
    saveUser(user);
  }

  res.json({ user });
});

app.post('/api/activate', (req, res) => {
  const email = (req.body.email || '').trim().toLowerCase();
  const code = (req.body.code || '').trim().toUpperCase();
  if (!email || !code) {
    return res.status(400).json({ error: 'Email et code sont requis.' });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur introuvable. Connectez-vous d’abord.' });
  }

  const expected = buildActivationCode(email);
  if (code === expected) {
    user.premium = true;
    user.activatedCode = code;
    saveUser(user);
    return res.json({ success: true, user });
  }

  res.status(400).json({ error: 'Code Premium invalide.' });
});

app.post('/api/user/update', (req, res) => {
  const user = req.body.user;
  if (!user || !user.email) {
    return res.status(400).json({ error: 'Données utilisateur invalides.' });
  }
  saveUser(user);
  res.json({ success: true, user });
});

app.post('/api/admin/login', (req, res) => {
  const key = (req.body.key || '').trim();
  if (key === ADMIN_KEY) {
    return res.json({ authorized: true });
  }
  return res.status(403).json({ authorized: false, error: 'Clé admin invalide.' });
});

app.post('/api/admin/experiences', (req, res) => {
  const { key, title, category, objective, summary } = req.body;
  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: 'Accès admin refusé.' });
  }
  if (!title || !category || !objective || !summary) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  const experiences = readJson(EXPERIENCES_FILE);
  const newExperience = {
    id: `exp-${Date.now()}`,
    title,
    category,
    objective,
    summary,
    details: `${summary} Cette expérience a été ajoutée par l’administrateur et enrichit la bibliothèque 3D de ChemPhys 3D.`,
    difficulty: 'Intermédiaire',
  };
  experiences.unshift(newExperience);
  writeJson(EXPERIENCES_FILE, experiences);
  res.json({ success: true, experience: newExperience });
});

ensureDataFiles();

app.listen(PORT, () => {
  console.log(`ChemPhys 3D server running on http://localhost:${PORT}`);
});
