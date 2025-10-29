/* design-hub/js/mindmap.js */
export function renderMindMap() {
  const container = document.getElementById('view-mindmap');
  if (!container) return;
  container.innerHTML = '<canvas id="mindmap-canvas" width="800" height="600"></canvas>';

  const canvas = document.getElementById('mindmap-canvas');
  const ctx = canvas.getContext('2d');

  // ---- simple demo graph ----
  const nodes = [
    { id: 'root', label: 'DesignHub', x: 400, y: 300, r: 40 },
    { id: 'd1', label: 'Designs', x: 200, y: 150, r: 30 },
    { id: 'd2', label: '3D', x: 600, y: 150, r: 30 },
    { id: 'd3', label: 'Stores', x: 400, y: 450, r: 30 }
  ];
  const links = [
    { from: 'root', to: 'd1' },
    { from: 'root', to: 'd2' },
    { from: 'root', to: 'd3' }
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#d3fe00';
    ctx.fillStyle = '#111';

    links.forEach(l => {
      const a = nodes.find(n => n.id === l.from);
      const b = nodes.find(n => n.id === l.to);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d3fe00';
      ctx.font = '14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, n.x, n.y + 5);
      ctx.fillStyle = '#111';
    });
  }
  draw();

  // ---- click handler – just logs the node (no loadSection) ----
  canvas.onclick = e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r);
    if (hit) console.log('Mind-map node clicked:', hit.label);
  };
}

/* expose a tiny helper used by ui.js when switching back to list view */
export function loadSection() {
  // placeholder – ui.js never calls it any more
}
