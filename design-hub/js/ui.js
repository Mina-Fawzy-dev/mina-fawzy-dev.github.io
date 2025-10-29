// js/ui.js — FIXED renderNav 

import { resources } from './data.js';
import { renderMindMap } from './mindmap.js';
import { setupPWA } from './pwa.js';

let current = { section: 'designs', sub: null, mode: 'normal' };
let searchTerm = '';
let expanded = new Set();

// === NAVIGATION TREE ===
function renderNav() {
  const tree = document.getElementById('nav-tree');
  tree.innerHTML = '';

  // Designs
  const designsNode = createNavNode('designs', 'Designs', 'bi-palette', true);
  tree.appendChild(designsNode);

  // 3D (with subnodes)
  const threeDNode = createNavNode('3d', '3D', 'bi-cube', true);
  const sub3D = document.createElement('div');
  sub3D.className = 'subnodes';
  Object.values(resources['3d']).forEach(sub => {
    const subNode = createNavNode(sub.id, sub.name, sub.icon, false, '3d');
    subNode.onclick = (e) => {
      e.stopPropagation();
      selectNav(sub.id, '3d');
    };
    sub3D.appendChild(subNode);
  });
  threeDNode.appendChild(sub3D);
  tree.appendChild(threeDNode);

  // Stores
  const storesNode = createNavNode('stores', 'Stores & Tutorials', 'bi-shop');
  tree.appendChild(storesNode);

  // Select default
  selectNav('designs');
}

function createNavNode(id, label, icon, hasSubs = false, parent = null) {
  const div = document.createElement('div');
  div.className = 'nav-node';
  div.dataset.id = id;
  div.dataset.parent = parent;
  div.innerHTML = `<i class="${icon}"></i> ${label}`;
  if (hasSubs) {
    div.onclick = (e) => {
      e.stopPropagation();
      const sub = div.querySelector('.subnodes');
      sub.classList.toggle('open');
    };
  } else {
    div.onclick = () => selectNav(id, parent);
  }
  return div;
}

function selectNav(id, parent = null) {
  document.querySelectorAll('.nav-node').forEach(n => n.classList.remove('active'));
  const node = document.querySelector(`[data-id="${id}"]`);
  if (node) node.classList.add('active');
  current.section = parent || id;
  current.sub = parent ? id : null;
  updatePageTitle();
  renderContent();
}

// === CONTENT RENDERING ===
function renderContent() {
  const data = getCurrentData();
  const filtered = filterData(data, searchTerm);
  const viewId = current.mode === 'mindmap' ? '#view-mindmap' : 
                 current.mode === 'advanced' ? '#view-advanced' : '#view-normal';
  const container = document.querySelector(viewId);
  container.innerHTML = '';

  if (!filtered.length) {
    showNoResults();
    return;
  }

  hideNoResults();
  filtered.forEach(cat => {
    const card = createCategoryCard(cat);
    container.appendChild(card);
  });
  updateStats(filtered);
}

function getCurrentData() {
  if (current.section === '3d' && current.sub) {
    return [resources['3d'][current.sub]];
  }
  return current.section === 'stores' ? resources.stores :
         current.section === '3d' ? Object.values(resources['3d']) :
         resources.designs;
}

function filterData(data, term) {
  if (!term) return data;
  return data.map(cat => {
    const matches = cat.sites.filter(s => 
      s.toLowerCase().includes(term)
    );
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
    <div class="cat-content" style="max-height: ${isOpen ? '5000px' : '0'}; padding: ${isOpen ? '1rem 1.2rem' : '0 1.2rem'}">
      <table>
        ${cat.sites.map(s => {
          const [name, url] = s.split('|');
          return `<tr>
            <td class="name">${name}</td>
            <td class="link">
              <a href="${url}" target="_blank">${url}</a>
              <button class="copy-btn" onclick="copyText('${url}')"><i class="bi bi-clipboard"></i></button>
            </td>
          </tr>`;
        }).join('')}
      </table>
    </div>
  `;
  return div;
}

window.toggleCategory = function(id) {
  expanded.has(id) ? expanded.delete(id) : expanded.add(id);
  renderContent();
};

function updatePageTitle() {
  const titles = {
    designs: 'Designs',
    '3d': '3D Tools',
    stores: 'Stores & Tutorials'
  };
  const sub = current.sub ? resources['3d'][current.sub].name : '';
  document.getElementById('page-title').textContent = sub || titles[current.section] || 'DesignHub';
}

function updateStats(data) {
  const totalSites = data.reduce((sum, cat) => sum + cat.sites.length, 0);
  document.getElementById('stats').textContent = 
    `Showing ${data.length} categories • ${totalSites} resources`;
}

function showNoResults() {
  document.getElementById('no-results').style.display = 'block';
  document.getElementById('query').textContent = searchTerm;
}

function hideNoResults() {
  document.getElementById('no-results').style.display = 'none';
}

// === SEARCH ===
let searchTimeout;
document.getElementById('search').oninput = (e) => {
  clearTimeout(searchTimeout);
  searchTerm = e.target.value.toLowerCase();
  searchTimeout = setTimeout(renderContent, 150);
};

// === MODE SWITCHER ===
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
document.getElementById('expand-all').onclick = () => {
  Object.keys(resources).forEach(sec => {
    if (sec === '3d') Object.keys(resources['3d']).forEach(id => expanded.add(id));
    else if (Array.isArray(resources[sec])) resources[sec].forEach(c => expanded.add(c.id));
  });
  renderContent();
};

document.getElementById('collapse-all').onclick = () => {
  expanded.clear();
  renderContent();
};

document.getElementById('copy-all').onclick = () => {
  let text = '';
  const all = { ...resources };
  if (all['3d']) all['3d'] = Object.values(all['3d']);
  Object.values(all).flat().forEach(cat => {
    text += `${cat.name}\n`;
    cat.sites.forEach(s => {
      const [n, u] = s.split('|');
      text += `  ${n}: ${u}\n`;
    });
    text += '\n';
  });
  navigator.clipboard.writeText(text.trim());
  alert('All 1,024 sites copied!');
};

window.copyText = (text) => {
  navigator.clipboard.writeText(text);
  alert('Copied!');
};

document.getElementById('theme-toggle').onclick = () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
  document.getElementById('theme-toggle').textContent = isLight ? 'Light' : 'Dark';
};

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderContent();
  setupPWA();
  document.getElementById('mode-normal').click(); // default
});
