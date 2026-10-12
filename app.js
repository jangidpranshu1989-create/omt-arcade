/* ============================================================
   one more try. — Core Engine
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rand(0, arr.length - 1)];
const shuffle = arr => arr
  .map(v => [Math.random(), v])
  .sort((x, y) => x[0] - y[0])
  .map(v => v[1]);
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/* ---------- Number formatting (Indian system) ---------- */
function fmtINR(n) {
  if (!isFinite(n)) return '₹0';
  const abs = Math.abs(n);
  if (abs >= 1e12) return '₹' + (n / 1e12).toFixed(2) + ' Lakh Cr';
  if (abs >= 1e7)  return '₹' + (n / 1e7).toFixed(2)  + ' Cr';
  if (abs >= 1e5)  return '₹' + (n / 1e5).toFixed(2)  + ' L';
  if (abs >= 1e3)  return '₹' + (n / 1e3).toFixed(1)  + 'K';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
function fmtNum(n) {
  if (!isFinite(n)) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.round(n).toLocaleString('en-IN');
}
function fmtCompact(n) {
  if (Math.abs(n) >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(1) + 'B';
  if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(1) + 'M';
  if (Math.abs(n) >= 1e3)  return (n / 1e3).toFixed(1) + 'K';
  return Math.round(n).toString();
}

/* ---------- Smooth number rolling animation ---------- */
function rollNumber(el, from, to, duration = 700, formatter = fmtINR) {
  if (!el) return;
  const start = performance.now();
  const diff = to - from;
  function tick(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - t, 4);
    const val = from + diff * eased;
    el.textContent = formatter(val);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatter(to);
  }
  requestAnimationFrame(tick);
}

/* ---------- Toast ---------- */
let toastTimer = null;
function toast(msg, duration = 2200) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), duration);
}

/* ---------- Haptic ---------- */
function haptic(ms = 10) {
  if (navigator.vibrate) navigator.vibrate(ms);
}

/* ============================================================
   GAME REGISTRY
   ============================================================ */
const REGISTRY = {};   // id -> renderer function
const CATALOG  = [];   // metadata

function register(id, meta, renderer) {
  const idx = CATALOG.findIndex(g => g.id === id);
  if (idx >= 0) {
    CATALOG[idx] = { id, ...meta };
  } else {
    CATALOG.push({ id, ...meta });
  }
  if (renderer) REGISTRY[id] = renderer;
}

/* ============================================================
   PERSISTENCE
   ============================================================ */
const STORE = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem('omt:' + key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem('omt:' + key, JSON.stringify(val)); } catch {}
  },
};

/* ---------- Recently played ---------- */
function pushRecent(id) {
  let list = STORE.get('recent', []);
  list = [id, ...list.filter(x => x !== id)].slice(0, 12);
  STORE.set('recent', list);
}
function getRecent() { return STORE.get('recent', []); }

/* ---------- Favorites ---------- */
function toggleFav(id) {
  let favs = STORE.get('favs', []);
  if (favs.includes(id)) favs = favs.filter(x => x !== id);
  else favs = [id, ...favs];
  STORE.set('favs', favs);
  return favs.includes(id);
}
function isFav(id) { return STORE.get('favs', []).includes(id); }
function getFavs() { return STORE.get('favs', []); }

/* ============================================================
   THEME
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = $('#theme-toggle');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  const meta = document.querySelector('meta[name=theme-color]');
  if (meta) meta.content = theme === 'dark' ? '#09090b' : '#fafafa';
}
function initTheme() {
  const saved = STORE.get('theme');
  const prefers = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (prefers ? 'dark' : 'light'));
}
function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  STORE.set('theme', next);
}

/* ============================================================
   GRID
   ============================================================ */
let activeCategory = 'All';
let activeSearch   = '';

function getCategories() {
  const set = new Set();
  CATALOG.forEach(g => g.category && set.add(g.category));
  return ['All', 'Favorites', ...set];
}

function renderChips() {
  const el = $('#chips');
  if (!el) return;
  const cats = getCategories();
  el.innerHTML = cats.map(c => {
    const active = c === activeCategory ? ' active' : '';
    return `<button class="chip${active}" data-cat="${c}">${c}</button>`;
  }).join('');
}

function filterCatalog() {
  const q = activeSearch.trim().toLowerCase();
  const favs = getFavs();
  return CATALOG.filter(g => {
    if (activeCategory === 'Favorites' && !favs.includes(g.id)) return false;
    if (activeCategory !== 'All' && activeCategory !== 'Favorites'
        && g.category !== activeCategory) return false;
    if (q) {
      const hay = (g.title + ' ' + (g.desc || '') + ' ' + (g.tags || []).join(' ')).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderGrid() {
  const grid = $('#grid');
  if (!grid) return;
  const list = filterCatalog();

  if (!list.length) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;padding:80px 20px;text-align:center;color:var(--text-mute)">
        <div style="font-size:40px;margin-bottom:12px">∅</div>
        <div style="font-weight:700;font-size:14px">No experiments match</div>
        <div style="font-size:12px;margin-top:6px">Try different filters</div>
      </div>`;
    return;
  }

  const frag = document.createDocumentFragment();
  list.forEach((g, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.id = g.id;
    card.style.animationDelay = Math.min(i * 18, 480) + 'ms';
    const fav = isFav(g.id);
    card.innerHTML = `
      <div class="card__top">
        <div class="card__emoji">${g.icon}</div>
        <div class="card__tag${g.tag === 'Original' ? ' original' : ''}">${g.tag || 'Experiment'}</div>
      </div>
      <h3 class="card__title">${g.title}</h3>
      <p class="card__desc">${g.desc || ''}</p>
      <div class="card__bottom">
        <span>${fav ? '★ Saved' : 'Play'}</span>
        <span class="arrow">${g.type === 'native' ? '▶' : '↗'}</span>
      </div>`;

    // Mouse follow for hover glow
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    frag.appendChild(card);
  });

  grid.innerHTML = '';
  grid.appendChild(frag);
}

/* ============================================================
   MODAL
   ============================================================ */
const modalEl = () => $('#modal');
const bodyEl  = () => $('#modal-body');
const titleEl = () => $('#modal-title');

let activeGame = null;

function openGame(id) {
  const game = CATALOG.find(g => g.id === id);
  if (!game) return;

  activeGame = game;
  pushRecent(id);

  titleEl().textContent = game.title;
  bodyEl().innerHTML = '';
  modalEl().classList.add('active');
  document.body.style.overflow = 'hidden';

  const renderer = REGISTRY[id];
  if (!renderer) {
    bodyEl().innerHTML = `
      <div class="ui">
        <h2 class="ui__title">Coming soon</h2>
        <p class="ui__sub">This experiment is still in the lab.</p>
      </div>`;
    return;
  }

  try {
    renderer(bodyEl());
  } catch (err) {
    console.error(err);
    bodyEl().innerHTML = `
      <div class="ui">
        <h2 class="ui__title">Something broke</h2>
        <p class="ui__sub">${(err && err.message) || 'Unknown error'}</p>
      </div>`;
  }
}

function closeModal() {
  modalEl().classList.remove('active');
  document.body.style.overflow = '';
  activeGame = null;
  setTimeout(() => {
    if (!modalEl().classList.contains('active')) bodyEl().innerHTML = '';
  }, 400);
}

/* ============================================================
   EVENT WIRING
   ============================================================ */
function wireEvents() {
  // Grid — event delegation
  $('#grid').addEventListener('click', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    haptic(8);
    openGame(card.dataset.id);
  });

  // Chips
  $('#chips').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    renderChips();
    renderGrid();
    haptic(6);
  });

  // Search
  const search = $('#search');
  search.addEventListener('input', e => {
    activeSearch = e.target.value;
    renderGrid();
  });

  // Keyboard: "/" to focus search, Esc to close modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (modalEl().classList.contains('active')) closeModal();
      else if (document.activeElement === search) search.blur();
    }
    if (e.key === '/' && document.activeElement !== search
        && !modalEl().classList.contains('active')) {
      e.preventDefault();
      search.focus();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      search.focus();
      search.select();
    }
  });

  // Modal close
  $('#modal-close').addEventListener('click', closeModal);
  $('.modal__backdrop').addEventListener('click', closeModal);

  // Theme
  $('#theme-toggle').addEventListener('click', toggleTheme);
}

/* ============================================================
   BOOT
   ============================================================ */
function boot() {
  initTheme();
  wireEvents();
  renderChips();
  renderGrid();

  const count = CATALOG.length;
  const el = $('#hero-count');
  if (el) rollNumber(el, 0, count, 900, v => Math.round(v).toString());

  // Hide boot screen
  const hide = () => $('#boot').classList.add('done');
  if (document.readyState === 'complete') setTimeout(hide, 500);
  else window.addEventListener('load', () => setTimeout(hide, 500));
  setTimeout(hide, 2000); // hard fallback
}

/* ---------- Wait for games to register, then boot ---------- */
function startup() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
}
startup();

/* ============================================================
   UTILITIES exposed for game renderers
   ============================================================ */
window.OMT = {
  $, $$, rand, pick, shuffle, clamp,
  fmtINR, fmtNum, fmtCompact,
  rollNumber,
  toast, haptic,
  register,
  STORE,
  isFav, toggleFav, getFavs,
  pushRecent, getRecent,
  closeModal,
};
