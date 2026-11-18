// Mythos Scroll — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'mythos-scroll_muted', HI_KEY = 'mythos-scroll_hi';
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
  await gameI18n.init('mythos-scroll');
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

const DATA = {"pairs":[["Zeus","Greece"],["Ra","Egypt"],["Odin","Norse"],["Anubis","Egypt"],["Athena","Greece"],["Thor","Norse"],["Horus","Egypt"],["Poseidon","Greece"],["Loki","Norse"],["Osiris","Egypt"],["Quetzalcoatl","Aztec"],["Amaterasu","Japan"],["Apollo","Greece"],["Freya","Norse"],["Isis","Egypt"],["Sun Wukong","China"],["Ares","Greece"],["Bastet","Egypt"],["Heimdall","Norse"],["Susanoo","Japan"]],"useCols":true};

function nextRound(){
  selEl = null;
  const n = Math.min(DATA.pairs.length, Math.min(5, 3 + Math.floor(level/2)));
  const picks = [...DATA.pairs].sort(() => Math.random() - 0.5).slice(0, n);
  left = picks.length;
  const lc = $('colL'), rc = $('colR'); lc.innerHTML = ''; rc.innerHTML = '';
  [...picks].sort(() => Math.random() - 0.5).forEach(p => {
    const el = document.createElement('button'); el.className = 'tile pair'; el.textContent = p[0]; el._p = p;
    el.addEventListener('pointerdown', e => { e.preventDefault(); onTap(el); });
    lc.appendChild(el);
  });
  [...picks].sort(() => Math.random() - 0.5).forEach(p => {
    const el = document.createElement('button'); el.className = 'tile pair'; el.textContent = p[1]; el._p = p;
    el.addEventListener('pointerdown', e => { e.preventDefault(); onTap(el); });
    rc.appendChild(el);
  });
}
function onTap(el){
  if(!playing || el.disabled) return;
  if(!selEl){ selEl = el; el.classList.add('sel'); sfxTap(); return; }
  if(el === selEl){ selEl = null; el.classList.remove('sel'); return; }
  if(el._p === selEl._p){
    el.disabled = true; selEl.disabled = true;
    el.classList.remove('sel'); selEl.classList.remove('sel');
    el.classList.add('done'); selEl.classList.add('done');
    selEl = null; sfxOk(); addScore(15); left--;
    if(left <= 0){ sfxWin(); level++; addScore(level*10); setTimeout(() => { if(playing) nextRound(); }, 700); }
  } else {
    const a = el, b = selEl; selEl = null;
    a.classList.add('bad'); b.classList.add('bad');
    setTimeout(() => { a.classList.remove('bad'); b.classList.remove('bad'); b.classList.remove('sel'); }, 350);
    loseLife();
  }
}
function startGame(){ score = 0; lives = 3; newRec = false; level = 1; seq = []; playing = true; renderHud(); startBgm(); show('gameScreen'); if(typeof buildPads === 'function') buildPads(); nextRound(); }
