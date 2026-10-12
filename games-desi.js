/* ============ DESI GAMES — 10 originals (v2 fixed) ============ */
(function(){
const { $, $$, rand, pick, shuffle, clamp, fmtINR, fmtNum, rollNumber, toast, haptic, register, STORE } = OMT;

/* ---------- 1. SPEND CROPEPATI MONEY ---------- */
const BILLIONAIRES = [
  { id:'adani',  name:'Gautam Adani',   wealth:9.23e12, emoji:'🏭', blurb:'Founder, Adani Group' },
  { id:'ambani', name:'Mukesh Ambani',  wealth:8.63e12, emoji:'🛢️', blurb:'Chairman, Reliance Industries' },
  { id:'mittal', name:'Lakshmi Mittal', wealth:3.20e12, emoji:'⚙️', blurb:'Chairman, ArcelorMittal' },
  { id:'shiv',   name:'Shiv Nadar',     wealth:2.80e12, emoji:'💻', blurb:'Founder, HCL Technologies' },
];

const CATALOG_ITEMS = [
  { id:'vp',cat:'Food',emoji:'🥟',name:'Vada Pav',price:20,unit:'plate' },
  { id:'ch',cat:'Food',emoji:'☕',name:'Chai',price:15,unit:'cup' },
  { id:'sa',cat:'Food',emoji:'🥟',name:'Samosa',price:15,unit:'piece' },
  { id:'pb',cat:'Food',emoji:'🍛',name:'Pav Bhaji',price:80,unit:'plate' },
  { id:'cb',cat:'Food',emoji:'🍲',name:'Chole Bhature',price:100,unit:'plate' },
  { id:'bi',cat:'Food',emoji:'🍚',name:'Biryani (Dum)',price:250,unit:'plate' },
  { id:'ds',cat:'Food',emoji:'🥘',name:'Masala Dosa',price:120,unit:'plate' },
  { id:'th',cat:'Food',emoji:'🍽️',name:'Rajasthani Thali',price:400,unit:'plate' },
  { id:'mg',cat:'Food',emoji:'🎂',name:'Designer Cake',price:15000,unit:'cake' },
  { id:'cav',cat:'Food',emoji:'🥫',name:'Caviar (50g)',price:85000,unit:'tin' },
  { id:'nano',cat:'Vehicles',emoji:'🚗',name:'Tata Nano',price:250000,unit:'car' },
  { id:'alto',cat:'Vehicles',emoji:'🚙',name:'Maruti Alto',price:400000,unit:'car' },
  { id:'thar',cat:'Vehicles',emoji:'🚙',name:'Mahindra Thar',price:1600000,unit:'car' },
  { id:'safari',cat:'Vehicles',emoji:'🚙',name:'Tata Safari',price:2200000,unit:'car' },
  { id:'fortuner',cat:'Vehicles',emoji:'🚘',name:'Toyota Fortuner',price:4500000,unit:'car' },
  { id:'bmw',cat:'Vehicles',emoji:'🚘',name:'BMW 5 Series',price:7500000,unit:'car' },
  { id:'splend',cat:'Vehicles',emoji:'🏍️',name:'Hero Splendor',price:75000,unit:'bike' },
  { id:'re350',cat:'Vehicles',emoji:'🏍️',name:'Royal Enfield 350',price:200000,unit:'bike' },
  { id:'duke',cat:'Vehicles',emoji:'🏍️',name:'KTM Duke 390',price:310000,unit:'bike' },
  { id:'ducati',cat:'Vehicles',emoji:'🏍️',name:'Ducati Panigale',price:2500000,unit:'bike' },
  { id:'ferrari',cat:'Luxury',emoji:'🏎️',name:'Ferrari SF90',price:75600000,unit:'car' },
  { id:'lambo',cat:'Luxury',emoji:'🏎️',name:'Lamborghini Revuelto',price:88900000,unit:'car' },
  { id:'rr',cat:'Luxury',emoji:'🚗',name:'Rolls-Royce Phantom',price:128700000,unit:'car' },
  { id:'bugatti',cat:'Luxury',emoji:'⚡',name:'Bugatti Chiron',price:350000000,unit:'car' },
  { id:'goldshirt',cat:'Luxury',emoji:'👕',name:'Gold Shirt',price:13000000,unit:'shirt' },
  { id:'rolex',cat:'Luxury',emoji:'⌚',name:'Rolex Daytona',price:3500000,unit:'watch' },
  { id:'diamond',cat:'Luxury',emoji:'💎',name:'100-carat Diamond',price:600000000,unit:'stone' },
  { id:'yacht',cat:'Luxury',emoji:'🛥️',name:'Superyacht (100m)',price:3000000000,unit:'yacht' },
  { id:'jet',cat:'Luxury',emoji:'✈️',name:'Gulfstream G700',price:6000000000,unit:'jet' },
  { id:'goaflat',cat:'Property',emoji:'🏠',name:'Goa Beach Villa',price:150000000,unit:'villa' },
  { id:'mumbai',cat:'Property',emoji:'🏢',name:'Mumbai Sea-Facing',price:500000000,unit:'flat' },
  { id:'mannat',cat:'Property',emoji:'🏠',name:'Mannat (SRK)',price:3500000000,unit:'house' },
  { id:'lincoln',cat:'Property',emoji:'🏢',name:'Lincoln House',price:7500000000,unit:'house' },
  { id:'jk',cat:'Property',emoji:'🏛️',name:'JK House',price:55000000000,unit:'house' },
  { id:'antilia',cat:'Property',emoji:'🏰',name:'Antilia',price:15000000000000,unit:'tower' },
  { id:'cricket',cat:'Experiences',emoji:'🏏',name:'IPL Team Ownership',price:70000000000,unit:'franchise' },
  { id:'film',cat:'Experiences',emoji:'🎬',name:'Bollywood Blockbuster',price:2000000000,unit:'film' },
  { id:'space',cat:'Experiences',emoji:'🚀',name:'Space Trip',price:500000000,unit:'ticket' },
  { id:'island',cat:'Experiences',emoji:'🏝️',name:'Private Island',price:4500000000,unit:'island' },
  { id:'wedding',cat:'Experiences',emoji:'🎪',name:'Big Fat Wedding',price:50000000000,unit:'event' },
  { id:'meal',cat:'Give Back',emoji:'🍱',name:'Feed 1 child for a year',price:15000,unit:'child' },
  { id:'school',cat:'Give Back',emoji:'🏫',name:'Build a village school',price:15000000,unit:'school' },
  { id:'water',cat:'Give Back',emoji:'💧',name:'Clean water for a village',price:8000000,unit:'village' },
  { id:'amb',cat:'Give Back',emoji:'🚑',name:'Fund an ambulance',price:2500000,unit:'ambulance' },
  { id:'hosp',cat:'Give Back',emoji:'🏥',name:'Rural health clinic',price:250000000,unit:'clinic' },
  { id:'lib',cat:'Give Back',emoji:'📚',name:'National library fund',price:1000000000,unit:'fund' },
];

register('spend-crorepati',{
  title:'Spend Crorepati Money', icon:'💸', tag:'Original', category:'Desi',
  desc:'Live rolling balance. Real Indian goods. Buy, gift, and change lives.',
  tags:['economy','india'], type:'native',
}, function(root){
  let current = BILLIONAIRES[0];
  let balance = current.wealth;
  let cart = {};
  let activeCat = 'All';
  let lastBalance = balance;
  let heroEl = null;

  const cats = ['All', ...new Set(CATALOG_ITEMS.map(i => i.cat))];

  root.innerHTML = `
    <div class="ui" style="max-width:720px">
      <div class="spend-hero" id="spend-hero">
        <div class="spend-hero__top">
          <div class="spend-hero__avatar" id="spend-avatar">${current.emoji}</div>
          <div class="spend-hero__meta">
            <div class="spend-hero__name" id="spend-name">${current.name}</div>
            <div class="spend-hero__blurb" id="spend-blurb">${current.blurb}</div>
          </div>
        </div>
        <div class="spend-hero__balance">
          <div class="spend-hero__label">Available Balance</div>
          <div class="spend-hero__value" id="spend-balance">${fmtINR(balance)}</div>
        </div>
        <div class="spend-hero__bar">
          <div class="spend-hero__fill" id="spend-fill" style="width:100%"></div>
        </div>
      </div>

      <div class="spend-switch-row" id="spend-switch"></div>
      <div class="chips" id="spend-cats"></div>
      <div class="spend-grid" id="spend-items"></div>

      <div class="btn-row" style="margin-top:20px">
        <button class="btn btn--ghost" id="spend-reset">↺ Reset</button>
        <button class="btn" id="spend-receipt">🧾 View Receipt</button>
      </div>
    </div>

    <style>
      .spend-hero{
        background:linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 60%, #ef4444) 100%);
        color:var(--accent-fg); padding:22px; border-radius:22px;
        box-shadow:var(--shadow-lg); transition:background .4s;
      }
      .spend-hero__top{display:flex; gap:14px; align-items:center; margin-bottom:18px}
      .spend-hero__avatar{
        width:48px; height:48px; border-radius:14px;
        background:rgba(255,255,255,.18); display:grid; place-items:center;
        font-size:24px; flex-shrink:0;
      }
      .spend-hero__name{font-weight:900; font-size:15px; letter-spacing:-.3px}
      .spend-hero__blurb{font-size:11px; opacity:.75; font-weight:600; margin-top:2px}
      .spend-hero__label{font-size:10px; text-transform:uppercase; letter-spacing:1.4px; opacity:.7; font-weight:800; margin-bottom:6px}
      .spend-hero__value{
        font-size:clamp(22px, 6vw, 32px); font-weight:900; letter-spacing:-1.2px;
        font-variant-numeric:tabular-nums; line-height:1.05;
        transition:transform .25s cubic-bezier(.34,1.56,.64,1);
      }
      .spend-hero__value.pulse{transform:scale(1.08)}
      .spend-hero__bar{
        height:4px; background:rgba(255,255,255,.2); border-radius:99px;
        margin-top:14px; overflow:hidden;
      }
      .spend-hero__fill{
        height:100%; background:#fff; border-radius:99px;
        transition:width .6s cubic-bezier(.16,1,.3,1);
      }
      .spend-switch-row{
        display:flex; gap:6px; margin-top:14px; margin-bottom:14px;
        overflow-x:auto; scrollbar-width:none; padding-bottom:2px;
      }
      .spend-switch-row::-webkit-scrollbar{display:none}
      .spend-pill{
        padding:9px 14px; border-radius:999px;
        background:var(--surface); border:1px solid var(--border);
        font-size:12px; font-weight:800; white-space:nowrap;
        transition:all .2s;
      }
      .spend-pill.active{background:var(--accent); color:var(--accent-fg); border-color:var(--accent)}
      .spend-pill:active{transform:scale(.95)}

      .spend-grid{display:grid; grid-template-columns:repeat(2, 1fr); gap:10px}
      @media(min-width:520px){.spend-grid{grid-template-columns:repeat(3, 1fr)}}

      .spend-item{
        position:relative;
        background:var(--surface); border:1px solid var(--border);
        border-radius:16px; padding:14px;
        display:flex; flex-direction:column; gap:6px;
        transition:transform .15s, box-shadow .2s, border-color .2s;
        animation:cardIn .35s backwards;
      }
      .spend-item:hover{border-color:var(--border-strong)}
      .spend-item:active{transform:scale(.97)}
      .spend-item.bought{animation:buyPulse .4s}
      @keyframes buyPulse{
        0%{transform:scale(1)}
        40%{transform:scale(.93); border-color:var(--success)}
        100%{transform:scale(1)}
      }
      .spend-item__emoji{font-size:28px; line-height:1; margin-bottom:4px}
      .spend-item__name{font-size:13px; font-weight:800; line-height:1.25; flex-grow:1}
      .spend-item__price{font-size:11px; color:var(--text-mute); font-weight:700; font-variant-numeric:tabular-nums}
      .spend-item__btn{
        margin-top:4px; padding:9px 10px; border-radius:10px;
        background:var(--accent); color:var(--accent-fg);
        font-weight:800; font-size:11.5px;
        transition:transform .12s, opacity .2s;
      }
      .spend-item__btn:active{transform:scale(.94)}
      .spend-item__btn:disabled{opacity:.35; cursor:not-allowed}
      .spend-item__qty{
        position:absolute; top:10px; right:10px;
        background:var(--success); color:#fff;
        font-size:10px; font-weight:800;
        padding:3px 8px; border-radius:999px;
        font-variant-numeric:tabular-nums;
        animation:qtyPop .35s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes qtyPop{from{transform:scale(0)}to{transform:scale(1)}}

      .coin-fly{
        position:fixed; pointer-events:none; z-index:300;
        font-weight:900; font-size:15px; color:#ef4444;
        text-shadow:0 2px 8px rgba(0,0,0,.4);
        animation:coinFly 1s cubic-bezier(.2,.7,.3,1) forwards;
      }
      @keyframes coinFly{
        0%{opacity:1; transform:translate(-50%, 0) scale(1)}
        60%{opacity:1; transform:translate(-50%, -50px) scale(1.2)}
        100%{opacity:0; transform:translate(-50%, -110px) scale(1)}
      }
    </style>
  `;

  heroEl = $('#spend-hero', root);

  function renderSwitch(){
    $('#spend-switch', root).innerHTML = BILLIONAIRES.map(b =>
      `<button class="spend-pill${b.id === current.id ? ' active' : ''}" data-id="${b.id}">
        ${b.emoji} ${b.name.split(' ')[0]}
      </button>`
    ).join('');
  }

  function renderCats(){
    $('#spend-cats', root).innerHTML = cats.map(c =>
      `<button class="chip${c === activeCat ? ' active' : ''}" data-cat="${c}">${c}</button>`
    ).join('');
  }

  function renderItems(){
    const list = activeCat === 'All' ? CATALOG_ITEMS : CATALOG_ITEMS.filter(i => i.cat === activeCat);
    $('#spend-items', root).innerHTML = list.map((it, idx) => {
      const qty = cart[it.id] || 0;
      const can = balance >= it.price;
      return `
        <div class="spend-item" data-item="${it.id}" style="animation-delay:${Math.min(idx*15,300)}ms">
          ${qty ? `<div class="spend-item__qty">×${qty}</div>` : ''}
          <div class="spend-item__emoji">${it.emoji}</div>
          <div class="spend-item__name">${it.name}</div>
          <div class="spend-item__price">${fmtINR(it.price)} / ${it.unit}</div>
          <button class="spend-item__btn" data-id="${it.id}" ${can ? '' : 'disabled'}>
            ${can ? 'Buy' : 'Too costly'}
          </button>
        </div>`;
    }).join('');
  }

  function updateBalance(animate = true, delta = 0){
    const el = $('#spend-balance', root);
    const from = lastBalance;
    lastBalance = balance;
    if (animate){
      rollNumber(el, from, balance, 550, fmtINR);
      el.classList.add('pulse');
      setTimeout(() => el.classList.remove('pulse'), 350);
    } else {
      el.textContent = fmtINR(balance);
    }
    const pct = clamp((balance / current.wealth) * 100, 0, 100);
    $('#spend-fill', root).style.width = pct + '%';
  }

  function flyCoin(x, y, amount){
    const el = document.createElement('div');
    el.className = 'coin-fly';
    el.textContent = '−' + fmtINR(amount);
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1100);
  }

  function buy(id, evt){
    const it = CATALOG_ITEMS.find(i => i.id === id);
    if (!it || balance < it.price) return;

    balance -= it.price;
    cart[id] = (cart[id] || 0) + 1;
    haptic(8);
    updateBalance(true, -it.price);
    renderItems();

    // Visual feedback: pulse on the item card
    const card = root.querySelector(`.spend-item[data-item="${id}"]`);
    if (card){ card.classList.add('bought'); setTimeout(() => card.classList.remove('bought'), 420); }

    // Floating coin animation from click position
    const x = evt ? evt.clientX : window.innerWidth / 2;
    const y = evt ? evt.clientY : window.innerHeight / 2;
    flyCoin(x, y, it.price);
  }

  function showReceipt(){
    const lines = Object.entries(cart).map(([id, qty]) => ({
      it: CATALOG_ITEMS.find(i => i.id === id),
      qty,
    })).sort((a, b) => (b.it.price * b.qty) - (a.it.price * a.qty));

    if (!lines.length){ toast('Kuch kharida hi nahi 😅'); return; }

    const spent = current.wealth - balance;
    const body = $('#modal-body');
    const original = body.innerHTML;

    body.innerHTML = `
      <div class="ui" style="max-width:520px">
        <div style="text-align:center;padding:26px 20px 18px">
          <div style="font-size:52px;margin-bottom:8px">🧾</div>
          <div style="font-weight:900;font-size:20px;letter-spacing:-.5px">Purchase Receipt</div>
          <div style="font-size:12px;color:var(--text-soft);margin-top:4px">${current.emoji} ${current.name}</div>
        </div>
        <div style="max-height:48vh;overflow-y:auto">
          ${lines.map(({it, qty}) => `
            <div style="display:flex;justify-content:space-between;gap:12px;padding:12px 0;font-size:13px;border-bottom:1px solid var(--border)">
              <div>
                <div style="font-weight:800">${it.emoji} ${it.name}</div>
                <div style="color:var(--text-soft);font-weight:700;font-size:11px;margin-top:2px">${fmtINR(it.price)} × ${qty}</div>
              </div>
              <div style="font-weight:900;font-variant-numeric:tabular-nums">${fmtINR(it.price * qty)}</div>
            </div>
          `).join('')}
        </div>
        <div style="margin-top:18px;padding:16px;background:var(--surface-2);border-radius:14px;display:flex;justify-content:space-between;font-weight:900">
          <span style="color:var(--text-soft);font-size:12px;text-transform:uppercase;letter-spacing:1px">Total Spent</span>
          <span>${fmtINR(spent)}</span>
        </div>
        <div class="btn-row" style="margin-top:18px">
          <button class="btn btn--ghost" id="rcpt-back">↺ Back</button>
          <button class="btn" id="rcpt-share">↗ Share</button>
        </div>
      </div>
    `;

    $('#rcpt-back', body).onclick = () => { body.innerHTML = original; wire(); };
    $('#rcpt-share', body).onclick = () => {
      const txt = lines.map(({it,qty}) => `${it.emoji} ${it.name} ×${qty} — ${fmtINR(it.price*qty)}`).join('\n');
      const full = `🧾 ${current.name} Receipt\n\n${txt}\n\nSpent: ${fmtINR(spent)}\nLeft: ${fmtINR(balance)}`;
      if (navigator.share) OMT.share({ title:'Receipt', text: full }).catch(()=>{});
      else { navigator.clipboard?.writeText(full); toast('Receipt copied 📋'); }
    };
  }

  function wire(){
    $('#spend-switch', root).onclick = e => {
      const pill = e.target.closest('.spend-pill');
      if (!pill) return;
      const b = BILLIONAIRES.find(x => x.id === pill.dataset.id);
      if (!b || b.id === current.id) return;
      current = b;
      balance = current.wealth;
      lastBalance = balance;
      cart = {};
      $('#spend-avatar', root).textContent = current.emoji;
      $('#spend-name', root).textContent = current.name;
      $('#spend-blurb', root).textContent = current.blurb;
      renderSwitch();
      renderItems();
      updateBalance(false);
      haptic(12);
    };
    $('#spend-cats', root).onclick = e => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      activeCat = chip.dataset.cat;
      renderCats();
      renderItems();
    };
    $('#spend-items', root).onclick = e => {
      const btn = e.target.closest('.spend-item__btn');
      if (!btn || btn.disabled) return;
      buy(btn.dataset.id, e);
    };
    $('#spend-reset', root).onclick = () => {
      balance = current.wealth;
      lastBalance = balance;
      cart = {};
      renderItems();
      updateBalance();
      toast('Reset ✦');
    };
    $('#spend-receipt', root).onclick = showReceipt;
  }

  renderSwitch();
  renderCats();
  renderItems();
  updateBalance(false);
  wire();
});

/* ---------- 2. PERFECT CIRCLE (line fixed) ---------- */
register('perfect-circle',{
  title:'Perfect Circle Love Score', icon:'⭕', tag:'Original', category:'Desi',
  desc:'Trace a circle. We measure roundness + closure.',
  tags:['canvas','skill'], type:'native',
}, function(root){
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Perfect Circle</h2>
      <p class="ui__sub">Draw one smooth circle. Lift finger to score.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Score</div><div class="panel__value" id="pc-score" style="color:var(--success)">0%</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Best</div><div class="panel__value" id="pc-best">0%</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Tries</div><div class="panel__value" id="pc-tries">0</div></div>
      </div>
      <div style="position:relative;margin-bottom:14px">
        <canvas id="pc-canvas" style="width:100%;aspect-ratio:1;display:block;border-radius:22px;background:var(--surface);border:1px solid var(--border);touch-action:none;cursor:crosshair"></canvas>
        <div id="pc-hint" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:14px;color:var(--text-mute);pointer-events:none;transition:opacity .3s">
          Draw a circle
        </div>
      </div>
      <div style="text-align:center;font-weight:800;font-size:14px;margin-bottom:4px" id="pc-verdict">Start tracing</div>
      <p style="text-align:center;font-size:12px;color:var(--text-soft);margin-bottom:16px" id="pc-detail">Higher score = truer circle</p>
      <div class="btn-row">
        <button class="btn btn--ghost" id="pc-clear">↺ Clear</button>
        <button class="btn" id="pc-share">↗ Share</button>
      </div>
    </div>
  `;

  const canvas = $('#pc-canvas', root);
  const ctx = canvas.getContext('2d');
  const hint = $('#pc-hint', root);
  const scoreEl = $('#pc-score', root);
  const bestEl = $('#pc-best', root);
  const triesEl = $('#pc-tries', root);

  let dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  let drawing = false;
  let points = [];
  let lastScore = 0;
  let tries = 0;
  let best = +STORE.get('pc-best', 0) || 0;

  bestEl.textContent = best + '%';

  function computeColors(){
    const cs = getComputedStyle(document.documentElement);
    return {
      text: cs.getPropertyValue('--text').trim() || '#0a0a0a',
      accent: cs.getPropertyValue('--accent').trim() || '#0a0a0a',
      success: cs.getPropertyValue('--success').trim() || '#10b981',
      mute: cs.getPropertyValue('--text-mute').trim() || '#a1a1aa',
    };
  }

  function size(){
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }
  size();
  window.addEventListener('resize', size);

  function clear(){
    const c = computeColors();
    ctx.clearRect(0, 0, W, H);
    // Reference circle guide
    ctx.save();
    ctx.strokeStyle = c.mute;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 8]);
    ctx.beginPath();
    ctx.arc(W/2, H/2, Math.min(W, H) * 0.35, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    points = [];
    scoreEl.textContent = '0%';
  }
  clear();

  function pos(e){
    const rect = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  function drawSeg(a, b){
    const c = computeColors();
    ctx.strokeStyle = c.text;   // <-- solid color, NOT var()
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function start(e){
    e.preventDefault();
    drawing = true;
    points = [];
    ctx.clearRect(0, 0, W, H);
    hint.style.opacity = '0';
    $('#pc-verdict', root).textContent = 'Keep going...';
    $('#pc-detail', root).textContent = 'Lift finger to score';
  }

  function move(e){
    if (!drawing) return;
    e.preventDefault();
    const p = pos(e);
    points.push(p);
    if (points.length > 1){
      drawSeg(points[points.length - 2], p);
    }
  }

  function end(){
    if (!drawing) return;
    drawing = false;
    if (points.length < 30){
      $('#pc-verdict', root).textContent = 'Too short — try again';
      hint.style.opacity = '1';
      return;
    }
    score();
  }

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  canvas.addEventListener('mouseup', end);
  canvas.addEventListener('mouseleave', end);
  canvas.addEventListener('touchstart', start, { passive:false });
  canvas.addEventListener('touchmove', move, { passive:false });
  canvas.addEventListener('touchend', end);

  function score(){
    const cx = points.reduce((s, p) => s + p.x, 0) / points.length;
    const cy = points.reduce((s, p) => s + p.y, 0) / points.length;
    const radii = points.map(p => Math.hypot(p.x - cx, p.y - cy));
    const avg = radii.reduce((a, b) => a + b, 0) / radii.length;
    const variance = radii.reduce((s, r) => s + (r - avg) ** 2, 0) / radii.length;
    const std = Math.sqrt(variance);
    const circ = clamp(100 - (std / avg) * 100, 0, 100);
    const sP = points[0], eP = points[points.length - 1];
    const gap = Math.hypot(sP.x - eP.x, sP.y - eP.y);
    const closure = clamp(1 - gap / avg, 0, 1);
    const raw = circ * (0.7 + 0.3 * closure);
    const final = Math.round(clamp(raw, 0, 100));

    lastScore = final;
    tries++;
    triesEl.textContent = tries;
    if (final > best){
      best = final;
      bestEl.textContent = best + '%';
      STORE.set('pc-best', best);
    }

    rollNumber(scoreEl, 0, final, 800, v => Math.round(v) + '%');

    let verdict, detail;
    if (final >= 95){ verdict = 'Impossibly perfect 💖'; detail = 'This is basically a compass.'; }
    else if (final >= 88){ verdict = 'Beautiful circle 💕'; detail = 'Very close to perfect.'; }
    else if (final >= 75){ verdict = 'Nice curve 💗'; detail = 'Just a bit wobbly.'; }
    else if (final >= 55){ verdict = 'Getting there 💓'; detail = 'Slow down your hand.'; }
    else { verdict = 'Not quite 😅'; detail = 'Try one smooth motion.'; }
    $('#pc-verdict', root).textContent = verdict;
    $('#pc-detail', root).textContent = detail;

    // Overlay ideal circle
    const c = computeColors();
    ctx.save();
    ctx.strokeStyle = c.success;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([6, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, avg, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    haptic(20);
  }

  $('#pc-clear', root).onclick = () => {
    clear();
    hint.style.opacity = '1';
    $('#pc-verdict', root).textContent = 'Start tracing';
    $('#pc-detail', root).textContent = 'Higher score = truer circle';
  };
  $('#pc-share', root).onclick = () => {
    if (!tries){ toast('Draw a circle first!'); return; }
    const txt = `My perfect circle score: ${lastScore}% (best ${best}%) on one more try.`;
    if (navigator.share) OMT.share({ title:'Perfect Circle', text: txt }).catch(()=>{});
    else { navigator.clipboard?.writeText(txt); toast('Copied! 📋'); }
  };
});

/* ---------- 3. PASSWORD CHAOS ---------- */
register('password-chaos',{
  title:'Password Chaos — Desi', icon:'🔐', tag:'Original', category:'Desi',
  desc:'35 increasingly absurd desi rules. Can you satisfy them all?',
  tags:['challenge','india'], type:'native',
}, function(root){
  const RULES = [
    { t:'At least 5 characters', f:p=>p.length>=5 },
    { t:'Contains a number', f:p=>/\d/.test(p) },
    { t:'Contains an uppercase letter', f:p=>/[A-Z]/.test(p) },
    { t:'Contains a lowercase letter', f:p=>/[a-z]/.test(p) },
    { t:'Contains a special character', f:p=>/[!@#$%^&*]/.test(p) },
    { t:'Digits add up to exactly 25', f:p=>{const d=[...p].filter(c=>/\d/.test(c)).map(Number);return d.length&&d.reduce((a,b)=>a+b,0)===25;} },
    { t:'Digits multiply to over 100', f:p=>{const d=[...p].filter(c=>/\d/.test(c)).map(Number).filter(n=>n>0);return d.length&&d.reduce((a,b)=>a*b,1)>100;} },
    { t:'Contains the 🇮🇳 emoji', f:p=>p.includes('🇮🇳') },
    { t:'Contains at least one emoji', f:p=>/\p{Emoji_Presentation}/u.test(p) },
    { t:'Contains the rupee symbol ₹', f:p=>p.includes('₹') },
    { t:'Contains "chai" or "pyaar"', f:p=>/chai|pyaar/i.test(p) },
    { t:'Contains "jugaad" or "bindaas"', f:p=>/jugaad|bindaas|jhakaas/i.test(p) },
    { t:'Contains "Jai Hind"', f:p=>/jai hind/i.test(p) },
    { t:'Contains a cricket score (like 184/6)', f:p=>/\d{2,3}\/\d/.test(p) },
    { t:'Contains a UPI ID (like name@upi)', f:p=>/\w+@(upi|paytm|ybl)/i.test(p) },
    { t:'Contains a 5-digit train number', f:p=>/\b\d{5}\b/.test(p) },
    { t:'Contains a 6-digit PIN code', f:p=>/\b\d{6}\b/.test(p) },
    { t:'Contains an Indian state', f:p=>/(punjab|gujarat|kerala|karnataka|maharashtra|bihar|goa|assam|rajasthan)/i.test(p) },
    { t:'Contains an Indian city', f:p=>/(delhi|mumbai|kolkata|chennai|bengaluru|hyderabad|pune|jaipur)/i.test(p) },
    { t:'Contains an Indian festival', f:p=>/(diwali|holi|eid|rakhi|navratri|pongal|onam|baisakhi)/i.test(p) },
    { t:'Contains a Bollywood movie', f:p=>/(sholay|ddlj|lagaan|dangal|bahubali|rrr|queen)/i.test(p) },
    { t:'Contains a Bollywood dialogue', f:p=>/kitne aadmi the/i.test(p) },
    { t:'Contains an ISRO mission', f:p=>/(chandrayaan|mangalyaan|gaganyaan|aditya)/i.test(p) },
    { t:'Contains an Indian food', f:p=>/(biryani|dosa|idli|paneer|samosa|chaat|kebab)/i.test(p) },
    { t:'Contains an Indian river', f:p=>/(ganga|yamuna|brahmaputra|godavari|kaveri|narmada)/i.test(p) },
    { t:'Contains a freedom fighter', f:p=>/(gandhi|nehru|bhagat|subhash|bose|tilak|patel)/i.test(p) },
    { t:'Contains an Indian scientist', f:p=>/(raman|bhabha|kalpana|kalam|sarabhai)/i.test(p) },
    { t:'Contains a Hindi number', f:p=>/\b(ek|do|teen|char|paanch|chhe|saat)\b/i.test(p) },
    { t:'Contains an IPL team code', f:p=>/\b(mi|csk|rcb|kkr|srh|dc|rr|pbks|gt|lsg)\b/i.test(p) },
    { t:'Contains a Taj Mahal reference', f:p=>/taj/i.test(p) },
    { t:'Contains "Hind" or "Bharat"', f:p=>/hind|bharat/i.test(p) },
    { t:'Contains a digit sum over 40', f:p=>{const d=[...p].filter(c=>/\d/.test(c)).map(Number);return d.length&&d.reduce((a,b)=>a+b,0)>40;} },
    { t:'Contains a month name', f:p=>/(january|february|march|april|may|june|july|august|september|october|november|december)/i.test(p) },
    { t:'Is at least 25 characters long', f:p=>p.length >= 25 },
    { t:'No consecutive identical letters', f:p=>!/(.)\1/i.test(p) },
  ];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Password Chaos</h2>
      <p class="ui__sub">${RULES.length} rules. All at once. Good luck.</p>
      <input class="input" id="pc-pwd" type="text" placeholder="Start typing..." autocomplete="off" spellcheck="false" style="font-family:ui-monospace,monospace;font-size:14px;padding:16px 18px;border-width:2px">
      <div style="display:flex;align-items:center;gap:12px;margin:16px 0 18px">
        <span style="font-weight:900;font-size:13px" id="pc-count">0</span>
        <div style="flex:1;height:6px;background:var(--surface-2);border-radius:99px;overflow:hidden">
          <div id="pc-prog" style="height:100%;width:0;background:linear-gradient(90deg,var(--warn),var(--success));transition:width .35s;border-radius:99px"></div>
        </div>
        <span style="font-weight:900;font-size:13px;color:var(--text-mute)">${RULES.length}</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px" id="pc-rules"></div>
      <div class="btn-row" style="margin-top:20px">
        <button class="btn btn--ghost" id="pc-reset">↺ Reset</button>
        <button class="btn" id="pc-copy">Copy</button>
      </div>
    </div>
  `;

  const input = $('#pc-pwd', root);
  const rulesEl = $('#pc-rules', root);
  const countEl = $('#pc-count', root);
  const progEl = $('#pc-prog', root);

  rulesEl.innerHTML = RULES.map((r, i) => `
    <div class="pwd-rule" data-i="${i}" style="display:flex;gap:12px;padding:12px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--border);font-size:13px;font-weight:600;line-height:1.4;transition:all .3s;animation:cardIn .3s ${Math.min(i*15,400)}ms backwards">
      <div class="pwd-check" style="width:20px;height:20px;flex-shrink:0;border-radius:6px;border:2px solid var(--border);display:grid;place-items:center;font-size:11px;font-weight:800;color:transparent;transition:all .25s">✓</div>
      <div>${r.t}</div>
    </div>
  `).join('');

  let unlocked = 1;

  function update(){
    const v = input.value;
    let done = 0;
    RULES.slice(0, unlocked).forEach((r, i) => {
      const ok = r.f(v);
      if (ok) done++;
      const el = rulesEl.querySelector(`[data-i="${i}"]`);
      const chk = el.querySelector('.pwd-check');
      el.style.background = ok ? 'color-mix(in srgb, var(--success) 10%, var(--surface))' : 'var(--surface)';
      el.style.borderColor = ok ? 'color-mix(in srgb, var(--success) 40%, transparent)' : 'var(--border)';
      el.style.opacity = ok ? '.75' : '1';
      el.style.textDecoration = ok ? 'line-through' : 'none';
      el.style.textDecorationColor = 'var(--success)';
      chk.style.background = ok ? 'var(--success)' : 'transparent';
      chk.style.borderColor = ok ? 'var(--success)' : 'var(--border)';
      chk.style.color = ok ? '#fff' : 'transparent';
    });
    if (done >= unlocked && unlocked < RULES.length){ unlocked++; setTimeout(update, 60); }
    countEl.textContent = done;
    progEl.style.width = (done / RULES.length * 100) + '%';
    input.style.borderColor = done === RULES.length ? 'var(--success)' : 'var(--border)';
    if (done === RULES.length && !input.dataset.done){
      input.dataset.done = '1';
      toast('🎉 Perfect password!');
      haptic([30,40,30]);
    } else if (done < RULES.length) delete input.dataset.done;
  }

  input.addEventListener('input', update);
  setTimeout(() => input.focus(), 250);
  $('#pc-reset', root).onclick = () => { input.value=''; unlocked=1; update(); input.focus(); };
  $('#pc-copy', root).onclick = () => {
    if (!input.value){ toast('Type something first'); return; }
    navigator.clipboard?.writeText(input.value);
    toast('Password copied 📋');
  };
});

/* ---------- 4. HAND CRICKET ---------- */
register('hand-cricket',{
  title:'Hand Cricket vs AI', icon:'🏏', tag:'Original', category:'Desi',
  desc:'Show a number 1-6. Match = OUT. Score the most runs.',
  tags:['cricket','ai'], type:'native',
}, function(root){
  let you=0,ai=0,wYou=0,wAI=0,inning=1,target=0,batting=true,over=false;
  const wkLimit = 3;
  let history = [];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Hand Cricket</h2>
      <p class="ui__sub">Tap a number. AI shows theirs. Same = OUT.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" id="hc-you-panel" style="border-left:4px solid var(--info)">
          <div class="panel__label">You</div>
          <div class="panel__value" id="hc-you">0/0</div>
        </div>
        <div class="panel" id="hc-ai-panel" style="border-left:4px solid var(--danger)">
          <div class="panel__label">AI</div>
          <div class="panel__value" id="hc-ai">0/0</div>
        </div>
      </div>
      <div id="hc-status" style="text-align:center;font-weight:800;font-size:14px;min-height:22px;margin-bottom:14px;color:var(--text-soft)"></div>
      <div id="hc-moves" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px"></div>
      <div id="hc-history" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;margin-bottom:16px"></div>
      <div class="btn-row"><button class="btn btn--ghost btn--block" id="hc-reset">↺ New Game</button></div>
    </div>
  `;

  function status(txt, color){
    const el = $('#hc-status', root);
    el.textContent = txt;
    el.style.color = color || 'var(--text-soft)';
  }

  function renderMoves(){
    const disable = over ? 'disabled' : '';
    $('#hc-moves', root).innerHTML = [1,2,3,4,5,6].map(n => `
      <button ${disable} data-n="${n}" style="padding:22px;font-size:24px;font-weight:900;background:var(--surface);border:1px solid var(--border);border-radius:16px;transition:transform .12s;">${n}</button>
    `).join('');
  }

  function upd(){
    $('#hc-you', root).textContent = you + '/' + wYou;
    $('#hc-ai', root).textContent = ai + '/' + wAI;
    $('#hc-you-panel', root).style.opacity = batting ? '1' : '.5';
    $('#hc-ai-panel', root).style.opacity = batting ? '.5' : '1';
  }

  function renderHistory(){
    $('#hc-history', root).innerHTML = history.slice(-12).map(h => `
      <span style="padding:5px 10px;border-radius:999px;font-size:11px;font-weight:800;background:${h.out ? 'color-mix(in srgb,var(--danger) 15%,var(--surface))' : 'var(--surface-2)'};border:1px solid var(--border);color:${h.out ? 'var(--danger)' : 'var(--text-soft)'}">${h.you} vs ${h.ai}</span>
    `).join('');
  }

  function play(youN){
    if (over) return;
    const aiN = rand(1,6);
    const out = youN === aiN;
    history.push({ you: youN, ai: aiN, out });
    renderHistory();

    if (batting){
      if (out){
        wYou++;
        haptic(30);
        status(`OUT! ${youN} = ${aiN}`, 'var(--danger)');
        if (wYou >= wkLimit){
          if (inning === 1){
            inning = 2; target = you + 1; batting = false;
            you = 0; wYou = 0;
            status(`Target: ${target}. AI is batting.`, 'var(--warn)');
          } else finish();
        }
      } else {
        you += youN;
        haptic(6);
        status(`You: ${youN} — AI: ${aiN} → +${youN}`);
      }
    } else {
      if (out){
        wAI++;
        haptic(30);
        status(`AI OUT! ${youN} = ${aiN}`, 'var(--success)');
        if (wAI >= wkLimit) finish();
      } else {
        ai += aiN;
        status(`You: ${youN} — AI: ${aiN} → AI +${aiN}`);
        if (ai >= target){ finish(); return; }
      }
    }
    upd();
  }

  function finish(){
    over = true;
    renderMoves();
    let msg;
    if (ai >= target) msg = `AI wins ${ai}/${wAI} vs ${you}`;
    else if (you >= target && inning === 2) msg = `🎉 You win! ${you}/${wYou}`;
    else msg = 'Innings over';
    status(msg, ai >= target ? 'var(--danger)' : 'var(--success)');
  }

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-n]');
    if (!btn || btn.disabled) return;
    play(+btn.dataset.n);
  });

  $('#hc-reset', root).onclick = () => {
    you=0; ai=0; wYou=0; wAI=0; inning=1; target=0; batting=true; over=false;
    history = [];
    renderMoves(); renderHistory(); upd();
    status('Pick a number to start');
  };

  renderMoves(); upd(); status('Pick a number to start');
});

/* ---------- 5. KBC QUIZ ---------- */
register('kbc-quiz',{
  title:'KBC Quiz', icon:'🎯', tag:'Original', category:'Desi',
  desc:'12 questions. No lifelines. Real desi trivia.',
  tags:['quiz','india'], type:'native',
}, function(root){
  const QS = [
    { q:'India ka pehla PM?', o:['Jawaharlal Nehru','Sardar Patel','Mahatma Gandhi','B.R. Ambedkar'], a:0 },
    { q:'Taj Mahal kis sheher mein hai?', o:['Delhi','Agra','Jaipur','Lucknow'], a:1 },
    { q:'ISRO ka headquarter kahan hai?', o:['Mumbai','Bengaluru','Hyderabad','Chennai'], a:1 },
    { q:'"Jana Gana Mana" kisne likha?', o:['Rabindranath Tagore','Bankim Chandra','Premchand','Iqbal'], a:0 },
    { q:'Chandrayaan-3 kab launch hua?', o:['2021','2022','2023','2024'], a:2 },
    { q:'India ki sabse lambi nadi?', o:['Yamuna','Ganga','Godavari','Brahmaputra'], a:1 },
    { q:'Rupee symbol kisne design kiya?', o:['RBI','Uday Kumar','Ambani','Kalam'], a:1 },
    { q:'India ka national animal?', o:['Sher','Haathi','Bagh','Mor'], a:2 },
    { q:'Aadhaar kitne digits ka hai?', o:['10','12','14','16'], a:1 },
    { q:'First Indian Nobel winner?', o:['Tagore','Bose','Kalam','C.V. Raman'], a:0 },
    { q:'Indian Constitution kab lagu hua?', o:['1947','1948','1950','1952'], a:2 },
    { q:'Sabse zyada IPL titles?', o:['MI & CSK','RCB','KKR','SRH'], a:0 },
  ];
  let idx=0, score=0, locked=false;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">KBC Quiz</h2>
      <p class="ui__sub">12 questions. Straight answers.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-weight:900;font-size:13px">
        <span>Q<span id="kbc-qi">1</span>/${QS.length}</span>
        <span>Score: <span id="kbc-score" style="color:var(--success)">0</span></span>
      </div>
      <div id="kbc-body"></div>
    </div>
  `;

  function show(){
    if (idx >= QS.length) return end();
    locked = false;
    const q = QS[idx];
    $('#kbc-qi', root).textContent = idx + 1;
    $('#kbc-score', root).textContent = score;
    $('#kbc-body', root).innerHTML = `
      <div class="panel" style="padding:20px;margin-bottom:16px;font-weight:800;font-size:15px;line-height:1.5">${q.q}</div>
      <div style="display:flex;flex-direction:column;gap:10px" id="kbc-opts">
        ${q.o.map((o, i) => `<button class="kbc-opt" data-i="${i}" style="padding:15px 18px;text-align:left;background:var(--surface);border:1px solid var(--border);border-radius:14px;font-weight:700;font-size:14px;transition:all .2s">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}
      </div>
    `;
  }

  function end(){
    const pct = Math.round(score / QS.length * 100);
    const msg = pct >= 85 ? '🏆 Outstanding!' : pct >= 65 ? '👏 Well played' : pct >= 40 ? '💪 Getting there' : '📚 Keep practicing';
    $('#kbc-body', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:30px 20px">
        <div style="font-size:44px;margin-bottom:10px">${pct >= 85 ? '🏆' : pct >= 65 ? '👏' : '💪'}</div>
        <div style="font-weight:900;font-size:32px;letter-spacing:-1px">${score}/${QS.length}</div>
        <div style="color:var(--text-soft);font-size:13px;margin-top:8px">${msg}</div>
        <button class="btn" id="kbc-again" style="margin-top:20px">Play Again</button>
      </div>`;
    $('#kbc-again', root).onclick = () => { idx=0; score=0; show(); };
  }

  root.addEventListener('click', e => {
    const btn = e.target.closest('.kbc-opt');
    if (!btn || locked) return;
    locked = true;
    const i = +btn.dataset.i;
    const q = QS[idx];
    const all = $$('.kbc-opt', root);
    all[q.a].style.background = 'var(--success)';
    all[q.a].style.color = '#fff';
    all[q.a].style.borderColor = 'var(--success)';
    if (i !== q.a){
      btn.style.background = 'var(--danger)';
      btn.style.color = '#fff';
      btn.style.borderColor = 'var(--danger)';
      haptic(40);
    } else {
      score++;
      haptic(10);
      $('#kbc-score', root).textContent = score;
    }
    setTimeout(() => { idx++; show(); }, 1200);
  });

  show();
});

/* ---------- 6. TROLLEY PROBLEMS ---------- */
register('trolley-desi',{
  title:'Trolley Problems Desi', icon:'🚋', tag:'Original', category:'Desi',
  desc:'12 morally grey Indian dilemmas.',
  tags:['ethics','india'], type:'native',
}, function(root){
  const QS = [
    { q:'Trolley will kill 5 people. You can pull a lever to kill 1 instead.', a:'Pull the lever (kill 1)', b:'Do nothing (5 die)', ra:0, why:'Utilitarian — 1 < 5.' },
    { q:'A 60-year-old cancer patient or a healthy 5-year-old?', a:'Save the child', b:'Save the patient', ra:0, why:'Majority save the child.' },
    { q:'A pregnant woman or an elderly father?', a:'Save the pregnant woman', b:'Save the elderly father', ra:0, why:'Double life saved.' },
    { q:'Gautam Adani or 10 middle-class workers?', a:'Save Adani', b:'Save the 10 workers', ra:1, why:'Numbers matter.' },
    { q:'Your best friend or 5 strangers?', a:'Save my friend', b:'Save 5 strangers', ra:1, why:'5 > 1.' },
    { q:'A doctor or a serial killer?', a:'Save the doctor', b:'Save the killer', ra:0, why:'Doctor adds value.' },
    { q:'A 100-year-old monk or a 25-year-old athlete?', a:'Save the monk', b:'Save the athlete', ra:1, why:'Younger life has more years.' },
    { q:'5 politicians or 1 innocent civilian?', a:'Save the civilian', b:'Save the politicians', ra:0, why:'Civilian is innocent.' },
    { q:'1000 volunteers who took the risk, or 5 children?', a:'Kill the volunteers', b:'Kill the children', ra:0, why:'Volunteers accepted risk.' },
    { q:'Earth\'s future (100 yrs) or your family today?', a:'Save my family', b:'Save Earth\'s future', ra:1, why:'Long-term thinking.' },
    { q:'A beggar with nothing, or a businessman with family?', a:'Save the beggar', b:'Save the businessman', ra:0, why:'Beggar is more vulnerable.' },
    { q:'A child, or your own sibling?', a:'Save the child', b:'Save my sibling', ra:0, why:'Child has whole life ahead.' },
  ];
  let idx=0, agree=0;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Trolley Problems Desi</h2>
      <p class="ui__sub">12 dilemmas. No right answer.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-weight:900;font-size:13px">
        <span>Q<span id="tp-qi">1</span>/${QS.length}</span>
        <span>Match: <span id="tp-match" style="color:var(--info)">0</span></span>
      </div>
      <div id="tp-body"></div>
    </div>
  `;

  function show(){
    if (idx >= QS.length) return end();
    const q = QS[idx];
    $('#tp-qi', root).textContent = idx + 1;
    $('#tp-match', root).textContent = agree;
    $('#tp-body', root).innerHTML = `
      <div class="panel" style="padding:22px;margin-bottom:16px;font-weight:700;font-size:15px;line-height:1.55">${q.q}</div>
      <div style="display:flex;flex-direction:column;gap:10px" id="tp-opts">
        <button class="tp-opt" data-i="0" style="padding:18px;text-align:left;background:var(--surface);border:2px solid var(--border);border-radius:16px;font-weight:700;font-size:14px;transition:all .2s">🅰 ${q.a}</button>
        <button class="tp-opt" data-i="1" style="padding:18px;text-align:left;background:var(--surface);border:2px solid var(--border);border-radius:16px;font-weight:700;font-size:14px;transition:all .2s">🅱 ${q.b}</button>
      </div>
    `;
  }

  function end(){
    const pct = Math.round(agree / QS.length * 100);
    const label = pct >= 75 ? '🧠 Logical thinker' : pct >= 45 ? '🤔 Balanced' : '💖 Emotional';
    $('#tp-body', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:30px 20px">
        <div style="font-size:44px;margin-bottom:10px">🤔</div>
        <div style="font-weight:900;font-size:28px">${agree}/${QS.length}</div>
        <div style="color:var(--text-soft);font-size:13px;margin-top:8px">matched majority</div>
        <div style="font-weight:800;margin-top:14px">${label}</div>
        <button class="btn" id="tp-again" style="margin-top:20px">Play Again</button>
      </div>`;
    $('#tp-again', root).onclick = () => { idx=0; agree=0; show(); };
  }

  root.addEventListener('click', e => {
    const btn = e.target.closest('.tp-opt');
    if (!btn) return;
    const i = +btn.dataset.i;
    const q = QS[idx];
    if (i === q.ra) agree++;
    btn.style.background = 'color-mix(in srgb, var(--success) 15%, var(--surface))';
    btn.style.borderColor = 'var(--success)';
    haptic(12);
    $('#tp-body', root).insertAdjacentHTML('beforeend', `<div class="panel" style="margin-top:16px;font-size:13px;color:var(--text-soft);line-height:1.55;animation:cardIn .35s">${q.why}</div>`);
    setTimeout(() => { idx++; show(); }, 1500);
  });

  show();
});

/* ---------- 7. ANTAKSHARI ---------- */
register('antakshari',{
  title:'Antakshari', icon:'🎵', tag:'Original', category:'Desi',
  desc:'Chain Bollywood songs by last letter.',
  tags:['music','bollywood'], type:'native',
}, function(root){
  const S = {
    a:['Aaj ki raat','Aankhon mein teri','Ankhiyan milaun','Awara hoon','Ae dil hai mushkil'],
    b:['Badan pe sitare','Bahut pyar karte hain','Bheegi bheegi raaton mein','Bole chudiyan'],
    c:['Chal chhaiyan chhaiyan','Chura liya hai','Chand mera dil','Channa mereya'],
    d:['Dil hai chhota sa','Dum maro dum','Dil to pagal hai','Deewana hua badal'],
    e:['Ek ladki ko dekha','Ek ajnabee hasina','Ek do teen','Enna sona'],
    g:['Ghar aaja pardesi','Gaata rahe mera dil','Gulabi aankhen'],
    h:['Hum tum','Hawa hawai','Humko humise chura lo'],
    i:['Itni shakti humein dena','Ishq wala love','Iktaara','Ilahi'],
    j:['Jai jai shivshankar','Jhoom barabar jhoom','Jab koi baat bigad jaye'],
    k:['Kabhi kabhi','Kal ho na ho','Kuch kuch hota hai','Kabira'],
    l:['Lag ja gale','Luka chuppi','London thumakda'],
    m:['Mere rashke qamar','Mera joota hai japani','Mere sapno ki rani','Maahi ve'],
    n:['Neele neele ambar','Naina barse','Naam hai tera','Nagada sang dhol'],
    o:['O re piya','O saathi re','Om shanti om'],
    p:['Pyaar kiya to darna kya','Papa kehte hain','Pehla nasha','Pee loon'],
    q:['Qayamat ki raat','Qatra qatra'],
    r:['Roja jaane man','Rimjhim gire saawan','Radha kaise na jale'],
    s:['Saansein','Salaam-e-ishq','Saawan ka mahina','Senorita'],
    t:['Tere bina','Tum hi ho','Tujhe dekha to','Tera hone laga hoon'],
    u:['Udein jab jab zulfen','Uthi hai dil ki lagi'],
    v:['Vande mataram','Vaaste'],
    w:['Woh lamhe','Waqt ki qaid mein'],
    y:['Yeh dosti','Ye tera ghar','Yara yara','Yun hi chala chal'],
    z:['Zindagi ek safar','Zara zara','Zubi zubi','Zehnaseeb'],
  };
  let used=[], last='', streak=0;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Antakshari</h2>
      <p class="ui__sub">Type a Bollywood song. AI answers with the last letter.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" style="text-align:center;padding:14px"><div class="panel__label">Streak</div><div class="panel__value" id="ak-streak" style="color:var(--success)">0</div></div>
        <div class="panel" style="text-align:center;padding:14px"><div class="panel__label">Next Letter</div><div class="panel__value" id="ak-letter" style="color:var(--info)">—</div></div>
      </div>
      <input class="input" id="ak-input" placeholder="Song name likho..." autocomplete="off" style="margin-bottom:12px">
      <div class="btn-row">
        <button class="btn" id="ak-send">Send</button>
        <button class="btn btn--ghost" id="ak-reset">↺</button>
      </div>
      <div id="ak-log" style="margin-top:20px;display:flex;flex-direction:column;gap:8px"></div>
    </div>
  `;

  function log(who, text, ok = true){
    const el = document.createElement('div');
    el.style.cssText = `padding:12px 16px;border-radius:14px;background:${ok ? 'var(--surface)' : 'color-mix(in srgb,var(--danger) 12%,var(--surface))'};border:1px solid var(--border);font-size:13.5px;font-weight:600;line-height:1.4;animation:cardIn .3s`;
    el.innerHTML = `<b style="color:${who==='You'?'var(--info)':'var(--success)'}">${who}:</b> ${text}`;
    const lg = $('#ak-log', root);
    lg.appendChild(el);
    lg.scrollTop = lg.scrollHeight;
  }

  function submit(){
    const v = $('#ak-input', root).value.trim();
    if (!v) return;
    const first = v[0].toLowerCase();
    if (last && first !== last){ toast(`Song must start with "${last.toUpperCase()}"`); return; }
    if (used.includes(v.toLowerCase())){ toast('Already used'); return; }
    used.push(v.toLowerCase());
    log('You', v);
    streak++;
    $('#ak-streak', root).textContent = streak;
    last = v[v.length-1].toLowerCase();
    $('#ak-letter', root).textContent = last.toUpperCase();
    $('#ak-input', root).value = '';
    setTimeout(() => {
      const pool = (S[last] || []).filter(s => !used.includes(s.toLowerCase()));
      if (!pool.length){
        log('AI', `"${last.toUpperCase()}" se gaana nahi mila — You win! 🎉`, false);
        haptic([20,40,20]);
        return;
      }
      const ai = pick(pool);
      used.push(ai.toLowerCase());
      log('AI', ai);
      last = ai[ai.length-1].toLowerCase();
      $('#ak-letter', root).textContent = last.toUpperCase();
    }, 600);
  }

  $('#ak-send', root).onclick = submit;
  $('#ak-input', root).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
  $('#ak-reset', root).onclick = () => {
    used=[]; last=''; streak=0;
    $('#ak-streak', root).textContent = '0';
    $('#ak-letter', root).textContent = '—';
    $('#ak-log', root).innerHTML = '';
    $('#ak-input', root).value = '';
  };
  setTimeout(() => $('#ak-input', root).focus(), 250);
});

/* ---------- 8. TRUTH OR DARE ---------- */
register('truth-dare',{
  title:'Truth or Dare Desi', icon:'🎭', tag:'Original', category:'Desi',
  desc:'Party-ready truths and dares with a desi twist.',
  tags:['party'], type:'native',
}, function(root){
  const T = ['Tumhara sabse embarrassing moment kya tha?','Last lie kya boli thi aur kisse?','Crush ka naam batao — no skipping.','Sabse zyada paisa kis cheez pe waste kiya?','Ek secret jo kisi ko nahi pata.','School mein last bench pe kya karte the?','Sabse weird sapna kya dekha?','Kis cheez se sabse zyada darte ho?','Apni ek weakness batao jo tumhare doston ko nahi pata.','Sabse bada regret kya hai?','Kaunsi cheez tumne chura ke khaayi thi?','Sabse zyada kis dost pe bharosa karte ho aur kyun?'];
  const D = ['10 push-ups karo — abhi.','1 minute tak apne crush ki tareef karo.','Apni crush ko ek text bhejo (bold ho to).','Ek filmy dialogue bolo pura emotion ke saath.','Apne sabse purane WhatsApp chat ka screenshot dikhao.','Selfie click karke apni story pe daalo.','Ek song 30 second gaao — no autotune.','Kisi dost ko call karke "I love you" bolo.','Apni phone gallery ki last photo dikhao.','Apne ek dost ki mimicry karo — perfect honi chahiye.','Apni ex ko ek "hi" bhejo.','WhatsApp status pe "I lost" likho 10 minute ke liye.'];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Truth or Dare</h2>
      <p class="ui__sub">Pick your poison. Desi edition.</p>
      <div id="td-card" style="min-height:220px;display:grid;place-items:center;background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:28px;text-align:center;font-weight:800;font-size:17px;line-height:1.55;margin-bottom:20px;transition:all .35s">Tap a button to begin 👇</div>
      <div class="btn-row" style="margin-bottom:10px">
        <button class="btn" id="td-truth" style="background:var(--info);color:#fff">Truth 💬</button>
        <button class="btn btn--danger" id="td-dare">Dare 🔥</button>
      </div>
      <div class="btn-row"><button class="btn btn--ghost btn--block" id="td-random">🎲 Random</button></div>
    </div>
  `;

  function show(kind, text){
    const card = $('#td-card', root);
    card.style.transform = 'scale(.97)';
    setTimeout(() => card.style.transform = 'scale(1)', 100);
    card.innerHTML = `<div><div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-mute);font-weight:800;margin-bottom:12px">${kind}</div><div>${text}</div></div>`;
    haptic(15);
  }

  $('#td-truth', root).onclick = () => show('Truth 💬', pick(T));
  $('#td-dare', root).onclick = () => show('Dare 🔥', pick(D));
  $('#td-random', root).onclick = () => {
    const k = Math.random() < 0.5 ? 'Truth 💬' : 'Dare 🔥';
    show(k, k.includes('Truth') ? pick(T) : pick(D));
  };
});

/* ---------- 9. IPL AUCTION ---------- */
register('ipl-auction',{
  title:'IPL Auction', icon:'🏆', tag:'Original', category:'Desi',
  desc:'₹90 Cr purse. 14 players. Build your dream squad.',
  tags:['sports','strategy'], type:'native',
}, function(root){
  const P = [
    { n:'Virat Kohli', r:'BAT', p:15, e:'🏏' },{ n:'Rohit Sharma', r:'BAT', p:14, e:'🏏' },
    { n:'Jasprit Bumrah', r:'BOWL', p:18, e:'⚾' },{ n:'MS Dhoni', r:'WK', p:12, e:'🧤' },
    { n:'Hardik Pandya', r:'ALL', p:15, e:'⚡' },{ n:'Ravindra Jadeja', r:'ALL', p:16, e:'🌀' },
    { n:'Suryakumar Yadav', r:'BAT', p:11, e:'🏏' },{ n:'Rashid Khan', r:'BOWL', p:15, e:'🎯' },
    { n:'KL Rahul', r:'WK', p:17, e:'🧤' },{ n:'Mohammed Shami', r:'BOWL', p:10, e:'⚾' },
    { n:'Shubman Gill', r:'BAT', p:8, e:'🏏' },{ n:'Axar Patel', r:'ALL', p:9, e:'🌀' },
    { n:'Rishabh Pant', r:'WK', p:16, e:'🧤' },{ n:'Yuzvendra Chahal', r:'BOWL', p:8, e:'🎯' },
  ];
  let purse=90, team=[], idx=0;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">IPL Auction</h2>
      <p class="ui__sub">Purse: ₹90 Cr. 14 players up.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px">
        <div class="panel"><div class="panel__label">Purse Left</div><div class="panel__value" id="ipl-purse" style="color:var(--success)">₹90 Cr</div></div>
        <div class="panel"><div class="panel__label">Squad</div><div class="panel__value" id="ipl-size">0/14</div></div>
      </div>
      <div id="ipl-body"></div>
    </div>
  `;

  function update(){
    $('#ipl-purse', root).textContent = '₹' + purse + ' Cr';
    $('#ipl-size', root).textContent = team.length + '/' + P.length;
  }

  function show(){
    if (idx >= P.length) return end();
    const p = P[idx];
    $('#ipl-body', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:26px 20px;animation:cardIn .35s">
        <div style="font-size:56px;margin-bottom:10px">${p.e}</div>
        <div style="font-weight:900;font-size:20px;letter-spacing:-.5px">${p.n}</div>
        <div style="color:var(--text-soft);font-size:12.5px;margin-top:6px;font-weight:700">${p.r} • Base ₹${p.p} Cr</div>
      </div>
      <div class="btn-row">
        <button class="btn" id="ipl-bid" ${purse < p.p ? 'disabled' : ''}>Bid ₹${p.p} Cr</button>
        <button class="btn btn--ghost" id="ipl-skip">Skip</button>
      </div>
    `;
    $('#ipl-bid', root).onclick = () => {
      if (purse < p.p) return;
      purse -= p.p; team.push(p); idx++; haptic(15); update(); show();
    };
    $('#ipl-skip', root).onclick = () => { idx++; show(); };
  }

  function end(){
    const spend = 90 - purse;
    $('#ipl-body', root).innerHTML = `
      <div class="panel" style="padding:22px;animation:cardIn .35s">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-size:40px;margin-bottom:8px">${team.length >= 11 ? '🏆' : '📋'}</div>
          <div style="font-weight:900;font-size:18px">Squad finalised</div>
          <div style="font-size:12.5px;color:var(--text-soft);margin-top:6px">${team.length} players • ₹${spend} Cr spent</div>
        </div>
        <div style="border-top:1px solid var(--border);padding-top:14px">
          ${team.map(t => `<div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13.5px;border-bottom:1px solid var(--border)"><span>${t.e} ${t.n} <span style="color:var(--text-mute);font-size:11px">${t.r}</span></span><span style="font-weight:800;font-variant-numeric:tabular-nums">₹${t.p} Cr</span></div>`).join('')}
        </div>
        <button class="btn btn--block" id="ipl-again" style="margin-top:18px">Play Again</button>
      </div>`;
    $('#ipl-again', root).onclick = () => { purse = 90; team = []; idx = 0; update(); show(); };
  }

  update(); show();
});

/* ---------- 10. TAMBOLA ---------- */
register('tambola',{
  title:'Tambola / Housie', icon:'🎰', tag:'Original', category:'Desi',
  desc:'Live number caller from 1 to 90.',
  tags:['numbers','party'], type:'native',
}, function(root){
  let called = [];
  const grid = Array.from({ length: 90 }, (_, i) => i + 1);

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Tambola</h2>
      <p class="ui__sub">1 to 90. Tap to call a new number.</p>
      <div class="panel" style="text-align:center;padding:26px;margin-bottom:16px">
        <div class="panel__label">Last Called</div>
        <div class="panel__value" id="tb-last" style="font-size:64px;line-height:1">—</div>
        <div style="color:var(--text-soft);font-size:12px;margin-top:8px" id="tb-count">0 / 90 called</div>
      </div>
      <div class="btn-row" style="margin-bottom:18px">
        <button class="btn btn--block" id="tb-call">🎲 Call Number</button>
      </div>
      <div id="tb-grid" style="display:grid;grid-template-columns:repeat(10,1fr);gap:4px"></div>
      <div class="btn-row" style="margin-top:18px">
        <button class="btn btn--ghost btn--block" id="tb-reset">↺ Reset</button>
      </div>
    </div>
  `;

  function renderGrid(){
    const set = new Set(called);
    $('#tb-grid', root).innerHTML = grid.map(n => {
      const on = set.has(n);
      const isLast = called.length && called[called.length-1] === n;
      return `<div style="aspect-ratio:1;display:grid;place-items:center;border-radius:8px;font-size:11px;font-weight:800;background:${isLast ? 'var(--success)' : on ? 'var(--surface-3)' : 'var(--surface-2)'};color:${isLast ? '#fff' : on ? 'var(--text)' : 'var(--text-mute)'};border:1px solid ${on ? 'transparent' : 'var(--border)'};transition:all .25s;font-variant-numeric:tabular-nums">${n}</div>`;
    }).join('');
  }

  function call(){
    if (called.length >= 90){ toast('All 90 called!'); return; }
    const remaining = grid.filter(n => !called.includes(n));
    const n = pick(remaining);
    called.push(n);
    const el = $('#tb-last', root);
    el.style.transform = 'scale(.6)';
    el.textContent = n;
    setTimeout(() => { el.style.transform = 'scale(1)'; el.style.transition = 'transform .35s cubic-bezier(.34,1.56,.64,1)'; }, 10);
    $('#tb-count', root).textContent = `${called.length} / 90 called`;
    renderGrid();
    haptic(12);
  }

  $('#tb-call', root).onclick = call;
  $('#tb-reset', root).onclick = () => {
    called = [];
    $('#tb-last', root).textContent = '—';
    $('#tb-count', root).textContent = '0 / 90 called';
    renderGrid();
  };

  renderGrid();
});

})();
