// Bridge Span — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'bridge-span_muted', HI_KEY = 'bridge-span_hi';
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
function toggleMute(){ isMuted = !isMuted; localStorage.setItem(MUTE_KEY, String(isMuted)); document.querySelectorAll('.audio-btn').forEach(b=>b.textContent = isMuted ? '🔇' : '🔊'); if(bgm){ if(isMuted) bgm.pause(); else bgm.play().catch(()=>{}); } }
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); }
function renderHud(){ $('scoreVal').textContent = score; $('livesVal').textContent = '♥'.repeat(lives) + '♡'.repeat(Math.max(0,3-lives)); }
function addScore(n){ score += n; if(score > hi){ hi = score; newRec = true; localStorage.setItem(HI_KEY, String(hi)); } renderHud(); }
function loseLife(){ lives--; renderHud(); sfxBad(); if(lives <= 0) setTimeout(endGame, 600); }
function endGame(){ playing = false; $('finalScore').textContent = score; $('bestScore').textContent = hi; $('newBest').style.display = newRec ? 'block' : 'none'; sfxOver(); show('overScreen'); }
function goMenu(){ playing = false; if(bgm) bgm.pause(); bgmStarted = false; $('hiStart').textContent = hi; show('startScreen'); }

document.addEventListener('DOMContentLoaded', async () => {
  await gameI18n.init('bridge-span');
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

const DATA = {"questions":[{"q":"Suspension bridges hang from?","a":"Cables","wrong":["Arches","Pillars only","Trusses"]},{"q":"An arch bridge transfers load by?","a":"Compression","wrong":["Tension only","Floating","Torsion"]},{"q":"The Golden Gate spans?","a":"San Francisco Bay","wrong":["The Hudson","The Thames","Sydney Harbour"]},{"q":"Trusses are made of?","a":"Triangles","wrong":["Circles","Squares","Arches"]},{"q":"Beam bridges work best for?","a":"Short spans","wrong":["The longest spans","Deep oceans","Mountains"]},{"q":"Cable-stayed bridges attach cables to?","a":"Towers","wrong":["Arches","Pontoons","Water"]},{"q":"Longest sea-crossing bridge?","a":"Hong Kong–Zhuhai–Macau","wrong":["Golden Gate","Brooklyn","Tower Bridge"]},{"q":"The Brooklyn Bridge opened in?","a":"1883","wrong":["1901","1776","1950"]},{"q":"A cantilever bridge supports with?","a":"Projecting arms","wrong":["Cables only","Floats","Chains"]},{"q":"The Akashi Kaikyō bridge is in?","a":"Japan","wrong":["USA","France","Brazil"]},{"q":"The keystone belongs in an?","a":"Arch","wrong":["Suspension cable","Truss joint","Beam end"]},{"q":"Pont du Gard is a Roman?","a":"Aqueduct bridge","wrong":["Castle","Tunnel","Dam"]},{"q":"Tower Bridge is in?","a":"London","wrong":["Paris","New York","Prague"]},{"q":"A liftable drawbridge is called?","a":"Bascule","wrong":["Truss","Arch","Pontoon"]},{"q":"Floating bridges rest on?","a":"Pontoons","wrong":["Cables","Pillars","Arches"]},{"q":"Scotland’s Forth Bridge is a?","a":"Cantilever","wrong":["Suspension","Beam","Floating"]}]};

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
