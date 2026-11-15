// ============================================================
// Projects Data — add, remove, or reorder projects here only
// ============================================================
const projects = [
  { id: '202874047' },
  { id: '202884829' },
  { id: '202853495' },
  { id: '204532381' },
  { id: '203972645' },
  { id: '204018631' },
  { id: '202867565' },
  { id: '218412295' },
  { id: '240018219' },
  { id: '240019107' },
  { id: '240017621' },
  { id: '235942159' },
  { id: '212325075' },
  { id: '213081193' },
  { id: '237590331' },
];

const embedUrl = (id) => `https://www.behance.net/embed/project/${id}?ilo0=1`;

// Marquee rows — project IDs in playback order
const marqueeLeft  = ['202874047','202884829','202853495','204532381','203972645','204018631'];
const marqueeRight = ['202867565','218412295','240019107','240017621','235942159','203972645'];

// Work section groups — each gets rendered as a heading + grid of project cards
const workGroups = [
  {
    key: 'graphic-design',
    title: 'Graphic Design',
    icon: 'palette',
    desc: 'Eye-catching visuals, posters, and digital art crafted in <strong>Photoshop</strong> & <strong>Illustrator</strong>.',
    items: ['202884829','202853495','204532381','203972645','204018631','202867565','218412295','240018219'],
  },
  {
    key: 'branding',
    title: 'Branding & Advertising',
    icon: 'megaphone',
    desc: 'Brand identities, advertising campaigns, and promotional content that make brands stand out.',
    items: ['202884829','202853495','204532381','203972645','204018631','202867565','218412295','240018219'],
  },
  {
    key: 'motion',
    title: 'Motion Design & Animation',
    icon: 'film',
    desc: 'Motion graphics in <strong>Adobe After Effects</strong> and 3D motion in <strong>3ds Max</strong> & <strong>Blender</strong>.',
    items: ['235942159','203972645'],
  },
  {
    key: 'product-viz',
    title: '3D Modeling | Product Visualization',
    icon: 'box-seam',
    desc: 'Photorealistic 3D product models with clean topology and precise material simulation.',
    items: ['212325075','240017621','213081193'],
  },
  {
    key: 'generalist',
    title: '3D Modeling Generalist',
    icon: 'cube',
    desc: 'High-quality 3D modeling including vehicles, product designs, and detailed hard surface assets.',
    items: ['240019107','237590331','240018219','240019107','237590331','240019107'],
  },
];

// GitHub projects (static for now)
const githubProjects = [
  {
    name: 'Project Name Example',
    desc: 'Replace this with your real GitHub project. Add a brief description of what the project does, the tech stack used, and any notable features.',
    url: 'https://github.com/Mina-Fawzy-dev',
  },
  {
    name: 'Another Project Example',
    desc: 'Add another GitHub project here. Describe the purpose, technologies, and key features of the project.',
    url: 'https://github.com/Mina-Fawzy-dev',
  },
];

// ============================================================
// Render functions
// ============================================================
function renderMarquee() {
  const container = document.getElementById('marqueeContainer');
  if (!container) return;

  function rowHtml(ids, cls) {
    const items = ids.concat(ids).map(id =>
      `<div class="marquee-item"><iframe scrolling="no" src="${embedUrl(id)}" allowfullscreen lazyload frameborder="0" allow="clipboard-write" refererPolicy="strict-origin-when-cross-origin"></iframe></div>`
    ).join('');
    return `<div class="marquee-row ${cls}">${items}</div>`;
  }

  container.innerHTML = rowHtml(marqueeLeft, 'row-left') + rowHtml(marqueeRight, 'row-right') +
    `<button class="show-all-btn" onclick="goToWork()">
      <i class="bi bi-grid-3x3-gap-fill"></i> Show All Projects <i class="bi bi-arrow-right"></i>
    </button>`;
}

function renderWork() {
  const container = document.getElementById('workContent');
  if (!container) return;

  let html = '';
  workGroups.forEach(g => {
    const cards = g.items.map(id =>
      `<div class="project-card"><div class="embed-wrap"><iframe scrolling="no" src="${embedUrl(id)}" height="220" width="100%" allowfullscreen lazyload frameborder="0" allow="clipboard-write" refererPolicy="strict-origin-when-cross-origin"></iframe></div></div>`
    ).join('');

    html += `<h3 class="section-title"><i class="bi bi-${g.icon}" style="color:var(--brand-red);"></i> ${g.title}</h3>
      <p class="section-desc">${g.desc}</p>
      <div class="projects-grid">${cards}</div>`;
  });

  container.innerHTML = html +
    `<a href="https://behance.net/mina_fawzy" class="show-all-btn-outline" target="_blank">
      <i class="bi bi-behance"></i> Show All on Behance
    </a>`;
}

function renderGithub() {
  const container = document.getElementById('githubContent');
  if (!container) return;

  const cards = githubProjects.map(p =>
    `<a href="${p.url}" class="github-project-card" target="_blank" style="grid-column: span 2;">
      <div class="github-thumb"><i class="bi bi-github"></i></div>
      <div class="github-info">
        <div class="github-title"><i class="bi bi-github"></i> ${p.name}</div>
        <p class="github-desc">${p.desc}</p>
        <span class="github-link"><i class="bi bi-box-arrow-up-right"></i> View on GitHub</span>
      </div>
    </a>`
  ).join('');

  container.innerHTML =
    `<div class="projects-grid">${cards}</div>
    <a href="https://github.com/Mina-Fawzy-dev" class="show-all-btn-outline" target="_blank">
      <i class="bi bi-github"></i> Show All on GitHub
    </a>`;
}

// ============================================================
// Theme persistence (inline script in <head> sets data-theme)
// ============================================================
let is24Hour = true;
let currentTheme = localStorage.getItem('mcg-theme') || 'light';

// ============================================================
// Pill positioning
// ============================================================
function updateNavPill(index) {
  const pill = document.getElementById('navPill');
  const buttons = document.querySelectorAll('.nav-btn');
  if (!pill || buttons.length === 0 || !buttons[index]) return;
  const btn = buttons[index];
  pill.style.left = btn.offsetLeft + 'px';
  pill.style.width = btn.offsetWidth + 'px';
}

function updateAboutPill(index) {
  const pill = document.getElementById('aboutPill');
  const tabs = document.querySelectorAll('.about-tab');
  if (!pill || tabs.length === 0 || !tabs[index]) return;
  const tab = tabs[index];
  pill.style.left = tab.offsetLeft + 'px';
  pill.style.width = tab.offsetWidth + 'px';
}

function positionWorkPill() {
  const workPill = document.getElementById('workPill');
  const activeSubTab = document.querySelector('.sub-tab.active');
  if (workPill && activeSubTab) {
    workPill.style.left = activeSubTab.offsetLeft + 'px';
    workPill.style.width = activeSubTab.offsetWidth + 'px';
  }
}

// ============================================================
// Navigation
// ============================================================
function switchSection(section, index) {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.nav-btn[data-section="${section}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  updateNavPill(index);

  document.querySelectorAll('.section').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  const target = document.getElementById(`section-${section}`);
  target.style.display = 'block';
  setTimeout(() => {
    requestAnimationFrame(() => {
      target.classList.add('active');
      if (section === 'work') positionWorkPill();
    });
  }, 10);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchSubTab(sub) {
  document.querySelectorAll('.sub-tab').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.sub-tab[data-sub="${sub}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const pill = document.getElementById('workPill');
  if (pill) {
    if (sub === 'github') pill.classList.add('slide-right');
    else pill.classList.remove('slide-right');
  }
  setTimeout(() => positionWorkPill(), 500);

  document.querySelectorAll('.sub-tab-content').forEach(c => {
    c.classList.remove('active');
    c.style.display = 'none';
  });

  const target = document.getElementById(`sub-${sub}`);
  target.style.display = 'block';
  setTimeout(() => {
    requestAnimationFrame(() => target.classList.add('active'));
  }, 50);
}

function switchAboutTab(tab, index) {
  document.querySelectorAll('.about-tab').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.about-tab[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add('active');
  updateAboutPill(index);

  document.querySelectorAll('.about-tab-content').forEach(c => {
    c.classList.remove('active');
    c.style.display = 'none';
  });

  const target = document.getElementById(`tab-${tab}`);
  target.style.display = 'block';
  setTimeout(() => {
    requestAnimationFrame(() => target.classList.add('active'));
  }, 50);
}

function goToWork() {
  switchSection('work', 1);
}

// ============================================================
// Theme toggle + clock
// ============================================================
function toggleTimeFormat() {
  is24Hour = !is24Hour;
  document.getElementById('timeFormatIcon').className = is24Hour ? 'bi bi-clock' : 'bi bi-clock-history';
  updateClock();
}

function toggleTheme() {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.getElementById('themeIcon').className = currentTheme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
  localStorage.setItem('mcg-theme', currentTheme);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('themeIcon').className = currentTheme === 'light' ? 'bi bi-moon-stars' : 'bi bi-sun';
});

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');

  let timeStr;
  if (is24Hour) {
    timeStr = `${String(h).padStart(2, '0')}:${m}:${s}`;
  } else {
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    timeStr = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm}`;
  }

  const el = document.getElementById('clock');
  if (el) el.textContent = timeStr;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dateEl = document.getElementById('dateDisplay');
  if (dateEl) dateEl.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

// ============================================================
// Initialize pills after render
// ============================================================
function initializeAllPills() {
  updateNavPill(0);
  updateAboutPill(0);
  positionWorkPill();
}

// ============================================================
// Boot
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMarquee();
  renderWork();
  renderGithub();

  setTimeout(initializeAllPills, 50);
  setTimeout(initializeAllPills, 200);
  setTimeout(initializeAllPills, 500);
});

window.addEventListener('load', () => {
  initializeAllPills();
  setTimeout(initializeAllPills, 100);
  setTimeout(initializeAllPills, 500);
});

window.addEventListener('resize', () => {
  const activeNavBtn = document.querySelector('.nav-btn.active');
  if (activeNavBtn) {
    const index = Array.from(document.querySelectorAll('.nav-btn')).indexOf(activeNavBtn);
    updateNavPill(index);
  }
  initializeAllPills();
});

setInterval(updateClock, 1000);
updateClock();
