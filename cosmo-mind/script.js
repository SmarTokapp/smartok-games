// Cosmo Mind: Quantum Quest - Educational Trivia Game
// Deep space-themed fast-paced quiz game with streak multipliers and sound effects
// Music: "Equatorial Complex" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

// Audio Context for sound effects
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Programmatically generated sound effects using Web Audio API
function playClickSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCorrectSound() {
    if (!audioContext) return;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.1 + 0.2);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + index * 0.1 + 0.2);
    });
}

function playWrongSound() {
    if (!audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.3);
    oscillator.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playGameOverSound() {
    if (!audioContext) return;
    const notes = [523.25, 493.88, 440.00]; // C5, B4, A4 (descending minor triad)
    
    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.15);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + index * 0.15);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.15 + 0.3);
        
        oscillator.start(audioContext.currentTime + index * 0.15);
        oscillator.stop(audioContext.currentTime + index * 0.15 + 0.3);
    });
}

// Background Music
const bgm = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Equatorial%20Complex.mp3');
bgm.loop = true;
bgm.volume = 0.2;

// Audio State
let isMuted = localStorage.getItem('cosmoMind_muted') === 'true';
if (isMuted) {
    bgm.muted = true;
} else {
    isMuted = false;
}

// Autoplay bypass - play music on first user interaction
let hasInteracted = false;
function enableAudio() {
    if (!hasInteracted) {
        hasInteracted = true;
        if (!isMuted) {
            bgm.play().catch(e => console.log('Audio play failed:', e));
        }
    }
}

// Automatically unlock and play background music on first frame / interaction
const unlockAudio = () => {
  if (bgm && bgm.paused && !isMuted) {
    bgm.play().catch(e => console.log('Autoplay deferred:', e));
  }
  document.removeEventListener('touchstart', unlockAudio);
  document.removeEventListener('click', unlockAudio);
};
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

// Add global interaction listener
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });

// Question Database
const questions = {
    cosmos: [
        { question: "What is the largest planet in our solar system?", answers: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1 },
        { question: "What is the closest star to Earth?", answers: ["Alpha Centauri", "Proxima Centauri", "The Sun", "Sirius"], correct: 2 },
        { question: "How many galaxies are estimated to exist in the observable universe?", answers: ["100 billion", "1 trillion", "10 billion", "1 million"], correct: 0 },
        { question: "What is a black hole's event horizon?", answers: ["The point of no return", "The center of the black hole", "The accretion disk", "The singularity"], correct: 0 },
        { question: "What type of galaxy is the Milky Way?", answers: ["Elliptical", "Irregular", "Spiral", "Lenticular"], correct: 2 },
        { question: "What is the most common type of star in the universe?", answers: ["Red giant", "Red dwarf", "Blue giant", "White dwarf"], correct: 1 },
        { question: "What is a supernova?", answers: ["A star's birth", "A star's explosion", "A galaxy merger", "A planet formation"], correct: 1 },
        { question: "What is dark matter?", answers: ["Antimatter", "Invisible mass affecting gravity", "Black holes", "Cosmic radiation"], correct: 1 },
        { question: "How old is the universe approximately?", answers: ["4.5 billion years", "13.8 billion years", "100 billion years", "1 million years"], correct: 1 },
        { question: "What is a neutron star?", answers: ["A star made of neutrons", "A star with no mass", "A dying sun", "A gas giant"], correct: 0 }
    ],
    quantum: [
        { question: "What is the smallest unit of matter?", answers: ["Molecule", "Atom", "Quark", "Electron"], correct: 2 },
        { question: "What is quantum entanglement?", answers: ["Particles connected regardless of distance", "Particle collision", "Wave function collapse", "Energy transfer"], correct: 0 },
        { question: "Who proposed the theory of relativity?", answers: ["Niels Bohr", "Albert Einstein", "Max Planck", "Richard Feynman"], correct: 1 },
        { question: "What is Schrödinger's cat thought experiment about?", answers: ["Animal behavior", "Quantum superposition", "Wave mechanics", "Particle physics"], correct: 1 },
        { question: "What is the Heisenberg Uncertainty Principle?", answers: ["Cannot measure position and momentum simultaneously", "Energy conservation", "Wave-particle duality", "Quantum tunneling"], correct: 0 },
        { question: "What is a photon?", answers: ["A particle of light", "A sound wave", "A magnetic field", "A proton"], correct: 0 },
        { question: "What is quantum tunneling?", answers: ["Particles passing through barriers", "Light bending", "Sound echoing", "Heat transfer"], correct: 0 },
        { question: "What is the speed of light in vacuum?", answers: ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000 km/s"], correct: 0 },
        { question: "What is wave-particle duality?", answers: ["Particles behave as both waves and particles", "Only wave behavior", "Only particle behavior", "Neither"], correct: 0 },
        { question: "What is the Pauli Exclusion Principle?", answers: ["Two fermions cannot occupy same quantum state", "Energy conservation", "Momentum conservation", "Angular momentum"], correct: 0 }
    ],
    earth: [
        { question: "What is Earth's approximate age?", answers: ["4.5 billion years", "10,000 years", "1 million years", "100 billion years"], correct: 0 },
        { question: "What percentage of Earth is covered by water?", answers: ["50%", "71%", "30%", "90%"], correct: 1 },
        { question: "What is Earth's core made of?", answers: ["Iron and nickel", "Gold and silver", "Rock and magma", "Water and ice"], correct: 0 },
        { question: "What is the Earth's atmosphere mostly composed of?", answers: ["Oxygen", "Nitrogen", "Carbon dioxide", "Hydrogen"], correct: 1 },
        { question: "What is the Earth's magnetic field generated by?", answers: ["The core's rotation", "The sun", "The moon", "The oceans"], correct: 0 },
        { question: "What is the tectonic plate theory?", answers: ["Earth's crust is divided into moving plates", "Continents are stationary", "Earth is hollow", "Mountains never change"], correct: 0 },
        { question: "What is the greenhouse effect?", answers: ["Trapping of heat by gases", "Cooling of Earth", "Ocean acidification", "Ozone depletion"], correct: 0 },
        { question: "What is the largest ocean on Earth?", answers: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
        { question: "What causes seasons on Earth?", answers: ["Earth's tilt", "Distance from sun", "Moon phases", "Solar flares"], correct: 0 },
        { question: "What is the Earth's rotation period?", answers: ["24 hours", "12 hours", "48 hours", "365 days"], correct: 0 }
    ],
    space: [
        { question: "Who was the first human in space?", answers: ["Neil Armstrong", "Yuri Gagarin", "Buzz Aldrin", "John Glenn"], correct: 1 },
        { question: "What was the first artificial satellite?", answers: ["Apollo 11", "Sputnik 1", "Hubble", "ISS"], correct: 1 },
        { question: "What year did humans first land on the Moon?", answers: ["1965", "1969", "1972", "1959"], correct: 1 },
        { question: "What is the International Space Station?", answers: ["A space hotel", "A research laboratory in orbit", "A military base", "A weather satellite"], correct: 1 },
        { question: "What is a rocket's main propulsion?", answers: ["Solar panels", "Chemical reaction", "Magnetic field", "Wind power"], correct: 1 },
        { question: "What is a spacewalk called?", answers: ["EVA (Extravehicular Activity)", "Space jump", "Orbit walk", "Zero-g walk"], correct: 0 },
        { question: "What is the purpose of a spacesuit?", answers: ["Fashion", "Protection from vacuum and radiation", "Communication only", "Weight reduction"], correct: 1 },
        { question: "What is Mars known as?", answers: ["The Red Planet", "The Blue Planet", "The Green Planet", "The Yellow Planet"], correct: 0 },
        { question: "What is a satellite?", answers: ["A star", "An object orbiting another", "A comet", "A galaxy"], correct: 1 },
        { question: "What is the Kármán line?", answers: ["Boundary between Earth's atmosphere and space", "Equator", "Prime meridian", "International date line"], correct: 0 }
    ]
};

// Game State
const gameState = {
    category: null,
    score: 0,
    lives: 3,
    streak: 0,
    bestStreak: 0,
    currentQuestion: null,
    questionsAnswered: 0,
    correctAnswers: 0,
    timerInterval: null,
    timeLeft: 15,
    highScores: {
        cosmos: 0,
        quantum: 0,
        earth: 0,
        space: 0
    }
};

// DOM Elements
const elements = {
    startScreen: document.getElementById('startScreen'),
    gameScreen: document.getElementById('gameScreen'),
    gameOverScreen: document.getElementById('gameOverScreen'),
    muteBtn: document.getElementById('muteBtn'),
    muteBtnGame: document.getElementById('muteBtnGame'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    scoreValue: document.getElementById('scoreValue'),
    livesContainer: document.getElementById('livesContainer'),
    streakValue: document.getElementById('streakValue'),
    timerProgress: document.getElementById('timerProgress'),
    timerValue: document.getElementById('timerValue'),
    currentCategory: document.getElementById('currentCategory'),
    questionText: document.getElementById('questionText'),
    answersContainer: document.getElementById('answersContainer'),
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    finalScoreValue: document.getElementById('finalScoreValue'),
    questionsAnswered: document.getElementById('questionsAnswered'),
    correctAnswers: document.getElementById('correctAnswers'),
    bestStreak: document.getElementById('bestStreak'),
    newHighScore: document.getElementById('newHighScore'),
    starRating: document.getElementById('starRating'),
    highScoreValue: document.getElementById('highScoreValue'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    replayCategoryBtn: document.getElementById('replayCategoryBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn')
};

// Screen Management
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// Audio Toggle
function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('cosmoMind_muted', isMuted);
    updateAudioToggleIcon();
    
    if (isMuted) {
        bgm.pause();
    } else if (hasInteracted) {
        bgm.play().catch(e => console.log('Audio play failed:', e));
    }
}

function updateAudioToggleIcon() {
    elements.muteBtn.textContent = isMuted ? '🔇' : '🔊';
    const muteBtnGame = document.getElementById('muteBtnGame');
    if (muteBtnGame) {
        muteBtnGame.textContent = isMuted ? '🔇' : '🔊';
    }
}

// High Score Management
function loadHighScores() {
    Object.keys(gameState.highScores).forEach(category => {
        const saved = localStorage.getItem(`cosmoMind_highScore_${category}`);
        if (saved) {
            gameState.highScores[category] = parseInt(saved);
        }
    });
    updateOverallHighScore();
}

function saveHighScore() {
    localStorage.setItem(`cosmoMind_highScore_${gameState.category}`, gameState.score);
    gameState.highScores[gameState.category] = gameState.score;
}

function getOverallHighScore() {
    return Math.max(0, ...Object.values(gameState.highScores));
}

function updateOverallHighScore() {
    elements.highScoreValue.textContent = getOverallHighScore();
}

// Lives Display
function updateLivesUI() {
    elements.livesContainer.innerHTML = '';
    for (let i = 0; i < gameState.lives; i++) {
        const heart = document.createElement('span');
        heart.className = 'life-heart';
        heart.textContent = '❤️';
        elements.livesContainer.appendChild(heart);
    }
}

// Timer
function startTimer() {
    gameState.timeLeft = 15;
    updateTimerUI();
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerUI();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerUI() {
    elements.timerValue.textContent = gameState.timeLeft;
    const percentage = (gameState.timeLeft / 15) * 100;
    elements.timerProgress.style.width = `${percentage}%`;
}

function handleTimeout() {
    gameState.streak = 0;
    gameState.lives--;
    updateLivesUI();
    showFeedback(false, true);
    
    if (gameState.lives <= 0) {
        setTimeout(() => {
            elements.feedbackOverlay.style.display = 'none';
            endGame();
        }, 1500);
        return;
    }
    
    setTimeout(() => {
        elements.feedbackOverlay.style.display = 'none';
        nextQuestion();
    }, 1500);
}

// Question Management
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startGame(category) {
    initAudio();
    playClickSound();
    
    gameState.category = category;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.questionsAnswered = 0;
    gameState.correctAnswers = 0;
    
    updateLivesUI();
    updateScoreUI();
    updateStreakUI();
    
    showScreen('gameScreen');
    nextQuestion();
}

function nextQuestion() {
    const categoryQuestions = shuffleArray(questions[gameState.category]);
    gameState.currentQuestion = categoryQuestions[0];
    
    elements.currentCategory.textContent = gameState.category.charAt(0).toUpperCase() + gameState.category.slice(1);
    elements.questionText.textContent = gameState.currentQuestion.question;
    
    const shuffledAnswers = shuffleArray([...gameState.currentQuestion.answers]);
    elements.answersContainer.innerHTML = '';
    
    shuffledAnswers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.onclick = () => handleAnswer(answer, btn);
        elements.answersContainer.appendChild(btn);
    });
    
    startTimer();
}

function handleAnswer(answer, btnElement) {
    clearInterval(gameState.timerInterval);
    
    const allButtons = elements.answersContainer.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.onclick = null);
    
    const isCorrect = answer === gameState.currentQuestion.answers[gameState.currentQuestion.correct];
    
    if (isCorrect) {
        btnElement.classList.add('correct');
        // Highlight correct answer
        const correctAnswer = gameState.currentQuestion.answers[gameState.currentQuestion.correct];
        allButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct');
            }
        });
        
        // Calculate score with streak multiplier
        const baseScore = 100;
        const streakMultiplier = Math.min(gameState.streak + 1, 5);
        const timeBonus = gameState.timeLeft * 5;
        gameState.score += (baseScore * streakMultiplier) + timeBonus;
        gameState.streak++;
        gameState.correctAnswers++;
        
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        
        updateScoreUI();
        updateStreakUI();
        showFeedback(true);
        playCorrectSound();
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        allButtons[gameState.currentQuestion.correct].classList.add('correct');
        gameState.streak = 0;
        gameState.lives--;
        updateLivesUI();
        updateStreakUI();
        showFeedback(false);
        playWrongSound();
        
        if (gameState.lives <= 0) {
            setTimeout(() => {
                elements.feedbackOverlay.style.display = 'none';
                endGame();
            }, 1500);
            return;
        }
    }
    
    gameState.questionsAnswered++;
    
    setTimeout(() => {
        elements.feedbackOverlay.style.display = 'none';
        nextQuestion();
    }, 1500);
}

function showFeedback(isCorrect, isTimeout = false) {
    elements.feedbackOverlay.style.display = 'flex';
    
    if (isTimeout) {
        elements.feedbackIcon.textContent = '⏰';
        elements.feedbackText.textContent = 'Time\'s Up!';
    } else if (isCorrect) {
        elements.feedbackIcon.textContent = '✅';
        elements.feedbackText.textContent = 'Correct!';
    } else {
        elements.feedbackIcon.textContent = '❌';
        elements.feedbackText.textContent = 'Wrong!';
    }
}

function updateScoreUI() {
    elements.scoreValue.textContent = gameState.score;
}

function updateStreakUI() {
    elements.streakValue.textContent = gameState.streak;
}

// Game Over
function endGame() {
    clearInterval(gameState.timerInterval);
    playGameOverSound();
    
    // Check for new high score
    const categoryHighScore = gameState.highScores[gameState.category];
    const isNewHighScore = gameState.score > categoryHighScore;
    if (isNewHighScore) {
        gameState.highScores[gameState.category] = gameState.score;
        saveHighScore();
    }
    
    // Calculate star rating based on accuracy
    const accuracy = gameState.questionsAnswered > 0 ? (gameState.correctAnswers / gameState.questionsAnswered) : 0;
    let stars = 0;
    if (accuracy >= 0.9) stars = 3;
    else if (accuracy >= 0.7) stars = 2;
    else if (accuracy >= 0.5) stars = 1;
    
    elements.starRating.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = i < stars ? '⭐' : '☆';
        elements.starRating.appendChild(star);
    }
    
    elements.finalScoreValue.textContent = gameState.score;
    elements.questionsAnswered.textContent = gameState.questionsAnswered;
    elements.correctAnswers.textContent = gameState.correctAnswers;
    elements.bestStreak.textContent = gameState.bestStreak;
    
    elements.newHighScore.style.display = isNewHighScore ? 'flex' : 'none';
    
    showScreen('gameOverScreen');
    updateOverallHighScore();
}

function exitGame() {
    clearInterval(gameState.timerInterval);
    showScreen('startScreen');
    updateOverallHighScore();
}

// Event Listeners
elements.categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        initAudio();
        playClickSound();
        const category = btn.dataset.category;
        startGame(category);
    });
});

elements.exitGameBtn.addEventListener('click', () => {
    playClickSound();
    exitGame();
});

elements.replayCategoryBtn.addEventListener('click', () => {
    playClickSound();
    if (gameState.category) {
        startGame(gameState.category);
    }
});

elements.mainMenuBtn.addEventListener('click', () => {
    playClickSound();
    exitGame();
});

elements.muteBtn.addEventListener('click', () => {
    toggleAudio();
});

const muteBtnGame = document.getElementById('muteBtnGame');
if (muteBtnGame) {
    muteBtnGame.addEventListener('click', () => {
        toggleAudio();
    });
}

// Update audio toggle button icon based on initial state
updateAudioToggleIcon();

// Initialize
loadHighScores();
