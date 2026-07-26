// Music: "Starting Out Waltz Allegretto" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

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
  correctAnswers: 0,
  language: 'en'
};

// Audio Engine
let audioContext = null;
let backgroundMusic = null;
let isMuted = false;

// Question Database (30 questions per category = 120 total)
const questions = {
  worldCapitals: [
    { question: "What is the capital of France?", answers: ["Paris", "London", "Berlin", "Madrid"], correct: 0 },
    { question: "What is the capital of Japan?", answers: ["Tokyo", "Seoul", "Beijing", "Bangkok"], correct: 0 },
    { question: "What is the capital of Australia?", answers: ["Canberra", "Sydney", "Melbourne", "Perth"], correct: 0 },
    { question: "What is the capital of Brazil?", answers: ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"], correct: 0 },
    { question: "What is the capital of Canada?", answers: ["Ottawa", "Toronto", "Vancouver", "Montreal"], correct: 0 },
    { question: "What is the capital of India?", answers: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 0 },
    { question: "What is the capital of Germany?", answers: ["Berlin", "Munich", "Hamburg", "Frankfurt"], correct: 0 },
    { question: "What is the capital of Italy?", answers: ["Rome", "Milan", "Venice", "Florence"], correct: 0 },
    { question: "What is the capital of Spain?", answers: ["Madrid", "Barcelona", "Valencia", "Seville"], correct: 0 },
    { question: "What is the capital of Russia?", answers: ["Moscow", "Saint Petersburg", "Novosibirsk", "Kazan"], correct: 0 },
    { question: "What is the capital of China?", answers: ["Beijing", "Shanghai", "Hong Kong", "Guangzhou"], correct: 0 },
    { question: "What is the capital of Mexico?", answers: ["Mexico City", "Guadalajara", "Monterrey", "Cancún"], correct: 0 },
    { question: "What is the capital of South Korea?", answers: ["Seoul", "Busan", "Incheon", "Daegu"], correct: 0 },
    { question: "What is the capital of Egypt?", answers: ["Cairo", "Alexandria", "Luxor", "Giza"], correct: 0 },
    { question: "What is the capital of Argentina?", answers: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"], correct: 0 },
    { question: "What is the capital of South Africa?", answers: ["Pretoria", "Cape Town", "Johannesburg", "Durban"], correct: 0 },
    { question: "What is the capital of Turkey?", answers: ["Ankara", "Istanbul", "Izmir", "Antalya"], correct: 0 },
    { question: "What is the capital of Thailand?", answers: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya"], correct: 0 },
    { question: "What is the capital of Greece?", answers: ["Athens", "Thessaloniki", "Patras", "Heraklion"], correct: 0 },
    { question: "What is the capital of Sweden?", answers: ["Stockholm", "Gothenburg", "Malmö", "Uppsala"], correct: 0 },
    { question: "What is the capital of Norway?", answers: ["Oslo", "Bergen", "Trondheim", "Stavanger"], correct: 0 },
    { question: "What is the capital of Poland?", answers: ["Warsaw", "Kraków", "Łódź", "Wrocław"], correct: 0 },
    { question: "What is the capital of Netherlands?", answers: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht"], correct: 0 },
    { question: "What is the capital of Belgium?", answers: ["Brussels", "Antwerp", "Ghent", "Liège"], correct: 0 },
    { question: "What is the capital of Switzerland?", answers: ["Bern", "Zurich", "Geneva", "Basel"], correct: 0 },
    { question: "What is the capital of Austria?", answers: ["Vienna", "Salzburg", "Graz", "Innsbruck"], correct: 0 },
    { question: "What is the capital of Czech Republic?", answers: ["Prague", "Brno", "Ostrava", "Plzeň"], correct: 0 },
    { question: "What is the capital of Hungary?", answers: ["Budapest", "Debrecen", "Szeged", "Pécs"], correct: 0 },
    { question: "What is the capital of Portugal?", answers: ["Lisbon", "Porto", "Faro", "Coimbra"], correct: 0 },
    { question: "What is the capital of Finland?", answers: ["Helsinki", "Espoo", "Tampere", "Vantaa"], correct: 0 }
  ],
  geographyMaps: [
    { question: "Which is the largest ocean?", answers: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], correct: 0 },
    { question: "Which is the longest river in the world?", answers: ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"], correct: 0 },
    { question: "Which is the largest continent?", answers: ["Asia", "Africa", "North America", "Europe"], correct: 0 },
    { question: "Which is the smallest continent?", answers: ["Australia", "Europe", "Antarctica", "South America"], correct: 0 },
    { question: "Which is the largest desert?", answers: ["Antarctic Desert", "Sahara Desert", "Arabian Desert", "Gobi Desert"], correct: 0 },
    { question: "Which is the highest mountain?", answers: ["Mount Everest", "K2", "Kangchenjunga", "Lhotse"], correct: 0 },
    { question: "Which country has the most islands?", answers: ["Sweden", "Norway", "Finland", "Indonesia"], correct: 0 },
    { question: "Which is the largest country by area?", answers: ["Russia", "Canada", "China", "United States"], correct: 0 },
    { question: "Which is the most populous country?", answers: ["India", "China", "United States", "Indonesia"], correct: 0 },
    { question: "Which is the deepest ocean trench?", answers: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Philippine Trench"], correct: 0 },
    { question: "Which river flows through the Grand Canyon?", answers: ["Colorado River", "Mississippi River", "Columbia River", "Snake River"], correct: 0 },
    { question: "Which sea is the largest inland sea?", answers: ["Caspian Sea", "Black Sea", "Red Sea", "Mediterranean Sea"], correct: 0 },
    { question: "Which is the largest lake by volume?", answers: ["Lake Baikal", "Lake Superior", "Lake Victoria", "Lake Tanganyika"], correct: 0 },
    { question: "Which is the longest mountain range?", answers: ["Andes", "Rocky Mountains", "Himalayas", "Alps"], correct: 0 },
    { question: "Which country has the most time zones?", answers: ["France", "Russia", "United States", "China"], correct: 0 },
    { question: "Which is the hottest place on Earth?", answers: ["Death Valley", "Dallol", "Dasht-e Lut", "El Azizia"], correct: 0 },
    { question: "Which is the coldest place on Earth?", answers: ["Vostok Station", "Oymyakon", "Verkhoyansk", "Snag"], correct: 0 },
    { question: "Which is the wettest place on Earth?", answers: ["Mawsynram", "Cherrapunji", "Lloró", "Quibdó"], correct: 0 },
    { question: "Which is the driest place on Earth?", answers: ["Atacama Desert", "McMurdo Dry Valleys", "Sahara Desert", "Gobi Desert"], correct: 0 },
    { question: "Which country has the most coastline?", answers: ["Canada", "Indonesia", "Norway", "Russia"], correct: 0 },
    { question: "Which is the largest island?", answers: ["Greenland", "New Guinea", "Borneo", "Madagascar"], correct: 0 },
    { question: "Which is the largest peninsula?", answers: ["Arabian Peninsula", "Indian Peninsula", "Indochina Peninsula", "Iberian Peninsula"], correct: 0 },
    { question: "Which is the largest bay?", answers: ["Bay of Bengal", "Hudson Bay", "Gulf of Mexico", "Great Australian Bight"], correct: 0 },
    { question: "Which is the longest fjord?", answers: ["Sognefjord", "Scoresby Sund", "Hardangerfjord", "Kangerlussuaq"], correct: 0 },
    { question: "Which is the largest coral reef?", answers: ["Great Barrier Reef", "Belize Barrier Reef", "Red Sea Coral Reef", "New Caledonia Barrier Reef"], correct: 0 },
    { question: "Which is the largest delta?", answers: ["Ganges-Brahmaputra Delta", "Mekong Delta", "Mississippi Delta", "Nile Delta"], correct: 0 },
    { question: "Which is the largest waterfall by volume?", answers: ["Inga Falls", "Niagara Falls", "Victoria Falls", "Angel Falls"], correct: 0 },
    { question: "Which is the highest waterfall?", answers: ["Angel Falls", "Tugela Falls", "Tres Hermanas Falls", "Olo'upena Falls"], correct: 0 },
    { question: "Which is the largest canyon?", answers: ["Grand Canyon", "Yarlung Tsangpo Canyon", "Kali Gandaki Canyon", "Cotahuasi Canyon"], correct: 0 },
    { question: "Which is the largest geyser field?", answers: ["Yellowstone", "Valley of Geysers", "El Tatio", "Taupo Volcanic Zone"], correct: 0 }
  ],
  naturalWonders: [
    { question: "Where is the Great Barrier Reef located?", answers: ["Australia", "Belize", "Philippines", "Indonesia"], correct: 0 },
    { question: "Where is Mount Everest located?", answers: ["Nepal/China border", "India", "Pakistan", "Bhutan"], correct: 0 },
    { question: "Where is the Grand Canyon located?", answers: ["USA", "Canada", "Mexico", "Brazil"], correct: 0 },
    { question: "Where is Victoria Falls located?", answers: ["Zambia/Zimbabwe border", "South Africa", "Kenya", "Tanzania"], correct: 0 },
    { question: "Where is the Northern Lights visible?", answers: ["Arctic regions", "Antarctica", "Equator", "Tropics"], correct: 0 },
    { question: "Where is the Amazon Rainforest located?", answers: ["South America", "Africa", "Asia", "Australia"], correct: 0 },
    { question: "Where is the Sahara Desert located?", answers: ["North Africa", "Middle East", "Central Asia", "Australia"], correct: 0 },
    { question: "Where is the Great Wall of China located?", answers: ["China", "Japan", "Korea", "Mongolia"], correct: 0 },
    { question: "Where is the Matterhorn located?", answers: ["Switzerland/Italy border", "France", "Austria", "Germany"], correct: 0 },
    { question: "Where is Mount Fuji located?", answers: ["Japan", "China", "South Korea", "Taiwan"], correct: 0 },
    { question: "Where is the Serengeti located?", answers: ["Tanzania", "Kenya", "South Africa", "Botswana"], correct: 0 },
    { question: "Where is the Galápagos Islands located?", answers: ["Ecuador", "Peru", "Chile", "Colombia"], correct: 0 },
    { question: "Where is the Dead Sea located?", answers: ["Jordan/Israel border", "Egypt", "Saudi Arabia", "Iraq"], correct: 0 },
    { question: "Where is the Yellowstone National Park located?", answers: ["USA", "Canada", "Mexico", "Russia"], correct: 0 },
    { question: "Where is the Great Rift Valley located?", answers: ["East Africa", "West Africa", "Central Africa", "North Africa"], correct: 0 },
    { question: "Where is the Pamukkale located?", answers: ["Turkey", "Greece", "Italy", "Spain"], correct: 0 },
    { question: "Where is the Giant's Causeway located?", answers: ["Northern Ireland", "Scotland", "Ireland", "England"], correct: 0 },
    { question: "Where is the Uluru located?", answers: ["Australia", "New Zealand", "South Africa", "Canada"], correct: 0 },
    { question: "Where is the Iguazu Falls located?", answers: ["Argentina/Brazil border", "USA/Canada border", "Zambia/Zimbabwe border", "Norway/Sweden border"], correct: 0 },
    { question: "Where is the Ha Long Bay located?", answers: ["Vietnam", "Thailand", "China", "Philippines"], correct: 0 },
    { question: "Where is the Mount Kilimanjaro located?", answers: ["Tanzania", "Kenya", "Uganda", "Ethiopia"], correct: 0 },
    { question: "Where is the Table Mountain located?", answers: ["South Africa", "Australia", "USA", "Canada"], correct: 0 },
    { question: "Where is the Jeju Island located?", answers: ["South Korea", "Japan", "China", "Taiwan"], correct: 0 },
    { question: "Where is the Plitvice Lakes located?", answers: ["Croatia", "Slovenia", "Montenegro", "Bosnia"], correct: 0 },
    { question: "Where is the Salar de Uyuni located?", answers: ["Bolivia", "Chile", "Peru", "Argentina"], correct: 0 },
    { question: "Where is the Tsingy de Bemaraha located?", answers: ["Madagascar", "South Africa", "Kenya", "Tanzania"], correct: 0 },
    { question: "Where is the Zhangjiajie located?", answers: ["China", "Vietnam", "Thailand", "Myanmar"], correct: 0 },
    { question: "Where is the Antelope Canyon located?", answers: ["USA", "Canada", "Mexico", "Australia"], correct: 0 },
    { question: "Where is the Cenotes located?", answers: ["Mexico", "Belize", "Guatemala", "Honduras"], correct: 0 },
    { question: "Where is the Waitomo Caves located?", answers: ["New Zealand", "Australia", "Fiji", "Tonga"], correct: 0 }
  ],
  globalLandmarks: [
    { question: "Where is the Eiffel Tower located?", answers: ["Paris", "London", "Berlin", "Rome"], correct: 0 },
    { question: "Where is the Statue of Liberty located?", answers: ["New York", "Los Angeles", "Chicago", "Washington D.C."], correct: 0 },
    { question: "Where is the Colosseum located?", answers: ["Rome", "Athens", "Istanbul", "Cairo"], correct: 0 },
    { question: "Where is the Taj Mahal located?", answers: ["India", "Pakistan", "Bangladesh", "Nepal"], correct: 0 },
    { question: "Where is the Machu Picchu located?", answers: ["Peru", "Bolivia", "Ecuador", "Colombia"], correct: 0 },
    { question: "Where is the Petra located?", answers: ["Jordan", "Egypt", "Israel", "Saudi Arabia"], correct: 0 },
    { question: "Where is the Christ the Redeemer located?", answers: ["Rio de Janeiro", "São Paulo", "Buenos Aires", "Lima"], correct: 0 },
    { question: "Where is the Sydney Opera House located?", answers: ["Sydney", "Melbourne", "Brisbane", "Perth"], correct: 0 },
    { question: "Where is the Big Ben located?", answers: ["London", "Edinburgh", "Manchester", "Liverpool"], correct: 0 },
    { question: "Where is the Leaning Tower of Pisa located?", answers: ["Pisa", "Rome", "Florence", "Venice"], correct: 0 },
    { question: "Where is the Alhambra located?", answers: ["Granada", "Seville", "Madrid", "Barcelona"], correct: 0 },
    { question: "Where is the Angkor Wat located?", answers: ["Cambodia", "Thailand", "Vietnam", "Laos"], correct: 0 },
    { question: "Where is the Acropolis located?", answers: ["Athens", "Rome", "Istanbul", "Sparta"], correct: 0 },
    { question: "Where is the Sagrada Familia located?", answers: ["Barcelona", "Madrid", "Seville", "Valencia"], correct: 0 },
    { question: "Where is the Kremlin located?", answers: ["Moscow", "Saint Petersburg", "Kiev", "Warsaw"], correct: 0 },
    { question: "Where is the Burj Khalifa located?", answers: ["Dubai", "Abu Dhabi", "Doha", "Riyadh"], correct: 0 },
    { question: "Where is the Louvre located?", answers: ["Paris", "London", "Rome", "Berlin"], correct: 0 },
    { question: "Where is the Vatican City located?", answers: ["Rome", "Florence", "Venice", "Milan"], correct: 0 },
    { question: "Where is the Stonehenge located?", answers: ["England", "Scotland", "Ireland", "Wales"], correct: 0 },
    { question: "Where is the Mount Rushmore located?", answers: ["South Dakota", "North Dakota", "Montana", "Wyoming"], correct: 0 },
    { question: "Where is the Golden Gate Bridge located?", answers: ["San Francisco", "Los Angeles", "Seattle", "Portland"], correct: 0 },
    { question: "Where is the Brandenburg Gate located?", answers: ["Berlin", "Munich", "Hamburg", "Frankfurt"], correct: 0 },
    { question: "Where is the Parthenon located?", answers: ["Athens", "Rome", "Sparta", "Corinth"], correct: 0 },
    { question: "Where is the Tower of London located?", answers: ["London", "Edinburgh", "York", "Oxford"], correct: 0 },
    { question: "Where is the Hagia Sophia located?", answers: ["Istanbul", "Rome", "Athens", "Cairo"], correct: 0 },
    { question: "Where is the Lotus Temple located?", answers: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], correct: 0 },
    { question: "Where is the Sydney Harbour Bridge located?", answers: ["Sydney", "Melbourne", "Brisbane", "Perth"], correct: 0 },
    { question: "Where is the CN Tower located?", answers: ["Toronto", "Vancouver", "Montreal", "Calgary"], correct: 0 },
    { question: "Where is the Space Needle located?", answers: ["Seattle", "Portland", "San Francisco", "Los Angeles"], correct: 0 },
    { question: "Where is the Atomium located?", answers: ["Brussels", "Paris", "Amsterdam", "Berlin"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Starting%20Out%20Waltz%20Allegretto.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('geoMind_muted', isMuted);
  
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
    return parseInt(localStorage.getItem(`geoMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('geoMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`geoMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('geoMind_highScore_overall', score);
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
    timerBar.style.background = '#ff8c00';
  } else {
    timerBar.style.background = '#0077be';
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
  
  gameState.currentQuestion.answers.forEach((answer, index) => {
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
function init() {
  // Load mute state
  isMuted = localStorage.getItem('geoMind_muted') === 'true';
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
