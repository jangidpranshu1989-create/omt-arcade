const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rand(0,a.length-1)];
const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(v=>v[1]);

function fmtINR(n){
  if(n>=1e12)return'₹'+(n/1e12).toFixed(2)+' Lakh Cr';
  if(n>=1e7)return'₹'+(n/1e7).toFixed(2)+' Cr';
  if(n>=1e5)return'₹'+(n/1e5).toFixed(2)+' L';
  if(n>=1e3)return'₹'+(n/1e3).toFixed(1)+'K';
  return'₹'+Math.round(n).toLocaleString('en-IN');
}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2000);}

const GAMES=[
  {id:'spend-crorepati',title:'Spend Crorepati Money',icon:'💸',tag:'Original',cat:'Desi',desc:'Adani/Ambani ka paisa udao.'},
  {id:'password-chaos',title:'Password Chaos Desi',icon:'🔐',tag:'Original',cat:'Desi',desc:'35 desi rules ka password.'},
  {id:'perfect-circle',title:'Perfect Circle Love Score',icon:'⭕',tag:'Original',cat:'Desi',desc:'Circle banao, love score jaano.'},
  {id:'hand-cricket',title:'Hand Cricket vs AI',icon:'🏏',tag:'Original',cat:'Desi',desc:'Classic desi hand cricket.'},
  {id:'kbc-quiz',title:'KBC Quiz',icon:'🎯',tag:'Original',cat:'Desi',desc:'KBC style questions.'},
  {id:'trolley-desi',title:'Trolley Problems Desi',icon:'🚋',tag:'Original',cat:'Desi',desc:'Indian moral dilemmas.'},
  {id:'antakshari',title:'Antakshari',icon:'🎵',tag:'Original',cat:'Desi',desc:'AI ke saath gaana.'},
  {id:'truth-dare',title:'Truth or Dare Desi',icon:'🎭',tag:'Original',cat:'Desi',desc:'Indian truth or dare.'},
  {id:'ipl-auction',title:'IPL Auction',icon:'🏆',tag:'Original',cat:'Desi',desc:'Dream IPL team banao.'},
  {id:'tambola',title:'Tambola / Housie',icon:'🎰',tag:'Original',cat:'Desi',desc:'Number caller game.'},
  {id:'deep-india',title:'Deep India',icon:'🌊',tag:'Original',cat:'Science',desc:'Ocean depth journey.'},
  {id:'asteroid-india',title:'Asteroid India',icon:'☄️',tag:'Original',cat:'Science',desc:'India par asteroid drop.'},
  {id:'space-exploration',title:'Space Exploration',icon:'🚀',tag:'Original',cat:'Science',desc:'Earth se universe tak.'},
  {id:'future-vision',title:'See The Future',icon:'🔮',tag:'Original',cat:'Science',desc:'2026-2100 predictions.'},
  {id:'history-timeline',title:'History Timeline',icon:'🦕',tag:'Original',cat:'Science',desc:'Big Bang se 2026 tak.'},
  {id:'isro-missions',title:'ISRO Missions',icon:'🛰️',tag:'Original',cat:'Science',desc:'India space missions.'},
  {id:'size-of-india',title:'Size of India',icon:'📏',tag:'Original',cat:'Science',desc:'Monuments ka scale.'},
  {id:'human-body',title:'Human Body Stats',icon:'🧬',tag:'Original',cat:'Science',desc:'Age daalo, stats jaano.'},
  {id:'earthquake-sim',title:'Earthquake Simulator',icon:'🌋',tag:'Original',cat:'Science',desc:'Seismic zones.'},
  {id:'climate-india',title:'Climate Change India',icon:'🌡️',tag:'Original',cat:'Science',desc:'2050 ka India.'},
  {id:'2048',title:'2048',icon:'🔢',tag:'Puzzle',cat:'Puzzle',desc:'Sliding tile puzzle.'},
  {id:'snake',title:'Snake',icon:'🐍',tag:'Puzzle',cat:'Puzzle',desc:'Classic snake game.'},
  {id:'memory-match',title:'Memory Match',icon:'🧠',tag:'Puzzle',cat:'Puzzle',desc:'Pair matching.'},
  {id:'reaction-time',title:'Reaction Timer',icon:'⚡',tag:'Puzzle',cat:'Puzzle',desc:'Test your reflexes.'},
  {id:'tictactoe',title:'Tic Tac Toe',icon:'❌',tag:'Puzzle',cat:'Puzzle',desc:'AI ke against.'},
  {id:'tic-ai',title:'Beat The AI',icon:'🤖',tag:'Puzzle',cat:'Puzzle',desc:'Number guessing.'},
  {id:'math-sprint',title:'Math Sprint',icon:'➗',tag:'Puzzle',cat:'Puzzle',desc:'60 second challenge.'},
  {id:'word-scramble',title:'Word Scramble',icon:'🔤',tag:'Puzzle',cat:'Puzzle',desc:'Indian words.'},
  {id:'simon-says',title:'Simon Says',icon:'🎨',tag:'Puzzle',cat:'Puzzle',desc:'Color memory.'},
  {id:'typing-test',title:'Typing Test',icon:'⌨️',tag:'Puzzle',cat:'Puzzle',desc:'Speed test.'},
  {id:'rangoli',title:'Rangoli Maker',icon:'🎨',tag:'Creative',cat:'Creative',desc:'Digital rangoli.'},
  {id:'mehndi',title:'Mehndi Designer',icon:'🖐️',tag:'Creative',cat:'Creative',desc:'Hand mehndi design.'},
  {id:'meme-maker',title:'Desi Meme Maker',icon:'😂',tag:'Creative',cat:'Creative',desc:'Meme banao.'},
  {id:'dialogue-gen',title:'Bollywood Dialogue Gen',icon:'🎬',tag:'Creative',cat:'Creative',desc:'Random dialogues.'},
  {id:'food-combiner',title:'Indian Food Combiner',icon:'🍛',tag:'Creative',cat:'Creative',desc:'Weird combos.'},
  {id:'auto-custom',title:'Auto Customizer',icon:'🛺',tag:'Creative',cat:'Creative',desc:'Apna auto banao.'},
  {id:'truck-art',title:'Truck Art Designer',icon:'🚚',tag:'Creative',cat:'Creative',desc:'Indian truck art.'},
  {id:'pixel-paint',title:'Pixel Painter',icon:'🖌️',tag:'Creative',cat:'Creative',desc:'Canvas painting.'},
  {id:'color-palette',title:'Desi Color Palette',icon:'🌈',tag:'Creative',cat:'Creative',desc:'Indian colors.'},
  {id:'kite-fly',title:'Kite Flying',icon:'🪁',tag:'Creative',cat:'Creative',desc:'Kite simulator.'},
  {id:'billionaire-rank',title:'Billionaire Ranking',icon:'💰',tag:'Life',cat:'Life',desc:'Indian billionaires.'},
  {id:'tax-calc',title:'Tax Calculator',icon:'📊',tag:'Life',cat:'Life',desc:'Old vs new regime.'},
  {id:'upi-sim',title:'UPI Simulator',icon:'📱',tag:'Life',cat:'Life',desc:'Fake UPI payment.'},
  {id:'gold-bitcoin',title:'Gold vs Bitcoin',icon:'🪙',tag:'Life',cat:'Life',desc:'Investment compare.'},
  {id:'startup-sim',title:'Startup Simulator',icon:'🚀',tag:'Life',cat:'Life',desc:'Startup banao.'},
  {id:'never-have',title:'Never Have I Ever',icon:'🙈',tag:'Life',cat:'Life',desc:'Desi party game.'},
  {id:'spin-bottle',title:'Spin the Bottle',icon:'🍾',tag:'Life',cat:'Life',desc:'Virtual spin.'},
  {id:'dumb-charades',title:'Dumb Charades',icon:'🎪',tag:'Life',cat:'Life',desc:'Word prompts.'},
  {id:'food-tycoon',title:'Street Food Tycoon',icon:'🌮',tag:'Life',cat:'Life',desc:'Khana becho.'},
  {id:'train-delay',title:'Train Delay Simulator',icon:'🚂',tag:'Life',cat:'Life',desc:'Indian Railways.'},
];

const R={};

let filterCat='All', searchQ='';
function renderFilters(){
  const cats=['All',...new Set(GAMES.map(g=>g.cat))];
  $('#filters').innerHTML=cats.map(c=>`<button class="chip${c===filterCat?' active':''}" data-c="${c}">${c}</button>`).join('');
  $('#filters').onclick=e=>{const b=e.target.closest('.chip');if(!b)return;
    filterCat=b.dataset.c;renderFilters();renderGrid();};
}
function renderGrid(){
  const q=searchQ.trim().toLowerCase();
  const list=GAMES.filter(g=>{
    if(filterCat!=='All'&&g.cat!==filterCat)return false;
    if(q&&!(g.title.toLowerCase().includes(q)||g.desc.toLowerCase().includes(q)))return false;
    return true;
  });
  if(!list.length){$('#grid').innerHTML=`<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--muted);font-weight:600">Kuch nahi mila 😅</div>`;return;}
  const frag=document.createDocumentFragment();
  list.forEach((g,i)=>{
    const c=document.createElement('div');
    c.className='card';c.dataset.id=g.id;
    c.style.animationDelay=Math.min(i*20,500)+'ms';
    c.innerHTML=`<div class="card-top"><div class="emoji">${g.icon}</div>
      <div class="tag original">${g.tag}</div></div>
      <h3>${g.title}</h3><p>${g.desc}</p>
      <div class="card-bottom"><span>PLAY NOW</span><span>▶</span></div>`;
    frag.appendChild(c);
  });
  $('#grid').innerHTML='';$('#grid').appendChild(frag);
  $('#game-count').textContent=GAMES.length;
}
$('#search').oninput=e=>{searchQ=e.target.value;renderGrid();};

const modal=$('#modal'),mBody=$('#m-body'),mTitle=$('#m-title');
function openGame(g){
  mTitle.textContent=g.title;
  modal.classList.add('active');
  document.body.style.overflow='hidden';
  mBody.innerHTML='';
  const fn=R[g.id];
  if(fn)try{fn(mBody);}catch(e){mBody.innerHTML=`<div class="game-ui"><h2>Error</h2><p>${e.message}</p></div>`;}
  else mBody.innerHTML=`<div class="game-ui"><h2>Coming soon</h2></div>`;
}
function closeModal(){
  modal.classList.remove('active');
  document.body.style.overflow='';
  setTimeout(()=>{mBody.innerHTML='';},300);
}
$('#close-btn').onclick=closeModal;
modal.addEventListener('click',e=>{if(e.target===modal)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('active'))closeModal();});
$('#grid').onclick=e=>{const c=e.target.closest('.card');if(!c)return;
  const g=GAMES.find(x=>x.id===c.dataset.id);if(g)openGame(g);};

const TK='omt_theme';
function applyTheme(t){document.documentElement.dataset.theme=t;
  $('#theme-toggle').textContent=t==='dark'?'☀️':'🌙';
  document.querySelector('meta[name=theme-color]').content=t==='dark'?'#08090a':'#f7f7f8';}
applyTheme(localStorage.getItem(TK)||'light');
$('#theme-toggle').onclick=()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';
  localStorage.setItem(TK,n);applyTheme(n);};

renderFilters();
renderGrid();
setTimeout(()=>$('#loader').classList.add('done'),600);
window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('done'),300));
