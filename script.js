// ============================================================
// Project data — id, Behance slug, title, category, cover
// Edit here only; the grid + lightbox render from this list.
// ============================================================
const CDN = 'https://mir-s3-cdn-cf.behance.net/projects/404/';

const projects = [
  { id: '240229695', slug: 'Advertising-Campaign-Nike-Zoom-Fly-6', f: 'advertising', cat: 'Advertising', title: 'Nike Zoom Fly 6 — Campaign', cover: 'a99b89240229695.Y3JvcCwxNjE2LDEyNjQsMCww.jpg' },
  { id: '204662727', slug: 'Mercedes-E-Class-AMG-3d-model-Full-CGI', f: 'automotive', cat: 'Automotive', title: 'Mercedes E-Class AMG — Full CGI', cover: '762b1e204662727.Y3JvcCw5MjAsNzIwLDE4MCww.jpg' },
  { id: '212325075', slug: 'Apple-Watch-Series-8-Ultra-3D-Model', f: 'product', cat: 'Product', title: 'Apple Watch Series 8 Ultra', cover: '5f278a212325075.Y3JvcCw2MDMsNDcyLDMwNyw5NA.png' },
  { id: '202867565', slug: 'PORSCHE-911-TURBO-930-3d-model-CGI', f: 'automotive', cat: 'Automotive', title: 'Porsche 911 Turbo 930', cover: '2a11de202867565.Y3JvcCw1NzEsNDQ2LDQ2LDExNA.png' },
  { id: '240018727', slug: 'Nike-Advertising-Photo-Manipulation', f: 'advertising', cat: 'Advertising', title: 'Nike — Photo Manipulation', cover: 'f0b727240018727.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '213081193', slug: 'GoPro-22-Remake-CGI-Model', f: 'product', cat: 'Product', title: 'GoPro 22 — CGI Model', cover: '41adb7213081193.Y3JvcCw4MDcsNjMxLDIyNSww.jpg' },
  { id: '237590331', slug: 'PTG-Passion-Beauty-Branding-Advertising', f: 'advertising', cat: 'Branding', title: 'PTG Passion — Beauty Branding', cover: 'ac3e80237590331.Y3JvcCwxMTc2LDkyMCwxMSww.jpg' },
  { id: '204020217', slug: 'Nissan-GTR-R35-Nismo-CGI-Model', f: 'automotive', cat: 'Automotive', title: 'Nissan GT-R R35 Nismo', cover: '5f406e204020217.Y3JvcCw4NjIsNjc1LDE2OCww.jpg' },
  { id: '240018219', slug: 'McDonalds-Social-Media-Post', f: 'social', cat: 'Social', title: "McDonald's — Social Post", cover: 'ffb677240018219.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '227055359', slug: 'Classic-Watch-3D-Model-CGI', f: 'product', cat: 'Product', title: 'Classic Watch — 3D Model', cover: '0e03e4227055359.Y3JvcCwxMDgwLDg0NCwwLDA.jpg' },
  { id: '204532381', slug: 'Mercedes-Benz-190-SL-1958-3d-model-Full-CGI', f: 'automotive', cat: 'Automotive', title: 'Mercedes 190 SL 1958', cover: '9496d0204532381.Y3JvcCw0NzYsMzcyLDM3NSwyMDc.jpg' },
  { id: '235942159', slug: 'Products-Photo-Manipulation-Posters-Updated', f: 'advertising', cat: 'Advertising', title: 'Product Posters & Manipulation', cover: 'd3543a235942159.Y3JvcCwxNjE2LDEyNjQsMCww.jpg' },
  { id: '203972645', slug: 'Nissan-GTR-Nismo-CGI-Model', f: 'automotive', cat: 'Automotive', title: 'Nissan GT-R Nismo', cover: '5051fa203972645.Y3JvcCw4NjIsNjc1LDE4MSww.jpg' },
  { id: '202874047', slug: 'Real-Time-Logo-Animation', f: 'motion', cat: 'Motion', title: 'Real Time — Logo Animation', cover: '0740a2202874047.Y3JvcCw3NDMsNTgxLDE2NSw1MQ.gif' },
  { id: '240018013', slug: 'AXE-Social-Media-Post', f: 'social', cat: 'Social', title: 'AXE — Social Post', cover: '3b8802240018013.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '202888251', slug: 'BMW-M850i-3d-model', f: 'automotive', cat: 'Automotive', title: 'BMW M850i', cover: '5d3a4d202888251.Y3JvcCw1NTgsNDM2LDUwNywxMDc.jpg' },
  { id: '218412295', slug: '3D-Exterior-Visualization-CGI', f: 'arch', cat: 'Arch Viz', title: '3D Exterior Visualization', cover: '10080b218412295.68e277c6bb765.png' },
  { id: '202884829', slug: 'Slack-Logo-Animation', f: 'motion', cat: 'Motion', title: 'Slack — Logo Animation', cover: 'b2bb2f202884829.Y3JvcCw5MjQsNzIyLDAsMzQ.png' },
  { id: '240017621', slug: 'Spiro-Spathis-Social-Media-Post', f: 'social', cat: 'Social', title: 'Spiro Spathis — Social Post', cover: 'bd46f7240017621.Y3JvcCw4MDgsNjMyLDAsMA.png' },
  { id: '204018631', slug: 'Nissan-GTR-Nismo-Full-CGI', f: 'automotive', cat: 'Automotive', title: 'Nissan GT-R Nismo — Full CGI', cover: '39442d204018631.Y3JvcCwxMDkyLDg1NCwzNywxNzU.jpg' },
  { id: '202853495', slug: 'Impossible-Triangle-Geometry-Animation', f: 'motion', cat: 'Motion', title: 'Impossible Triangle Animation', cover: '0738c6202853495.Y3JvcCw2NTAsNTA4LDE0OCw2NA.png' },
  { id: '240019107', slug: 'Molto-Social-Media-Post', f: 'social', cat: 'Social', title: 'Molto — Social Post', cover: '88ba61240019107.6936950722c00.png' },
  { id: '240017399', slug: 'NIVEA-Photo-Manipulation', f: 'social', cat: 'Social', title: 'NIVEA — Photo Manipulation', cover: 'c0d905240017399.Y3JvcCw4MDgsNjMyLDAsMA.png' },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'product', label: 'Product' },
  { key: 'automotive', label: 'Automotive' },
  { key: 'motion', label: 'Motion' },
  { key: 'advertising', label: 'Advertising' },
  { key: 'social', label: 'Social' },
  { key: 'arch', label: 'Arch Viz' },
];

const repos = [
  {
    name: 'TSATs',
    desc: 'Technical Support Automation Tools — a growing Python toolkit that automates common IT support, diagnostics and repetitive help-desk tasks.',
    lang: 'Python',
    url: 'https://github.com/Mina-Fawzy-dev/TSATs',
  },
  {
    name: 'mina-fawzy-dev.github.io',
    desc: 'This portfolio — a single-page static site hand-built with HTML, CSS and vanilla JavaScript. No framework, no build step.',
    lang: 'HTML / CSS / JS',
    url: 'https://github.com/Mina-Fawzy-dev/mina-fawzy-dev.github.io',
  },
];

const byId = Object.fromEntries(projects.map(p => [p.id, p]));
const galleryUrl = (p) => `https://www.behance.net/gallery/${p.id}/${p.slug}`;
const embedUrl = (id) => `https://www.behance.net/embed/project/${id}?ilo0=1`;

// ============================================================
// Render: work grid + filters
// ============================================================
let activeFilter = 'all';
let showAllProjects = false;
let justSwiped = false;

// 3 columns on desktop, 2 below that — keep the capped view at whole rows
const allLimit = () => (window.innerWidth <= 1024 ? 8 : 9);

const countFor = (key) =>
  key === 'all' ? projects.length : projects.filter(p => p.f === key).length;

function renderFilters() {
  const el = document.getElementById('filters');
  if (!el) return;
  el.innerHTML = filters.map(f =>
    `<button class="filter${f.key === 'all' ? ' active' : ''}" data-filter="${f.key}" role="tab"
      aria-selected="${f.key === 'all'}">${f.label}<span class="filter-count">${countFor(f.key)}</span></button>`
  ).join('');

  el.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    setFilter(btn.dataset.filter, { scroll: true });
  });

  const prev = document.getElementById('filterPrev');
  const next = document.getElementById('filterNext');
  if (prev) prev.addEventListener('click', () => stepFilter(-1));
  if (next) next.addEventListener('click', () => stepFilter(1));

  const all = document.getElementById('showAllBtn');
  if (all) all.addEventListener('click', () => {
    showAllProjects = true;
    applyFilter();
  });
}

function renderWork() {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  grid.innerHTML = projects.map((p, i) => `
    <a class="project" href="${galleryUrl(p)}" target="_blank" rel="noopener noreferrer"
       data-f="${p.f}" style="animation-delay:${Math.min(i, 8) * 25}ms"
       onclick="return projectClick(event, '${p.id}')">
      <div class="project-thumb">
        <img src="${CDN}${p.cover}" alt="${p.title}" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async">
      </div>
      <div class="project-caption">
        <span class="project-title">${p.title}</span>
        <span class="project-cat">${p.cat}</span>
      </div>
    </a>`).join('');
}

function setFilter(key, opts = {}) {
  activeFilter = key;
  showAllProjects = false;          // every tab swap starts collapsed again
  paintFilters();
  applyFilter();
  if (opts.scroll) scrollToWorkTop();
}

function stepFilter(dir) {
  const i = filters.findIndex(f => f.key === activeFilter);
  const n = (i + dir + filters.length) % filters.length;
  setFilter(filters[n].key, { scroll: true });
}

function paintFilters() {
  document.querySelectorAll('.filter').forEach(b => {
    const on = b.dataset.filter === activeFilter;
    b.classList.toggle('active', on);
    b.setAttribute('aria-selected', String(on));
  });
}

function applyFilter() {
  const cards = [...document.querySelectorAll('#workGrid .project')];
  const limit = allLimit();
  let shown = 0;

  cards.forEach(card => {
    const inFilter = activeFilter === 'all' || card.dataset.f === activeFilter;
    const capped = activeFilter === 'all' && !showAllProjects && shown >= limit;
    const show = inFilter && !capped;
    if (show) shown++;

    const wasHidden = card.hidden;
    card.hidden = !show;
    if (show && wasHidden) {
      // restart the entrance animation so the swap reads as a change
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = '';
    }
  });

  const btn = document.getElementById('showAllBtn');
  if (btn) {
    const hiddenCount = projects.length - shown;
    const canExpand = activeFilter === 'all' && !showAllProjects && hiddenCount > 0;
    btn.hidden = !canExpand;
    if (canExpand) {
      const label = document.getElementById('showAllLabel');
      if (label) label.textContent = `Show ${hiddenCount} more projects`;
    }
  }
}

function scrollToWorkTop() {
  const work = document.getElementById('work');
  if (!work) return;
  const top = work.getBoundingClientRect().top + window.scrollY - 76;
  if (window.scrollY > top + 40) window.scrollTo({ top, behavior: 'smooth' });
}

function initWorkSwipe() {
  const grid = document.getElementById('workGrid');
  if (!grid) return;
  let x0 = null, y0 = null;

  grid.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { x0 = null; return; }
    x0 = e.touches[0].clientX;
    y0 = e.touches[0].clientY;
  }, { passive: true });

  grid.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - x0;
    const dy = t.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.6) {
      justSwiped = true;
      setTimeout(() => { justSwiped = false; }, 350);
      stepFilter(dx < 0 ? 1 : -1);
    }
  }, { passive: true });
}

// ============================================================
// Render: repos
// ============================================================
function renderRepos() {
  const el = document.getElementById('repoList');
  if (!el) return;
  el.innerHTML = repos.map(r => `
    <a class="repo" href="${r.url}" target="_blank" rel="noopener noreferrer">
      <div class="repo-top">
        <span class="repo-name">${r.name}<i class="bi bi-arrow-up-right"></i></span>
        <span class="repo-lang"><span class="lang-dot"></span>${r.lang}</span>
      </div>
      <p>${r.desc}</p>
    </a>`).join('');
}

// ============================================================
// Lightbox
// ============================================================
let lightboxOpen = false;

function projectClick(e, id) {
  e.preventDefault();
  if (justSwiped) return false;   // a category swipe, not a tap on the card
  openProject(id);
  return false;
}

function openProject(id) {
  const p = byId[id];
  const box = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if (!p || !box || !body) return;

  document.getElementById('lightboxTitle').textContent = `${p.title} — ${p.cat}`;
  document.getElementById('lightboxOpen').href = galleryUrl(p);
  body.innerHTML = `<iframe src="${embedUrl(p.id)}" title="${p.title}" allowfullscreen
    allow="clipboard-write" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" scrolling="yes"></iframe>`;

  box.classList.add('open');
  document.body.classList.add('no-scroll');
  lightboxOpen = true;
}

function closeLightbox() {
  const box = document.getElementById('lightbox');
  const body = document.getElementById('lightboxBody');
  if (!box) return;
  box.classList.remove('open');
  document.body.classList.remove('no-scroll');
  if (body) body.innerHTML = '';
  lightboxOpen = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightboxOpen) closeLightbox();
});

// ============================================================
// Theme
// ============================================================
let currentTheme = localStorage.getItem('mcg-theme') === 'dark' ? 'dark' : 'light';

function paintThemeIcon() {
  const icon = document.getElementById('themeIcon');
  if (!icon) return;
  icon.className = currentTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', currentTheme === 'dark' ? '#0C0C0C' : '#F7F6F3');
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('mcg-theme', currentTheme);
  paintThemeIcon();
}

// ============================================================
// Header state + active nav
// ============================================================
function initScrollUI() {
  const header = document.getElementById('siteHeader');
  const links = [...document.querySelectorAll('.nav-link')];
  const sections = links
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
}

// ============================================================
// Boot
// ============================================================
function init() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  paintThemeIcon();
  renderFilters();
  renderWork();
  applyFilter();
  initWorkSwipe();
  renderRepos();
  initScrollUI();

  window.addEventListener('resize', () => {
    if (activeFilter === 'all' && !showAllProjects) applyFilter();
  });
}

document.addEventListener('DOMContentLoaded', init);
