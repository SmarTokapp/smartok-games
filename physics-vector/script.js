// Physics Vector — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'physics-vector_muted', HI_KEY = 'physics-vector_hi';
let isMuted = localStorage.getItem(MUTE_KEY) === 'true';
let bgm = null, bgmStarted = false, audioCtx = null;
let score = 0, lives = 3, hi = parseInt(localStorage.getItem(HI_KEY)) || 0;
let playing = false, newRec = false;

function ac(){ if(!audioCtx){ try{ audioCtx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(audioCtx && audioCtx.state==='suspended') audioCtx.resume().catch(()=>{}); return audioCtx; }
function tone(f,d,type,v,when){ if(isMuted) return; const c=ac(); if(!c) return; try{ const o=c.createOscillator(),g=c.createGain(); o.type=type||'sine'; o.frequency.value=f; g.gain.value=v||0.15; o.connect(g); g.connect(c.destination); const t0=c.currentTime+(when||0); o.start(t0); g.gain.exponentialRampToValueAtTime(0.001,t0+(d||0.15)); o.stop(t0+(d||0.15)); }catch(e){} }
const sfxTap = () => tone(600,0.08,'sine',0.12);
const sfxOk  = () => { tone(660,0.1); tone(880,0.15,'sine',0.15,0.08); };
const sfxBad = () => tone(140,0.25,'sawtooth',0.2);
const sfxOver= () => { tone(300,0.15,'sawtooth',0.2); tone(180,0.3,'sawtooth',0.2,0.15); tone(90,0.4,'sawtooth',0.2,0.3); };
const sfxWin = () => { tone(523,0.1); tone(659,0.1,'sine',0.15,0.1); tone(784,0.2,'sine',0.15,0.2); };

function startBgm(){ if(bgmStarted) return; bgmStarted = true; bgm = new Audio('bgm.mp3'); bgm.loop = true; bgm.volume = 0.3; if(!isMuted) bgm.play().catch(()=>{}); }
function toggleMute(){ isMuted = !isMuted; localStorage.setItem(MUTE_KEY, String(isMuted)); document.querySelectorAll('.audio-btn').forEach(b=>b.textContent = isMuted ? '\u{1F507}' : '\u{1F50A}'); if(bgm){ if(isMuted) bgm.pause(); else bgm.play().catch(()=>{}); } }
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function renderHud(){ $('scoreVal').textContent = score; $('livesVal').textContent = '\u2665'.repeat(lives) + '\u2661'.repeat(Math.max(0,3-lives)); }
function addScore(n){ score += n; if(score > hi){ hi = score; newRec = true; localStorage.setItem(HI_KEY, String(hi)); } renderHud(); }
function loseLife(){ lives--; renderHud(); sfxBad(); if(lives <= 0) setTimeout(endGame, 600); }
function endGame(){ playing = false; $('finalScore').textContent = score; $('bestScore').textContent = hi; $('newBest').style.display = newRec ? 'block' : 'none'; sfxOver(); show('overScreen'); }
function goMenu(){ playing = false; if(bgm) bgm.pause(); bgmStarted = false; $('hiStart').textContent = hi; show('startScreen'); }

document.addEventListener('DOMContentLoaded', async () => {
  await gameI18n.init('physics-vector');
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

const DATA = {"facts":[{"s":"Force = mass × acceleration","v":true},{"s":"Gravity pulls objects upward","v":false},{"s":"Light travels faster than sound","v":true},{"s":"Newton's 1st law is inertia","v":true},{"s":"The unit of force is the Watt","v":false},{"s":"Velocity is a vector","v":true},{"s":"Objects fall at different speeds in a vacuum","v":false},{"s":"Friction opposes motion","v":true},{"s":"Energy can be destroyed","v":false},{"s":"m/s² is a unit of acceleration","v":true},{"s":"Mass and weight are the same thing","v":false},{"s":"Sound needs a medium to travel","v":true},{"s":"The unit of energy is the Joule","v":true},{"s":"Momentum = mass × velocity","v":true},{"s":"Magnets attract all metals","v":false},{"s":"Action and reaction are equal and opposite","v":true}]};

function nextRound(){
  cur = DATA.facts[Math.floor(Math.random()*DATA.facts.length)];
  $('qText').textContent = cur.s;
  const bar = $('tbar');
  bar.style.transition = 'none'; bar.style.width = '100%'; void bar.offsetWidth;
  bar.style.transition = 'width ' + QTIME + 'ms linear'; bar.style.width = '0%';
  clearTimeout(timer);
  timer = setTimeout(() => { if(playing){ loseLife(); if(lives > 0) nextRound(); } }, QTIME);
}
function answer(v){
  if(!playing || !cur) return; clearTimeout(timer);
  if(v === cur.v){ sfxOk(); addScore(10 + level*2); level++; }
  else loseLife();
  if(playing && lives > 0) nextRound();
}
function startGame(){ score = 0; lives = 3; newRec = false; level = 1; seq = []; playing = true; renderHud(); startBgm(); show('gameScreen'); if(typeof buildPads === 'function') buildPads(); nextRound(); }
