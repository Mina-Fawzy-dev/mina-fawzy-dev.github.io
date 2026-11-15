// ============================================================
// Project data — real Behance projects (id / title / category / cover)
// ============================================================
const BEHANCE_CDN = 'https://mir-s3-cdn-cf.behance.net/projects/404/';

const projects = [
  { id: '227055359', slug: 'Classic-Watch-3D-Model-CGI', title: 'Classic Watch | 3D Model | CGI',              cat: 'Product CGI',  cover: '0e03e4227055359.Y3JvcCwxMDgwLDg0NCwwLDA.jpg' },
  { id: '212325075', slug: 'Apple-Watch-Series-8-Ultra-3D-Model', title: 'Apple Watch Series 8 Ultra | 3D Model',       cat: 'Product CGI',  cover: '5f278a212325075.Y3JvcCw2MDMsNDcyLDMwNyw5NA.png' },
  { id: '213081193', slug: 'GoPro-22-Remake-CGI-Model', title: 'GoPro 22 Remake | CGI Model',                 cat: 'Product CGI',  cover: '41adb7213081193.Y3JvcCw4MDcsNjMxLDIyNSww.jpg' },
  { id: '204662727', slug: 'Mercedes-E-Class-AMG-3d-model-Full-CGI', title: 'Mercedes E-Class AMG | Full CGI',             cat: 'Automotive',   cover: '762b1e204662727.Y3JvcCw5MjAsNzIwLDE4MCww.jpg' },
  { id: '204532381', slug: 'Mercedes-Benz-190-SL-1958-3d-model-Full-CGI', title: 'Mercedes Benz 190 SL 1958 | Full CGI',        cat: 'Automotive',   cover: '9496d0204532381.Y3JvcCw0NzYsMzcyLDM3NSwyMDc.jpg' },
  { id: '203972645', slug: 'Nissan-GTR-Nismo-CGI-Model', title: 'Nissan GTR Nismo | CGI Model',                cat: 'Automotive',   cover: '5051fa203972645.Y3JvcCw4NjIsNjc1LDE4MSww.jpg' },
  { id: '204018631', slug: 'Nissan-GTR-Nismo-Full-CGI', title: 'Nissan GTR Nismo | Full CGI',                 cat: 'Automotive',   cover: '39442d204018631.Y3JvcCwxMDkyLDg1NCwzNywxNzU.jpg' },
  { id: '202867565', slug: 'PORSCHE-911-TURBO-930-3d-model-CGI', title: 'Porsche 911 Turbo 930 | CGI',                 cat: 'Automotive',   cover: '2a11de202867565.Y3JvcCw1NzEsNDQ2LDQ2LDExNA.png' },
  { id: '204020217', slug: 'Nissan-GTR-R35-Nismo-CGI-Model', title: 'Nissan GTR R35 Nismo | CGI Model',            cat: 'Automotive',   cover: '5f406e204020217.Y3JvcCw4NjIsNjc1LDE2OCww.jpg' },
  { id: '202888251', slug: 'BMW-M850i-3d-model', title: 'BMW M850i | 3D Model',                        cat: 'Automotive',   cover: '5d3a4d202888251.Y3JvcCw1NTgsNDM2LDUwNywxMDc.jpg' },
  { id: '202874047', slug: 'Real-Time-Logo-Animation', title: 'Real Time Logo Animation',                    cat: 'Motion Design', cover: '0740a2202874047.Y3JvcCw3NDMsNTgxLDE2NSw1MQ.gif' },
  { id: '202884829', slug: 'Slack-Logo-Animation', title: 'Slack Logo Animation',                        cat: 'Motion Design', cover: 'b2bb2f202884829.Y3JvcCw5MjQsNzIyLDAsMzQ.png' },
  { id: '202853495', slug: 'Impossible-Triangle-Geometry-Animation', title: 'Impossible Triangle Geometry Animation',      cat: 'Motion Design', cover: '0738c6202853495.Y3JvcCw2NTAsNTA4LDE0OCw2NA.png' },
  { id: '237590331', slug: 'PTG-Passion-Beauty-Branding-Advertising', title: 'PTG Passion — Beauty Branding & Advertising', cat: 'Branding',     cover: 'ac3e80237590331.Y3JvcCwxMTc2LDkyMCwxMSww.jpg' },
  { id: '240229695', slug: 'Advertising-Campaign-Nike-Zoom-Fly-6', title: 'Advertising Campaign — Nike Zoom Fly 6',      cat: 'Advertising',  cover: 'a99b89240229695.Y3JvcCwxNjE2LDEyNjQsMCww.jpg' },
  { id: '240018727', slug: 'Nike-Advertising-Photo-Manipulation', title: 'Nike | Advertising | Photo Manipulation',     cat: 'Advertising',  cover: 'f0b727240018727.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '235942159', slug: 'Products-Photo-Manipulation-Posters-Updated', title: 'Products Photo Manipulation & Posters',       cat: 'Advertising',  cover: 'd3543a235942159.Y3JvcCwxNjE2LDEyNjQsMCww.jpg' },
  { id: '240018219', slug: 'McDonalds-Social-Media-Post', title: "McDonald's | Social Media Post",              cat: 'Social Media', cover: 'ffb677240018219.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '240018013', slug: 'AXE-Social-Media-Post', title: 'AXE | Social Media Post',                     cat: 'Social Media', cover: '3b8802240018013.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '240017621', slug: 'Spiro-Spathis-Social-Media-Post', title: 'Spiro Spathis | Social Media Post',           cat: 'Social Media', cover: 'bd46f7240017621.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '240019107', slug: 'Molto-Social-Media-Post', title: 'Molto | Social Media Post',                   cat: 'Social Media', cover: '88ba61240019107.6936950722c00.png' },
  { id: '240017399', slug: 'NIVEA-Photo-Manipulation', title: 'NIVEA | Photo Manipulation',                  cat: 'Social Media', cover: 'c0d905240017399.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '218412295', slug: '3D-Exterior-Visualization-CGI', title: '3D Exterior Visualization | CGI',             cat: 'Arch Viz',     cover: '10080b218412295.68e277c6bb765.png' },
];

const projectById = Object.fromEntries(projects.map(p => [p.id, p]));
const coverOf = (p) => BEHANCE_CDN + p.cover;
const galleryUrl = (p) => `https://www.behance.net/gallery/${p.id}/${p.slug}`;
const embedUrl = (id) => `https://www.behance.net/embed/project/${id}?ilo0=1`;

// ============================================================
// Marquee rows — project IDs in playback order
// ============================================================
const marqueeLeft  = ['227055359', '204662727', '212325075', '202867565', '213081193', '204532381', '202888251', '204020217'];
const marqueeRight = ['202874047', '240229695', '202884829', '240018727', '202853495', '240018219', '237590331', '240018631'];

// ============================================================
// Work section groups — each gets a heading + grid of cards
// ============================================================
const workGroups = [
  {
    key: 'product-viz',
    title: 'Product Visualization & CGI',
    icon: 'box-seam',
    desc: 'Photorealistic product renders — hard-surface modeling, material studies and studio lighting in <strong>3ds Max</strong> & <strong>Blender</strong>, rendered with <strong>V-Ray</strong>.',
    items: ['227055359', '212325075', '213081193'],
  },
  {
    key: 'automotive',
    title: 'Automotive CGI',
    icon: 'car-front',
    desc: 'Full CGI vehicle builds — accurate proportions, clean topology, paint and glass shading, studio and environmental lighting.',
    items: ['204662727', '204532381', '203972645', '204018631', '202867565', '204020217', '202888251'],
  },
  {
    key: 'motion',
    title: 'Motion Design & Animation',
    icon: 'film',
    desc: 'Logo animation and procedural motion in <strong>After Effects</strong> & <strong>Blender</strong> — kinetic timing, geometry animation and clean brand reveals.',
    items: ['202874047', '202884829', '202853495'],
  },
  {
    key: 'branding',
    title: 'Branding & Advertising',
    icon: 'megaphone',
    desc: 'Campaign key visuals and brand-focused art direction — concept, composition, lighting and final retouch.',
    items: ['237590331', '240229695', '240018727', '235942159'],
  },
  {
    key: 'social',
    title: 'Social Media Campaigns',
    icon: 'instagram',
    desc: 'Scroll-stopping social posts and photo manipulations built around each brand\'s identity and product story.',
    items: ['240018219', '240018013', '240017621', '240019107', '240017399'],
  },
  {
    key: 'arch-viz',
    title: 'Architectural Visualization',
    icon: 'building',
    desc: 'Exterior visualization — camera framing, daylight study and material realism for architectural presentation.',
    items: ['218412295'],
  },
];

// ============================================================
// GitHub projects (public repositories)
// ============================================================
const githubProjects = [
  {
    name: 'TSATs — Technical Support Automation Tools',
    desc: 'A growing Python toolkit that automates common IT support, diagnostics, system administration and repetitive help-desk tasks.',
    url: 'https://github.com/Mina-Fawzy-dev/TSATs',
    lang: 'Python',
    tags: ['Automation', 'IT Support'],
  },
  {
    name: 'mina-fawzy-dev.github.io',
    desc: 'This portfolio — a single-page static site hand-built with HTML, CSS and vanilla JavaScript. No framework, no build step, fully responsive.',
    url: 'https://github.com/Mina-Fawzy-dev/mina-fawzy-dev.github.io',
    lang: 'HTML / CSS / JS',
    tags: ['Web', 'UI'],
  },
];

// ============================================================
// Render functions
// ============================================================
function renderMarquee() {
  const container = document.getElementById('marqueeContainer');
  if (!container) return;

  function rowHtml(ids, cls) {
    const build = (id) => {
      const p = projectById[id];
      if (!p) return '';
      return `<div class="marquee-item">
        <img src="${coverOf(p)}" alt="${p.title}" loading="lazy" decoding="async">
        <span class="marquee-label">${p.title}</span>
      </div>`;
    };
    // duplicated list keeps the loop seamless
    const items = ids.map(build).join('') + ids.map(build).join('');
    return `<div class="marquee-row ${cls}">${items}</div>`;
  }

  container.innerHTML = rowHtml(marqueeLeft, 'row-left') + rowHtml(marqueeRight, 'row-right') +
    `<button class="show-all-btn" onclick="goToWork()">
      <i class="bi bi-grid-3x3-gap-fill"></i> Show All Projects <i class="bi bi-arrow-right"></i>
    </button>`;
}

function projectCard(p) {
  return `<article class="project-card" role="button" tabindex="0"
      onclick="openLightbox('${p.id}')"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openLightbox('${p.id}')}"
      aria-label="Preview ${p.title}">
      <div class="project-thumb">
        <span class="project-badge">${p.cat}</span>
        <span class="project-open"><i class="bi bi-arrows-angle-expand"></i></span>
        <img src="${coverOf(p)}" alt="${p.title}" loading="lazy" decoding="async">
      </div>
      <div class="project-body">
        <span class="project-cat">${p.cat}</span>
        <h5 class="project-name">${p.title}</h5>
      </div>
    </article>`;
}

function renderWork() {
  const container = document.getElementById('workContent');
  if (!container) return;

  let html = '';
  workGroups.forEach(g => {
    const items = g.items.map(id => projectById[id]).filter(Boolean);
    if (!items.length) return;
    const cards = items.map(projectCard).join('');

    html += `<h3 class="section-title">
        <i class="bi bi-${g.icon}" style="color:var(--brand-red);"></i> ${g.title}
        <span class="section-count">${items.length} project${items.length > 1 ? 's' : ''}</span>
      </h3>
      <p class="section-desc">${g.desc}</p>
      <div class="projects-grid">${cards}</div>`;
  });

  container.innerHTML = html +
    `<a href="https://www.behance.net/mina_fawzy" class="show-all-btn-outline" target="_blank" rel="noopener noreferrer">
      <i class="bi bi-behance"></i> Show All on Behance
    </a>`;
}

function renderGithub() {
  const container = document.getElementById('githubContent');
  if (!container) return;

  const cards = githubProjects.map(p =>
    `<a href="${p.url}" class="github-project-card" target="_blank" rel="noopener noreferrer">
      <div class="github-thumb"><i class="bi bi-github"></i></div>
      <div class="github-info">
        <div class="github-title"><i class="bi bi-github"></i> ${p.name}</div>
        <div class="github-meta">
          <span class="repo-tag"><span class="lang-dot"></span>${p.lang}</span>
          ${p.tags.map(t => `<span class="repo-tag">${t}</span>`).join('')}
        </div>
        <p class="github-desc">${p.desc}</p>
        <span class="github-link"><i class="bi bi-box-arrow-up-right"></i> View on GitHub</span>
      </div>
    </a>`
  ).join('');

  container.innerHTML =
    `<div class="projects-grid">${cards}</div>
    <a href="https://github.com/Mina-Fawzy-dev" class="show-all-btn-outline" target="_blank" rel="noopener noreferrer">
      <i class="bi bi-github"></i> Show All on GitHub
    </a>`;
}

// ============================================================
// Lightbox — live Behance case study on demand
// ============================================================
let lightboxLoaded = false;

function openLightbox(id) {
  const p = projectById[id];
  const box = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if (!p || !box || !body) return;

  document.getElementById('lightboxTitle').textContent = p.title;
  document.getElementById('lightboxOpen').href = galleryUrl(p);
  body.innerHTML = `<iframe src="${embedUrl(p.id)}" title="${p.title}"
    allowfullscreen allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin"
    frameborder="0" scrolling="yes"></iframe>`;

  box.classList.add('open');
  document.body.classList.add('no-scroll');
  lightboxLoaded = true;
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if (!box) return;
  box.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (body) body.innerHTML = '';
  lightboxLoaded = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxLoaded) closeLightbox();
});

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
    workPill.style.transform = 'none';
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

  setTimeout(() => positionWorkPill(), 30);

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
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
