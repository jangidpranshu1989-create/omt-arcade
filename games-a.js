/* ============ DESI + SCIENCE GAMES — Part A ============ */

R['spend-crorepati']=root=>{
  const BILL=[
    {name:'Gautam Adani',wealth:9.23e12,emoji:'🏭'},
    {name:'Mukesh Ambani',wealth:8.63e12,emoji:'🛢️'},
    {name:'Lakshmi Mittal',wealth:3.2e12,emoji:'⚙️'},
  ];
  const ITEMS=[
    {cat:'Street Food',e:'🥟',n:'Vada Pav',p:20},{cat:'Street Food',e:'☕',n:'Chai',p:15},
    {cat:'Street Food',e:'🥟',n:'Samosa',p:15},{cat:'Street Food',e:'🍛',n:'Pav Bhaji',p:80},
    {cat:'Street Food',e:'🍲',n:'Chole Bhature',p:100},{cat:'Street Food',e:'🍜',n:'Pani Puri',p:40},
    {cat:'Street Food',e:'🥘',n:'Dosa',p:120},{cat:'Street Food',e:'🍲',n:'Biryani',p:250},
    {cat:'Cars',e:'🚗',n:'Tata Nano',p:250000},{cat:'Cars',e:'🚙',n:'Maruti Alto',p:400000},
    {cat:'Cars',e:'🚙',n:'Mahindra Thar',p:1600000},{cat:'Cars',e:'🚙',n:'Tata Safari',p:2200000},
    {cat:'Cars',e:'🚘',n:'Toyota Fortuner',p:4500000},{cat:'Cars',e:'🚘',n:'BMW 5 Series',p:7500000},
    {cat:'Luxury',e:'🏎️',n:'Ferrari SF90',p:75600000},{cat:'Luxury',e:'🏎️',n:'Lamborghini Revuelto',p:88900000},
    {cat:'Luxury',e:'🚗',n:'Rolls-Royce Phantom',p:128700000},{cat:'Luxury',e:'⚡',n:'Bugatti Chiron',p:350000000},
    {cat:'Luxury',e:'👕',n:'Gold Shirt',p:13000000},{cat:'Luxury',e:'⌚',n:'Rolex Daytona',p:3500000},
    {cat:'Luxury',e:'💎',n:'100-carat Diamond',p:600000000},{cat:'Luxury',e:'🛥️',n:'Superyacht',p:3000000000},
    {cat:'Bikes',e:'🏍️',n:'Hero Splendor',p:75000},{cat:'Bikes',e:'🏍️',n:'Royal Enfield 350',p:200000},
    {cat:'Bikes',e:'🏍️',n:'TVS Apache RR 310',p:275000},{cat:'Bikes',e:'🏍️',n:'Ducati Panigale',p:2500000},
    {cat:'Properties',e:'🏠',n:'Mannat (SRK)',p:3500000000},{cat:'Properties',e:'🏢',n:'Lincoln House',p:7500000000},
    {cat:'Properties',e:'🏛️',n:'JK House',p:55000000000},{cat:'Properties',e:'🏰',n:'Antilia',p:15000000000000},
    {cat:'Experiences',e:'✈️',n:'Private Jet',p:6000000000},{cat:'Experiences',e:'🏏',n:'IPL Team',p:70000000000},
    {cat:'Experiences',e:'🎬',n:'Bollywood Movie',p:2000000000},{cat:'Experiences',e:'🚀',n:'Space Trip',p:500000000},
    {cat:'Experiences',e:'🏝️',n:'Private Island',p:4500000000},{cat:'Experiences',e:'🎪',n:'Ambani Wedding',p:50000000000},
  ];
  let current=BILL[0],budget=current.wealth,cart={},activeCat='All';
  root.innerHTML=`<div class="game-ui">
    <div class="budget-card">
      <div class="budget-label" id="bname">${current.emoji} ${current.name}</div>
      <div class="budget-value" id="bval">${fmtINR(budget)}</div>
      <div class="budget-bar"><div class="budget-fill" id="bfill" style="width:100%"></div></div>
    </div>
    <div style="margin-bottom:12px"><select id="bswitch" class="input" style="font-size:12px">
      ${BILL.map((b,i)=>`<option value="${i}">${b.emoji} ${b.name} — ${fmtINR(b.wealth)}</option>`).join('')}
    </select></div>
    <div class="cats" id="cats"></div>
    <div class="items-grid" id="items"></div>
    <div class="btn-row"><button class="btn secondary" id="sreset">Reset</button>
      <button class="btn" id="sreceipt">Receipt 🧾</button></div>
  </div>`;
  const cats=['All',...new Set(ITEMS.map(i=>i.cat))];
  $('#cats',root).innerHTML=cats.map(c=>`<button class="chip${c===activeCat?' active':''}" data-c="${c}">${c}</button>`).join('');
  function renderItems(){
    const list=activeCat==='All'?ITEMS:ITEMS.filter(i=>i.cat===activeCat);
    $('#items',root).innerHTML=list.map(it=>{
      const idx=ITEMS.indexOf(it),qty=cart[idx]||0,can=budget>=it.p;
      return`<div class="item-card">${qty?`<div class="item-qty">${qty}</div>`:''}
        <div class="item-emoji">${it.e}</div><div class="item-name">${it.n}</div>
        <div class="item-price">${fmtINR(it.p)}</div>
        <button class="item-btn" data-i="${idx}" ${can?'':'disabled'}>${can?'Buy':'Too costly'}</button></div>`;
    }).join('');
  }
  function upd(){$('#bval',root).textContent=fmtINR(budget);
    $('#bfill',root).style.width=Math.max(0,(budget/current.wealth)*100)+'%';}
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-c]');
    if(b){activeCat=b.dataset.c;renderItems();
      $$('#cats .chip',root).forEach(c=>c.classList.toggle('active',c.dataset.c===activeCat));return;}
    const buy=e.target.closest('.item-btn');
    if(buy&&!buy.disabled){const i=+buy.dataset.i,it=ITEMS[i];
      if(budget>=it.p){budget-=it.p;cart[i]=(cart[i]||0)+1;upd();renderItems();}}
  });
  $('#bswitch',root).onchange=e=>{current=BILL[+e.target.value];budget=current.wealth;cart={};
    $('#bname',root).textContent=`${current.emoji} ${current.name}`;upd();renderItems();};
  $('#sreset',root).onclick=()=>{budget=current.wealth;cart={};upd();renderItems();toast('Reset ho gaya');};
  $('#sreceipt',root).onclick=()=>{
    const lines=Object.entries(cart).map(([i,q])=>{const it=ITEMS[i];return`${it.e} ${it.n} x${q} — ${fmtINR(it.p*q)}`;});
    if(!lines.length){toast('Kuch kharida hi nahi 😅');return;}
    const spent=current.wealth-budget;
    const txt=`🧾 ${current.name} Receipt\n${lines.join('\n')}\n\nTotal Spent: ${fmtINR(spent)}\nLeft: ${fmtINR(budget)}`;
    if(navigator.clipboard)navigator.clipboard.writeText(txt);
    toast('Receipt copied! 📋');
  };
  renderItems();upd();
};

R['password-chaos']=root=>{
  const RULES=[
    {t:'Kam se kam 5 characters',f:p=>p.length>=5},
    {t:'Ek number (0-9)',f:p=>/\d/.test(p)},
    {t:'Ek uppercase letter',f:p=>/[A-Z]/.test(p)},
    {t:'Ek special character',f:p=>/[!@#$%^&*]/.test(p)},
    {t:'Digits ka sum = 25',f:p=>{const d=[...p].filter(c=>/\d/.test(c)).map(Number);return d.length&&d.reduce((a,b)=>a+b,0)===25;}},
    {t:'Hindi word — chai/pyaar/dosti',f:p=>/chai|pyaar|dosti|khushi|zindagi/i.test(p)},
    {t:'Ek emoji 😊',f:p=>/\p{Emoji}/u.test(p)},
    {t:'India flag 🇮🇳',f:p=>p.includes('🇮🇳')},
    {t:'Rupee symbol ₹',f:p=>p.includes('₹')},
    {t:'Cricket score — 184/6',f:p=>/\d{2,3}\/\d/.test(p)},
    {t:'UPI ID — name@upi',f:p=>/\w+@(upi|paytm|ybl)/i.test(p)},
    {t:'Indian state ka naam',f:p=>/(punjab|gujarat|kerala|karnataka|maharashtra|bihar|goa|assam|rajasthan)/i.test(p)},
    {t:'Bollywood movie',f:p=>/(sholay|ddlj|lagaan|dangal|bahubali|rrr|queen|pk)/i.test(p)},
    {t:'Indian festival',f:p=>/(diwali|holi|eid|rakhi|navratri|pongal|onam|baisakhi)/i.test(p)},
    {t:'ISRO mission',f:p=>/(chandrayaan|mangalyaan|gaganyaan|aditya)/i.test(p)},
    {t:'Indian food item',f:p=>/(biryani|dosa|idli|paneer|samosa|chaat|kebab|tandoori)/i.test(p)},
    {t:'Indian river',f:p=>/(ganga|yamuna|brahmaputra|godavari|kaveri|narmada)/i.test(p)},
    {t:'Freedom fighter',f:p=>/(gandhi|nehru|bhagat|subhash|bose|tilak|patel)/i.test(p)},
    {t:'Indian scientist',f:p=>/(raman|bhabha|kalpana|kalam|sarabhai)/i.test(p)},
    {t:'IPL team — MI/CSK/RCB',f:p=>/\b(mi|csk|rcb|kkr|srh|dc|rr|pbks|gt|lsg)\b/i.test(p)},
    {t:'Indian sweet',f:p=>/(gulab|jalebi|rasgulla|laddu|barfi|kaju)/i.test(p)},
    {t:'Indian monument',f:p=>/(taj|qutub|red fort|india gate|gateway|hawa mahal)/i.test(p)},
    {t:'Indian author',f:p=>/(tagore|premchand|ruskin|arundhati|chetan|amish)/i.test(p)},
    {t:'Hinglish slang — jugaad',f:p=>/(jugaad|bindaas|jhakaas|ekdum)/i.test(p)},
    {t:'5-digit train number',f:p=>/\b\d{5}\b/.test(p)},
    {t:'6-digit PIN code',f:p=>/\b\d{6}\b/.test(p)},
    {t:'Indian raga',f:p=>/(bhairavi|yaman|bhopali|kafi|todi|darbari)/i.test(p)},
    {t:'Indian sport',f:p=>/(cricket|kabaddi|kho kho|hockey|badminton)/i.test(p)},
    {t:'Dialogue — "Kitne aadmi the"',f:p=>/kitne aadmi the/i.test(p)},
    {t:'Taj Mahal reference',f:p=>/taj/i.test(p)},
    {t:'Digits product > 100',f:p=>{const d=[...p].filter(c=>/\d/.test(c)).map(Number).filter(n=>n>0);return d.length&&d.reduce((a,b)=>a*b,1)>100;}},
    {t:'Indian city — delhi/mumbai',f:p=>/(delhi|mumbai|kolkata|chennai|bengaluru|hyderabad|pune|jaipur)/i.test(p)},
    {t:'Hindi number — ek/do',f:p=>/\b(ek|do|teen|char|paanch)\b/i.test(p)},
    {t:'"Jai Hind" likho',f:p=>/jai hind/i.test(p)},
    {t:'Ek lowercase letter',f:p=>/[a-z]/.test(p)},
    {t:'Length > 15 characters',f:p=>p.length>15},
  ];
  root.innerHTML=`<div class="game-ui"><h2>Password Chaos — Desi</h2>
    <p class="game-sub">${RULES.length} desi rules ek saath satisfy karo.</p>
    <input class="pwd-input" id="pwd" type="text" placeholder="Password likho..." autocomplete="off" spellcheck="false">
    <div class="progress-row"><span id="cnt">0</span>
      <div class="progress-track"><div class="progress-fill" id="fill"></div></div>
      <span>${RULES.length}</span></div>
    <div class="rules-list" id="list"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">Reset</button>
      <button class="btn" id="cpy">Copy Password</button></div></div>`;
  const input=$('#pwd',root),list=$('#list',root),cnt=$('#cnt',root),fill=$('#fill',root);
  list.innerHTML=RULES.map((r,i)=>`<div class="rule" data-i="${i}">
    <div class="rule-check">✓</div><div>${r.t}</div></div>`).join('');
  function check(){
    const v=input.value;let done=0;
    RULES.forEach((r,i)=>{const ok=r.f(v);if(ok)done++;
      const el=list.querySelector(`[data-i="${i}"]`);if(el)el.classList.toggle('done',ok);});
    cnt.textContent=done;fill.style.width=(done/RULES.length*100)+'%';
    input.classList.toggle('valid',done===RULES.length);
    if(done===RULES.length)toast('🎉 Perfect password!');
  }
  input.addEventListener('input',check);
  $('#rst',root).onclick=()=>{input.value='';check();input.focus();};
  $('#cpy',root).onclick=()=>{if(!input.value){toast('Pehle likho');return;}
    if(navigator.clipboard)navigator.clipboard.writeText(input.value);toast('Copied! 📋');};
  setTimeout(()=>input.focus(),200);
};

R['perfect-circle']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Draw a Perfect Circle</h2>
    <p class="game-sub">Finger se perfect circle banao. Jitna perfect, utna high love score.</p>
    <div class="score-big"><div class="val" id="cv">0<span style="font-size:28px">%</span></div></div>
    <div style="text-align:center;font-weight:700;font-size:14px;margin-bottom:12px" id="cmsg">Start drawing below 👇</div>
    <canvas id="canvas" width="600" height="600"></canvas>
    <div class="btn-row"><button class="btn secondary" id="rst">Reset</button>
      <button class="btn" id="shr">Share Score</button></div></div>`;
  const c=$('#canvas',root),ctx=c.getContext('2d');
  const cw=c.clientWidth,ch=c.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  c.width=cw*dpr;c.height=ch*dpr;ctx.scale(dpr,dpr);
  let drawing=false,pts=[],lastScore=0;
  function pos(e){const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;
    return{x:(t.clientX-r.left)*(cw/r.width),y:(t.clientY-r.top)*(ch/r.height)};}
  function start(e){e.preventDefault();drawing=true;pts=[];ctx.clearRect(0,0,cw,ch);
    $('#cmsg',root).textContent='Drawing…';}
  function move(e){if(!drawing)return;e.preventDefault();const p=pos(e);pts.push(p);
    if(pts.length>1){ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--text');
    ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
    ctx.moveTo(pts[pts.length-2].x,pts[pts.length-2].y);ctx.lineTo(p.x,p.y);ctx.stroke();}}
  function end(){if(!drawing)return;drawing=false;
    if(pts.length<20){$('#cmsg',root).textContent='Bahut chhota! Dobara try karo.';return;}score();}
  c.addEventListener('mousedown',start);c.addEventListener('mousemove',move);c.addEventListener('mouseup',end);
  c.addEventListener('mouseleave',end);
  c.addEventListener('touchstart',start,{passive:false});c.addEventListener('touchmove',move,{passive:false});
  c.addEventListener('touchend',end);
  function score(){
    const cx=pts.reduce((s,p)=>s+p.x,0)/pts.length,cy=pts.reduce((s,p)=>s+p.y,0)/pts.length;
    const radii=pts.map(p=>Math.hypot(p.x-cx,p.y-cy));
    const avg=radii.reduce((a,b)=>a+b,0)/radii.length;
    const variance=radii.reduce((s,r)=>s+(r-avg)**2,0)/radii.length;
    const std=Math.sqrt(variance),circ=100-(std/avg)*100;
    const startP=pts[0],endP=pts[pts.length-1];
    const gap=Math.hypot(startP.x-endP.x,startP.y-endP.y);
    const cf=Math.max(0,1-(gap/avg));
    let f=Math.round(Math.max(0,Math.min(100,circ*(0.75+0.25*cf))));
    lastScore=f;
    const el=$('#cv',root);const t0=performance.now();
    (function anim(now){const t=Math.min(1,(now-t0)/900);const v=Math.round(f*(1-Math.pow(1-t,3)));
      el.innerHTML=v+'<span style="font-size:28px">%</span>';if(t<1)requestAnimationFrame(anim);})(t0);
    let msg='Not bad! 💫';
    if(f>=95)msg='Perfect! Tum to love expert ho 💖';else if(f>=85)msg='Bahut acha! 💕';
    else if(f>=70)msg='Acha try! 💗';else if(f>=50)msg='Theek hai, practice karo 💓';else msg='Circle nahi, potato bana 😅';
    $('#cmsg',root).textContent=msg;
  }
  $('#rst',root).onclick=()=>{pts=[];ctx.clearRect(0,0,cw,ch);
    $('#cv',root).innerHTML='0<span style="font-size:28px">%</span>';$('#cmsg',root).textContent='Start drawing below 👇';};
  $('#shr',root).onclick=()=>{const txt=`Mera love score ${lastScore}% hai on one more try.`;
    if(navigator.share)navigator.share({title:'Perfect Circle',text:txt}).catch(()=>{});
    else{if(navigator.clipboard)navigator.clipboard.writeText(txt);toast('Copied! 📋');}};
};

R['hand-cricket']=root=>{
  let you=0,ai=0,wickets=0,wkLimit=3,innings=1,aiTarget=0,aiWkts=0,youBatting=true;
  root.innerHTML=`<div class="game-ui"><h2>Hand Cricket vs AI</h2>
    <p class="game-sub">1-6 mein se number choose karo. AI bhi choose karega. Same = OUT.</p>
    <div class="hc-score"><div>You: <span id="ys">0</span>/<span id="yw">0</span></div>
      <div>AI: <span id="as">0</span>/<span id="aw">0</span></div></div>
    <div style="text-align:center;font-weight:700;font-size:14px;margin:12px 0" id="status">Pick a number</div>
    <div class="hc-btns" id="btns">${[1,2,3,4,5,6].map(n=>`<button data-n="${n}">${n}</button>`).join('')}</div>
    <div class="btn-row"><button class="btn secondary" id="rst">Reset Game</button></div></div>`;
  function upd(){$('#ys',root).textContent=you;$('#yw',root).textContent=wickets;
    $('#as',root).textContent=ai;$('#aw',root).textContent=aiWkts;}
  function st(s){$('#status',root).textContent=s;}
  function end(){
    if(ai>=aiTarget)st(`AI jeeta 😢 (${ai}/${aiWkts} vs ${you}/${wickets})`);
    else if(you>=aiTarget&&innings===2)st(`🎉 Tum jeete! (${you}/${wickets} vs ${ai}/${aiWkts})`);
    else st(`Innings over — Target was ${aiTarget}`);
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-n]');if(!b)return;
    const yn=+b.dataset.n,an=rand(1,6);
    if(youBatting){
      if(yn===an){wickets++;st(`OUT! (You ${yn} = AI ${an})`);
        if(wickets>=wkLimit){
          if(innings===1){innings=2;aiTarget=you+1;youBatting=false;ai=0;aiWkts=0;you=0;wickets=0;
            st(`Target: ${aiTarget} runs. AI batting!`);}
          else end();
        }
      } else {you+=yn;st(`You: ${yn} — AI: ${an} → +${yn} runs`);}
    } else {
      if(yn===an){aiWkts++;st(`AI OUT! (You ${yn} = AI ${an})`);
        if(aiWkts>=wkLimit)end();
      } else {ai+=an;st(`You: ${yn} — AI: ${an} → AI +${an} runs`);
        if(ai>=aiTarget){st(`AI wins! (${ai}/${aiWkts} vs target ${aiTarget})`);end();}}
    }
    upd();
  });
  $('#rst',root).onclick=()=>{you=0;ai=0;wickets=0;innings=1;aiTarget=0;aiWkts=0;youBatting=true;
    upd();st('Pick a number to start');};
};

R['kbc-quiz']=root=>{
  const QS=[
    {q:'India ka pehla Prime Minister kaun tha?',o:['Nehru','Patel','Gandhi','Ambedkar'],a:0},
    {q:'Taj Mahal kis sheher mein hai?',o:['Delhi','Agra','Jaipur','Lucknow'],a:1},
    {q:'ISRO ka headquarter kahan hai?',o:['Mumbai','Bengaluru','Hyderabad','Chennai'],a:1},
    {q:'"Jana Gana Mana" kisne likha?',o:['Tagore','Bankim','Premchand','Iqbal'],a:0},
    {q:'Chandrayaan-3 kab launch hua?',o:['2021','2022','2023','2024'],a:2},
    {q:'Sabse lambi nadi India mein?',o:['Yamuna','Ganga','Godavari','Brahmaputra'],a:1},
    {q:'Rupee symbol kisne design kiya?',o:['RBI','Uday Kumar','Ambani','Kalam'],a:1},
    {q:'India ka national animal?',o:['Lion','Elephant','Tiger','Peacock'],a:2},
    {q:'Aadhaar kitne digits ka hai?',o:['10','12','14','16'],a:1},
    {q:'First Indian to win Nobel Prize?',o:['Tagore','Bose','Kalam','Raman'],a:0},
    {q:'Indian Constitution kab lagu hua?',o:['1947','1948','1950','1952'],a:2},
    {q:'Sabse zyada IPL titles kaun jeeta?',o:['MI & CSK','RCB','KKR','SRH'],a:0},
  ];
  let idx=0,score=0,answered=false;
  root.innerHTML=`<div class="game-ui"><h2>KBC Quiz</h2>
    <p class="game-sub">${QS.length} sawaal, har sahi jawab 1 point.</p>
    <div style="text-align:center;font-weight:900;font-size:14px;margin-bottom:12px">
      Q<span id="qi">1</span>/${QS.length} • Score: <span id="sc">0</span></div>
    <div id="qbox"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">Restart</button></div></div>`;
  function show(){
    if(idx>=QS.length){
      $('#qbox',root).innerHTML=`<div class="result-box" style="text-align:center"><h3>Quiz khatam!</h3>
        <p style="margin:10px 0">Final: ${score}/${QS.length}</p>
        <p style="color:var(--muted);font-size:13px">
        ${score>=10?'🏆 Outstanding!':score>=7?'👏 Acha kiya!':score>=4?'💪 Theek hai':'📚 Practice karo!'}</p></div>`;
      return;
    }
    answered=false;
    const q=QS[idx];$('#qi',root).textContent=idx+1;$('#sc',root).textContent=score;
    $('#qbox',root).innerHTML=`<div class="kbc-q">${q.q}</div>
      <div class="kbc-opts">${q.o.map((o,i)=>`<button class="kbc-opt" data-i="${i}">${String.fromCharCode(65+i)}. ${o}</button>`).join('')}</div>`;
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('.kbc-opt');if(!b||answered)return;
    answered=true;const i=+b.dataset.i,q=QS[idx];
    const opts=$$('.kbc-opt',root);opts[q.a].classList.add('correct');
    if(i!==q.a)b.classList.add('wrong');else{score++;toast('✅ Correct!');}
    $('#sc',root).textContent=score;
    setTimeout(()=>{idx++;show();},1200);
  });
  $('#rst',root).onclick=()=>{idx=0;score=0;show();};
  show();
};

R['trolley-desi']=root=>{
  const QS=[
    {q:'Trolley 5 logon ko maar dega. Tum lever pull karke 1 banda maar sakte ho.',a:'1 mar',b:'5 mar',ra:0,why:'Utilitarian — 1 < 5.'},
    {q:'Cancer patient vs 5 saal ka baccha?',a:'Baccha bachao',b:'Patient bachao',ra:0,why:'Majority bacche ko chunte hain.'},
    {q:'Pregnant lady vs elderly father?',a:'Pregnant bachao',b:'Father bachao',ra:0,why:'Double life — maternal + child.'},
    {q:'Ambani vs 10 middle-class log?',a:'Ambani',b:'10 log',ra:1,why:'Numbers matter, wealth doesn\'t.'},
    {q:'Dost vs 5 strangers?',a:'Dost',b:'Strangers',ra:1,why:'Ethical — 5 > 1.'},
    {q:'Doctor vs serial killer?',a:'Doctor',b:'Killer',ra:0,why:'Doctor society ke liye valuable.'},
    {q:'100 saal sadhu vs 25 saal cricketer?',a:'Sadhu',b:'Cricketer',ra:1,why:'Younger > older.'},
    {q:'5 politicians vs 1 aam aadmi?',a:'Aam aadmi',b:'Politicians',ra:0,why:'Aam aadmi innocent.'},
    {q:'1000 volunteers vs 5 innocents?',a:'1000 volunteers',b:'5 innocents',ra:0,why:'Volunteers ne risk liya.'},
    {q:'Earth ka future vs tumhari family?',a:'Family',b:'Earth',ra:1,why:'Long-term thinking.'},
    {q:'Ek beggar aur ek businessman?',a:'Beggar',b:'Businessman',ra:0,why:'Beggar zyada vulnerable.'},
    {q:'Bachcha vs tumhara dost?',a:'Bachcha',b:'Dost',ra:0,why:'Bachche ki poori life aage hai.'},
  ];
  let idx=0,agree=0;
  root.innerHTML=`<div class="game-ui"><h2>Trolley Problems Desi</h2>
    <p class="game-sub">${QS.length} Indian moral dilemmas.</p>
    <div style="text-align:center;font-weight:900;font-size:14px;margin-bottom:12px">
      Q<span id="qi">1</span>/${QS.length} • Match: <span id="ag">0</span></div>
    <div id="qbox"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">Restart</button></div></div>`;
  function show(){
    if(idx>=QS.length){
      $('#qbox',root).innerHTML=`<div class="result-box" style="text-align:center"><h3>${agree}/${QS.length} majority match</h3>
        <p style="margin-top:8px;color:var(--muted);font-size:13px">
        ${agree>=9?'🧠 Logical thinker':agree>=6?'🤔 Balanced':'💖 Emotional decision maker'}</p></div>`;
      return;
    }
    const q=QS[idx];$('#qi',root).textContent=idx+1;$('#ag',root).textContent=agree;
    $('#qbox',root).innerHTML=`<div class="kbc-q">${q.q}</div>
      <div class="kbc-opts">
        <button class="kbc-opt" data-i="0">🅰 ${q.a}</button>
        <button class="kbc-opt" data-i="1">🅱 ${q.b}</button></div>`;
  }
  root.addEventListener('click',e=>{
    const b=e.target.closest('.kbc-opt');if(!b)return;
    const i=+b.dataset.i,q=QS[idx];
    if(i===q.ra)agree++;b.classList.add('correct');
    $('#qbox',root).innerHTML+=`<div class="result-box"><p style="font-size:13px">${q.why}</p></div>`;
    setTimeout(()=>{idx++;show();},1500);
  });
  $('#rst',root).onclick=()=>{idx=0;agree=0;show();};
  show();
};

R['antakshari']=root=>{
  const S={
    a:['Aaj ki raat','Aankhon mein teri','Ankhiyan milaun','Awara hoon'],
    b:['Badan pe sitare','Bahut pyar karte','Bheegi bheegi raaton'],
    c:['Chal chhaiyan','Chura liya hai','Chand mera dil'],
    d:['Dil hai chhota','Dum maro dum','Dil to pagal hai'],
    e:['Ek ladki ko dekha','Ek ajnabee hasina','Ek do teen'],
    i:['Itni shakti','Ishq wala love','Iktaara'],
    j:['Jai jai shivshankar','Jhoom barabar','Jab koi baat'],
    k:['Kabhi kabhi','Kal ho na ho','Kuch kuch hota'],
    m:['Mere rashke qamar','Mera joota hai japani','Mere sapno ki rani'],
    n:['Neele neele ambar','Naina barse','Naam hai tera'],
    p:['Pyaar kiya to darna','Papa kehte hain','Pehla nasha'],
    r:['Roja jaane man','Rimjhim gire saawan','Radha kaise na jale'],
    s:['Saansein','Salaam-e-ishq','Saawan ka mahina'],
    t:['Tere bina','Tum hi ho','Tujhe dekha to'],
    y:['Yeh dosti','Ye tera ghar','Yara yara'],
    z:['Zindagi ek safar','Zara zara','Zubi zubi'],
  };
  let used=[],last='',score=0,rounds=0;
  root.innerHTML=`<div class="game-ui"><h2>Antakshari</h2>
    <p class="game-sub">Last letter se gaana shuru karo.</p>
    <div style="text-align:center;margin-bottom:12px">
      <div style="font-weight:800">Score: <span id="sc">0</span></div>
      <div style="color:var(--muted);font-size:12px;margin-top:6px">Last letter: <span id="lt">—</span></div></div>
    <input class="input" id="inp" placeholder="Gaana ka naam likho..." autocomplete="off">
    <div class="btn-row"><button class="btn" id="go">Send</button>
      <button class="btn secondary" id="rst">Reset</button></div>
    <div id="log" style="margin-top:14px;display:flex;flex-direction:column;gap:8px"></div></div>`;
  function log(w,t,ok=true){
    const d=document.createElement('div');
    d.style.cssText='padding:10px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--border);font-size:13px;font-weight:600';
    if(!ok)d.style.background='color-mix(in srgb,var(--danger) 15%,var(--surface))';
    d.innerHTML=`<b>${w}:</b> ${t}`;$('#log',root).appendChild(d);
  }
  $('#go',root).onclick=()=>{
    const v=$('#inp',root).value.trim();if(!v)return;
    const fl=v[0].toLowerCase();
    if(last&&fl!==last){toast(`"${last.toUpperCase()}" se shuru karo!`);return;}
    if(used.includes(v.toLowerCase())){toast('Ye gaana already use hua!');return;}
    used.push(v.toLowerCase());log('You',v);score++;rounds++;$('#sc',root).textContent=score;
    last=v[v.length-1].toLowerCase();$('#lt',root).textContent=last.toUpperCase();
    $('#inp',root).value='';
    setTimeout(()=>{
      const opts=(S[last]||[]).filter(s=>!used.includes(s.toLowerCase()));
      if(!opts.length){log('AI',`"${last.toUpperCase()}" se koi gaana nahi aata — You win! 🎉`,false);return;}
      const ai=pick(opts);used.push(ai.toLowerCase());log('AI',ai);
      last=ai[ai.length-1].toLowerCase();$('#lt',root).textContent=last.toUpperCase();
    },700);
  };
  $('#inp',root).onkeydown=e=>{if(e.key==='Enter')$('#go',root).click();};
  $('#rst',root).onclick=()=>{used=[];last='';score=0;$('#sc',root).textContent=0;
    $('#lt',root).textContent='—';$('#log',root).innerHTML='';$('#inp',root).value='';};
};

R['truth-dare']=root=>{
  const T=['Sabse embarrassing moment kya tha?','Last lie kya boli thi?','Crush ka naam batao?','Sabse zyada paisa kis cheez pe waste kiya?','Ek secret jo kisi ko nahi pata','School mein last bench pe kya karte the?','Sabse weird sapna kya dekha?','Kis cheez se sabse zyada darte ho?','Apni ek weakness batao','Sabse bada regret kya hai?'];
  const D=['10 push-ups karo','Ek minute tak kisi dost ki tareef karo','Apni crush ko text karo','Ek filmy dialogue bolo','Sabse purane WhatsApp chat ka screenshot bhejo','Selfie click karke story daalo','Ek song gaao 30 second','Kisi ko call karke "I love you" bolo','Apni phone gallery ki last photo dikhao','Kisi dost ka mimicry karo'];
  root.innerHTML=`<div class="game-ui"><h2>Truth or Dare Desi</h2>
    <p class="game-sub">Dost ke saath khelo.</p>
    <div id="box" style="min-height:180px;display:grid;place-items:center;background:var(--surface);
      border:1px solid var(--border);border-radius:18px;padding:24px;text-align:center;
      font-size:18px;font-weight:800;line-height:1.5">Choose Truth ya Dare 👇</div>
    <div class="btn-row"><button class="btn" id="tr">Truth 💬</button>
      <button class="btn danger" id="dr">Dare 🔥</button></div>
    <div class="btn-row"><button class="btn secondary" id="rnd">Random 🎲</button></div></div>`;
  function show(k,t){$('#box',root).innerHTML=`<div style="font-size:11px;text-transform:uppercase;
    color:var(--muted);letter-spacing:1px;margin-bottom:8px">${k}</div>${t}`;}
  $('#tr',root).onclick=()=>show('Truth 💬',pick(T));
  $('#dr',root).onclick=()=>show('Dare 🔥',pick(D));
  $('#rnd',root).onclick=()=>{const k=Math.random()<0.5?'Truth 💬':'Dare 🔥';
    show(k,k.includes('Truth')?pick(T):pick(D));};
};

R['ipl-auction']=root=>{
  const P=[
    {n:'Virat Kohli',r:'BAT',p:15,e:'🏏'},{n:'Rohit Sharma',r:'BAT',p:14,e:'🏏'},
    {n:'Jasprit Bumrah',r:'BOWL',p:18,e:'⚾'},{n:'MS Dhoni',r:'WK',p:12,e:'🧤'},
    {n:'Hardik Pandya',r:'ALL',p:15,e:'⚡'},{n:'Ravindra Jadeja',r:'ALL',p:16,e:'🌀'},
    {n:'Suryakumar Yadav',r:'BAT',p:11,e:'🏏'},{n:'Rashid Khan',r:'BOWL',p:15,e:'🎯'},
    {n:'KL Rahul',r:'WK',p:17,e:'🧤'},{n:'Mohammed Shami',r:'BOWL',p:10,e:'⚾'},
    {n:'Shubman Gill',r:'BAT',p:8,e:'🏏'},{n:'Axar Patel',r:'ALL',p:9,e:'🌀'},
    {n:'Rishabh Pant',r:'WK',p:16,e:'🧤'},{n:'Yuzvendra Chahal',r:'BOWL',p:8,e:'🎯'},
  ];
  let purse=90,team=[],idx=0;
  root.innerHTML=`<div class="game-ui"><h2>IPL Auction</h2>
    <p class="game-sub">Purse: ₹90 Cr. Team banao!</p>
    <div class="stat"><div class="stat-label">Purse Left</div>
      <div class="stat-val" id="purse">₹90 Cr</div></div>
    <div id="box"></div><div id="team" style="margin-top:14px"></div></div>`;
  function show(){
    if(idx>=P.length){
      $('#box',root).innerHTML=`<div class="result-box" style="text-align:center"><h3>Auction khatam!</h3>
        <p style="margin-top:8px">Team size: ${team.length} • Spent: ₹${90-purse} Cr</p></div>`;
      return;
    }
    const p=P[idx];
    $('#box',root).innerHTML=`<div class="result-box">
      <div style="font-size:48px;text-align:center">${p.e}</div>
      <h3 style="text-align:center;margin:8px 0">${p.n}</h3>
      <p style="text-align:center;color:var(--muted);font-size:13px">${p.r} • Base ₹${p.p} Cr</p>
      <div class="btn-row"><button class="btn" id="bid">Bid ₹${p.p} Cr</button>
        <button class="btn secondary" id="skip">Skip</button></div></div>`;
    $('#bid',root).onclick=()=>{if(purse<p.p){toast('Purse kam!');return;}
      purse-=p.p;team.push(p);idx++;upd();show();};
    $('#skip',root).onclick=()=>{idx++;show();};
  }
  function upd(){$('#purse',root).textContent='₹'+purse+' Cr';
    $('#team',root).innerHTML=team.length?`<div class="stat"><div class="stat-label">Your Team (${team.length})</div>
      <div style="font-size:13px;line-height:1.7">${team.map(t=>`${t.e} ${t.n} — ₹${t.p} Cr`).join('<br>')}</div></div>`:'';}
  show();upd();
};

R['tambola']=root=>{
  const called=[];
  root.innerHTML=`<div class="game-ui"><h2>Tambola / Housie</h2>
    <p class="game-sub">1-90 numbers. Random caller.</p>
    <div class="stat" style="text-align:center;padding:24px">
      <div class="stat-label">Last Number</div>
      <div class="stat-val" id="last" style="font-size:64px">—</div></div>
    <div class="btn-row"><button class="btn" id="call">Call Number</button>
      <button class="btn secondary" id="rst">Reset</button></div>
    <div class="stat" style="margin-top:14px"><div class="stat-label">Called (<span id="cnt">0</span>/90)</div>
      <div id="hist" style="font-size:12px;line-height:1.7;font-variant-numeric:tabular-nums">—</div></div></div>`;
  $('#call',root).onclick=()=>{
    if(called.length>=90){toast('All 90 called!');return;}
    let n;do{n=rand(1,90);}while(called.includes(n));
    called.push(n);$('#last',root).textContent=n;$('#hist',root).textContent=called.join(', ');
    $('#cnt',root).textContent=called.length;
  };
  $('#rst',root).onclick=()=>{called.length=0;$('#last',root).textContent='—';$('#hist',root).textContent='—';$('#cnt',root).textContent=0;};
};

R['deep-india']=root=>{
  const D=[
    {d:0,e:'🌊',n:'Surface',t:'Sunlight zone. Bay of Bengal, Arabian Sea, Andaman Sea.'},
    {d:10,e:'🏊',n:'Scuba Diving Range',t:'Coral reefs, colourful fish — Lakshadweep and Andaman.'},
    {d:40,e:'🤿',n:'Recreational Dive Limit',t:'PADI recreational limit.'},
    {d:100,e:'🐢',n:'Sea Turtles',t:'Olive Ridley turtles Odisha coast (Gahirmatha).'},
    {d:200,e:'🌑',n:'Twilight Zone',t:'Sunlight khatam, temperature tez girti hai.'},
    {d:332,e:'🎽',n:'Deepest Scuba Dive',t:'Ahmed Gabr ne 2014 mein 332m tak dive kiya.'},
    {d:500,e:'🐋',n:'Blue Whale Zone',t:'Earth ke sabse bade animals yahaan tak dive karte hain.'},
    {d:1000,e:'🌌',n:'Midnight Zone',t:'Poori tarah andhera. Bioluminescent creatures.'},
    {d:2000,e:'🦑',n:'Giant Squid',t:'Rare aur mysterious. 10m+ lamba ho sakta hai.'},
    {d:3800,e:'🚢',n:'Titanic Wreck Depth',t:'Titanic 3,800m par mila tha.'},
    {d:4000,e:'🦑',n:'Abyssal Zone',t:'Pressure 400 atmospheres.'},
    {d:6000,e:'🏔️',n:'Hadal Zone Begins',t:'Java Trench — 7,258m deep.'},
    {d:7000,e:'🐟',n:'Snailfish',t:'Sabse gehre fish. Hadal zone mein survive.'},
    {d:8000,e:'🌋',n:'Sunda Trench',t:'Indian Ocean ka sabse gehra point — 7,290m.'},
    {d:11000,e:'🏆',n:'Mariana Trench (Reference)',t:'Earth ka sabse gehra — 10,994m.'},
  ];
  root.innerHTML=`<div class="journey deep" id="jr" style="height:100%;overflow-y:auto">
    <div class="hud"><div><div class="hud-label">Depth</div>
      <div class="hud-val"><span id="dv">0</span>m</div></div>
      <div style="text-align:right"><div class="hud-label">Zone</div>
      <div style="font-size:13px;font-weight:800" id="zn">Sunlight</div></div></div>
    <div id="ct">${D.map(it=>`<div class="j-item" data-d="${it.d}">
      <div class="j-emoji">${it.e}</div><div class="j-info">
      <div class="j-depth">${it.d.toLocaleString()}m depth</div>
      <h4>${it.n}</h4><p>${it.t}</p></div></div>`).join('')}</div>
    <div style="padding:40px 20px 60px;text-align:center;color:#64748b;font-size:12px;font-weight:700">🌊 End of journey — 11,000m</div></div>`;
  const jr=$('#jr',root);
  jr.addEventListener('scroll',()=>{
    const items=$$('.j-item',$('#ct',root));
    const sh=jr.scrollTop+100;let cur=0;
    for(const it of items)if(it.offsetTop<=sh)cur=+it.dataset.d;
    $('#dv',root).textContent=cur.toLocaleString();
    let z='Sunlight';if(cur>200)z='Twilight';if(cur>1000)z='Midnight';
    if(cur>4000)z='Abyssal';if(cur>6000)z='Hadal';
    $('#zn',root).textContent=z;
  });
};

R['asteroid-india']=root=>{
  const C=[
    {n:'Delhi',x:135,y:105},{n:'Mumbai',x:95,y:225},{n:'Kolkata',x:225,y:170},
    {n:'Chennai',x:165,y:290},{n:'Bengaluru',x:145,y:265},{n:'Hyderabad',x:150,y:240},
    {n:'Jaipur',x:115,y:145},{n:'Lucknow',x:170,y:135},{n:'Ahmedabad',x:95,y:180},
    {n:'Pune',x:110,y:235},{n:'Patna',x:200,y:140},{n:'Bhopal',x:140,y:185},
  ];
  root.innerHTML=`<div class="game-ui" style="max-width:720px">
    <h2>Asteroid India</h2>
    <p class="game-sub">Map par click karo, asteroid customize karo, impact dekho.</p>
    <div class="asteroid-map" id="map">
      <svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMid meet">
        <defs><radialGradient id="g1" cx="50%" cy="40%">
          <stop offset="0%" stop-color="#1e3a5f"/><stop offset="100%" stop-color="#0f1e33"/>
        </radialGradient></defs>
        <path class="india-path" d="M95,45 L120,30 L145,35 L165,50 L185,55 L200,65 L215,60 L235,75 L250,85 L265,95 L270,110 L260,120 L265,135 L255,150 L245,165 L250,180 L240,200 L230,220 L215,235 L205,255 L195,275 L185,295 L175,315 L165,340 L155,350 L145,340 L140,320 L130,300 L120,280 L105,260 L95,240 L85,220 L75,200 L65,180 L60,155 L55,130 L60,110 L70,90 L80,70 L85,55 Z" fill="url(#g1)"/>
        <text x="150" y="195" text-anchor="middle" fill="#475569" font-size="11" font-weight="800" letter-spacing="2">INDIA</text>
        ${C.map(c=>`<circle class="city-dot" cx="${c.x}" cy="${c.y}" r="2.5"/>
          <text class="city-label" x="${c.x+5}" y="${c.y+3}">${c.n}</text>`).join('')}
      </svg></div>
    <div class="ctrl-row"><label>Composition <span id="cv2">Iron</span></label>
      <select id="comp" class="input" style="font-size:13px">
        <option value="iron">Iron (dense)</option>
        <option value="stone">Stone</option>
        <option value="comet">Comet (ice)</option>
        <option value="gold">Gold (rare)</option>
      </select></div>
    <div class="ctrl-row"><label>Diameter <span id="dv">500 m</span></label>
      <input type="range" id="dia" min="10" max="10000" value="500" step="10"></div>
    <div class="ctrl-row"><label>Speed <span id="sv">17 km/s</span></label>
      <input type="range" id="spd" min="10" max="70" value="17"></div>
    <div class="ctrl-row"><label>Angle <span id="av">45°</span></label>
      <input type="range" id="ang" min="15" max="90" value="45"></div>
    <button class="btn" id="launch" style="width:100%;padding:16px;background:linear-gradient(135deg,#ef4444,#f97316);color:#fff" disabled>Select a location on the map</button>
    <div id="res"></div></div>`;
  let sel=null;const map=$('#map',root);
  map.onclick=e=>{
    const r=map.getBoundingClientRect();
    sel={xp:((e.clientX-r.left)/r.width)*100,yp:((e.clientY-r.top)/r.height)*100};
    const old=map.querySelector('.marker');if(old)old.remove();
    const m=document.createElement('div');m.className='marker';
    m.style.cssText=`position:absolute;left:${sel.xp}%;top:${sel.yp}%;width:14px;height:14px;
      border-radius:50%;background:#fbbf24;box-shadow:0 0 16px #fbbf24;transform:translate(-50%,-50%);
      animation:craterExpand .3s`;
    map.appendChild(m);
    $('#launch',root).disabled=false;$('#launch',root).textContent='🚀 LAUNCH ASTEROID';
  };
  const dia=$('#dia',root),spd=$('#spd',root),ang=$('#ang',root),comp=$('#comp',root);
  const upd=()=>{$('#dv',root).textContent=dia.value>=1000?(dia.value/1000).toFixed(1)+' km':dia.value+' m';
    $('#sv',root).textContent=spd.value+' km/s';$('#av',root).textContent=ang.value+'°';
    $('#cv2',root).textContent=comp.options[comp.selectedIndex].text.split(' ')[0];};
  [dia,spd,ang,comp].forEach(el=>el.addEventListener('input',upd));upd();
  $('#launch',root).onclick=()=>{
    if(!sel)return;
    const d=+dia.value,v=+spd.value;
    const density={iron:7800,stone:2500,comet:900,gold:19300}[comp.value];
    const craterKm=(1.161*Math.pow(density/2500,1/3)*Math.pow(d,0.78)*Math.pow(v,0.44))/1000;
    const fb=craterKm*8,sw=craterKm*20;
    const energy=0.5*((Math.PI/6)*(d**3)*density)*((v*1000)**2);
    const mt=energy/4.184e15,mag=Math.max(0,(Math.log10(energy)-4.8)/1.5);
    const cas=Math.round(Math.PI*(sw**2)*450);
    const c=document.createElement('div');c.className='crater';
    c.style.cssText=`left:${sel.xp}%;top:${sel.yp}%;width:${Math.min(150,craterKm*5)}px;height:${Math.min(150,craterKm*5)}px`;
    map.appendChild(c);
    $('#res',root).innerHTML=`<div class="result-box"><h3>💥 Impact Analysis</h3>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">Crater diameter</span><b>${craterKm.toFixed(2)} km</b></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">Fireball radius</span><b>${fb.toFixed(1)} km</b></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">Shockwave radius</span><b>${sw.toFixed(1)} km</b></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">Earthquake</span><b>M ${mag.toFixed(1)}</b></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--muted)">Energy</span><b>${mt>1e6?(mt/1e6).toFixed(1)+'M':mt.toFixed(0)} MT TNT</b></div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:13px"><span style="color:var(--muted)">Est. casualties</span><b style="color:var(--danger)">${cas.toLocaleString('en-IN')}+</b></div></div>`;
    if(cas>1e6)toast('💀 Catastrophic impact!');
  };
};

R['space-exploration']=root=>{
  const D=[
    {d:'0 km',e:'🌍',n:'Earth Surface',t:'Tumhara ghar. 71% paani, 29% zameen.'},
    {d:'100 km',e:'🚀',n:'Kármán Line',t:'Space ki official boundary.'},
    {d:'400 km',e:'🛰️',n:'ISS Orbit',t:'International Space Station. 27,600 km/h.'},
    {d:'2,000 km',e:'🛰️',n:'GPS Satellites',t:'India ka NavIC system bhi is range mein.'},
    {d:'36,000 km',e:'📡',n:'Geostationary Orbit',t:'INSAT, GSAT yahaan hain.'},
    {d:'384,400 km',e:'🌕',n:'The Moon',t:'Chandrayaan-3 ne 2023 mein soft landing ki.'},
    {d:'225M km',e:'🔴',n:'Mars',t:'Mangalyaan (2014) — India pehla Asian country.'},
    {d:'778M km',e:'🪐',n:'Jupiter',t:'Solar system ka sabse bada planet. 1,300 Earths fit.'},
    {d:'1.4B km',e:'🪐',n:'Saturn',t:'Rings 280,000 km wide lekin 10m thick.'},
    {d:'2.9B km',e:'🔵',n:'Uranus',t:'Ice giant. 84 saal mein ek baar Sun ka chakkar.'},
    {d:'4.5B km',e:'🔵',n:'Neptune',t:'Winds 2,100 km/h — sabse fast.'},
    {d:'5.9B km',e:'🪐',n:'Pluto',t:'Dwarf planet. 2006 mein status change.'},
    {d:'~100 AU',e:'☄️',n:'Heliopause',t:'Solar wind khatam. Voyager 1 ne 2012 mein cross kiya.'},
    {d:'4.24 ly',e:'⭐',n:'Proxima Centauri',t:'Sabse nazdeek star.'},
    {d:'100,000 ly',e:'🌌',n:'Milky Way Width',t:'100-400 billion stars.'},
    {d:'2.5M ly',e:'🌠',n:'Andromeda Galaxy',t:'4 billion saal mein humse takrayegi.'},
    {d:'46.5B ly',e:'🌌',n:'Observable Universe Edge',t:'Jitna dekh sakte hain. Iske aage — pata nahi.'},
  ];
  root.innerHTML=`<div class="journey space" id="jr" style="height:100%;overflow-y:auto">
    <div class="hud"><div><div class="hud-label">Distance from Earth</div>
      <div class="hud-val"><span id="dv">0 km</span></div></div>
      <div style="text-align:right"><div class="hud-label">At</div>
      <div style="font-size:13px;font-weight:800" id="zn">Earth</div></div></div>
    <div id="ct">${D.map(it=>`<div class="j-item" data-n="${it.n}">
      <div class="j-emoji">${it.e}</div><div class="j-info">
      <div class="j-depth">${it.d}</div><h4>${it.n}</h4><p>${it.t}</p></div></div>`).join('')}</div>
    <div style="padding:40px 20px 60px;text-align:center;color:#7c3aed;font-size:12px;font-weight:800">✨ End of journey</div></div>`;
  const jr=$('#jr',root);
  jr.addEventListener('scroll',()=>{
    const items=$$('.j-item',$('#ct',root));
    const sh=jr.scrollTop+100;let cur=items[0];
    for(const it of items)if(it.offsetTop<=sh)cur=it;
    if(cur){$('#dv',root).textContent=cur.querySelector('.j-depth').textContent;
      $('#zn',root).textContent=cur.dataset.n;}
  });
};

R['future-vision']=root=>{
  const P={
    2026:{i:'🤖',t:'AI Everywhere',d:'Har phone, laptop mein AI assistant default ho jayega. India mein AI-based healthcare schemes.'},
    2030:{i:'🚗',t:'EV Dominance Begins',d:'India mein 30%+ nayi cars electric hongi. Tesla, Tata, Mahindra compete karenge.'},
    2035:{i:'🌕',t:'Moon Base Alpha',d:'China, USA aur India ke crewed Moon missions. Lunar mining research shuru.'},
    2040:{i:'🧬',t:'CRISPR Mainstream',d:'Genetic diseases ka treatment common. India mein personalized medicine affordable.'},
    2045:{i:'🧠',t:'AGI Arrives',d:'AI human-level general intelligence tak pahunch sakta hai. Job market radically change.'},
    2050:{i:'🌊',t:'Climate Crisis Peak',d:'Mumbai, Kolkata, Chennai — coastal flooding. 1B climate refugees globally.'},
    2060:{i:'🚀',t:'Mars Colony',d:'SpaceX aur ISRO Mars par pehla self-sustaining colony bana sakte hain.'},
    2070:{i:'⚡',t:'Fusion Energy',d:'ITER aur private fusion companies commercial reactors bana sakti hain.'},
    2080:{i:'🧑‍🚀',t:'Interstellar Probes',d:'Breakthrough Starshot jaisi projects Alpha Centauri bheji ja sakti hain.'},
    2100:{i:'🌍',t:'A New Earth?',d:'Climate-stabilized planet ya Mars terraforming. Humanity multi-planetary.'},
  };
  const years=Object.keys(P).map(Number);
  root.innerHTML=`<div class="game-ui"><h2>See The Future</h2>
    <p class="game-sub">2026 se 2100 tak research-based predictions.</p>
    <div class="year-big"><div class="yr" id="yr">2026</div></div>
    <input type="range" class="slider" id="s" min="2026" max="2100" value="2026">
    <div id="fc"></div></div>`;
  function near(y){let b=years[0];for(const k of years)if(Math.abs(k-y)<Math.abs(b-y))b=k;return b;}
  function upd(){
    const y=+$('#s',root).value;$('#yr',root).textContent=y;
    const k=near(y),p=P[k];
    $('#fc',root).innerHTML=`<div class="result-box" style="text-align:center">
      <div style="font-size:44px">${p.i}</div>
      <h3 style="margin:10px 0 8px">${p.t}</h3>
      <p style="color:var(--muted);font-size:14px;line-height:1.6">${p.d}</p>
      <div style="margin-top:12px;font-size:11px;color:var(--muted);font-weight:700">Prediction year: ${k}</div></div>`;
  }
  $('#s',root).oninput=upd;upd();
};

R['history-timeline']=root=>{
  const EV=[
    {y:'13.8 BYA',e:'💥',t:'Big Bang',d:'Universe ki shuruaat. Space, time, matter.'},
    {y:'4.6 BYA',e:'🌍',t:'Earth Formed',d:'Sun ke around dust aur gas se Earth bana.'},
    {y:'3.8 BYA',e:'🦠',t:'First Life',d:'Single-celled organisms samundar mein aaye.'},
    {y:'540 MYA',e:'🐚',t:'Cambrian Explosion',d:'Achanak complex animals aane lage. Trilobites.'},
    {y:'252 MYA',e:'🌋',t:'Permian Extinction',d:'"The Great Dying" — 96% species khatam.'},
    {y:'230 MYA',e:'🦕',t:'Dinosaurs Rise',d:'165 million saal tak raaj kiya.'},
    {y:'66 MYA',e:'☄️',t:'K-Pg Extinction',d:'Asteroid ne dinosaurs ko khatam kiya.'},
    {y:'300 KYA',e:'🧑',t:'Homo Sapiens',d:'Modern humans Africa mein aaye.'},
    {y:'70 KYA',e:'🚶',t:'Out of Africa',d:'Humans Africa se baahar nikle. India 60,000 saal pehle.'},
    {y:'10,000 BCE',e:'🌾',t:'Agriculture',d:'Farming shuru. Settlements, villages.'},
    {y:'3300 BCE',e:'🏛️',t:'Indus Valley Civilization',d:'Harappa, Mohenjo-daro. Advanced city planning.'},
    {y:'1500 BCE',e:'📜',t:'Vedic Period',d:'Rigveda likha gaya. Sanskrit, early Hinduism.'},
    {y:'563 BCE',e:'🧘',t:'Gautam Buddha',d:'Buddhism ki sthapna.'},
    {y:'320 BCE',e:'👑',t:'Maurya Empire',d:'Chandragupta Maurya. Ashoka ne Buddhism phailaya.'},
    {y:'319 CE',e:'👑',t:'Gupta Empire',d:'"Golden Age of India". Aryabhata, zero ki khoj.'},
    {y:'1526 CE',e:'🕌',t:'Mughal Empire',d:'Babur ne Mughal rule shuru. Taj Mahal 1632.'},
    {y:'1857 CE',e:'⚔️',t:'First War of Independence',d:'Sepoy Mutiny. British Raj officially shuru.'},
    {y:'1947 CE',e:'🇮🇳',t:'Indian Independence',d:'15 August 1947. Nehru first PM.'},
    {y:'1969 CE',e:'🌕',t:'Moon Landing',d:'Neil Armstrong. "One small step for man..."'},
    {y:'1975 CE',e:'🛰️',t:'India\'s First Satellite',d:'Aryabhata launch. ISRO ki shuruaat.'},
    {y:'1991 CE',e:'💻',t:'Internet Goes Public',d:'WWW public. India mein internet 1995.'},
    {y:'2008 CE',e:'🚀',t:'Chandrayaan-1',d:'India ne Moon par paani khoja.'},
    {y:'2020 CE',e:'🦠',t:'COVID-19 Pandemic',d:'Global lockdown. Work-from-home normal.'},
    {y:'2023 CE',e:'🌕',t:'Chandrayaan-3',d:'India Moon ke South Pole par pehla country.'},
    {y:'2026 CE',e:'⚡',t:'Abhi — 2026',d:'AI revolution, climate crisis, space race 2.0.'},
  ];
  root.innerHTML=`<div class="tl-wrap"><h2>History Timeline</h2>
    <p style="color:var(--muted);font-size:13px;margin-bottom:20px">Big Bang se 2026 tak — scientifically accurate.</p>
    ${EV.map((ev,i)=>`<div class="tl-item" style="animation-delay:${Math.min(i*30,600)}ms">
      <div class="tl-year">${ev.y}</div>
      <h4>${ev.e} ${ev.t}</h4><p>${ev.d}</p></div>`).join('')}</div>`;
};

R['isro-missions']=root=>{
  const M=[
    {y:1975,e:'🛰️',n:'Aryabhata',d:'India ka pehla satellite. Soviet rocket se launch.'},
    {y:1980,e:'🚀',n:'SLV-3 / Rohini',d:'Pehla indigenous satellite launch.'},
    {y:2008,e:'🌕',n:'Chandrayaan-1',d:'Moon par paani ke molecules khoje.'},
    {y:2013,e:'🔴',n:'Mangalyaan',d:'Mars par pehla Asian mission. ₹450 Cr mein.'},
    {y:2017,e:'🚀',n:'PSLV-C37',d:'104 satellites ek saath launch.'},
    {y:2019,e:'🌕',n:'Chandrayaan-2',d:'Orbiter successful, lander crash.'},
    {y:2023,e:'🌕',n:'Chandrayaan-3',d:'Moon South Pole par first soft landing.'},
    {y:2023,e:'☀️',n:'Aditya-L1',d:'Sun study mission.'},
    {y:2024,e:'🧑‍🚀',n:'Gaganyaan Tests',d:'Crewed mission ki tayyari.'},
    {y:2026,e:'🏗️',n:'Bharatiya Antariksh Station',d:'Planned space station.'},
  ];
  root.innerHTML=`<div class="tl-wrap"><h2>ISRO Missions</h2>
    <p style="color:var(--muted);font-size:13px;margin-bottom:20px">India ke space missions timeline.</p>
    ${M.map((m,i)=>`<div class="tl-item" style="animation-delay:${Math.min(i*40,400)}ms">
      <div class="tl-year">${m.y}</div>
      <h4>${m.e} ${m.n}</h4><p>${m.d}</p></div>`).join('')}</div>`;
};

R['size-of-india']=root=>{
  const I=[
    {e:'🏛️',n:'Taj Mahal',h:73},{e:'🗼',n:'Qutub Minar',h:72.5},
    {e:'🏛️',n:'India Gate',h:42},{e:'🗿',n:'Statue of Unity',h:182},
    {e:'🏔️',n:'Kanchenjunga',h:8586},{e:'🏔️',n:'K2',h:8611},
    {e:'🏔️',n:'Everest',h:8848},{e:'🏢',n:'Burj Khalifa',h:828},
    {e:'🏢',n:'Antilia',h:173},{e:'🚀',n:'Falcon 9',h:70},
  ];
  const max=Math.max(...I.map(i=>i.h));
  root.innerHTML=`<div class="game-ui"><h2>Size of India</h2>
    <p class="game-sub">Height comparison — metres mein.</p>
    ${I.sort((a,b)=>b.h-a.h).map(it=>`
      <div style="margin-bottom:14px">
        <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;margin-bottom:4px">
          <span>${it.e} ${it.n}</span><span>${it.h.toLocaleString()}m</span></div>
        <div style="height:10px;background:var(--surface-2);border-radius:99px;overflow:hidden">
          <div style="height:100%;background:linear-gradient(90deg,var(--accent),var(--info));
            width:${(it.h/max)*100}%;border-radius:99px;transition:width .6s"></div></div></div>`).join('')}
  </div>`;
};

R['human-body']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Human Body Stats</h2>
    <p class="game-sub">Apni age daalo, apni journey dekho.</p>
    <input class="input" id="age" type="number" placeholder="Age in years" value="25" min="0" max="120">
    <div class="btn-row"><button class="btn" id="go">Calculate</button></div>
    <div id="res"></div></div>`;
  $('#go',root).onclick=()=>{
    const y=Math.max(0,Math.min(120,+$('#age',root).value||0));
    const d=y*365,hrs=d*24,mins=hrs*60;
    const beats=Math.round(mins*72),br=Math.round(mins*15),st=Math.round(d*7000);
    const sleep=Math.round(y/3),food=Math.round(d*1.5);
    $('#res',root).innerHTML=`<div class="result-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="stat"><div class="stat-label">Days Lived</div><div class="stat-val">${d.toLocaleString()}</div></div>
        <div class="stat"><div class="stat-label">Hours</div><div class="stat-val">${hrs.toLocaleString()}</div></div>
        <div class="stat"><div class="stat-label">Heartbeats</div><div class="stat-val">${(beats/1e6).toFixed(1)}M</div></div>
        <div class="stat"><div class="stat-label">Breaths</div><div class="stat-val">${(br/1e6).toFixed(1)}M</div></div>
        <div class="stat"><div class="stat-label">Steps Taken</div><div class="stat-val">${(st/1e6).toFixed(1)}M</div></div>
        <div class="stat"><div class="stat-label">Slept</div><div class="stat-val">${sleep} yrs</div></div>
        <div class="stat"><div class="stat-label">Food (kg)</div><div class="stat-val">${food.toLocaleString()}</div></div>
        <div class="stat"><div class="stat-label">Days till 100</div><div class="stat-val">${Math.max(0,(100-y)*365).toLocaleString()}</div></div>
      </div></div>`;
  };
  $('#go',root).click();
};

R['earthquake-sim']=root=>{
  const Z=[
    {n:'Zone V (Very High)',c:'#ef4444',p:'Kashmir, Himachal, NE India, Kutch, Andaman'},
    {n:'Zone IV (High)',c:'#f59e0b',p:'Delhi, Parts of UP, Bihar, WB, Gujarat'},
    {n:'Zone III (Moderate)',c:'#eab308',p:'Mumbai, Chennai, Kolkata, Bengaluru'},
    {n:'Zone II (Low)',c:'#10b981',p:'Most of South India'},
  ];
  root.innerHTML=`<div class="game-ui"><h2>Earthquake Simulator</h2>
    <p class="game-sub">Magnitude slider karo, effect dekho.</p>
    <div class="ctrl-row"><label>Magnitude <span id="mv">6.0</span></label>
      <input type="range" id="mag" min="1" max="10" value="6" step="0.1"></div>
    <div id="res"></div>
    <h3 style="margin:20px 0 10px;font-size:15px;font-weight:800">Seismic Zones</h3>
    ${Z.map(z=>`<div class="stat" style="border-left:4px solid ${z.c}">
      <div class="stat-label">${z.n}</div>
      <div style="font-size:13px;margin-top:4px">${z.p}</div></div>`).join('')}</div>`;
  function upd(){
    const m=+$('#mag',root).value;$('#mv',root).textContent=m.toFixed(1);
    const energy=Math.pow(10,1.5*m+4.8),tnt=energy/4.184e9;
    const eff=m<3?'Feels only by instruments':m<5?'Minor shaking, no damage':
      m<6?'Moderate damage in weak buildings':m<7?'Strong damage, casualties':
      m<8?'Major destruction over large area':'Catastrophic — city-level destruction';
    $('#res',root).innerHTML=`<div class="result-box">
      <div class="stat"><div class="stat-label">Energy Release</div>
        <div class="stat-val">${tnt>1e6?(tnt/1e6).toFixed(1)+' MT':tnt.toFixed(0)+' tons'} TNT</div></div>
      <div class="stat"><div class="stat-label">Effect</div>
        <div style="font-size:14px;margin-top:4px;font-weight:600">${eff}</div></div></div>`;
  }
  $('#mag',root).oninput=upd;upd();
};

R['climate-india']=root=>{
  const S=[
    {y:2026,c:'⚡',d:'India 500 GW renewable target. Solar boom.'},
    {y:2035,c:'🌊',d:'Mumbai, Chennai coastal flooding. Monsoon patterns shift.'},
    {y:2050,c:'🔥',d:'Delhi heat waves 50°C+. 1B+ climate migrants globally.'},
    {y:2075,c:'🌪️',d:'Bay of Bengal cyclones double. Agriculture crisis.'},
    {y:2100,c:'🌡️',d:'+3.5°C avg temp. Parts of India uninhabitable.'},
  ];
  root.innerHTML=`<div class="game-ui"><h2>Climate Change India</h2>
    <p class="game-sub">Slider se future dekho.</p>
    <div class="year-big"><div class="yr" id="yr" style="font-size:56px">2026</div></div>
    <input type="range" class="slider" id="s" min="2026" max="2100" value="2026">
    <div id="fc"></div></div>`;
  function near(y){let b=S[0];for(const k of S)if(Math.abs(k.y-y)<Math.abs(b.y-y))b=k;return b;}
  function upd(){
    const y=+$('#s',root).value;$('#yr',root).textContent=y;
    const p=near(y);
    $('#fc',root).innerHTML=`<div class="result-box" style="text-align:center">
      <div style="font-size:48px">${p.c}</div>
      <h3 style="margin:10px 0">${p.y}</h3>
      <p style="color:var(--muted);font-size:14px;line-height:1.6">${p.d}</p></div>`;
  }
  $('#s',root).oninput=upd;upd();
};
