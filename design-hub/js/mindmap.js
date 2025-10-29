// js/mindmap.js
export function renderMindMap() {
  const container = document.getElementById('view-mindmap');
  container.innerHTML = '<canvas id="mindcanvas"></canvas>';
  const canvas = document.getElementById('mindcanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const nodes = [
    { id: 'home', x: canvas.width/2, y: canvas.height/2, label: 'DesignHub', color: '#00d4aa' },
    { id: 'designs', x: 200, y: 150, label: 'Designs', parent: 'home' },
    { id: '3d', x: 600, y: 150, label: '3D', parent: 'home' },
    // ... subnodes
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(node => {
      if (node.parent) {
        const parent = nodes.find(n => n.id === node.parent);
        ctx.beginPath();
        ctx.moveTo(parent.x, parent.y);
        ctx.lineTo(node.x, node.y);
        ctx.strokeStyle = '#00d4aa';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.fillStyle = node.color || '#141423';
      ctx.fillRect(node.x - 60, node.y - 30, 120, 60);
      ctx.fillStyle = '#fff';
      ctx.font = '14px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 5);
    });
  }

  draw();
  canvas.onclick = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const clicked = nodes.find(n => Math.abs(n.x - x) < 60 && Math.abs(n.y - y) < 30);
    if (clicked && clicked.id === '3d') {
      // Load 3D section
      loadSection('3d');
    }
  };
}
