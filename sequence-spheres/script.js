// Sequence Spheres: Order of Orbs
// A brain-training number game. Tap colored orbs in ascending or descending
// order based on the instruction. Levels add more orbs and harder numbers.
// Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Orb color palette (CSS gradients applied inline). Each orb gets a color.
const ORB_COLORS = [
    ['#ff4c68', '#c2185b'], // red-pink
    ['#00f3ff', '#0066aa'], // cyan
    ['#ffdd00', '#ff8800'], // gold-orange
    ['#00ffaa', '#008855'], // green
    ['#a855f7', '#6b21a8'], // purple
    ['#ff8800', '#cc4400'], // orange
    ['#3b82f6', '#1e3a8a'], // blue
    ['#ec4899', '#831843'], // pink
    ['#10b981', '#065f46'], // emerald
    ['#f59e0b', '#92400e'], // amber
    ['#8b5cf6', '#4c1d95'], // violet
    ['#06b6d4', '#0e7490'], // sky
];

// Game State
const gameState = {
    currentScreen: 'start',
    score: 0,
    level: 1,
    lives: 3,
    maxLives: 3,
    levelsCompleted: 0,
    orbs: [],          // {value, color, tapped, order}
    expectedOrder: [], // sorted values
    tapIndex: 0,       // how many correctly tapped so far
    direction: 'desc', // 'asc' = lowest first, 'desc' = highest first
    highScore: parseInt(localStorage.getItem('sequenceSpheres_highScore')) || 0
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('sequenceSpheres_muted') === 'true';
if (isMuted) bgm.muted = true;

let hasInteracted = false;
function unlockAudioOnFirstInteraction() {
    if (hasInteracted) return;
    // Resume AudioContext if it was created and is suspended (WebView unlock)
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
    // Explicitly play BGM if not muted (based on localStorage preference)
    if (!isMuted && bgm) {
        bgm.play().then(() => {
            hasInteracted = true;
            document.removeEventListener('click', unlockAudioOnFirstInteraction);
            document.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
        }).catch(e => console.log('Audio unlock deferred, will retry on next interaction:', e));
    } else {
        hasInteracted = true;
        document.removeEventListener('click', unlockAudioOnFirstInteraction);
        document.removeEventListener('touchstart', unlockAudioOnFirstInteraction);
    }
}
document.addEventListener('click', unlockAudioOnFirstInteraction);
document.addEventListener('touchstart', unlockAudioOnFirstInteraction);

// Audio Context for sound effects
let audioContext = null;
function initAudio() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!audioContext || isMuted) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    const now = audioContext.currentTime;

    if (type === 'correct') {
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now); osc.stop(now + 0.2);
    } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'levelComplete') {
        const freqs = [523, 659, 784, 1047];
        freqs.forEach((f, i) => {
            const o = audioContext.createOscillator();
            const g = audioContext.createGain();
            o.connect(g); g.connect(audioContext.destination);
            o.frequency.setValueAtTime(f, now + i * 0.1);
            g.gain.setValueAtTime(0.25, now + i * 0.1);
            g.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
            o.start(now + i * 0.1); o.stop(now + i * 0.1 + 0.2);
        });
    } else if (type === 'gameover') {
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(300, now + 0.2);
        osc.frequency.setValueAtTime(200, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}

// Fisher-Yates Shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    levelComplete: document.getElementById('levelCompleteScreen'),
    gameOver: document.getElementById('gameOverScreen')
};

const el = {
    highScoreValue: document.getElementById('highScoreValue'),
    startBtn: document.getElementById('startBtn'),
    scoreValue: document.getElementById('scoreValue'),
    levelValue: document.getElementById('levelValue'),
    livesContainer: document.getElementById('livesContainer'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    instructionBanner: document.getElementById('instructionBanner'),
    instructionIcon: document.getElementById('instructionIcon'),
    instructionText: document.getElementById('instructionText'),
    orbsArea: document.getElementById('orbsArea'),
    progressIndicator: document.getElementById('progressIndicator'),
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    finalScoreValue: document.getElementById('finalScoreValue'),
    levelsCompletedValue: document.getElementById('levelsCompletedValue'),
    finalLevelValue: document.getElementById('finalLevelValue'),
    starRating: document.getElementById('starRating'),
    levelStars: document.getElementById('levelStars'),
    levelScoreValue: document.getElementById('levelScoreValue'),
    newHighScore: document.getElementById('newHighScore'),
    replayBtn: document.getElementById('replayBtn'),
    nextLevelBtn: document.getElementById('nextLevelBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    mainMenuBtn2: document.getElementById('mainMenuBtn2')
};

// Initialize
async function init() {
    await gameI18n.init('sequence-spheres');
    el.highScoreValue.textContent = gameState.highScore;

    el.startBtn.addEventListener('click', () => {
        initAudio();
        playSound('click');
        startGame();
    });

    el.replayBtn.addEventListener('click', () => {
        playSound('click');
        startGame();
    });

    el.nextLevelBtn.addEventListener('click', () => {
        playSound('click');
        nextLevel();
    });

    el.mainMenuBtn.addEventListener('click', goToMenu);
    el.mainMenuBtn2.addEventListener('click', goToMenu);

    el.exitGameBtn.addEventListener('click', () => {
        playSound('click');
        goToMenu();
    });

    el.audioToggleBtn.addEventListener('click', toggleAudio);
    const audioToggleBtnGame = document.getElementById('audioToggleBtnGame');
    if (audioToggleBtnGame) audioToggleBtnGame.addEventListener('click', toggleAudio);

    // Credits modal
    const creditsBtn = document.getElementById('creditsBtn');
    const creditsModal = document.getElementById('creditsModal');
    const closeCreditsBtn = document.getElementById('closeCreditsBtn');
    if (creditsBtn) creditsBtn.addEventListener('click', () => { playSound('click'); creditsModal.classList.add('show'); });
    if (closeCreditsBtn) closeCreditsBtn.addEventListener('click', () => { playSound('click'); creditsModal.classList.remove('show'); });
    if (creditsModal) creditsModal.addEventListener('click', (e) => { if (e.target === creditsModal) creditsModal.classList.remove('show'); });

    updateAudioToggleIcon();
}

function goToMenu() {
    playSound('click');
    showScreen('start');
    el.highScoreValue.textContent = gameState.highScore;
}

function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('sequenceSpheres_muted', isMuted);
    updateAudioToggleIcon();
    if (isMuted) bgm.pause();
    else bgm.play().catch(e => console.log('Audio play failed:', e));
}

function updateAudioToggleIcon() {
    const icon = isMuted ? '🔇' : '🔊';
    el.audioToggleBtn.textContent = icon;
    const gameBtn = document.getElementById('audioToggleBtnGame');
    if (gameBtn) gameBtn.textContent = icon;
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    gameState.currentScreen = name;
}

function startGame() {
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = gameState.maxLives;
    gameState.levelsCompleted = 0;
    loadLevel();
    showScreen('game');
}

// Level config: orb count and number range scale with level.
function getLevelConfig(level) {
    const orbCount = Math.min(4 + Math.floor((level - 1) / 2), 12); // 4..12
    const useDecimals = level >= 4;
    const useNegatives = level >= 6;
    const maxRange = 20 + level * 10;
    return { orbCount, useDecimals, useNegatives, maxRange };
}

function generateValue(config) {
    let v;
    if (config.useNegatives && Math.random() < 0.3) {
        v = Math.floor(Math.random() * config.maxRange) - Math.floor(config.maxRange / 2);
    } else {
        v = Math.floor(Math.random() * config.maxRange) + 1;
    }
    if (config.useDecimals) {
        v = Math.round(v * 10) / 10; // one decimal place
    }
    return v;
}

function loadLevel() {
    const config = getLevelConfig(gameState.level);
    // Generate unique values so ordering is unambiguous
    const values = new Set();
    while (values.size < config.orbCount) {
        values.add(generateValue(config));
    }
    const valueArr = [...values];

    // Randomly choose direction
    gameState.direction = Math.random() < 0.5 ? 'asc' : 'desc';
    gameState.orbs = valueArr.map((v, i) => ({
        value: v,
        color: ORB_COLORS[i % ORB_COLORS.length],
        tapped: false,
        order: 0
    }));
    shuffleArray(gameState.orbs);

    // Expected order
    const sorted = [...valueArr].sort((a, b) => a - b);
    gameState.expectedOrder = gameState.direction === 'asc' ? sorted : [...sorted].reverse();
    gameState.tapIndex = 0;

    renderInstruction();
    renderOrbs();
    renderProgress();
    renderLives();
    updateScore();
    updateLevel();
}

function renderInstruction() {
    if (gameState.direction === 'asc') {
        el.instructionIcon.textContent = '⬇️';
        el.instructionText.textContent = t('lowestValue');
    } else {
        el.instructionIcon.textContent = '⬆️';
        el.instructionText.textContent = t('highestValue');
    }
}

function renderOrbs() {
    el.orbsArea.innerHTML = '';
    gameState.orbs.forEach((orb, idx) => {
        const btn = document.createElement('button');
        btn.className = 'orb' + (orb.tapped ? ' tapped' : '');
        btn.style.background = `radial-gradient(circle at 35% 30%, ${orb.color[0]}, ${orb.color[1]})`;
        btn.textContent = orb.value;
        if (orb.tapped) {
            btn.classList.add(orb.correct ? 'correct' : 'wrong');
        }
        // Order badge
        const badge = document.createElement('span');
        badge.className = 'orb-order';
        if (orb.tapped && orb.order > 0) badge.textContent = orb.order;
        btn.appendChild(badge);
        btn.addEventListener('click', () => handleOrbTap(idx, btn));
        el.orbsArea.appendChild(btn);
    });
}

function renderProgress() {
    el.progressIndicator.innerHTML = '';
    for (let i = 0; i < gameState.expectedOrder.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'progress-dot' + (i < gameState.tapIndex ? ' done' : '');
        el.progressIndicator.appendChild(dot);
    }
}

function renderLives() {
    el.livesContainer.innerHTML = '';
    for (let i = 0; i < gameState.maxLives; i++) {
        const heart = document.createElement('span');
        heart.className = 'life-icon';
        heart.textContent = '❤️';
        if (i >= gameState.lives) heart.classList.add('lost');
        el.livesContainer.appendChild(heart);
    }
}

function updateScore() {
    el.scoreValue.textContent = gameState.score;
}

function updateLevel() {
    el.levelValue.textContent = gameState.level;
}

function handleOrbTap(idx, btn) {
    initAudio();
    const orb = gameState.orbs[idx];
    if (orb.tapped) return;

    const expectedValue = gameState.expectedOrder[gameState.tapIndex];
    if (orb.value === expectedValue) {
        // Correct
        orb.tapped = true;
        orb.correct = true;
        orb.order = gameState.tapIndex + 1;
        gameState.tapIndex++;
        gameState.score += 20 * gameState.level;
        playSound('correct');
        renderOrbs();
        renderProgress();
        updateScore();
        if (gameState.tapIndex >= gameState.expectedOrder.length) {
            handleLevelComplete();
        }
    } else {
        // Wrong
        orb.tapped = true;
        orb.correct = false;
        gameState.lives--;
        playSound('wrong');
        renderOrbs();
        renderLives();
        showFeedback('❌', t('wrong'));
        if (gameState.lives <= 0) {
            handleGameOver();
        } else {
            // Brief delay then reset the level's tap progress (re-show orbs untapped)
            setTimeout(() => {
                gameState.orbs.forEach(o => { o.tapped = false; o.correct = false; o.order = 0; });
                gameState.tapIndex = 0;
                renderOrbs();
                renderProgress();
            }, 700);
        }
    }
}

function handleLevelComplete() {
    gameState.levelsCompleted++;
    const livesBonus = gameState.lives * 30;
    const levelBonus = gameState.level * 40;
    gameState.score += livesBonus + levelBonus;
    updateScore();
    playSound('levelComplete');
    showFeedback('✨', t('perfect'));

    setTimeout(() => {
        el.levelScoreValue.textContent = gameState.score;
        renderStars(el.levelStars, gameState.lives);
        showScreen('levelComplete');
    }, 900);
}

function nextLevel() {
    gameState.level++;
    // Restore lives on level up (reward)
    if (gameState.lives < gameState.maxLives) gameState.lives++;
    loadLevel();
    showScreen('game');
}

function handleGameOver() {
    playSound('gameover');
    setTimeout(() => {
        el.finalScoreValue.textContent = gameState.score;
        el.levelsCompletedValue.textContent = gameState.levelsCompleted;
        el.finalLevelValue.textContent = gameState.level;
        renderStars(el.starRating, 0);

        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('sequenceSpheres_highScore', gameState.score);
            el.newHighScore.style.display = 'flex';
        } else {
            el.newHighScore.style.display = 'none';
        }
        showScreen('gameOver');
    }, 600);
}

function renderStars(container, livesLeft) {
    container.innerHTML = '';
    const starCount = livesLeft >= 3 ? 3 : livesLeft >= 2 ? 2 : livesLeft >= 1 ? 1 : 0;
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = 'star' + (i < starCount ? ' active' : '');
        star.textContent = '⭐';
        container.appendChild(star);
    }
}

function showFeedback(icon, text) {
    el.feedbackIcon.textContent = icon;
    el.feedbackText.textContent = text;
    el.feedbackOverlay.classList.remove('show');
    void el.feedbackOverlay.offsetWidth;
    el.feedbackOverlay.classList.add('show');
    setTimeout(() => el.feedbackOverlay.classList.remove('show'), 600);
}

// Start
init();
