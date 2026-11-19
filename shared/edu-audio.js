/* ═══════════════════════════════════════════════════════════════════
 * shared/edu-audio.js — SmarTok EduGames shared audio engine.
 *
 * Zero-dependency Web Audio module providing:
 *   • Autoplay-safe AudioContext unlock on the first user gesture
 *   • Theme-matched procedural ambient music per game (gentle loop,
 *     ~0.12 master gain, pauses on visibilitychange)
 *   • Procedural SFX API: window.EduAudio.{playClick,playCorrect,
 *     playWrong,playWin,setMuted,isMuted}
 *   • Smart auto-hooks: soft click on button taps + MutationObserver
 *     feedback sounds on standard .correct/.wrong/.win class changes
 *   • Mute state synced with each game's native .audio-btn toggle
 *     (<slug>_muted + shared 'smartok-edugames-muted' key)
 * ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MUTED_KEY = 'smartok-edugames-muted';
  var MUSIC_GAIN = 0.12;   // subtle background level
  var SFX_GAIN = 0.5;

  /* ── Game slug → music theme assignment ───────────────────────── */
  var THEMES = {
    space:   ['astro-orbit', 'solar-flare', 'atom-builder', 'gravity-well',
              'quantum-spark', 'stellar-clock', 'rocket-stage'],
    nature:  ['terra-atlas', 'bio-pulse', 'eco-web', 'flora-lab',
              'ocean-abyss', 'weather-front', 'river-delta', 'cell-mitosis',
              'volcano-core', 'nutri-balance', 'polar-expedition',
              'dino-epoch', 'micro-cosmos', 'desert-mirage',
              'forest-canopy', 'island-archipelago', 'vital-organ',
              'glacier-fjord'],
    tech:    ['chem-forge', 'logic-circuit', 'fraction-prism', 'quantum-angle',
              'cortex-pairs', 'physics-vector', 'cipher-key', 'prime-reactor',
              'code-syntax', 'symmetry-grid', 'algebra-scale', 'mineral-vault',
              'metric-scale', 'chess-tactic', 'stat-prob', 'cyber-shield',
              'bridge-span', 'alloy-smith', 'pixel-grid'],
    culture: ['chrono-vault', 'rome-dynasty', 'landmark-beacon',
              'heritage-quest', 'fossil-strata', 'flag-guild', 'currency-mint',
              'art-atelier', 'compass-star', 'inventor-spark', 'sky-ward',
              'civic-pillar', 'arch-blueprint', 'culinary-atlas',
              'cinema-reel', 'olympic-torch', 'textile-loom', 'market-ledger'],
    language:['lexicon-rune', 'harmonic-wave', 'polyglot-spark',
              'mythos-scroll', 'neuro-spark', 'idiom-vault', 'roman-numeral',
              'tempo-pulse', 'script-scroll', 'color-spectrum', 'morse-signal',
              'grammar-forge', 'spelling-anvil', 'sound-acoustic',
              'lit-classic', 'etymology-tree', 'philo-mind', 'poetry-meter']
  };
  var SLUG_TO_THEME = {};
  Object.keys(THEMES).forEach(function (t) {
    THEMES[t].forEach(function (s) { SLUG_TO_THEME[s] = t; });
  });

  function detectSlug() {
    var el = document.querySelector('[data-game-slug]');
    if (el && el.getAttribute('data-game-slug')) {
      return el.getAttribute('data-game-slug');
    }
    var parts = (window.location.pathname || '').split('/').filter(Boolean);
    var last = parts[parts.length - 1] || '';
    if (/index\.html?$/i.test(last)) last = parts[parts.length - 2] || '';
    return last.replace(/\.html?$/i, '').toLowerCase();
  }
  var SLUG = detectSlug();
  var GAME_MUTE_KEY = SLUG + '_muted'; // each game's own per-game mute key

  /* ── Theme musical profiles (midi notes) ────────────────────────
   * chords: progression looped one per bar; arp: note pool for gentle
   * melodic movement; bar: ms per bar; wave/cutoff: voice character. */
  var PROFILE = {
    space: {   // warm ethereal pads + sparse pentatonic arpeggios
      chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]],
      arp: [69, 72, 76, 79, 81], bar: 5200, wave: 'sine', cutoff: 900,
      padLevel: 0.5, arpProb: 0.6, style: 'pad'
    },
    nature: {  // organic kalimba/marimba soft plucks + warm chords
      chords: [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]],
      arp: [72, 74, 76, 79, 81, 84], bar: 3800, wave: 'triangle', cutoff: 2400,
      padLevel: 0.34, arpProb: 0.85, style: 'pluck'
    },
    tech: {    // clean minimalist lo-fi electronic pulse
      chords: [[50, 57, 62, 65], [46, 53, 58, 62], [53, 60, 65, 69], [48, 55, 60, 64]],
      arp: [62, 65, 69, 72, 74], bar: 4000, wave: 'triangle', cutoff: 1600,
      padLevel: 0.4, arpProb: 0.7, style: 'pulse'
    },
    culture: { // warm acoustic harp-style modal melody
      chords: [[43, 50, 55, 59], [40, 47, 52, 55], [48, 55, 60, 64], [50, 57, 62, 66]],
      arp: [67, 71, 74, 76, 79], bar: 4200, wave: 'triangle', cutoff: 2000,
      padLevel: 0.36, arpProb: 0.8, style: 'harp'
    },
    language: {// melodic piano/bell intervals
      chords: [[52, 59, 64, 67], [48, 55, 60, 64], [43, 50, 55, 59], [45, 52, 57, 60]],
      arp: [76, 79, 83, 84, 88], bar: 4600, wave: 'sine', cutoff: 3200,
      padLevel: 0.32, arpProb: 0.75, style: 'bell'
    }
  };

  var theme = PROFILE[SLUG_TO_THEME[SLUG] || 'language'];

  /* ── Mute state (shared key + the game's own per-game key) ────── */
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* quota */ } }
  var sharedMuted = lsGet(MUTED_KEY) === '1';
  function gameMuted() { return lsGet(GAME_MUTE_KEY) === 'true'; }
  function audible() { return !sharedMuted && !gameMuted(); }

  /* ── AudioContext graph (created lazily on first gesture) ─────── */
  var ctx = null, master = null, musicBus = null, sfxBus = null, echo = null;
  var musicTimer = null, musicOn = false;

  function ensureCtx() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume().catch(function () {});
      return ctx;
    }
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try { ctx = new AC(); } catch (e) { return null; }
    master = ctx.createGain();
    master.gain.value = audible() ? 1 : 0;
    master.connect(ctx.destination);

    sfxBus = ctx.createGain();
    sfxBus.gain.value = SFX_GAIN;
    sfxBus.connect(master);

    musicBus = ctx.createGain();
    musicBus.gain.value = MUSIC_GAIN;
    musicBus.connect(master);

    // Cheap ambience: a short feedback delay acts as a soft space/reverb.
    echo = ctx.createDelay(1.0);
    echo.delayTime.value = 0.31;
    var fb = ctx.createGain();
    fb.gain.value = 0.24;
    var wet = ctx.createGain();
    wet.gain.value = 0.5;
    echo.connect(fb); fb.connect(echo);
    echo.connect(wet); wet.connect(musicBus);

    if (ctx.state === 'suspended') ctx.resume().catch(function () {});
    return ctx;
  }

  function midi(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  /* ── Ambient music voices ─────────────────────────────────────── */
  function padChord(midis, durSec) {
    var t0 = ctx.currentTime;
    var lp = ctx.createBiquadFilter();
    lp.type = 'lowpass'; lp.frequency.value = theme.cutoff;
    lp.connect(musicBus); lp.connect(echo);
    midis.forEach(function (m, i) {
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = theme.wave;
      o.frequency.value = midi(m);
      o.detune.value = (i % 2 ? 4 : -4);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(theme.padLevel / midis.length, t0 + 1.2);
      g.gain.setValueAtTime(theme.padLevel / midis.length, t0 + durSec - 1.2);
      g.gain.linearRampToValueAtTime(0.0001, t0 + durSec);
      o.connect(g); g.connect(lp);
      o.start(t0); o.stop(t0 + durSec + 0.05);
    });
  }

  function pluck(midiNote, when, level, decay) {
    var t0 = ctx.currentTime + (when || 0);
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = theme.wave === 'sine' ? 'triangle' : theme.wave;
    o.frequency.value = midi(midiNote);
    g.gain.setValueAtTime(level || 0.10, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + (decay || 1.4));
    o.connect(g); g.connect(musicBus); g.connect(echo);
    o.start(t0); o.stop(t0 + (decay || 1.4) + 0.05);
    // Bell-style octave sparkle for the language theme.
    if (theme.style === 'bell') {
      var o2 = ctx.createOscillator(), g2 = ctx.createGain();
      o2.type = 'sine'; o2.frequency.value = midi(midiNote + 12);
      g2.gain.setValueAtTime((level || 0.10) * 0.35, t0);
      g2.gain.exponentialRampToValueAtTime(0.0006, t0 + (decay || 1.4) * 0.6);
      o2.connect(g2); g2.connect(musicBus); g2.connect(echo);
      o2.start(t0); o2.stop(t0 + (decay || 1.4));
    }
  }

  // tempo-pulse: a soft percussive tick reinforces the rhythm theme.
  function softTick(when) {
    var t0 = ctx.currentTime + when;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(180, t0);
    o.frequency.exponentialRampToValueAtTime(80, t0 + 0.06);
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.09);
    o.connect(g); g.connect(musicBus);
    o.start(t0); o.stop(t0 + 0.1);
  }

  // morse-signal: a quiet clean sine dit/dah motif drifts under the bells.
  function morseBeep(when, dur) {
    var t0 = ctx.currentTime + when;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = 720;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.05, t0 + 0.01);
    g.gain.setValueAtTime(0.05, t0 + dur - 0.01);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(musicBus);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  var chordIdx = 0;
  function scheduleBar() {
    if (!ctx || !musicOn) return;
    var barSec = theme.bar / 1000;
    padChord(theme.chords[chordIdx % theme.chords.length], barSec + 1.0);
    if (Math.random() < theme.arpProb) {
      var n = theme.arp[Math.floor(Math.random() * theme.arp.length)];
      pluck(n, 0.6 + Math.random() * (barSec - 1.8), 0.09);
      if (Math.random() < 0.4) {
        var n2 = theme.arp[Math.floor(Math.random() * theme.arp.length)];
        pluck(n2, 0.6 + Math.random() * (barSec - 1.8), 0.06);
      }
    }
    if (SLUG === 'tempo-pulse') {
      softTick(0); softTick(barSec / 2);
    }
    if (SLUG === 'morse-signal') {
      // Quiet "dit-dah" motif once per bar.
      morseBeep(0.8, 0.09); morseBeep(1.05, 0.27); morseBeep(1.5, 0.09);
    }
    chordIdx++;
  }

  function startMusic() {
    if (!ensureCtx() || musicOn) return;
    musicOn = true;
    chordIdx = 0;
    scheduleBar();
    musicTimer = setInterval(scheduleBar, theme.bar);
  }
  function stopMusic() {
    musicOn = false;
    if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  }

  // Keep the whole graph silent while either mute is engaged.
  function refreshMaster() {
    if (master) master.gain.value = audible() ? 1 : 0;
  }

  /* ── Procedural SFX ───────────────────────────────────────────── */
  function blip(freq, dur, type, level, when, slideTo) {
    var c = ensureCtx(); if (!c) return;
    refreshMaster();
    var t0 = c.currentTime + (when || 0);
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t0);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(level, t0);
    g.gain.exponentialRampToValueAtTime(0.0008, t0 + dur);
    o.connect(g); g.connect(sfxBus);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function playClick() {
    if (!audible()) return;
    blip(700, 0.05, 'sine', 0.05);
  }
  function playCorrect() {
    if (!audible()) return;
    blip(523.25, 0.12, 'triangle', 0.16);
    blip(783.99, 0.18, 'triangle', 0.16, 0.09);
  }
  function playWrong() {
    if (!audible()) return;
    blip(170, 0.28, 'sawtooth', 0.11, 0, 105);
  }
  function playWin() {
    if (!audible()) return;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    for (var i = 0; i < notes.length; i++) {
      blip(notes[i], 0.22, 'triangle', 0.16, i * 0.11);
    }
  }

  /* ── Autoplay unlock (first gesture) ──────────────────────────── */
  var unlocked = false;
  function unlock() {
    if (unlocked) return;
    if (!ensureCtx()) return;
    unlocked = true;
    refreshMaster();
    startMusic();
  }
  ['pointerdown', 'touchstart', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, unlock, { passive: true });
  });

  /* ── Pause/resume cleanly on tab switch / minimize ────────────── */
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) {
      stopMusic();
      ctx.suspend().catch(function () {});
    } else {
      ctx.resume().catch(function () {}).then(function () {
        if (unlocked) startMusic();
      });
    }
  });

  /* ── Smart auto-hooks ─────────────────────────────────────────── */
  // Soft click on any button/option tap — throttled so rapid taps
  // cannot stack into a buzz.
  var lastClick = 0;
  document.addEventListener('pointerdown', function (e) {
    var t = e.target && e.target.closest
      ? e.target.closest('button, .btn, .tile, .option, [role="button"], a')
      : null;
    if (!t) return;
    var now = Date.now();
    if (now - lastClick < 70) return;
    lastClick = now;
    playClick();
  }, { passive: true });

  // Feedback observer: watches for standard result classes appearing
  // on the DOM for games that never call window.EduAudio directly.
  var FEEDBACK = [
    [/victory|win|complete|passed/i, playWin],
    [/correct|success|right|good/i, playCorrect],
    [/wrong|incorrect|error|fail|shake|miss/i, playWrong]
  ];
  var seenNodes = typeof WeakSet !== 'undefined' ? new WeakSet() : null;
  function scanNode(node) {
    if (!node || node.nodeType !== 1 || (seenNodes && seenNodes.has(node))) return;
    var cls = typeof node.className === 'string' ? node.className : '';
    var id = node.id || '';
    var tag = (cls + ' ' + id).toLowerCase();
    for (var i = 0; i < FEEDBACK.length; i++) {
      if (FEEDBACK[i][0].test(tag)) {
        if (seenNodes) {
          seenNodes.add(node);
          setTimeout(function () { seenNodes.delete(node); }, 1200);
        }
        FEEDBACK[i][1]();
        return;
      }
    }
  }
  function hookFeedbackObserver() {
    if (typeof MutationObserver === 'undefined' || !document.body) return;
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        if (m.type === 'attributes' && m.target) scanNode(m.target);
        if (m.addedNodes) {
          for (var i = 0; i < m.addedNodes.length; i++) {
            scanNode(m.addedNodes[i]);
          }
        }
      });
    }).observe(document.body, {
      attributes: true, attributeFilter: ['class'],
      childList: true, subtree: true
    });
  }

  /* ── Mute state ───────────────────────────────────────────────────
   * No floating button is injected — each game's native top-bar
   * .audio-btn is the single mute control. It writes <slug>_muted,
   * which audible()/gameMuted() pick up on every sound + master gain.
   */
  function setMuted(m) {
    sharedMuted = !!m;
    lsSet(MUTED_KEY, sharedMuted ? '1' : '0');
    refreshMaster();
  }
  function isMuted() { return sharedMuted; }

  // When a game flips its own .audio-btn mute, re-sync our master gain.
  document.addEventListener('pointerdown', function (e) {
    if (!e.target || !e.target.closest || !e.target.closest('.audio-btn')) return;
    setTimeout(refreshMaster, 60);
  }, { passive: true });

  /* ── Public API ───────────────────────────────────────────────── */
  window.EduAudio = {
    playClick: playClick,
    playCorrect: playCorrect,
    playWrong: playWrong,
    playWin: playWin,
    setMuted: setMuted,
    isMuted: isMuted
  };

  /* ── Boot ─────────────────────────────────────────────────────── */
  function boot() {
    hookFeedbackObserver();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
