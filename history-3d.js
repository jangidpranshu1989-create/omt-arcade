/* ============================================================
   HISTORY TIMELINE — Vertical 3D with Speed Modes
   ============================================================ */
(function(){
const { $, rand, clamp, haptic, register } = OMT;

const EVENTS = [
  { y:'13.8 BYA', e:'💥', t:'The Big Bang', d:'Space, time, matter, and energy emerge from a singularity.', color:0xffdd00, detail:'The universe began as an infinitely hot, infinitely dense point. Everything we see today came from this single moment.', stats:[{k:'Age',v:'13.8 billion yrs'},{k:'Temp',v:'10³² °C'}] },
  { y:'13.6 BYA', e:'🌌', t:'First Stars Ignite', d:'Hydrogen fusion begins. The universe lights up.', color:0x94a3b8, detail:'The first stars (Population III) were massive, short-lived, and forged the first heavy elements.', stats:[{k:'After Big Bang',v:'200 My'},{k:'Star type',v:'Pop III'}] },
  { y:'4.6 BYA', e:'☀️', t:'Solar System Forms', d:'The Sun ignites. Rocky planets including Earth begin to form.', color:0xff8800, detail:'A giant molecular cloud collapsed under gravity, forming the Sun and a protoplanetary disk.', stats:[{k:'Sun age',v:'4.6B yrs'},{k:'Planets',v:'8'}] },
  { y:'4.5 BYA', e:'🌍', t:'Theia Impact', d:'A Mars-sized planet crashes into Earth. Debris forms the Moon.', color:0x3b82f6, detail:'The impact was so violent that Earth melted entirely. The debris coalesced into the Moon within a year.', stats:[{k:'Impactor',v:'Mars-sized'},{k:'Result',v:'The Moon'}] },
  { y:'3.8 BYA', e:'🦠', t:'First Life', d:'Single-celled organisms appear in the primordial ocean.', color:0x10b981, detail:'The earliest evidence of life comes from chemical signatures in 3.8 billion-year-old rocks.', stats:[{k:'Type',v:'Prokaryotes'},{k:'Location',v:'Ocean vents'}] },
  { y:'540 MYA', e:'🐚', t:'Cambrian Explosion', d:'Complex animals appear within 20 million years.', color:0x06b6d4, detail:'Almost all major animal groups appeared in a geological blink of an eye.', stats:[{k:'Duration',v:'20 My'},{k:'New species',v:'Thousands'}] },
  { y:'252 MYA', e:'🌋', t:'The Great Dying', d:'96% of marine species and 70% of land species go extinct.', color:0xef4444, detail:'The Siberian Traps erupted for 2 million years, poisoning the atmosphere and oceans.', stats:[{k:'Species lost',v:'96%'},{k:'Duration',v:'2 My'}] },
  { y:'230 MYA', e:'🦕', t:'Age of Dinosaurs', d:'Dinosaurs rise. They will rule the planet for 165 million years.', color:0x22c55e, detail:'From tiny theropods to giant sauropods, dinosaurs dominated every ecosystem on Earth.', stats:[{k:'Reign',v:'165 My'},{k:'Largest',v:'Argentinosaurus'}] },
  { y:'66 MYA', e:'☄️', t:'Chicxulub Impact', d:'A 10km asteroid ends the dinosaurs. Mammals get their chance.', color:0xf97316, detail:'A 10 km asteroid hit near Chicxulub, Mexico, causing a global firestorm and megatsunami.', stats:[{k:'Impactor',v:'10 km'},{k:'Energy',v:'100M MT'}] },
  { y:'300 KYA', e:'🧑', t:'Homo Sapiens', d:'Anatomically modern humans emerge in East Africa.', color:0xfbbf24, detail:'Our species appeared in Africa and slowly spread across every continent over 60,000 years.', stats:[{k:'Origin',v:'East Africa'},{k:'Brain',v:'1,300 cc'}] },
  { y:'70 KYA', e:'🚶', t:'Out of Africa', d:'Small bands leave Africa. They reach India around 65,000 years ago.', color:0xf59e0b, detail:'Humans crossed the Red Sea, walked across Arabia, and reached India within a few thousand years.', stats:[{k:'Route',v:'Red Sea'},{k:'Reached India',v:'65 KYA'}] },
  { y:'3300 BCE', e:'🏛️', t:'Indus Valley', d:'Harappa and Mohenjo-daro. Grid-planned cities with plumbing.', color:0x8b5cf6, detail:'One of the world\'s earliest urban civilizations, with advanced drainage and public baths.', stats:[{k:'Cities',v:'1,000+'},{k:'Population',v:'5 million'}] },
  { y:'563 BCE', e:'🧘', t:'Birth of Buddha', d:'Siddhartha Gautama is born in Lumbini, Nepal.', color:0xfcd34d, detail:'His teachings spread across Asia and became one of the world\'s major religions.', stats:[{k:'Born',v:'563 BCE'},{k:'Followers',v:'500M+'}] },
  { y:'319 CE', e:'👑', t:'Gupta Empire', d:'India\'s Golden Age. Aryabhata invents the concept of zero.', color:0xfbbf24, detail:'Mathematics, astronomy, and art flourished. Aryabhata calculated Earth\'s circumference within 1% accuracy.', stats:[{k:'Zero invented',v:'~500 CE'},{k:'Pi computed',v:'3.1416'}] },
  { y:'1526 CE', e:'🕌', t:'Mughal Empire', d:'Babur founds the Mughal dynasty. Taj Mahal built in 1632.', color:0xf59e0b, detail:'The Mughal Empire ruled most of India for over 300 years and left behind iconic architecture.', stats:[{k:'Founded',v:'1526'},{k:'Taj Mahal',v:'1632-1653'}] },
  { y:'1947 CE', e:'🇮🇳', t:'Indian Independence', d:'15 August 1947. Nehru becomes India\'s first Prime Minister.', color:0xff9933, detail:'After 200 years of British rule, India gained independence — but Partition created Pakistan.', stats:[{k:'Date',v:'15 Aug 1947'},{k:'First PM',v:'Nehru'}] },
  { y:'1969 CE', e:'🌕', t:'Moon Landing', d:'Neil Armstrong takes one small step for mankind.', color:0x94a3b8, detail:'Apollo 11 landed on the Moon with 600 million people watching live on TV.', stats:[{k:'Crew',v:'3 astronauts'},{k:'Viewers',v:'600 million'}] },
  { y:'1975 CE', e:'🛰️', t:'Aryabhata Launched', d:'India\'s first satellite. ISRO formally begins operations.', color:0x3b82f6, detail:'Launched with Soviet help, Aryabhata weighed 360 kg and studied X-rays from space.', stats:[{k:'Weight',v:'360 kg'},{k:'Launch',v:'USSR'}] },
  { y:'2020 CE', e:'🦠', t:'COVID-19', d:'A global pandemic. 7 million deaths. Remote work becomes normal.', color:0xef4444, detail:'The pandemic reshaped how the world works, learns, and connects.', stats:[{k:'Deaths',v:'7M+'},{k:'Duration',v:'3+ yrs'}] },
  { y:'2023 CE', e:'🌕', t:'Chandrayaan-3', d:'India lands at the Moon\'s south pole — a world first.', color:0xfbbf24, detail:'India became the 4th country to soft-land on the Moon and the 1st at the south pole.', stats:[{k:'Landing',v:'23 Aug 2023'},{k:'Cost',v:'₹615 Cr'}] },
  { y:'2026 CE', e:'⚡', t:'Now', d:'You are here. AI revolution. Climate crisis. Space Race 2.0.', color:0x8b5cf6, detail:'The world is changing faster than ever. AI, climate, and space are the defining stories of our time.', stats:[{k:'Year',v:'2026'},{k:'You are',v:'Here'}] },
];

register('history-timeline',{
  title:'History Timeline — 3D',
  icon:'🦕',
  tag:'Original',
  category:'Science',
  desc:'Vertical 3D timeline. Speed modes. Tap events for details.',
  tags:['history','3d'],
  type:'native',
}, function(root){
  root.style.cssText = 'position:relative; height:100%; overflow:hidden; background:radial-gradient(ellipse at 50% 50%, #1a0a2e 0%, #0a0a1a 60%, #000 100%); padding:0;';

  root.innerHTML = `
    <div id="ht-canvas" style="position:absolute; inset:0; z-index:1"></div>

    <div id="ht-hud" style="position:absolute;top:0;left:0;right:0;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(180deg,rgba(0,0,0,.7),transparent);color:#fff;z-index:10;pointer-events:none;">
      <div>
        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;opacity:.7;font-weight:800">Timeline</div>
        <div style="font-size:22px;font-weight:900;font-variant-numeric:tabular-nums" id="ht-year">—</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;opacity:.7;font-weight:800">Event</div>
        <div style="font-size:14px;font-weight:900;max-width:150px;text-align:right" id="ht-event">Loading</div>
      </div>
    </div>

    <div id="ht-speed" style="position:absolute;bottom:18px;left:50%;transform:translateX(-50%);z-index:15;display:flex;gap:6px;padding:6px;background:rgba(15,5,30,.75);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(139,92,246,.25);border-radius:14px">
      <button data-speed="slow" class="ht-speed-btn" style="padding:8px 14px;border-radius:10px;background:transparent;border:none;color:rgba(255,255,255,.6);font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">🐢 Slow</button>
      <button data-speed="normal" class="ht-speed-btn active" style="padding:8px 14px;border-radius:10px;background:rgba(139,92,246,.25);border:none;color:#a78bfa;font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">⚡ Normal</button>
      <button data-speed="fast" class="ht-speed-btn" style="padding:8px 14px;border-radius:10px;background:transparent;border:none;color:rgba(255,255,255,.6);font-weight:800;font-size:11px;cursor:pointer;transition:all .2s;font-family:inherit">🚀 Fast</button>
    </div>

    <div style="position:absolute;top:64px;left:50%;transform:translateX(-50%);z-index:10;color:rgba(255,255,255,.45);font-size:10px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;pointer-events:none">↑ Drag to travel through time</div>
  `;

  const canvasHolder = $('#ht-canvas', root);
  const yearEl = $('#ht-year', root);
  const eventEl = $('#ht-event', root);

  let speedMode = 'normal';
  const SPEED_MULT = { slow: 0.5, normal: 1.0, fast: 2.2 };

  function setSpeed(mode){
    speedMode = mode;
    $$('.ht-speed-btn', root).forEach(b => {
      const isActive = b.dataset.speed === mode;
      b.style.background = isActive ? 'rgba(139,92,246,.25)' : 'transparent';
      b.style.color = isActive ? '#a78bfa' : 'rgba(255,255,255,.6)';
    });
    haptic(8);
  }
  $$('.ht-speed-btn', root).forEach(b => b.onclick = () => setSpeed(b.dataset.speed));

  let destroyed = false;
  let attempts = 0;

  function waitAndInit(cb){
    attempts++;
    const w = canvasHolder.clientWidth;
    const h = canvasHolder.clientHeight;
    if (w > 10 && h > 10 && window.THREE && OMT.createScene){ cb(); return; }
    if (attempts > 60){ return; }
    setTimeout(() => { if (!destroyed) waitAndInit(cb); }, 80);
  }

  waitAndInit(() => {
    if (destroyed) return;
    try { initThree(); } catch (e){ console.error(e); }
  });

  function initThree(){
    const THREE = window.THREE;
    const { scene, camera, renderer, startLoop, clickables } = OMT.createScene(canvasHolder, { bg: 0x0a0a1a });
    camera.position.set(0, 0, 14);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0x6666aa, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Star field
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++){
      starPos[i*3] = (Math.random() - 0.5) * 200;
      starPos[i*3+1] = (Math.random() - 0.5) * 400;
      starPos[i*3+2] = (Math.random() - 0.5) * 200 - 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.7 })));

    // Vertical timeline height
    const timelineHeight = 130;
    const spacing = timelineHeight / (EVENTS.length - 1);

    // Shaft line
    const shaftPoints = [
      new THREE.Vector3(0, timelineHeight / 2 + 4, 0),
      new THREE.Vector3(0, -timelineHeight / 2 - 4, 0),
    ];
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(shaftPoints),
      new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.4 })));

    const eventMeshes = [];

    EVENTS.forEach((ev, i) => {
      const yPos = timelineHeight / 2 - i * spacing;

      // Marker sphere
      const geo = new THREE.SphereGeometry(0.7, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: ev.color, emissive: ev.color, emissiveIntensity: 1.2, roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, yPos, 0);

      // Hit sphere
      const hitGeo = new THREE.SphereGeometry(2, 12, 12);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData.info = {
        title: ev.t, subtitle: ev.y, emoji: ev.e,
        brief: ev.d, detail: ev.detail, stats: ev.stats,
        category: 'Timeline Event',
      };
      mesh.add(hitMesh);
      clickables.push(hitMesh);

      // Glow ring
      const ringGeo = new THREE.RingGeometry(1.0, 1.35, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ev.color, side: THREE.DoubleSide, transparent: true, opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, yPos, 0);
      scene.add(ring);

      // Point light
      const light = new THREE.PointLight(ev.color, 1.0, 8);
      light.position.set(0, yPos, 0);
      scene.add(light);

      scene.add(mesh);
      eventMeshes.push({ mesh, ring, data: ev, yPos, index: i });
    });

    // Camera state
    let camY = timelineHeight / 2 - 2;
    let targetY = camY;
    let camX = 0;
    let targetX = 0;

    // Pointer drag
    let dragging = false, prevX = 0, prevY = 0;
    let downX = 0, downY = 0, downTime = 0, moved = false;

    renderer.domElement.addEventListener('pointerdown', e => {
      dragging = true; prevX = e.clientX; prevY = e.clientY;
      downX = e.clientX; downY = e.clientY; downTime = performance.now(); moved = false;
    });
    renderer.domElement.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) moved = true;
      const mult = SPEED_MULT[speedMode];
      targetY += dy * 0.18 * mult;
      targetX -= dx * 0.12 * mult;
      targetY = clamp(targetY, -timelineHeight / 2 - 6, timelineHeight / 2 + 6);
      targetX = clamp(targetX, -8, 8);
      prevX = e.clientX; prevY = e.clientY;
    });
    renderer.domElement.addEventListener('pointerup', e => {
      dragging = false;
      if (!moved && performance.now() - downTime < 400){
        handleClick(e);
      }
    });
    renderer.domElement.addEventListener('pointercancel', () => dragging = false);

    // Wheel
    renderer.domElement.addEventListener('wheel', e => {
      e.preventDefault();
      const mult = SPEED_MULT[speedMode];
      targetY += e.deltaY * 0.18 * mult;
      targetY = clamp(targetY, -timelineHeight / 2 - 6, timelineHeight / 2 + 6);
    }, { passive: false });

    function handleClick(e){
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
    }

    let lastNearest = -1;

    startLoop(() => {
      if (destroyed) return;
      camY += (targetY - camY) * 0.12;
      camX += (targetX - camX) * 0.12;
      camera.position.set(camX, camY, 14);
      camera.lookAt(0, camY, 0);

      // Nearest event
      let nearest = 0, minDist = Infinity;
      eventMeshes.forEach((em, i) => {
        const d = Math.abs(em.yPos - camY);
        if (d < minDist){ minDist = d; nearest = i; }
      });
      if (nearest !== lastNearest){
        lastNearest = nearest;
        const ev = eventMeshes[nearest].data;
        yearEl.textContent = ev.y;
        eventEl.textContent = ev.t;
      }

      // Pulse
      const t = performance.now() * 0.002;
      eventMeshes.forEach((em, i) => {
        const s = 1 + Math.sin(t + i * 0.5) * 0.13;
        em.mesh.scale.set(s, s, s);
        em.ring.rotation.z += 0.012;
      });
    });

    const check = setInterval(() => {
      if (!document.body.contains(root)){ destroyed = true; clearInterval(check); }
    }, 500);
  }
});

})();
