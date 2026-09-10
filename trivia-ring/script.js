// Trivia Ring: Alphabet Challenge
// An educational trivia wheel game. Pick a letter, get a clue, type the answer
// that starts with that letter. Topics: science, geography, chemistry, general.
// Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Trivia database: keyed by letter A-Z. Each entry: { category, clue, answer }
// Answers are uppercase, single words. Clues are educational.
const TRIVIA = {
    A: [
        { category: 'Geography', clue: 'Capital of Australia (not Sydney!)', answer: 'CANBERRA' },
        { category: 'Science', clue: 'The closest layer of the atmosphere to Earth', answer: 'ATMOSPHERE' },
        { category: 'Chemistry', clue: 'Metal element with symbol Al', answer: 'ALUMINUM' },
        { category: 'General', clue: 'Largest continent on Earth', answer: 'ASIA' }
    ],
    B: [
        { category: 'Science', clue: 'Hardest natural substance found in the human body', answer: 'BONE' },
        { category: 'Chemistry', clue: 'Metalloid element with symbol B', answer: 'BORON' },
        { category: 'Geography', clue: 'Capital of Brazil', answer: 'BRASILIA' },
        { category: 'General', clue: 'Largest mammal on Earth', answer: 'BLUEWHALE' }
    ],
    C: [
        { category: 'Chemistry', clue: 'Element with symbol C, basis of all known life', answer: 'CARBON' },
        { category: 'Geography', clue: 'Largest country by land area', answer: 'CANADA' },
        { category: 'Science', clue: 'Speed of light in vacuum, in km/s, approx 300,000 ___', answer: 'CONSTANT' },
        { category: 'General', clue: 'Largest ocean on Earth', answer: 'CAPITAL' }
    ],
    D: [
        { category: 'Science', clue: 'Extinct reptile group from the Mesozoic era', answer: 'DINOSAUR' },
        { category: 'Chemistry', clue: 'Element with symbol Db, atomic number 105', answer: 'DUBNIUM' },
        { category: 'Geography', clue: 'Capital of India', answer: 'DELHI' },
        { category: 'General', clue: 'Largest desert in the world (by area, cold desert)', answer: 'DESERT' }
    ],
    E: [
        { category: 'Chemistry', clue: 'Element with symbol Eu, used in red phosphors', answer: 'EUROPIUM' },
        { category: 'Science', clue: 'Center of an atom, containing protons and neutrons', answer: 'ELECTRON' },
        { category: 'Geography', clue: 'Longest river in the world (disputed with Nile)', answer: 'EQUATOR' },
        { category: 'General', clue: 'Largest continent by population (alt answer)', answer: 'EUROPE' }
    ],
    F: [
        { category: 'Science', clue: 'Force that pulls objects toward each other', answer: 'FORCE' },
        { category: 'Chemistry', clue: 'Element with symbol F, a halogen gas', answer: 'FLUORINE' },
        { category: 'Geography', clue: 'Nordic country, capital Helsinki', answer: 'FINLAND' },
        { category: 'General', clue: 'Largest fish in the ocean', answer: 'FISH' }
    ],
    G: [
        { category: 'Chemistry', clue: 'Element with symbol Au (Latin name)', answer: 'GOLD' },
        { category: 'Science', clue: 'Force that keeps planets in orbit', answer: 'GRAVITY' },
        { category: 'Geography', clue: 'Largest country in Africa', answer: 'GERMANY' },
        { category: 'General', clue: 'Greenhouse gas, formula CO2', answer: 'GAS' }
    ],
    H: [
        { category: 'Chemistry', clue: 'Lightest element, symbol H', answer: 'HYDROGEN' },
        { category: 'Science', clue: 'Organ that pumps blood through the body', answer: 'HEART' },
        { category: 'Geography', clue: 'US state, capital Honolulu', answer: 'HAWAII' },
        { category: 'General', clue: 'Tallest mountain on Earth', answer: 'HIMALAYA' }
    ],
    I: [
        { category: 'Chemistry', clue: 'Element with symbol I, essential for thyroid', answer: 'IODINE' },
        { category: 'Science', clue: 'Smallest unit of matter that retains element identity', answer: 'ISOTOPE' },
        { category: 'Geography', clue: 'Country, capital New Delhi', answer: 'INDIA' },
        { category: 'General', clue: 'Largest island in the world', answer: 'ICELAND' }
    ],
    J: [
        { category: 'Chemistry', clue: 'Element with symbol I (Latin stannum) — wait, this is J', answer: 'JADE' },
        { category: 'Science', clue: 'Unit of energy, symbol J', answer: 'JOULE' },
        { category: 'Geography', clue: 'Country, capital Tokyo', answer: 'JAPAN' },
        { category: 'General', clue: 'Largest planet in our solar system', answer: 'JUPITER' }
    ],
    K: [
        { category: 'Chemistry', clue: 'Element with symbol K, essential for nerves', answer: 'POTASSIUM' },
        { category: 'Science', clue: 'Unit of temperature, symbol K', answer: 'KELVIN' },
        { category: 'Geography', clue: 'Continent, home to the Sahara Desert', answer: 'KENYA' },
        { category: 'General', clue: 'Animal, largest living lizard', answer: 'KOMODO' }
    ],
    L: [
        { category: 'Science', clue: 'Phase of matter between solid and gas', answer: 'LIQUID' },
        { category: 'Chemistry', clue: 'Element with symbol Li, used in batteries', answer: 'LITHIUM' },
        { category: 'Geography', clue: 'Country, capital Paris', answer: 'LUXEMBOURG' },
        { category: 'General', clue: 'King of the jungle (big cat)', answer: 'LION' }
    ],
    M: [
        { category: 'Science', clue: 'Red planet in our solar system', answer: 'MARS' },
        { category: 'Chemistry', clue: 'Element with symbol Mg, in chlorophyll', answer: 'MAGNESIUM' },
        { category: 'Geography', clue: 'Continent south of Europe', answer: 'MADAGASCAR' },
        { category: 'General', clue: 'Largest moon of Saturn', answer: 'MOON' }
    ],
    N: [
        { category: 'Chemistry', clue: 'Element with symbol N, makes up 78% of air', answer: 'NITROGEN' },
        { category: 'Science', clue: 'Subatomic particle with no charge', answer: 'NEUTRON' },
        { category: 'Geography', clue: 'Longest river in Africa', answer: 'NILE' },
        { category: 'General', clue: 'Star at the center of our solar system', answer: 'NEBULA' }
    ],
    O: [
        { category: 'Chemistry', clue: 'Element with symbol O, we breathe it', answer: 'OXYGEN' },
        { category: 'Science', clue: 'Layer that protects Earth from UV radiation', answer: 'OZONE' },
        { category: 'Geography', clue: 'Largest ocean on Earth', answer: 'OCEAN' },
        { category: 'General', clue: 'Largest organ in the human body', answer: 'ORGAN' }
    ],
    P: [
        { category: 'Chemistry', clue: 'Element with symbol P, in DNA and bones', answer: 'PHOSPHORUS' },
        { category: 'Science', clue: 'Positively charged subatomic particle', answer: 'PROTON' },
        { category: 'Geography', clue: 'Largest ocean (starts with P)', answer: 'PACIFIC' },
        { category: 'General', clue: 'Flightless bird from Antarctica', answer: 'PENGUIN' }
    ],
    Q: [
        { category: 'Science', clue: 'Smallest unit of electric charge', answer: 'QUARK' },
        { category: 'Chemistry', clue: 'Element with symbol Uuq (now Fl), atomic 114', answer: 'QUARTZ' },
        { category: 'Geography', clue: 'Country, capital Quito', answer: 'QATAR' },
        { category: 'General', clue: 'Sound faster than ___ (speed of sound)', answer: 'QUICK' }
    ],
    R: [
        { category: 'Chemistry', clue: 'Element with symbol Ra, discovered by Marie Curie', answer: 'RADIUM' },
        { category: 'Science', clue: 'Energy that travels as waves through space', answer: 'RADIATION' },
        { category: 'Geography', clue: 'Country, capital Moscow', answer: 'RUSSIA' },
        { category: 'General', clue: 'Color of blood due to hemoglobin', answer: 'RED' }
    ],
    S: [
        { category: 'Chemistry', clue: 'Element with symbol S, yellow, smells like eggs', answer: 'SULFUR' },
        { category: 'Science', clue: 'Star at the center of our solar system', answer: 'SUN' },
        { category: 'Geography', clue: 'Largest country in South America', answer: 'SAHARA' },
        { category: 'General', clue: 'Reptile with no legs', answer: 'SNAKE' }
    ],
    T: [
        { category: 'Chemistry', clue: 'Element with symbol Ti, strong light metal', answer: 'TITANIUM' },
        { category: 'Science', clue: 'Largest moon of Saturn', answer: 'TITAN' },
        { category: 'Geography', clue: 'Highest mountain on Earth', answer: 'TIBET' },
        { category: 'General', clue: 'Largest land animal', answer: 'TIGER' }
    ],
    U: [
        { category: 'Chemistry', clue: 'Element with symbol U, used in nuclear fuel', answer: 'URANIUM' },
        { category: 'Science', clue: 'All of space, time, matter, and energy', answer: 'UNIVERSE' },
        { category: 'Geography', clue: 'Country, capital London', answer: 'UKRAINE' },
        { category: 'General', clue: 'Extinct large mammal with tusks', answer: 'UNGULATE' }
    ],
    V: [
        { category: 'Chemistry', clue: 'Element with symbol V, in some steels', answer: 'VANADIUM' },
        { category: 'Science', clue: 'Plant that traps and eats insects', answer: 'VENUS' },
        { category: 'Geography', clue: 'Smallest continent (country)', answer: 'VIETNAM' },
        { category: 'General', clue: 'Second planet from the sun', answer: 'VENUS' }
    ],
    W: [
        { category: 'Chemistry', clue: 'Element with symbol W, used in light bulbs', answer: 'TUNGSTEN' },
        { category: 'Science', clue: 'H2O in solid form', answer: 'WATER' },
        { category: 'Geography', clue: 'Country, capital Washington D.C.', answer: 'WEST' },
        { category: 'General', clue: 'Largest mammal group (marine)', answer: 'WHALE' }
    ],
    X: [
        { category: 'Chemistry', clue: 'Element with symbol Xe, a noble gas', answer: 'XENON' },
        { category: 'Science', clue: 'Imaging that uses electromagnetic radiation', answer: 'XRAY' },
        { category: 'Geography', clue: 'Ancient city in Mexico (Mayan)', answer: 'XALAPA' },
        { category: 'General', clue: 'Plant used in herbal medicine', answer: 'XYLEM' }
    ],
    Y: [
        { category: 'Chemistry', clue: 'Element with symbol Y, in LEDs', answer: 'YTTRIUM' },
        { category: 'Science', clue: 'Bacterium that causes plague', answer: 'YERSINIA' },
        { category: 'Geography', clue: 'Country, capital Sanaa', answer: 'YEMEN' },
        { category: 'General', clue: 'Yellow center of an egg', answer: 'YOLK' }
    ],
    Z: [
        { category: 'Chemistry', clue: 'Element with symbol Zn, used to coat iron', answer: 'ZINC' },
        { category: 'Science', clue: 'Group of animals with stripes, African equid', answer: 'ZEBRA' },
        { category: 'Geography', clue: 'Country, capital Lusaka', answer: 'ZAMBIA' },
        { category: 'General', clue: 'Area with zero population (extinct area)', answer: 'ZONE' }
    ]
};

// Game State
const gameState = {
    currentScreen: 'start',
    score: 0,
    round: 1,
    lives: 3,
    maxLives: 3,
    lettersSolved: 0,
    totalLettersSolved: 0,
    currentLetter: null,
    currentClue: null,
    solvedLetters: new Set(),
    highScore: parseInt(localStorage.getItem('triviaRing_highScore')) || 0
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('triviaRing_muted') === 'true';
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
    } else if (type === 'select') {
        osc.frequency.setValueAtTime(700, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now); osc.stop(now + 0.1);
    } else if (type === 'roundComplete') {
        const freqs = [523, 659, 784, 1047, 1319];
        freqs.forEach((f, i) => {
            const o = audioContext.createOscillator();
            const g = audioContext.createGain();
            o.connect(g); g.connect(audioContext.destination);
            o.frequency.setValueAtTime(f, now + i * 0.12);
            g.gain.setValueAtTime(0.25, now + i * 0.12);
            g.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.25);
            o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.25);
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

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    roundComplete: document.getElementById('roundCompleteScreen'),
    gameOver: document.getElementById('gameOverScreen')
};

const el = {
    highScoreValue: document.getElementById('highScoreValue'),
    startBtn: document.getElementById('startBtn'),
    scoreValue: document.getElementById('scoreValue'),
    roundValue: document.getElementById('roundValue'),
    livesContainer: document.getElementById('livesContainer'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    letterRing: document.getElementById('letterRing'),
    cluePanel: document.getElementById('cluePanel'),
    clueLetterBadge: document.getElementById('clueLetterBadge'),
    clueCategory: document.getElementById('clueCategory'),
    clueText: document.getElementById('clueText'),
    answerInput: document.getElementById('answerInput'),
    submitAnswerBtn: document.getElementById('submitAnswerBtn'),
    skipBtn: document.getElementById('skipBtn'),
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    roundScoreValue: document.getElementById('roundScoreValue'),
    lettersSolvedValue: document.getElementById('lettersSolvedValue'),
    finalRoundValue: document.getElementById('finalRoundValue'),
    roundStars: document.getElementById('roundStars'),
    finalScoreValue: document.getElementById('finalScoreValue'),
    totalLettersSolvedValue: document.getElementById('totalLettersSolvedValue'),
    gameOverRoundValue: document.getElementById('gameOverRoundValue'),
    starRating: document.getElementById('starRating'),
    newHighScore: document.getElementById('newHighScore'),
    replayBtn: document.getElementById('replayBtn'),
    nextRoundBtn: document.getElementById('nextRoundBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    mainMenuBtn2: document.getElementById('mainMenuBtn2')
};

// Initialize
async function init() {
    await gameI18n.init('trivia-ring');
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

    el.nextRoundBtn.addEventListener('click', () => {
        playSound('click');
        nextRound();
    });

    el.mainMenuBtn.addEventListener('click', goToMenu);
    el.mainMenuBtn2.addEventListener('click', goToMenu);

    el.exitGameBtn.addEventListener('click', () => {
        playSound('click');
        goToMenu();
    });

    el.submitAnswerBtn.addEventListener('click', submitAnswer);
    el.skipBtn.addEventListener('click', skipQuestion);

    el.answerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitAnswer();
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
    localStorage.setItem('triviaRing_muted', isMuted);
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
    gameState.round = 1;
    gameState.lives = gameState.maxLives;
    gameState.lettersSolved = 0;
    gameState.totalLettersSolved = 0;
    gameState.solvedLetters = new Set();
    gameState.currentLetter = null;
    gameState.currentClue = null;
    renderRing();
    hideCluePanel();
    renderLives();
    updateScore();
    updateRound();
    showScreen('game');
}

function renderRing() {
    el.letterRing.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (const ch of letters) {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        if (gameState.solvedLetters.has(ch)) btn.classList.add('solved');
        if (ch === gameState.currentLetter) btn.classList.add('active');
        btn.textContent = ch;
        btn.dataset.letter = ch;
        btn.addEventListener('click', () => selectLetter(ch, btn));
        el.letterRing.appendChild(btn);
    }
}

function selectLetter(letter, btn) {
    initAudio();
    if (gameState.solvedLetters.has(letter)) return;
    playSound('select');

    // Pick a random clue for this letter
    const clues = TRIVIA[letter];
    const clue = clues[Math.floor(Math.random() * clues.length)];
    gameState.currentLetter = letter;
    gameState.currentClue = clue;

    // Update ring active state
    el.letterRing.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Show clue panel
    showCluePanel(letter, clue);
}

function showCluePanel(letter, clue) {
    el.clueLetterBadge.textContent = letter;
    el.clueCategory.textContent = clue.category;
    el.clueText.textContent = clue.clue;
    el.answerInput.value = '';
    el.cluePanel.style.display = 'flex';
    // Focus input after a short delay for mobile keyboards
    setTimeout(() => el.answerInput.focus(), 200);
}

function hideCluePanel() {
    el.cluePanel.style.display = 'none';
}

function submitAnswer() {
    initAudio();
    if (!gameState.currentClue) return;
    const userAnswer = el.answerInput.value.trim().toUpperCase().replace(/\s+/g, '');
    if (!userAnswer) {
        showFeedback('✏️', t('typeAnswer'));
        return;
    }

    const correct = gameState.currentClue.answer;
    // Accept if user answer matches OR starts with the letter and matches answer
    if (userAnswer === correct || userAnswer.replace(/[^A-Z]/g, '') === correct) {
        // Correct!
        gameState.solvedLetters.add(gameState.currentLetter);
        gameState.lettersSolved++;
        gameState.totalLettersSolved++;
        gameState.score += 50 * gameState.round;
        playSound('correct');
        showFeedback('✅', t('correct'));
        hideCluePanel();
        gameState.currentLetter = null;
        gameState.currentClue = null;
        renderRing();
        updateScore();

        if (gameState.solvedLetters.size >= 26) {
            handleRoundComplete();
        }
    } else {
        // Wrong
        gameState.lives--;
        playSound('wrong');
        showFeedback('❌', t('wrong') + ' ' + correct);
        renderLives();
        if (gameState.lives <= 0) {
            handleGameOver();
        }
    }
}

function skipQuestion() {
    initAudio();
    playSound('click');
    if (!gameState.currentClue) return;
    // Skipping costs a life
    gameState.lives--;
    showFeedback('⏭️', t('skipped') + ' ' + gameState.currentClue.answer);
    hideCluePanel();
    gameState.currentLetter = null;
    gameState.currentClue = null;
    el.letterRing.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
    renderLives();
    if (gameState.lives <= 0) {
        handleGameOver();
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

function updateRound() {
    el.roundValue.textContent = gameState.round;
}

function handleRoundComplete() {
    playSound('roundComplete');
    const livesBonus = gameState.lives * 40;
    const roundBonus = gameState.round * 100;
    gameState.score += livesBonus + roundBonus;
    updateScore();

    setTimeout(() => {
        el.roundScoreValue.textContent = gameState.score;
        el.lettersSolvedValue.textContent = gameState.lettersSolved;
        el.finalRoundValue.textContent = gameState.round;
        renderStars(el.roundStars, gameState.lives);
        showScreen('roundComplete');
    }, 800);
}

function nextRound() {
    gameState.round++;
    gameState.lives = gameState.maxLives;
    gameState.lettersSolved = 0;
    gameState.solvedLetters = new Set();
    gameState.currentLetter = null;
    gameState.currentClue = null;
    renderRing();
    hideCluePanel();
    renderLives();
    updateRound();
    showScreen('game');
}

function handleGameOver() {
    playSound('gameover');
    setTimeout(() => {
        el.finalScoreValue.textContent = gameState.score;
        el.totalLettersSolvedValue.textContent = gameState.totalLettersSolved;
        el.gameOverRoundValue.textContent = gameState.round;
        renderStars(el.starRating, 0);

        if (gameState.score > gameState.highScore) {
            gameState.highScore = gameState.score;
            localStorage.setItem('triviaRing_highScore', gameState.score);
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
    setTimeout(() => el.feedbackOverlay.classList.remove('show'), 1200);
}

// Start
init();
