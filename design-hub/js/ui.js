/* design-hub/js/ui.js */
import { resources } from './data.js';
import { renderMindMap } from './mindmap.js';

let current = { section: 'designs', sub: null, mode: 'normal' };
let searchTerm = '';
let expanded = new Set();

/* ---------- LOGO INJECTION & COLOR SWAP ---------- */
const LOGO_SVG = `<!-- paste your full SVG here (the one you gave) -->`;
function injectLogo() {
  const container = document.getElementById('logo-container');
  if (!container) return;
  container.innerHTML = LOGO_SVG;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const blackFill = isDark ? '#fff' : '#000';
  container.querySelectorAll('path[fill="#000000"]').forEach(p => p.setAttribute('fill', blackFill));
}
document.addEventListener('DOMContentLoaded', injectLogo);

/* ---------- THEME ---------- */
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) themeBtn.textContent = prefersDark ? 'Light' : 'Dark';

themeBtn?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  themeBtn.textContent = isDark ? 'Dark' : 'Light';
  injectLogo();               // re-color logo
});

/* ---------- NAV (adds Show All) ---------- */
function renderNav() {
  const tree = document.getElementById('nav-tree');
  if (!tree) return;
  tree.innerHTML = '';

  // Show All
  tree.appendChild(createNavNode('all', 'Show All', 'bi-grid-3x3-gap-fill'));

  // Designs
  tree.appendChild(createNavNode('designs', 'Designs', 'bi-palette'));

  // 3D (with subs)
  const threeD = createNavNode('3d', '3D', 'bi-cube', true);
  const sub3D = document.createElement('div');
  sub3D.className = 'subnodes';
  Object.values(resources['3d'] || {}).forEach(sub => {
    const node = createNavNode(sub.id, sub.name, sub.icon, false, '3d');
    node.onclick = e => { e.stopPropagation(); selectNav(sub.id, '3d'); };
    sub3D.appendChild(node);
  });
  threeD.appendChild(sub3D);
  tree.appendChild(threeD);

  // Stores
  tree.appendChild(createNavNode('stores', 'Stores', 'bi-shop'));

  selectNav('designs');
}

function createNavNode(id, label, icon, hasSubs = false, parent = null) {
  const div = document.createElement('div');
  div.className = 'nav-node';
  div.dataset.id = id;
  div.dataset.parent = parent || '';
  div.innerHTML = `<i class="${icon}"></i> ${label}`;
  if (hasSubs) {
    div.onclick = e => {
      e.stopPropagation();
      const sub = div.querySelector('.subnodes');
      sub?.classList.toggle('open');
    };
  } else {
    div.onclick = () => selectNav(id, parent);
  }
  return div;
}

function selectNav(id, parent = null) {
  document.querySelectorAll('.nav-node').forEach(n => n.classList.remove('active'));
  const node = document.querySelector(`[data-id="${id}"]`);
  node?.classList.add('active');

  current.section = parent || id;
  current.sub = parent ? id : null;
  updatePageTitle();
  renderContent();
}

/* ---------- CONTENT ---------- */
function renderContent() {
  const data = getCurrentData();
  const filtered = filterData(data, searchTerm);
  const viewId = current.mode === 'mindmap' ? 'view-mindmap' : 'view-normal';
  const container = document.getElementById(viewId);
  if (!container) return;
  container.innerHTML = '';

  if (!filtered.length) {
    const no = document.getElementById('no-results');
    if (no) { no.style.display = 'block'; document.getElementById('query').textContent = searchTerm; }
    return;
  }
  document.getElementById('no-results')?.style.setProperty('display', 'none');

  filtered.forEach(cat => container.appendChild(createCategoryCard(cat)));
  updateStats(filtered);
}

/* Show All → merge every category */
function getCurrentData() {
  if (current.section === 'all') {
    const all = [];
    all.push(...resources.designs);
    all.push(...Object.values(resources['3d'] || {}));
    all.push(...resources.stores);
    return all;
  }
  if (current.section === '3d' && current.sub) return [resources['3d'][current.sub]];
  if (current.section === 'stores') return resources.stores;
  if (current.section === '3d') return Object.values(resources['3d'] || {});
  return resources.designs;
}

function filterData(data, term) {
  if (!term) return data;
  return data.map(cat => {
    const matches = cat.sites.filter(s => s.toLowerCase().includes(term));
    return matches.length ? { ...cat, sites: matches } : null;
  }).filter(Boolean);
}

function createCategoryCard(cat) {
  const div = document.createElement('div');
  div.className = 'category';
  const open = expanded.has(cat.id);
  div.innerHTML = `
    <div class="cat-header ${open ? 'open' : ''}" onclick="toggleCategory('${cat.id}')">
      <div class="cat-title"><i class="${cat.icon}"></i> ${cat.name}</div>
      <div class="count">${cat.sites.length}</div>
      <i class="bi bi-chevron-down toggle"></i>
    </div>
    <div class="cat-content" style="max-height:${open?'5000px':'0'};padding:${open?'1rem 1.2rem':'0 1.2rem'}">
      <table>${cat.sites.map(s => {
        const [name, url] = s.split('|');
        return `<tr><td class="name">${name}</td><td class="link"><a href="${url}" target="_blank">${url}</a>
          <button class="copy-btn" onclick="copyText('${url}')"><i class="bi bi-clipboard"></i></button></td></tr>`;
      }).join('')}</table>
    </div>`;
  return div;
}
window.toggleCategory = id => { expanded.has(id) ? expanded.delete(id) : expanded.add(id); renderContent(); };

function updatePageTitle() {
  const titles = { designs: 'Designs', '3d': '3D Tools', stores: 'Stores', all: 'All Resources' };
  const sub = current.sub && resources['3d'][current.sub]?.name;
  const titleEl = document.getElementById('page-title');
  if (titleEl) titleEl.textContent = sub || titles[current.section] || 'DesignHub';
}

function updateStats(data) {
  const total = data.reduce((s, c) => s + c.sites.length, 0);
  const statsEl = document.getElementById('stats');
  if (statsEl) statsEl.textContent = `${data.length} categories • ${total} resources`;
}

/* ---------- SEARCH ---------- */
let searchTO;
document.getElementById('search')?.addEventListener('input', e => {
  clearTimeout(searchTO);
  searchTerm = e.target.value.toLowerCase();
  searchTO = setTimeout(renderContent, 150);
});

/* ---------- MODE SWITCH ---------- */
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current.mode = btn.dataset.mode;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${current.mode}`).classList.add('active');
    if (current.mode === 'mindmap') renderMindMap();
    else renderContent();
  });
});

/* ---------- BUTTONS ---------- */
document.getElementById('expand-all')?.addEventListener('click', () => {
  expanded = new Set();
  Object.values(resources).forEach(sec => {
    if (Array.isArray(sec)) sec.forEach(c => expanded.add(c.id));
    else if (sec && typeof sec === 'object') Object.values(sec).forEach(c => expanded.add(c.id));
  });
  renderContent();
});
document.getElementById('collapse-all')?.addEventListener('click', () => { expanded.clear(); renderContent(); });
document.getElementById('copy-all')?.addEventListener('click', () => {
  let txt = '';
  Object.entries(resources).forEach(([k, v]) => {
    const cats = k === '3d' ? Object.values(v) : v;
    cats.forEach(c => txt += `${c.name}\n${c.sites.map(s=>s.split('|').join(': ')).join('\n')}\n\n`);
  });
  navigator.clipboard.writeText(txt.trim());
  alert('All 1,024 sites copied!');
});
window.copyText = txt => { navigator.clipboard.writeText(txt); alert('Copied!'); };

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderContent();

  // default mode button (prevents null.click)
  document.querySelector('.mode-btn[data-mode="normal"]')?.click();

  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
