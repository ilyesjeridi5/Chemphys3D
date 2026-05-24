const sampleExperiences = [
  {
    id: 'exp-01',
    title: 'Réaction acide-base en 3D',
    category: 'Chimie organique',
    objective: 'Observer le transfert de protons entre un acide et une base dans un milieu aqueux.',
    summary: 'Visualisez en direct le pH, les ions et la dynamique moléculaire pendant une réaction acido-basique.',
    details: 'Cette expérience simule un acide fort réagissant avec une base forte, montrant les variations de concentration des espèces et la neutralisation graduelle.',
    difficulty: 'Intermédiaire',
  },
  {
    id: 'exp-02',
    title: 'Collision de particules et énergie cinétique',
    category: 'Physique mécanique',
    objective: 'Étudier les collisions élastiques et inélastiques entre deux corps en mouvement.',
    summary: 'Analysez les impacts et le transfert d’énergie à l’échelle de particules en 3D.',
    details: 'La simulation explique les lois de conservation de la quantité de mouvement et de l’énergie pour des corps de masses différentes.',
    difficulty: 'Débutant',
  },
  {
    id: 'exp-03',
    title: 'Synthèse d’une molécule en chaîne',
    category: 'Chimie organique',
    objective: 'Suivre la création d’une molécule polymère étape par étape.',
    summary: 'Découvrez comment les monomères se lient pour former des polymères et comment la structure influence les propriétés.',
    details: 'Le modèle met en évidence les fonctions chimiques réactives et les liaisons covalentes formées pendant la polymérisation.',
    difficulty: 'Avancé',
  },
  {
    id: 'exp-04',
    title: 'Oscillateur harmonique en 3D',
    category: 'Physique oscillatoire',
    objective: 'Explorer le mouvement harmonique simple et l’énergie potentielle d’un oscillateur.',
    summary: 'Visualisez les oscillations, l’énergie cinétique et l’énergie potentielle dans un système spring-mass.',
    details: 'Cette expérience montre le rôle de l’amortissement, de la fréquence naturelle et de l’amplitude dans un oscillateur harmonique.',
    difficulty: 'Intermédiaire',
  },
  {
    id: 'exp-05',
    title: 'Diffusion thermique dans un solide',
    category: 'Physique thermique',
    objective: 'Comprendre la propagation de la chaleur dans un matériau solide.',
    summary: 'Suivez visuellement la distribution de température et la conduction thermique en 3D.',
    details: 'La simulation illustre la loi de Fourier et l’évolution de gradients thermiques dans un bloc chauffé.',
    difficulty: 'Débutant',
  },
  {
    id: 'exp-06',
    title: 'Formation de liaison hydrogène',
    category: 'Chimie physique',
    objective: 'Observer l’apparition et l’effet des liaisons hydrogène sur la structure moléculaire.',
    summary: 'Découvrez pourquoi l’eau a des propriétés uniques grâce aux liaisons hydrogène entre molécules.',
    details: 'Cette simulation met en avant la polarité des molécules et les interactions dirigées entre atomes d’hydrogène et d’oxygène.',
    difficulty: 'Intermédiaire',
  },
];

const appState = {
  user: null,
  experiences: [...sampleExperiences],
  selectedExperience: null,
  adminAuthorized: false,
};

const userStorageKey = 'chemphys-user';
const libraryStorageKey = 'chemphys-experiences';

const elements = {
  signIn: document.getElementById('btn-signin'),
  heroTry: document.getElementById('hero-try'),
  heroLearn: document.getElementById('hero-learn'),
  libraryMeta: document.getElementById('library-meta'),
  experienceGrid: document.getElementById('experience-grid'),
  assistantOutput: document.getElementById('assistant-output'),
  assistantWelcome: document.getElementById('assistant-welcome'),
  btnActivate: document.getElementById('btn-activate'),
  activationCode: document.getElementById('activation-code'),
  btnAdminLogin: document.getElementById('btn-admin-login'),
  adminKey: document.getElementById('admin-key'),
  adminControls: document.getElementById('admin-controls'),
  adminLogin: document.getElementById('admin-login'),
  btnAddExperiment: document.getElementById('btn-add-experiment'),
  adminTitle: document.getElementById('admin-title'),
  adminCategory: document.getElementById('admin-category'),
  adminObjective: document.getElementById('admin-objective'),
  adminSummary: document.getElementById('admin-summary'),
  adminStatus: document.getElementById('admin-status'),
  modalLogin: document.getElementById('modal-login'),
  closeLogin: document.getElementById('close-login'),
  loginEmail: document.getElementById('login-email'),
  btnLoginSubmit: document.getElementById('btn-login-submit'),
};

function loadState() {
  const storedUser = localStorage.getItem(userStorageKey);
  const storedExperiences = localStorage.getItem(libraryStorageKey);
  if (storedUser) {
    appState.user = JSON.parse(storedUser);
  }
  if (storedExperiences) {
    appState.experiences = JSON.parse(storedExperiences);
  }
}

function saveState() {
  localStorage.setItem(userStorageKey, JSON.stringify(appState.user));
  localStorage.setItem(libraryStorageKey, JSON.stringify(appState.experiences));
}

function formatCount(count) {
  return count.toLocaleString('fr-FR');
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

function setUser(user) {
  appState.user = user;
  saveState();
  renderUserState();
  renderLibrary();
  renderAssistant();
}

function signOut() {
  appState.user = null;
  saveState();
  renderUserState();
  renderLibrary();
  renderAssistant();
}

function renderUserState() {
  if (appState.user) {
    elements.signIn.textContent = `Déconnecter (${appState.user.name})`;
    elements.signIn.classList.remove('btn-primary');
    elements.signIn.classList.add('btn-secondary');
  } else {
    elements.signIn.textContent = 'Se connecter';
    elements.signIn.classList.remove('btn-secondary');
    elements.signIn.classList.add('btn-primary');
  }
}

function renderLibrary() {
  const count = appState.experiences.length;
  const freeText = appState.user ? `${appState.user.freeRemaining} expériences gratuites restantes` : 'Connectez-vous pour démarrer 10 expériences gratuites';
  elements.libraryMeta.innerHTML = `<strong>${formatCount(count)}+ expériences</strong><br>${freeText}`;
  elements.experienceGrid.innerHTML = '';

  if (!appState.experiences.length) {
    elements.experienceGrid.innerHTML = '<div class="card"><p>Aucune expérience disponible pour le moment.</p></div>';
    return;
  }

  appState.experiences.forEach((experience) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <span class="tag">${experience.category}</span>
      <h3>${experience.title}</h3>
      <p>${experience.summary}</p>
      <div class="card-footer">
        <span class="card-label">${experience.difficulty}</span>
        <button class="btn btn-secondary" data-id="${experience.id}">Voir</button>
      </div>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => selectExperience(experience.id));
    elements.experienceGrid.appendChild(card);
  });
}

function renderAssistant() {
  if (!appState.user) {
    elements.assistantWelcome.classList.remove('hidden');
    elements.assistantOutput.classList.add('hidden');
    return;
  }
  elements.assistantWelcome.classList.add('hidden');
  elements.assistantOutput.classList.remove('hidden');
  if (!appState.selectedExperience) {
    elements.assistantOutput.innerHTML = '<h3>Choisissez une expérience dans la bibliothèque pour afficher l’analyse IA.</h3>';
    return;
  }
  const analysis = generateAssistantText(appState.selectedExperience);
  elements.assistantOutput.innerHTML = `
    <h3>${appState.selectedExperience.title}</h3>
    <p>${analysis}</p>
  `;
}

function selectExperience(id) {
  const experience = appState.experiences.find((exp) => exp.id === id);
  if (!experience) return;
  appState.selectedExperience = experience;
  if (!appState.user) {
    openLoginModal();
    return;
  }

  if (!appState.user.premium && appState.user.freeRemaining === 0) {
    alert('Vous avez utilisé vos 10 expériences gratuites. Activez Premium pour accéder à l’ensemble des expériences.');
    return;
  }

  if (!appState.user.premium) {
    appState.user.freeRemaining -= 1;
    updateUser(appState.user);
  }

  saveState();
  renderUserState();
  renderLibrary();
  renderAssistant();
  window.location.hash = '#assistant';
}

function generateAssistantText(experience) {
  const { title, objective, details } = experience;
  return `L'expérience « ${title} » permet de ${objective.toLowerCase()}. En tant que module IA, l’analyse met en lumière les éléments suivants : ${details} Les concepts clés incluent la modélisation 3D, l’analyse des forces et des réactions, et la relation entre les paramètres expérimentaux et les résultats observés.`;
}

function validateEmail(email) {
  return /^[\w.+\-]+@gmail\.com$/i.test(email.trim());
}

function openLoginModal() {
  elements.modalLogin.classList.remove('hidden');
  elements.loginEmail.value = '';
}

function closeLoginModal() {
  elements.modalLogin.classList.add('hidden');
}

async function fetchExperiences() {
  try {
    const response = await fetch('/api/experiences');
    if (!response.ok) {
      throw new Error('Erreur API');
    }
    const data = await response.json();
    appState.experiences = data.experiences || appState.experiences;
    saveState();
    renderLibrary();
  } catch (error) {
    console.error('Impossible de charger les expériences depuis le serveur.', error);
    renderLibrary();
  }
}

async function updateUser(user) {
  try {
    const response = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user }),
    });
    if (!response.ok) {
      console.warn('Mise à jour utilisateur échouée');
      return false;
    }
    const data = await response.json();
    appState.user = data.user;
    saveState();
    return true;
  } catch (error) {
    console.error('Erreur de mise à jour utilisateur', error);
    return false;
  }
}

async function handleLogin() {
  const email = elements.loginEmail.value.trim().toLowerCase();
  if (!validateEmail(email)) {
    alert('Utilisez une adresse Gmail valide pour la connexion Google simulée.');
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || 'Erreur de connexion.');
      return;
    }
    setUser(result.user);
    closeLoginModal();
  } catch (error) {
    console.error('Erreur de connexion', error);
    alert('Impossible de se connecter pour le moment.');
  }
}

async function handleActivation() {
  if (!appState.user) {
    alert('Connectez-vous avec Google avant d’activer Premium.');
    return;
  }

  const code = elements.activationCode.value.trim().toUpperCase();
  try {
    const response = await fetch('/api/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: appState.user.email, code }),
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || 'Code invalide.');
      return;
    }
    setUser(result.user);
    alert('Premium activé avec succès ! Vous avez maintenant accès à l’ensemble du catalogue.');
  } catch (error) {
    console.error('Erreur d’activation Premium', error);
    alert('Impossible d’activer Premium pour le moment.');
  }
}

async function handleAdminLogin() {
  const key = elements.adminKey.value.trim();
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key }),
    });
    const result = await response.json();
    if (!response.ok || !result.authorized) {
      elements.adminStatus.textContent = result.error || 'Clé admin incorrecte.';
      elements.adminStatus.style.color = '#ff6e6e';
      return;
    }
    appState.adminAuthorized = true;
    elements.adminLogin.classList.add('hidden');
    elements.adminControls.classList.remove('hidden');
    elements.adminStatus.textContent = 'Mode admin activé. Ajoutez de nouvelles expériences.';
    elements.adminStatus.style.color = '#5fe39b';
  } catch (error) {
    console.error('Erreur admin', error);
    alert('Impossible de vérifier la clé admin.');
  }
}

async function handleAddExperiment() {
  const title = elements.adminTitle.value.trim();
  const category = elements.adminCategory.value.trim();
  const objective = elements.adminObjective.value.trim();
  const summary = elements.adminSummary.value.trim();

  if (!title || !category || !objective || !summary) {
    alert('Veuillez compléter tous les champs pour ajouter une expérience.');
    return;
  }

  try {
    const response = await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: elements.adminKey.value.trim(),
        title,
        category,
        objective,
        summary,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      alert(result.error || 'Impossible d’ajouter l’expérience.');
      return;
    }
    appState.experiences.unshift(result.experience);
    saveState();
    renderLibrary();
    elements.adminTitle.value = '';
    elements.adminCategory.value = '';
    elements.adminObjective.value = '';
    elements.adminSummary.value = '';
    elements.adminStatus.textContent = 'Nouvelle expérience ajoutée avec succès !';
    elements.adminStatus.style.color = '#5fe39b';
  } catch (error) {
    console.error('Erreur ajout expérience', error);
    alert('Impossible d’ajouter l’expérience pour le moment.');
  }
}

function handleHeaderSignIn() {
  if (appState.user) {
    if (confirm('Voulez-vous vous déconnecter ?')) {
      signOut();
    }
    return;
  }
  openLoginModal();
}

function attachEvents() {
  elements.signIn.addEventListener('click', handleHeaderSignIn);
  elements.heroTry.addEventListener('click', openLoginModal);
  elements.heroLearn.addEventListener('click', () => window.location.hash = '#library');
  elements.btnLoginSubmit.addEventListener('click', handleLogin);
  elements.closeLogin.addEventListener('click', closeLoginModal);
  elements.btnActivate.addEventListener('click', handleActivation);
  elements.btnAdminLogin.addEventListener('click', handleAdminLogin);
  elements.btnAddExperiment.addEventListener('click', handleAddExperiment);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLoginModal();
  });
}

let scene = null;
let camera = null;
let renderer = null;
let rotatingMesh = null;

function init3D() {
  if (!window.THREE) {
    return;
  }

  const container = document.getElementById('hero-3d');
  if (!container) {
    return;
  }

  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x09101d);

  camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 1.5, 4);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x09101d, 0);
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambient);

  const point = new THREE.PointLight(0x6e8cff, 1.2);
  point.position.set(5, 5, 5);
  scene.add(point);

  const geometry = new THREE.TorusKnotGeometry(0.82, 0.26, 140, 24);
  const material = new THREE.MeshStandardMaterial({
    color: 0x6e8cff,
    emissive: 0x0b1a4c,
    metalness: 0.45,
    roughness: 0.25,
  });
  rotatingMesh = new THREE.Mesh(geometry, material);
  scene.add(rotatingMesh);

  const grid = new THREE.GridHelper(10, 10, 0x2d4e84, 0x0f1830);
  grid.position.y = -1.2;
  scene.add(grid);

  window.addEventListener('resize', onResize);
  animate3D();
}

function onResize() {
  const container = document.getElementById('hero-3d');
  if (!container || !camera || !renderer) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function animate3D() {
  if (!renderer || !rotatingMesh) return;
  rotatingMesh.rotation.x += 0.005;
  rotatingMesh.rotation.y += 0.008;
  rotatingMesh.rotation.z += 0.003;
  renderer.render(scene, camera);
  requestAnimationFrame(animate3D);
}

async function initApp() {
  loadState();
  renderUserState();
  await fetchExperiences();
  renderAssistant();
  attachEvents();
  init3D();
}

initApp();
