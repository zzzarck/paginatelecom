
/* ══ RENDER GRID ══ */
function renderGrid(filtro) {
  const data = filtro === 'all' ? antenas : antenas.filter(a => a.tagClass === filtro);
  document.getElementById('grid').innerHTML = data.map(a=>`
    <div class="card" data-id="${a.id}" data-tag="${a.tagClass}">
      <div class="card-img-wrap">
        <img class="card-img" src="${a.img}" alt="${a.title}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" loading="lazy">
        <div class="card-img-placeholder"><i class="ti ti-antenna" aria-hidden="true"></i></div>
        <div class="card-img-overlay"></div>
      </div>
      <div class="card-body">
        <span class="card-tag ${a.tagClass}">${a.tag}</span>
        <p class="card-title">${a.title}</p>
        <p class="card-sub">${a.subtitle}</p>
        <div class="card-actions">
          <button class="card-btn btn-specs" onclick="openModal(${a.id})">
            <i class="ti ti-list-details"></i> Especificaciones
          </button>
          <button class="card-btn btn-detail" onclick="openDetail(${a.id})">
            <i class="ti ti-book-2"></i> Conocer más
          </button>
        </div>
      </div>
    </div>
  `).join('');

  /* Animación de entrada escalonada */
  document.querySelectorAll('.card').forEach((card, i) => {
    setTimeout(() => card.classList.add('visible'), i * 80);
  });
}

/* ══ MODAL SPECS ══ */
function openModal(id){
  const a = antenas.find(x=>x.id===id);
  if(!a) return;
  document.getElementById('m-title').textContent = a.title + ' — ' + a.subtitle;
  const img = document.getElementById('m-img');
  if(a.img){ img.src=a.img; img.alt=a.title; img.style.display='block'; }
  else { img.style.display='none'; }
  const tag = document.getElementById('m-tag');
  tag.textContent = a.tag; tag.className = 'modal-tag ' + a.tagClass;
  document.getElementById('m-desc').textContent = a.desc;
  document.getElementById('m-specs').innerHTML = a.specs.map(s=>`
    <div class="spec-row">
      <span class="spec-label">${s.label}</span>
      <span class="spec-value">${s.value}</span>
    </div>`).join('');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeModalDirect(){
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function closeModal(e){
  if(e.target===document.getElementById('overlay')) closeModalDirect();
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModalDirect(); });

/* ══ PANEL DETALLE ══ */
let openDetailId = null;

function openDetail(id) {
  const a = antenas.find(x => x.id === id);
  if (!a) return;

  const container = document.getElementById('detailContainer');

  /* Cierra el anterior si estaba abierto */
  if (openDetailId === id) {
    closeDetail(id);
    return;
  }
  if (openDetailId !== null) {
    const prev = document.getElementById(`detail-${openDetailId}`);
    if (prev) prev.remove();
  }
  openDetailId = id;

  /* Construir las tabs de detalle */
  const tabKeys = Object.keys(a.detail);
  const tabsHTML = tabKeys.map((k, i) => `
    <button class="detail-tab ${i === 0 ? 'active' : ''}" onclick="switchTab(${id}, '${k}', this)">
      ${a.detail[k].titulo}
    </button>
  `).join('');

  const panesHTML = tabKeys.map((k, i) => `
    <div class="tab-pane ${i === 0 ? 'active' : ''}" id="pane-${id}-${k}">
      ${a.detail[k].contenido}
    </div>
  `).join('');

  const panel = document.createElement('div');
  panel.className = 'detail-panel open';
  panel.id = `detail-${id}`;
  panel.innerHTML = `
    <div class="detail-hero">
      <img src="${a.img}" alt="${a.title}">
      <div class="detail-hero-overlay">
        <div class="detail-hero-text">
          <span class="card-tag ${a.tagClass}" style="margin-bottom:12px">${a.tag}</span>
          <h3>${a.title}</h3>
          <p>${a.subtitle} — Guía completa</p>
        </div>
      </div>
      <button class="detail-close-btn" onclick="closeDetail(${id})" title="Cerrar">
        <i class="ti ti-x"></i>
      </button>
    </div>
    <div class="detail-tabs">${tabsHTML}</div>
    <div class="detail-content">${panesHTML}</div>
  `;

  container.appendChild(panel);

  /* Scroll suave hasta el panel */
  setTimeout(() => {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

function closeDetail(id) {
  const panel = document.getElementById(`detail-${id}`);
  if (panel) {
    panel.style.animation = 'none';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(16px)';
    panel.style.transition = 'all 0.3s ease';
    setTimeout(() => panel.remove(), 300);
  }
  openDetailId = null;
}

function switchTab(id, key, btn) {
  /* Desactivar todas las tabs y panes de este panel */
  const panel = document.getElementById(`detail-${id}`);
  panel.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
  panel.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  /* Activar la tab y pane seleccionados */
  btn.classList.add('active');
  const pane = document.getElementById(`pane-${id}-${key}`);
  if (pane) pane.classList.add('active');
}

/* ══ FILTROS ══ */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    /* Cerrar detalle abierto al filtrar */
    if (openDetailId !== null) closeDetail(openDetailId);
    renderGrid(btn.dataset.filter);
  });
});

/* ══ STARS ══ */
(function() {
  const bg = document.getElementById('starsBg');
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left   = Math.random() * 100 + '%';
    s.style.top    = Math.random() * 100 + '%';
    s.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    s.style.setProperty('--delay', (-Math.random() * 4) + 's');
    s.style.width = s.style.height = (Math.random() > 0.7 ? 3 : 2) + 'px';
    bg.appendChild(s);
  }
})();

/* ══ CANVAS ONDAS ══ */
const canvas = document.getElementById('waveCanvas');
const ctx    = canvas.getContext('2d');
let W, H, cx, cy;

function resize(){
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  cx = W / 2; cy = H * 0.38;
}
window.addEventListener('resize', resize);

const rings = [];
const RING_COLORS = [
  'rgba(56,189,248,',
  'rgba(99,102,241,',
  'rgba(20,184,166,',
  'rgba(139,92,246,',
];

function spawnRing(){
  rings.push({
    r: 10,
    maxR: Math.max(W, H) * 0.7,
    colorBase: RING_COLORS[Math.floor(Math.random()*RING_COLORS.length)],
    speed: 1.0 + Math.random() * 1.4,
    lineWidth: 1 + Math.random() * 2,
  });
}

/* Partículas mejoradas */
const particles = [];
for(let i = 0; i < 60; i++){
  particles.push({
    x: Math.random(), y: Math.random(),
    r: 0.5 + Math.random() * 2,
    speed: 0.0001 + Math.random() * 0.00025,
    alpha: 0.15 + Math.random() * 0.4,
    drift: (Math.random()-0.5)*0.00015,
    hue: Math.random() > 0.5 ? '56,189,248' : '99,102,241',
  });
}

/* Líneas conectoras entre partículas cercanas */
function drawConnectors(){
  const pts = particles.map(p => ({x: p.x*W, y: p.y*H, a: p.alpha}));
  for(let i = 0; i < pts.length; i++){
    for(let j = i+1; j < pts.length; j++){
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 80){
        const alpha = (1 - dist/80) * 0.08;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

let lastSpawn = 0;
const SPAWN_INTERVAL = 850;

function draw(ts){
  ctx.clearRect(0, 0, W, H);

  /* Partículas + conectores */
  particles.forEach(p=>{
    p.y -= p.speed;
    p.x += p.drift;
    if(p.y < 0) { p.y=1; p.x=Math.random(); }
    ctx.beginPath();
    ctx.arc(p.x*W, p.y*H, p.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${p.hue},${p.alpha})`;
    ctx.fill();
  });
  drawConnectors();

  /* Spawn */
  if(ts - lastSpawn > SPAWN_INTERVAL){ spawnRing(); lastSpawn=ts; }

  /* Anillos */
  for(let i = rings.length-1; i>=0; i--){
    const ring = rings[i];
    ring.r += ring.speed;
    const progress = ring.r / ring.maxR;
    const alpha = (1 - progress) * 0.5;
    if(alpha <= 0 || ring.r > ring.maxR){ rings.splice(i,1); continue; }
    ctx.beginPath();
    ctx.arc(cx, cy, ring.r, 0, Math.PI*2);
    ctx.strokeStyle = ring.colorBase + alpha + ')';
    ctx.lineWidth = ring.lineWidth * (1 - progress * 0.5);
    ctx.stroke();
  }

  requestAnimationFrame(draw);
}

/* ══ CONTADOR ANIMADO ══ */
function animateCounters(){
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 30);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if(current >= target) clearInterval(interval);
    }, 50);
  });
}

/* ══ INTERSECTION OBSERVER ══ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

/* ══ INIT ══ */
resize();
requestAnimationFrame(draw);
renderGrid('all');
setTimeout(animateCounters, 400);