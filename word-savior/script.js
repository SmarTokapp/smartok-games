// Word Savior: Launch Protocol
// A positive twist on word-guessing: build a spaceship by guessing letters.
// Each wrong letter costs a life. Complete the word to launch the ship.
// Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Word lists by category. Words are uppercase, letters only (spaces allowed).
const WORD_LISTS = {
    animals: [
        'ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'KANGAROO', 'BUTTERFLY',
        'OCTOPUS', 'CHEETAH', 'HEDGEHOG', 'FLAMINGO', 'CHAMELEON', 'PORCUPINE',
        'CROCODILE', 'PEACOCK', 'SQUIRREL', 'RHINOCEROS', 'ANTELOPE', 'PELICAN'
    ],
    science: [
        'GRAVITY', 'MOLECULE', 'ECLIPSE', 'NEUTRON', 'PHOTON', 'ENZYME',
        'GALAXY', 'VELOCITY', 'FRICTION', 'MAGNETIC', 'OXYGEN', 'CARBON',
        'EVOLUTION', 'MITOSIS', 'QUANTUM', 'PROTEIN', 'NEBULA', 'COMET'
    ],
    geography: [
        'AMAZON', 'SAHARA', 'EVEREST', 'PACIFIC', 'AMAZONIA', 'ANTARCTICA',
        'VOLCANO', 'GLACIER', 'PENINSULA', 'ARCHIPELAGO', 'TUNDRA', 'PLATEAU',
        'CANYON', 'DELTA', 'ISTHMUS', 'EQUATOR', 'SAVANNA', 'FJORD'
    ],
    technology: [
        'ROBOT', 'CIRCUIT', 'ALGORITHM', 'DATABASE', 'NETWORK', 'PIXEL',
        'BINARY', 'PROCESSOR', 'FIREWALL', 'BLUETOOTH', 'SATELLITE', 'BANDWIDTH',
        'ENCRYPTION', 'INTERFACE', 'PROTOCOL', 'TERMINAL', 'CACHE', 'KERNEL'
    ]
};

// Game State
const gameState = {
    currentScreen: 'start',
    category: null,
    word: '',
    guessedLetters: new Set(),
    wrongLetters: new Set(),
    score: 0,
    lives: 6,
    maxLives: 6,
    level: 1,
    wordsCompleted: 0,
    wordQueue: [],
    highScores: {
        animals: parseInt(localStorage.getItem('wordSavior_highScore_animals')) || 0,
        science: parseInt(localStorage.getItem('wordSavior_highScore_science')) || 0,
        geography: parseInt(localStorage.getItem('wordSavior_highScore_geography')) || 0,
        technology: parseInt(localStorage.getItem('wordSavior_highScore_technology')) || 0
    }
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('wordSavior_muted') === 'true';
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
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(1100, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
        osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'launch') {
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.8);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 1.0);
        osc.start(now); osc.stop(now + 1.0);
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
    scoreValue: document.getElementById('scoreValue'),
    levelValue: document.getElementById('levelValue'),
    livesContainer: document.getElementById('livesContainer'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    currentCategory: document.getElementById('currentCategory'),
    wordDisplay: document.getElementById('wordDisplay'),
    keyboard: document.getElementById('keyboard'),
    shipStage: document.getElementById('shipStage'),
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    finalScoreValue: document.getElementById('finalScoreValue'),
    wordsCompletedValue: document.getElementById('wordsCompletedValue'),
    finalLevelValue: document.getElementById('finalLevelValue'),
    starRating: document.getElementById('starRating'),
    levelStars: document.getElementById('levelStars'),
    levelScoreValue: document.getElementById('levelScoreValue'),
    newHighScore: document.getElementById('newHighScore'),
    replayCategoryBtn: document.getElementById('replayCategoryBtn'),
    nextLevelBtn: document.getElementById('nextLevelBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    mainMenuBtn2: document.getElementById('mainMenuBtn2'),
    categoryBtns: document.querySelectorAll('.category-btn')
};

// Initialize
async function init() {
    await gameI18n.init('word-savior');
    updateOverallHighScore();

    el.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            playSound('click');
            startGame(btn.dataset.category);
        });
    });

    el.replayCategoryBtn.addEventListener('click', () => {
        playSound('click');
        if (gameState.category) startGame(gameState.category);
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
    updateOverallHighScore();
}

function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('wordSavior_muted', isMuted);
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

function getOverallHighScore() {
    return Math.max(0, ...Object.values(gameState.highScores));
}

function updateOverallHighScore() {
    el.highScoreValue.textContent = getOverallHighScore();
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    gameState.currentScreen = name;
}

function startGame(category) {
    gameState.category = category;
    gameState.score = 0;
    gameState.lives = gameState.maxLives;
    gameState.level = 1;
    gameState.wordsCompleted = 0;
    gameState.wordQueue = shuffleArray([...WORD_LISTS[category]]);
    loadWord();
    showScreen('game');
}

function loadWord() {
    if (gameState.wordQueue.length === 0) {
        gameState.wordQueue = shuffleArray([...WORD_LISTS[gameState.category]]);
    }
    gameState.word = gameState.wordQueue.pop();
    gameState.guessedLetters = new Set();
    gameState.wrongLetters = new Set();
    gameState.lives = gameState.maxLives;

    el.currentCategory.textContent = gameState.category.charAt(0).toUpperCase() + gameState.category.slice(1);
    renderWord();
    renderKeyboard();
    renderLives();
    renderShip();
    updateScore();
    updateLevel();
}

function renderWord() {
    el.wordDisplay.innerHTML = '';
    for (const ch of gameState.word) {
        const slot = document.createElement('div');
        if (ch === ' ') {
            slot.className = 'letter-slot space';
        } else {
            slot.className = 'letter-slot';
            if (gameState.guessedLetters.has(ch)) {
                slot.textContent = ch;
                slot.classList.add('revealed');
            }
        }
        el.wordDisplay.appendChild(slot);
    }
}

function renderKeyboard() {
    el.keyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const ch of letters) {
        const btn = document.createElement('button');
        btn.className = 'key-btn';
        btn.textContent = ch;
        btn.addEventListener('click', () => handleGuess(ch, btn));
        if (gameState.guessedLetters.has(ch)) {
            btn.classList.add('correct');
            btn.disabled = true;
        } else if (gameState.wrongLetters.has(ch)) {
            btn.classList.add('wrong');
            btn.disabled = true;
        }
        el.keyboard.appendChild(btn);
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

// Spaceship build: reveal one part per unique correct letter guessed.
function renderShip() {
    const parts = el.shipStage.querySelectorAll('.ship-part');
    const uniqueLettersInWord = new Set([...gameState.word].filter(c => c !== ' '));
    const correctGuessed = [...gameState.guessedLetters].filter(c => uniqueLettersInWord.has(c));
    const revealCount = correctGuessed.length;
    parts.forEach((part, idx) => {
        part.classList.toggle('revealed', idx < revealCount);
    });
}

function updateScore() {
    el.scoreValue.textContent = gameState.score;
}

function updateLevel() {
    el.levelValue.textContent = gameState.level;
}

function handleGuess(letter, btn) {
    initAudio();
    if (gameState.guessedLetters.has(letter) || gameState.wrongLetters.has(letter)) return;

    if (gameState.word.includes(letter)) {
        gameState.guessedLetters.add(letter);
        btn.classList.add('correct');
        btn.disabled = true;
        playSound('correct');
        renderWord();
        renderShip();
        // Score: 10 per unique correct letter occurrence
        const occurrences = [...gameState.word].filter(c => c === letter).length;
        gameState.score += 10 * occurrences;
        updateScore();
        if (isWordComplete()) handleWordComplete();
    } else {
        gameState.wrongLetters.add(letter);
        btn.classList.add('wrong');
        btn.disabled = true;
        gameState.lives--;
        playSound('wrong');
        renderLives();
        showFeedback('❌', t('wrong'));
        if (gameState.lives <= 0) handleGameOver();
    }
}

function isWordComplete() {
    return [...gameState.word].every(c => c === ' ' || gameState.guessedLetters.has(c));
}

function handleWordComplete() {
    gameState.wordsCompleted++;
    // Bonus for lives remaining
    const livesBonus = gameState.lives * 25;
    const levelBonus = gameState.level * 50;
    gameState.score += livesBonus + levelBonus;
    updateScore();

    // Launch animation
    const parts = el.shipStage.querySelectorAll('.ship-part');
    parts.forEach(p => p.classList.add('launch'));
    playSound('launch');
    showFeedback('🚀', t('launchSuccess'));

    setTimeout(() => {
        // Show level complete screen
        el.levelScoreValue.textContent = gameState.score;
        renderStars(el.levelStars, gameState.lives);
        showScreen('levelComplete');
        // Reset ship position for next level
        parts.forEach(p => p.classList.remove('launch'));
    }, 1300);
}

function nextLevel() {
    gameState.level++;
    loadWord();
    showScreen('game');
}

function handleGameOver() {
    playSound('gameover');
    setTimeout(() => {
        el.finalScoreValue.textContent = gameState.score;
        el.wordsCompletedValue.textContent = gameState.wordsCompleted;
        el.finalLevelValue.textContent = gameState.level;
        renderStars(el.starRating, 0);

        // High score check
        const cat = gameState.category;
        if (gameState.score > gameState.highScores[cat]) {
            gameState.highScores[cat] = gameState.score;
            localStorage.setItem('wordSavior_highScore_' + cat, gameState.score);
            el.newHighScore.style.display = 'flex';
        } else {
            el.newHighScore.style.display = 'none';
        }
        showScreen('gameOver');
    }, 600);
}

function renderStars(container, livesLeft) {
    container.innerHTML = '';
    const starCount = livesLeft >= 5 ? 3 : livesLeft >= 3 ? 2 : livesLeft >= 1 ? 1 : 0;
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
    void el.feedbackOverlay.offsetWidth; // reflow to restart animation
    el.feedbackOverlay.classList.add('show');
    setTimeout(() => el.feedbackOverlay.classList.remove('show'), 600);
}

// Start
init();
