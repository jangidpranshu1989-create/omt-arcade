/* ============================================================
   PUZZLE + CREATIVE + LIFE GAMES
   ============================================================ */
(function(){
const { $, $$, rand, pick, shuffle, clamp, fmtINR, fmtNum, fmtCompact, rollNumber, toast, haptic, register, STORE } = OMT;

/* ------------------------------------------------------------
   PUZZLE GAMES
   ------------------------------------------------------------ */
register('2048', {
  title:'2048', icon:'🔢', tag:'Puzzle', category:'Puzzle',
  desc:'Slide tiles. Merge numbers. Reach 2048. Classic.',
  tags:['numbers','classic'], type:'native',
}, function(root){
  let board, score, best;
  const size = 4;

  function init(){
    board = Array(size*size).fill(0);
    score = 0;
    best = +STORE.get('g2048-best', 0);
    addTile(); addTile();
  }

  function addTile(){
    const empty = board.map((v,i) => v === 0 ? i : -1).filter(i => i >= 0);
    if (!empty.length) return;
    board[pick(empty)] = Math.random() < 0.9 ? 2 : 4;
  }

  const COLORS = {
    0:'var(--surface-2)', 2:'#eee4da', 4:'#ede0c8', 8:'#f2b179',
    16:'#f59563', 32:'#f67c5f', 64:'#f65e3b', 128:'#edcf72',
    256:'#edcc61', 512:'#edc850', 1024:'#edc53f', 2048:'#edc22e',
  };

  function render(){
    $('#2048-board', root).innerHTML = board.map(v => {
      const color = COLORS[v] || '#3c3a32';
      const fg = v > 4 ? '#fff' : '#776e65';
      const fs = v >= 1000 ? '15px' : v >= 100 ? '18px' : '22px';
      return `<div style="
        aspect-ratio:1; display:grid; place-items:center;
        background:${color}; color:${fg};
        border-radius:10px; font-weight:900; font-size:${fs};
        transition:all .12s; font-variant-numeric:tabular-nums;
      ">${v || ''}</div>`;
    }).join('');
    $('#2048-score', root).textContent = score;
    $('#2048-best', root).textContent = Math.max(best, score);
  }

  function move(dir){
    let moved = false;
    for (let i = 0; i < size; i++){
      let line = [];
      for (let j = 0; j < size; j++){
        const idx = dir < 2 ? i*size+j : j*size+i;
        if (board[idx]) line.push(board[idx]);
      }
      if (dir === 1 || dir === 3) line.reverse();
      const merged = [];
      for (let k = 0; k < line.length; k++){
        if (line[k] === line[k+1]){
          merged.push(line[k] * 2);
          score += line[k] * 2;
          k++;
        } else merged.push(line[k]);
      }
      while (merged.length < size) merged.push(0);
      if (dir === 1 || dir === 3) merged.reverse();
      for (let j = 0; j < size; j++){
        const idx = dir < 2 ? i*size+j : j*size+i;
        if (board[idx] !== merged[j]) moved = true;
        board[idx] = merged[j];
      }
    }
    if (moved){
      addTile();
      render();
      if (score > best){ best = score; STORE.set('g2048-best', best); }
      haptic(5);
    }
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">2048</h2>
      <p class="ui__sub">Arrow keys or swipe to slide tiles.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Score</div><div class="panel__value" id="2048-score">0</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Best</div><div class="panel__value" id="2048-best">0</div></div>
      </div>
      <div id="2048-board" style="
        display:grid; grid-template-columns:repeat(4,1fr); gap:8px;
        background:var(--surface-2); padding:8px; border-radius:18px;
        max-width:400px; margin:0 auto; aspect-ratio:1;
        touch-action:none;
      "></div>
      <div class="btn-row" style="margin-top:20px">
        <button class="btn btn--block btn--ghost" id="2048-reset">↺ New Game</button>
      </div>
    </div>
  `;

  init(); render();

  document.addEventListener('keydown', function h(e){
    if (!document.body.contains(root)){ document.removeEventListener('keydown', h); return; }
    const map = { ArrowUp:0, ArrowRight:1, ArrowDown:2, ArrowLeft:3 };
    if (map[e.key] !== undefined){ e.preventDefault(); move(map[e.key]); }
  });

  let sx, sy;
  $('#2048-board', root).addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; });
  $('#2048-board', root).addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 1 : 3);
    else move(dy > 0 ? 2 : 0);
  });

  $('#2048-reset', root).onclick = () => { init(); render(); };
});

register('snake', {
  title:'Snake', icon:'🐍', tag:'Puzzle', category:'Puzzle',
  desc:'The classic. Eat food. Don\'t hit walls or yourself.',
  tags:['arcade','classic'], type:'native',
}, function(root){
  let snake, dir, nextDir, food, score, timer, over;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Snake</h2>
      <p class="ui__sub">Arrow keys, swipe, or on-screen controls.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Score</div><div class="panel__value" id="sn-score">0</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Best</div><div class="panel__value" id="sn-best">0</div></div>
      </div>
      <canvas id="sn-canvas" width="400" height="400" style="
        width:100%; aspect-ratio:1; border-radius:16px;
        background:var(--surface); border:1px solid var(--border);
        display:block; touch-action:none;
      "></canvas>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:280px;margin:16px auto 0">
        <div></div>
        <button class="btn btn--ghost" data-dir="up">↑</button>
        <div></div>
        <button class="btn btn--ghost" data-dir="left">←</button>
        <button class="btn btn--ghost" data-dir="down">↓</button>
        <button class="btn btn--ghost" data-dir="right">→</button>
      </div>
      <div class="btn-row">
        <button class="btn btn--block btn--ghost" id="sn-reset">↺ Restart</button>
      </div>
    </div>
  `;

  const canvas = $('#sn-canvas', root);
  const ctx = canvas.getContext('2d');
  const N = 20, S = 20;

  function init(){
    snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
    dir = {x:1, y:0};
    nextDir = dir;
    score = 0;
    over = false;
    food = newFood();
    $('#sn-score', root).textContent = score;
    $('#sn-best', root).textContent = +STORE.get('sn-best', 0);
    clearInterval(timer);
    timer = setInterval(tick, 110);
    haptic(5);
  }

  function newFood(){
    let f;
    do { f = { x: rand(0, N-1), y: rand(0, N-1) }; }
    while (snake.some(s => s.x === f.x && s.y === f.y));
    return f;
  }

  function tick(){
    dir = nextDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= N || head.y < 0 || head.y >= N || snake.some(s => s.x === head.x && s.y === head.y)){
      clearInterval(timer);
      over = true;
      const b = +STORE.get('sn-best', 0);
      if (score > b) STORE.set('sn-best', score);
      haptic([40, 30, 60]);
      toast('Game over! Score: ' + score);
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y){
      score++;
      $('#sn-score', root).textContent = score;
      food = newFood();
      haptic(8);
    } else snake.pop();
    draw();
  }

  function draw(){
    const bg = getComputedStyle(document.body).backgroundColor;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 400, 400);

    // Grid
    ctx.strokeStyle = 'color-mix(in srgb, var(--text) 6%, transparent)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= N; i++){
      ctx.beginPath(); ctx.moveTo(i*S, 0); ctx.lineTo(i*S, 400); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i*S); ctx.lineTo(400, i*S); ctx.stroke();
    }

    // Food
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(food.x*S + S/2, food.y*S + S/2, S/2 - 3, 0, Math.PI*2);
    ctx.fill();

    // Snake
    const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#000';
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#10b981' : textCol;
      ctx.globalAlpha = i === 0 ? 1 : 0.7;
      ctx.fillRect(s.x*S + 1, s.y*S + 1, S - 2, S - 2);
    });
    ctx.globalAlpha = 1;
  }

  const dirMap = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-dir]');
    if (!btn) return;
    const nd = dirMap[btn.dataset.dir];
    if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
  });

  document.addEventListener('keydown', function h(e){
    if (!document.body.contains(root)){ document.removeEventListener('keydown', h); return; }
    const m = { ArrowUp:'up', ArrowDown:'down', ArrowLeft:'left', ArrowRight:'right' };
    if (m[e.key]){
      e.preventDefault();
      const nd = dirMap[m[e.key]];
      if (nd.x !== -dir.x || nd.y !== -dir.y) nextDir = nd;
    }
  });

  let sx, sy;
  canvas.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; });
  canvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
    let n;
    if (Math.abs(dx) > Math.abs(dy)) n = dx > 0 ? dirMap.right : dirMap.left;
    else n = dy > 0 ? dirMap.down : dirMap.up;
    if (n.x !== -dir.x || n.y !== -dir.y) nextDir = n;
  });

  $('#sn-reset', root).onclick = init;
  init();
});

register('memory-match', {
  title:'Memory Match', icon:'🧠', tag:'Puzzle', category:'Puzzle',
  desc:'Flip cards. Match emoji pairs. Fewest moves wins.',
  tags:['memory'], type:'native',
}, function(root){
  const EMOJI = ['🍛','🏏','🐘','🕌','🌺','🪔','🚂','🛺'];
  let cards, flipped, matched, moves;

  function init(){
    cards = shuffle([...EMOJI, ...EMOJI]);
    flipped = [];
    matched = new Set();
    moves = 0;
    $('#mm-moves', root).textContent = 0;
    render();
  }

  function render(){
    $('#mm-board', root).innerHTML = cards.map((e, i) => {
      const isOpen = flipped.includes(i) || matched.has(i);
      const isMatched = matched.has(i);
      return `<div class="mm-card" data-i="${i}" style="
        aspect-ratio:1; display:grid; place-items:center;
        background:${isMatched ? 'color-mix(in srgb, var(--success) 20%, var(--surface))' : isOpen ? 'var(--surface-3)' : 'var(--surface)'};
        border:1px solid ${isMatched ? 'var(--success)' : 'var(--border)'};
        border-radius:14px; font-size:32px; cursor:pointer;
        transition:all .2s; user-select:none;
      ">
        <span style="opacity:${isOpen ? 1 : 0}; transition:opacity .15s">${e}</span>
      </div>`;
    }).join('');
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Memory Match</h2>
      <p class="ui__sub">Flip two cards. Find matching pairs.</p>
      <div style="text-align:center;font-weight:900;font-size:14px;margin-bottom:14px">Moves: <span id="mm-moves" style="color:var(--info)">0</span></div>
      <div id="mm-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:400px;margin:0 auto"></div>
      <div class="btn-row" style="margin-top:20px">
        <button class="btn btn--block btn--ghost" id="mm-reset">↺ Restart</button>
      </div>
    </div>
  `;

  init();

  $('#mm-board', root).onclick = e => {
    const card = e.target.closest('.mm-card');
    if (!card) return;
    const i = +card.dataset.i;
    if (flipped.includes(i) || matched.has(i) || flipped.length >= 2) return;
    flipped.push(i);
    render();
    haptic(5);
    if (flipped.length === 2){
      moves++;
      $('#mm-moves', root).textContent = moves;
      setTimeout(() => {
        const [a, b] = flipped;
        if (cards[a] === cards[b]){
          matched.add(a); matched.add(b);
          haptic(15);
        }
        flipped = [];
        render();
        if (matched.size === cards.length){
          setTimeout(() => {
            haptic([20, 30, 40]);
            toast(`🎉 Won in ${moves} moves!`);
          }, 300);
        }
      }, 650);
    }
  };

  $('#mm-reset', root).onclick = init;
});

register('reaction-time', {
  title:'Reaction Timer', icon:'⚡', tag:'Puzzle', category:'Puzzle',
  desc:'Measure your reaction speed. Green = tap. Red = wait.',
  tags:['speed'], type:'native',
}, function(root){
  let state = 'idle';
  let t0 = 0;
  let times = [];
  let timeoutId = null;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Reaction Timer</h2>
      <p class="ui__sub">Wait for green. Then tap as fast as you can.</p>
      <div id="rt-box" style="
        width:100%; aspect-ratio:1; max-width:400px; margin:16px auto;
        border-radius:24px; display:grid; place-items:center;
        font-size:22px; font-weight:900; cursor:pointer;
        user-select:none; transition:background .15s; padding:24px; text-align:center;
        background:var(--surface-2); color:var(--text-soft);
      ">Tap to start</div>
      <div id="rt-stats"></div>
    </div>
  `;

  const box = $('#rt-box', root);

  function setState(s){
    state = s;
    if (s === 'idle'){
      box.style.background = 'var(--surface-2)';
      box.style.color = 'var(--text-soft)';
      box.textContent = 'Tap to start';
    } else if (s === 'waiting'){
      box.style.background = '#ef4444';
      box.style.color = '#fff';
      box.textContent = 'Wait for green...';
    } else if (s === 'ready'){
      box.style.background = '#10b981';
      box.style.color = '#fff';
      box.textContent = 'TAP NOW!';
    }
  }

  box.onclick = () => {
    if (state === 'idle'){
      setState('waiting');
      timeoutId = setTimeout(() => {
        setState('ready');
        t0 = performance.now();
      }, rand(1500, 4000));
    } else if (state === 'ready'){
      const ms = Math.round(performance.now() - t0);
      times.push(ms);
      setState('idle');
      haptic(15);
      const best = Math.min(...times);
      const avg = Math.round(times.reduce((a,b) => a+b, 0) / times.length);
      const rating = ms < 200 ? '⚡ Superhuman' : ms < 250 ? '🔥 Excellent' : ms < 300 ? '👍 Good' : ms < 400 ? '😐 Average' : '🐢 Slow';
      $('#rt-stats', root).innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;animation:cardIn .3s">
          <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Last</div><div class="panel__value" style="font-size:18px">${ms}ms</div></div>
          <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Best</div><div class="panel__value" style="font-size:18px;color:var(--success)">${best}ms</div></div>
          <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Avg</div><div class="panel__value" style="font-size:18px">${avg}ms</div></div>
        </div>
        <div style="text-align:center;margin-top:14px;font-weight:900;font-size:16px">${rating}</div>
      `;
    } else if (state === 'waiting'){
      clearTimeout(timeoutId);
      setState('idle');
      box.textContent = 'Too early! Tap to retry';
      haptic(40);
    }
  };
});

register('tictactoe', {
  title:'Tic Tac Toe', icon:'❌', tag:'Puzzle', category:'Puzzle',
  desc:'Beat an AI that blocks, forks, and wins.',
  tags:['classic','ai'], type:'native',
}, function(root){
  const WINS = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let b, turn, over, score = { w:0, l:0, d:0 };

  function init(){
    b = Array(9).fill('');
    turn = 'X';
    over = false;
    render();
  }

  function winner(){
    for (const w of WINS)
      if (b[w[0]] && b[w[0]] === b[w[1]] && b[w[1]] === b[w[2]])
        return { w, who: b[w[0]] };
    return null;
  }

  function render(){
    $('#ttt-board', root).innerHTML = b.map((v, i) => `
      <button data-i="${i}" style="
        aspect-ratio:1; font-size:52px; font-weight:900;
        background:var(--surface); border:1px solid var(--border);
        border-radius:16px; cursor:pointer; transition:all .15s;
        color:${v === 'X' ? 'var(--info)' : v === 'O' ? 'var(--danger)' : 'var(--text)'};
      ">${v}</button>
    `).join('');
    $('#ttt-status', root).textContent = over ? 'Game over' : turn === 'X' ? 'Your turn' : 'AI is thinking...';
    $('#ttt-score', root).textContent = `${score.w}W · ${score.l}L · ${score.d}D`;
  }

  function aiMove(){
    const empty = b.map((v, i) => v ? null : i).filter(i => i !== null);
    if (!empty.length) return;
    // Try winning move
    for (const i of empty){ b[i] = 'O'; if (winner()) return; b[i] = ''; }
    // Block player
    for (const i of empty){ b[i] = 'X'; if (winner()){ b[i] = 'O'; return; } b[i] = ''; }
    // Take center
    if (!b[4]){ b[4] = 'O'; return; }
    // Take opposite corner
    const corners = [0,2,6,8];
    for (const c of corners){
      if (!b[c] && b[8-c] === 'X'){ b[c] = 'O'; return; }
    }
    // Any corner
    const openCorners = corners.filter(c => !b[c]);
    if (openCorners.length){ b[pick(openCorners)] = 'O'; return; }
    // Any edge
    b[pick(empty)] = 'O';
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Tic Tac Toe</h2>
      <p class="ui__sub">X is you. O is AI. Try to beat it.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-weight:900;font-size:13px">
        <span id="ttt-status">Your turn</span>
        <span style="color:var(--text-mute)" id="ttt-score">0W · 0L · 0D</span>
      </div>
      <div id="ttt-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:360px;margin:0 auto"></div>
      <div class="btn-row" style="margin-top:20px">
        <button class="btn btn--block btn--ghost" id="ttt-reset">↺ New Game</button>
      </div>
    </div>
  `;

  init();

  $('#ttt-board', root).onclick = e => {
    const btn = e.target.closest('button');
    if (!btn || over) return;
    const i = +btn.dataset.i;
    if (b[i] || turn !== 'X') return;
    b[i] = 'X';
    haptic(8);
    let w = winner();
    if (w){
      over = true; score.w++; render(); haptic([20,30,40]); toast('🎉 You win!'); return;
    }
    if (b.every(v => v)){ over = true; score.d++; render(); toast('Draw!'); return; }
    turn = 'O'; render();
    setTimeout(() => {
      aiMove();
      w = winner();
      if (w){ over = true; score.l++; render(); toast('AI wins 😢'); return; }
      if (b.every(v => v)){ over = true; score.d++; render(); toast('Draw!'); return; }
      turn = 'X'; render();
    }, 400);
  };

  $('#ttt-reset', root).onclick = init;
});

register('tic-ai', {
  title:'Beat The AI', icon:'🤖', tag:'Puzzle', category:'Puzzle',
  desc:'Guess the number 1-100. AI gives hot/cold hints.',
  tags:['guessing'], type:'native',
}, function(root){
  let secret, tries, low, high;

  function init(){
    secret = rand(1, 100);
    tries = 0;
    low = 1; high = 100;
    $('#gt-hint', root).textContent = '1 – 100';
    $('#gt-tries', root).textContent = '0';
    $('#gt-hist', root).innerHTML = '';
    $('#gt-input', root).value = '';
    $('#gt-input', root).disabled = false;
    $('#gt-submit', root).disabled = false;
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Beat The AI</h2>
      <p class="ui__sub">Number between 1 and 100. Fewest guesses wins.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Range</div><div class="panel__value" id="gt-hint" style="font-size:16px">1 – 100</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Tries</div><div class="panel__value" id="gt-tries">0</div></div>
      </div>
      <input class="input" id="gt-input" type="number" placeholder="Enter your guess" min="1" max="100">
      <div class="btn-row">
        <button class="btn btn--block" id="gt-submit">Submit Guess</button>
      </div>
      <div id="gt-hist" style="margin-top:16px; display:flex; flex-direction:column; gap:8px"></div>
    </div>
  `;

  init();

  function log(msg, cls){
    const el = document.createElement('div');
    el.style.cssText = `
      padding:12px 16px; border-radius:12px; font-size:13.5px; font-weight:700;
      background:${cls === 'up' ? 'color-mix(in srgb,var(--danger) 12%,var(--surface))' : cls === 'down' ? 'color-mix(in srgb,var(--info) 12%,var(--surface))' : cls === 'win' ? 'color-mix(in srgb,var(--success) 20%,var(--surface))' : 'var(--surface)'};
      border:1px solid var(--border);
      animation:cardIn .3s;
    `;
    el.textContent = msg;
    $('#gt-hist', root).prepend(el);
  }

  function submit(){
    const g = +$('#gt-input', root).value;
    if (!g || g < 1 || g > 100) { toast('Enter 1-100'); return; }
    tries++;
    $('#gt-tries', root).textContent = tries;
    if (g === secret){
      log(`🎉 Correct! The number was ${secret}. Took ${tries} tries.`, 'win');
      $('#gt-input', root).disabled = true;
      $('#gt-submit', root).disabled = true;
      haptic([20, 30, 40]);
      return;
    }
    if (g < secret){
      log(`${g} is too LOW — try higher.`, 'down');
      low = Math.max(low, g + 1);
    } else {
      log(`${g} is too HIGH — try lower.`, 'up');
      high = Math.min(high, g - 1);
    }
    $('#gt-hint', root).textContent = `${low} – ${high}`;
    $('#gt-input', root).value = '';
    $('#gt-input', root).focus();
    haptic(5);
  }

  $('#gt-submit', root).onclick = submit;
  $('#gt-input', root).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
});

register('math-sprint', {
  title:'Math Sprint', icon:'➗', tag:'Puzzle', category:'Puzzle',
  desc:'60 seconds. As many correct answers as possible.',
  tags:['math','speed'], type:'native',
}, function(root){
  let score, time, ans, timer, running;

  function init(){
    score = 0;
    time = 60;
    running = true;
    $('#ms-score', root).textContent = '0';
    $('#ms-time', root).textContent = '60';
    $('#ms-input', root).disabled = false;
    $('#ms-input', root).value = '';
    next();
    clearInterval(timer);
    timer = setInterval(() => {
      time--;
      $('#ms-time', root).textContent = time;
      if (time <= 0) end();
    }, 1000);
    setTimeout(() => $('#ms-input', root).focus(), 200);
  }

  function next(){
    const ops = ['+', '−', '×'];
    const op = pick(ops);
    let a = rand(2, 20), b = rand(2, 20);
    if (op === '×'){ a = rand(2, 12); b = rand(2, 12); }
    if (op === '−' && b > a) [a, b] = [b, a];
    ans = op === '+' ? a+b : op === '−' ? a-b : a*b;
    $('#ms-q', root).textContent = `${a} ${op} ${b}`;
  }

  function submit(){
    if (!running) return;
    const v = +$('#ms-input', root).value;
    if (v === ans){
      score++;
      $('#ms-score', root).textContent = score;
      $('#ms-input', root).value = '';
      haptic(5);
      next();
    } else {
      $('#ms-input', root).value = '';
      haptic(25);
    }
  }

  function end(){
    clearInterval(timer);
    running = false;
    $('#ms-input', root).disabled = true;
    const pct = score;
    const msg = score >= 25 ? '🧠 Math genius' : score >= 15 ? '👏 Sharp mind' : score >= 8 ? '💪 Decent' : '📚 Keep practicing';
    $('#ms-body', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:28px;animation:cardIn .4s">
        <div style="font-size:44px;margin-bottom:8px">${score >= 20 ? '🏆' : score >= 10 ? '⚡' : '💪'}</div>
        <div class="panel__value" style="font-size:44px;letter-spacing:-2px">${score}</div>
        <div style="color:var(--text-soft);font-size:13px;margin-top:8px;font-weight:700">${msg}</div>
        <button class="btn btn--block" id="ms-again" style="margin-top:20px">Play Again</button>
      </div>`;
    $('#ms-again', root).onclick = () => location.reload();
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Math Sprint</h2>
      <p class="ui__sub">60 seconds. How many can you solve?</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" style="text-align:center;padding:14px"><div class="panel__label">Score</div><div class="panel__value" id="ms-score" style="color:var(--success)">0</div></div>
        <div class="panel" style="text-align:center;padding:14px"><div class="panel__label">Time</div><div class="panel__value" id="ms-time">60</div></div>
      </div>
      <div id="ms-body">
        <div class="panel" style="text-align:center;padding:36px 20px;margin-bottom:16px">
          <div class="panel__label">Solve</div>
          <div class="panel__value" id="ms-q" style="font-size:40px;letter-spacing:-2px">—</div>
        </div>
        <input class="input" id="ms-input" type="number" placeholder="Your answer" inputmode="numeric">
        <div class="btn-row">
          <button class="btn btn--block" id="ms-go">Submit</button>
        </div>
      </div>
    </div>
  `;

  init();
  $('#ms-go', root).onclick = submit;
  $('#ms-input', root).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
});

register('word-scramble', {
  title:'Word Scramble', icon:'🔤', tag:'Puzzle', category:'Puzzle',
  desc:'Unscramble Indian-themed words before you give up.',
  tags:['words','india'], type:'native',
}, function(root){
  const WORDS = ['BOLLYWOOD','CRICKET','SAMOSA','RANGOLI','DIWALI','CHAI','TANDOOR','MAHARAJA','KAJURAHO','AYURVEDA','MUMBAI','CHENNAI','HIMALAYA','GANGES','TAJMAHAL','PUNJABI','GARAMMASALA','KATHAKALI','CHANDIGARH','MYSORE'];

  let score, word, current;

  function init(){
    score = 0;
    $('#ws-score', root).textContent = '0';
    next();
  }

  function next(){
    word = pick(WORDS);
    let s;
    do { s = shuffle(word.split('')).join(''); }
    while (s === word);
    current = s;
    $('#ws-word', root).textContent = s.split('').join(' ');
    $('#ws-input', root).value = '';
    $('#ws-input', root).focus();
  }

  function submit(){
    const v = $('#ws-input', root).value.toUpperCase().trim();
    if (v === word){
      score++;
      $('#ws-score', root).textContent = score;
      haptic(15);
      toast('✅ Correct!');
      setTimeout(next, 400);
    } else {
      haptic(30);
      toast('Try again');
    }
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Word Scramble</h2>
      <p class="ui__sub">Unscramble the Indian word. No skipping.</p>
      <div style="text-align:center;font-weight:900;font-size:14px;margin-bottom:14px">Score: <span id="ws-score" style="color:var(--success)">0</span></div>
      <div class="panel" style="text-align:center;padding:36px 20px;margin-bottom:16px">
        <div class="panel__label">Unscramble</div>
        <div class="panel__value" id="ws-word" style="font-size:26px;letter-spacing:8px;word-break:break-all">—</div>
      </div>
      <input class="input" id="ws-input" placeholder="Your answer" autocomplete="off" autocapitalize="characters" spellcheck="false" style="text-align:center;font-weight:800;font-size:18px;letter-spacing:2px;text-transform:uppercase">
      <div class="btn-row">
        <button class="btn btn--block" id="ws-go">Submit</button>
      </div>
    </div>
  `;

  init();
  $('#ws-go', root).onclick = submit;
  $('#ws-input', root).addEventListener('keydown', e => { if (e.key === 'Enter') submit(); });
});

register('simon-says', {
  title:'Simon Says', icon:'🎨', tag:'Puzzle', category:'Puzzle',
  desc:'Watch the color sequence. Repeat it. It gets longer every round.',
  tags:['memory'], type:'native',
}, function(root){
  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
  let sequence, input, playing, round;

  function init(){
    sequence = [];
    input = [];
    playing = false;
    round = 0;
    $('#ss-round', root).textContent = '0';
    $('#ss-msg', root).textContent = 'Tap Start to begin';
  }

  function flash(i, ms = 420){
    return new Promise(res => {
      const btn = $$('.ss-pad', root)[i];
      btn.style.transform = 'scale(1.06)';
      btn.style.opacity = '1';
      btn.style.boxShadow = `0 0 30px ${COLORS[i]}`;
      setTimeout(() => {
        btn.style.transform = 'scale(1)';
        btn.style.opacity = '.45';
        btn.style.boxShadow = 'none';
        setTimeout(res, 120);
      }, ms);
    });
  }

  async function play(){
    playing = false;
    $('#ss-msg', root).textContent = 'Watch carefully...';
    await new Promise(r => setTimeout(r, 400));
    for (const i of sequence) await flash(i);
    playing = true;
    $('#ss-msg', root).textContent = 'Your turn!';
  }

  async function nextRound(){
    sequence.push(rand(0, 3));
    input = [];
    round++;
    $('#ss-round', root).textContent = round;
    await play();
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Simon Says</h2>
      <p class="ui__sub">Watch the sequence. Repeat it. Every round adds one.</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-weight:900;font-size:13px">
        <span>Round: <span id="ss-round" style="color:var(--info)">0</span></span>
        <span id="ss-msg" style="color:var(--text-soft)">Tap Start to begin</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:360px;margin:0 auto;aspect-ratio:1">
        ${COLORS.map((c, i) => `
          <button class="ss-pad" data-i="${i}" style="
            background:${c}; border:none; border-radius:20px; cursor:pointer;
            opacity:.45; transition:all .2s; touch-action:manipulation;
          "></button>
        `).join('')}
      </div>
      <div class="btn-row">
        <button class="btn btn--block" id="ss-start">Start</button>
      </div>
    </div>
  `;

  init();

  root.addEventListener('click', async e => {
    const pad = e.target.closest('.ss-pad');
    if (!pad || !playing) return;
    const i = +pad.dataset.i;
    await flash(i, 180);
    haptic(8);
    input.push(i);
    if (input[input.length - 1] !== sequence[input.length - 1]){
      playing = false;
      $('#ss-msg', root).textContent = `Game over at round ${round}`;
      haptic([40, 30, 60]);
      toast(`Round: ${round}`);
      return;
    }
    if (input.length === sequence.length){
      playing = false;
      setTimeout(nextRound, 600);
    }
  });

  $('#ss-start', root).onclick = () => { init(); nextRound(); };
});

register('typing-test', {
  title:'Typing Test', icon:'⌨️', tag:'Puzzle', category:'Puzzle',
  desc:'How fast can you type? Measured in words per minute.',
  tags:['speed','typing'], type:'native',
}, function(root){
  const SENTENCES = [
    'India is a land of unity in diversity.',
    'Chai and samosa make the perfect evening.',
    'The Taj Mahal is a symbol of eternal love.',
    'Cricket is not just a game it is an emotion.',
    'Bollywood movies are known for their dance.',
    'Mumbai local trains are the lifeline of the city.',
    'The Himalayas stand tall guarding the north.',
    'From Kashmir to Kanyakumari we are one.',
  ];

  let sentence, started, t0, timer, wpm;

  function init(){
    sentence = pick(SENTENCES);
    started = false;
    wpm = 0;
    clearInterval(timer);
    $('#tt-text', root).innerHTML = sentence.split('').map(c => `<span>${c}</span>`).join('');
    $('#tt-input', root).value = '';
    $('#tt-input', root).disabled = false;
    $('#tt-input', root).style.borderColor = 'var(--border)';
    $('#tt-wpm', root).textContent = '0';
    $('#tt-acc', root).textContent = '100%';
    $('#tt-input', root).focus();
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Typing Test</h2>
      <p class="ui__sub">Type the sentence as fast and accurately as you can.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">WPM</div><div class="panel__value" id="tt-wpm" style="color:var(--success)">0</div></div>
        <div class="panel" style="text-align:center;padding:12px"><div class="panel__label">Accuracy</div><div class="panel__value" id="tt-acc">100%</div></div>
      </div>
      <div class="panel" id="tt-text" style="
        font-family:ui-monospace,monospace; font-size:16px; line-height:1.8;
        padding:20px; letter-spacing:.3px;
      "></div>
      <input class="input" id="tt-input" placeholder="Start typing..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" style="margin-top:14px">
      <div class="btn-row">
        <button class="btn btn--block btn--ghost" id="tt-reset">↺ New Sentence</button>
      </div>
    </div>
  `;

  init();

  $('#tt-input', root).addEventListener('input', () => {
    if (!started){
      started = true;
      t0 = performance.now();
      timer = setInterval(() => {
        const elapsed = (performance.now() - t0) / 1000;
        const typed = $('#tt-input', root).value.length;
        wpm = Math.round((typed / 5) / (elapsed / 60));
        $('#tt-wpm', root).textContent = isFinite(wpm) && wpm >= 0 ? wpm : 0;
      }, 250);
    }
    const val = $('#tt-input', root).value;
    const spans = $$('#tt-text span', root);
    let correct = 0;
    spans.forEach((s, i) => {
      s.style.color = '';
      s.style.background = '';
      if (i < val.length){
        if (val[i] === sentence[i]){ s.style.color = 'var(--success)'; correct++; }
        else { s.style.color = 'var(--danger)'; s.style.background = 'color-mix(in srgb,var(--danger) 20%,transparent)'; }
      }
    });
    const acc = val.length ? Math.round(correct / val.length * 100) : 100;
    $('#tt-acc', root).textContent = acc + '%';
    if (val === sentence){
      clearInterval(timer);
      $('#tt-input', root).disabled = true;
      $('#tt-input', root).style.borderColor = 'var(--success)';
      haptic([20, 30, 40]);
      toast(`🎉 ${wpm} WPM · ${acc}% accuracy`);
    }
  });

  $('#tt-reset', root).onclick = init;
});

/* ------------------------------------------------------------
   CREATIVE GAMES
   ------------------------------------------------------------ */
register('rangoli', {
  title:'Rangoli Maker', icon:'🎨', tag:'Creative', category:'Creative',
  desc:'Draw a symmetric rangoli. 8-fold mirror. Save as PNG.',
  tags:['art','india'], type:'native',
}, function(root){
  const COLORS = ['#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#000000','#ffffff'];
  let color = '#ef4444', drawing = false;
  let canvas, ctx, dpr;
  const SIZE = 400;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Rangoli Maker</h2>
      <p class="ui__sub">Tap or draw. Every stroke mirrors 8-fold.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px" id="rg-pal">
        ${COLORS.map((c, i) => `
          <button data-c="${c}" style="
            width:36px; height:36px; border-radius:50%;
            background:${c}; border:3px solid ${i === 0 ? 'var(--text)' : 'var(--border)'};
            cursor:pointer; transition:transform .15s;
          "></button>
        `).join('')}
      </div>
      <canvas id="rg-canvas" width="${SIZE}" height="${SIZE}" style="
        width:100%; aspect-ratio:1; border-radius:20px;
        background:var(--surface); border:1px solid var(--border);
        display:block; touch-action:none; cursor:crosshair;
      "></canvas>
      <div class="btn-row">
        <button class="btn btn--ghost" id="rg-clear">Clear</button>
        <button class="btn" id="rg-save">Save PNG</button>
      </div>
    </div>
  `;

  canvas = $('#rg-canvas', root);
  ctx = canvas.getContext('2d');
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = SIZE * dpr; canvas.height = SIZE * dpr;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
  ctx.fillRect(0, 0, SIZE, SIZE);

  function drawDot(x, y){
    const cx = SIZE/2, cy = SIZE/2;
    const dx = x - cx, dy = y - cy;
    for (let i = 0; i < 8; i++){
      const a = Math.PI / 4 * i;
      const nx = cx + dx * Math.cos(a) - dy * Math.sin(a);
      const ny = cy + dx * Math.sin(a) + dy * Math.cos(a);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(nx, ny, 7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function pos(e){
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (SIZE / r.width), y: (t.clientY - r.top) * (SIZE / r.height) };
  }

  canvas.addEventListener('mousedown', e => { drawing = true; const p = pos(e); drawDot(p.x, p.y); });
  canvas.addEventListener('mousemove', e => { if (drawing){ const p = pos(e); drawDot(p.x, p.y); } });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); drawDot(p.x, p.y); }, { passive:false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); if (drawing){ const p = pos(e); drawDot(p.x, p.y); } }, { passive:false });
  canvas.addEventListener('touchend', () => drawing = false);

  $('#rg-pal', root).onclick = e => {
    const btn = e.target.closest('[data-c]');
    if (!btn) return;
    color = btn.dataset.c;
    $$('#rg-pal button', root).forEach(b => b.style.borderColor = 'var(--border)');
    btn.style.borderColor = 'var(--text)';
  };

  $('#rg-clear', root).onclick = () => {
    ctx.fillStyle = getComputedStyle(document.body).backgroundColor;
    ctx.fillRect(0, 0, SIZE, SIZE);
  };

  $('#rg-save', root).onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'rangoli.png';
    a.click();
    toast('Saved!');
  };
});

register('mehndi', {
  title:'Mehndi Designer', icon:'🖐️', tag:'Creative', category:'Creative',
  desc:'Symmetric henna on a hand. Tap to draw, mirrored.',
  tags:['art','india'], type:'native',
}, function(root){
  const SIZE = 400, H = 500;
  let canvas, ctx, dpr, drawing = false;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Mehndi Designer</h2>
      <p class="ui__sub">Tap the hand. Every dot mirrors to the other side.</p>
      <canvas id="mh-canvas" width="${SIZE}" height="${H}" style="
        width:100%; max-width:400px; aspect-ratio:4/5; margin:0 auto;
        border-radius:20px; background:#fde2c8; display:block;
        touch-action:none; cursor:crosshair;
      "></canvas>
      <div class="btn-row">
        <button class="btn btn--ghost" id="mh-clear">Clear</button>
        <button class="btn" id="mh-save">Save PNG</button>
      </div>
    </div>
  `;

  canvas = $('#mh-canvas', root);
  ctx = canvas.getContext('2d');
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = SIZE * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);

  function reset(){
    ctx.fillStyle = '#fde2c8';
    ctx.fillRect(0, 0, SIZE, H);
    ctx.strokeStyle = 'rgba(139,58,30,0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(SIZE/2, 280, 110, 150, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  function dot(x, y){
    ctx.fillStyle = '#8b3a1e';
    ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(SIZE - x, y, 3.5, 0, Math.PI * 2); ctx.fill();
  }

  function pos(e){
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (SIZE / r.width), y: (t.clientY - r.top) * (H / r.height) };
  }

  canvas.addEventListener('mousedown', e => { drawing = true; const p = pos(e); dot(p.x, p.y); });
  canvas.addEventListener('mousemove', e => { if (drawing){ const p = pos(e); dot(p.x, p.y); } });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);
  canvas.addEventListener('touchstart', e => { e.preventDefault(); drawing = true; const p = pos(e); dot(p.x, p.y); }, { passive:false });
  canvas.addEventListener('touchmove', e => { e.preventDefault(); if (drawing){ const p = pos(e); dot(p.x, p.y); } }, { passive:false });
  canvas.addEventListener('touchend', () => drawing = false);

  reset();
  $('#mh-clear', root).onclick = reset;
  $('#mh-save', root).onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'mehndi.png';
    a.click();
  };
});

register('meme-maker', {
  title:'Desi Meme Maker', icon:'😂', tag:'Creative', category:'Creative',
  desc:'Enter top + bottom text. Get a shareable meme.',
  tags:['meme','fun'], type:'native',
}, function(root){
  const EMOJIS = ['😂','🤣','😭','💀','🔥','😎','🤡','🙏','🥲','😴'];
  let emoji = '😂';

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Meme Maker</h2>
      <p class="ui__sub">Classic Impact font. Top + bottom text.</p>
      <canvas id="mm2-canvas" width="500" height="500" style="
        width:100%; aspect-ratio:1; border-radius:20px;
        display:block; margin-bottom:14px;
      "></canvas>
      <input class="input" id="mm2-top" placeholder="Top text" maxlength="30" style="margin-bottom:10px">
      <input class="input" id="mm2-bot" placeholder="Bottom text" maxlength="30" style="margin-bottom:14px">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px" id="mm2-emoji">
        ${EMOJIS.map(e => `<button data-e="${e}" style="font-size:22px;background:var(--surface-2);border-radius:12px;padding:8px 12px">${e}</button>`).join('')}
      </div>
      <div class="btn-row">
        <button class="btn btn--ghost" id="mm2-save">↗ Save</button>
        <button class="btn" id="mm2-share">Share</button>
      </div>
    </div>
  `;

  const canvas = $('#mm2-canvas', root);
  const ctx = canvas.getContext('2d');

  function render(){
    const grad = ctx.createLinearGradient(0, 0, 500, 500);
    grad.addColorStop(0, '#1e293b');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 500);

    // Grid pattern
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 500; i += 25){
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 500); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(500, i); ctx.stroke();
    }

    ctx.font = '96px serif';
    ctx.textAlign = 'center';
    ctx.fillText(emoji, 250, 300);

    ctx.textAlign = 'center';
    ctx.font = '900 44px Impact, "Arial Black", sans-serif';
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#fff';
    ctx.lineWidth = 8;

    const top = ($('#mm2-top', root).value || 'TOP TEXT').toUpperCase();
    const bot = ($('#mm2-bot', root).value || 'BOTTOM TEXT').toUpperCase();

    ctx.strokeText(top, 250, 60);
    ctx.fillText(top, 250, 60);

    ctx.strokeText(bot, 250, 470);
    ctx.fillText(bot, 250, 470);
  }

  ['#mm2-top', '#mm2-bot'].forEach(id => {
    $(id, root).addEventListener('input', render);
  });

  $('#mm2-emoji', root).onclick = e => {
    const btn = e.target.closest('[data-e]');
    if (!btn) return;
    emoji = btn.dataset.e;
    render();
  };

  $('#mm2-save', root).onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'meme.png';
    a.click();
    toast('Saved!');
  };

  $('#mm2-share', root).onclick = () => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], 'meme.png', { type:'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })){
        try { await navigator.share({ files: [file], title: 'Meme' }); } catch {}
      } else {
        toast('Sharing not supported — saved instead');
        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = 'meme.png';
        a.click();
      }
    });
  };

  render();
});

register('dialogue-gen', {
  title:'Bollywood Dialogue Gen', icon:'🎬', tag:'Creative', category:'Creative',
  desc:'Random iconic Bollywood dialogues — instant share.',
  tags:['bollywood','fun'], type:'native',
}, function(root){
  const DIALOGUES = [
    'Kitne aadmi the?',
    'Mogambo khush hua!',
    'Rishte mein toh hum tumhare baap lagte hain.',
    'Mere paas maa hai.',
    'Pushpa, I hate tears.',
    'Naam toh suna hoga?',
    'Basanti in kutton ke saamne mat nachna.',
    'Aaj mere paas bangla hai, gaadi hai, bank balance hai.',
    'Hum jahan khade hote hain, line wahi se shuru hoti hai.',
    'Bade bade deshon mein aisi chhoti chhoti baatein hoti rehti hain.',
    'Keh diya na... bas keh diya.',
    'All is well.',
    'Picture abhi baaki hai mere dost.',
    'Don ko pakadna mushkil hi nahi, namumkin hai.',
    'Mere paas maa hai, aur maa ke paas main.',
  ];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Bollywood Dialogues</h2>
      <p class="ui__sub">Iconic lines from Hindi cinema.</p>
      <div id="dg-box" style="
        min-height:240px; display:grid; place-items:center;
        background:linear-gradient(135deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%);
        color:#fff; border-radius:24px; padding:36px 24px;
        font-size:24px; font-weight:900; line-height:1.4;
        text-align:center; letter-spacing:-.5px; margin-bottom:18px;
        box-shadow:var(--shadow-lg);
      ">Tap to reveal a dialogue</div>
      <div class="btn-row">
        <button class="btn btn--ghost" id="dg-share">Share</button>
        <button class="btn" id="dg-next">Generate →</button>
      </div>
    </div>
  `;

  let current = '';
  function next(){
    current = pick(DIALOGUES);
    const box = $('#dg-box', root);
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = 'cardIn .4s';
    box.textContent = `"${current}"`;
    haptic(10);
  }

  $('#dg-next', root).onclick = next;
  $('#dg-share', root).onclick = () => {
    if (!current) return;
    const txt = `"${current}" — one more try.`;
    if (navigator.share) navigator.share({ text: txt }).catch(()=>{});
    else { navigator.clipboard?.writeText(txt); toast('Copied'); }
  };

  next();
});

register('pixel-paint', {
  title:'Pixel Painter', icon:'🖌️', tag:'Creative', category:'Creative',
  desc:'Free-draw canvas. 8 colors, save as PNG.',
  tags:['art'], type:'native',
}, function(root){
  const COLORS = ['#000000','#ffffff','#ef4444','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899'];
  const SIZE = 500;
  let canvas, ctx, dpr, color = '#000000', drawing = false;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Pixel Painter</h2>
      <p class="ui__sub">Free draw. 8 colors. Save as PNG.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px" id="pp-pal">
        ${COLORS.map((c, i) => `<button data-c="${c}" style="
          width:36px;height:36px;border-radius:50%;background:${c};
          border:3px solid ${i === 0 ? 'var(--text)' : 'var(--border)'};
          cursor:pointer;
        "></button>`).join('')}
      </div>
      <canvas id="pp-canvas" width="${SIZE}" height="${SIZE}" style="
        width:100%; aspect-ratio:1; border-radius:16px;
        background:#fff; display:block; touch-action:none; cursor:crosshair;
      "></canvas>
      <div class="btn-row">
        <button class="btn btn--ghost" id="pp-clear">Clear</button>
        <button class="btn" id="pp-save">Save PNG</button>
      </div>
    </div>
  `;

  canvas = $('#pp-canvas', root);
  ctx = canvas.getContext('2d');
  dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = SIZE * dpr; canvas.height = SIZE * dpr;
  ctx.scale(dpr, dpr);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 6;

  function pos(e){
    const r = canvas.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (SIZE / r.width), y: (t.clientY - r.top) * (SIZE / r.height) };
  }

  canvas.addEventListener('mousedown', e => {
    drawing = true; const p = pos(e);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 0.1, p.y + 0.1); ctx.stroke();
  });
  canvas.addEventListener('mousemove', e => {
    if (!drawing) return;
    const p = pos(e);
    ctx.strokeStyle = color; ctx.lineTo(p.x, p.y); ctx.stroke();
  });
  canvas.addEventListener('mouseup', () => drawing = false);
  canvas.addEventListener('mouseleave', () => drawing = false);
  canvas.addEventListener('touchstart', e => {
    e.preventDefault(); drawing = true; const p = pos(e);
    ctx.strokeStyle = color;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + 0.1, p.y + 0.1); ctx.stroke();
  }, { passive:false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault(); if (!drawing) return;
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke();
  }, { passive:false });
  canvas.addEventListener('touchend', () => drawing = false);

  $('#pp-pal', root).onclick = e => {
    const btn = e.target.closest('[data-c]');
    if (!btn) return;
    color = btn.dataset.c;
    $$('#pp-pal button', root).forEach(b => b.style.borderColor = 'var(--border)');
    btn.style.borderColor = 'var(--text)';
  };
  $('#pp-clear', root).onclick = () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, SIZE, SIZE); };
  $('#pp-save', root).onclick = () => {
    const a = document.createElement('a');
    a.href = canvas.toDataURL();
    a.download = 'painting.png';
    a.click();
  };
});

register('color-palette', {
  title:'Desi Color Palette', icon:'🌈', tag:'Creative', category:'Creative',
  desc:'Traditional Indian colors with hex codes. Tap to copy.',
  tags:['colors','india'], type:'native',
}, function(root){
  const COLORS = [
    { n:'Haldi Yellow', c:'#fbbf24' },
    { n:'Sindoor Red',  c:'#dc2626' },
    { n:'Mehndi Green', c:'#16a34a' },
    { n:'Indigo Blue',  c:'#3b82f6' },
    { n:'Kesari Orange',c:'#f97316' },
    { n:'Chandan White',c:'#f5f5f4' },
    { n:'Kajal Black',  c:'#0a0a0a' },
    { n:'Gulabi Pink',  c:'#ec4899' },
    { n:'Marigold',     c:'#f59e0b' },
    { n:'Peacock Teal', c:'#0891b2' },
  ];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Desi Color Palette</h2>
      <p class="ui__sub">Traditional Indian colors. Tap to copy hex.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px" id="cp-grid">
        ${COLORS.map(p => `
          <div class="cp-item" data-c="${p.c}" style="
            background:var(--surface); border:1px solid var(--border);
            border-radius:16px; padding:14px; cursor:pointer;
            transition:transform .15s;
          ">
            <div style="height:80px;border-radius:12px;background:${p.c};border:1px solid var(--border);margin-bottom:10px"></div>
            <div style="font-weight:800;font-size:13px">${p.n}</div>
            <div style="font-size:12px;color:var(--text-mute);font-family:ui-monospace,monospace;margin-top:2px">${p.c}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  $('#cp-grid', root).onclick = e => {
    const el = e.target.closest('.cp-item');
    if (!el) return;
    navigator.clipboard?.writeText(el.dataset.c);
    haptic(10);
    toast(`${el.dataset.c} copied`);
  };
});

register('kite-fly', {
  title:'Kite Flying', icon:'🪁', tag:'Creative', category:'Creative',
  desc:'Tap to lift the kite. Keep it above the ground.',
  tags:['game','india'], type:'native',
}, function(root){
  let y, vel, left, dir, score, loop, alive;

  function init(){
    y = 80; vel = 0; left = 50; dir = 1; score = 0; alive = true;
    $('#kf-score', root).textContent = '0';
    $('#kf-kite', root).style.top = y + '%';
    $('#kf-kite', root).style.left = left + '%';
    clearInterval(loop);
    loop = setInterval(tick, 50);
  }

  function tick(){
    if (!alive || !document.body.contains(root)){ clearInterval(loop); return; }
    vel += 0.9;
    if (vel < 0) vel = 0;
    y += vel * 0.5;
    left += dir * 0.7;
    if (left > 88 || left < 12) dir *= -1;
    if (y > 100){
      alive = false;
      clearInterval(loop);
      haptic([40, 30, 60]);
      toast(`💥 Kite crashed! Score: ${score}`);
      return;
    }
    if (y < 15) y = 15;
    $('#kf-kite', root).style.top = y + '%';
    $('#kf-kite', root).style.left = left + '%';
    const s = Math.max(score, Math.round(100 - y));
    if (s > score){ score = s; $('#kf-score', root).textContent = score; }
    vel -= 0.9;
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Kite Flying</h2>
      <p class="ui__sub">Tap to lift. Don't let it hit the ground.</p>
      <div class="panel" style="text-align:center;padding:14px;margin-bottom:14px">
        <div class="panel__label">Score</div>
        <div class="panel__value" id="kf-score" style="color:var(--success)">0</div>
      </div>
      <div id="kf-sky" style="
        width:100%; aspect-ratio:3/4; border-radius:20px;
        background:linear-gradient(180deg, #7dd3fc 0%, #0ea5e9 50%, #0369a1 100%);
        position:relative; overflow:hidden; cursor:pointer; touch-action:none;
      ">
        <div id="kf-kite" style="
          position:absolute; font-size:52px; left:50%; top:80%;
          transform:translate(-50%,-50%);
          filter:drop-shadow(0 6px 12px rgba(0,0,0,.3));
          transition:top .08s, left .08s;
        ">🪁</div>
      </div>
      <div class="btn-row">
        <button class="btn btn--block" id="kf-reset">↺ Restart</button>
      </div>
    </div>
  `;

  const sky = $('#kf-sky', root);
  sky.addEventListener('pointerdown', e => { e.preventDefault(); vel = -8; haptic(6); });

  init();
  $('#kf-reset', root).onclick = init;
});

/* ------------------------------------------------------------
   LIFE GAMES
   ------------------------------------------------------------ */
register('billionaire-rank', {
  title:'Billionaire Ranking', icon:'💰', tag:'Life', category:'Life',
  desc:'Top 10 Indian billionaires with live net worth.',
  tags:['economy','india'], type:'native',
}, function(root){
  const LIST = [
    { n:'Gautam Adani',      w:9.23e12, e:'🏭', c:'Adani Group' },
    { n:'Mukesh Ambani',     w:8.63e12, e:'🛢️', c:'Reliance Industries' },
    { n:'Lakshmi Mittal',    w:3.20e12, e:'⚙️', c:'ArcelorMittal' },
    { n:'Shiv Nadar',        w:2.80e12, e:'💻', c:'HCL Technologies' },
    { n:'Savitri Jindal',    w:2.40e12, e:'🏗️', c:'Jindal Group' },
    { n:'Cyrus Poonawalla',  w:2.10e12, e:'💉', c:'Serum Institute' },
    { n:'Kumar Birla',       w:1.80e12, e:'🏭', c:'Aditya Birla Group' },
    { n:'Dilip Shanghvi',    w:1.60e12, e:'💊', c:'Sun Pharma' },
    { n:'Uday Kotak',        w:1.50e12, e:'🏦', c:'Kotak Mahindra' },
    { n:'Azim Premji',       w:1.20e12, e:'💼', c:'Wipro' },
  ].sort((a,b) => b.w - a.w);

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Billionaire Ranking</h2>
      <p class="ui__sub">India\'s richest, ranked live.</p>
      ${LIST.map((b, i) => `
        <div class="panel" style="display:flex;gap:14px;align-items:center;animation:cardIn .4s ${Math.min(i*40,400)}ms backwards">
          <div style="font-size:22px;font-weight:900;color:var(--text-mute);min-width:36px;font-variant-numeric:tabular-nums">#${i+1}</div>
          <div style="font-size:34px">${b.e}</div>
          <div style="flex:1">
            <div style="font-weight:900;font-size:14px">${b.n}</div>
            <div style="font-size:12px;color:var(--text-soft);margin-top:2px">${b.c}</div>
          </div>
          <div style="font-weight:900;font-size:14px;color:var(--success);font-variant-numeric:tabular-nums">${fmtINR(b.w)}</div>
        </div>
      `).join('')}
    </div>
  `;
});

register('tax-calc', {
  title:'Tax Calculator', icon:'📊', tag:'Life', category:'Life',
  desc:'Old vs New regime. Which saves you more?',
  tags:['finance','india'], type:'native',
}, function(root){
  function oldTax(i){
    if (i <= 250000) return 0;
    let t = 0;
    if (i > 250000) t += Math.min(i - 250000, 250000) * 0.05;
    if (i > 500000) t += Math.min(i - 500000, 500000) * 0.20;
    if (i > 1000000) t += (i - 1000000) * 0.30;
    return t;
  }
  function newTax(i){
    if (i <= 300000) return 0;
    let t = 0;
    if (i > 300000) t += Math.min(i - 300000, 400000) * 0.05;
    if (i > 700000) t += Math.min(i - 700000, 300000) * 0.10;
    if (i > 1000000) t += Math.min(i - 1000000, 200000) * 0.15;
    if (i > 1200000) t += Math.min(i - 1200000, 300000) * 0.20;
    if (i > 1500000) t += (i - 1500000) * 0.30;
    return t;
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Tax Calculator</h2>
      <p class="ui__sub">FY 2025-26. Old vs New regime.</p>
      <input class="input" id="tc-inc" type="number" placeholder="Annual income (₹)" value="1500000" style="margin-bottom:14px;font-size:18px;font-weight:800;text-align:center">
      <button class="btn btn--block" id="tc-go" style="margin-bottom:20px">Calculate</button>
      <div id="tc-res"></div>
    </div>
  `;

  function calc(){
    const i = Math.max(0, +$('#tc-inc', root).value || 0);
    const o = oldTax(i), n = newTax(i);
    const best = o < n ? 'Old' : 'New';
    const save = Math.abs(o - n);
    $('#tc-res', root).innerHTML = `
      <div style="display:grid;gap:12px;animation:cardIn .4s">
        <div class="panel"><div class="panel__label">Old Regime</div><div class="panel__value">₹${Math.round(o).toLocaleString('en-IN')}</div></div>
        <div class="panel"><div class="panel__label">New Regime</div><div class="panel__value">₹${Math.round(n).toLocaleString('en-IN')}</div></div>
        <div class="panel" style="background:color-mix(in srgb, var(--success) 10%, var(--surface));border-color:color-mix(in srgb, var(--success) 40%, transparent)">
          <div class="panel__label" style="color:var(--success)">Better Choice</div>
          <div style="font-weight:900;font-size:18px;margin-top:6px">${best} Regime — save ₹${Math.round(save).toLocaleString('en-IN')}</div>
        </div>
      </div>`;
  }

  $('#tc-go', root).onclick = calc;
  $('#tc-inc', root).addEventListener('input', calc);
  calc();
});

register('upi-sim', {
  title:'UPI Simulator', icon:'📱', tag:'Life', category:'Life',
  desc:'Send a fake UPI payment. Fun transaction ID, no real money.',
  tags:['fun','india'], type:'native',
}, function(root){
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">UPI Simulator</h2>
      <p class="ui__sub">Fake payment. No real money moves. Just vibes.</p>
      <input class="input" id="up-to" placeholder="UPI ID" value="friend@upi" style="margin-bottom:10px">
      <input class="input" id="up-amt" type="number" placeholder="Amount ₹" value="500" style="margin-bottom:10px">
      <input class="input" id="up-note" placeholder="Note" value="Chai paisa" style="margin-bottom:14px">
      <button class="btn btn--block" id="up-pay" style="padding:18px;font-size:16px">Pay ₹500</button>
      <div id="up-res"></div>
    </div>
  `;

  $('#up-amt', root).addEventListener('input', e => {
    $('#up-pay', root).textContent = `Pay ₹${e.target.value || 0}`;
  });

  $('#up-pay', root).onclick = () => {
    const to = $('#up-to', root).value;
    const amt = +$('#up-amt', root).value;
    const note = $('#up-note', root).value;
    $('#up-res', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:32px;margin-top:16px;animation:cardIn .3s">
        <div style="font-size:52px;animation:bootPulse 1s infinite">⏳</div>
        <div style="font-weight:800;margin-top:12px">Processing...</div>
      </div>`;
    haptic(15);
    setTimeout(() => {
      const tid = 'T' + Date.now().toString().slice(-10);
      $('#up-res', root).innerHTML = `
        <div class="panel" style="text-align:center;padding:32px;margin-top:16px;animation:cardIn .35s">
          <div style="font-size:52px;margin-bottom:12px">✅</div>
          <div style="font-weight:900;font-size:22px">₹${amt} Sent</div>
          <div style="font-size:12.5px;color:var(--text-soft);margin-top:10px">To: <b>${to}</b></div>
          <div style="font-size:12.5px;color:var(--text-soft);margin-top:4px">Note: <b>${note || '—'}</b></div>
          <div style="font-size:11px;color:var(--text-mute);margin-top:14px;font-family:ui-monospace,monospace">TXN: ${tid}</div>
        </div>`;
      haptic([20, 30, 40]);
    }, 1500);
  };
});

register('gold-bitcoin', {
  title:'Gold vs Bitcoin', icon:'🪙', tag:'Life', category:'Life',
  desc:'10-year returns: Gold, Bitcoin, Stocks, FD. Historical CAGRs.',
  tags:['finance','compare'], type:'native',
}, function(root){
  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Gold vs Bitcoin</h2>
      <p class="ui__sub">₹1 lakh invested 10 years ago — where would it be today?</p>
      <input class="input" id="gb-amt" type="number" value="100000" placeholder="Amount ₹" style="margin-bottom:14px;font-size:18px;font-weight:800;text-align:center">
      <button class="btn btn--block" id="gb-go" style="margin-bottom:20px">Calculate</button>
      <div id="gb-res"></div>
    </div>
  `;

  function calc(){
    const i = +$('#gb-amt', root).value || 0;
    const opts = [
      { name:'Gold',    icon:'🏆', cagr:0.09, color:'#f59e0b' },
      { name:'Stocks',  icon:'📈', cagr:0.12, color:'#10b981' },
      { name:'Bitcoin', icon:'₿',  cagr:0.65, color:'#f97316' },
      { name:'FD',      icon:'🏦', cagr:0.07, color:'#3b82f6' },
    ].map(o => ({ ...o, value: i * Math.pow(1 + o.cagr, 10) })).sort((a, b) => b.value - a.value);

    $('#gb-res', root).innerHTML = `
      <div style="display:flex;flex-direction:column;gap:10px;animation:cardIn .4s">
        ${opts.map(o => `
          <div class="panel" style="display:flex;justify-content:space-between;align-items:center;padding:16px">
            <div style="display:flex;gap:12px;align-items:center">
              <div style="font-size:26px">${o.icon}</div>
              <div>
                <div style="font-weight:900;font-size:14px">${o.name}</div>
                <div style="font-size:11px;color:var(--text-mute);font-weight:700">${(o.cagr*100).toFixed(1)}% CAGR</div>
              </div>
            </div>
            <div style="font-weight:900;font-size:15px;color:${o.color};font-variant-numeric:tabular-nums">${fmtINR(o.value)}</div>
          </div>
        `).join('')}
        <div style="font-size:11.5px;color:var(--text-soft);text-align:center;margin-top:12px;line-height:1.5;padding:12px;background:var(--surface-2);border-radius:12px">
          ⚠️ These are historical averages. Bitcoin especially is highly volatile. Past performance ≠ future returns.
        </div>
      </div>`;
  }

  $('#gb-go', root).onclick = calc;
  $('#gb-amt', root).addEventListener('input', calc);
  calc();
});

register('startup-sim', {
  title:'Startup Simulator', icon:'🚀', tag:'Life', category:'Life',
  desc:'Make 6 decisions. Try to reach ₹5 Cr without going bankrupt.',
  tags:['startup','strategy'], type:'native',
}, function(root){
  const EVENTS = [
    { q:'A VC offers ₹50 Lakh for 10% equity. Take it?',
      y:{ m:5000000, u:0, msg:'Funded!' }, n:{ m:0, u:100, msg:'Bootstrapping' } },
    { q:'Spend ₹10 Lakh on marketing?',
      y:{ m:-1000000, u:5000, msg:'Campaign live' }, n:{ m:0, u:500, msg:'Organic growth' } },
    { q:'Pivot the product? Lose users, gain growth.',
      y:{ m:-500000, u:-50000, msg:'Pivot complete' }, n:{ m:0, u:0, msg:'Same course' } },
    { q:'Hire 5 developers at ₹4 L each?',
      y:{ m:-2000000, u:20000, msg:'Team scaled' }, n:{ m:0, u:0, msg:'Lean team' } },
    { q:'Instagram ad campaign for ₹5 L?',
      y:{ m:-500000, u:8000, msg:'Awareness up' }, n:{ m:0, u:0, msg:'Saved cash' } },
    { q:'Competitor offers ₹5 Cr to acquire you.',
      y:{ m:50000000, u:0, msg:'Acquired!' }, n:{ m:0, u:30000, msg:'Independent' } },
  ];

  let money, users, round;

  function init(){
    money = 1000000;
    users = 0;
    round = 0;
    upd();
    show();
  }

  function upd(){
    $('#su-money', root).textContent = fmtINR(money);
    $('#su-users', root).textContent = users.toLocaleString('en-IN');
    $('#su-round', root).textContent = `${round}/${EVENTS.length}`;
  }

  function show(){
    if (round >= EVENTS.length || money <= 0){ return end(); }
    const e = EVENTS[round];
    $('#su-body', root).innerHTML = `
      <div class="panel" style="padding:22px;font-weight:700;font-size:15px;line-height:1.5;margin-bottom:16px">
        ${e.q}
      </div>
      <div style="display:flex;flex-direction:column;gap:10px">
        <button class="btn btn--success" data-yes="1">✅ Yes</button>
        <button class="btn btn--ghost" data-yes="0">❌ No</button>
      </div>
    `;
  }

  function end(){
    const status = money >= 5e7 ? '🏆 Acquired' : money > 0 ? '🚀 Growing' : '💀 Bankrupt';
    $('#su-body', root).innerHTML = `
      <div class="panel" style="text-align:center;padding:28px;animation:cardIn .4s">
        <div style="font-size:48px;margin-bottom:10px">${money >= 5e7 ? '🏆' : money > 0 ? '🚀' : '💀'}</div>
        <div style="font-weight:900;font-size:20px">${status}</div>
        <div style="color:var(--text-soft);font-size:13px;margin-top:10px">Final: ${fmtINR(money)} • ${users.toLocaleString('en-IN')} users</div>
        <button class="btn btn--block" id="su-again" style="margin-top:18px">Play Again</button>
      </div>`;
    $('#su-again', root).onclick = init;
    haptic([20, 30, 40]);
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Startup Simulator</h2>
      <p class="ui__sub">6 decisions. Reach ₹5 Cr. Don\'t go bankrupt.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel" style="text-align:center;padding:10px"><div class="panel__label">Money</div><div class="panel__value" id="su-money" style="font-size:13px">₹10 L</div></div>
        <div class="panel" style="text-align:center;padding:10px"><div class="panel__label">Users</div><div class="panel__value" id="su-users" style="font-size:13px">0</div></div>
        <div class="panel" style="text-align:center;padding:10px"><div class="panel__label">Round</div><div class="panel__value" id="su-round" style="font-size:13px">0/6</div></div>
      </div>
      <div id="su-body"></div>
    </div>
  `;

  init();

  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-yes]');
    if (!btn) return;
    const yes = +btn.dataset.yes;
    const ev = EVENTS[round];
    const c = yes ? ev.y : ev.n;
    money += c.m;
    users = Math.max(0, users + c.u);
    round++;
    if (c.msg) toast(c.msg);
    haptic(12);
    upd();
    show();
  });
});

register('never-have', {
  title:'Never Have I Ever', icon:'🙈', tag:'Life', category:'Life',
  desc:'Party game. Random statements. Finger up if you\'ve done it.',
  tags:['party'], type:'native',
}, function(root){
  const Q = [
    'Never have I ever lied to my parents.',
    'Never have I ever cheated in an exam.',
    'Never have I ever cried over a movie.',
    'Never have I ever stalked my ex on social media.',
    'Never have I ever bunked class.',
    'Never have I ever eaten someone else\'s tiffin.',
    'Never have I ever broken a promise.',
    'Never have I ever pretended to be busy when I wasn\'t.',
    'Never have I ever sent a wrong text to the wrong person.',
    'Never have I ever fallen asleep in class.',
    'Never have I ever faked being sick.',
    'Never have I ever blamed someone else for my mistake.',
    'Never have I ever hidden a purchase from my parents.',
    'Never have I ever cried myself to sleep.',
  ];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Never Have I Ever</h2>
      <p class="ui__sub">Tap to reveal a statement. Finger up if you\'ve done it.</p>
      <div id="nh-box" style="
        min-height:220px; display:grid; place-items:center;
        background:var(--surface); border:1px solid var(--border);
        border-radius:20px; padding:32px; text-align:center;
        font-weight:800; font-size:18px; line-height:1.5;
        margin-bottom:18px; transition:transform .3s;
      ">Tap "Reveal" to start</div>
      <button class="btn btn--block" id="nh-reveal">Reveal</button>
    </div>
  `;

  $('#nh-reveal', root).onclick = () => {
    const box = $('#nh-box', root);
    box.style.transform = 'scale(.96)';
    setTimeout(() => box.style.transform = 'scale(1)', 100);
    box.textContent = pick(Q);
    haptic(12);
  };
});

register('spin-bottle', {
  title:'Spin the Bottle', icon:'🍾', tag:'Life', category:'Life',
  desc:'Virtual spin. Random name. Party-proof.',
  tags:['party'], type:'native',
}, function(root){
  const NAMES = ['Aman','Priya','Rahul','Neha','Vikram','Anjali','Karan','Sneha','Rohan','Pooja'];
  let rot = 0;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Spin the Bottle</h2>
      <p class="ui__sub">Random pick from the group. Virtual spin.</p>
      <div style="display:grid;place-items:center;padding:20px 0">
        <div id="sb-wheel" style="
          width:240px;height:240px;border-radius:50%;position:relative;
          background:conic-gradient(
            #ef4444 0deg 60deg,
            #f59e0b 60deg 120deg,
            #10b981 120deg 180deg,
            #3b82f6 180deg 240deg,
            #8b5cf6 240deg 300deg,
            #ec4899 300deg 360deg);
          box-shadow:0 12px 32px rgba(0,0,0,.25);
          transition:transform 3.5s cubic-bezier(.16,1,.3,1);
        ">
          <div style="
            position:absolute;top:-14px;left:50%;transform:translateX(-50%);
            font-size:28px;color:#000;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));
          ">▼</div>
          <div style="
            position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
            width:30px;height:30px;background:#fff;border-radius:50%;
            box-shadow:0 4px 12px rgba(0,0,0,.3);
          "></div>
        </div>
      </div>
      <div class="panel" style="text-align:center;padding:20px;margin-bottom:14px">
        <div class="panel__label">Selected</div>
        <div class="panel__value" id="sb-name" style="font-size:32px">—</div>
      </div>
      <button class="btn btn--block" id="sb-spin">🍾 Spin!</button>
    </div>
  `;

  $('#sb-spin', root).onclick = () => {
    const i = rand(0, NAMES.length - 1);
    rot += 1440 + rand(0, 360);
    $('#sb-wheel', root).style.transform = `rotate(${rot}deg)`;
    haptic(20);
    setTimeout(() => {
      $('#sb-name', root).textContent = NAMES[i];
      haptic([20, 30, 40]);
    }, 3400);
  };
});

register('dumb-charades', {
  title:'Dumb Charades', icon:'🎪', tag:'Life', category:'Life',
  desc:'Random Bollywood + desi prompts for game night.',
  tags:['party'], type:'native',
}, function(root){
  const PROMPTS = [
    'Sholay — the movie','Chai banana','Cricket match','Biryani khaana',
    'Auto rickshaw mein baithna','Taj Mahal dekhna','Diwali celebration',
    'Ganesh Chaturthi','Mumbai local train','Yoga karna','Mangalyaan launch',
    'Butter chicken','Kuch Kuch Hota Hai','Sachin ka shot','Delhi metro',
    'Dabangg','Kabaddi match','Diwali ki safai','Amazon delivery','Rikshaw wala',
    'Kajol ka rona','SRK ki smile','Amitabh ka dialogue','Deepika ka walk',
    'Milkha Singh ki race','Gully cricket','Kite flying','Modi ji ka speech',
  ];

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Dumb Charades</h2>
      <p class="ui__sub">Random prompt. Act it out. Friends guess.</p>
      <div id="dc-box" style="
        min-height:220px; display:grid; place-items:center;
        background:var(--surface); border:1px solid var(--border);
        border-radius:20px; padding:32px; text-align:center;
        font-weight:900; font-size:22px; line-height:1.4;
        letter-spacing:-.3px; margin-bottom:18px;
      ">Tap "Next Prompt"</div>
      <button class="btn btn--block" id="dc-next">Next Prompt</button>
    </div>
  `;

  $('#dc-next', root).onclick = () => {
    const box = $('#dc-box', root);
    box.style.animation = 'none';
    void box.offsetWidth;
    box.style.animation = 'cardIn .35s';
    box.textContent = pick(PROMPTS);
    haptic(10);
  };
});

register('food-tycoon', {
  title:'Street Food Tycoon', icon:'🌮', tag:'Life', category:'Life',
  desc:'Run a chai stall. Set price. Maximize 30-day profit.',
  tags:['business'], type:'native',
}, function(root){
  let money, day, price, profitToday, log;

  function init(){
    money = 5000;
    day = 1;
    price = 20;
    log = [];
    $('#ft-price', root).value = price;
    $('#ft-price-v', root).textContent = price;
    upd();
    $('#ft-log', root).innerHTML = '';
  }

  function upd(){
    $('#ft-money', root).textContent = fmtINR(money);
    $('#ft-day', root).textContent = `${day}/30`;
    $('#ft-price-v', root).textContent = price;
  }

  function simulateDay(){
    if (day > 30) return;
    const demand = Math.max(0, Math.round(40 - price / 2 + rand(-4, 4)));
    const cost = price * 0.4;
    const profit = Math.round((price - cost) * demand);
    money += profit;
    log.unshift({ day, price, demand, profit });
    day++;
    upd();
    renderLog();
    haptic(8);
    if (day > 30){
      setTimeout(() => {
        toast(`30 days done! Total: ${fmtINR(money)}`);
      }, 500);
    }
  }

  function renderLog(){
    $('#ft-log', root).innerHTML = log.slice(0, 8).map(l => `
      <div style="padding:10px 14px;background:var(--surface);border-radius:12px;border:1px solid var(--border);display:flex;justify-content:space-between;font-size:12.5px;font-weight:700;animation:cardIn .3s">
        <span style="color:var(--text-soft)">Day ${l.day}</span>
        <span>₹${l.price} × ${l.demand} = <b style="color:${l.profit >= 0 ? 'var(--success)' : 'var(--danger)'}">${l.profit >= 0 ? '+' : ''}${fmtINR(l.profit)}</b></span>
      </div>
    `).join('');
  }

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Street Food Tycoon</h2>
      <p class="ui__sub">30 days. One stall. Set your price wisely.</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px">
        <div class="panel"><div class="panel__label">Cash</div><div class="panel__value" id="ft-money" style="color:var(--success)">₹5,000</div></div>
        <div class="panel"><div class="panel__label">Day</div><div class="panel__value" id="ft-day">1/30</div></div>
      </div>
      <div style="margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.6px;color:var(--text-mute);margin-bottom:8px">
          <span>Price per plate</span><span id="ft-price-v" style="color:var(--text)">20</span>
        </div>
        <input type="range" id="ft-price" min="5" max="100" value="20" step="1"
          style="width:100%;height:6px;-webkit-appearance:none;background:var(--surface-2);border-radius:99px;outline:none">
      </div>
      <button class="btn btn--block" id="ft-next" style="margin-bottom:16px">End Day →</button>
      <div id="ft-log" style="display:flex;flex-direction:column;gap:8px"></div>
    </div>
  `;

  $('#ft-price', root).addEventListener('input', e => {
    price = +e.target.value;
    $('#ft-price-v', root).textContent = price;
  });

  $('#ft-next', root).onclick = simulateDay;

  init();
});

register('train-delay', {
  title:'Train Delay Simulator', icon:'🚂', tag:'Life', category:'Life',
  desc:'The Indian Railways experience. Every wait makes it worse.',
  tags:['india','funny'], type:'native',
}, function(root){
  const TRAINS = ['Rajdhani Express','Shatabdi Express','Duronto Express','Garib Rath','Vande Bharat Express','Passenger Special','Tejas Express','Humsafar Express'];
  const REASONS = [
    'Signal failure at Mathura Junction',
    'Dense fog in Delhi region',
    'Track maintenance between Itarsi and Bhopal',
    'Waiting for platform at Kanpur Central',
    'Cattle on the track near Jhansi',
    'Technical snag in the engine',
    'Heavy rain in Mumbai suburbs',
    'Track repair near Prayagraj',
    'Congestion ahead at Mughalsarai',
    'Pantry car restocking delay',
    'Crew changeover delay',
    'Another train is running late ahead of us',
  ];

  let delay, train;

  root.innerHTML = `
    <div class="ui">
      <h2 class="ui__title">Train Delay Simulator</h2>
      <p class="ui__sub">Because Indian Railways never disappoints. In delays.</p>
      <div class="panel" style="text-align:center;padding:18px">
        <div class="panel__label">Train</div>
        <div style="font-weight:900;font-size:16px;margin-top:4px" id="td-train">Rajdhani Express</div>
      </div>
      <div class="panel" style="text-align:center;padding:24px">
        <div class="panel__label">Delay</div>
        <div class="panel__value" id="td-delay" style="font-size:56px;color:var(--danger);line-height:1">0 min</div>
      </div>
      <div class="panel" id="td-ann" style="min-height:60px;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:700;font-size:13.5px;line-height:1.5">
        Announcement will appear here...
      </div>
      <div class="btn-row">
        <button class="btn btn--danger btn--block" id="td-wait">😤 Wait More</button>
      </div>
      <div class="btn-row">
        <button class="btn btn--ghost btn--block" id="td-reset">↺ New Journey</button>
      </div>
    </div>
  `;

  function init(){
    delay = 0;
    train = pick(TRAINS);
    $('#td-train', root).textContent = train;
    $('#td-delay', root).textContent = '0 min';
    $('#td-ann', root).textContent = 'Sab kuch time par hai… filhal.';
  }

  $('#td-wait', root).onclick = () => {
    delay += rand(15, 90);
    $('#td-delay', root).textContent = delay + ' min';
    if (Math.random() < 0.6) {
      train = pick(TRAINS);
      $('#td-train', root).textContent = train;
    }
    let msg = pick(REASONS);
    if (delay > 180) msg += ' · Yaatri kripya sabr rakhein.';
    if (delay > 300) msg = 'Yaatri kripya apne ghar wapas jaayein. Train kal aa sakti hai.';
    if (delay > 500) msg = '🪦 Train aaj nahi aayegi. Consider flight next time.';
    $('#td-ann', root).textContent = msg;
    haptic(20);
  };

  $('#td-reset', root).onclick = init;

  init();
});

})();
