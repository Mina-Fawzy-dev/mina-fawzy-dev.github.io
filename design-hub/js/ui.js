// js/ui.js
import { resources } from './data.js';
import { setupPWA } from './pwa.js';

let current = { section: 'designs', sub: null, mode: 'normal' };
let searchTerm = '';
let expanded = new Set();

// Virtual List Renderer (only visible items)
function renderVirtual(container, items, renderer) {
  const fragment = document.createDocumentFragment();
  items.forEach(item => fragment.appendChild(renderer(item)));
  container.innerHTML = '';
  container.appendChild(fragment);
}

// Render Normal/Advanced Mode
function renderList() {
  const data = getCurrentData();
  const filtered = filterData(data, searchTerm);
  const view = current.mode === 'advanced' ? '#view-advanced' : '#view-normal';
  const container = document.querySelector(view);
  container.innerHTML = '';

  if (!filtered.length) {
    document.getElementById('no-results').style.display = 'block';
    document.getElementById('query').textContent = searchTerm;
    return;
  }

  document.getElementById('no-results').style.display = 'none';
  renderVirtual(container, filtered, createCategoryCard);
  updateStats(filtered);
}

// Create Category Card
function createCategoryCard(cat) {
  const div = document.createElement('div');
  div.className = 'category';
  div.innerHTML = `
    <div class="cat-header" onclick="toggle('${cat.id}')">
      <div class="cat-title"><i class="${cat.icon}"></i> ${cat.name}</div>
      <div class="count">${cat.sites.length}</div>
      <i class="bi bi-chevron-down toggle"></i>
    </div>
    <div class="cat-content" id="content-${cat.id}">
      <table>...</table>
    </div>
  `;
  return div;
}

// Toggle Expand
window.toggle = function(id) {
  const content = document.getElementById(`content-${id}`);
  const parent = content.parentElement;
  parent.classList.toggle('open');
  expanded.has(id) ? expanded.delete(id) : expanded.add(id);
};

// Search + Debounce
let searchTimeout;
document.getElementById('search').oninput = (e) => {
  clearTimeout(searchTimeout);
  searchTerm = e.target.value.toLowerCase();
  searchTimeout = setTimeout(renderList, 150);
};

// Mode Switch
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    current.mode = btn.dataset.mode;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${current.mode}`).classList.add('active');
    if (current.mode === 'mindmap') renderMindMap();
    else renderList();
  };
});

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderList();
  setupPWA();
});
