/* ============================================================
   SPACE EXPLORER — 3D (fixed: pinch zoom, click detection)
   ============================================================ */
(function(){
const { $, rand, clamp, toast, haptic, register } = OMT;
const THREE = window.THREE;

const PLANETS = [
  { id:'sun', n:'Sun', e:'☀️', color:0xffdd00, size:2, dist:0, speed:0, cat:'Star', brief:'A G-type main-sequence star at the center of our solar system.', detail:'It contains 99.86% of the mass of the solar system. Its core reaches 15 million°C.', stats:[{k:'Mass',v:'333,000× Earth'},{k:'Surface temp',v:'5,500°C'},{k:'Age',v:'4.6B years'}] },
  { id:'mercury', n:'Mercury', e:'☿', color:0xa0a0a0, size:0.35, dist:4, speed:0.6, cat:'Planet', brief:'The smallest planet and closest to the Sun.', detail:'A year on Mercury is just 88 Earth days. A day lasts 176 Earth days.', stats:[{k:'Distance from Sun',v:'0.39 AU'},{k:'Year length',v:'88 days'},{k:'Day length',v:'176 days'}] },
  { id:'venus', n:'Venus', e:'♀', color:0xffcc88, size:0.55, dist:6, speed:0.4, cat:'Planet', brief:'The hottest planet in the solar system.', detail:'Its thick CO₂ atmosphere creates a runaway greenhouse effect — 465°C on the surface.', stats:[{k:'Distance from Sun',v:'0.72 AU'},{k:'Surface temp',v:'465°C'},{k:'Year length',v:'225 days'}] },
  { id:'earth', n:'Earth', e:'🌍', color:0x3b82f6, size:0.6, dist:8.5, speed:0.3, cat:'Planet', brief:'The only known planet with life.', detail:'71% of its surface is water. Its magnetic field protects life from solar radiation.', stats:[{k:'Distance from Sun',v:'1.00 AU'},{k:'Diameter',v:'12,742 km'},{k:'Population',v:'8 billion'}] },
  { id:'mars', n:'Mars', e:'🔴', color:0xdc2626, size:0.45, dist:11, speed:0.25, cat:'Planet', brief:'The Red Planet — a cold desert world.', detail:'Mars has the tallest volcano in the solar system — Olympus Mons, 22 km high.', stats:[{k:'Distance from Sun',v:'1.52 AU'},{k:'Gravity',v:'38% of Earth'},{k:'Moons',v:'2'}] },
  { id:'jupiter', n:'Jupiter', e:'🪐', color:0xf59e0b, size:1.2, dist:16, speed:0.15, cat:'Planet', brief:'The largest planet — a gas giant.', detail:'Its Great Red Spot is a storm that has raged for over 400 years.', stats:[{k:'Distance from Sun',v:'5.2 AU'},{k:'Mass',v:'318× Earth'},{k:'Moons',v:'95+'}] },
  { id:'saturn', n:'Saturn', e:'🪐', color:0xeab308, size:1.0, dist:22, speed:0.1, cat:'Planet', brief:'Famous for its magnificent rings.', detail:'Its rings are made of ice and rock, stretching 280,000 km but only 10m thick.', stats:[{k:'Distance from Sun',v:'9.5 AU'},{k:'Ring width',v:'280,000 km'},{k:'Moons',v:'146+'}] },
  { id:'uranus', n:'Uranus', e:'🔵', color:0x22d3ee, size:0.8, dist:28, speed:0.07, cat:'Planet', brief:'An ice giant that orbits on its side.', detail:'It rotates at a 98° tilt — essentially rolling around the Sun.', stats:[{k:'Distance from Sun',v:'19.2 AU'},{k:'Tilt',v:'98°'},{k:'Year length',v:'84 years'}] },
  { id:'neptune', n:'Neptune', e:'🔵', color:0x2563eb, size:0.8, dist:34, speed:0.05, cat:'Planet', brief:'The windiest planet in the solar system.', detail:'Winds reach 2,100 km/h — faster than the speed of sound on Earth.', stats:[{k:'Distance from Sun',v:'30 AU'},{k:'Wind speed',v:'2,100 km/h'},{k:'Year length',v:'165 years'}] },
];

register('space-exploration',{
  title:'Space Explorer — 3D',
  icon:'🚀',
  tag:'Original',
  category:'Science',
  desc:'Drag to orbit. Pinch to zoom. Tap a planet for details.',
  tags:['space','3d'],
  type:'native',
}, function(root){
  root.style.cssText = 'position:relative; height:100%; overflow:hidden; background:radial-gradient(ellipse at 50% 50%, #1e1b4b 0%, #030014 60%, #000 100%);';

  root.innerHTML = `
    <div id="sp-3d-canvas" style="position:absolute; inset:0; z-index:1"></div>
    <div style="position:absolute;top:16px;left:16px;right:16px;z-index:10;color:#fff;font-size:11px;font-weight:800;letter-spacing:1px;text-transform:uppercase;opacity:.6;pointer-events:none;text-align:center">Drag orbit · Pinch zoom · Tap a planet</div>
    <div id="sp-3d-hud" style="position:absolute;bottom:16px;left:16px;right:16px;z-index:10;display:flex;justify-content:center;gap:6px;flex-wrap:wrap;">
      ${PLANETS.map(p => `
        <button data-planet="${p.id}" style="padding:7px 12px;border-radius:18px;background:rgba(255,255,255,.1);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);color:#fff;font-weight:800;font-size:11px;cursor:pointer;transition:background .2s;font-family:inherit">${p.e} ${p.n}</button>
      `).join('')}
    </div>
  `;

  const canvasHolder = $('#sp-3d-canvas', root);

  requestAnimationFrame(() => {
    const { scene, camera, renderer, clickables, startLoop } = OMT.createScene(canvasHolder, { bg: 0x030014 });

    // Star field
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(6000 * 3);
    for (let i = 0; i < 6000; i++){
      starPos[i*3] = (Math.random() - 0.5) * 500;
      starPos[i*3+1] = (Math.random() - 0.5) * 500;
      starPos[i*3+2] = (Math.random() - 0.5) * 500;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.2, transparent: true, opacity: 0.8 })));

    // Lights
    scene.add(new THREE.AmbientLight(0x334466, 0.5));
    const sunLight = new THREE.PointLight(0xffdd00, 2, 200);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Planets
    const planetMeshes = [];
    PLANETS.forEach(p => {
      const geo = new THREE.SphereGeometry(p.size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: p.color, emissive: p.color,
        emissiveIntensity: p.id === 'sun' ? 2 : 0.4,
        roughness: 0.5, metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.dist, 0, 0);
      mesh.userData.planetId = p.id;
      scene.add(mesh);

      // Invisible bigger hit sphere for easier tapping
      const hitGeo = new THREE.SphereGeometry(p.size * 2.2, 16, 16);
      const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.userData.info = {
        title: p.n, subtitle: p.cat, emoji: p.e,
        brief: p.brief, detail: p.detail, stats: p.stats,
        category: p.cat + ' · ' + (p.dist ? p.dist + ' AU' : 'Center'),
      };
      mesh.add(hitMesh);
      clickables.push(hitMesh);

      // Saturn rings
      if (p.id === 'saturn'){
        const ringGeo = new THREE.RingGeometry(p.size * 1.4, p.size * 2.2, 64);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xc8b06a, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.1;
        mesh.add(ring);
      }

      // Orbit line
      const orbitGeo = new THREE.RingGeometry(p.dist - 0.02, p.dist + 0.02, 128);
      const orbitMat = new THREE.MeshBasicMaterial({ color: 0x334466, side: THREE.DoubleSide, transparent: true, opacity: 0.25 });
      const orbit = new THREE.Mesh(orbitGeo, orbitMat);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);

      planetMeshes.push({ mesh, data: p, angle: Math.random() * Math.PI * 2 });
    });

    // Camera state — orbit + zoom
    let theta = 0.5;      // horizontal angle
    let phi = 1.0;        // vertical angle (0.1 to Math.PI - 0.1)
    let radius = 60;      // distance
    let targetTheta = theta, targetPhi = phi, targetRadius = radius;

    // Pointer drag → orbit
    let dragging = false;
    let prevX = 0, prevY = 0;
    let downX = 0, downY = 0, downTime = 0;
    let moved = false;

    renderer.domElement.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' && e.isPrimary === false) return;
      dragging = true; prevX = e.clientX; prevY = e.clientY;
      downX = e.clientX; downY = e.clientY; downTime = performance.now();
      moved = false;
    });
    renderer.domElement.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      if (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5) moved = true;
      targetTheta -= dx * 0.008;
      targetPhi -= dy * 0.008;
      targetPhi = clamp(targetPhi, 0.15, Math.PI - 0.15);
      prevX = e.clientX; prevY = e.clientY;
    });
    renderer.domElement.addEventListener('pointerup', e => {
      dragging = false;
      // Treat as click if didn't move much
      if (!moved && performance.now() - downTime < 400){
        handleClick(e);
      }
    });
    renderer.domElement.addEventListener('pointercancel', () => dragging = false);

    // Wheel zoom (desktop)
    renderer.domElement.addEventListener('wheel', e => {
      e.preventDefault();
      targetRadius += e.deltaY * 0.05;
      targetRadius = clamp(targetRadius, 12, 150);
    }, { passive: false });

    // Pinch zoom (mobile)
    let pinchStartDist = 0;
    let pinchStartRadius = 0;
    renderer.domElement.addEventListener('touchstart', e => {
      if (e.touches.length === 2){
        pinchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        pinchStartRadius = targetRadius;
        dragging = false;
      }
    }, { passive: true });
    renderer.domElement.addEventListener('touchmove', e => {
      if (e.touches.length === 2 && pinchStartDist > 0){
        const d = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = pinchStartDist / d;
        targetRadius = clamp(pinchStartRadius * scale, 12, 150);
        e.preventDefault();
      }
    }, { passive: false });
    renderer.domElement.addEventListener('touchend', e => {
      if (e.touches.length < 2) pinchStartDist = 0;
    });

    // Click detection
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
          OMT.showInfoCard(data, e.clientX - 150, e.clientY - 150);
        }
      }
    }

    // HUD quick buttons
    $('#sp-3d-hud', root).addEventListener('click', e => {
      const btn = e.target.closest('[data-planet]');
      if (!btn) return;
      const p = PLANETS.find(x => x.id === btn.dataset.planet);
      if (p){
        // Zoom to planet
        const target = planetMeshes.find(pm => pm.data.id === p.id);
        if (target){
          targetRadius = clamp(p.size * 8, 10, 40);
        }
        OMT.showInfoCard({
          title: p.n, subtitle: p.cat, emoji: p.e,
          brief: p.brief, detail: p.detail, stats: p.stats,
          category: p.cat,
        }, window.innerWidth / 2 - 150, window.innerHeight / 2 - 200);
      }
    });

    // Animation
    startLoop((progress) => {
      theta += (targetTheta - theta) * 0.1;
      phi += (targetPhi - phi) * 0.1;
      radius += (targetRadius - radius) * 0.12;

      camera.position.x = Math.sin(theta) * Math.sin(phi) * radius;
      camera.position.y = Math.cos(phi) * radius;
      camera.position.z = Math.cos(theta) * Math.sin(phi) * radius;
      camera.lookAt(0, 0, 0);

      const t = performance.now() * 0.001;
      planetMeshes.forEach(({ mesh, data, angle }) => {
        if (data.id === 'sun'){ mesh.rotation.y += 0.002; return; }
        const a = angle + t * data.speed * 0.3;
        mesh.position.x = Math.cos(a) * data.dist;
        mesh.position.z = Math.sin(a) * data.dist;
        mesh.rotation.y += 0.01;
      });
    });
  });
});

})();
