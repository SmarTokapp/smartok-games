// Chrono Mind: Time Odyssey - Game Script

// Question Database - 30 questions per category (120 total)
const questions = {
    ancient: [
        { question: "Which ancient civilization built the Great Pyramid of Giza?", answers: ["Ancient Egyptians", "Mesopotamians", "Romans", "Greeks"], correct: 0 },
        { question: "Who was the first Emperor of Rome?", answers: ["Julius Caesar", "Augustus", "Nero", "Trajan"], correct: 1 },
        { question: "The Hanging Gardens were located in which ancient city?", answers: ["Babylon", "Athens", "Rome", "Alexandria"], correct: 0 },
        { question: "Which empire was ruled by the Pharaohs?", answers: ["Egyptian Empire", "Roman Empire", "Persian Empire", "Greek Empire"], correct: 0 },
        { question: "The Terracotta Army was built for which Chinese emperor?", answers: ["Qin Shi Huang", "Han Wudi", "Kangxi", "Kublai Khan"], correct: 0 },
        { question: "Which ancient city was buried by Mount Vesuvius in 79 AD?", answers: ["Pompeii", "Rome", "Athens", "Carthage"], correct: 0 },
        { question: "The Code of Hammurabi was created in which ancient civilization?", answers: ["Babylonian", "Egyptian", "Greek", "Roman"], correct: 0 },
        { question: "Which ancient civilization developed the writing system known as cuneiform?", answers: ["Sumerians", "Egyptians", "Phoenicians", "Minoans"], correct: 0 },
        { question: "The Parthenon was dedicated to which Greek goddess?", answers: ["Athena", "Hera", "Aphrodite", "Artemis"], correct: 0 },
        { question: "Which river was crucial to Ancient Egyptian civilization?", answers: ["Nile", "Tigris", "Euphrates", "Indus"], correct: 0 },
        { question: "The Persian Empire was founded by which leader?", answers: ["Cyrus the Great", "Darius I", "Xerxes I", "Alexander the Great"], correct: 0 },
        { question: "Which ancient civilization built Machu Picchu?", answers: ["Inca Empire", "Maya", "Aztec", "Olmec"], correct: 0 },
        { question: "The Rosetta Stone helped decipher which ancient writing system?", answers: ["Egyptian Hieroglyphs", "Cuneiform", "Linear B", "Mayan Glyphs"], correct: 0 },
        { question: "Which ancient Greek city-state was known for its military prowess?", answers: ["Sparta", "Athens", "Corinth", "Thebes"], correct: 0 },
        { question: "The Colosseum was built during which Roman dynasty?", answers: ["Flavian", "Julian", "Antonine", "Severan"], correct: 0 },
        { question: "Which ancient civilization created the first known written laws?", answers: ["Sumerians", "Egyptians", "Babylonians", "Assyrians"], correct: 0 },
        { question: "The Library of Alexandria was located in which ancient city?", answers: ["Alexandria", "Rome", "Athens", "Constantinople"], correct: 0 },
        { question: "Which ancient empire stretched from Spain to India under Alexander?", answers: ["Macedonian Empire", "Roman Empire", "Persian Empire", "Greek Empire"], correct: 0 },
        { question: "The ancient city of Troy was located in modern-day?", answers: ["Turkey", "Greece", "Italy", "Egypt"], correct: 0 },
        { question: "Which ancient civilization built the city of Teotihuacan?", answers: ["Mesoamerican", "Egyptian", "Greek", "Roman"], correct: 0 },
        { question: "The ancient Olmec civilization was located in?", answers: ["Mesoamerica", "South America", "North America", "Europe"], correct: 0 },
        { question: "Which ancient empire ruled much of the Mediterranean for over 500 years?", answers: ["Roman Empire", "Greek Empire", "Persian Empire", "Egyptian Empire"], correct: 0 },
        { question: "The ancient city of Petra was carved into which rock formation?", answers: ["Sandstone cliffs", "Granite mountains", "Limestone hills", "Volcanic rock"], correct: 0 },
        { question: "Which ancient civilization developed the concept of democracy?", answers: ["Ancient Greeks", "Romans", "Egyptians", "Persians"], correct: 0 },
        { question: "The ancient Phoenicians were known for?", answers: ["Maritime trade and alphabet", "Pyramid building", "Philosophy", "Military conquest"], correct: 0 },
        { question: "Which ancient empire built the city of Persepolis?", answers: ["Persian Empire", "Greek Empire", "Roman Empire", "Egyptian Empire"], correct: 0 },
        { question: "The ancient Minoan civilization was located on which island?", answers: ["Crete", "Sicily", "Cyprus", "Sardinia"], correct: 0 },
        { question: "Which ancient civilization created the first known plumbing systems?", answers: ["Indus Valley", "Egyptian", "Mesopotamian", "Greek"], correct: 0 },
        { question: "The ancient city of Carthage was founded by colonists from?", answers: ["Phoenicia", "Greece", "Rome", "Egypt"], correct: 0 },
        { question: "Which ancient empire built the Angkor Wat temple complex?", answers: ["Khmer Empire", "Maya Empire", "Inca Empire", "Chola Empire"], correct: 0 }
    ],
    inventions: [
        { question: "Who invented the printing press?", answers: ["Johannes Gutenberg", "Leonardo da Vinci", "Galileo Galilei", "Nicolas Copernicus"], correct: 0 },
        { question: "The light bulb was patented by which inventor?", answers: ["Thomas Edison", "Nikola Tesla", "Alexander Graham Bell", "George Westinghouse"], correct: 0 },
        { question: "Who discovered penicillin?", answers: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Joseph Lister"], correct: 0 },
        { question: "The telephone was invented by?", answers: ["Alexander Graham Bell", "Thomas Edison", "Nikola Tesla", "Guglielmo Marconi"], correct: 0 },
        { question: "Who developed the theory of relativity?", answers: ["Albert Einstein", "Isaac Newton", "Niels Bohr", "Max Planck"], correct: 0 },
        { question: "The Wright brothers are famous for inventing?", answers: ["Airplane", "Automobile", "Telephone", "Radio"], correct: 0 },
        { question: "Who discovered the structure of DNA?", answers: ["Watson and Crick", "Gregor Mendel", "Charles Darwin", "Louis Pasteur"], correct: 0 },
        { question: "The steam engine was improved by which inventor?", answers: ["James Watt", "Thomas Newcomen", "George Stephenson", "Robert Fulton"], correct: 0 },
        { question: "Who invented the World Wide Web?", answers: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Vint Cerf"], correct: 0 },
        { question: "The first successful vaccine was developed by?", answers: ["Edward Jenner", "Louis Pasteur", "Robert Koch", "Jonas Salk"], correct: 0 },
        { question: "Who invented the phonograph?", answers: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Guglielmo Marconi"], correct: 0 },
        { question: "The discovery of radioactivity is credited to?", answers: ["Marie Curie", "Henri Becquerel", "Pierre Curie", "Ernest Rutherford"], correct: 1 },
        { question: "Who invented the first practical automobile?", answers: ["Karl Benz", "Henry Ford", "Gottlieb Daimler", "Nicolas-Joseph Cugnot"], correct: 0 },
        { question: "The first satellite, Sputnik, was launched by which country?", answers: ["Soviet Union", "United States", "China", "Germany"], correct: 0 },
        { question: "Who developed the polio vaccine?", answers: ["Jonas Salk", "Albert Sabin", "Edward Jenner", "Louis Pasteur"], correct: 0 },
        { question: "The microscope was invented by?", answers: ["Zacharias Janssen", "Antonie van Leeuwenhoek", "Robert Hooke", "Galileo Galilei"], correct: 0 },
        { question: "Who discovered the laws of motion?", answers: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Johannes Kepler"], correct: 0 },
        { question: "The first computer was developed by?", answers: ["Alan Turing", "Charles Babbage", "John von Neumann", "Konrad Zuse"], correct: 1 },
        { question: "Who invented the television?", answers: ["John Logie Baird", "Philo Farnsworth", "Vladimir Zworykin", "All contributed"], correct: 3 },
        { question: "The discovery of X-rays is credited to?", answers: ["Wilhelm Röntgen", "Marie Curie", "Henri Becquerel", "Ernest Rutherford"], correct: 0 },
        { question: "Who invented the first successful airplane?", answers: ["Wright Brothers", "Santos-Dumont", "Clement Ader", "Gustave Whitehead"], correct: 0 },
        { question: "The first battery was invented by?", answers: ["Alessandro Volta", "Michael Faraday", "Benjamin Franklin", "Luigi Galvani"], correct: 0 },
        { question: "Who discovered the electron?", answers: ["J.J. Thomson", "Ernest Rutherford", "Niels Bohr", "James Chadwick"], correct: 0 },
        { question: "The first practical radio was developed by?", answers: ["Guglielmo Marconi", "Nikola Tesla", "Heinrich Hertz", "Edwin Armstrong"], correct: 0 },
        { question: "Who invented the first synthetic plastic?", answers: ["Leo Baekeland", "John Wesley Hyatt", "Alexander Parkes", "Hermann Staudinger"], correct: 0 },
        { question: "The discovery of gravity is attributed to?", answers: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Johannes Kepler"], correct: 0 },
        { question: "Who invented the first practical telephone?", answers: ["Alexander Graham Bell", "Elisha Gray", "Antonio Meucci", "All contributed"], correct: 3 },
        { question: "The first successful blood transfusion was performed by?", answers: ["James Blundell", "William Harvey", "Karl Landsteiner", "Jean-Baptiste Denys"], correct: 0 },
        { question: "Who discovered the laws of planetary motion?", answers: ["Johannes Kepler", "Isaac Newton", "Nicolaus Copernicus", "Galileo Galilei"], correct: 0 },
        { question: "The first laser was developed by?", answers: ["Theodore Maiman", "Charles Townes", "Arthur Schawlow", "Gordon Gould"], correct: 0 }
    ],
    history: [
        { question: "In which year did World War II end?", answers: ["1945", "1944", "1946", "1943"], correct: 0 },
        { question: "The French Revolution began in which year?", answers: ["1789", "1776", "1804", "1815"], correct: 0 },
        { question: "Who was the first President of the United States?", answers: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"], correct: 0 },
        { question: "The Berlin Wall fell in which year?", answers: ["1989", "1990", "1988", "1991"], correct: 0 },
        { question: "Which war was fought between the North and South in the US?", answers: ["American Civil War", "Revolutionary War", "War of 1812", "Mexican-American War"], correct: 0 },
        { question: "The Industrial Revolution began in which country?", answers: ["England", "France", "Germany", "United States"], correct: 0 },
        { question: "Who was the leader of the Soviet Union during WWII?", answers: ["Joseph Stalin", "Vladimir Lenin", "Nikita Khrushchev", "Mikhail Gorbachev"], correct: 0 },
        { question: "The Magna Carta was signed in which year?", answers: ["1215", "1066", "1492", "1776"], correct: 0 },
        { question: "Which empire was known as the 'Sick Man of Europe'?", answers: ["Ottoman Empire", "Austro-Hungarian Empire", "Russian Empire", "British Empire"], correct: 0 },
        { question: "The Renaissance began in which country?", answers: ["Italy", "France", "England", "Spain"], correct: 0 },
        { question: "Who was the first woman to win a Nobel Prize?", answers: ["Marie Curie", "Pearl Buck", "Mother Teresa", "Jane Addams"], correct: 0 },
        { question: "The Treaty of Versailles ended which war?", answers: ["World War I", "World War II", "Napoleonic Wars", "Franco-Prussian War"], correct: 0 },
        { question: "Which explorer discovered the Americas in 1492?", answers: ["Christopher Columbus", "Amerigo Vespucci", "Ferdinand Magellan", "Vasco da Gama"], correct: 0 },
        { question: "The Cold War was primarily between which two superpowers?", answers: ["USA and USSR", "USA and China", "USSR and China", "USA and Germany"], correct: 0 },
        { question: "Who was the last Tsar of Russia?", answers: ["Nicholas II", "Alexander III", "Peter the Great", "Catherine the Great"], correct: 0 },
        { question: "The Spanish Armada was defeated by which country?", answers: ["England", "France", "Netherlands", "Portugal"], correct: 0 },
        { question: "Which revolution overthrew the monarchy in Russia?", answers: ["Russian Revolution", "French Revolution", "American Revolution", "Chinese Revolution"], correct: 0 },
        { question: "The Battle of Hastings occurred in which year?", answers: ["1066", "1215", "1453", "1492"], correct: 0 },
        { question: "Who was the British Prime Minister during most of WWII?", answers: ["Winston Churchill", "Neville Chamberlain", "Anthony Eden", "Clement Attlee"], correct: 0 },
        { question: "The Declaration of Independence was signed in which year?", answers: ["1776", "1789", "1812", "1865"], correct: 0 },
        { question: "Which empire ruled India before British colonization?", answers: ["Mughal Empire", "Mauryan Empire", "Gupta Empire", "Delhi Sultanate"], correct: 0 },
        { question: "The Holocaust occurred during which war?", answers: ["World War II", "World War I", "Korean War", "Vietnam War"], correct: 0 },
        { question: "Who was the first Emperor of China?", answers: ["Qin Shi Huang", "Han Wudi", "Kangxi", "Kublai Khan"], correct: 0 },
        { question: "The Age of Exploration was primarily led by which countries?", answers: ["Portugal and Spain", "England and France", "Italy and Greece", "Germany and Russia"], correct: 0 },
        { question: "Which revolution began in 1789?", answers: ["French Revolution", "American Revolution", "Industrial Revolution", "Russian Revolution"], correct: 0 },
        { question: "The Civil Rights Movement in the US was led by?", answers: ["Martin Luther King Jr.", "Malcolm X", "Rosa Parks", "All contributed"], correct: 3 },
        { question: "Who was the founder of the Mongol Empire?", answers: ["Genghis Khan", "Kublai Khan", "Timur", "Attila the Hun"], correct: 0 },
        { question: "The Great Depression began in which year?", answers: ["1929", "1929", "1933", "1941"], correct: 0 },
        { question: "Which empire conquered Constantinople in 1453?", answers: ["Ottoman Empire", "Byzantine Empire", "Roman Empire", "Persian Empire"], correct: 0 },
        { question: "The American Civil War was fought from?", answers: ["1861-1865", "1860-1864", "1862-1866", "1859-1863"], correct: 0 }
    ],
    monuments: [
        { question: "The Great Wall of China was primarily built to defend against?", answers: ["Mongol invasions", "Japanese invasions", "European colonizers", "Indian armies"], correct: 0 },
        { question: "The Statue of Liberty was a gift from which country?", answers: ["France", "England", "Germany", "Italy"], correct: 0 },
        { question: "Stonehenge is located in which country?", answers: ["England", "Scotland", "Ireland", "Wales"], correct: 0 },
        { question: "The Eiffel Tower was built for which event?", answers: ["1889 World's Fair", "1900 World's Fair", "French Revolution centennial", "Paris Exposition"], correct: 0 },
        { question: "Mount Rushmore features the faces of how many US Presidents?", answers: ["4", "2", "3", "5"], correct: 0 },
        { question: "The Taj Mahal was built as a?", answers: ["Mausoleum", "Palace", "Temple", "Fortress"], correct: 0 },
        { question: "The Colosseum was used for?", answers: ["Gladiatorial contests", "Religious ceremonies", "Political meetings", "Theatrical performances"], correct: 0 },
        { question: "The Sphinx is located near which ancient monument?", answers: ["Great Pyramid of Giza", "Hanging Gardens", "Colosseum", "Parthenon"], correct: 0 },
        { question: "The Leaning Tower of Pisa is located in which country?", answers: ["Italy", "Spain", "France", "Greece"], correct: 0 },
        { question: "Christ the Redeemer statue overlooks which city?", answers: ["Rio de Janeiro", "São Paulo", "Buenos Aires", "Lima"], correct: 0 },
        { question: "The Acropolis is located in which ancient city?", answers: ["Athens", "Rome", "Sparta", "Corinth"], correct: 0 },
        { question: "The Moai statues are found on which island?", answers: ["Easter Island", "Galapagos Islands", "Hawaii", "Madagascar"], correct: 0 },
        { question: "The Hagia Sophia was originally built as a?", answers: ["Church", "Mosque", "Palace", "Library"], correct: 0 },
        { question: "The Forbidden City was the imperial palace of which dynasty?", answers: ["Ming and Qing", "Han", "Tang", "Song"], correct: 0 },
        { question: "The Alhambra is an example of which architectural style?", answers: ["Moorish", "Gothic", "Romanesque", "Baroque"], correct: 0 },
        { question: "The Sydney Opera House was designed by?", answers: ["Jørn Utzon", "Frank Gehry", "Zaha Hadid", "Norman Foster"], correct: 0 },
        { question: "The Pyramids of Giza were built as?", answers: ["Tombs for pharaohs", "Temples", "Observatories", "Fortresses"], correct: 0 },
        { question: "The Brandenburg Gate is located in which city?", answers: ["Berlin", "Munich", "Hamburg", "Frankfurt"], correct: 0 },
        { question: "The Karnak Temple is located in which country?", answers: ["Egypt", "Sudan", "Libya", "Ethiopia"], correct: 0 },
        { question: "The Tower of London was originally built as a?", answers: ["Fortress and palace", "Prison only", "Church", "Market"], correct: 0 },
        { question: "The Palace of Versailles was built by which French king?", answers: ["Louis XIV", "Louis XVI", "Louis XV", "Louis XIII"], correct: 0 },
        { question: "The Petra Treasury is carved into?", answers: ["Sandstone cliff", "Granite mountain", "Limestone hill", "Volcanic rock"], correct: 0 },
        { question: "The Lincoln Memorial is located in which US city?", answers: ["Washington D.C.", "New York", "Philadelphia", "Boston"], correct: 0 },
        { question: "The Angkor Wat temple complex was dedicated to which religion?", answers: ["Hinduism", "Buddhism", "Islam", "Jainism"], correct: 0 },
        { question: "The Neuschwanstein Castle inspired which Disney castle?", answers: ["Sleeping Beauty Castle", "Cinderella Castle", "Beauty and the Beast Castle", "Snow White Castle"], correct: 0 },
        { question: "The Dome of the Rock is located in which city?", answers: ["Jerusalem", "Mecca", "Medina", "Damascus"], correct: 0 },
        { question: "The Chichen Itza pyramid is located in which country?", answers: ["Mexico", "Guatemala", "Belize", "Honduras"], correct: 0 },
        { question: "The Winter Palace is located in which city?", answers: ["Saint Petersburg", "Moscow", "Kiev", "Warsaw"], correct: 0 },
        { question: "The Arc de Triomphe commemorates which event?", answers: ["Napoleonic victories", "French Revolution", "World War I", "World War II"], correct: 0 },
        { question: "The Karnak Temple complex was dedicated to which god?", answers: ["Amun-Ra", "Ra", "Osiris", "Anubis"], correct: 0 }
    ]
};

// Game State
let currentCategory = null;
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;
let totalQuestionsAnswered = 0;
let isMuted = false;
let audioContext = null;
let backgroundMusic = null;
let usedQuestionIndices = new Set();

// DOM Elements
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const startSoundToggle = document.getElementById('startSoundToggle');
const gameSoundToggle = document.getElementById('gameSoundToggle');
const categoryBtns = document.querySelectorAll('.category-btn');
const questionText = document.getElementById('questionText');
const answersGrid = document.getElementById('answersGrid');
const livesCount = document.getElementById('livesCount');
const scoreValue = document.getElementById('scoreValue');
const streakCount = document.getElementById('streakCount');
const feedbackOverlay = document.getElementById('feedbackOverlay');
const feedbackText = document.getElementById('feedbackText');
const finalScore = document.getElementById('finalScore');
const correctCount = document.getElementById('correctCount');
const bestStreakEl = document.getElementById('bestStreak');
const accuracyEl = document.getElementById('accuracy');
const starRating = document.getElementById('starRating');
const replayBtn = document.getElementById('replayBtn');
const menuBtn = document.getElementById('menuBtn');

// Initialize Audio Context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

// Web Audio API Sound Effects
function playClickSound() {
    if (isMuted || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playCorrectSound() {
    if (isMuted || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 1200;
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

function playWrongSound() {
    if (isMuted || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 300;
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playGameOverSound() {
    if (isMuted || !audioContext) return;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 200;
    oscillator.type = 'triangle';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Background Music
function initBackgroundMusic() {
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Ethereal%20Relaxation.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
}

function toggleMusic() {
    if (!backgroundMusic) {
        initBackgroundMusic();
    }
    
    if (isMuted) {
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
        startSoundToggle.textContent = '🔊';
        gameSoundToggle.textContent = '🔊';
    } else {
        backgroundMusic.pause();
        startSoundToggle.textContent = '🔇';
        gameSoundToggle.textContent = '🔇';
    }
    isMuted = !isMuted;
}

// Shuffle array function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get shuffled questions without repetition
function getShuffledQuestions(category) {
    const categoryQuestions = questions[category];
    const availableIndices = categoryQuestions.map((_, index) => index);
    const shuffledIndices = shuffleArray(availableIndices);
    
    // Filter out already used questions
    const availableForSession = shuffledIndices.filter(index => !usedQuestionIndices.has(index));
    
    // If all questions have been used, reset and start fresh
    if (availableForSession.length === 0) {
        usedQuestionIndices.clear();
        return shuffleArray(categoryQuestions);
    }
    
    return availableForSession.map(index => {
        usedQuestionIndices.add(index);
        return categoryQuestions[index];
    });
}

// Start Game
function startGame(category) {
    initAudio();
    playClickSound();
    
    currentCategory = category;
    currentQuestions = getShuffledQuestions(category);
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    streak = 0;
    bestStreak = 0;
    correctAnswers = 0;
    totalQuestionsAnswered = 0;
    
    updateUI();
    showScreen('gameScreen');
    loadQuestion();
    
    if (!isMuted && !backgroundMusic) {
        initBackgroundMusic();
        backgroundMusic.play().catch(e => console.log('Audio play failed:', e));
    }
}

// Load Question
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        endGame();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    
    answersGrid.innerHTML = '';
    
    const shuffledAnswers = shuffleArray([...question.answers]);
    
    shuffledAnswers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.addEventListener('click', () => handleAnswer(answer, question.answers, question.correct));
        answersGrid.appendChild(button);
    });
}

// Handle Answer
function handleAnswer(selectedAnswer, allAnswers, correctIndex) {
    const correctAnswer = allAnswers[correctIndex];
    const isCorrect = selectedAnswer === correctAnswer;
    
    totalQuestionsAnswered++;
    
    const buttons = answersGrid.querySelectorAll('.answer-btn');
    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn.textContent === selectedAnswer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    if (isCorrect) {
        playCorrectSound();
        correctAnswers++;
        streak++;
        if (streak > bestStreak) bestStreak = streak;
        score += 10 + (streak * 2);
        showFeedback('✓', 'correct');
    } else {
        playWrongSound();
        lives--;
        streak = 0;
        showFeedback('✗', 'wrong');
    }
    
    updateUI();
    
    setTimeout(() => {
        if (lives <= 0) {
            endGame();
        } else {
            currentQuestionIndex++;
            loadQuestion();
        }
    }, 1000);
}

// Show Feedback
function showFeedback(text, type) {
    feedbackText.textContent = text;
    feedbackText.className = `feedback-text ${type}`;
    feedbackOverlay.classList.add('show');
    
    setTimeout(() => {
        feedbackOverlay.classList.remove('show');
    }, 500);
}

// Update UI
function updateUI() {
    livesCount.textContent = lives;
    scoreValue.textContent = score;
    streakCount.textContent = streak;
}

// End Game
function endGame() {
    playGameOverSound();
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    
    finalScore.textContent = score;
    correctCount.textContent = correctAnswers;
    bestStreakEl.textContent = bestStreak;
    
    const accuracy = totalQuestionsAnswered > 0 
        ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) 
        : 0;
    accuracyEl.textContent = accuracy + '%';
    
    // Calculate stars
    const starCount = accuracy >= 80 ? 3 : accuracy >= 60 ? 2 : accuracy >= 40 ? 1 : 0;
    starRating.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('span');
        star.className = `star ${i < starCount ? 'earned' : 'empty'}`;
        star.textContent = '⭐';
        starRating.appendChild(star);
    }
    
    showScreen('gameOverScreen');
}

// Show Screen
function showScreen(screenId) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    gameOverScreen.classList.remove('active');
    document.getElementById(screenId).classList.add('active');
}

// Event Listeners
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.dataset.category;
        startGame(category);
    });
});

startSoundToggle.addEventListener('click', () => {
    initAudio();
    toggleMusic();
});

gameSoundToggle.addEventListener('click', () => {
    toggleMusic();
});

replayBtn.addEventListener('click', () => {
    playClickSound();
    startGame(currentCategory);
});

menuBtn.addEventListener('click', () => {
    playClickSound();
    usedQuestionIndices.clear();
    showScreen('startScreen');
});

// Initialize audio on first interaction
document.addEventListener('touchstart', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });
