/* ============================================================
   SCIENCE GAMES — v3 (3D Asteroid Blast + Neal.fun-style scrolls)
   ============================================================ */
(function(){
const { $, $$, rand, pick, clamp, fmtINR, rollNumber, toast, haptic, register, STORE } = OMT;
const THREE = window.THREE;

/* ---------- ASTEROID INDIA — Real Map + 3D Blast ---------- */
register('asteroid-india',{
  title:'Asteroid India', icon:'☄️', tag:'Original', category:'Science',
  desc:'Real satellite map. Tap anywhere. Launch asteroid. Watch the 3D blast.',
  tags:['simulation','physics','3d'],
  type:'native',
}, function(root){
  const CITIES = [
    { n:'Delhi', lat:28.6139, lng:77.2090 },
    { n:'Mumbai', lat:19.0760, lng:72.8777 },
    { n:'Kolkata', lat:22.5726, lng:88.3639 },
    { n:'Chennai', lat:13.0827, lng:80.2707 },
    { n:'Bengaluru', lat:12.9716, lng:77.5946 },
    { n:'Hyderabad', lat:17.3850, lng:78.4867 },
    { n:'Jaipur', lat:26.9124, lng:75.7873 },
    { n:'Ahmedabad', lat:23.0225, lng:72.5714 },
    { n:'Pune', lat:18.5204, lng:73.8567 },
    { n:'Lucknow', lat:26.8467, lng:80.9462 },
  ];

  root.innerHTML = `
    <div style="position:relative; width:100%; height:100%; display:flex; flex-direction:column; background:var(--bg)">
      <div style="position:relative; flex:1; min-height:0">
        <div id="ai-map" style="position:absolute; inset:0; z-index:1"></div>
        <div id="ai-three" style="position:absolute; inset:0; z-index:5; pointer-events:none"></div>
        <div style="position:absolute; top:14px; left:14px; right:14px; z-index:10; padding:12px 16px; background:rgba(10,15,30,.85); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border:1px solid rgba(148,163,184,.2); border-radius:14px; color:#fff; pointer-events:none">
          <div style="font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;opacity:.6">Asteroid Target</div>
          <div style="font-size:14px;font-weight:800;margin-top:2px" id="ai-target">Tap anywhere on the map</div>
        </div>
        <button class="btn" id="ai-launch" disabled style="position:absolute;bottom:18px;left:18px;right:18px;z-index:10;padding:16px;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff;font-size:15px;font-weight:900;letter-spacing:.5px;border-radius:16px;box-shadow:0 12px 32px rgba(239,68,68,.5);opacity:.5;transition:opacity .2s">📍 Tap the map to choose location</button>
      </div>
      <div style="padding:14px 16px;background:var(--surface);border-top:1px solid var(--border);flex-shrink:0">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:10px">
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--text-mute);margin-bottom:6px">Diameter</div>
            <input type="range" id="ai-dia" min="10" max="10000" value="500" step="10" style="width:100%;height:5px;-webkit-appearance:none;background:var(--surface-2);border-radius:99px;outline:none">
            <div style="font-size:12px;font-weight:800;margin-top:4px" id="ai-dia-v">500 m</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--text-mute);margin-bottom:6px">Speed</div>
            <input type="range" id="ai-spd" min="10" max="70" value="17" style="width:100%;height:5px;-webkit-appearance:none;background:var(--surface-2);border-radius:99px;outline:none">
            <div style="font-size:12px;font-weight:800;margin-top:4px" id="ai-spd-v">17 km/s</div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px">
          ${[
            { v:'iron', e:'⚙️', n:'Iron', d:'7800' },
            { v:'stone', e:'🪨', n:'Stone', d:'2500' },
            { v:'comet', e:'❄️', n:'Comet', d:'900' },
            { v:'gold', e:'🥇', n:'Gold', d:'19300' },
          ].map((c, i) => `
            <button data-comp="${c.v}" data-density="${c.d}" class="ai-comp-btn${i === 0 ? ' active' : ''}" style="padding:8px 4px;background:var(--surface-2);border:2px solid ${i === 0 ? 'var(--accent)' : 'transparent'};border-radius:12px;color:var(--text);font-weight:800;font-size:10px;cursor:pointer">
              <div style="font-size:14px">${c.e}</div>
              <div style="margin-top:2px">${c.n}</div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
    <style>
      #ai-map .leaflet-tile-pane{ filter: brightness(.85) contrast(1.1); }
      #ai-map .leaflet-control-attribution{ font-size:9px; opacity:.5; }
    </style>
  `;

  const mapEl = $('#ai-map', root);
  const threeHolder = $('#ai-three', root);
  const launchBtn = $('#ai-launch', root);
  const targetEl = $('#ai-target', root);

  // Leaflet map
  const map = L.map(mapEl, {
    center: [22.5, 79.0], zoom: 5, zoomControl: false,
    maxBounds: [[5, 60], [40, 100]],
  });

  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18, attribution: 'Tiles © Esri',
  }).addTo(map);

  L.rectangle([[6.5, 68], [37, 97]], {
    color: '#f59e0b', weight: 2, fill: false, opacity: 0.7, dashArray: '6 6',
  }).addTo(map);

  CITIES.forEach(c => {
    L.circleMarker([c.lat, c.lng], {
      radius: 4, color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 1, weight: 1,
    }).addTo(map).bindTooltip(c.n, { permanent: true, direction: 'right', className: 'city-tooltip', offset: [6, 0] });
  });

  const styleEl = document.createElement('style');
  styleEl.textContent = `.city-tooltip{ background:rgba(10,15,30,.85); border:1px solid rgba(251,191,36,.4); color:#fbbf24; font-size:10px; font-weight:800; padding:2px 6px; border-radius:6px; box-shadow:none; } .city-tooltip::before{ display:none; }`;
  document.head.appendChild(styleEl);

  let sel = null;
  let marker = null;

  map.on('click', e => {
    sel = e.latlng;
    if (marker) map.removeLayer(marker);
    marker = L.circleMarker(sel, {
      radius: 10, color: '#fbbf24', fillColor: '#fbbf24', fillOpacity: 0.4, weight: 3,
    }).addTo(map);
    let r = 10;
    const pulse = setInterval(() => {
      r = r >= 20 ? 10 : r + 1;
      marker.setRadius(r);
    }, 100);
    setTimeout(() => clearInterval(pulse), 3000);

    targetEl.textContent = `${sel.lat.toFixed(2)}°N, ${sel.lng.toFixed(2)}°E`;
    launchBtn.disabled = false;
    launchBtn.textContent = '🚀 LAUNCH ASTEROID';
    launchBtn.style.opacity = '1';
    haptic(15);
  });

  const dia = $('#ai-dia', root), spd = $('#ai-spd', root);
  let density = 7800;

  const updSliders = () => {
    const d = +dia.value, s = +spd.value;
    $('#ai-dia-v', root).textContent = d >= 1000 ? (d/1000).toFixed(1) + ' km' : d + ' m';
    $('#ai-spd-v', root).textContent = s + ' km/s';
  };
  [dia, spd].forEach(el => el.addEventListener('input', updSliders));
  updSliders();

  $$('.ai-comp-btn', root).forEach(btn => {
    btn.onclick = () => {
      $$('.ai-comp-btn', root).forEach(b => b.style.borderColor = 'transparent');
      btn.style.borderColor = 'var(--accent)';
      density = +btn.dataset.density;
      haptic(8);
    };
  });

  /* ============================================================
     3D BLAST — Three.js overlay
     ============================================================ */
  let threeScene = null, threeCamera = null, threeRenderer = null, threeRAF = null;

  function initThree(){
    if (threeScene) return;
    threeScene = new THREE.Scene();
    const w = threeHolder.clientWidth, h = threeHolder.clientHeight;
    threeCamera = new THREE.PerspectiveCamera(50, w / h, 0.1, 5000);
    threeCamera.position.set(0, 0, 60);
    threeCamera.lookAt(0, 0, 0);

    threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    threeRenderer.setSize(w, h);
    threeRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    threeRenderer.setClearColor(0x000000, 0);
    threeHolder.appendChild(threeRenderer.domElement);

    window.addEventListener('resize', () => {
      if (!threeRenderer) return;
      const w2 = threeHolder.clientWidth, h2 = threeHolder.clientHeight;
      threeCamera.aspect = w2 / h2;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(w2, h2);
    });
  }

  function runBlast(latlng, d, v, density){
    initThree();

    // Physics
    const craterM = 1.161 * Math.pow(density / 2500, 1/3) * Math.pow(d, 0.78) * Math.pow(v, 0.44);
    const craterKm = craterM / 1000;
    const fireballKm = craterKm * 8;
    const shockwaveKm = craterKm * 20;
    const energy = 0.5 * ((Math.PI/6) * Math.pow(d,3) * density) * Math.pow(v * 1000, 2);
    const megatons = energy / 4.184e15;
    const magnitude = Math.max(0, (Math.log10(energy) - 4.8) / 1.5);
    const casualties = Math.round(Math.PI * Math.pow(shockwaveKm, 2) * 450);

    // Screen position of impact
    const point = map.latLngToContainerPoint(latlng);
    const ndcX = (point.x / mapEl.clientWidth) * 2 - 1;
    const ndcY = -(point.y / mapEl.clientHeight) * 2 + 1;

    // Compute world coords at z=0 plane
    const fov = threeCamera.fov * Math.PI / 180;
    const dist = threeCamera.position.z;
    const height = 2 * Math.tan(fov / 2) * dist;
    const width = height * threeCamera.aspect;
    const worldX = ndcX * width / 2;
    const worldY = ndcY * height / 2;

    // Clean previous
    while (threeScene.children.length) threeScene.remove(threeScene.children[0]);

    // Lights
    threeScene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const blastLight = new THREE.PointLight(0xffaa00, 0, 200);
    blastLight.position.set(worldX, worldY, 5);
    threeScene.add(blastLight);

    // Fireball — expanding emissive sphere
    const fireGeo = new THREE.SphereGeometry(1, 32, 32);
    const fireMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const fireball = new THREE.Mesh(fireGeo, fireMat);
    fireball.position.set(worldX, worldY, 0);
    threeScene.add(fireball);

    // Inner core — white hot
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), coreMat);
    core.position.copy(fireball.position);
    threeScene.add(core);

    // Shockwave rings — 3 concentric, expanding
    const rings = [];
    for (let i = 0; i < 3; i++){
      const ringGeo = new THREE.RingGeometry(0.98, 1.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xffffff : i === 1 ? 0xffaa00 : 0xff4444,
        transparent: true, opacity: 0.9, side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(worldX, worldY, 0.1 + i * 0.05);
      threeScene.add(ring);
      rings.push({ mesh: ring, mat: ringMat });
    }

    // Debris particles — 500
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const colors = new Float32Array(particleCount * 3);
    const palette = [
      [1, 0.9, 0.3], [1, 0.6, 0.2], [1, 0.3, 0.1], [1, 1, 1], [0.9, 0.4, 0.1],
    ];
    for (let i = 0; i < particleCount; i++){
      positions[i*3] = worldX;
      positions[i*3+1] = worldY;
      positions[i*3+2] = 0;
      const angle = Math.random() * Math.PI * 2;
      const speed = 8 + Math.random() * 35;
      const verticalBias = -2 + Math.random() * 15; // some go up
      velocities.push({
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed + verticalBias,
        z: (Math.random() - 0.5) * 15,
      });
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i*3] = c[0]; colors[i*3+1] = c[1]; colors[i*3+2] = c[2];
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.7, vertexColors: true, transparent: true, opacity: 1,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    threeScene.add(particles);

    // Scale in world units — how big should blast look?
    // Use pixel radius estimate, convert to world
    const pxPerKm = Math.abs(map.latLngToContainerPoint([latlng.lat, latlng.lng + 1]).x - point.x);
    const shockPx = shockwaveKm * pxPerKm;
    const firePx = fireballKm * pxPerKm;
    const corePx = craterKm * pxPerKm;

    const pixelToWorld = width / mapEl.clientWidth;
    const maxShockWorld = shockPx * pixelToWorld;
    const maxFireWorld = firePx * pixelToWorld;
    const maxCoreWorld = Math.max(corePx * pixelToWorld, 0.5);

    let t0 = performance.now();
    const duration = 2800;

    function loop(){
      const now = performance.now();
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / duration);

      // Easing
      const easeOut = 1 - Math.pow(1 - p, 3);
      const easeInOut = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

      // Fireball
      const fireScale = Math.max(0.1, maxFireWorld * easeOut);
      fireball.scale.setScalar(fireScale);
      fireMat.opacity = Math.max(0, 1 - p * 1.2);

      // Core
      const coreScale = Math.max(0.05, maxCoreWorld * easeOut * 1.5);
      core.scale.setScalar(coreScale);
      coreMat.opacity = Math.max(0, 1 - p * 1.8);

      // Rings
      rings.forEach((r, i) => {
        const ringP = Math.min(1, (p + i * 0.15) / 1.15);
        const rEase = 1 - Math.pow(1 - ringP, 2.5);
        const ringRadius = maxShockWorld * rEase * (1 + i * 0.3);
        r.mesh.scale.setScalar(ringRadius);
        r.mat.opacity = Math.max(0, 1 - ringP * 1.3);
      });

      // Light flicker
      blastLight.intensity = Math.max(0, 3 - p * 4);

      // Particles
      const posAttr = particles.geometry.attributes.position;
      const posArr = posAttr.array;
      for (let i = 0; i < particleCount; i++){
        const vel = velocities[i];
        const px = posArr[i*3] + vel.x * 0.25;
        const py = posArr[i*3+1] + vel.y * 0.25;
        const pz = posArr[i*3+2] + vel.z * 0.25;
        posArr[i*3] = px;
        posArr[i*3+1] = py;
        posArr[i*3+2] = pz;
        // Gravity & drag
        vel.x *= 0.97;
        vel.y = vel.y * 0.97 - 0.4;
        vel.z *= 0.97;
      }
      posAttr.needsUpdate = true;
      pMat.opacity = Math.max(0, 1 - p * 1.1);
      pMat.size = 0.7 + p * 0.5;

      threeRenderer.render(threeScene, threeCamera);

      if (p < 1){
        threeRAF = requestAnimationFrame(loop);
      } else {
        // Keep crater visible briefly, then fade
        setTimeout(() => {
          if (threeRAF) cancelAnimationFrame(threeRAF);
          // Fade out everything
          const fadeStart = performance.now();
          function fadeLoop(){
            const fp = Math.min(1, (performance.now() - fadeStart) / 800);
            const opa = 1 - fp;
            fireMat.opacity = Math.max(0, opa * 0.3);
            pMat.opacity = Math.max(0, opa * 0.3);
            rings.forEach(r => r.mat.opacity = opa * 0.2);
            coreMat.opacity = opa * 0.3;
            threeRenderer.render(threeScene, threeCamera);
            if (fp < 1) requestAnimationFrame(fadeLoop);
            else {
              threeScene.clear();
              threeRenderer.render(threeScene, threeCamera);
              showResults({ craterKm, fireballKm, shockwaveKm, megatons, magnitude, casualties });
            }
          }
          fadeLoop();
        }, 500);
      }
    }

    threeRAF = requestAnimationFrame(loop);
  }

  function showResults(r){
    root.querySelectorAll('.ai-results').forEach(el => el.remove());
    const panel = document.createElement('div');
    panel.className = 'ai-results';
    panel.style.cssText = `position:absolute;bottom:90px;left:18px;right:18px;z-index:10;background:rgba(10,15,30,.95);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid rgba(239,68,68,.4);border-radius:18px;padding:18px;color:#fff;animation:cardIn .4s;box-shadow:0 12px 40px rgba(0,0,0,.6)`;
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-weight:900;font-size:15px">💥 Impact Analysis</div>
        <button id="ai-res-close" style="width:26px;height:26px;border-radius:8px;background:rgba(255,255,255,.1);color:#fff;font-weight:800;font-size:12px;border:none;cursor:pointer">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px">
        <div><span style="opacity:.6">Crater</span><br><b>${r.craterKm.toFixed(2)} km</b></div>
        <div><span style="opacity:.6">Fireball</span><br><b>${r.fireballKm.toFixed(1)} km</b></div>
        <div><span style="opacity:.6">Shockwave</span><br><b>${r.shockwaveKm.toFixed(1)} km</b></div>
        <div><span style="opacity:.6">Earthquake</span><br><b>M ${r.magnitude.toFixed(1)}</b></div>
        <div><span style="opacity:.6">Energy</span><br><b>${r.megatons > 1e6 ? (r.megatons/1e6).toFixed(1)+'M' : r.megatons.toFixed(0)} MT</b></div>
        <div><span style="opacity:.6">Casualties</span><br><b style="color:#ef4444">${r.casualties.toLocaleString('en-IN')}+</b></div>
      </div>
    `;
    root.querySelector('div[style*="position:relative"]').appendChild(panel);
    panel.querySelector('#ai-res-close').onclick = () => panel.remove();
  }

  launchBtn.onclick = () => {
    if (!sel) return;
    const d = +dia.value, v = +spd.value;
    launchBtn.disabled = true;
    launchBtn.textContent = '💥 IMPACT IN PROGRESS...';
    launchBtn.style.opacity = '.7';
    haptic([20, 30, 50]);
    setTimeout(() => runBlast(sel, d, v, density), 200);
    setTimeout(() => {
      launchBtn.textContent = '🚀 LAUNCH AGAIN';
      launchBtn.disabled = false;
      launchBtn.style.opacity = '1';
    }, 3800);
  };
});

/* ---------- DEEP INDIA (old fallback — will be overridden by 3d version) ---------- */
/* ---------- SPACE EXPLORATION (old fallback) ---------- */
/* ---------- HISTORY TIMELINE (old fallback) ---------- */
/* ---------- FUTURE VISION ---------- */
register('future-vision',{
  title:'See The Future', icon:'🔮', tag:'Original', category:'Science',
  desc:'Slide from 2026 to 2100. Research-based predictions.',
  tags:['future'], type:'native',
}, function(root){
  const P = [
    { y:2026, i:'🤖', t:'AI Everywhere', d:'Every phone, car, and laptop runs an AI assistant. India rolls out AI-based healthcare triage in rural clinics.' },
    { y:2028, i:'⚡', t:'Battery Breakthrough', d:'Solid-state EV batteries enter mass production. 800 km range becomes standard.' },
    { y:2030, i:'🚗', t:'EV Dominance', d:'30% of new cars in India are electric. Tesla opens its first factory in Pune.' },
    { y:2033, i:'🧬', t:'CRISPR Cures', d:'Sickle cell disease and certain cancers are routinely cured with gene therapy.' },
    { y:2035, i:'🌕', t:'Moon Base Alpha', d:'China, USA, and India operate research bases near the lunar south pole.' },
    { y:2040, i:'🧠', t:'Neurolink Maturity', d:'Brain-computer interfaces let paralysed patients type at 90 words per minute.' },
    { y:2045, i:'🧠', t:'AGI Arrives', d:'Artificial General Intelligence matches human reasoning. UBI becomes a serious policy debate.' },
    { y:2050, i:'🔥', t:'Climate Peak', d:'Delhi heatwaves regularly exceed 50°C. 1 billion climate refugees globally.' },
    { y:2060, i:'🚀', t:'Mars Colony', d:'First self-sustaining human settlement on Mars. Population: 120.' },
    { y:2070, i:'⚡', t:'Global Net Zero', d:'World reaches net-zero carbon emissions. India becomes a renewable energy superpower.' },
    { y:2080, i:'🧑‍🚀', t:'Interstellar Probes', d:'Breakthrough Starshot sends thousand-satellite swarm to Alpha Centauri.' },
    { y:2100, i:'🌍', t:'A New Chapter', d:'Humans live on 3 planets. Earth\'s population stabilises at 9 billion.' },
  ];
  let idx = 0;
  root.innerHTML = `
    <div class="ui" style="max-width:560px">
      <h2 class="ui__title">See The Future</h2>
      <p class="ui__sub">Drag the slider. Research-based predictions.</p>
      <div style="text-align:center;padding:28px 0 10px">
        <div id="fv-year" style="font-size:clamp(56px,16vw,90px);font-weight:900;letter-spacing:-4px;line-height:1;font-variant-numeric:tabular-nums;background:linear-gradient(135deg,#8b5cf6,#ec4899,#f59e0b);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">2026</div>
      </div>
      <input id="fv-slider" type="range" min="0" max="${P.length-1}" value="0" style="width:100%;height:6px;-webkit-appearance:none;background:var(--surface-2);border-radius:99px;outline:none;margin:20px 0">
      <div id="fv-card" class="panel" style="padding:26px;margin-top:16px;min-height:180px;display:flex;flex-direction:column;justify-content:center"></div>
    </div>
  `;
  function render(){
    const p = P[idx];
    $('#fv-year', root).textContent = p.y;
    const card = $('#fv-card', root);
    card.style.animation = 'none'; void card.offsetWidth; card.style.animation = 'cardIn .4s';
    card.innerHTML = `<div style="font-size:52px;text-align:center;margin-bottom:12px">${p.i}</div><h3 style="font-weight:900;font-size:20px;text-align:center;letter-spacing:-.5px;margin-bottom:10px">${p.t}</h3><p style="font-size:14px;line-height:1.6;color:var(--text-soft);text-align:center">${p.d}</p>`;
  }
  $('#fv-slider', root).addEventListener('input', e => { idx = +e.target.value; haptic(5); render(); });
  render();
});

/* ---------- ISRO MISSIONS ---------- */
register('isro-missions',{
  title:'ISRO Missions', icon:'🛰️', tag:'Original', category:'Science',
  desc:'50+ years of Indian space exploration.',
  tags:['space','india'], type:'native',
}, function(root){
  const M = [
    { y:1975, e:'🛰️', n:'Aryabhata', d:'India\'s first satellite. Launched with Soviet help. Weight: 360 kg.' },
    { y:1980, e:'🚀', n:'SLV-3 / Rohini', d:'First fully indigenous satellite launch. India joins the space club.' },
    { y:1993, e:'🛰️', n:'IRS-1E', d:'First Indian Remote Sensing satellite.' },
    { y:2008, e:'🌕', n:'Chandrayaan-1', d:'India discovers water molecules on the Moon. Cost: ₹386 crore.' },
    { y:2013, e:'🔴', n:'Mangalyaan', d:'India becomes the first Asian nation to reach Mars — on the first attempt.' },
    { y:2017, e:'🚀', n:'PSLV-C37', d:'104 satellites launched in a single rocket. World record.' },
    { y:2019, e:'🌕', n:'Chandrayaan-2', d:'Orbiter succeeds. Lander Vikram crashes. Data still useful.' },
    { y:2023, e:'🌕', n:'Chandrayaan-3', d:'India lands at the lunar south pole — first country in the world.' },
    { y:2023, e:'☀️', n:'Aditya-L1', d:'India\'s first solar observatory. Studies the Sun\'s corona.' },
    { y:2026, e:'🏗️', n:'Bharatiya Antariksh Station', d:'India\'s planned space station. Target launch: 2035.' },
  ];
  root.innerHTML = `
    <div class="ui" style="max-width:600px">
      <h2 class="ui__title">ISRO Missions</h2>
      <p class="ui__sub">From Aryabhata to Bharatiya Antariksh Station.</p>
      ${M.map((m, i) => `
        <div class="panel" style="animation:cardIn .4s ${Math.min(i*40,400)}ms backwards">
          <div style="display:flex;gap:14px;align-items:center">
            <div style="font-size:32px">${m.e}</div>
            <div style="flex:1">
              <div style="font-size:11px;font-weight:800;letter-spacing:1px;color:var(--text-mute);text-transform:uppercase">${m.y}</div>
              <div style="font-weight:900;font-size:15px;margin:4px 0">${m.n}</div>
              <div style="font-size:13px;line-height:1.5;color:var(--text-soft)">${m.d}</div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---------- SIZE OF INDIA ---------- */
register('size-of-india',{
  title:'Size of India', icon:'📏', tag:'Original', category:'Science',
  desc:'Visual height comparison — from India Gate to Mount Everest.',
  tags:['education'], type:'native',
}, function(root){
  const ITEMS = [
    { e:'🏛️', n:'India Gate', h:42, where:'New Delhi' },
    { e:'🗼', n:'Qutub Minar', h:72.5, where:'Delhi' },
    { e:'🏛️', n:'Taj Mahal', h:73, where:'Agra' },
    { e:'🗿', n:'Statue of Unity', h:182, where:'Gujarat' },
    { e:'🚀', n:'Falcon 9 Rocket', h:70, where:'SpaceX' },
    { e:'🏢', n:'Antilia', h:173, where:'Mumbai' },
    { e:'🏢', n:'Burj Khalifa', h:828, where:'Dubai' },
    { e:'🏔️', n:'Kanchenjunga', h:8586, where:'Sikkim' },
    { e:'🏔️', n:'K2', h:8611, where:'POK' },
    { e:'🏔️', n:'Mount Everest', h:8848, where:'Nepal/Tibet' },
  ];
  const max = Math.max(...ITEMS.map(i => i.h));
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Size of India</h2>
      <p class="ui__sub">Heights compared — in metres.</p>
      ${ITEMS.sort((a,b) => b.h - a.h).map((it, i) => `
        <div style="margin-bottom:16px;animation:cardIn .4s ${Math.min(i*40,400)}ms backwards">
          <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800;margin-bottom:6px">
            <span>${it.e} ${it.n} <span style="color:var(--text-mute);font-weight:600;font-size:11px">· ${it.where}</span></span>
            <span style="font-variant-numeric:tabular-nums">${it.h.toLocaleString()}m</span>
          </div>
          <div style="height:10px;background:var(--surface-2);border-radius:99px;overflow:hidden">
            <div style="height:100%;width:${(it.h/max)*100}%;background:linear-gradient(90deg,var(--accent),var(--info));border-radius:99px;transition:width .8s"></div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
});

/* ---------- HUMAN BODY ---------- */
register('human-body',{
  title:'Human Body Stats', icon:'🧬', tag:'Original', category:'Science',
  desc:'Enter your age. See what your body has actually done.',
  tags:['stats'], type:'native',
}, function(root){
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Human Body Stats</h2>
      <p class="ui__sub">Numbers your body has quietly racked up.</p>
      <input class="input" id="hb-age" type="number" placeholder="Your age" value="25" min="0" max="120" style="margin-bottom:14px;font-size:18px;font-weight:800;text-align:center">
      <div class="btn-row" style="margin-top:0;margin-bottom:20px"><button class="btn btn--block" id="hb-calc">Calculate</button></div>
      <div id="hb-res"></div>
    </div>
  `;
  $('#hb-calc', root).onclick = () => {
    const y = clamp(+$('#hb-age', root).value || 0, 0, 120);
    const d = y * 365;
    const hrs = d * 24, mins = hrs * 60;
    const beats = Math.round(mins * 72), breaths = Math.round(mins * 15);
    const steps = Math.round(d * 7000), sleepYrs = Math.round(y / 3 * 10) / 10;
    const foodKg = Math.round(d * 1.5), wordsSpoken = Math.round(d * 16000);
    const kmWalked = Math.round(steps * 0.7);
    $('#hb-res', root).innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;animation:cardIn .4s">
        <div class="panel"><div class="panel__label">Days Lived</div><div class="panel__value">${d.toLocaleString()}</div></div>
        <div class="panel"><div class="panel__label">Hours</div><div class="panel__value">${(hrs/1000).toFixed(1)}K</div></div>
        <div class="panel"><div class="panel__label">Heartbeats</div><div class="panel__value">${(beats/1e6).toFixed(1)}M</div></div>
        <div class="panel"><div class="panel__label">Breaths</div><div class="panel__value">${(breaths/1e6).toFixed(1)}M</div></div>
        <div class="panel"><div class="panel__label">Steps Taken</div><div class="panel__value">${(steps/1e6).toFixed(1)}M</div></div>
        <div class="panel"><div class="panel__label">Km Walked</div><div class="panel__value">${(kmWalked/1000).toFixed(1)}K</div></div>
        <div class="panel"><div class="panel__label">Hours Slept</div><div class="panel__value">${sleepYrs}y</div></div>
        <div class="panel"><div class="panel__label">Food Eaten</div><div class="panel__value">${(foodKg/1000).toFixed(1)}T</div></div>
        <div class="panel" style="grid-column:1/-1"><div class="panel__label">Words Spoken</div><div class="panel__value">${(wordsSpoken/1e6).toFixed(1)}M</div></div>
      </div>`;
    haptic(10);
  };
  $('#hb-calc', root).click();
});

/* ---------- EARTHQUAKE SIM ---------- */
register('earthquake-sim',{
  title:'Earthquake Simulator', icon:'🌋', tag:'Original', category:'Science',
  desc:'Slide the Richter scale. See the effect.',
  tags:['physics'], type:'native',
}, function(root){
  const ZONES = [
    { name:'Zone V — Very High', color:'#ef4444', places:'Kashmir, Himachal, Northeast India, Kutch, Andaman & Nicobar' },
    { name:'Zone IV — High', color:'#f59e0b', places:'Delhi, parts of UP, Bihar, West Bengal, Gujarat' },
    { name:'Zone III — Moderate', color:'#eab308', places:'Mumbai, Chennai, Kolkata, Bengaluru' },
    { name:'Zone II — Low', color:'#10b981', places:'Most of South India, Deccan Plateau' },
  ];
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Earthquake Simulator</h2>
      <p class="ui__sub">Drag to see what each magnitude does.</p>
      <div class="panel" style="text-align:center;padding:24px">
        <div class="panel__label">Magnitude</div>
        <div class="panel__value" id="eq-mag" style="font-size:64px;line-height:1;color:var(--danger)">6.0</div>
      </div>
      <input type="range" id="eq-slider" min="1" max="10" value="6" step="0.1" style="width:100%;height:8px;-webkit-appearance:none;background:var(--surface-2);border-radius:99px;outline:none;margin:16px 0 24px">
      <div id="eq-res"></div>
      <h3 style="font-weight:900;font-size:15px;margin:24px 0 12px">Seismic Zones of India</h3>
      ${ZONES.map(z => `<div class="panel" style="border-left:4px solid ${z.color}"><div class="panel__label" style="color:${z.color}">${z.name}</div><div style="font-size:13px;margin-top:4px;line-height:1.5">${z.places}</div></div>`).join('')}
    </div>
  `;
  const slider = $('#eq-slider', root);
  function upd(){
    const m = +slider.value;
    $('#eq-mag', root).textContent = m.toFixed(1);
    const energy = Math.pow(10, 1.5 * m + 4.8);
    const tnt = energy / 4.184e9;
    const effect = m < 3 ? 'Only sensitive instruments detect it' : m < 4 ? 'Felt indoors.' : m < 5 ? 'Felt by most.' : m < 6 ? 'Weak buildings crack.' : m < 7 ? 'Damage in populated areas.' : m < 8 ? 'Major damage.' : m < 9 ? 'Devastating.' : 'Catastrophic.';
    $('#eq-res', root).innerHTML = `
      <div class="panel" style="border-left:4px solid ${m < 4 ? '#10b981' : m < 6 ? '#eab308' : m < 8 ? '#f59e0b' : '#ef4444'}">
        <div class="panel__label">Energy Released</div>
        <div class="panel__value" style="color:var(--danger)">${tnt > 1e6 ? (tnt/1e6).toFixed(1) + ' MT' : tnt.toFixed(0) + ' tons'} TNT</div>
      </div>
      <div class="panel"><div class="panel__label">Effect</div><div style="font-size:14px;font-weight:700;line-height:1.5;margin-top:6px">${effect}</div></div>
    `;
  }
  slider.addEventListener('input', upd);
  upd();
});

/* ---------- CLIMATE ---------- */
register('climate-india',{
  title:'Climate Change India', icon:'🌡️', tag:'Original', category:'Science',
  desc:'Slider from 2026 to 2100.',
  tags:['climate'], type:'native',
}, function(root){
  const M = [
    { y:2026, i:'⚡', d:'India pushes 500 GW renewable target. Solar becomes cheapest power source.' },
    { y:2030, i:'🌊', d:'Sea level rises 5 cm. Mumbai and Chennai see more frequent tidal flooding.' },
    { y:2035, i:'🌪️', d:'Bay of Bengal cyclones become 30% more intense.' },
    { y:2040, i:'🔥', d:'Delhi summer heatwaves regularly exceed 48°C.' },
    { y:2045, i:'🌾', d:'Punjab wheat yields drop 20%. Farmers shift to millets and pulses.' },
    { y:2050, i:'🌊', d:'1 billion climate refugees globally.' },
    { y:2060, i:'🌊', d:'Mumbai builds a 30 km sea wall. Cost: ₹2 lakh crore.' },
    { y:2070, i:'🌡️', d:'Global average +2.5°C. India leads the world in solar.' },
    { y:2080, i:'🏙️', d:'Floating and elevated cities tested in Kochi and Dhaka.' },
    { y:2090, i:'🌱', d:'Reforestation and carbon capture stabilise.' },
    { y:2100, i:'🌍', d:'+3.5°C locked in. Coastal India reshaped.' },
  ];
  let idx = 0;
  root.innerHTML = `
    <div class="ui" style="max-width:560px">
      <h2 class="ui__title">Climate Change India</h2>
      <p class="ui__sub">Drag through time.</p>
      <div style="text-align:center;padding:24px 0 6px">
        <div id="cc-year" style="font-size:clamp(52px,15vw,84px);font-weight:900;letter-spacing:-3px;line-height:1;background:linear-gradient(135deg,#f59e0b,#ef4444,#dc2626);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;font-variant-numeric:tabular-nums">2026</div>
      </div>
      <input id="cc-slider" type="range" min="0" max="${M.length-1}" value="0" style="width:100%;height:8px;-webkit-appearance:none;background:linear-gradient(90deg,#10b981,#f59e0b,#ef4444);border-radius:99px;outline:none;margin:20px 0">
      <div id="cc-card" class="panel" style="padding:28px;text-align:center;min-height:180px;display:flex;flex-direction:column;justify-content:center"></div>
    </div>
  `;
  function render(){
    const m = M[idx];
    $('#cc-year', root).textContent = m.y;
    const card = $('#cc-card', root);
    card.style.animation = 'none'; void card.offsetWidth; card.style.animation = 'cardIn .4s';
    card.innerHTML = `<div style="font-size:56px;margin-bottom:14px">${m.i}</div><p style="font-size:15px;line-height:1.6;font-weight:600">${m.d}</p><div style="font-size:11px;color:var(--text-mute);font-weight:800;letter-spacing:1px;text-transform:uppercase;margin-top:16px">${idx+1} / ${M.length}</div>`;
  }
  $('#cc-slider', root).addEventListener('input', e => { idx = +e.target.value; haptic(5); render(); });
  render();
});

})();
