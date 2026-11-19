// Symmetry Grid — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'symmetry-grid_muted', HI_KEY = 'symmetry-grid_hi';
let isMuted = localStorage.getItem(MUTE_KEY) === 'true';
let bgm = null, bgmStarted = false, audioCtx = null;
let score = 0, lives = 3, hi = parseInt(localStorage.getItem(HI_KEY)) || 0;
let playing = false, newRec = false;

function ac(){ if(!audioCtx){ try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(audioCtx && audioCtx.state==='suspended') audioCtx.resume().catch(()=>{}); return audioCtx; }
function tone(f,d,type,v,when){ if(isMuted) return; const c=ac(); if(!c) return; try{ const o=c.createOscillator(),g=c.createGain(); o.type=type||'sine'; o.frequency.value=f; g.gain.value=v||0.15; o.connect(g); g.connect(c.destination); const t0=c.currentTime+(when||0); o.start(t0); g.gain.exponentialRampToValueAtTime(0.001,t0+(d||0.15)); o.stop(t0+(d||0.15)); }catch(e){} }
const sfxTap = () => tone(600,0.08,'sine',0.12);
const sfxOk  = () => { tone(660,0.1); tone(880,0.15,'sine',0.15,0.08); window.EduAudio?.playCorrect(); };
const sfxBad = () => { tone(140,0.25,'sawtooth',0.2); window.EduAudio?.playWrong(); };
const sfxOver= () => { tone(300,0.15,'sawtooth',0.2); tone(180,0.3,'sawtooth',0.2,0.15); tone(90,0.4,'sawtooth',0.2,0.3); };
const sfxWin = () => { tone(523,0.1); tone(659,0.1,'sine',0.15,0.1); tone(784,0.2,'sine',0.15,0.2); window.EduAudio?.playWin(); };

function startBgm(){ if(bgmStarted) return; bgmStarted = true; bgm = new Audio('bgm.mp3'); bgm.loop = true; bgm.volume = 0.3; if(!isMuted) bgm.play().catch(()=>{}); }
function toggleMute(){ isMuted = !isMuted; localStorage.setItem(MUTE_KEY, String(isMuted)); document.querySelectorAll('.audio-btn').forEach(b=>b.textContent = isMuted ? '\u{1F507}' : '\u{1F50A}'); if(bgm){ if(isMuted) bgm.pause(); else bgm.play().catch(()=>{}); } }
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function renderHud(){ $('scoreVal').textContent = score; $('livesVal').textContent = '\u2665'.repeat(lives) + '\u2661'.repeat(Math.max(0,3-lives)); }
function addScore(n){ score += n; if(score > hi){ hi = score; newRec = true; localStorage.setItem(HI_KEY, String(hi)); } renderHud(); }
function loseLife(){ lives--; renderHud(); sfxBad(); if(lives <= 0) setTimeout(endGame, 600); }
function endGame(){ playing = false; $('finalScore').textContent = score; $('bestScore').textContent = hi; $('newBest').style.display = newRec ? 'block' : 'none'; sfxOver(); show('overScreen'); }
function goMenu(){ playing = false; if(bgm) bgm.pause(); bgmStarted = false; $('hiStart').textContent = hi; show('startScreen'); }

document.addEventListener('DOMContentLoaded', async () => {
  await gameI18n.init('symmetry-grid');
  $('hiStart').textContent = hi;
  document.querySelectorAll('.audio-btn').forEach(b => {
    b.textContent = isMuted ? '\u{1F507}' : '\u{1F50A}';
    b.addEventListener('pointerdown', e => { e.preventDefault(); toggleMute(); });
  });
  $('startBtn').addEventListener('pointerdown', e => { e.preventDefault(); startGame(); });
  $('againBtn').addEventListener('pointerdown', e => { e.preventDefault(); startGame(); });
  $('menuBtn').addEventListener('pointerdown', e => { e.preventDefault(); goMenu(); });
  $('backBtn').addEventListener('pointerdown', e => { e.preventDefault(); goMenu(); });
});
let level = 1, seq = [], expect = 0, cur = null, lock = false, qcount = 0, selEl = null, left = 0, first = null, lockB = false, strikes = 0, found = 0, idx = 0, accepting = false, timer = null, got = 0, need = 0;
const QTIME = 5000;

const DATA = {"questions":[{"q":"Lines of symmetry in a square?","a":"4","wrong":["2","8","1"]},{"q":"Lines of symmetry in a circle?","a":"Infinite","wrong":["1","4","0"]},{"q":"Equilateral triangle has?","a":"3 lines","wrong":["1 line","4 lines","0 lines"]},{"q":"Rectangle has?","a":"2 lines","wrong":["4 lines","1 line","0 lines"]},{"q":"Letter A has?","a":"1 line","wrong":["2 lines","0 lines","4 lines"]},{"q":"Letter H has?","a":"2 lines","wrong":["1 line","0 lines","4 lines"]},{"q":"A reflection flips over?","a":"A line","wrong":["A point","A circle","A corner"]},{"q":"A rotation turns around?","a":"A point","wrong":["A line","A side","A mirror"]},{"q":"A translation is a?","a":"Slide","wrong":["Flip","Turn","Zoom"]},{"q":"A 90° turn is a?","a":"Quarter turn","wrong":["Half turn","Full turn","Flip"]},{"q":"Isosceles triangle has?","a":"1 line","wrong":["3 lines","2 lines","0 lines"]},{"q":"Regular pentagon has?","a":"5 lines","wrong":["4 lines","6 lines","10 lines"]},{"q":"Regular hexagon has?","a":"6 lines","wrong":["5 lines","4 lines","3 lines"]},{"q":"Scalene triangle has?","a":"0 lines","wrong":["1 line","3 lines","2 lines"]},{"q":"Letter O has?","a":"Infinite lines","wrong":["2 lines","4 lines","1 line"]},{"q":"Letter M has?","a":"1 line","wrong":["0 lines","2 lines","4 lines"]}]};

function nextRound(){
  lock = false;
  cur = DATA.questions[Math.floor(Math.random()*DATA.questions.length)];
  const opts = [cur.a, ...cur.wrong].sort(() => Math.random() - 0.5);
  $('qText').textContent = cur.q;
  const b = $('board'); b.innerHTML = '';
  opts.forEach(o => {
    const el = document.createElement('button');
    el.className = 'tile opt'; el.textContent = o;
    el.addEventListener('pointerdown', e => { e.preventDefault(); onPick(el, o); });
    b.appendChild(el);
  });
}
function onPick(el, o){
  if(!playing || lock) return; lock = true;
  if(o === cur.a){
    el.classList.add('good'); sfxOk(); addScore(10 + level*2); qcount++; level = 1 + Math.floor(qcount/5);
    setTimeout(() => { if(playing) nextRound(); }, 600);
  } else {
    el.classList.add('bad'); sfxBad();
    [...$('board').children].forEach(c => { if(c.textContent === cur.a) c.classList.add('good'); });
    setTimeout(() => { if(playing && lives > 0) nextRound(); }, 700);
    loseLife();
  }
}
function startGame(){ score = 0; lives = 3; newRec = false; level = 1; seq = []; playing = true; renderHud(); startBgm(); show('gameScreen'); if(typeof buildPads === 'function') buildPads(); nextRound(); }
