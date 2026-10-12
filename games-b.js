/* ============ PUZZLE + CREATIVE + LIFE GAMES — Part B ============ */

R['2048']=root=>{
  let board,score,best;
  function init(){board=Array(16).fill(0);score=0;best=+localStorage.getItem('omt2048')||0;add();add();}
  function add(){const e=board.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(!e.length)return;
    board[pick(e)]=Math.random()<0.9?2:4;}
  function draw(){
    const colors={0:'var(--surface)',2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',
      64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
    $('#board',root).innerHTML=board.map(v=>`<div class="cell" style="background:${colors[v]||'#3c3a32'};
      color:${v>4?'#fff':'#776e65'};font-size:${v>=1000?'16px':'20px'}">${v||''}</div>`).join('');
    $('#sc',root).textContent=score;$('#best',root).textContent=Math.max(best,score);
  }
  function move(dir){
    let moved=false;
    for(let i=0;i<4;i++){
      let line=[];
      for(let j=0;j<4;j++){
        const idx=dir<2?i*4+j:j*4+i;
        if(board[idx])line.push(board[idx]);
      }
      if(dir===1||dir===3)line.reverse();
      const m=[];
      for(let k=0;k<line.length;k++){
        if(line[k]===line[k+1]){m.push(line[k]*2);score+=line[k]*2;k++;}
        else m.push(line[k]);
      }
      while(m.length<4)m.push(0);
      if(dir===1||dir===3)m.reverse();
      for(let j=0;j<4;j++){
        const idx=dir<2?i*4+j:j*4+i;
        if(board[idx]!==m[j])moved=true;
        board[idx]=m[j];
      }
    }
    if(moved){add();draw();if(score>best){best=score;localStorage.setItem('omt2048',best);}}
  }
  root.innerHTML=`<div class="game-ui"><h2>2048</h2>
    <p class="game-sub">Arrow keys ya swipe se tiles merge karo.</p>
    <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-weight:900;font-size:14px">
      <span>Score: <span id="sc">0</span></span><span>Best: <span id="best">0</span></span></div>
    <div class="g2048" id="board"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">New Game</button></div></div>`;
  init();draw();
  document.addEventListener('keydown',function h(e){
    if(!document.body.contains(root)){document.removeEventListener('keydown',h);return;}
    const m={ArrowUp:0,ArrowRight:1,ArrowDown:2,ArrowLeft:3};
    if(m[e.key]!==undefined){e.preventDefault();move(m[e.key]);}
  });
  let sx,sy;
  $('#board',root).addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;});
  $('#board',root).addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:3);else move(dy>0?2:0);
  });
  $('#rst',root).onclick=()=>{init();draw();};
};

R['snake']=root=>{
  let snake,dir,food,score,loop;
  root.innerHTML=`<div class="game-ui"><h2>Snake</h2>
    <p class="game-sub">Swipe ya arrow keys.</p>
    <div style="display:flex;justify-content:space-between;font-weight:900;font-size:14px;margin-bottom:10px">
      <span>Score: <span id="sc">0</span></span><span>Best: <span id="bs">0</span></span></div>
    <canvas id="cv" width="320" height="320" style="width:100%;max-width:400px;aspect-ratio:1;
      border-radius:16px;background:var(--surface);border:1px solid var(--border);display:block;margin:0 auto"></canvas>
    <div class="btn-row"><button class="btn secondary" id="rst">Restart</button></div></div>`;
  const cv=$('#cv',root),ctx=cv.getContext('2d'),N=16,S=20;
  function init(){snake=[{x:8,y:8}];dir={x:1,y:0};food=newFood();score=0;
    $('#sc',root).textContent=0;$('#bs',root).textContent=+localStorage.getItem('omtsnake')||0;
    clearInterval(loop);loop=setInterval(tick,140);}
  function newFood(){let f;do{f={x:rand(0,N-1),y:rand(0,N-1)};}
    while(snake.some(s=>s.x===f.x&&s.y===f.y));return f;}
  function tick(){
    const head={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(head.x<0||head.x>=N||head.y<0||head.y>=N||snake.some(s=>s.x===head.x&&s.y===head.y)){
      clearInterval(loop);
      const b=+localStorage.getItem('omtsnake')||0;
      if(score>b)localStorage.setItem('omtsnake',score);
      toast('Game Over! Score: '+score);return;}
    snake.unshift(head);
    if(head.x===food.x&&head.y===food.y){score++;$('#sc',root).textContent=score;food=newFood();}
    else snake.pop();
    draw();
  }
  function draw(){
    ctx.fillStyle=getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0,0,320,320);
    ctx.fillStyle='#ef4444';ctx.fillRect(food.x*S,food.y*S,S-2,S-2);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--text')||'#000';
    snake.forEach((s,i)=>{ctx.globalAlpha=i===0?1:0.75;ctx.fillRect(s.x*S+1,s.y*S+1,S-2,S-2);});
    ctx.globalAlpha=1;
  }
  document.addEventListener('keydown',function h(e){
    if(!document.body.contains(root)){document.removeEventListener('keydown',h);return;}
    const m={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};
    if(m[e.key]){e.preventDefault();const n=m[e.key];
      if(n.x!==-dir.x||n.y!==-dir.y)dir=n;}
  });
  let sx,sy;
  cv.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;});
  cv.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;
    let n;if(Math.abs(dx)>Math.abs(dy))n=dx>0?{x:1,y:0}:{x:-1,y:0};else n=dy>0?{x:0,y:1}:{x:0,y:-1};
    if(n.x!==-dir.x||n.y!==-dir.y)dir=n;
  });
  $('#rst',root).onclick=init;
  init();
};

R['memory-match']=root=>{
  const E=['🍛','🏏','🐘','🕌','🌺','🪔','🚂','🛺'];
  let cards,flipped,matched,moves;
  function init(){
    cards=shuffle([...E,...E]);flipped=[];matched=new Set();moves=0;
    $('#mv',root).textContent=0;render();
  }
  function render(){
    $('#board',root).innerHTML=cards.map((e,i)=>`<div class="mcard${matched.has(i)||flipped.includes(i)?' flipped':''}${matched.has(i)?' matched':''}" data-i="${i}"><span>${e}</span></div>`).join('');
  }
  root.innerHTML=`<div class="game-ui"><h2>Memory Match</h2>
    <p class="game-sub">Flip karke pairs banao.</p>
    <div style="text-align:center;font-weight:900;font-size:14px;margin-bottom:12px">Moves: <span id="mv">0</span></div>
    <div class="memory" id="board"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">Restart</button></div></div>`;
  init();
  $('#board',root).onclick=e=>{
    const c=e.target.closest('.mcard');if(!c)return;
    const i=+c.dataset.i;
    if(flipped.includes(i)||matched.has(i)||flipped.length>=2)return;
    flipped.push(i);render();
    if(flipped.length===2){
      moves++;$('#mv',root).textContent=moves;
      setTimeout(()=>{
        const [a,b]=flipped;
        if(cards[a]===cards[b]){matched.add(a);matched.add(b);}
        flipped=[];render();
        if(matched.size===cards.length)toast('🎉 Won in '+moves+' moves!');
      },700);
    }
  };
  $('#rst',root).onclick=init;
};

R['reaction-time']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Reaction Timer</h2>
    <p class="game-sub">Green hone par tap karo.</p>
    <div class="reaction-box start" id="box">Tap to start</div>
    <div id="res"></div></div>`;
  let state='start',t0,times=[];
  const box=$('#box',root);
  box.onclick=()=>{
    if(state==='start'){
      state='waiting';box.className='reaction-box waiting';box.textContent='Wait for green...';
      const delay=rand(1500,4000);
      setTimeout(()=>{if(state!=='waiting')return;state='ready';box.className='reaction-box ready';
        box.textContent='TAP NOW!';t0=performance.now();},delay);
    } else if(state==='ready'){
      const ms=Math.round(performance.now()-t0);times.push(ms);
      state='start';box.className='reaction-box start';box.textContent='Tap to start';
      const best=Math.min(...times),avg=Math.round(times.reduce((a,b)=>a+b,0)/times.length);
      const rating=ms<200?'⚡ Superhuman!':ms<250?'🔥 Excellent':ms<300?'👍 Good':ms<400?'😐 Average':'🐢 Slow';
      $('#res',root).innerHTML=`<div class="result-box">
        <div class="stat"><div class="stat-label">Last</div><div class="stat-val">${ms} ms</div></div>
        <div class="stat"><div class="stat-label">Best</div><div class="stat-val">${best} ms</div></div>
        <div class="stat"><div class="stat-label">Average</div><div class="stat-val">${avg} ms</div></div>
        <div class="stat"><div class="stat-label">Rating</div><div style="font-size:15px;font-weight:800;margin-top:4px">${rating}</div></div>
      </div>`;
    } else if(state==='waiting'){
      state='start';box.className='reaction-box start';box.textContent='Too early! Tap to retry';
    }
  };
};

R['tictactoe']=root=>{
  let b,turn,over;
  const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function init(){b=Array(9).fill('');turn='X';over=false;render();}
  function winner(){
    for(const w of WINS)if(b[w[0]]&&b[w[0]]===b[w[1]]&&b[w[1]]===b[w[2]])return{w,who:b[w[0]]};
    return null;
  }
  function render(){
    $('#board',root).innerHTML=b.map((v,i)=>`<button data-i="${i}">${v}</button>`).join('');
    $('#status',root).textContent=over?'Game over':`Turn: ${turn}`;
  }
  function aiMove(){
    const empty=b.map((v,i)=>v?null:i).filter(i=>i!==null);
    if(!empty.length)return;
    for(const i of empty){b[i]='O';if(winner())return;}
    for(const i of empty){b[i]='X';const w=winner();b[i]='';
      if(w){b[i]='O';return;}}
    if(!b[4]){b[4]='O';return;}
    b[pick(empty)]='O';
  }
  root.innerHTML=`<div class="game-ui"><h2>Tic Tac Toe</h2>
    <p class="game-sub">X tum ho, AI O.</p>
    <div style="text-align:center;font-weight:900;margin-bottom:14px" id="status">Turn: X</div>
    <div class="ttt" id="board"></div>
    <div class="btn-row"><button class="btn secondary" id="rst">New Game</button></div></div>`;
  init();
  $('#board',root).onclick=e=>{
    const btn=e.target.closest('button');if(!btn||over)return;
    const i=+btn.dataset.i;if(b[i]||turn!=='X')return;
    b[i]='X';
    let w=winner();
    if(w){over=true;render();highlight(w.w);toast(w.who==='X'?'🎉 You won!':'AI won');return;}
    if(b.every(v=>v)){over=true;render();toast('Draw!');return;}
    turn='O';render();
    setTimeout(()=>{aiMove();w=winner();
      if(w){over=true;render();highlight(w.w);toast('AI won 😢');return;}
      if(b.every(v=>v)){over=true;render();toast('Draw!');return;}
      turn='X';render();},300);
  };
  function highlight(w){$$('#board button',root).forEach((b,i)=>{if(w.includes(i))b.classList.add('win');});}
  $('#rst',root).onclick=init;
};

R['tic-ai']=root=>{
  let secret,tries,low,high;
  function init(){secret=rand(1,100);tries=0;low=1;high=100;
    $('#hint',root).textContent='1–100';$('#tr',root).textContent=0;
    $('#hist',root).innerHTML='';$('#guess',root).value='';$('#go',root).disabled=false;}
  root.innerHTML=`<div class="game-ui"><h2>Beat The AI</h2>
    <p class="game-sub">1-100 socha hai. Guess karo.</p>
    <div class="stat"><div class="stat-label">Range</div><div class="stat-val" id="hint">1–100</div></div>
    <div class="stat"><div class="stat-label">Tries</div><div class="stat-val" id="tr">0</div></div>
    <input class="input" id="guess" type="number" placeholder="Enter guess" min="1" max="100">
    <div class="btn-row"><button class="btn" id="go">Guess</button>
      <button class="btn secondary" id="rst">New Game</button></div>
    <div id="hist" style="margin-top:14px"></div></div>`;
  function log(msg,cls=''){
    const d=document.createElement('div');
    d.style.cssText='padding:10px 14px;border-radius:12px;background:var(--surface);border:1px solid var(--border);font-size:13px;font-weight:600;margin-bottom:6px';
    if(cls)d.style.background=`color-mix(in srgb,var(--${cls}) 15%,var(--surface))`;
    d.textContent=msg;$('#hist',root).appendChild(d);
  }
  $('#go',root).onclick=()=>{
    const g=+$('#guess',root).value;
    if(!g||g<1||g>100){toast('1-100 ke beech');return;}
    tries++;$('#tr',root).textContent=tries;
    if(g===secret){log(`🎉 Correct! ${secret} in ${tries} tries!`,'success');
      $('#go',root).disabled=true;return;}
    if(g<secret){log(`${g} — Too LOW`);low=Math.max(low,g+1);}
    else{log(`${g} — Too HIGH`);high=Math.min(high,g-1);}
    $('#hint',root).textContent=`Range: ${low}–${high}`;
    $('#guess',root).value='';$('#guess',root).focus();
  };
  $('#guess',root).onkeydown=e=>{if(e.key==='Enter')$('#go',root).click();};
  $('#rst',root).onclick=init;
  init();
};

R['math-sprint']=root=>{
  let score,time,ans,timer;
  root.innerHTML=`<div class="game-ui"><h2>Math Sprint</h2>
    <p class="game-sub">60 second mein max solve karo.</p>
    <div style="display:flex;justify-content:space-between;font-weight:900;font-size:14px;margin-bottom:12px">
      <span>Score: <span id="sc">0</span></span><span>Time: <span id="tm">60</span>s</span></div>
    <div id="box">
      <div class="stat" style="text-align:center;padding:24px">
        <div class="stat-label">Solve</div>
        <div class="stat-val" id="q" style="font-size:32px">—</div></div>
      <input class="input" id="inp" type="number" placeholder="Answer">
      <div class="btn-row"><button class="btn" id="go">Submit</button></div>
    </div></div>`;
  function init(){score=0;time=60;next();upd();
    clearInterval(timer);timer=setInterval(()=>{time--;
      if(time<=0){clearInterval(timer);end();return;}upd();},1000);}
  function upd(){$('#sc',root).textContent=score;$('#tm',root).textContent=time;}
  function next(){
    const ops=['+','-','×'];const o=pick(ops);
    let a=rand(1,20),b=rand(1,20);
    if(o==='×'){a=rand(2,12);b=rand(2,12);}
    if(o==='-'&&b>a)[a,b]=[b,a];
    $('#q',root).textContent=`${a} ${o} ${b}`;
    ans=o==='+'?a+b:o==='-'?a-b:a*b;
    $('#inp',root).value='';$('#inp',root).focus();
  }
  function end(){
    $('#box',root).innerHTML=`<div class="result-box" style="text-align:center">
      <h3>Time up!</h3><p style="margin:10px 0">Score: ${score}</p>
      <p style="color:var(--muted);font-size:13px">
        ${score>=20?'🧠 Math genius!':score>=10?'👏 Acha kiya!':'💪 Practice karo'}</p></div>`;
  }
  function submit(){
    if(!$('#box',root).querySelector('#inp'))return;
    if(+$('#inp',root).value===ans){score++;upd();next();}
    else{$('#inp',root).value='';toast('Galat!');}
  }
  $('#go',root).onclick=submit;
  $('#inp',root).onkeydown=e=>{if(e.key==='Enter')submit();};
  init();
};

R['word-scramble']=root=>{
  const W=['BOLLYWOOD','CRICKET','SAMOSA','RANGOLI','DIWALI','CHAI','TANDOOR','MAHARAJA','KAJURAHO','AYURVEDA','MUMBAI','CHENNAI','HIMALAYA','GANGES','TAJMAHAL'];
  let score,word;
  function next(){
    word=pick(W);
    let s;do{s=shuffle(word.split('')).join('');}while(s===word);
    $('#word',root).textContent=s.split('').join(' ');
    $('#inp',root).value='';$('#inp',root).focus();
  }
  root.innerHTML=`<div class="game-ui"><h2>Word Scramble</h2>
    <p class="game-sub">Letters ko correct order mein lagao.</p>
    <div style="font-weight:900;font-size:14px;margin-bottom:12px">Score: <span id="sc">0</span></div>
    <div class="stat" style="text-align:center;padding:30px">
      <div class="stat-label">Unscramble</div>
      <div class="stat-val" id="word" style="font-size:24px;letter-spacing:6px">—</div></div>
    <input class="input" id="inp" placeholder="Answer" autocomplete="off" autocapitalize="characters">
    <div class="btn-row"><button class="btn" id="go">Submit</button>
      <button class="btn secondary" id="skip">Skip</button></div></div>`;
  score=0;
  $('#go',root).onclick=()=>{
    if($('#inp',root).value.toUpperCase()===word){score++;$('#sc',root).textContent=score;toast('✅ Correct!');next();}
    else toast('Galat! Dobara try karo');
  };
  $('#inp',root).onkeydown=e=>{if(e.key==='Enter')$('#go',root).click();};
  $('#skip',root).onclick=()=>{toast('Answer: '+word);next();};
  next();
};

R['simon-says']=root=>{
  const COLORS=['#ef4444','#3b82f6','#10b981','#f59e0b'];
  let seq,input,playing,round;
  function init(){seq=[];input=[];round=0;playing=false;
    $('#sc',root).textContent=0;$('#msg',root).textContent='Tap Start';}
  root.innerHTML=`<div class="game-ui"><h2>Simon Says</h2>
    <p class="game-sub">Colors ka pattern yaad karo.</p>
    <div style="display:flex;justify-content:space-between;font-weight:900;font-size:14px;margin-bottom:12px">
      <span>Round: <span id="sc">0</span></span><span id="msg">Tap Start</span></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:340px;margin:0 auto;aspect-ratio:1">
      ${COLORS.map((c,i)=>`<button data-i="${i}" style="background:${c};border-radius:16px;opacity:.35;transition:opacity .2s"></button>`).join('')}
    </div>
    <div class="btn-row"><button class="btn" id="start">Start</button>
      <button class="btn secondary" id="rst">Reset</button></div></div>`;
  function flash(i,time=400){
    return new Promise(res=>{
      const btn=$$('button',root).filter(b=>b.dataset.i)[i];
      if(!btn){res();return;}
      btn.style.opacity='1';
      setTimeout(()=>{btn.style.opacity='.35';res();},time);
    });
  }
  async function play(){
    playing=false;
    for(const i of seq){await flash(i);await new Promise(r=>setTimeout(r,180));}
    playing=true;$('#msg',root).textContent='Your turn';
  }
  async function nextRound(){
    seq.push(rand(0,3));input=[];round++;$('#sc',root).textContent=round;
    $('#msg',root).textContent='Watch...';
    await new Promise(r=>setTimeout(r,500));
    play();
  }
  root.addEventListener('click',async e=>{
    const b=e.target.closest('[data-i]');if(!b||!playing)return;
    const i=+b.dataset.i;
    await flash(i,200);
    input.push(i);
    if(input[input.length-1]!==seq[input.length-1]){
      $('#msg',root).textContent='Game over!';playing=false;
      toast('Game over! Round: '+round);return;
    }
    if(input.length===seq.length){playing=false;setTimeout(nextRound,600);}
  });
  $('#start',root).onclick=()=>{init();nextRound();};
  $('#rst',root).onclick=init;
  init();
};

R['typing-test']=root=>{
  const SENT=[
    'India is a land of diversity and unity in every corner.',
    'Cricket is not just a game it is an emotion in India.',
    'The Taj Mahal is a symbol of eternal love and beauty.',
    'Chai and samosa are the perfect combination for any evening.',
    'Bollywood movies are known for their dance and drama.',
    'Mumbai local trains are the lifeline of the city.',
    'The Himalayas stand tall guarding the northern borders.',
  ];
  let sentence,started,t0,timer;
  function init(){
    sentence=pick(SENT);started=false;
    $('#text',root).innerHTML=sentence.split('').map(c=>`<span>${c}</span>`).join('');
    $('#inp',root).value='';$('#wpm',root).textContent='0';$('#acc',root).textContent='100%';
    $('#inp',root).disabled=false;$('#inp',root).focus();
    clearInterval(timer);
  }
  root.innerHTML=`<div class="game-ui"><h2>Typing Test</h2>
    <p class="game-sub">Sentence type karo.</p>
    <div style="display:flex;justify-content:space-between;font-weight:900;font-size:14px;margin-bottom:12px">
      <span>WPM: <span id="wpm">0</span></span><span>Accuracy: <span id="acc">100%</span></span></div>
    <div class="stat" style="font-family:ui-monospace,monospace;font-size:15px;line-height:1.7;padding:16px" id="text"></div>
    <input class="input" id="inp" placeholder="Yahan type karo..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
    <div class="btn-row"><button class="btn secondary" id="rst">New Sentence</button></div></div>`;
  $('#inp',root).addEventListener('input',()=>{
    if(!started){started=true;t0=performance.now();
      timer=setInterval(()=>{
        const elapsed=(performance.now()-t0)/1000;
        const typed=$('#inp',root).value.length;
        const wpm=Math.round((typed/5)/(elapsed/60));
        $('#wpm',root).textContent=isFinite(wpm)&&wpm>=0?wpm:0;
      },200);}
    const val=$('#inp',root).value;
    const spans=$$('#text span',root);
    let correct=0;
    spans.forEach((s,i)=>{
      s.style.color='';s.style.background='';
      if(i<val.length){
        if(val[i]===sentence[i]){s.style.color='var(--success)';correct++;}
        else{s.style.color='var(--danger)';s.style.background='color-mix(in srgb,var(--danger) 20%,transparent)';}
      }
    });
    const acc=val.length?Math.round((correct/val.length)*100):100;
    $('#acc',root).textContent=acc+'%';
    if(val===sentence){clearInterval(timer);$('#inp',root).disabled=true;toast('🎉 Done!');}
  });
  $('#rst',root).onclick=init;
  init();
};

R['rangoli']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Rangoli Maker</h2>
    <p class="game-sub">Symmetric rangoli banao. Tap ya drag karo.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px" id="pal">
      ${['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff'].map(c=>
        `<button data-c="${c}" style="width:32px;height:32px;border-radius:50%;background:${c};border:2px solid var(--border)"></button>`).join('')}
    </div>
    <canvas id="cv" width="400" height="400" style="width:100%;aspect-ratio:1;border-radius:20px;
      background:var(--surface);border:1px solid var(--border);touch-action:none;display:block"></canvas>
    <div class="btn-row"><button class="btn secondary" id="clr">Clear</button>
      <button class="btn" id="save">Save</button></div></div>`;
  const cv=$('#cv',root),ctx=cv.getContext('2d');
  let color='#ef4444',drawing=false,dpr=Math.min(devicePixelRatio||1,2);
  cv.width=400*dpr;cv.height=400*dpr;ctx.scale(dpr,dpr);
  ctx.fillStyle=getComputedStyle(document.body).backgroundColor;ctx.fillRect(0,0,400,400);
  function point(x,y){
    const cx=200,cy=200;const dx=x-cx,dy=y-cy;
    for(let i=0;i<8;i++){
      const a=Math.PI/4*i;
      const nx=cx+dx*Math.cos(a)-dy*Math.sin(a);
      const ny=cy+dx*Math.sin(a)+dy*Math.cos(a);
      ctx.fillStyle=color;ctx.beginPath();ctx.arc(nx,ny,6,0,Math.PI*2);ctx.fill();
    }
  }
  function pos(e){const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;
    return{x:(t.clientX-r.left)*(400/r.width),y:(t.clientY-r.top)*(400/r.height)};}
  cv.addEventListener('mousedown',e=>{drawing=true;const p=pos(e);point(p.x,p.y);});
  cv.addEventListener('mousemove',e=>{if(drawing){const p=pos(e);point(p.x,p.y);}});
  cv.addEventListener('mouseup',()=>drawing=false);
  cv.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;const p=pos(e);point(p.x,p.y);},{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();if(drawing){const p=pos(e);point(p.x,p.y);}},{passive:false});
  cv.addEventListener('touchend',()=>drawing=false);
  $('#pal',root).onclick=e=>{const b=e.target.closest('[data-c]');if(b)color=b.dataset.c;};
  $('#clr',root).onclick=()=>{ctx.fillStyle=getComputedStyle(document.body).backgroundColor;ctx.fillRect(0,0,400,400);};
  $('#save',root).onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL();a.download='rangoli.png';a.click();toast('Saved!');};
};

R['mehndi']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Mehndi Designer</h2>
    <p class="game-sub">Haath par mehndi design karo.</p>
    <canvas id="cv" width="400" height="500" style="width:100%;aspect-ratio:4/5;border-radius:20px;
      background:#fde2c8;touch-action:none;display:block"></canvas>
    <div class="btn-row"><button class="btn secondary" id="clr">Clear</button>
      <button class="btn" id="save">Save</button></div></div>`;
  const cv=$('#cv',root),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
  cv.width=400*dpr;cv.height=500*dpr;ctx.scale(dpr,dpr);
  function reset(){
    ctx.fillStyle='#fde2c8';ctx.fillRect(0,0,400,500);
    ctx.strokeStyle='rgba(139,58,30,0.2)';ctx.lineWidth=1.5;ctx.beginPath();
    ctx.ellipse(200,280,110,150,0,0,Math.PI*2);ctx.stroke();
  }
  reset();
  let drawing=false;
  function pos(e){const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;
    return{x:(t.clientX-r.left)*(400/r.width),y:(t.clientY-r.top)*(500/r.height)};}
  function dot(x,y){
    ctx.fillStyle='#8b3a1e';
    ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(400-x,y,3,0,Math.PI*2);ctx.fill();
  }
  cv.addEventListener('mousedown',e=>{drawing=true;const p=pos(e);dot(p.x,p.y);});
  cv.addEventListener('mousemove',e=>{if(drawing){const p=pos(e);dot(p.x,p.y);}});
  cv.addEventListener('mouseup',()=>drawing=false);
  cv.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;const p=pos(e);dot(p.x,p.y);},{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();if(drawing){const p=pos(e);dot(p.x,p.y);}},{passive:false});
  cv.addEventListener('touchend',()=>drawing=false);
  $('#clr',root).onclick=reset;
  $('#save',root).onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL();a.download='mehndi.png';a.click();};
};

R['meme-maker']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Desi Meme Maker</h2>
    <p class="game-sub">Text + emoji se meme banao.</p>
    <canvas id="cv" width="400" height="400" style="width:100%;aspect-ratio:1;border-radius:20px;
      background:#1e293b;display:block"></canvas>
    <input class="input" id="top" placeholder="Top text" style="margin-top:12px">
    <input class="input" id="bot" placeholder="Bottom text" style="margin-top:8px">
    <div class="btn-row"><button class="btn" id="render">Render</button>
      <button class="btn secondary" id="save">Save</button></div></div>`;
  const cv=$('#cv',root),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
  cv.width=400*dpr;cv.height=400*dpr;ctx.scale(dpr,dpr);
  function render(){
    const bg=ctx.createLinearGradient(0,0,400,400);
    bg.addColorStop(0,'#1e293b');bg.addColorStop(1,'#0f172a');
    ctx.fillStyle=bg;ctx.fillRect(0,0,400,400);
    ctx.textAlign='center';
    const t=$('#top',root).value.toUpperCase(),b=$('#bot',root).value.toUpperCase();
    ctx.font='900 32px Impact, sans-serif';ctx.fillStyle='#fff';
    ctx.strokeStyle='#000';ctx.lineWidth=5;
    if(t){ctx.strokeText(t,200,60);ctx.fillText(t,200,60);}
    if(b){ctx.strokeText(b,200,360);ctx.fillText(b,200,360);}
    ctx.font='90px serif';ctx.fillText('😂',200,230);
  }
  $('#render',root).onclick=render;
  $('#save',root).onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL();a.download='meme.png';a.click();};
  render();
};

R['dialogue-gen']=root=>{
  const ALL=['Kitne aadmi the?','Mogambo khush hua!','Rishte mein toh hum tumhare baap lagte hain',
    'Mere paas maa hai','Pushpa, I hate tears','Naam toh suna hoga?',
    'Basanti in kutton ke saamne mat nachna','Aaj mere paas bangla hai gaadi hai',
    'Hum jahan khade hote hain line wahi se shuru hoti hai',
    'Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain',
    'Keh diya na bas keh diya','All is well','Picture abhi baaki hai mere dost'];
  root.innerHTML=`<div class="game-ui"><h2>Bollywood Dialogue Gen</h2>
    <p class="game-sub">Random iconic dialogues.</p>
    <div class="stat" style="text-align:center;padding:30px;min-height:160px;display:grid;place-items:center">
      <div id="out" style="font-size:18px;font-weight:800;line-height:1.5">Tap Generate 👇</div></div>
    <div class="btn-row"><button class="btn" id="gen">Generate</button></div></div>`;
  $('#gen',root).onclick=()=>{$('#out',root).textContent=pick(ALL);};
};

R['food-combiner']=root=>{
  const A=['Vada Pav','Chai','Samosa','Biryani','Dosa','Paneer Tikka','Gulab Jamun','Pav Bhaji','Idli','Rajma','Butter Chicken','Rasgulla'];
  const B=['Chocolate syrup','Cheese','Mayonnaise','Ketchup','Butter','Ice cream','Pickle','Honey','Nutella','Peanut butter'];
  root.innerHTML=`<div class="game-ui"><h2>Indian Food Combiner</h2>
    <p class="game-sub">Weird food combinations.</p>
    <div class="stat" style="text-align:center;padding:30px;min-height:140px;display:grid;place-items:center">
      <div id="out" style="font-size:20px;font-weight:900">Tap Generate 👇</div></div>
    <div class="btn-row"><button class="btn" id="gen">Generate</button></div></div>`;
  $('#gen',root).onclick=()=>{$('#out',root).textContent=`${pick(A)} + ${pick(B)}`;};
};

R['auto-custom']=root=>{
  const STYLES=[
    {n:'Classic Yellow',c:'#fbbf24'},{n:'Green Delhi',c:'#10b981'},
    {n:'Black Mumbai',c:'#000'},{n:'Pink Jaipur',c:'#ec4899'},
    {n:'Blue Bengaluru',c:'#3b82f6'},{n:'Red Chennai',c:'#dc2626'},
  ];
  root.innerHTML=`<div class="game-ui"><h2>Auto Rickshaw Customizer</h2>
    <p class="game-sub">Apna auto design karo.</p>
    <div class="stat" style="text-align:center;padding:30px">
      <div style="font-size:80px">🛺</div>
      <div style="font-size:12px;font-weight:800;color:var(--muted);margin-top:8px" id="label">Classic Yellow</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center" id="opts">
      ${STYLES.map((s,i)=>`<button data-i="${i}" style="padding:10px 14px;background:${s.c};color:#fff;
        border-radius:10px;font-weight:800;font-size:12px">${s.n}</button>`).join('')}
    </div></div>`;
  $('#opts',root).onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;
    $('#label',root).textContent=STYLES[+b.dataset.i].n;};
};

R['truck-art']=root=>{
  const S=['Horn OK Please','Buri Nazar Wale Tera Muh Kala','Jai Mata Di','Use Dipper at Night',
    'Maa Ka Aashirwad','Bharat Mata Ki Jai','Chalte Raho','Papa Ki Pari'];
  root.innerHTML=`<div class="game-ui"><h2>Truck Art Designer</h2>
    <p class="game-sub">Indian truck art style.</p>
    <div class="stat" style="text-align:center;padding:20px">
      <div style="font-size:60px">🚚</div>
      <div style="font-size:14px;font-weight:800;margin-top:10px" id="slogan">Horn OK Please</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:12px" id="sl">
      ${S.map(s=>`<button data-s="${s}" style="padding:10px 14px;background:var(--surface-2);border-radius:10px;font-weight:800;font-size:12px">${s}</button>`).join('')}
    </div></div>`;
  $('#sl',root).onclick=e=>{const b=e.target.closest('[data-s]');if(b)$('#slogan',root).textContent=b.dataset.s;};
};

R['pixel-paint']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Pixel Painter</h2>
    <p class="game-sub">Canvas par paint karo.</p>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px" id="pal">
      ${['#000','#fff','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'].map(c=>
        `<button data-c="${c}" style="width:28px;height:28px;border-radius:50%;background:${c};border:2px solid var(--border)"></button>`).join('')}
    </div>
    <canvas id="cv" width="400" height="400" style="width:100%;aspect-ratio:1;border-radius:16px;
      background:#fff;touch-action:none;display:block;cursor:crosshair"></canvas>
    <div class="btn-row"><button class="btn secondary" id="clr">Clear</button>
      <button class="btn" id="save">Save</button></div></div>`;
  const cv=$('#cv',root),ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2);
  cv.width=400*dpr;cv.height=400*dpr;ctx.scale(dpr,dpr);
  let color='#000',drawing=false;
  ctx.fillStyle='#fff';ctx.fillRect(0,0,400,400);
  ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=6;
  function pos(e){const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;
    return{x:(t.clientX-r.left)*(400/r.width),y:(t.clientY-r.top)*(400/r.height)};}
  cv.addEventListener('mousedown',e=>{drawing=true;const p=pos(e);ctx.strokeStyle=color;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+0.1,p.y+0.1);ctx.stroke();});
  cv.addEventListener('mousemove',e=>{if(!drawing)return;const p=pos(e);
    ctx.lineTo(p.x,p.y);ctx.stroke();});
  cv.addEventListener('mouseup',()=>drawing=false);
  cv.addEventListener('touchstart',e=>{e.preventDefault();drawing=true;const p=pos(e);ctx.strokeStyle=color;
    ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x+0.1,p.y+0.1);ctx.stroke();},{passive:false});
  cv.addEventListener('touchmove',e=>{e.preventDefault();if(!drawing)return;const p=pos(e);
    ctx.lineTo(p.x,p.y);ctx.stroke();},{passive:false});
  cv.addEventListener('touchend',()=>drawing=false);
  $('#pal',root).onclick=e=>{const b=e.target.closest('[data-c]');if(b)color=b.dataset.c;};
  $('#clr',root).onclick=()=>{ctx.fillStyle='#fff';ctx.fillRect(0,0,400,400);};
  $('#save',root).onclick=()=>{const a=document.createElement('a');a.href=cv.toDataURL();a.download='painting.png';a.click();};
};

R['color-palette']=root=>{
  const P=[
    {n:'Haldi Yellow',c:'#fbbf24'},{n:'Sindoor Red',c:'#dc2626'},
    {n:'Mehndi Green',c:'#16a34a'},{n:'Indigo Blue',c:'#3b82f6'},
    {n:'Kesari Orange',c:'#f97316'},{n:'Chandan White',c:'#f5f5f4'},
    {n:'Kajal Black',c:'#0a0a0a'},{n:'Gulabi Pink',c:'#ec4899'},
    {n:'Marigold',c:'#f59e0b'},{n:'Peacock',c:'#0891b2'},
  ];
  root.innerHTML=`<div class="game-ui"><h2>Desi Color Palette</h2>
    <p class="game-sub">Traditional Indian colors. Tap to copy.</p>
    ${P.map(p=>`<div style="display:flex;gap:12px;align-items:center;padding:12px;background:var(--surface);
      border:1px solid var(--border);border-radius:12px;margin-bottom:8px;cursor:pointer" data-c="${p.c}">
      <div style="width:50px;height:50px;border-radius:12px;background:${p.c};border:2px solid var(--border)"></div>
      <div><div style="font-weight:800;font-size:14px">${p.n}</div>
        <div style="font-size:12px;color:var(--muted);font-family:monospace">${p.c}</div></div></div>`).join('')}
  </div>`;
  root.onclick=e=>{const el=e.target.closest('[data-c]');if(!el)return;
    if(navigator.clipboard)navigator.clipboard.writeText(el.dataset.c);toast('Color copied!');};
};

R['kite-fly']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Kite Flying</h2>
    <p class="game-sub">Screen tap karke kite upar rakho.</p>
    <div class="stat" style="text-align:center;padding:12px">
      <div style="font-size:11px;color:var(--muted);font-weight:800">SCORE</div>
      <div style="font-size:28px;font-weight:900" id="sc">0</div></div>
    <div id="sky" style="width:100%;aspect-ratio:3/4;background:linear-gradient(180deg,#7dd3fc,#0369a1);
      border-radius:16px;position:relative;overflow:hidden;cursor:pointer;touch-action:none">
      <div id="kite" style="position:absolute;font-size:44px;left:50%;top:80%;
        transform:translate(-50%,-50%);transition:top .1s,left .1s">🪁</div>
    </div></div>`;
  let score=0,y=80,vel=0,left=50,dir=1,loop;
  const sky=$('#sky',root),kite=$('#kite',root);
  loop=setInterval(()=>{
    if(!document.body.contains(root)){clearInterval(loop);return;}
    vel+=0.9;
    if(vel<0)vel=0;
    y+=vel*0.5;left+=dir*0.7;
    if(left>85||left<15)dir*=-1;
    if(y>100){clearInterval(loop);toast('Kite crashed! Score: '+score);return;}
    if(y<15)y=15;
    kite.style.top=y+'%';kite.style.left=left+'%';
    score=Math.max(score,Math.round(100-y));
    $('#sc',root).textContent=score;
    vel-=0.9;
  },50);
  sky.addEventListener('pointerdown',()=>{vel=-8;});
};

R['billionaire-rank']=root=>{
  const B=[
    {n:'Gautam Adani',w:9.23e12,e:'🏭',c:'Adani Group'},
    {n:'Mukesh Ambani',w:8.63e12,e:'🛢️',c:'Reliance'},
    {n:'Lakshmi Mittal',w:3.2e12,e:'⚙️',c:'ArcelorMittal'},
    {n:'Shiv Nadar',w:2.8e12,e:'💻',c:'HCL'},
    {n:'Savitri Jindal',w:2.4e12,e:'🏗️',c:'Jindal Group'},
    {n:'Cyrus Poonawalla',w:2.1e12,e:'💉',c:'Serum Institute'},
    {n:'Kumar Birla',w:1.8e12,e:'🏭',c:'Aditya Birla'},
    {n:'Dilip Shanghvi',w:1.6e12,e:'💊',c:'Sun Pharma'},
    {n:'Uday Kotak',w:1.5e12,e:'🏦',c:'Kotak Mahindra'},
    {n:'Azim Premji',w:1.2e12,e:'💼',c:'Wipro'},
  ].sort((a,b)=>b.w-a.w);
  root.innerHTML=`<div class="game-ui"><h2>Billionaire Ranking</h2>
    <p class="game-sub">Indian billionaires 2026.</p>
    ${B.map((b,i)=>`<div class="stat" style="display:flex;gap:12px;align-items:center">
      <div style="font-size:24px;font-weight:900;color:var(--muted);min-width:30px">#${i+1}</div>
      <div style="font-size:32px">${b.e}</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:14px">${b.n}</div>
        <div style="font-size:12px;color:var(--muted)">${b.c}</div></div>
      <div style="font-weight:900;font-size:14px;font-variant-numeric:tabular-nums">${fmtINR(b.w)}</div>
    </div>`).join('')}
  </div>`;
};

R['tax-calc']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Tax Calculator</h2>
    <p class="game-sub">Old vs New regime (FY 2025-26).</p>
    <input class="input" id="inc" type="number" placeholder="Annual income (₹)" value="1000000">
    <div class="btn-row"><button class="btn" id="go">Calculate</button></div>
    <div id="res"></div></div>`;
  function oldTax(i){
    if(i<=250000)return 0;let t=0;
    if(i>250000)t+=Math.min(i-250000,250000)*0.05;
    if(i>500000)t+=Math.min(i-500000,500000)*0.2;
    if(i>1000000)t+=(i-1000000)*0.3;
    return t;
  }
  function newTax(i){
    if(i<=300000)return 0;let t=0;
    if(i>300000)t+=Math.min(i-300000,400000)*0.05;
    if(i>700000)t+=Math.min(i-700000,300000)*0.10;
    if(i>1000000)t+=Math.min(i-1000000,200000)*0.15;
    if(i>1200000)t+=Math.min(i-1200000,300000)*0.20;
    if(i>1500000)t+=(i-1500000)*0.30;
    return t;
  }
  $('#go',root).onclick=()=>{
    const i=Math.max(0,+$('#inc',root).value||0);
    const ot=oldTax(i),nt=newTax(i);
    const best=ot<nt?'Old':'New';
    $('#res',root).innerHTML=`<div class="result-box">
      <div class="stat"><div class="stat-label">Old Regime</div>
        <div class="stat-val">₹${Math.round(ot).toLocaleString('en-IN')}</div></div>
      <div class="stat"><div class="stat-label">New Regime</div>
        <div class="stat-val">₹${Math.round(nt).toLocaleString('en-IN')}</div></div>
      <div class="stat" style="background:color-mix(in srgb,var(--success) 15%,var(--surface))">
        <div class="stat-label">Better Option</div>
        <div style="font-size:15px;font-weight:900;margin-top:4px">${best} Regime — save ₹${Math.round(Math.abs(ot-nt)).toLocaleString('en-IN')}</div></div>
    </div>`;
  };
  $('#go',root).click();
};

R['upi-sim']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>UPI Simulator</h2>
    <p class="game-sub">Fake payment (koi real transaction nahi).</p>
    <input class="input" id="to" placeholder="UPI ID" value="friend@upi" style="margin-bottom:10px">
    <input class="input" id="amt" type="number" placeholder="Amount ₹" value="100" style="margin-bottom:10px">
    <input class="input" id="note" placeholder="Note" value="Chai paisa" style="margin-bottom:12px">
    <button class="btn" id="pay" style="width:100%;padding:16px">Pay ₹100</button>
    <div id="res"></div></div>`;
  $('#amt',root).oninput=e=>{$('#pay',root).textContent=`Pay ₹${e.target.value}`;};
  $('#pay',root).onclick=()=>{
    const to=$('#to',root).value,amt=+$('#amt',root).value,note=$('#note',root).value;
    $('#res',root).innerHTML=`<div class="result-box" style="text-align:center;padding:24px">
      <div style="font-size:60px">⏳</div>
      <div style="font-weight:800;margin-top:8px">Processing…</div></div>`;
    setTimeout(()=>{
      const tid='T'+Date.now();
      $('#res',root).innerHTML=`<div class="result-box" style="text-align:center;padding:24px">
        <div style="font-size:60px">✅</div>
        <div style="font-weight:900;margin:8px 0">₹${amt} Sent</div>
        <div style="font-size:12px;color:var(--muted)">To: ${to}</div>
        <div style="font-size:12px;color:var(--muted)">Note: ${note||'—'}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:8px;font-family:monospace">TXN: ${tid}</div>
      </div>`;
    },1400);
  };
};

R['gold-bitcoin']=root=>{
  root.innerHTML=`<div class="game-ui"><h2>Gold vs Bitcoin</h2>
    <p class="game-sub">10 saal comparison (2015-2025).</p>
    <input class="input" id="amt" type="number" placeholder="Investment ₹" value="100000">
    <div class="btn-row"><button class="btn" id="go">Calculate</button></div>
    <div id="res"></div></div>`;
  $('#go',root).onclick=()=>{
    const i=+$('#amt',root).value||0;
    const gold=i*Math.pow(1.09,10);
    const btc=i*Math.pow(1.65,10);
    const fd=i*Math.pow(1.07,10);
    const stocks=i*Math.pow(1.12,10);
    $('#res',root).innerHTML=`<div class="result-box">
      <div class="stat"><div class="stat-label">🏆 Gold (9% CAGR)</div>
        <div class="stat-val">₹${Math.round(gold).toLocaleString('en-IN')}</div></div>
      <div class="stat"><div class="stat-label">₿ Bitcoin (65% CAGR)</div>
        <div class="stat-val">₹${Math.round(btc).toLocaleString('en-IN')}</div></div>
      <div class="stat"><div class="stat-label">📈 Stocks (12% CAGR)</div>
        <div class="stat-val">₹${Math.round(stocks).toLocaleString('en-IN')}</div></div>
      <div class="stat"><div class="stat-label">🏦 FD (7% CAGR)</div>
        <div class="stat-val">₹${Math.round(fd).toLocaleString('en-IN')}</div></div>
      <p style="font-size:11px;color:var(--muted);text-align:center;margin-top:12px;line-height:1.5">
        ⚠️ Bitcoin returns historical average hai. Actual returns highly volatile hote hain.</p>
    </div>`;
  };
  $('#go',root).click();
};

R['startup-sim']=root=>{
  let money=1000000,users=0,round=0;
  const EVENTS=[
    {q:'Ek VC tumhe ₹50L de raha hai 10% equity ke liye. Le?',y:{m:5000000,u:0},n:{m:0,u:100}},
    {q:'Marketing campaign chalao ₹10L ka?',y:{m:-1000000,u:5000},n:{m:0,u:500}},
    {q:'Product pivot karo? Users half ho jayenge lekin growth double.',y:{m:-500000,u:-50000},n:{m:0,u:0}},
    {q:'Team expand karo — 5 developers hire karo?',y:{m:-2000000,u:20000},n:{m:0,u:0}},
    {q:'Competitor ne tumhe ₹5 Cr mein acquire karna chahta hai.',y:{m:50000000,u:0},n:{m:0,u:30000}},
    {q:'Ad campaign Instagram pe?',y:{m:-500000,u:8000},n:{m:0,u:0}},
  ];
  function upd(){
    $('#money',root).textContent=fmtINR(money);
    $('#users',root).textContent=users.toLocaleString();
  }
  function next(){
    if(round>=EVENTS.length||money<=0){
      const status=money>=5e7?'🏆 Success! Acquired':money>0?'🚀 Growing':'💀 Bankrupt';
      $('#box',root).innerHTML=`<div class="result-box" style="text-align:center">
        <h3>${status}</h3>
        <p style="margin:8px 0;color:var(--muted);font-size:14px">Final: ${fmtINR(money)}, ${users.toLocaleString()} users</p>
        <button class="btn" id="rst2" style="margin-top:12px">Play Again</button></div>`;
      $('#rst2',root).onclick=()=>{money=1000000;users=0;round=0;upd();next();};
      return;
    }
    const ev=EVENTS[round];
    $('#box',root).innerHTML=`<div class="kbc-q">${ev.q}</div>
      <div class="kbc-opts">
        <button class="kbc-opt" data-y="1">✅ Haan</button>
        <button class="kbc-opt" data-y="0">❌ Nahi</button></div>`;
  }
  root.innerHTML=`<div class="game-ui"><h2>Startup Simulator</h2>
    <p class="game-sub">Apna Indian startup banao.</p>
    <div class="stat"><div class="stat-label">Money</div><div class="stat-val" id="money">₹10.00 L</div></div>
    <div class="stat"><div class="stat-label">Users</div><div class="stat-val" id="users">0</div></div>
    <div class="stat"><div class="stat-label">Round</div><div class="stat-val" id="round">0</div></div>
    <div id="box"></div></div>`;
  upd();
  root.addEventListener('click',e=>{
    const b=e.target.closest('[data-y]');if(!b)return;
    const ch=+b.dataset.y,ev=EVENTS[round];
    const c=ch?ev.y:ev.n;
    money+=c.m;users=Math.max(0,users+c.u);round++;
    if(c.m>0)toast('+'+fmtINR(c.m));
    upd();next();
  });
  next();
};

R['never-have']=root=>{
  const Q=['Never have I ever lied to my parents.',
    'Never have I ever cheated in an exam.','Never have I ever cried over a movie.',
    'Never have I ever stalked my ex on social media.','Never have I ever bunked class.',
    'Never have I ever eaten someone else\'s tiffin.','Never have I ever broken a promise.',
    'Never have I ever pretended to be busy.','Never have I ever sent a wrong text.',
    'Never have I ever fallen asleep in class.','Never have I ever faked an illness.',
    'Never have I ever blamed someone else for my mistake.'];
  root.innerHTML=`<div class="game-ui"><h2>Never Have I Ever</h2>
    <p class="game-sub">Desi edition party game.</p>
    <div class="stat" style="text-align:center;padding:30px;min-height:160px;display:grid;place-items:center">
      <div id="out" style="font-size:16px;font-weight:800;line-height:1.5">Tap Next 👇</div></div>
    <div class="btn-row"><button class="btn" id="nx">Next Statement</button></div></div>`;
  $('#nx',root).onclick=()=>{$('#out',root).textContent=pick(Q);};
};

R['spin-bottle']=root=>{
  const N=['Aman','Priya','Rahul','Neha','Vikram','Anjali','Karan','Sneha'];
  root.innerHTML=`<div class="game-ui"><h2>Spin the Bottle</h2>
    <p class="game-sub">Virtual spin — random banda/bandi select.</p>
    <div class="spin-wheel" id="wheel"><div class="arrow">▼</div></div>
    <div class="stat" style="text-align:center;margin-top:20px">
      <div class="stat-label">Selected</div>
      <div class="stat-val" id="pick">—</div></div>
    <div class="btn-row"><button class="btn" id="spin">Spin 🍾</button></div></div>`;
  let rot=0;
  $('#spin',root).onclick=()=>{
    const i=rand(0,N.length-1);
    rot+=1440+rand(0,360);
    $('#wheel',root).style.transform=`rotate(${rot}deg)`;
    setTimeout(()=>{$('#pick',root).textContent=N[i];},2900);
  };
};

R['dumb-charades']=root=>{
  const W=['Sholay movie','Chai banana','Cricket match','Biryani','Auto rickshaw','Taj Mahal',
    'Diwali','Ganesh Chaturthi','Mumbai local train','Yoga','Mangalyaan','Butter chicken',
    'Kuch Kuch Hota Hai','Sachin Tendulkar','Delhi metro','Dabangg','Kabaddi','Diwali ki safai',
    'Amazon delivery','Rikshaw wala'];
  root.innerHTML=`<div class="game-ui"><h2>Dumb Charades</h2>
    <p class="game-sub">Word prompts — dost ko act karke dikhao.</p>
    <div class="stat" style="text-align:center;padding:30px;min-height:160px;display:grid;place-items:center">
      <div id="out" style="font-size:20px;font-weight:900">Tap Next 👇</div></div>
    <div class="btn-row"><button class="btn" id="nx">Next Prompt</button></div></div>`;
  $('#nx',root).onclick=()=>{$('#out',root).textContent=pick(W);};
};

R['food-tycoon']=root=>{
  let money=5000,day=1,price=20;
  function upd(){
    $('#money',root).textContent=fmtINR(money);
    $('#day',root).textContent=day;
    $('#price',root).textContent='₹'+price;
  }
  root.innerHTML=`<div class="game-ui"><h2>Street Food Tycoon</h2>
    <p class="game-sub">Gali ka khana becho — profit badhao.</p>
    <div class="stat"><div class="stat-label">Money</div><div class="stat-val" id="money">₹5,000</div></div>
    <div class="stat"><div class="stat-label">Day</div><div class="stat-val" id="day">1</div></div>
    <div class="stat"><div class="stat-label">Selling @</div>
      <div style="font-weight:800;font-size:15px;margin-top:4px"><span id="price">₹20</span> per plate</div></div>
    <div class="ctrl-row"><label>Price per plate <span id="pv">20</span></label>
      <input type="range" id="pr" min="5" max="100" value="20"></div>
    <div class="btn-row"><button class="btn" id="next">End Day →</button>
      <button class="btn secondary" id="rst">Reset</button></div></div>`;
  $('#pr',root).oninput=e=>{price=+e.target.value;$('#pv',root).textContent=price;$('#price',root).textContent='₹'+price;};
  $('#next',root).onclick=()=>{
    const demand=Math.max(0,Math.round(40-price/2+rand(-5,5)));
    const cost=price*0.4;
    const profit=Math.round((price-cost)*demand);
    money+=profit;day++;upd();
    toast(`Day ${day-1}: ${demand} customers, profit ${fmtINR(profit)}`);
  };
  $('#rst',root).onclick=()=>{money=5000;day=1;upd();};
  upd();
};

R['train-delay']=root=>{
  const T=['Rajdhani Express','Shatabdi Express','Duronto','Garib Rath','Vande Bharat','Passenger Special','Tejas Express'];
  const RS=['Signal failure at Mathura','Fog in Delhi','Track maintenance','Fog in Kanpur',
    'Waiting for platform','Cattle on track','Technical snag','Heavy rain in Mumbai','Track repair at Itarsi'];
  let delay=0;
  root.innerHTML=`<div class="game-ui"><h2>Train Delay Simulator</h2>
    <p class="game-sub">Indian Railways ka reality.</p>
    <div class="stat"><div class="stat-label">Train</div>
      <div style="font-size:15px;font-weight:800;margin-top:4px" id="tn">Rajdhani Express</div></div>
    <div class="stat" style="text-align:center;padding:20px">
      <div class="stat-label">Current Delay</div>
      <div class="stat-val" id="dl" style="font-size:44px;color:var(--danger)">0 min</div></div>
    <div class="stat"><div class="stat-label">Latest Announcement</div>
      <div style="font-size:13px;font-weight:600;margin-top:4px" id="rs">Sab kuch time par hai… filhal.</div></div>
    <div class="btn-row"><button class="btn danger" id="wait">Wait More</button>
      <button class="btn secondary" id="rst">New Journey</button></div></div>`;
  $('#wait',root).onclick=()=>{
    delay+=rand(15,90);
    $('#dl',root).textContent=delay+' min';
    if(Math.random()<0.7)$('#tn',root).textContent=pick(T);
    $('#rs',root).textContent=pick(RS);
    if(delay>300)$('#rs',root).textContent='Yaatri kripya apne ghar wapas jaayein.';
  };
  $('#rst',root).onclick=()=>{delay=0;$('#dl',root).textContent='0 min';
    $('#rs',root).textContent='Sab kuch time par hai… filhal.';$('#tn',root).textContent=pick(T);};
};
