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



/* ============================================================
   SHARE SYSTEM — preview modal + copy + native + social
   ============================================================ */
(function(){
  const SHARE_URL = 'https://one-more-try-delta.vercel.app';
  const SHARE_TITLE = 'one more try.';

  function buildText(data){
    const base = (data.text || '').trim();
    return base ? base + '\n\n🔗 ' + SHARE_URL : '🔗 ' + SHARE_URL;
  }

  async function copyText(text){
    try {
      if (navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e){ console.warn('clipboard fail', e); }
    // Fallback: textarea
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e){ console.warn('fallback fail', e); return false; }
  }

  function openShareModal(data){
    const text = buildText(data);
    const title = data.title || 'Share';

    // Remove existing
    document.getElementById('omt-share-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'omt-share-modal';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.75); backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      display:flex; align-items:flex-end; justify-content:center;
      padding:0; animation:omtFade .25s ease;
    `;

    const sheet = document.createElement('div');
    sheet.style.cssText = `
      width:100%; max-width:520px;
      background:var(--surface,#141417); color:var(--text,#fafafa);
      border-radius:24px 24px 0 0;
      padding:24px 20px calc(24px + env(safe-area-inset-bottom));
      box-shadow:0 -20px 60px rgba(0,0,0,.5);
      animation:omtSlideUp .35s cubic-bezier(.16,1,.3,1);
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
      max-height:92vh; overflow-y:auto;
    `;

    sheet.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div style="font-weight:900;font-size:16px;letter-spacing:-.3px">${title}</div>
        <button id="omt-share-close" style="width:32px;height:32px;border-radius:10px;background:var(--surface-2,#1c1c20);border:none;color:var(--text,#fafafa);font-size:14px;font-weight:800;cursor:pointer">✕</button>
      </div>

      <div id="omt-share-preview" style="
        background:var(--surface-2,#1c1c20);
        border:1px solid var(--border,#27272a);
        border-radius:14px; padding:16px;
        font-size:13.5px; line-height:1.55;
        white-space:pre-wrap; word-break:break-word;
        max-height:180px; overflow-y:auto;
        margin-bottom:18px;
      "></div>
      <div style="font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--text-mute,#52525b);margin-bottom:10px">Share to</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
        <button data-share="whatsapp" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">💬</span>WhatsApp
        </button>
        <button data-share="twitter" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">🐦</span>Twitter
        </button>
        <button data-share="telegram" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">✈️</span>Telegram
        </button>
        <button data-share="native" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">📤</span>More
        </button>
      </div>

      <button id="omt-share-copy" style="
        width:100%; padding:16px; border-radius:14px;
        background:var(--accent,#fafafa); color:var(--accent-fg,#0a0a0a);
        font-weight:900; font-size:14px; letter-spacing:.2px;
        border:none; cursor:pointer; font-family:inherit;
        transition:transform .15s;
      ">📋 Copy to Clipboard</button>
    `;

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    // Animations
    if (!document.getElementById('omt-share-anim')){
      const style = document.createElement('style');
      style.id = 'omt-share-anim';
      style.textContent = `
        @keyframes omtFade { from{opacity:0} to{opacity:1} }
        @keyframes omtSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
      `;
      document.head.appendChild(style);
    }

    // Preview with typing animation
    const preview = sheet.querySelector('#omt-share-preview');
    preview.textContent = text;

    // Close handlers
    const close = () => {
      sheet.style.animation = 'omtSlideUp .25s cubic-bezier(.4,0,.2,1) reverse forwards';
      overlay.style.animation = 'omtFade .25s ease reverse forwards';
      setTimeout(() => overlay.remove(), 240);
    };
    sheet.querySelector('#omt-share-close').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Copy button
    const copyBtn = sheet.querySelector('#omt-share-copy');
    copyBtn.onclick = async () => {
      const ok = await copyText(text);
      if (ok){
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        if (window.OMT && window.OMT.haptic) window.OMT.haptic(15);
        setTimeout(close, 700);
      } else {
        copyBtn.textContent = '❌ Copy failed — select & copy manually';
        preview.style.userSelect = 'text';
        preview.focus();
      }
    };

    // Social buttons
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(SHARE_TITLE);
    const urls = {
      whatsapp: 'https://wa.me/?text=' + encodedText,
      twitter: 'https://twitter.com/intent/tweet?text=' + encodedText,
      telegram: 'https://t.me/share/url?url=' + encodeURIComponent(SHARE_URL) + '&text=' + encodedText,
    };

    sheet.querySelectorAll('[data-share]').forEach(btn => {
      btn.onclick = async () => {
        const key = btn.dataset.share;
        if (key === 'native'){
          if (navigator.share){
            try {
              await navigator.share({ title: SHARE_TITLE, text });
              close();
            } catch (err){
              if (err.name !== 'AbortError') console.warn('share error', err);
            }
          } else {
            const ok = await copyText(text);
            if (ok){ if (window.OMT && window.OMT.toast) window.OMT.toast('Copied 📋'); close(); }
          }
          return;
        }
        if (urls[key]){
          window.open(urls[key], '_blank', 'noopener,noreferrer');
        }
      };
    });
  }

  function shareFn(data = {}){
    if (data.files && data.files.length){
      // File share path (memes)
      if (navigator.canShare && navigator.canShare({ files: data.files })){
        return navigator.share(data).catch(() => {});
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(data.files[0]);
      link.download = data.files[0].name || 'file';
      link.click();
      return;
    }
    openShareModal(data);
  }

  if (window.OMT){
    window.OMT.share = shareFn;
    window.OMT.SHARE_URL = SHARE_URL;
    window.OMT.copyText = copyText;
  }
})();
