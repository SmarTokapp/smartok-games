// Olympic Torch — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'olympic-torch_muted', HI_KEY = 'olympic-torch_hi';
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
function toggleMute(){ isMuted = !isMuted; localStorage.setItem(MUTE_KEY, String(isMuted)); document.querySelectorAll('.audio-btn').forEach(b=>b.textContent = isMuted ? '🔇' : '🔊'); if(bgm){ if(isMuted) bgm.pause(); else bgm.play().catch(()=>{}); } }
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function renderHud(){ $('scoreVal').textContent = score; $('livesVal').textContent = '♥'.repeat(lives) + '♡'.repeat(Math.max(0,3-lives)); }
function addScore(n){ score += n; if(score > hi){ hi = score; newRec = true; localStorage.setItem(HI_KEY, String(hi)); } renderHud(); }
function loseLife(){ lives--; renderHud(); sfxBad(); if(lives <= 0) setTimeout(endGame, 600); }
function endGame(){ playing = false; $('finalScore').textContent = score; $('bestScore').textContent = hi; $('newBest').style.display = newRec ? 'block' : 'none'; sfxOver(); show('overScreen'); }
function goMenu(){ playing = false; if(bgm) bgm.pause(); bgmStarted = false; $('hiStart').textContent = hi; show('startScreen'); }

document.addEventListener('DOMContentLoaded', async () => {
  await gameI18n.init('olympic-torch');
  $('hiStart').textContent = hi;
  document.querySelectorAll('.audio-btn').forEach(b => {
    b.textContent = isMuted ? '🔇' : '🔊';
    b.addEventListener('pointerdown', e => { e.preventDefault(); toggleMute(); });
  });
  $('startBtn').addEventListener('pointerdown', e => { e.preventDefault(); startGame(); });
  $('againBtn').addEventListener('pointerdown', e => { e.preventDefault(); startGame(); });
  $('menuBtn').addEventListener('pointerdown', e => { e.preventDefault(); goMenu(); });
  $('backBtn').addEventListener('pointerdown', e => { e.preventDefault(); goMenu(); });
});
let level = 1, seq = [], expect = 0, cur = null, lock = false, qcount = 0, selEl = null, left = 0, first = null, lockB = false, strikes = 0, found = 0, idx = 0, accepting = false, timer = null, got = 0, need = 0;
const QTIME = 5000;

const DATA = {"sets":[["Ancient Games (776 BC)","First modern Games (1896)","First Winter Games (1924)","First Tokyo Games (1964)"],["Athens 1896","Paris 1900","London 1908","Tokyo 1964","Sydney 2000"],["Paris 1900","Berlin 1936","London 1948","Los Angeles 1984","Rio 2016"],["Gold (1st)","Silver (2nd)","Bronze (3rd)"],["100m sprint","400m lap","1500m race","Marathon (42 km)"],["Torch lit in Olympia","Torch relay","Opening ceremony","Events","Closing ceremony"],["Pentathlon (5 events)","Heptathlon (7 events)","Decathlon (10 events)"]]};

function nextRound(){
  const s = DATA.sets[Math.floor(Math.random()*DATA.sets.length)];
  const len = Math.min(s.length, Math.min(6, 3 + Math.floor((level-1)/2)));
  seq = s.slice(0, len); expect = 0;
  const disp = [...seq].sort(() => Math.random() - 0.5);
  const b = $('board'); b.innerHTML = '';
  $('prog').textContent = '0/' + seq.length;
  disp.forEach(name => {
    const el = document.createElement('button');
    el.className = 'tile'; el.textContent = name;
    el.addEventListener('pointerdown', ev => { ev.preventDefault(); onPick(el, name); });
    b.appendChild(el);
  });
}
function onPick(el, name){
  if(!playing || el.disabled) return;
  if(name === seq[expect]){
    el.disabled = true; el.classList.add('done'); expect++; sfxTap();
    $('prog').textContent = expect + '/' + seq.length;
    if(expect >= seq.length){ sfxWin(); addScore(10*seq.length + level*5); level++; setTimeout(() => { if(playing) nextRound(); }, 700); }
  } else {
    el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 320); loseLife();
  }
}
function startGame(){ score = 0; lives = 3; newRec = false; level = 1; seq = []; playing = true; renderHud(); startBgm(); show('gameScreen'); if(typeof buildPads === 'function') buildPads(); nextRound(); }
