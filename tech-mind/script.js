// Music: "Electrodoodle" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

// Use universal i18n loader
function t(key) {
    return gameI18n.t(key);
}

// Game State
const gameState = {
  currentCategory: null,
  score: 0,
  lives: 3,
  streak: 0,
  availableQuestions: [],
  currentQuestion: null,
  timer: null,
  timeLeft: 15,
  totalQuestions: 0,
  correctAnswers: 0
};

// Audio Engine
let audioContext = null;
let backgroundMusic = null;
let isMuted = false;

// Question Database (30 questions per category = 120 total)
const questions = {
  computerScience: [
    { question: "What does CPU stand for?", answers: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"], correct: 0 },
    { question: "What is RAM used for?", answers: ["Temporary memory storage", "Permanent storage", "Processing data", "Display output"], correct: 0 },
    { question: "What is the binary system based on?", answers: ["2 digits", "10 digits", "8 digits", "16 digits"], correct: 0 },
    { question: "What is an algorithm?", answers: ["Step-by-step procedure", "Computer program", "Data storage", "Hardware component"], correct: 0 },
    { question: "What does HTML stand for?", answers: ["HyperText Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], correct: 0 },
    { question: "What is a compiler?", answers: ["Translates code to machine language", "Executes code", "Stores data", "Displays graphics"], correct: 0 },
    { question: "What is the purpose of an operating system?", answers: ["Manage computer resources", "Create documents", "Browse internet", "Play games"], correct: 0 },
    { question: "What is a firewall?", answers: ["Network security system", "Computer cooling system", "Data storage system", "Display system"], correct: 0 },
    { question: "What does URL stand for?", answers: ["Uniform Resource Locator", "Universal Resource Link", "Uniform Resource Link", "Universal Resource Locator"], correct: 0 },
    { question: "What is a database?", answers: ["Organized collection of data", "Computer program", "Hardware device", "Network protocol"], correct: 0 },
    { question: "What is cloud computing?", answers: ["Internet-based computing", "Local computing", "Hardware computing", "Mobile computing"], correct: 0 },
    { question: "What is a pixel?", answers: ["Smallest unit of digital image", "Computer processor", "Storage unit", "Network device"], correct: 0 },
    { question: "What does HTTP stand for?", answers: ["HyperText Transfer Protocol", "High Tech Transfer Protocol", "HyperText Transmission Protocol", "Home Tool Transfer Protocol"], correct: 0 },
    { question: "What is a server?", answers: ["Computer that provides services", "Computer that receives services", "Storage device", "Display device"], correct: 0 },
    { question: "What is malware?", answers: ["Malicious software", "Security software", "System software", "Application software"], correct: 0 },
    { question: "What is a cookie?", answers: ["Small text file stored by browser", "Computer program", "Hardware component", "Network protocol"], correct: 0 },
    { question: "What is cache memory?", answers: ["Fast temporary memory", "Permanent storage", "Slow memory", "External storage"], correct: 0 },
    { question: "What does VPN stand for?", answers: ["Virtual Private Network", "Very Private Network", "Virtual Public Network", "Virtual Protected Network"], correct: 0 },
    { question: "What is a byte?", answers: ["8 bits", "16 bits", "32 bits", "64 bits"], correct: 0 },
    { question: "What is a GUI?", answers: ["Graphical User Interface", "General User Interface", "Graphical Utility Interface", "General Utility Interface"], correct: 0 },
    { question: "What is a motherboard?", answers: ["Main circuit board", "Storage device", "Display device", "Input device"], correct: 0 },
    { question: "What is a hard drive?", answers: ["Storage device", "Processing device", "Input device", "Output device"], correct: 0 },
    { question: "What is a port?", answers: ["Connection interface", "Storage location", "Program location", "Network address"], correct: 0 },
    { question: "What is a driver?", answers: ["Software that controls hardware", "Hardware component", "Application program", "Network protocol"], correct: 0 },
    { question: "What is a bug?", answers: ["Software error", "Hardware problem", "Network issue", "Security threat"], correct: 0 },
    { question: "What is a patch?", answers: ["Software update", "Hardware upgrade", "Network configuration", "Security setting"], correct: 0 },
    { question: "What is a backup?", answers: ["Copy of data", "Original data", "Deleted data", "Compressed data"], correct: 0 },
    { question: "What is encryption?", answers: ["Encoding data for security", "Deleting data", "Compressing data", "Transferring data"], correct: 0 },
    { question: "What is a protocol?", answers: ["Set of rules for communication", "Hardware device", "Software program", "Network cable"], correct: 0 }
  ],
  artificialIntelligence: [
    { question: "What does AI stand for?", answers: ["Artificial Intelligence", "Automated Intelligence", "Advanced Intelligence", "Applied Intelligence"], correct: 0 },
    { question: "What is machine learning?", answers: ["AI that learns from data", "AI that requires programming", "AI that controls hardware", "AI that displays graphics"], correct: 0 },
    { question: "What is a neural network?", answers: ["AI modeled after human brain", "Computer network", "Database system", "Security system"], correct: 0 },
    { question: "What is deep learning?", answers: ["Multi-layer neural network", "Simple AI", "Basic programming", "Network security"], correct: 0 },
    { question: "What is natural language processing?", answers: ["AI understanding human language", "AI programming languages", "AI network protocols", "AI graphics processing"], correct: 0 },
    { question: "What is a chatbot?", answers: ["AI that converses with humans", "AI that processes data", "AI that controls hardware", "AI that creates graphics"], correct: 0 },
    { question: "What is computer vision?", answers: ["AI that interprets visual data", "AI that processes text", "AI that manages networks", "AI that stores data"], correct: 0 },
    { question: "What is a dataset?", answers: ["Collection of data for AI", "AI program", "Hardware device", "Network protocol"], correct: 0 },
    { question: "What is supervised learning?", answers: ["AI trained with labeled data", "AI trained without labels", "AI that learns from itself", "AI that requires no data"], correct: 0 },
    { question: "What is unsupervised learning?", answers: ["AI trained without labels", "AI trained with labels", "AI that requires human input", "AI that cannot learn"], correct: 0 },
    { question: "What is reinforcement learning?", answers: ["AI learns through rewards", "AI learns from labels", "AI learns from text", "AI learns from images"], correct: 0 },
    { question: "What is a model in AI?", answers: ["Trained algorithm", "Computer program", "Hardware device", "Network system"], correct: 0 },
    { question: "What is training data?", answers: ["Data used to teach AI", "Data used for testing", "Data used for storage", "Data used for display"], correct: 0 },
    { question: "What is a neural network layer?", answers: ["Processing stage in network", "Network cable", "Storage device", "Display screen"], correct: 0 },
    { question: "What is bias in AI?", answers: ["Prejudice in AI decisions", "Random error", "System requirement", "Network protocol"], correct: 0 },
    { question: "What is a generative AI?", answers: ["AI that creates new content", "AI that analyzes data", "AI that controls hardware", "AI that manages networks"], correct: 0 },
    { question: "What is GPT?", answers: ["Generative Pre-trained Transformer", "General Processing Technology", "Global Programming Tool", "Graphical Processing Technology"], correct: 0 },
    { question: "What is a large language model?", answers: ["AI trained on vast text data", "AI for images", "AI for networks", "AI for hardware"], correct: 0 },
    { question: "What is computer vision used for?", answers: ["Image recognition", "Text processing", "Network management", "Data storage"], correct: 0 },
    { question: "What is a robot in AI?", answers: ["Autonomous machine", "Computer program", "Network device", "Storage system"], correct: 0 },
    { question: "What is automation?", answers: ["Automatic task execution", "Manual task execution", "Network configuration", "Data storage"], correct: 0 },
    { question: "What is a neural network weight?", answers: ["Parameter adjusted during training", "Network cable", "Storage capacity", "Processing speed"], correct: 0 },
    { question: "What is overfitting in AI?", answers: ["Model too specific to training data", "Model too general", "Model not trained", "Model has no data"], correct: 0 },
    { question: "What is underfitting in AI?", answers: ["Model too simple for data", "Model too complex", "Model perfectly trained", "Model has no training"], correct: 0 },
    { question: "What is a neural network activation function?", answers: ["Mathematical operation for output", "Network cable", "Storage device", "Display setting"], correct: 0 },
    { question: "What is backpropagation?", answers: ["Training algorithm for neural networks", "Network protocol", "Storage method", "Display technique"], correct: 0 },
    { question: "What is a perceptron?", answers: ["Basic neural network unit", "Network device", "Storage unit", "Display component"], correct: 0 },
    { question: "What is AI ethics?", answers: ["Moral considerations in AI", "AI programming", "AI hardware", "AI networks"], correct: 0 }
  ],
  internetWeb: [
    { question: "What does WWW stand for?", answers: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], correct: 0 },
    { question: "What is a web browser?", answers: ["Software to access internet", "Hardware device", "Network cable", "Storage device"], correct: 0 },
    { question: "What is a search engine?", answers: ["Tool to find web pages", "Computer program", "Network device", "Storage system"], correct: 0 },
    { question: "What is a domain name?", answers: ["Website address", "Computer name", "Network name", "Server name"], correct: 0 },
    { question: "What is HTTPS?", answers: ["Secure HTTP", "High speed HTTP", "Home page HTTP", "Hosted HTTP"], correct: 0 },
    { question: "What is an IP address?", answers: ["Unique device identifier", "Website name", "Computer program", "Network cable"], correct: 0 },
    { question: "What is a router?", answers: ["Directs network traffic", "Stores data", "Displays graphics", "Processes code"], correct: 0 },
    { question: "What is Wi-Fi?", answers: ["Wireless internet", "Wired internet", "Mobile data", "Satellite internet"], correct: 0 },
    { question: "What is a modem?", answers: ["Modulates digital signals", "Stores data", "Displays graphics", "Processes code"], correct: 0 },
    { question: "What is bandwidth?", answers: ["Data transfer rate", "Storage capacity", "Processing speed", "Display resolution"], correct: 0 },
    { question: "What is latency?", answers: ["Network delay", "Storage speed", "Processing time", "Display refresh rate"], correct: 0 },
    { question: "What is a DNS server?", answers: ["Translates domain names to IPs", "Stores websites", "Processes data", "Displays graphics"], correct: 0 },
    { question: "What is a web server?", answers: ["Hosts websites", "Browses websites", "Creates websites", "Designs websites"], correct: 0 },
    { question: "What is an ISP?", answers: ["Internet Service Provider", "Internal System Protocol", "Internet Security Program", "Integrated Service Platform"], correct: 0 },
    { question: "What is a hyperlink?", answers: ["Clickable link to webpage", "Website address", "Computer program", "Network device"], correct: 0 },
    { question: "What is a browser cache?", answers: ["Stored web data", "Browser program", "Network device", "Storage device"], correct: 0 },
    { question: "What is a cookie?", answers: ["Small text file from website", "Browser program", "Network cable", "Storage device"], correct: 0 },
    { question: "What is phishing?", answers: ["Fake website scam", "Network fishing", "Data storage", "Security software"], correct: 0 },
    { question: "What is a VPN?", answers: ["Virtual Private Network", "Very Private Network", "Visual Private Network", "Virtual Public Network"], correct: 0 },
    { question: "What is social media?", answers: ["Online social platforms", "Email service", "Search engine", "Website builder"], correct: 0 },
    { question: "What is streaming?", answers: ["Real-time media playback", "File download", "Data storage", "Network configuration"], correct: 0 },
    { question: "What is a podcast?", answers: ["Audio series", "Video series", "Blog post", "Social media post"], correct: 0 },
    { question: "What is a blog?", answers: ["Online journal", "Social media", "Search engine", "Email service"], correct: 0 },
    { question: "What is e-commerce?", answers: ["Online shopping", "Email commerce", "Electronic communication", "Enterprise computing"], correct: 0 },
    { question: "What is a URL?", answers: ["Web address", "Computer name", "Network name", "Server name"], correct: 0 },
    { question: "What is HTML?", answers: ["Web page structure language", "Programming language", "Database language", "Network protocol"], correct: 0 },
    { question: "What is CSS?", answers: ["Web page styling language", "Programming language", "Database language", "Network protocol"], correct: 0 },
    { question: "What is JavaScript?", answers: ["Web programming language", "Styling language", "Database language", "Network protocol"], correct: 0 },
    { question: "What is a website?", answers: ["Collection of web pages", "Single web page", "Computer program", "Network device"], correct: 0 },
    { question: "What is a web host?", answers: ["Service that hosts websites", "Website designer", "Browser program", "Search engine"], correct: 0 }
  ],
  techGadgets: [
    { question: "What is a smartphone?", answers: ["Mobile phone with computing", "Basic phone", "Landline phone", "Pager"], correct: 0 },
    { question: "What is a tablet?", answers: ["Portable touchscreen computer", "Laptop computer", "Desktop computer", "Smartphone"], correct: 0 },
    { question: "What is a smartwatch?", answers: ["Wearable computer", "Regular watch", "Phone accessory", "Fitness tracker only"], correct: 0 },
    { question: "What is a laptop?", answers: ["Portable computer", "Desktop computer", "Tablet", "Smartphone"], correct: 0 },
    { question: "What is a desktop computer?", answers: ["Non-portable computer", "Portable computer", "Tablet", "Smartphone"], correct: 0 },
    { question: "What is a touchscreen?", answers: ["Input-sensitive display", "Regular display", "Keyboard", "Mouse"], correct: 0 },
    { question: "What is a camera sensor?", answers: ["Image capture component", "Lens", "Display", "Storage"], correct: 0 },
    { question: "What is a processor?", answers: ["Computer brain", "Storage device", "Display device", "Input device"], correct: 0 },
    { question: "What is RAM?", answers: ["Temporary memory", "Permanent storage", "Processor", "Display"], correct: 0 },
    { question: "What is SSD?", answers: ["Solid State Drive", "Standard Storage Device", "Secure System Drive", "System Storage Device"], correct: 0 },
    { question: "What is HDD?", answers: ["Hard Disk Drive", "High Definition Display", "Hybrid Digital Drive", "Hardware Data Device"], correct: 0 },
    { question: "What is a GPU?", answers: ["Graphics Processing Unit", "General Processing Unit", "Global Power Unit", "Graphics Display Unit"], correct: 0 },
    { question: "What is Bluetooth?", answers: ["Wireless technology", "Wired technology", "Storage technology", "Display technology"], correct: 0 },
    { question: "What is NFC?", answers: ["Near Field Communication", "Network File Connection", "Near Frequency Connection", "Network File Communication"], correct: 0 },
    { question: "What is a fingerprint sensor?", answers: ["Biometric scanner", "Camera", "Display", "Processor"], correct: 0 },
    { question: "What is face recognition?", answers: ["Biometric face scanning", "Camera feature", "Display feature", "Processor feature"], correct: 0 },
    { question: "What is a battery?", answers: ["Power storage", "Processor", "Display", "Storage"], correct: 0 },
    { question: "What is wireless charging?", answers: ["Inductive power transfer", "Solar charging", "Kinetic charging", "USB charging"], correct: 0 },
    { question: "What is a USB port?", answers: ["Universal connection interface", "Display port", "Audio port", "Network port"], correct: 0 },
    { question: "What is HDMI?", answers: ["High-Definition Multimedia Interface", "High Digital Media Interface", "Hardware Digital Media Interface", "High Definition Media Input"], correct: 0 },
    { question: "What is a headphone jack?", answers: ["Audio connector", "Video connector", "Data connector", "Power connector"], correct: 0 },
    { question: "What is a microphone?", answers: ["Audio input device", "Audio output device", "Video device", "Display device"], correct: 0 },
    { question: "What is a speaker?", answers: ["Audio output device", "Audio input device", "Video device", "Display device"], correct: 0 },
    { question: "What is a camera?", answers: ["Image capture device", "Display device", "Storage device", "Processor"], correct: 0 },
    { question: "What is a drone?", answers: ["Unmanned aerial vehicle", "Remote control car", "Robot", "Smartphone"], correct: 0 },
    { question: "What is a VR headset?", answers: ["Virtual reality display", "Regular display", "Camera", "Speaker"], correct: 0 },
    { question: "What is AR?", answers: ["Augmented Reality", "Actual Reality", "Automated Reality", "Advanced Reality"], correct: 0 },
    { question: "What is a smart home device?", answers: ["Internet-connected appliance", "Regular appliance", "Computer", "Phone"], correct: 0 },
    { question: "What is a fitness tracker?", answers: ["Activity monitoring device", "Smartphone", "Watch", "Computer"], correct: 0 },
    { question: "What is a game console?", answers: ["Gaming device", "Computer", "Phone", "Tablet"], correct: 0 }
  ]
};

// Initialize Audio Context
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }
}

// Play Click Sound
function playClickSound() {
  if (isMuted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
}

// Play Correct Sound
function playCorrectSound() {
  if (isMuted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

// Play Wrong Sound
function playWrongSound() {
  if (isMuted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Play Game Over Sound
function playGameOverSound() {
  if (isMuted || !audioContext) return;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
  oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.4);
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.6);
}

// Initialize Background Music
function initBackgroundMusic() {
  if (!backgroundMusic) {
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Fox%20Tale%20Waltz%20Part%201%20Instrumental.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('techMind_muted', isMuted);
  
  const startSoundToggle = document.getElementById('startSoundToggle');
  const gameSoundToggle = document.getElementById('gameSoundToggle');
  
  if (startSoundToggle) {
    startSoundToggle.textContent = isMuted ? '🔇' : '🔊';
  }
  if (gameSoundToggle) {
    gameSoundToggle.textContent = isMuted ? '🔇' : '🔊';
  }
  
  if (backgroundMusic) {
    if (isMuted) {
      backgroundMusic.pause();
    } else {
      initAudio();
      backgroundMusic.play().catch(err => console.log('BGM play failed:', err));
    }
  }
}

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize Available Questions
function initializeAvailableQuestions(category) {
  const categoryQuestions = questions[category];
  gameState.availableQuestions = shuffleArray(categoryQuestions);
}

// Get Next Question
function getNextQuestion() {
  if (gameState.availableQuestions.length === 0) {
    initializeAvailableQuestions(gameState.currentCategory);
  }
  return gameState.availableQuestions.pop();
}

// Update Mute Button
function updateMuteButton() {
  const startSoundToggle = document.getElementById('startSoundToggle');
  const gameSoundToggle = document.getElementById('gameSoundToggle');
  
  if (startSoundToggle) {
    startSoundToggle.textContent = isMuted ? '🔇' : '🔊';
  }
  if (gameSoundToggle) {
    gameSoundToggle.textContent = isMuted ? '🔇' : '🔊';
  }
}

// Load High Score
function loadHighScore(category = null) {
  if (category) {
    return parseInt(localStorage.getItem(`techMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('techMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`techMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('techMind_highScore_overall', score);
  }
}

// Update Lives Display
function updateLives() {
  const livesEl = document.getElementById('lives');
  livesEl.textContent = '❤️'.repeat(gameState.lives);
}

// Update Score Display
function updateScore() {
  const scoreEl = document.getElementById('score');
  scoreEl.textContent = gameState.score;
}

// Update Streak Display
function updateStreak() {
  const streakEl = document.getElementById('streak');
  streakEl.textContent = gameState.streak;
}

// Update Timer Bar
function updateTimerBar() {
  const timerBar = document.getElementById('timerBar');
  const percentage = (gameState.timeLeft / 15) * 100;
  timerBar.style.width = percentage + '%';
  
  if (percentage < 30) {
    timerBar.style.background = '#ff0000';
  } else if (percentage < 60) {
    timerBar.style.background = '#00ff41';
  } else {
    timerBar.style.background = '#b200ff';
  }
}

// Start Timer
function startTimer() {
  gameState.timeLeft = 15;
  updateTimerBar();
  
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  gameState.timer = setInterval(() => {
    gameState.timeLeft -= 0.1;
    updateTimerBar();
    
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timer);
      handleTimeout();
    }
  }, 100);
}

// Handle Timeout
function handleTimeout() {
  playWrongSound();
  gameState.lives--;
  gameState.streak = 0;
  updateLives();
  updateStreak();
  
  if (gameState.lives <= 0) {
    endGame();
  } else {
    loadQuestion();
  }
}

// Load Question
function loadQuestion() {
  gameState.currentQuestion = getNextQuestion();
  gameState.totalQuestions++;
  
  const questionText = document.getElementById('questionText');
  const answerOptions = document.getElementById('answerOptions');
  
  questionText.textContent = gameState.currentQuestion.question;
  answerOptions.innerHTML = '';
  
  // Shuffle answers using Fisher-Yates algorithm
  const shuffledAnswers = [...gameState.currentQuestion.answers];
  for (let i = shuffledAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
  }
  
  // Update correct index to match shuffled position
  const originalCorrect = gameState.currentQuestion.correct;
  const correctAnswer = gameState.currentQuestion.answers[originalCorrect];
  gameState.currentQuestion.correct = shuffledAnswers.indexOf(correctAnswer);
  
  shuffledAnswers.forEach((answer, index) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.textContent = answer;
    btn.onclick = () => handleAnswer(index, btn);
    answerOptions.appendChild(btn);
  });
  
  startTimer();
}

// Handle Answer
function handleAnswer(selectedIndex, btn) {
  clearInterval(gameState.timer);
  
  const isCorrect = selectedIndex === gameState.currentQuestion.correct;
  
  if (isCorrect) {
    playCorrectSound();
    btn.classList.add('correct');
    gameState.streak++;
    gameState.correctAnswers++;
    
    // Calculate score with streak multiplier
    const baseScore = 100;
    const timeBonus = Math.floor(gameState.timeLeft * 10);
    const streakMultiplier = Math.min(gameState.streak, 5);
    const totalScore = (baseScore + timeBonus) * streakMultiplier;
    gameState.score += totalScore;
    
    updateScore();
    updateStreak();
    
    setTimeout(() => {
      loadQuestion();
    }, 500);
  } else {
    playWrongSound();
    btn.classList.add('wrong');
    gameState.lives--;
    gameState.streak = 0;
    updateLives();
    updateStreak();
    
    if (gameState.lives <= 0) {
      setTimeout(() => {
        endGame();
      }, 500);
    } else {
      setTimeout(() => {
        loadQuestion();
      }, 500);
    }
  }
}

// End Game
function endGame() {
  playGameOverSound();
  clearInterval(gameState.timer);
  
  const accuracy = gameState.totalQuestions > 0 
    ? Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100) 
    : 0;
  
  // Calculate stars
  let stars = 0;
  if (accuracy >= 90) stars = 3;
  else if (accuracy >= 70) stars = 2;
  else if (accuracy >= 50) stars = 1;
  
  // Update game over screen
  document.getElementById('finalScoreValue').textContent = gameState.score;
  document.getElementById('accuracyValue').textContent = `${accuracy}%`;
  document.getElementById('categoryHighScore').textContent = loadHighScore(gameState.currentCategory);
  
  // Update stars
  document.querySelectorAll('.star').forEach((star, index) => {
    star.classList.remove('active');
    if (index < stars) {
      star.classList.add('active');
    }
  });
  
  // Save high score
  saveHighScore(gameState.score, gameState.currentCategory);
  
  // Show game over screen
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.remove('hidden');
}

// Start Game
function startGame(category) {
  playClickSound();
  gameState.currentCategory = category;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.streak = 0;
  gameState.totalQuestions = 0;
  gameState.correctAnswers = 0;
  
  initializeAvailableQuestions(category);
  
  updateLives();
  updateScore();
  updateStreak();
  
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('gameScreen').classList.remove('hidden');
  
  loadQuestion();
  
  // Start background music if not muted
  if (!isMuted) {
    if (!backgroundMusic) {
      initBackgroundMusic();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    backgroundMusic.play().catch(e => console.log('Autoplay blocked until interaction:', e));
  }
}

// Exit to Start Screen
function exitToStartScreen() {
  playClickSound();
  clearInterval(gameState.timer);
  
  document.getElementById('gameScreen').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  
  // Update overall high score display
  document.getElementById('overallHighScore').textContent = loadHighScore();
}

// Initialize Game
async function init() {
  // Initialize i18n loader
  await gameI18n.init('tech-mind');
  
  // Load mute state
  isMuted = localStorage.getItem('techMind_muted') === 'true';
  updateMuteButton();
  
  // Initialize background music
  initBackgroundMusic();
  
  // Load overall high score
  document.getElementById('overallHighScore').textContent = loadHighScore();
  
  // Category button listeners
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      startGame(category);
    });
  });
  
  // Sound toggle button listeners
  const startSoundToggle = document.getElementById('startSoundToggle');
  if (startSoundToggle) {
    startSoundToggle.addEventListener('click', () => {
      initAudio();
      toggleMusic();
    });
  }
  
  const gameSoundToggle = document.getElementById('gameSoundToggle');
  if (gameSoundToggle) {
    gameSoundToggle.addEventListener('click', () => {
      toggleMusic();
    });
  }
  
  // Game over button listeners
  document.getElementById('replayBtn').addEventListener('click', () => {
    startGame(gameState.currentCategory);
  });
  
  document.getElementById('menuBtn').addEventListener('click', exitToStartScreen);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Global audio unlock listeners for WebView
document.addEventListener('touchstart', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });
