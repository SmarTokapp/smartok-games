// Fraction Prism — SmarTokGames
function t(k){ return gameI18n.t(k); }
const $ = (id) => document.getElementById(id);
const MUTE_KEY = 'fraction-prism_muted', HI_KEY = 'fraction-prism_hi';
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
  await gameI18n.init('fraction-prism');
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

const DATA = {"questions":[{"q":"1/2 equals?","a":"50%","wrong":["25%","75%","33%"]},{"q":"2/4 simplifies to?","a":"1/2","wrong":["1/3","2/3","1/4"]},{"q":"1/4 equals?","a":"25%","wrong":["50%","20%","40%"]},{"q":"3/9 simplifies to?","a":"1/3","wrong":["1/2","2/3","3/4"]},{"q":"3/4 equals?","a":"75%","wrong":["70%","60%","80%"]},{"q":"4/8 simplifies to?","a":"1/2","wrong":["1/4","2/3","3/4"]},{"q":"1/5 equals?","a":"20%","wrong":["15%","25%","50%"]},{"q":"5/10 simplifies to?","a":"1/2","wrong":["1/5","2/5","1/4"]},{"q":"2/5 equals?","a":"40%","wrong":["20%","50%","60%"]},{"q":"6/8 simplifies to?","a":"3/4","wrong":["1/2","2/3","4/5"]},{"q":"1/10 equals?","a":"10%","wrong":["1%","20%","5%"]},{"q":"10/15 simplifies to?","a":"2/3","wrong":["1/2","3/5","5/6"]},{"q":"1/3 is about?","a":"33%","wrong":["30%","25%","40%"]},{"q":"4/5 equals?","a":"80%","wrong":["75%","60%","85%"]},{"q":"9/12 simplifies to?","a":"3/4","wrong":["2/3","1/2","4/5"]},{"q":"0.5 as a fraction?","a":"1/2","wrong":["1/3","2/3","1/4"]}]};

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
