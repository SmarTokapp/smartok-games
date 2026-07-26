// Brain Spark: Quiz Blitz - Educational Trivia Game
// Cyberpunk-themed fast-paced quiz game with streak multipliers and sound effects
// Music from Uppbeat: Kevin MacLeod - Backed Vibes | License code: ZQA249WJ8JURTTID

// Translation Dictionary
const translations = {
    en: {
        chooseCategory: "Choose Category",
        highScore: "High Score",
        score: "Score",
        streak: "streak",
        gameOver: "Game Over!",
        finalScore: "Final Score",
        questions: "Questions",
        correct: "Correct",
        bestStreak: "Best Streak",
        newHighScore: "New High Score!",
        playAgain: "Play Again",
        replayCategory: "Replay Category",
        mainMenu: "Main Menu",
        timesUp: "Time's up!",
        wrong: "Wrong!",
        points: "points!"
    },
    es: {
        chooseCategory: "Elige Categoría",
        highScore: "Puntuación Máxima",
        score: "Puntuación",
        streak: "racha",
        gameOver: "¡Fin del Juego!",
        finalScore: "Puntuación Final",
        questions: "Preguntas",
        correct: "Correctas",
        bestStreak: "Mejor Racha",
        newHighScore: "¡Nueva Puntuación Máxima!",
        playAgain: "Jugar de Nuevo",
        replayCategory: "Repetir Categoría",
        mainMenu: "Menú Principal",
        timesUp: "¡Tiempo Agotado!",
        wrong: "¡Incorrecto!",
        points: "puntos!"
    }
};

// Detect language
let currentLanguage = 'en';
const userLang = navigator.language || navigator.userLanguage;
if (userLang.startsWith('es')) {
    currentLanguage = 'es';
}

function t(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

// Game State
const gameState = {
    currentScreen: 'start',
    category: null,
    currentQuestion: null,
    score: 0,
    streak: 0,
    bestStreak: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    lives: 3,
    timer: 10,
    timerInterval: null,
    availableQuestions: [],
    highScores: {
        science: parseInt(localStorage.getItem('brainSpark_highScore_science')) || 0,
        tech: parseInt(localStorage.getItem('brainSpark_highScore_tech')) || 0,
        history: parseInt(localStorage.getItem('brainSpark_highScore_history')) || 0,
        innovation: parseInt(localStorage.getItem('brainSpark_highScore_innovation')) || 0
    }
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

// Audio State
let isMuted = localStorage.getItem('brainSpark_muted') === 'true';
if (isMuted) {
    bgm.muted = true;
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

// Add global interaction listener
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });

// Question Database
const questions = {
    science: [
        { question: "What is the chemical symbol for gold?", answers: ["Au", "Ag", "Fe", "Cu"], correct: 0 },
        { question: "What planet is known as the Red Planet?", answers: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
        { question: "What is the hardest natural substance on Earth?", answers: ["Gold", "Iron", "Diamond", "Platinum"], correct: 2 },
        { question: "What gas do plants absorb from the atmosphere?", answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correct: 2 },
        { question: "What is the largest organ in the human body?", answers: ["Heart", "Liver", "Brain", "Skin"], correct: 3 },
        { question: "What is the speed of light in km/s (approximately)?", answers: ["300,000", "150,000", "500,000", "100,000"], correct: 0 },
        { question: "What is the chemical formula for water?", answers: ["CO2", "H2O", "O2", "NaCl"], correct: 1 },
        { question: "What type of animal is a dolphin?", answers: ["Fish", "Reptile", "Mammal", "Amphibian"], correct: 2 },
        { question: "What is the smallest unit of matter?", answers: ["Molecule", "Atom", "Cell", "Electron"], correct: 1 },
        { question: "What is the powerhouse of the cell?", answers: ["Nucleus", "Ribosome", "Mitochondria", "Golgi apparatus"], correct: 2 },
        { question: "What is the most abundant gas in Earth's atmosphere?", answers: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Argon"], correct: 2 },
        { question: "What is the chemical symbol for oxygen?", answers: ["Ox", "O", "Og", "On"], correct: 1 },
        { question: "What is the study of fossils called?", answers: ["Paleontology", "Archaeology", "Geology", "Biology"], correct: 0 },
        { question: "What is the largest planet in our solar system?", answers: ["Saturn", "Jupiter", "Neptune", "Uranus"], correct: 1 },
        { question: "What is the process by which plants make food?", answers: ["Respiration", "Digestion", "Photosynthesis", "Fermentation"], correct: 2 },
        { question: "What is the chemical symbol for sodium?", answers: ["So", "Na", "Sd", "Nm"], correct: 1 },
        { question: "What is the study of earthquakes called?", answers: ["Seismology", "Volcanology", "Meteorology", "Geology"], correct: 0 },
        { question: "What is the closest star to Earth?", answers: ["Alpha Centauri", "Proxima Centauri", "The Sun", "Sirius"], correct: 2 },
        { question: "What is the chemical formula for carbon dioxide?", answers: ["CO", "C2O", "CO2", "C2O2"], correct: 2 },
        { question: "What is the study of insects called?", answers: ["Entomology", "Herpetology", "Ornithology", "Ichthyology"], correct: 0 },
        { question: "What is the chemical symbol for iron?", answers: ["Ir", "Fe", "In", "Io"], correct: 1 },
        { question: "What is the layer of Earth we live on called?", answers: ["Mantle", "Core", "Crust", "Asthenosphere"], correct: 2 },
        { question: "What is the chemical symbol for helium?", answers: ["He", "Hl", "Hm", "Hn"], correct: 0 },
        { question: "What is the study of birds called?", answers: ["Ornithology", "Entomology", "Herpetology", "Mammalogy"], correct: 0 },
        { question: "What is the chemical formula for salt?", answers: ["NaCl", "Na2Cl", "NaCl2", "Na2Cl2"], correct: 0 },
        { question: "What is the largest bone in the human body?", answers: ["Skull", "Femur", "Humerus", "Tibia"], correct: 1 },
        { question: "What is the chemical symbol for potassium?", answers: ["Po", "Pt", "K", "Pm"], correct: 2 },
        { question: "What is the study of reptiles called?", answers: ["Herpetology", "Ornithology", "Ichthyology", "Mammalogy"], correct: 0 },
        { question: "What is the chemical formula for glucose?", answers: ["C6H12O6", "C12H6O6", "C6H6O12", "C12H12O6"], correct: 0 },
        { question: "What is the study of fish called?", answers: ["Ichthyology", "Herpetology", "Ornithology", "Entomology"], correct: 0 },
    ],
    tech: [
        { question: "What does CPU stand for?", answers: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"], correct: 0 },
        { question: "What programming language is known for its coffee cup logo?", answers: ["Python", "JavaScript", "Java", "C++"], correct: 2 },
        { question: "What does HTML stand for?", answers: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
        { question: "What company created the iPhone?", answers: ["Google", "Microsoft", "Apple", "Samsung"], correct: 2 },
        { question: "What is the brain of a computer?", answers: ["RAM", "Hard Drive", "CPU", "GPU"], correct: 2 },
        { question: "What does URL stand for?", answers: ["Universal Resource Locator", "Uniform Resource Locator", "United Resource Link", "Universal Reference Link"], correct: 1 },
        { question: "What is the main function of a firewall?", answers: ["Speed up internet", "Block unauthorized access", "Store data", "Print documents"], correct: 1 },
        { question: "What does AI stand for?", answers: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Automated Interface"], correct: 1 },
        { question: "What is the most popular mobile operating system?", answers: ["iOS", "Windows", "Android", "Linux"], correct: 2 },
        { question: "What does VPN stand for?", answers: ["Virtual Private Network", "Virtual Public Network", "Virtual Protected Network", "Visual Private Network"], correct: 0 },
        { question: "What does RAM stand for?", answers: ["Random Access Memory", "Read Access Memory", "Random Application Memory", "Read Application Memory"], correct: 0 },
        { question: "What company developed the first graphical web browser?", answers: ["Microsoft", "Netscape", "Google", "Mozilla"], correct: 1 },
        { question: "What is the main programming language for iOS apps?", answers: ["Java", "Python", "Swift", "C++"], correct: 2 },
        { question: "What does HTTP stand for?", answers: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Protocol", "High Tech Transmission Protocol"], correct: 0 },
        { question: "What is the most used programming language?", answers: ["Java", "Python", "JavaScript", "C++"], correct: 1 },
        { question: "What does SSD stand for?", answers: ["Solid State Drive", "Standard Storage Drive", "Secure Storage Device", "System Storage Device"], correct: 0 },
        { question: "What company owns Android?", answers: ["Microsoft", "Apple", "Google", "Samsung"], correct: 2 },
        { question: "What is the main function of a GPU?", answers: ["Process data", "Render graphics", "Store files", "Connect to internet"], correct: 1 },
        { question: "What does API stand for?", answers: ["Application Programming Interface", "Application Protocol Interface", "Automated Programming Interface", "Application Process Integration"], correct: 0 },
        { question: "What is the first computer virus called?", answers: ["Elk Cloner", "Brain", "Creeper", "Melissa"], correct: 0 },
        { question: "What does BIOS stand for?", answers: ["Basic Input/Output System", "Basic Integrated Operating System", "Binary Input/Output System", "Basic Interface Operating System"], correct: 0 },
        { question: "What company created the first smartphone?", answers: ["Apple", "Nokia", "IBM", "Motorola"], correct: 2 },
        { question: "What is the main purpose of a router?", answers: ["Store data", "Route network traffic", "Render graphics", "Process code"], correct: 1 },
        { question: "What does CSS stand for?", answers: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], correct: 1 },
        { question: "What is the most popular database language?", answers: ["Python", "SQL", "JavaScript", "C++"], correct: 1 },
        { question: "What company developed the first commercial antivirus software?", answers: ["McAfee", "Norton", "Kaspersky", "Symantec"], correct: 0 },
        { question: "What does IoT stand for?", answers: ["Internet of Things", "Input of Technology", "Integration of Things", "Internet on Technology"], correct: 0 },
        { question: "What is the main programming language for Android apps?", answers: ["Swift", "Java", "Python", "C++"], correct: 1 },
        { question: "What does HTTPS stand for?", answers: ["HyperText Transfer Protocol Secure", "High Tech Transfer Protocol Secure", "HyperText Transmission Protocol Secure", "High Tech Transmission Protocol Secure"], correct: 0 },
        { question: "What is the most popular cloud storage service?", answers: ["Dropbox", "Google Drive", "OneDrive", "iCloud"], correct: 1 },
        { question: "What company created the first smartwatch?", answers: ["Apple", "Samsung", "Pebble", "Sony"], correct: 2 },
    ],
    history: [
        { question: "In which year did World War II end?", answers: ["1943", "1944", "1945", "1946"], correct: 2 },
        { question: "Who was the first President of the United States?", answers: ["Thomas Jefferson", "John Adams", "George Washington", "Benjamin Franklin"], correct: 2 },
        { question: "Which ancient wonder was located in Egypt?", answers: ["Hanging Gardens", "Colossus", "Great Pyramid", "Lighthouse"], correct: 2 },
        { question: "What year did the Titanic sink?", answers: ["1910", "1911", "1912", "1913"], correct: 2 },
        { question: "Who painted the Mona Lisa?", answers: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Donatello"], correct: 2 },
        { question: "What was the name of the first satellite in space?", answers: ["Apollo", "Sputnik", "Explorer", "Voyager"], correct: 1 },
        { question: "Which empire built the Colosseum?", answers: ["Greek", "Roman", "Egyptian", "Persian"], correct: 1 },
        { question: "In what year did the Berlin Wall fall?", answers: ["1987", "1988", "1989", "1990"], correct: 2 },
        { question: "Who discovered America in 1492?", answers: ["Vasco da Gama", "Ferdinand Magellan", "Christopher Columbus", "Amerigo Vespucci"], correct: 2 },
        { question: "What ancient civilization built Machu Picchu?", answers: ["Aztec", "Maya", "Inca", "Olmec"], correct: 2 },
        { question: "In which year did World War I begin?", answers: ["1912", "1913", "1914", "1915"], correct: 2 },
        { question: "Who was the first man to walk on the moon?", answers: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"], correct: 1 },
        { question: "What ancient civilization built the Great Wall of China?", answers: ["Mongol", "Japanese", "Chinese", "Korean"], correct: 2 },
        { question: "In what year did the French Revolution begin?", answers: ["1776", "1789", "1799", "1804"], correct: 1 },
        { question: "Who was the first female Prime Minister of the UK?", answers: ["Theresa May", "Margaret Thatcher", "Queen Elizabeth II", "Queen Victoria"], correct: 1 },
        { question: "What empire was ruled by Genghis Khan?", answers: ["Roman", "Mongol", "Ottoman", "Persian"], correct: 1 },
        { question: "In what year did the American Civil War end?", answers: ["1863", "1864", "1865", "1866"], correct: 2 },
        { question: "Who wrote the Declaration of Independence?", answers: ["George Washington", "Benjamin Franklin", "Thomas Jefferson", "John Adams"], correct: 2 },
        { question: "What ancient civilization built the Parthenon?", answers: ["Roman", "Greek", "Egyptian", "Persian"], correct: 1 },
        { question: "In what year did the Soviet Union collapse?", answers: ["1989", "1990", "1991", "1992"], correct: 2 },
        { question: "Who was the first Emperor of China?", answers: ["Qin Shi Huang", "Han Wudi", "Kangxi", "Sun Yat-sen"], correct: 0 },
        { question: "What year did the first human go into space?", answers: ["1959", "1960", "1961", "1962"], correct: 2 },
        { question: "Who was the last Pharaoh of Egypt?", answers: ["Cleopatra", "Nefertiti", "Hatshepsut", "Ramses II"], correct: 0 },
        { question: "In what year did the Industrial Revolution begin?", answers: ["1700", "1750", "1760", "1800"], correct: 2 },
        { question: "Who discovered penicillin?", answers: ["Louis Pasteur", "Alexander Fleming", "Joseph Lister", "Robert Koch"], correct: 1 },
        { question: "What ancient civilization built the Taj Mahal?", answers: ["Chinese", "Indian", "Persian", "Arabian"], correct: 1 },
        { question: "In what year did the first airplane fly?", answers: ["1900", "1901", "1903", "1905"], correct: 2 },
        { question: "Who was the first person to circumnavigate the globe?", answers: ["Christopher Columbus", "Ferdinand Magellan", "Vasco da Gama", "James Cook"], correct: 1 },
        { question: "What empire ruled much of South America before the Spanish?", answers: ["Aztec", "Maya", "Inca", "Olmec"], correct: 2 },
        { question: "In what year did the first World Cup take place?", answers: ["1928", "1930", "1932", "1934"], correct: 1 },
    ],
    innovation: [
        { question: "Who invented the telephone?", answers: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "Guglielmo Marconi"], correct: 2 },
        { question: "What year was the first iPhone released?", answers: ["2005", "2006", "2007", "2008"], correct: 2 },
        { question: "Who is known as the father of computers?", answers: ["Bill Gates", "Steve Jobs", "Charles Babbage", "Alan Turing"], correct: 2 },
        { question: "What did the Wright brothers invent?", answers: ["Automobile", "Airplane", "Telephone", "Light bulb"], correct: 1 },
        { question: "Who invented the World Wide Web?", answers: ["Bill Gates", "Steve Jobs", "Tim Berners-Lee", "Mark Zuckerberg"], correct: 2 },
        { question: "What company developed the first commercially available electric car?", answers: ["Ford", "Tesla", "Toyota", "Honda"], correct: 1 },
        { question: "Who invented the light bulb?", answers: ["Nikola Tesla", "Thomas Edison", "Alexander Graham Bell", "Michael Faraday"], correct: 1 },
        { question: "What year was the first successful organ transplant performed?", answers: ["1950", "1954", "1960", "1965"], correct: 1 },
        { question: "Who invented the polio vaccine?", answers: ["Louis Pasteur", "Jonas Salk", "Alexander Fleming", "Robert Koch"], correct: 1 },
        { question: "What innovation revolutionized communication in the 19th century?", answers: ["Telegraph", "Radio", "Television", "Internet"], correct: 0 },
        { question: "Who invented the printing press?", answers: ["Leonardo da Vinci", "Johannes Gutenberg", "Benjamin Franklin", "Nicolas-Jacques Conte"], correct: 1 },
        { question: "What year was the first successful powered flight?", answers: ["1900", "1901", "1903", "1905"], correct: 2 },
        { question: "Who invented the microwave oven?", answers: ["Percy Spencer", "Ray Kroc", "John Pemberton", "George Crum"], correct: 0 },
        { question: "What is the most important invention of the 20th century?", answers: ["Television", "Computer", "Antibiotics", "Nuclear power"], correct: 2 },
        { question: "Who invented the first practical steam engine?", answers: ["James Watt", "Thomas Newcomen", "George Stephenson", "Richard Trevithick"], correct: 0 },
        { question: "What year was the first email sent?", answers: ["1969", "1971", "1973", "1975"], correct: 1 },
        { question: "Who invented the first successful airplane?", answers: ["Leonardo da Vinci", "Wright Brothers", "Samuel Langley", "Gustave Whitehead"], correct: 1 },
        { question: "What innovation made long-distance travel possible?", answers: ["Automobile", "Airplane", "Train", "Ship"], correct: 1 },
        { question: "Who invented the first practical telephone?", answers: ["Elisha Gray", "Alexander Graham Bell", "Thomas Edison", "Antonio Meucci"], correct: 1 },
        { question: "What year was the first computer built?", answers: ["1930", "1940", "1946", "1950"], correct: 2 },
        { question: "Who invented the first successful vaccine?", answers: ["Louis Pasteur", "Edward Jenner", "Jonas Salk", "Robert Koch"], correct: 1 },
        { question: "What innovation changed how we store information?", answers: ["Paper", "Printing Press", "Computer", "Internet"], correct: 2 },
        { question: "Who invented the first practical electric light?", answers: ["Nikola Tesla", "Thomas Edison", "Joseph Swan", "Hiram Maxim"], correct: 1 },
        { question: "What year was the first smartphone released?", answers: ["1990", "1992", "1994", "1996"], correct: 1 },
        { question: "Who invented the first successful airplane engine?", answers: ["Wright Brothers", "Charles Lindbergh", "Glenn Curtiss", "Samuel Langley"], correct: 0 },
        { question: "What innovation made the internet possible?", answers: ["Telephone", "Satellite", "Fiber optics", "Radio"], correct: 2 },
        { question: "Who invented the first practical automobile?", answers: ["Henry Ford", "Karl Benz", "Gottlieb Daimler", "Nicolas-Joseph Cugnot"], correct: 1 },
        { question: "What year was the first GPS satellite launched?", answers: ["1970", "1978", "1985", "1990"], correct: 1 },
        { question: "Who invented the first successful rocket?", answers: ["Wernher von Braun", "Robert Goddard", "Sergei Korolev", "Hermann Oberth"], correct: 1 },
        { question: "What innovation revolutionized medicine?", answers: ["X-ray", "Antibiotics", "Surgery", "Vaccines"], correct: 1 },
    ]
};

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Audio Context for sound effects
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSound(type) {
    if (!audioContext || isMuted) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
        oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1); // C#6
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialDecayTo = 0.01;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'wrong') {
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'gameover') {
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.2);
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.6);
    } else if (type === 'click') {
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    }
}

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    gameOver: document.getElementById('gameOverScreen')
};

const elements = {
    highScoreValue: document.getElementById('highScoreValue'),
    scoreValue: document.getElementById('scoreValue'),
    streakValue: document.getElementById('streakValue'),
    livesContainer: document.getElementById('livesContainer'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
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
    starRating: document.getElementById('starRating'),
    newHighScore: document.getElementById('newHighScore'),
    replayCategoryBtn: document.getElementById('replayCategoryBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    categoryHighScores: document.querySelectorAll('.category-high-score')
};

// Initialize
function init() {
    applyTranslations();
    updateCategoryHighScores();
    updateOverallHighScore();
    
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            initAudio();
            playSound('click');
            const category = btn.dataset.category;
            startGame(category);
        });
    });
    
    elements.replayCategoryBtn.addEventListener('click', () => {
        playSound('click');
        if (gameState.category) {
            startGame(gameState.category);
        }
    });
    
    elements.mainMenuBtn.addEventListener('click', () => {
        playSound('click');
        showScreen('start');
        updateCategoryHighScores();
        updateOverallHighScore();
    });
    
    elements.exitGameBtn.addEventListener('click', () => {
        playSound('click');
        clearInterval(gameState.timerInterval);
        showScreen('start');
        updateCategoryHighScores();
        updateOverallHighScore();
    });
    
    elements.audioToggleBtn.addEventListener('click', () => {
        toggleAudio();
    });
    
    const audioToggleBtnGame = document.getElementById('audioToggleBtnGame');
    if (audioToggleBtnGame) {
        audioToggleBtnGame.addEventListener('click', () => {
            toggleAudio();
        });
    }
    
    // Update audio toggle button icon based on initial state
    updateAudioToggleIcon();
}

function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('brainSpark_muted', isMuted);
    updateAudioToggleIcon();
    
    if (isMuted) {
        bgm.pause();
    } else if (hasInteracted) {
        bgm.play().catch(e => console.log('Audio play failed:', e));
    }
}

function updateAudioToggleIcon() {
    elements.audioToggleBtn.textContent = isMuted ? '🔇' : '🔊';
    const audioToggleBtnGame = document.getElementById('audioToggleBtnGame');
    if (audioToggleBtnGame) {
        audioToggleBtnGame.textContent = isMuted ? '🔇' : '🔊';
    }
}

function getOverallHighScore() {
    return Math.max(0, ...Object.values(gameState.highScores));
}

function updateOverallHighScore() {
    elements.highScoreValue.textContent = getOverallHighScore();
}

function applyTranslations() {
    // Update static text elements
    document.querySelector('.section-title').textContent = t('chooseCategory');
    document.querySelector('.high-score-label').textContent = t('highScore');
    document.querySelector('.score-label').textContent = t('score');
    document.querySelector('.streak-label').textContent = t('streak');
    document.querySelector('.game-over-title').textContent = t('gameOver');
    document.querySelector('.final-score-label').textContent = t('finalScore');
    document.querySelectorAll('.stat-label')[0].textContent = t('questions');
    document.querySelectorAll('.stat-label')[1].textContent = t('correct');
    document.querySelectorAll('.stat-label')[2].textContent = t('bestStreak');
    document.querySelector('.new-high-score-text').textContent = t('newHighScore');
    elements.replayCategoryBtn.textContent = t('replayCategory');
    elements.mainMenuBtn.textContent = t('mainMenu');
}

function updateCategoryHighScores() {
    elements.categoryBtns.forEach(btn => {
        const category = btn.dataset.category;
        const highScore = gameState.highScores[category];
        const highScoreDisplay = btn.querySelector('.category-high-score');
        if (highScoreDisplay) {
            highScoreDisplay.textContent = highScore > 0 ? highScore : '-';
        }
    });
}

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenName].classList.add('active');
    gameState.currentScreen = screenName;
}

function startGame(category) {
    gameState.category = category;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.bestStreak = 0;
    gameState.questionsAnswered = 0;
    gameState.correctAnswers = 0;
    gameState.lives = 3;
    
    // Initialize available questions queue with shuffled questions
    gameState.availableQuestions = shuffleArray([...questions[category]]);
    
    updateUI();
    updateLivesUI();
    showScreen('game');
    loadQuestion();
}

function loadQuestion() {
    // Refill available questions if empty
    if (gameState.availableQuestions.length === 0) {
        gameState.availableQuestions = shuffleArray([...questions[gameState.category]]);
    }
    
    // Pop next question from queue
    gameState.currentQuestion = gameState.availableQuestions.pop();
    
    elements.currentCategory.textContent = gameState.category.charAt(0).toUpperCase() + gameState.category.slice(1);
    elements.questionText.textContent = gameState.currentQuestion.question;
    
    // Shuffle answers
    const shuffledAnswers = [...gameState.currentQuestion.answers]
        .map((answer, index) => ({ answer, originalIndex: index }))
        .sort(() => Math.random() - 0.5);
    
    elements.answersContainer.innerHTML = '';
    
    shuffledAnswers.forEach(({ answer, originalIndex }) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.textContent = answer;
        btn.addEventListener('click', () => handleAnswer(originalIndex, btn));
        elements.answersContainer.appendChild(btn);
    });
    
    startTimer();
}

function startTimer() {
    gameState.timer = 10;
    updateTimerUI();
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        gameState.timer -= 0.1;
        updateTimerUI();
        
        if (gameState.timer <= 0) {
            clearInterval(gameState.timerInterval);
            handleTimeUp();
        }
    }, 100);
}

function updateTimerUI() {
    const percentage = (gameState.timer / 10) * 100;
    elements.timerProgress.style.width = `${percentage}%`;
    elements.timerValue.textContent = Math.ceil(gameState.timer);
    
    // Change color based on time remaining
    if (gameState.timer <= 3) {
        elements.timerProgress.style.background = 'linear-gradient(90deg, #ff4c68, #ff0000)';
    } else {
        elements.timerProgress.style.background = 'linear-gradient(90deg, #00f3ff, #ff00ff)';
    }
}

function handleAnswer(selectedIndex, btnElement) {
    clearInterval(gameState.timerInterval);
    
    const isCorrect = selectedIndex === gameState.currentQuestion.correct;
    gameState.questionsAnswered++;
    
    // Disable all buttons
    const allButtons = elements.answersContainer.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        btnElement.classList.add('correct');
        gameState.streak++;
        gameState.correctAnswers++;
        
        if (gameState.streak > gameState.bestStreak) {
            gameState.bestStreak = gameState.streak;
        }
        
        // Calculate score with streak multiplier
        const baseScore = 100;
        const streakMultiplier = 1 + (gameState.streak - 1) * 0.1;
        const timeBonus = Math.floor(gameState.timer * 10);
        const totalScore = Math.floor((baseScore + timeBonus) * streakMultiplier);
        gameState.score += totalScore;
        
        showFeedback(true);
        playSound('correct');
    } else {
        btnElement.classList.add('wrong');
        // Highlight correct answer
        allButtons[gameState.currentQuestion.correct].classList.add('correct');
        gameState.streak = 0;
        gameState.lives--;
        updateLivesUI();
        showFeedback(false);
        playSound('wrong');
        
        if (gameState.lives <= 0) {
            setTimeout(() => {
                elements.feedbackOverlay.style.display = 'none';
                endGame();
            }, 1500);
            return;
        }
    }
    
    updateUI();
    
    setTimeout(() => {
        elements.feedbackOverlay.style.display = 'none';
        if (gameState.lives > 0) {
            loadQuestion();
        }
    }, 1500);
}

function handleTimeUp() {
    gameState.streak = 0;
    gameState.questionsAnswered++;
    gameState.lives--;
    updateLivesUI();
    
    // Highlight correct answer
    const allButtons = elements.answersContainer.querySelectorAll('.answer-btn');
    allButtons.forEach(btn => btn.disabled = true);
    allButtons[gameState.currentQuestion.correct].classList.add('correct');
    
    showFeedback(false, true);
    playSound('wrong');
    updateUI();
    
    if (gameState.lives <= 0) {
        setTimeout(() => {
            elements.feedbackOverlay.style.display = 'none';
            endGame();
        }, 1500);
        return;
    }
    
    setTimeout(() => {
        elements.feedbackOverlay.style.display = 'none';
        if (gameState.lives > 0) {
            loadQuestion();
        }
    }, 1500);
}

function showFeedback(isCorrect, isTimeout = false) {
    elements.feedbackOverlay.style.display = 'flex';
    
    if (isCorrect) {
        elements.feedbackIcon.textContent = '✓';
        const pointsEarned = Math.floor((100 + Math.floor(gameState.timer * 10)) * (1 + (gameState.streak - 1) * 0.1));
        elements.feedbackText.textContent = `+${pointsEarned} ${t('points')}`;
        elements.feedbackText.style.color = '#00ff88';
    } else {
        elements.feedbackIcon.textContent = isTimeout ? '⏰' : '✗';
        elements.feedbackText.textContent = isTimeout ? t('timesUp') : t('wrong');
        elements.feedbackText.style.color = '#ff4c68';
    }
}

function updateUI() {
    elements.scoreValue.textContent = gameState.score;
    elements.streakValue.textContent = gameState.streak;
}

function updateLivesUI() {
    elements.livesContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'life-heart';
        heart.textContent = '❤️';
        if (i >= gameState.lives) {
            heart.style.opacity = '0.3';
            heart.style.filter = 'grayscale(100%)';
        }
        elements.livesContainer.appendChild(heart);
    }
}

function endGame() {
    clearInterval(gameState.timerInterval);
    playSound('gameover');
    
    // Check for new high score in current category
    const categoryHighScore = gameState.highScores[gameState.category];
    const isNewHighScore = gameState.score > categoryHighScore;
    if (isNewHighScore) {
        gameState.highScores[gameState.category] = gameState.score;
        localStorage.setItem(`brainSpark_highScore_${gameState.category}`, gameState.score);
    }
    
    // Calculate star rating based on accuracy
    const accuracy = gameState.questionsAnswered > 0 
        ? (gameState.correctAnswers / gameState.questionsAnswered) * 100 
        : 0;
    let stars = 0;
    if (accuracy >= 80) stars = 3;
    else if (accuracy >= 50) stars = 2;
    else if (accuracy > 0) stars = 1;
    
    // Update star rating display
    elements.starRating.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '⭐';
        if (i < stars) {
            star.style.opacity = '1';
            star.style.filter = 'none';
        } else {
            star.style.opacity = '0.3';
            star.style.filter = 'grayscale(100%)';
        }
        elements.starRating.appendChild(star);
    }
    
    elements.finalScoreValue.textContent = gameState.score;
    elements.questionsAnswered.textContent = gameState.questionsAnswered;
    elements.correctAnswers.textContent = gameState.correctAnswers;
    elements.bestStreak.textContent = gameState.bestStreak;
    elements.newHighScore.style.display = isNewHighScore ? 'flex' : 'none';
    
    showScreen('gameOver');
}

// Start the game
init();
