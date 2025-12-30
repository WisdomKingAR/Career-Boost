// CareerBoost Main Application
// Handles UI interactions, page navigation, and data rendering

// State management
const state = {
  currentPage: 'dashboard',
  user: null,
  theme: localStorage.getItem('theme') || 'dark',
  certificates: [],
  internships: [],
  hackathons: [],
  news: [],
  tools: [],
  projects: []
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  setupEventListeners();
  checkAuth();
  loadDashboard();
  initializeLenis();
});

// Lenis Smooth Scrolling
function initializeLenis() {
  const lenis = new Lenis({
    autoRaf: true,
  });
  
  // Optional: Listen for scroll events
  // lenis.on('scroll', (e) => {
  //   console.log(e);
  // });
}

// Theme management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeIcon = document.querySelector('.theme-icon');
  themeIcon.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

// Auth management
function checkAuth() {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Verify token (simplified for demo, ideally call verify endpoint)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      state.user = user;
      updateAuthUI();
    } else {
      // Token implies user should be there, but if not, fetch or logout
      api.getProfile().then(data => {
        state.user = data.user;
        updateAuthUI();
      }).catch(() => {
        api.logout();
        updateAuthUI();
      });
    }
  }
}

function updateAuthUI() {
  const navActions = document.querySelector('.nav-actions');
  // Keep theme toggle
  const themeToggle = navActions.querySelector('.theme-toggle');

  // Clear other buttons
  navActions.innerHTML = '';
  navActions.appendChild(themeToggle);

  if (state.user) {
    // User is logged in
    const profileBtn = document.createElement('button');
    profileBtn.className = 'btn btn-secondary';
    profileBtn.textContent = `👤 ${state.user.username}`;
    profileBtn.onclick = () => showToast(`Welcome back, ${state.user.name}!`);

    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-primary';
    logoutBtn.textContent = 'Logout';
    logoutBtn.onclick = handleLogout;

    navActions.appendChild(profileBtn);
    navActions.appendChild(logoutBtn);
  } else {
    // User is logged out
    const loginBtn = document.createElement('button');
    loginBtn.className = 'btn btn-primary';
    loginBtn.id = 'loginBtn';
    loginBtn.textContent = 'Login';
    loginBtn.addEventListener('click', () => openModal('loginModal'));

    const signupBtn = document.createElement('button');
    signupBtn.className = 'btn btn-secondary';
    signupBtn.id = 'signupBtn';
    signupBtn.textContent = 'Sign Up';
    signupBtn.addEventListener('click', () => openModal('signupModal'));

    navActions.appendChild(loginBtn);
    navActions.appendChild(signupBtn);
  }
}

function handleLogout() {
  api.logout();
  state.user = null;
  localStorage.removeItem('user');
  updateAuthUI();
  showToast('Logged out successfully', 'success');
}

// Modal management
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Event listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Mobile menu
  document.getElementById('mobileMenuToggle').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('active');
  });

  // Navigation
  document.querySelectorAll('[data-page]').forEach(element => {
    element.addEventListener('click', (e) => {
      e.preventDefault();
      const page = element.getAttribute('data-page');
      navigateToPage(page);
    });
  });

  // Modal triggers (initial)
  document.getElementById('loginBtn')?.addEventListener('click', () => openModal('loginModal'));
  document.getElementById('signupBtn')?.addEventListener('click', () => openModal('signupModal'));

  // Close modals
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      closeModal(modal.id);
    });
  });

  // Close modal on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target.id);
    }
  });

  // Auth forms
  document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const data = await api.login(email, password);
      state.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      updateAuthUI();
      closeModal('loginModal');
      showToast('Login successful!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  document.getElementById('signupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
      const data = await api.register({ name, username, email, password });
      state.user = data.user;
      localStorage.setItem('user', JSON.stringify(data.user));
      updateAuthUI();
      closeModal('signupModal');
      showToast('Registration successful!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  // Switch auth modes
  document.getElementById('switchToSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('loginModal');
    openModal('signupModal');
  });

  document.getElementById('switchToLogin')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal('signupModal');
    openModal('loginModal');
  });

  // Search buttons
  document.getElementById('certSearchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('certSearchInput').value;
    searchCertificates(query);
  });

  document.getElementById('internshipSearchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('internshipSearchInput').value;
    searchInternships(query);
  });

  // Filters
  document.getElementById('certLevelFilter')?.addEventListener('change', (e) => {
    loadCertificates({ level: e.target.value });
  });

  document.getElementById('certCostFilter')?.addEventListener('change', (e) => {
    loadCertificates({ maxCost: e.target.value });
  });

  document.getElementById('internshipRemoteFilter')?.addEventListener('change', (e) => {
    loadInternships({ remote: e.target.value });
  });

  document.getElementById('internshipStipendFilter')?.addEventListener('change', (e) => {
    loadInternships({ minStipend: e.target.value });
  });

  // News category filters
  document.querySelectorAll('.filter-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn[data-category]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const category = e.target.getAttribute('data-category');
      loadNews(category);
    });
  });

  // Project difficulty filters
  document.querySelectorAll('.filter-btn[data-difficulty]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn[data-difficulty]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const difficulty = e.target.getAttribute('data-difficulty');
      loadProjects(difficulty);
    });
  });
}

// Page navigation
function navigateToPage(pageName) {
  state.currentPage = pageName;

  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('data-page') === pageName) {
      link.classList.add('active');
    }
  });

  // Show/hide pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(`${pageName}Page`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Load page data
  switch (pageName) {
    case 'certificates':
      loadCertificates();
      break;
    case 'internships':
      loadInternships();
      break;
    case 'hackathons':
      loadHackathons();
      break;
    case 'news':
      loadNews();
      break;
    case 'tools':
      loadTools();
      break;
    case 'projects':
      loadProjects();
      break;
  }

  // Close mobile menu
  document.getElementById('navMenu').classList.remove('active');
}

// Dashboard
function loadDashboard() {
  // Update stats with animated counting (optional enhancement)
  document.getElementById('certCount').textContent = '50+';
  document.getElementById('internshipCount').textContent = '100+';
  document.getElementById('hackathonCount').textContent = '30+';
}

// Certificates
async function loadCertificates(filters = {}) {
  const grid = document.getElementById('certificatesGrid');
  grid.innerHTML = '<div class="loading">Loading certificates...</div>';

  try {
    const response = await api.getCertificates(filters);
    state.certificates = response.data;
    renderCertificates(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load certificates. Please try again.</div>';
  }
}

function renderCertificates(certificates) {
  const grid = document.getElementById('certificatesGrid');

  if (certificates.length === 0) {
    grid.innerHTML = '<div class="loading">No certificates found.</div>';
    return;
  }

  grid.innerHTML = certificates.map(cert => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${cert.name}</h3>
          <p class="card-subtitle">${cert.issuer}</p>
        </div>
        <span class="badge">${cert.level}</span>
      </div>
      
      <p class="card-description">${cert.description || 'Enhance your skills with this certification.'}</p>
      
      <div class="card-meta">
        <span class="badge">⏱️ ${cert.duration}h</span>
        <span class="badge ${cert.cost === 0 ? 'badge-success' : 'badge-warning'}">
          ${cert.cost === 0 ? 'Free' : '$ ' + cert.cost}
        </span>
        ${cert.skills.slice(0, 3).map(skill => `<span class="badge">${skill}</span>`).join('')}
      </div>
      
      ${cert.salaryImpact ? `<p class="card-description" style="color: var(--success); margin-top: var(--spacing-sm);">💰 ${cert.salaryImpact}</p>` : ''}
      
      <div class="card-footer">
        <a href="${cert.url}" target="_blank" class="card-link">
          Enroll Now →
        </a>
        ${cert.deadline ? `<span style= "color: var(--text-muted); font-size: var(--fs-xs);">Deadline: ${new Date(cert.deadline).toLocaleDateString()}</span>` : ''}
      </div>
    </div>
  `).join('');
}

async function searchCertificates(query) {
  if (!query.trim()) return loadCertificates();

  const grid = document.getElementById('certificatesGrid');
  grid.innerHTML = '<div class="loading">Searching...</div>';

  try {
    const response = await api.searchCertificates(query);
    renderCertificates(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Search failed. Please try again.</div>';
  }
}

// Internships
async function loadInternships(filters = {}) {
  const grid = document.getElementById('internshipsGrid');
  grid.innerHTML = '<div class="loading">Loading internships...</div>';

  try {
    const response = await api.getInternships(filters);
    state.internships = response.data;
    renderInternships(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load internships. Please try again.</div>';
  }
}

function renderInternships(internships) {
  const grid = document.getElementById('internshipsGrid');

  if (internships.length === 0) {
    grid.innerHTML = '<div class="loading">No internships found.</div>';
    return;
  }

  grid.innerHTML = internships.map(intern => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${intern.title}</h3>
          <p class="card-subtitle">${intern.company}</p>
        </div>
        <span class="badge ${intern.remote ? 'badge-success' : ''}">${intern.remote ? '🌐 Remote' : '🏢 On-site'}</span>
      </div>
      
      <p class="card-description">${intern.description}</p>
      
      <div class="card-meta">
        <span class="badge">📍 ${intern.location}</span>
        <span class="badge">⏱️ ${intern.duration} months</span>
        <span class="badge badge-success">💰 ₹${intern.stipend?.toLocaleString() || 'Unpaid'}/mo</span>
      </div>
      
      <div class="card-meta" style="margin-top: var(--spacing-xs);">
        ${intern.skills.slice(0, 4).map(skill => `<span class="badge">${skill}</span>`).join('')}
      </div>
      
      <div class="card-footer">
        <a href="${intern.applicationUrl}" target="_blank" class="card-link">
          Apply Now →
        </a>
        <span style="color: var(--text-muted); font-size: var(--fs-xs);">Deadline: ${new Date(intern.deadline).toLocaleDateString()}</span>
      </div>
    </div>
  `).join('');
}

async function searchInternships(query) {
  if (!query.trim()) return loadInternships();

  const grid = document.getElementById('internshipsGrid');
  grid.innerHTML = '<div class="loading">Searching...</div>';

  try {
    const response = await api.searchInternships(query);
    renderInternships(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Search failed. Please try again.</div>';
  }
}

// Hackathons
async function loadHackathons() {
  const grid = document.getElementById('hackathonsGrid');
  grid.innerHTML = '<div class="loading">Loading hackathons...</div>';

  try {
    const response = await api.getHackathons();
    state.hackathons = response.data;
    renderHackathons(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load hackathons. Please try again.</div>';
  }
}

function renderHackathons(hackathons) {
  const grid = document.getElementById('hackathonsGrid');

  if (hackathons.length === 0) {
    grid.innerHTML = '<div class="loading">No hackathons found.</div>';
    return;
  }

  grid.innerHTML = hackathons.map(hack => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${hack.name}</h3>
          <p class="card-subtitle">${hack.platform}</p>
        </div>
        <span class="badge ${hack.remote ? 'badge-success' : ''}">${hack.remote ? '🌐 Online' : '🏢 Offline'}</span>
      </div>
      
      <p class="card-description">${hack.description}</p>
      
      <div class="card-meta">
        <span class="badge">📅 ${new Date(hack.startDate).toLocaleDateString()} - ${new Date(hack.endDate).toLocaleDateString()}</span>
        <span class="badge badge-warning">🏆 ₹${hack.prizePool?.toLocaleString() || 'TBA'}</span>
        <span class="badge">👥 ${hack.teamSize}</span>
      </div>
      
      <div class="card-meta" style="margin-top: var(--spacing-xs);">
        ${hack.skills.slice(0, 4).map(skill => `<span class="badge">${skill}</span>`).join('')}
      </div>
      
      <div class="card-footer">
        <a href="${hack.registerUrl}" target="_blank" class="card-link">
          Register Now →
        </a>
        <span style="color: var(--text-muted); font-size: var(--fs-xs);">${hack.location}</span>
      </div>
    </div>
  `).join('');
}

// News
async function loadNews(category = '') {
  const grid = document.getElementById('newsGrid');
  grid.innerHTML = '<div class="loading">Loading news...</div>';

  try {
    const response = category
      ? await api.getNewsByCategory(category)
      : await api.getNews();
    state.news = response.data;
    renderNews(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load news. Please try again.</div>';
  }
}

function renderNews(newsItems) {
  const grid = document.getElementById('newsGrid');

  if (newsItems.length === 0) {
    grid.innerHTML = '<div class="loading">No news found.</div>';
    return;
  }

  grid.innerHTML = newsItems.map(news => `
    <div class="card">
      <div class="card-header">
        <div style="flex: 1;">
          <h3 class="card-title">${news.headline}</h3>
          <p class="card-subtitle">${news.source} • ${new Date(news.publishedAt).toLocaleDateString()}</p>
        </div>
        <span class="badge">${news.category}</span>
      </div>
      
      <p class="card-description">${news.description}</p>
      
      <div class="card-footer">
        <a href="${news.sourceUrl}" target="_blank" class="card-link">
          Read More →
        </a>
      </div>
    </div>
  `).join('');
}

// Tools
async function loadTools() {
  const grid = document.getElementById('toolsGrid');
  grid.innerHTML = '<div class="loading">Loading tools...</div>';

  try {
    const response = await api.getTools();
    state.tools = response.data;
    renderTools(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load tools. Please try again.</div>';
  }
}

function renderTools(tools) {
  const grid = document.getElementById('toolsGrid');

  if (tools.length === 0) {
    grid.innerHTML = '<div class="loading">No tools found.</div>';
    return;
  }

  grid.innerHTML = tools.map(tool => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${tool.name}</h3>
          <p class="card-subtitle">${tool.category}</p>
        </div>
        <span class="badge">${tool.difficulty}</span>
      </div>
      
      <p class="card-description">${tool.description}</p>
      
      <div class="card-meta">
        <span class="badge ${tool.freeTier ? 'badge-success' : 'badge-warning'}">
          ${tool.freeTier ? '✅ Free Tier' : '💵 Paid'}
        </span>
        ${tool.features.slice(0, 3).map(feature => `<span class="badge">${feature}</span>`).join('')}
      </div>
      
      ${tool.pricing ? `<p class="card-description" style="margin-top: var(--spacing-sm);">💰 ${tool.pricing}</p>` : ''}
      
      <div class="card-footer">
        <a href="${tool.url}" target="_blank" class="card-link">
          Explore Tool →
        </a>
        <a href="${tool.documentation}" target="_blank" class="card-link" style="font-size: var(--fs-xs);">
          📚 Docs
        </a>
      </div>
    </div>
  `).join('');
}

// Projects
async function loadProjects(difficulty = '') {
  const grid = document.getElementById('projectsGrid');
  grid.innerHTML = '<div class="loading">Loading projects...</div>';

  try {
    const response = await api.getProjects(difficulty ? { difficulty } : {});
    state.projects = response.data;
    renderProjects(response.data);
  } catch (error) {
    grid.innerHTML = '<div class="loading">Failed to load projects. Please try again.</div>';
  }
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');

  if (projects.length === 0) {
    grid.innerHTML = '<div class="loading">No projects found.</div>';
    return;
  }

  grid.innerHTML = projects.map(project => `
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">${project.title}</h3>
        </div>
        <span class="badge">${project.difficulty}</span>
      </div>
      
      <p class="card-description">${project.description}</p>
      
      <div class="card-meta">
        <span class="badge">⏱️ ${project.duration} weeks</span>
        ${project.techStack.slice(0, 4).map(tech => `<span class="badge">${tech}</span>`).join('')}
      </div>
      
      <div style="margin-top: var(--spacing-md);">
        <p style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-xs);">Skills You'll Learn:</p>
        <div class="card-meta">
          ${project.skills.slice(0, 4).map(skill => `<span class="badge badge-success">${skill}</span>`).join('')}
        </div>
      </div>
      
      <div style="margin-top: var(--spacing-md);">
        <p style="font-weight: 600; color: var(--text-primary); margin-bottom: var(--spacing-xs);">Steps:</p>
        <ol style="color: var(--text-secondary); font-size: var(--fs-sm); padding-left: var(--spacing-md);">
          ${project.steps.slice(0, 3).map(step => `<li>${step}</li>`).join('')}
          ${project.steps.length > 3 ? '<li>...and more</li>' : ''}
        </ol>
      </div>
      
      <div class="card-footer" style="margin-top: var(--spacing-md);">
        <button class="card-link" onclick="showToast('Project details coming soon!', 'info')">
          View Full Details →
        </button>
      </div>
    </div>
  `).join('');
}

// Utility functions
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;

  // Reset classes
  toast.className = 'toast';
  toast.classList.add(type);

  // Show toast
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  // Hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
