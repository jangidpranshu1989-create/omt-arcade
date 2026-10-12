/* ============================================================
   DEEP INDIA — Vertical 3D Shaft with Speed Modes
   ============================================================ */
(function(){
const { $, rand, clamp, haptic, register } = OMT;

const ENTRIES = [
  { d:0, e:'🌊', n:'Sea Surface', cat:'Surface', brief:'Where the ocean meets the sky. 71% of Earth is covered in water.', detail:'The Indian Ocean covers 20% of Earth\'s water surface and is the third-largest ocean.', stats:[{k:'Avg temp',v:'26°C'},{k:'Depth',v:'0m'},{k:'Salinity',v:'3.5%'}] },
  { d:10, e:'🐠', n:'Coral Reefs', cat:'Life', brief:'The rainforests of the sea. Support 25% of all marine life.', detail:'Lakshadweep alone hosts 500+ fish species, 78 coral species, and 82 species of seaweed.', stats:[{k:'Species',v:'2,000+'},{k:'Reef age',v:'5,000+ yrs'},{k:'Reef area',v:'India: 2,375 km²'}] },
  { d:40, e:'🤿', n:'Recreational Dive Limit', cat:'Human', brief:'40 meters is the absolute limit for recreational scuba diving.', detail:'Beyond 40m, nitrogen narcosis (the "rapture of the deep") and oxygen toxicity become severe risks.', stats:[{k:'Pressure',v:'5 atm'},{k:'PADI limit',v:'40m'},{k:'Air consumption',v:'4× surface rate'}] },
  { d:60, e:'🐬', n:'Spinner Dolphins', cat:'Life', brief:'Known for their acrobatic spinning leaps — up to 7 rotations in one jump.', detail:'They are the most social dolphins, traveling in pods of 20-100. Lakshadweep is a hotspot.', stats:[{k:'Length',v:'2m'},{k:'Speed',v:'30 km/h'},{k:'Pod size',v:'20-100'}] },
  { d:100, e:'🐢', n:'Olive Ridley Turtles', cat:'Life', brief:'5 lakh+ turtles arrive at Gahirmatha beach every year to nest.', detail:'Called "Arribada" (Spanish for "arrival"), a mass nesting event unique to the Odisha coast. Protects the species from predators.', stats:[{k:'Nesting',v:'5L+/yr'},{k:'Location',v:'Gahirmatha, Odisha'},{k:'Eggs',v:'80-100 per turtle'}] },
  { d:150, e:'🦈', n:'Tiger Sharks', cat:'Life', brief:'One of the largest sharks, reaching 5m in length.', detail:'Nicknamed "the garbage can of the sea" — license plates, tires, and even unexploded bombs have been found in their stomachs.', stats:[{k:'Length',v:'5m'},{k:'Depth',v:'350m'},{k:'Speed',v:'32 km/h'}] },
  { d:200, e:'🌑', n:'Twilight Begins', cat:'Zone', brief:'At 200m, photosynthesis stops. This is the start of the mesopelagic zone.', detail:'Only 1% of sunlight reaches this depth. Temperature drops sharply. This is the boundary between warm surface water and cold deep water.', stats:[{k:'Sunlight',v:'1%'},{k:'Zone',v:'Mesopelagic'},{k:'Temp',v:'12°C'}] },
  { d:250, e:'🐡', n:'Lanternfish', cat:'Life', brief:'The most abundant vertebrates on Earth — over 65% of ocean biomass.', detail:'They have photophores (light-producing organs) along their bodies that help them communicate, camouflage, and attract prey.', stats:[{k:'Biomass',v:'65% of ocean'},{k:'Length',v:'15cm'},{k:'Population',v:'~100 trillion'}] },
  { d:332, e:'🏅', n:'Deepest Scuba Dive', cat:'Human', brief:'The deepest scuba dive ever recorded — 332.35 meters.', detail:'Ahmed Gabr (Egyptian, 2014) took just 12 minutes to descend but 15 hours to safely ascend, using 11 tanks and a rebreather.', stats:[{k:'Record',v:'332.35m'},{k:'Year',v:'2014'},{k:'Ascent time',v:'15 hours'}] },
  { d:500, e:'🐋', n:'Blue Whale Zone', cat:'Life', brief:'The largest animals ever known — bigger than any dinosaur.', detail:'Their heart is the size of a small car and can be heard from 3 km away. They migrate thousands of kilometers between feeding and breeding grounds.', stats:[{k:'Weight',v:'200 tonnes'},{k:'Heart',v:'600 kg'},{k:'Length',v:'30m'}] },
  { d:1000, e:'🌌', n:'Midnight Zone', cat:'Zone', brief:'No sunlight reaches here. It is permanently dark, forever.', detail:'90% of creatures here produce their own light through bioluminescence. This zone holds more biomass than all fisheries combined.', stats:[{k:'Sunlight',v:'0%'},{k:'Temp',v:'4°C'},{k:'Pressure',v:'100 atm'}] },
  { d:2000, e:'🦑', n:'Giant Squid', cat:'Life', brief:'A real-life sea monster — up to 13 meters long.', detail:'Its eyes are the largest in the animal kingdom — up to 27cm in diameter, the size of a dinner plate. Only filmed alive a handful of times.', stats:[{k:'Length',v:'13m'},{k:'Eyes',v:'27cm'},{k:'Weight',v:'275 kg'}] },
  { d:3000, e:'🌡️', n:'3,000m Depth', cat:'Zone', brief:'At 3 km deep, the pressure would crush a normal submarine.', detail:'Only specially designed deep-sea vehicles (like DSV Alvin) can reach this depth. Water is around 2°C, just above freezing.', stats:[{k:'Pressure',v:'300 atm'},{k:'Temp',v:'2°C'},{k:'Light',v:'0%'}] },
  { d:3800, e:'🚢', n:'Titanic Wreck', cat:'Human', brief:'The Titanic rests at 3,800m in the North Atlantic.', detail:'Discovered in 1985 by Robert Ballard, 73 years after it sank. The wreck is slowly being consumed by iron-eating bacteria.', stats:[{k:'Depth',v:'3,800m'},{k:'Found',v:'1985'},{k:'Depth rating',v:'Half a century\'s wait'}] },
  { d:6000, e:'🏔️', n:'Hadal Begins', cat:'Zone', brief:'Named after Hades — the Greek god of the underworld.', detail:'The Hadal zone exists only in oceanic trenches. Only 3 people have ever reached the deepest point.', stats:[{k:'Explorers',v:'3'},{k:'Zone',v:'Hadal'},{k:'Trenches',v:'27 worldwide'}] },
  { d:7258, e:'🏔️', n:'Java Trench', cat:'Geography', brief:'The deepest point in the Indian Ocean.', detail:'A subduction zone where the Indian tectonic plate slides under the Sunda plate at ~60mm/year. Tsunami-prone region.', stats:[{k:'Depth',v:'7,258m'},{k:'Type',v:'Subduction'},{k:'Convergence',v:'60mm/year'}] },
  { d:9000, e:'🕳️', n:'9,000m Depth', cat:'Zone', brief:'Only robots can survive here. Humans are essentially absent.', detail:'The pressure equals 1,000 elephants standing on your head. Temperatures hover just above freezing. A few species of amphipods thrive.', stats:[{k:'Pressure',v:'900 atm'},{k:'Visitors',v:'<20'},{k:'Species',v:'Amphipods, snailfish'}] },
  { d:10994, e:'🏆', n:'Mariana Trench', cat:'Geography', brief:'The deepest point on Earth — deeper than Everest is tall.', detail:'Only 3 people have ever reached the bottom: Jacques Piccard & Don Walsh (1960), James Cameron (2012), Victor Vescovo (2019).', stats:[{k:'Depth',v:'10,994m'},{k:'Explorers',v:'3'},{k:'Pressure',v:'1,086 atm'}] },
];

register('deep-india',{
  title:'Deep India — Ocean Scroll',
  icon:'🌊',
  tag:'Original',
  category:'Science',
  desc:'Vertical 3D descent. Speed modes. Tap creatures for details.',
  tags:['ocean','3d'],
  type:'native',
}, function(root){
  root.style.cssText = 'position:relative; height:100%; overflow:hidden; background:#000; padding:0;';

  root.innerHTML = `
    <div id="di-canvas" style="position:absolute; inset:0; z-index:1"></div>

    <div id="di-loading" style="position:absolute; inset:0; z-index:20; display:grid; place-items:center; background:#000; color:#7dd3fc; transition:opacity .5s">
      <div style="text-align:center">
        <div style="width:44px;height:44px;border:3px solid rgba(125,211,252,.2);border-top-color:#7dd3fc;border-radius:50%;margin:0 auto 16px;animation:di-spin 1s linear infinite"></div>
        <div style="font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;opacity:.7">Loading 3D Ocean</div>
      </div>
    </div>

    <div id="di-hud" style="position:absolute;top:0;right:0;padding:20px 24px;z-index:10;pointer-events:none;text-align:right">
      <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:.6;font-weight:800;color:#7dd3fc">Depth</div>
      <div style="font-size:34px;font-weight:900;letter-spacing:-1.5px;font-variant-numeric:tabular-nums;line-height:1.05;color:#fff;text-shadow:0 2px 12px rgba(0,0,0,.8)" id="di-depth">0m</div>
      <div style="font-size:11px;font-weight:800;color:#7dd3fc;margin-top:4px" id="di-zone">Sunlight Zone</div>
    </div>

    <div id="di-card" style="position:absolute;left:24px;bottom:120px;right:24px;z-index:10;pointer-events:auto;opacity:0;transition:opacity .4s;background:rgba(0,10,30,.75);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid rgba(125,211,252,.25);border-radius:20px;padding:18px;color:#fff">
      <div style="display:flex;gap:14px;align-items:center">
        <div style="font-size:44px;flex-shrink:0" id="di-card-emoji">🌊</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#7dd3fc;margin-bottom:4px" id="di-card-depth">0m</div>
          <div style="font-size:18px;font-weight:900;letter-spacing:-.3px;line-height:1.2" id="di-card-name">Sea Surface</div>
        </div>
      </div>
      <div style="font-size:13px;line-height:1.5;color:rgba(255,255,255,.75);margin-top:12px" id="di-card-brief">Where the ocean meets the sky.</div>
      <button id="di-card-more" style="margin-top:12px;padding:8px 14px;border-radius:10px;background:rgba(125,211,252,.15);border:1px solid rgba(125,211,252,.3);color:#7dd3fc;font-weight:800;font-size:12px;cursor:pointer">More info →</button>
    </div>

    <div id="di-speed" style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);z-index:15;display:flex;gap:6px;padding:6px;background:rgba(0,10,30,.7);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(125,211,252,.2);border-radius:14px">
      <button data-speed="slow" class="di-speed-btn" style="padding:8px 14px;border-radius:10px;background:transparent;border:none;color:rgba(255,255,255,.6);font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">🐢 Slow</button>
      <button data-speed="normal" class="di-speed-btn active" style="padding:8px 14px;border-radius:10px;background:rgba(125,211,252,.2);border:none;color:#7dd3fc;font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">⚡ Normal</button>
      <button data-speed="fast" class="di-speed-btn" style="padding:8px 14px;border-radius:10px;background:transparent;border:none;color:rgba(255,255,255,.6);font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">🚀 Fast</button>
    </div>

    <div id="di-scroll" style="position:absolute; inset:0; z-index:5; overflow-y:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none;">
      <div id="di-scroll-content" style="height:24000px"></div>
    </div>

    <style>
      #di-scroll::-webkit-scrollbar{display:none}
      @keyframes di-spin{to{transform:rotate(360deg)}}
    </style>
  `;

  const canvasHolder = $('#di-canvas', root);
  const scrollEl = $('#di-scroll', root);
  const scrollContent = $('#di-scroll-content', root);
  const depthEl = $('#di-depth', root);
  const zoneEl = $('#di-zone', root);
  const cardEl = $('#di-card', root);
  const cardEmoji = $('#di-card-emoji', root);
  const cardDepth = $('#di-card-depth', root);
  const cardName = $('#di-card-name', root);
  const cardBrief = $('#di-card-brief', root);
  const cardMore = $('#di-card-more', root);
  const loadingEl = $('#di-loading', root);

  let destroyed = false;
  let speedMode = 'normal';
  let currentEntry = ENTRIES[0];
  let attempts = 0;

  // Speed affects scroll height (taller = slower descent per pixel scrolled)
  const SPEED_HEIGHTS = { slow: 48000, normal: 24000, fast: 12000 };

  function setSpeed(mode){
    speedMode = mode;
    scrollContent.style.height = SPEED_HEIGHTS[mode] + 'px';
    $$('.di-speed-btn', root).forEach(b => {
      const isActive = b.dataset.speed === mode;
      b.style.background = isActive ? 'rgba(125,211,252,.2)' : 'transparent';
      b.style.color = isActive ? '#7dd3fc' : 'rgba(255,255,255,.6)';
    });
    haptic(8);
  }

  $$('.di-speed-btn', root).forEach(b => b.onclick = () => setSpeed(b.dataset.speed));

  function waitAndInit(cb){
    attempts++;
    const w = canvasHolder.clientWidth;
    const h = canvasHolder.clientHeight;
    const hasThree = !!window.THREE;
    const hasOMT = !!(OMT && OMT.createScene);

    if (w > 10 && h > 10 && hasThree && hasOMT){ cb(); return; }
    if (attempts > 60){
      loadingEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#f87171"><div style="font-size:40px;margin-bottom:12px">⚠️</div><div style="font-weight:800;font-size:14px">3D could not load</div></div>';
      return;
    }
    setTimeout(() => { if (!destroyed) waitAndInit(cb); }, 80);
  }

  waitAndInit(() => {
    if (destroyed) return;
    try { initThree(); } catch (e){
      console.error('[Deep India]', e);
      loadingEl.innerHTML = '<div style="text-align:center;padding:40px 20px;color:#f87171"><div style="font-size:40px;margin-bottom:12px">⚠️</div><div style="font-weight:800;font-size:14px">' + e.message + '</div></div>';
    }
  });

  function initThree(){
    const THREE = window.THREE;
    const { scene, camera, renderer, startLoop, clickables } = OMT.createScene(canvasHolder, { bg: 0x000814 });
    scene.fog = new THREE.FogExp2(0x000814, 0.035);

    camera.position.set(0, 0, 7);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x4466aa, 1.1));
    const dirLight = new THREE.DirectionalLight(0x88ccff, 1.3);
    dirLight.position.set(0, 20, 5);
    scene.add(dirLight);

    // Marine snow that follows camera
    const particleLayers = [];
    for (let g = 0; g < 3; g++){
      const count = 250 + g * 80;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++){
        pos[i*3] = (Math.random() - 0.5) * 25;
        pos[i*3+1] = (Math.random() - 0.5) * 40;
        pos[i*3+2] = (Math.random() - 0.5) * 15 - 3;
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({
        color: 0xaaccff, size: 0.08 + g * 0.03,
        transparent: true, opacity: 0.45 - g * 0.08,
      });
      const p = new THREE.Points(geo, mat);
      scene.add(p);
      particleLayers.push({ points: p });
    }

    // Depth mapping — 3D Y = -depth/10994 * 200
    const MAX_3D_DEPTH = 200;
    const MAX_DEPTH_M = 10994;

    const colorMap = {
      '🌊':0x0ea5e9, '🐠':0xfbbf24, '🤿':0x3b82f6, '🐬':0x06b6d4,
      '🐢':0x10b981, '🦈':0x94a3b8, '🌑':0x1e293b, '🐡':0xf97316,
      '🏅':0xfbbf24, '🐋':0x3b82f6, '🌌':0x1e1b4b, '🦑':0x8b5cf6,
      '🌡️':0xef4444, '🚢':0xa16207, '🏔️':0x78716c, '🕳️':0x111827,
      '🏆':0xfbbf24,
    };

    const creatures = [];
    ENTRIES.forEach((entry, idx) => {
      const y3D = -(entry.d / MAX_DEPTH_M) * MAX_3D_DEPTH;
      // Alternate left/right for a "shaft corridor" feel
      const side = idx % 2 === 0 ? -1 : 1;
      const x3D = side * (1.5 + Math.random() * 1.5);
      const z3D = -1 + Math.random() * 2;

      const group = new THREE.Group();
      group.position.set(x3D, y3D, z3D);

      const color = colorMap[entry.e] || 0x64748b;
      const size = 0.6 + Math.random() * 0.4;

      // Core sphere
      const geo = new THREE.SphereGeometry(size, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: 1.0,
        roughness: 0.3, metalness: 0.3,
        transparent: true, opacity: 1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      // Glow halo
      const haloGeo = new THREE.SphereGeometry(size * 2.2, 16, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color, transparent: true, opacity: 0.12, side: THREE.BackSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);

      // Point light
      const light = new THREE.PointLight(color, 1.3, 6);
      group.add(light);

      // Invisible big hit area (easy tap)
      const hitGeo = new THREE.SphereGeometry(size * 3, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData.info = {
        title: entry.n, subtitle: entry.cat, emoji: entry.e,
        brief: entry.brief, detail: entry.detail, stats: entry.stats,
        category: entry.cat + ' · ' + entry.d.toLocaleString('en-IN') + 'm',
      };
      group.add(hitMesh);
      clickables.push(hitMesh);

      // Depth marker ring at each entry (like beads on a thread)
      const ringGeo = new THREE.RingGeometry(2.5, 2.6, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x334155, side: THREE.DoubleSide, transparent: true, opacity: 0.3,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, y3D, 0);
      scene.add(ring);

      scene.add(group);
      creatures.push({ group, mesh, halo, data: entry, y3D });
    });

    // Central vertical shaft line (subtle)
    const shaftPoints = [];
    for (let y = 0; y >= -MAX_3D_DEPTH; y -= 2) shaftPoints.push(new THREE.Vector3(0, y, 0));
    const shaftGeo = new THREE.BufferGeometry().setFromPoints(shaftPoints);
    const shaftLine = new THREE.Line(shaftGeo, new THREE.LineBasicMaterial({ color: 0x1e40af, transparent: true, opacity: 0.25 }));
    scene.add(shaftLine);

    // Click handler
    renderer.domElement.addEventListener('click', (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(clickables, false);
      if (hits.length > 0){
        const data = hits[0].object.userData.info;
        if (data){
          haptic(15);
          OMT.showInfoCard(data, e.clientX - 150, e.clientY - 200);
        }
      }
    });

    // Card more info
    cardMore.onclick = () => {
      const d = currentEntry;
      OMT.showInfoCard({
        title: d.n, subtitle: d.cat, emoji: d.e,
        brief: d.brief, detail: d.detail, stats: d.stats,
        category: d.cat + ' · ' + d.d.toLocaleString('en-IN') + 'm',
      }, window.innerWidth / 2 - 150, window.innerHeight / 2 - 200);
    };

    let camY = 0;
    let lastDepth = -1;
    let lastZone = '';
    let lastEntryIdx = -1;

    function getProgress(){
      const max = scrollEl.scrollHeight - scrollEl.clientHeight;
      return max > 0 ? scrollEl.scrollTop / max : 0;
    }

    startLoop(() => {
      if (destroyed) return;
      const progress = getProgress();
      const targetCamY = -progress * MAX_3D_DEPTH;
      camY += (targetCamY - camY) * 0.16;

      const t = performance.now() * 0.0005;
      camera.position.x = Math.sin(t) * 0.4;
      camera.position.y = camY;
      camera.position.z = 7 + Math.cos(t * 0.7) * 0.3;
      camera.lookAt(0, camY - 2, 0);

      // Depth HUD
      const depth = Math.round(progress * MAX_DEPTH_M);
      if (Math.abs(depth - lastDepth) > 3){
        lastDepth = depth;
        depthEl.textContent = depth.toLocaleString('en-IN') + 'm';
      }
      let z = 'Sunlight Zone';
      if (depth > 200) z = 'Twilight Zone';
      if (depth > 1000) z = 'Midnight Zone';
      if (depth > 4000) z = 'Abyssal Zone';
      if (depth > 6000) z = 'Hadal Zone';
      if (z !== lastZone){ lastZone = z; zoneEl.textContent = z; }

      // Background darken with depth
      const ratio = progress;
      const bgColor = new THREE.Color().lerpColors(
        new THREE.Color(0x0a1e3d), new THREE.Color(0x000000),
        Math.min(1, ratio * 1.5)
      );
      scene.fog.color.copy(bgColor);
      scene.background.copy(bgColor);
      scene.fog.density = 0.025 + ratio * 0.05;

      // Find nearest creature
      let nearestIdx = -1;
      let nearestDist = Infinity;
      creatures.forEach((c, i) => {
        const dist = Math.abs(c.y3D - camY);
        if (dist < nearestDist){ nearestDist = dist; nearestIdx = i; }
      });

      // Update creatures
      const time = performance.now() * 0.001;
      creatures.forEach((c, i) => {
        const dist = Math.abs(c.y3D - camY);
        const visible = dist < 18;
        const opa = visible ? Math.max(0, 1 - dist / 18) : 0;

        c.mesh.material.opacity = opa;
        c.halo.material.opacity = 0.12 * opa;
        c.group.visible = opa > 0.02;

        c.mesh.rotation.y = time * 0.5 + i;
        c.mesh.rotation.x = Math.sin(time * 0.7 + i) * 0.15;
        c.mesh.position.y = Math.sin(time * 1.2 + i) * 0.2;
        c.halo.scale.setScalar(1 + Math.sin(time * 1.5 + i) * 0.1);
      });

      // Update info card
      if (nearestIdx !== lastEntryIdx && nearestDist < 12){
        lastEntryIdx = nearestIdx;
        currentEntry = creatures[nearestIdx].data;
        cardEmoji.textContent = currentEntry.e;
        cardDepth.textContent = currentEntry.d.toLocaleString('en-IN') + 'm';
        cardName.textContent = currentEntry.n;
        cardBrief.textContent = currentEntry.brief;
        cardEl.style.opacity = '1';
      } else if (nearestDist >= 12 && cardEl.style.opacity !== '0'){
        cardEl.style.opacity = '0';
        lastEntryIdx = -1;
      }

      // Particles follow camera
      particleLayers.forEach((pl, i) => {
        pl.points.position.y = camY;
        pl.points.rotation.y = time * (i + 1) * 0.08;
      });
    });

    setTimeout(() => {
      loadingEl.style.opacity = '0';
      setTimeout(() => loadingEl.style.display = 'none', 500);
    }, 300);

    const check = setInterval(() => {
      if (!document.body.contains(root)){ destroyed = true; clearInterval(check); }
    }, 500);
  }
});

})();
