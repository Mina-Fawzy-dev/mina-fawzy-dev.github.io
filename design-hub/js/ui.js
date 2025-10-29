import { resources } from './data.js';
import { renderMindMap } from './mindmap.js';

let current = { section: 'designs', sub: null, mode: 'normal' };
let searchTerm = '';
let expanded = new Set();

// === THEME ===
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
document.getElementById('theme-toggle').textContent = prefersDark ? 'Light' : 'Dark';
document.getElementById('theme-toggle').onclick = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  document.getElementById('theme-toggle').textContent = isDark ? 'Dark' : 'Light';
};

// === NAV ===
function renderNav() {
  const tree = document.getElementById('nav-tree');
  tree.innerHTML = '';

  // Designs
  tree.appendChild(createNavNode('designs', 'Designs', 'bi-palette'));

  // 3D
  const threeD = createNavNode('3d', '3D', 'bi-cube', true);
  const sub3D = document.createElement('div');
  sub3D.className = 'subnodes';
  Object.values(resources['3d']).forEach(sub => {
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

// === RENDER ===
function renderContent() {
  const data = getCurrentData();
  const filtered = filterData(data, searchTerm);
  const container = document.getElementById(current.mode === 'mindmap' ? 'view-mindmap' : 'view-normal');
  container.innerHTML = '';

  if (!filtered.length) {
    document.getElementById('no-results').style.display = 'block';
    document.getElementById('query').textContent = searchTerm;
    return;
  }
  document.getElementById('no-results').style.display = 'none';

  filtered.forEach(cat => container.appendChild(createCategoryCard(cat)));
  updateStats(filtered);
}

function getCurrentData() {
  if (current.section === '3d' && current.sub) return [resources['3d'][current.sub]];
  if (current.section === 'stores') return resources.stores;
  if (current.section === '3d') return Object.values(resources['3d']);
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
  const isOpen = expanded.has(cat.id);
  div.innerHTML = `
    <div class="cat-header ${isOpen ? 'open' : ''}" onclick="toggleCategory('${cat.id}')">
      <div class="cat-title"><i class="${cat.icon}"></i> ${cat.name}</div>
      <div class="count">${cat.sites.length}</div>
      <i class="bi bi-chevron-down toggle"></i>
    </div>
    <div class="cat-content" style="max-height:${isOpen?'5000px':'0'};padding:${isOpen?'1rem 1.2rem':'0 1.2rem'}">
      <table>${cat.sites.map(s => {
        const [name, url] = s.split('|');
        return `<tr><td class="name">${name}</td><td class="link"><a href="${url}" target="_blank">${url}</a>
          <button class="copy-btn" onclick="copyText('${url}')"><i class="bi bi-clipboard"></i></button>
        </td></tr>`;
      }).join('')}</table>
    </div>`;
  return div;
}

window.toggleCategory = id => {
  expanded.has(id) ? expanded.delete(id) : expanded.add(id);
  renderContent();
};

function updatePageTitle() {
  const titles = { designs: 'Designs', '3d': '3D Tools', stores: 'Stores' };
  const sub = current.sub && resources['3d'][current.sub]?.name;
  document.getElementById('page-title').textContent = sub || titles[current.section] || 'DesignHub';
}

function updateStats(data) {
  const total = data.reduce((s, c) => s + c.sites.length, 0);
  document.getElementById('stats').textContent = `${data.length} categories • ${total} resources`;
}

// === SEARCH ===
let timeout;
document.getElementById('search').oninput = e => {
  clearTimeout(timeout);
  searchTerm = e.target.value.toLowerCase();
  timeout = setTimeout(renderContent, 150);
};

// === MODES ===
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current.mode = btn.dataset.mode;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${current.mode}`).classList.add('active');
    if (current.mode === 'mindmap') renderMindMap();
    else renderContent();
  };
});

// === BUTTONS ===
document.getElementById('expand-all').onclick = () => { expanded = new Set([...expanded, ...Object.keys(resources).flatMap(k => Array.isArray(resources[k]) ? resources[k].map(c=>c.id) : Object.keys(resources[k]))]); renderContent(); };
document.getElementById('collapse-all').onclick = () => { expanded.clear(); renderContent(); };
document.getElementById('copy-all').onclick = () => {
  let text = '';
  Object.entries(resources).forEach(([k, v]) => {
    const cats = k === '3d' ? Object.values(v) : v;
    cats.forEach(c => { text += `${c.name}\n${c.sites.map(s=>s.split('|').join(': ')).join('\n')}\n\n`; });
  });
  navigator.clipboard.writeText(text.trim());
  alert('All 1,024 sites copied!');
};
window.copyText = text => { navigator.clipboard.writeText(text); alert('Copied!'); };

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderContent();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
