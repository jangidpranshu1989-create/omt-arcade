/* ============================================================
   THREE.JS SETUP — Shared 3D Engine for Scroll Experiences
   ============================================================ */
(function(){
const { toast, haptic } = OMT;

const THREE = window.THREE;
if (!THREE){
  console.error('Three.js not loaded. Add the CDN script before three-setup.js');
  return;
}

/* ---------- Create a 3D scene bound to a container ---------- */
function createScene(container, opts = {}){
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.002);
  scene.background = new THREE.Color(opts.bg || 0x000000);

  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 2000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const clickables = [];

  let scrollProgress = 0;
  let targetScroll = 0;

  /* ---------- Update camera Y based on scroll ---------- */
  function setScroll(v){
    targetScroll = Math.max(0, Math.min(1, v));
  }

  /* ---------- Pointer → NDC ---------- */
  function updatePointer(clientX, clientY){
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  }

  /* ---------- Click detection via Raycaster ---------- */
  function onClick(e){
    updatePointer(e.clientX, e.clientY);
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(clickables, true);
    if (hits.length > 0){
      const obj = hits[0].object;
      const data = obj.userData && obj.userData.info;
      if (data){
        haptic(15);
        showInfoCard(data, e.clientX, e.clientY);
      }
    }
  }

  renderer.domElement.addEventListener('click', onClick);

  /* ---------- Resize ---------- */
  function onResize(){
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  /* ---------- Animation loop ---------- */
  let animId;
  function startLoop(updateFn){
    function loop(){
      animId = requestAnimationFrame(loop);
      scrollProgress += (targetScroll - scrollProgress) * 0.08;
      if (updateFn) updateFn(scrollProgress, scene, camera);
      renderer.render(scene, camera);
    }
    loop();
  }
  function stopLoop(){
    cancelAnimationFrame(animId);
  }

  return { scene, camera, renderer, raycaster, pointer, clickables, setScroll, startLoop, stopLoop };
}

/* ---------- Info Card UI ---------- */
function showInfoCard(data, x, y){
  const existing = document.getElementById('omt-info-card');
  if (existing) existing.remove();

  const card = document.createElement('div');
  card.id = 'omt-info-card';
  card.style.cssText = `
    position:fixed;
    left:${Math.min(x, window.innerWidth - 320)}px;
    top:${Math.min(y, window.innerHeight - 300)}px;
    width:300px; max-width:90vw;
    background:rgba(15,23,42,.95);
    backdrop-filter:blur(20px);
    border:1px solid rgba(148,163,184,.3);
    border-radius:20px;
    padding:20px;
    color:#f1f5f9;
    z-index:500;
    box-shadow:0 24px 48px rgba(0,0,0,.5);
    animation:cardIn .3s cubic-bezier(.34,1.56,.64,1);
    font-family:inherit;
  `;
  card.innerHTML = `
    <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;opacity:.6;font-weight:800;margin-bottom:8px">${data.category || 'Info'}</div>
    <div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">
      <div style="font-size:40px">${data.emoji || '🔵'}</div>
      <div>
        <div style="font-weight:900;font-size:17px;letter-spacing:-.3px">${data.title}</div>
        <div style="font-size:12px;opacity:.65;margin-top:2px">${data.subtitle || ''}</div>
      </div>
    </div>
    <p style="font-size:13.5px;line-height:1.6;opacity:.85;margin-bottom:14px">${data.brief}</p>
    ${data.detail ? `<div style="background:rgba(255,255,255,.06);border-radius:12px;padding:14px;font-size:12.5px;line-height:1.6;opacity:.8;margin-bottom:12px">${data.detail}</div>` : ''}
    ${data.stats ? data.stats.map(s => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(148,163,184,.15);font-size:12.5px">
        <span style="opacity:.6">${s.k}</span><span style="font-weight:800">${s.v}</span>
      </div>`).join('') : ''}
    <button id="omt-info-close" style="margin-top:14px;width:100%;padding:10px;border-radius:12px;background:rgba(255,255,255,.1);color:#f1f5f9;font-weight:800;font-size:13px;border:none;cursor:pointer">Close</button>
  `;
  document.body.appendChild(card);

  card.querySelector('#omt-info-close').onclick = () => card.remove();
  setTimeout(() => {
    const outside = (ev) => {
      if (!card.contains(ev.target)) { card.remove(); document.removeEventListener('click', outside); }
    };
    setTimeout(() => document.addEventListener('click', outside), 100);
  }, 100);
}

/* ---------- Expose globally ---------- */
OMT.createScene = createScene;
OMT.showInfoCard = showInfoCard;

})();
