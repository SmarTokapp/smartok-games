// Sum It Up: Pair Finder
// A logic and math puzzle game. Find two numbers in the grid that sum
// to the target. Levels increase grid size and number complexity.
// Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Game State
const gameState = {
    currentScreen: 'start',
    score: 0,
    level: 1,
    lives: 3,
    maxLives: 3,
    levelsCompleted: 0,
    target: 0,
    numbers: [],       // array of {value, id, selected, solved}
    selectedTile: null, // index of first selected tile
    pairsNeeded: 0,    // how many pairs to find this level
    pairsFound: 0,
    highScore: parseInt(localStorage.getItem('sumItUp_highScore')) || 0
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('sumItUp_muted') === 'true';
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

    if (type === 'select') {
        osc.frequency.setValueAtTime(700, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'correct') {
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.setValueAtTime(880, now + 0.08);
        osc.frequency.setValueAtTime(1100, now + 0.16);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
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
    targetValue: document.getElementById('targetValue'),
    numberGrid: document.getElementById('numberGrid'),
    selectedDisplay: document.getElementById('selectedDisplay'),
    selectedValues: document.getElementById('selectedValues'),
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
    await gameI18n.init('sum-it-up');
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
    localStorage.setItem('sumItUp_muted', isMuted);
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

// Level config: grid size, number range, and pairs needed scale with level.
function getLevelConfig(level) {
    const gridSize = Math.min(3 + Math.floor((level - 1) / 3), 6); // 3x3 up to 6x6
    const cols = gridSize;
    const totalTiles = gridSize * gridSize;
    const maxRange = 20 + level * 15;
    const pairsNeeded = Math.min(1 + Math.floor((level - 1) / 2), 4); // 1 to 4 pairs
    return { cols, totalTiles, maxRange, pairsNeeded };
}

function loadLevel() {
    const config = getLevelConfig(gameState.level);
    gameState.pairsNeeded = config.pairsNeeded;
    gameState.pairsFound = 0;
    gameState.selectedTile = null;

    // Generate the grid: for each pair, pick two numbers that sum to a target.
    // Fill remaining tiles with random numbers (ensuring they don't accidentally
    // form extra valid pairs with the current target — we accept a single
    // canonical target per level for clarity).
    const numbers = [];
    const pairTargets = [];

    // Generate pairs and their shared target
    for (let p = 0; p < config.pairsNeeded; p++) {
        const a = Math.floor(Math.random() * (config.maxRange - 2)) + 1;
        const b = Math.floor(Math.random() * (config.maxRange - 2)) + 1;
        const sum = a + b;
        pairTargets.push(sum);
        numbers.push({ value: a, id: numbers.length, selected: false, solved: false, pairTarget: sum });
        numbers.push({ value: b, id: numbers.length, selected: false, solved: false, pairTarget: sum });
    }

    // The displayed target is the first pair's sum (the player finds pairs one at a time).
    gameState.target = pairTargets[0];

    // Fill remaining tiles with random numbers that don't sum to the current target
    // with any existing unsolved number (to avoid ambiguous solutions).
    while (numbers.length < config.totalTiles) {
        let val = Math.floor(Math.random() * config.maxRange) + 1;
        // Avoid creating accidental pairs with the current target
        let safe = true;
        for (const n of numbers) {
            if (!n.solved && n.value + val === gameState.target) {
                safe = false;
                break;
            }
        }
        if (safe) {
            numbers.push({ value: val, id: numbers.length, selected: false, solved: false, pairTarget: null });
        }
    }

    shuffleArray(numbers);
    gameState.numbers = numbers;

    renderGrid(config.cols);
    renderTarget();
    renderLives();
    updateScore();
    updateLevel();
    updateSelectedDisplay();
}

function renderGrid(cols) {
    el.numberGrid.innerHTML = '';
    el.numberGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameState.numbers.forEach((num, idx) => {
        const tile = document.createElement('button');
        tile.className = 'number-tile';
        if (num.selected) tile.classList.add('selected');
        if (num.solved) { tile.classList.add('correct'); tile.classList.add('disabled'); }
        tile.textContent = num.value;
        tile.addEventListener('click', () => handleTileTap(idx, tile));
        el.numberGrid.appendChild(tile);
    });
}

function renderTarget() {
    el.targetValue.textContent = gameState.target;
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

function updateSelectedDisplay() {
    if (gameState.selectedTile === null) {
        el.selectedValues.textContent = '—';
    } else {
        el.selectedValues.textContent = gameState.numbers[gameState.selectedTile].value;
    }
}

function handleTileTap(idx, tile) {
    initAudio();
    const num = gameState.numbers[idx];
    if (num.solved) return;

    // If tapping the already-selected tile, deselect it
    if (gameState.selectedTile === idx) {
        num.selected = false;
        gameState.selectedTile = null;
        playSound('select');
        renderGrid(getLevelConfig(gameState.level).cols);
        updateSelectedDisplay();
        return;
    }

    // If no tile selected yet, select this one
    if (gameState.selectedTile === null) {
        num.selected = true;
        gameState.selectedTile = idx;
        playSound('select');
        renderGrid(getLevelConfig(gameState.level).cols);
        updateSelectedDisplay();
        return;
    }

    // Second tile selected — check if they sum to target
    const firstIdx = gameState.selectedTile;
    const firstNum = gameState.numbers[firstIdx];
    const sum = firstNum.value + num.value;

    if (sum === gameState.target) {
        // Correct pair!
        firstNum.solved = true;
        firstNum.selected = false;
        num.solved = true;
        num.selected = false;
        gameState.selectedTile = null;
        gameState.pairsFound++;
        gameState.score += 30 * gameState.level;
        playSound('correct');
        showFeedback('✅', t('correct'));
        renderGrid(getLevelConfig(gameState.level).cols);
        updateScore();
        updateSelectedDisplay();

        if (gameState.pairsFound >= gameState.pairsNeeded) {
            handleLevelComplete();
        }
    } else {
        // Wrong pair
        firstNum.selected = false;
        gameState.selectedTile = null;
        gameState.lives--;
        playSound('wrong');
        showFeedback('❌', t('wrong'));
        renderGrid(getLevelConfig(gameState.level).cols);
        renderLives();
        updateSelectedDisplay();
        if (gameState.lives <= 0) {
            handleGameOver();
        }
    }
}

function handleLevelComplete() {
    gameState.levelsCompleted++;
    const livesBonus = gameState.lives * 35;
    const levelBonus = gameState.level * 50;
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
            localStorage.setItem('sumItUp_highScore', gameState.score);
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
