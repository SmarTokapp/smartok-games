// Memory Matrix: Pattern Recall
// A pattern-memorization grid game. Watch the sequence of flashing tiles,
// then tap them in the exact same order. Levels increase grid size and
// sequence length. Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Flash colors cycle through these for visual variety during sequence playback.
const FLASH_CLASSES = ['flash-cyan', 'flash-magenta', 'flash-green', 'flash-gold'];

// Game State
const gameState = {
    currentScreen: 'start',
    score: 0,
    level: 1,
    lives: 3,
    maxLives: 3,
    levelsCompleted: 0,
    gridSize: 3,        // grid is gridSize x gridSize
    sequence: [],       // array of tile indices
    playerIndex: 0,     // how many tiles the player has correctly tapped
    isPlaying: false,   // true while playing back sequence or accepting input
    isAcceptingInput: false,
    highScore: parseInt(localStorage.getItem('memoryMatrix_highScore')) || 0
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('memoryMatrix_muted') === 'true';
if (isMuted) bgm.muted = true;

let hasInteracted = false;
function enableAudio() {
    if (!hasInteracted) {
        hasInteracted = true;
        if (!isMuted) bgm.play().catch(e => console.log('Audio play failed:', e));
    }
}

const unlockAudio = () => {
    if (bgm && bgm.paused && !isMuted) bgm.play().catch(e => console.log('Autoplay deferred:', e));
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
};
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });

// Audio Context for sound effects
let audioContext = null;
function initAudio() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playTone(freq, duration = 0.3) {
    if (!audioContext || isMuted) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    const now = audioContext.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.linearRampToValueAtTime(0.01, now + duration);
    osc.start(now);
    osc.stop(now + duration);
}

function playSound(type) {
    if (!audioContext || isMuted) return;
    const now = audioContext.currentTime;

    if (type === 'flash') {
        // Tile flash tone — pitch varies by tile index (passed via global)
        playTone(440 + (flashPitchIndex * 60), 0.25);
    } else if (type === 'correct') {
        playTone(880, 0.15);
        setTimeout(() => playTone(1100, 0.15), 100);
    } else if (type === 'wrong') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'levelComplete') {
        const freqs = [523, 659, 784, 1047, 1319];
        freqs.forEach((f, i) => {
            setTimeout(() => playTone(f, 0.2), i * 100);
        });
    } else if (type === 'gameover') {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(300, now + 0.2);
        osc.frequency.setValueAtTime(200, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.6);
        osc.start(now); osc.stop(now + 0.6);
    } else if (type === 'click') {
        playTone(600, 0.05);
    }
}

let flashPitchIndex = 0;

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
    statusBanner: document.getElementById('statusBanner'),
    statusIcon: document.getElementById('statusIcon'),
    statusText: document.getElementById('statusText'),
    memoryGrid: document.getElementById('memoryGrid'),
    sequenceProgress: document.getElementById('sequenceProgress'),
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
    await gameI18n.init('memory-matrix');
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
    gameState.isPlaying = false;
    gameState.isAcceptingInput = false;
    showScreen('start');
    el.highScoreValue.textContent = gameState.highScore;
}

function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('memoryMatrix_muted', isMuted);
    updateAudioToggleIcon();
    if (isMuted) bgm.pause();
    else if (hasInteracted) bgm.play().catch(e => console.log('Audio play failed:', e));
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

// Level config: grid size and sequence length scale with level.
function getLevelConfig(level) {
    const gridSize = Math.min(3 + Math.floor((level - 1) / 3), 6); // 3x3 up to 6x6
    const seqLength = Math.min(3 + Math.floor((level - 1) / 2), 12); // 3 to 12
    return { gridSize, seqLength };
}

function loadLevel() {
    const config = getLevelConfig(gameState.level);
    gameState.gridSize = config.gridSize;
    gameState.sequence = [];
    gameState.playerIndex = 0;
    gameState.isPlaying = false;
    gameState.isAcceptingInput = false;

    renderGrid(config.gridSize);
    renderLives();
    updateScore();
    updateLevel();
    setStatus('watch', '👀', t('watch'));
    el.sequenceProgress.innerHTML = '';

    // Generate a random sequence
    const totalTiles = config.gridSize * config.gridSize;
    for (let i = 0; i < config.seqLength; i++) {
        gameState.sequence.push(Math.floor(Math.random() * totalTiles));
    }

    // Start playback after a short delay
    setTimeout(() => playSequence(), 800);
}

function renderGrid(size) {
    el.memoryGrid.innerHTML = '';
    el.memoryGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const total = size * size;
    for (let i = 0; i < total; i++) {
        const tile = document.createElement('button');
        tile.className = 'memory-tile disabled';
        tile.dataset.idx = i;
        tile.addEventListener('click', () => handleTileTap(i, tile));
        el.memoryGrid.appendChild(tile);
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

function setStatus(mode, icon, text) {
    el.statusBanner.classList.remove('watch', 'replay');
    if (mode) el.statusBanner.classList.add(mode);
    el.statusIcon.textContent = icon;
    el.statusText.textContent = text;
}

function renderSequenceProgress() {
    el.sequenceProgress.innerHTML = '';
    for (let i = 0; i < gameState.sequence.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'progress-dot';
        if (i < gameState.playerIndex) dot.classList.add('done');
        else if (i === gameState.playerIndex) dot.classList.add('current');
        el.sequenceProgress.appendChild(dot);
    }
}

// Play back the sequence by flashing tiles one at a time.
function playSequence() {
    gameState.isPlaying = true;
    gameState.isAcceptingInput = false;
    setStatus('watch', '👀', t('watch'));
    // Disable all tiles during playback
    el.memoryGrid.querySelectorAll('.memory-tile').forEach(tile => tile.classList.add('disabled'));

    let i = 0;
    const playNext = () => {
        if (i >= gameState.sequence.length) {
            // Sequence done — accept player input
            gameState.isPlaying = false;
            gameState.isAcceptingInput = true;
            gameState.playerIndex = 0;
            setStatus('replay', '👆', t('replay'));
            renderSequenceProgress();
            el.memoryGrid.querySelectorAll('.memory-tile').forEach(tile => tile.classList.remove('disabled'));
            return;
        }

        const tileIdx = gameState.sequence[i];
        const tile = el.memoryGrid.querySelector(`[data-idx="${tileIdx}"]`);
        const flashClass = FLASH_CLASSES[i % FLASH_CLASSES.length];

        // Flash the tile
        tile.classList.add(flashClass);
        flashPitchIndex = i;
        playSound('flash');

        setTimeout(() => {
            tile.classList.remove(flashClass);
            i++;
            // Gap between flashes
            setTimeout(playNext, 200);
        }, 500);
    };

    playNext();
}

function handleTileTap(idx, tile) {
    initAudio();
    if (!gameState.isAcceptingInput) return;

    const expected = gameState.sequence[gameState.playerIndex];

    if (idx === expected) {
        // Correct tile
        tile.classList.add('tap-correct');
        setTimeout(() => tile.classList.remove('tap-correct'), 300);
        playSound('correct');
        gameState.playerIndex++;
        renderSequenceProgress();

        if (gameState.playerIndex >= gameState.sequence.length) {
            // Level complete!
            handleLevelComplete();
        }
    } else {
        // Wrong tile
        tile.classList.add('tap-wrong');
        setTimeout(() => tile.classList.remove('tap-wrong'), 400);
        playSound('wrong');
        gameState.lives--;
        renderLives();
        showFeedback('❌', t('wrong'));

        if (gameState.lives <= 0) {
            handleGameOver();
        } else {
            // Replay the sequence after a brief pause
            gameState.isAcceptingInput = false;
            el.memoryGrid.querySelectorAll('.memory-tile').forEach(t => t.classList.add('disabled'));
            setStatus('watch', '👀', t('watchAgain'));
            setTimeout(() => playSequence(), 1000);
        }
    }
}

function handleLevelComplete() {
    gameState.levelsCompleted++;
    const livesBonus = gameState.lives * 30;
    const levelBonus = gameState.level * 50;
    const seqBonus = gameState.sequence.length * 20;
    gameState.score += livesBonus + levelBonus + seqBonus;
    updateScore();
    playSound('levelComplete');
    showFeedback('✨', t('perfect'));
    gameState.isAcceptingInput = false;
    el.memoryGrid.querySelectorAll('.memory-tile').forEach(t => t.classList.add('disabled'));

    setTimeout(() => {
        el.levelScoreValue.textContent = gameState.score;
        renderStars(el.levelStars, gameState.lives);
        showScreen('levelComplete');
    }, 900);
}

function nextLevel() {
    gameState.level++;
    if (gameState.lives < gameState.maxLives) gameState.lives++;
    loadLevel();
    showScreen('game');
}

function handleGameOver() {
    playSound('gameover');
    gameState.isAcceptingInput = false;
    el.memoryGrid.querySelectorAll('.memory-tile').forEach(t => t.classList.add('disabled'));
    setTimeout(() => {
        el.finalScoreValue.textContent = gameState.score;
        el.levelsCompletedValue.textContent = gameState.levelsCompleted;
        el.finalLevelValue.textContent = gameState.level;
        renderStars(el.starRating, 0);

        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('memoryMatrix_highScore', gameState.score);
            el.newHighScore.style.display = 'flex';
        } else {
            el.newHighScore.style.display = 'none';
        }
        showScreen('gameOver');
    }, 800);
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
