/* ============================================================
   DEEP INDIA v2 — Startup Product Edition
   Overrides R['deep-india'] from games-a.js
   ============================================================ */

R['deep-india'] = root => {
  // -------- DATA: 65 real entries with proper zoning --------
  const ENTRIES = [
    // ☀️ SUNLIGHT ZONE (0-200m)
    {d:0,   e:'🌊', n:'Surface',            t:'Indian Ocean — Bay of Bengal, Arabian Sea, Andaman Sea', type:'intro'},
    {d:5,   e:'🏊', n:'Swimming Depth',     t:'Aam taur par log yahaan tak comfortably swim karte hain'},
    {d:10,  e:'🪸', n:'Coral Reefs',        t:'Lakshadweep, Gulf of Mannar, Andaman — India ke 3 major reef systems'},
    {d:20,  e:'🐠', n:'Reef Fish',          t:'Clownfish, parrotfish, angelfish — colours ki duniya'},
    {d:30,  e:'🤿', n:'Scuba Diving Range', t:'Recreational divers ka comfort zone — 30m tak'},
    {d:40,  e:'🐙', n:'Octopus',            t:'8 arms, 3 hearts, blue blood — aur bahut intelligent'},
    {d:50,  e:'🐬', n:'Dolphins',           t:'Spinner, bottlenose, humpback — Indian Ocean mein common'},
    {d:60,  e:'🦈', n:'Reef Sharks',        t:'Blacktip aur whitetip reef sharks — mostly harmless'},
    {d:75,  e:'🐢', n:'Sea Turtles',        t:'Olive Ridley, Green, Hawksbill — Odisha coast famous'},
    {d:100, e:'🦑', n:'Squid',              t:'Fast predators — colour change kar sakte hain'},
    {d:120, e:'🐟', n:'Tuna',               t:'Yellowfin, skipjack — 70 km/h tak swim'},
    {d:150, e:'🦈', n:'Hammerhead Sharks',  t:'Schools mein — schools ke saath hunt karte hain'},
    {d:180, e:'🌡️', n:'Thermocline Begins', t:'Temperature yahaan se tezi se girti hai'},

    // 🌑 TWILIGHT ZONE (200-1000m)
    {d:200, e:'🌑', n:'Twilight Zone',      t:'Sirf 1% sunlight yahaan tak pahunchti hai', type:'zone'},
    {d:250, e:'🔦', n:'Bioluminescence',    t:'Yahaan se creatures apni roshni banate hain', type:'glow'},
    {d:300, e:'🧛', n:'Vampire Squid',      t:'Naam misleading — actually peaceful scavenger hai'},
    {d:332, e:'🏅', n:'Deepest Scuba Dive', t:'Ahmed Gabr, 2014 — Red Sea. Record abhi bhi zinda', type:'record'},
    {d:400, e:'🦑', n:'Giant Squid Range',  t:'10m+ — lekin insaan ne shayad hi dekha hai'},
    {d:500, e:'🐋', n:'Blue Whale Zone',    t:'Earth ka sabse bada animal — 30m, 200 ton'},
    {d:600, e:'🐟', n:'Lanternfish',        t:'Earth ke sabse abundant vertebrates — billions'},
    {d:700, e:'👁️', n:'Hatchetfish',        t:'Tubular eyes — upar dekhte hain sirf'},
    {d:800, e:'🦐', n:'Krill Swarms',       t:'Food chain ka base — whales yahaan aate hain'},
    {d:900, e:'🐙', n:'Dumbo Octopus',      t:'Sabse deep octopus — ears jaise fins'},

    // 🌌 MIDNIGHT ZONE (1000-4000m)
    {d:1000, e:'🌌', n:'Midnight Zone',     t:'Poora andhera — 0% sunlight, forever', type:'zone'},
    {d:1200, e:'😈', n:'Anglerfish',        t:'Glowing lure se prey attract karta hai', type:'glow'},
    {d:1500, e:'🦑', n:'Colossal Squid',    t:'500 kg tak — Antarctic waters mein'},
    {d:1800, e:'🐋', n:'Sperm Whale Hunt',  t:'90 minute ek saans mein — deepest diving mammal'},
    {d:2000, e:'🌡️', n:'Pressure: 200 atm', t:'Surface se 200 guna zyada pressure', type:'fact'},
    {d:2500, e:'🦐', n:'Amphipods',         t:'Scavengers — whale carcass par poori colony rehti hai'},
    {d:3000, e:'🐟', n:'Gulper Eel',        t:'Enormous mouth — balloon jaisa phool jaata hai'},
    {d:3300, e:'❄️', n:'Brine Pools',       t:'Underwater lakes — 5x zyada salty, alag ecosystem'},
    {d:3500, e:'🕳️', n:'Deep Sea Vents',    t:'Superheated water — 400°C tak'},
    {d:3800, e:'🚢', n:'Titanic Depth',     t:'RMS Titanic 3,800m par mila — Atlantic mein', type:'shipwreck'},
    {d:3900, e:'🗺️', n:'Java Trench',       t:'Indian Ocean ka deepest region yahaan se shuru', type:'geo'},

    // 🕳️ ABYSSAL ZONE (4000-6000m)
    {d:4000, e:'🦑', n:'Abyssal Zone',      t:'Pressure 400 atmospheres — 4 tonne per cm²', type:'zone'},
    {d:4200, e:'🐙', n:'Abyssal Octopus',   t:'Rare, translucent, almost ghostly'},
    {d:4500, e:'🐖', n:'Sea Pigs',          t:'Deep-sea cucumbers — seafloor saaf karte hain'},
    {d:4800, e:'💀', n:'Whale Falls',       t:'Ek dead whale = 50 saal ka ecosystem', type:'fact'},
    {d:5000, e:'🌋', n:'Hydrothermal Vents',t:'Black smokers — Earth ka oldest life yahaan', type:'geo'},
    {d:5300, e:'🦀', n:'Yeti Crabs',        t:'Furry claws — bacteria se khate hain'},
    {d:5500, e:'🐛', n:'Tube Worms',        t:'2m lamba — no mouth, no gut, symbiotic bacteria'},
    {d:5800, e:'🌊', n:'Java Trench Floor', t:'7,290m — Indian Ocean ka sabse gehra', type:'geo'},

    // 🏔️ HADAL ZONE (6000-11000m)
    {d:6000, e:'🏔️', n:'Hadal Zone Begins', t:'Trenches — Earth ke sabse gehra gaddhe', type:'zone'},
    {d:6500, e:'🐟', n:'Snailfish',         t:'Sabse deep fish — 8,000m+ par bhi zinda'},
    {d:7000, e:'🦐', n:'Supergiant Amphipods', t:'Regular shrimp se 10x bade'},
    {d:7290, e:'🏆', n:'Sunda Trench',      t:'Indian Ocean ka deepest point', type:'geo'},
    {d:7500, e:'🦑', n:'Hadal Squid',       t:'Sirf 2 baar dekha gaya — sabse mysterious'},
    {d:8000, e:'🐟', n:'Pseudoliparis',     t:'Record: 8,336m — deepest fish ever filmed'},
    {d:8500, e:'🌍', n:'Tectonic Plates',   t:'Do plates yahaan collide karte hain — earthquakes ka source'},
    {d:9000, e:'🌊', n:'Challenger Deep Approach', t:'Duniya ka deepest point — Pacific mein'},
    {d:10000,e:'🚀', n:'Full Darkness',     t:'Insaan ne yahaan 1960 mein pehli baar kadam rakha'},
    {d:10994,e:'🏆', n:'Mariana Trench Floor', t:'10,994m — Earth ka sabse gehra point', type:'milestone'},
  ];

  const ZONES = [
    {name:'Sunlight Zone',  range:'0–200m',    color:'#7dd3fc'},
    {name:'Twilight Zone',  range:'200–1,000m', color:'#3b82f6'},
    {name:'Midnight Zone',  range:'1,000–4,000m', color:'#6366f1'},
    {name:'Abyssal Zone',   range:'4,000–6,000m', color:'#8b5cf6'},
    {name:'Hadal Zone',     range:'6,000–11,000m', color:'#ec4899'},
  ];

  // -------- RENDER --------
  root.innerHTML = `
    <div id="jr" style="position:relative;height:100%;overflow-y:auto;overscroll-behavior:contain;
      background:linear-gradient(180deg,#7dd3fc 0%,#0ea5e9 8%,#0369a1 18%,#1e3a8a 32%,#0c1445 50%,#020617 70%,#000 100%);
      background-size:100% 100%;color:#fff">
      
      <div id="hud" style="position:sticky;top:0;z-index:20;padding:14px 18px;
        background:linear-gradient(180deg,rgba(0,0,0,.6) 0%,transparent 100%);
        backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
        display:flex;justify-content:space-between;align-items:flex-start;
        font-family:-apple-system,BlinkMacSystemFont,sans-serif">
        <div>
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;opacity:.6">Depth</div>
          <div style="font-size:26px;font-weight:900;letter-spacing:-1px;font-variant-numeric:tabular-nums;line-height:1.1"
            id="hud-depth">0<span style="font-size:14px;font-weight:700;opacity:.7">m</span></div>
        </div>
        <div style="text-align:center">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;opacity:.6">Zone</div>
          <div style="font-size:12px;font-weight:900;margin-top:3px;letter-spacing:-.2px" id="hud-zone">Sunlight</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;opacity:.6">Pressure</div>
          <div style="font-size:14px;font-weight:900;font-variant-numeric:tabular-nums;line-height:1.1"
            id="hud-pressure">1<span style="font-size:10px;font-weight:700;opacity:.7"> atm</span></div>
          <div style="font-size:11px;font-weight:800;font-variant-numeric:tabular-nums;margin-top:2px;opacity:.8"
            id="hud-temp">28<span style="font-size:9px">°C</span></div>
        </div>
      </div>

      <div id="ct"></div>

      <div style="padding:60px 24px 100px;text-align:center;position:relative">
        <div style="font-size:64px;margin-bottom:12px">🏆</div>
        <div style="font-size:22px;font-weight:900;letter-spacing:-.5px;margin-bottom:6px">Journey Complete</div>
        <div style="font-size:13px;opacity:.7;line-height:1.6;max-width:280px;margin:0 auto">
          Tumne 10,994 metres ki journey poori ki — Earth ke sabse gehre point tak.
        </div>
        <div style="display:flex;gap:20px;justify-content:center;margin-top:24px">
          <div>
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;opacity:.6">Depth</div>
            <div style="font-size:18px;font-weight:900;margin-top:4px">10,994<span style="font-size:11px">m</span></div>
          </div>
          <div>
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;opacity:.6">Pressure</div>
            <div style="font-size:18px;font-weight:900;margin-top:4px">1,100<span style="font-size:11px">atm</span></div>
          </div>
          <div>
            <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.2px;opacity:.6">Zones</div>
            <div style="font-size:18px;font-weight:900;margin-top:4px">5</div>
          </div>
        </div>
      </div>
    </div>`;

  // -------- BUILD ENTRIES --------
  const ct = $('#ct', root);
  ct.innerHTML = ENTRIES.map((it, i) => {
    // Milestone / special styles
    if (it.type === 'zone') {
      return `<div class="zone-divider" data-d="${it.d}" style="
        padding:50px 24px 30px;text-align:center;position:relative">
        <div style="display:inline-block;padding:8px 18px;border-radius:999px;
          background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);
          backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)">
          <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.6">Entering</div>
          <div style="font-size:15px;font-weight:900;letter-spacing:-.2px;margin-top:2px">${it.n}</div>
        </div>
        <div style="font-size:12px;opacity:.6;margin-top:12px;max-width:240px;margin-left:auto;margin-right:auto;line-height:1.5">
          ${it.t}
        </div>
      </div>`;
    }

    if (it.type === 'milestone') {
      return `<div class="entry" data-d="${it.d}" style="
        padding:60px 24px;text-align:center">
        <div style="font-size:72px;margin-bottom:16px;filter:drop-shadow(0 8px 24px rgba(236,72,153,.5))">${it.e}</div>
        <div style="font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;opacity:.5;margin-bottom:8px">The Deepest Point</div>
        <div style="font-size:24px;font-weight:900;letter-spacing:-.6px;margin-bottom:10px">${it.n}</div>
        <div style="font-size:13px;opacity:.8;line-height:1.6;max-width:280px;margin:0 auto">${it.t}</div>
        <div style="display:inline-block;margin-top:20px;padding:6px 14px;border-radius:999px;
          background:linear-gradient(135deg,#ec4899,#8b5cf6);font-size:11px;font-weight:900;letter-spacing:1px">
          ${it.d.toLocaleString()} METRES
        </div>
      </div>`;
    }

    // Regular + special type styling
    const styles = {
      glow:      {bg:'rgba(59,130,246,.08)',   border:'rgba(59,130,246,.3)',   icon:''},
      record:    {bg:'rgba(16,185,129,.08)',   border:'rgba(16,185,129,.3)',   icon:'🏅 '},
      shipwreck: {bg:'rgba(245,158,11,.08)',   border:'rgba(245,158,11,.3)',   icon:''},
      geo:       {bg:'rgba(139,92,246,.08)',   border:'rgba(139,92,246,.3)',   icon:''},
      fact:      {bg:'rgba(236,72,153,.08)',   border:'rgba(236,72,153,.3)',   icon:''},
      intro:     {bg:'rgba(255,255,255,.05)',  border:'rgba(255,255,255,.1)',  icon:''},
    };
    const s = styles[it.type] || {bg:'rgba(255,255,255,.03)', border:'rgba(255,255,255,.06)', icon:''};

    return `<div class="entry" data-d="${it.d}" style="
      margin:0 16px 10px;padding:16px 18px;border-radius:18px;
      background:${s.bg};border:1px solid ${s.border};
      backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)">
      <div style="display:flex;align-items:flex-start;gap:14px">
        <div style="font-size:32px;flex-shrink:0;line-height:1;margin-top:2px">${it.e}</div>
        <div style="flex:1;min-width:0">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px">
            <div style="font-size:9px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;
              opacity:.55;font-variant-numeric:tabular-nums">${it.d.toLocaleString()}m</div>
            ${it.type==='record'?'<div style="font-size:9px;font-weight:800;letter-spacing:1px;padding:2px 7px;border-radius:6px;background:rgba(16,185,129,.25);color:#6ee7b7">RECORD</div>':''}
            ${it.type==='shipwreck'?'<div style="font-size:9px;font-weight:800;letter-spacing:1px;padding:2px 7px;border-radius:6px;background:rgba(245,158,11,.25);color:#fcd34d">SHIPWRECK</div>':''}
            ${it.type==='glow'?'<div style="font-size:9px;font-weight:800;letter-spacing:1px;padding:2px 7px;border-radius:6px;background:rgba(59,130,246,.25);color:#93c5fd">GLOWS</div>':''}
            ${it.type==='geo'?'<div style="font-size:9px;font-weight:800;letter-spacing:1px;padding:2px 7px;border-radius:6px;background:rgba(139,92,246,.25);color:#c4b5fd">GEOLOGY</div>':''}
            ${it.type==='fact'?'<div style="font-size:9px;font-weight:800;letter-spacing:1px;padding:2px 7px;border-radius:6px;background:rgba(236,72,153,.25);color:#f9a8d4">FACT</div>':''}
          </div>
          <div style="font-size:15px;font-weight:900;letter-spacing:-.3px;line-height:1.25;margin-bottom:4px">${it.n}</div>
          <div style="font-size:12.5px;opacity:.72;line-height:1.5">${it.t}</div>
        </div>
      </div>
    </div>`;
  }).join('');

  // -------- SCROLL: Update HUD --------
  const jr = $('#jr', root);
  const hudD = $('#hud-depth', root);
  const hudZ = $('#hud-zone', root);
  const hudP = $('#hud-pressure', root);
  const hudT = $('#hud-temp', root);

  let ticking = false;
  jr.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const entries = $$('.entry, .zone-divider', root);
      const midY = jr.scrollTop + 140; // HUD height offset
      let currentDepth = 0;
      for (const el of entries) {
        if (el.offsetTop <= midY) currentDepth = +el.dataset.d;
        else break;
      }
      hudD.innerHTML = currentDepth.toLocaleString() + '<span style="font-size:14px;font-weight:700;opacity:.7">m</span>';
      // Zone name
      let zone = 'Sunlight';
      if (currentDepth > 200) zone = 'Twilight';
      if (currentDepth > 1000) zone = 'Midnight';
      if (currentDepth > 4000) zone = 'Abyssal';
      if (currentDepth > 6000) zone = 'Hadal';
      hudZ.textContent = zone;
      // Pressure: 1 atm + 1 per 10m
      const pressure = Math.round(1 + currentDepth / 10);
      hudP.innerHTML = pressure.toLocaleString() + '<span style="font-size:10px;font-weight:700;opacity:.7"> atm</span>';
      // Temperature (rough model)
      let temp;
      if (currentDepth < 200) temp = Math.round(28 - currentDepth * 0.02);
      else if (currentDepth < 1000) temp = Math.round(24 - (currentDepth - 200) * 0.02);
      else temp = Math.max(1, Math.round(8 - Math.log10(currentDepth) * 2));
      hudT.innerHTML = temp + '<span style="font-size:9px">°C</span>';
      ticking = false;
    });
  });
};
