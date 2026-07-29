// Music: "Night in Venice" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

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
  greekRoman: [
    { question: "Who is the king of the Greek gods?", answers: ["Zeus", "Poseidon", "Hades", "Apollo"], correct: 0 },
    { question: "What is the Roman name for Zeus?", answers: ["Jupiter", "Mars", "Neptune", "Pluto"], correct: 0 },
    { question: "Who is the goddess of wisdom?", answers: ["Athena", "Hera", "Aphrodite", "Artemis"], correct: 0 },
    { question: "What is the Roman name for Athena?", answers: ["Minerva", "Juno", "Venus", "Diana"], correct: 0 },
    { question: "Who is the god of the sea?", answers: ["Poseidon", "Zeus", "Hades", "Apollo"], correct: 0 },
    { question: "What is the Roman name for Poseidon?", answers: ["Neptune", "Jupiter", "Mars", "Pluto"], correct: 0 },
    { question: "Who is the god of the underworld?", answers: ["Hades", "Zeus", "Poseidon", "Apollo"], correct: 0 },
    { question: "What is the Roman name for Hades?", answers: ["Pluto", "Jupiter", "Neptune", "Mars"], correct: 0 },
    { question: "Who is the goddess of love?", answers: ["Aphrodite", "Hera", "Athena", "Artemis"], correct: 0 },
    { question: "What is the Roman name for Aphrodite?", answers: ["Venus", "Juno", "Minerva", "Diana"], correct: 0 },
    { question: "Who is the god of war?", answers: ["Ares", "Apollo", "Hermes", "Dionysus"], correct: 0 },
    { question: "What is the Roman name for Ares?", answers: ["Mars", "Mercury", "Apollo", "Bacchus"], correct: 0 },
    { question: "Who is the messenger god?", answers: ["Hermes", "Apollo", "Ares", "Dionysus"], correct: 0 },
    { question: "What is the Roman name for Hermes?", answers: ["Mercury", "Mars", "Apollo", "Bacchus"], correct: 0 },
    { question: "Who is the god of the sun?", answers: ["Apollo", "Helios", "Zeus", "Poseidon"], correct: 0 },
    { question: "Who is the goddess of the hunt?", answers: ["Artemis", "Athena", "Hera", "Aphrodite"], correct: 0 },
    { question: "What is the Roman name for Artemis?", answers: ["Diana", "Minerva", "Juno", "Venus"], correct: 0 },
    { question: "Who is the queen of the gods?", answers: ["Hera", "Athena", "Aphrodite", "Artemis"], correct: 0 },
    { question: "What is the Roman name for Hera?", answers: ["Juno", "Minerva", "Venus", "Diana"], correct: 0 },
    { question: "Who is the god of wine?", answers: ["Dionysus", "Apollo", "Hermes", "Ares"], correct: 0 },
    { question: "What is the Roman name for Dionysus?", answers: ["Bacchus", "Mercury", "Mars", "Apollo"], correct: 0 },
    { question: "Who is the god of fire?", answers: ["Hephaestus", "Apollo", "Ares", "Hermes"], correct: 0 },
    { question: "What is the Roman name for Hephaestus?", answers: ["Vulcan", "Mars", "Mercury", "Apollo"], correct: 0 },
    { question: "Who is the goddess of agriculture?", answers: ["Demeter", "Hera", "Athena", "Aphrodite"], correct: 0 },
    { question: "What is the Roman name for Demeter?", answers: ["Ceres", "Juno", "Minerva", "Venus"], correct: 0 },
    { question: "Who is the goddess of the home?", answers: ["Hestia", "Hera", "Athena", "Demeter"], correct: 0 },
    { question: "What is the Roman name for Hestia?", answers: ["Vesta", "Juno", "Ceres", "Vesta"], correct: 0 },
    { question: "Who is the hero who defeated Medusa?", answers: ["Perseus", "Theseus", "Hercules", "Achilles"], correct: 0 },
    { question: "Who is the hero with Achilles' heel?", answers: ["Achilles", "Perseus", "Theseus", "Hercules"], correct: 0 },
    { question: "Who is the strongest hero?", answers: ["Hercules", "Perseus", "Theseus", "Achilles"], correct: 0 }
  ],
  norse: [
    { question: "Who is the king of the Norse gods?", answers: ["Odin", "Thor", "Loki", "Freya"], correct: 0 },
    { question: "Who is the god of thunder?", answers: ["Thor", "Odin", "Loki", "Freya"], correct: 0 },
    { question: "What is Thor's hammer called?", answers: ["Mjolnir", "Gungnir", "Stormbreaker", "Balmung"], correct: 0 },
    { question: "Who is the trickster god?", answers: ["Loki", "Odin", "Thor", "Freya"], correct: 0 },
    { question: "Where do the Norse gods live?", answers: ["Asgard", "Midgard", "Valhalla", "Helheim"], correct: 0 },
    { question: "What is the world tree called?", answers: ["Yggdrasil", "World Tree", "Tree of Life", "Oak"], correct: 0 },
    { question: "Who is the goddess of love?", answers: ["Freya", "Frigg", "Sif", "Hel"], correct: 0 },
    { question: "Who is Odin's wife?", answers: ["Frigg", "Freya", "Sif", "Hel"], correct: 0 },
    { question: "What is Valhalla?", answers: ["Hall of fallen warriors", "Home of gods", "Underworld", "Forest"], correct: 0 },
    { question: "Who is the god of wisdom?", answers: ["Odin", "Thor", "Loki", "Tyr"], correct: 0 },
    { question: "What is Odin's spear called?", answers: ["Gungnir", "Mjolnir", "Stormbreaker", "Balmung"], correct: 0 },
    { question: "Who is the god of war?", answers: ["Tyr", "Odin", "Thor", "Loki"], correct: 0 },
    { question: "What is the Norse underworld called?", answers: ["Helheim", "Valhalla", "Asgard", "Midgard"], correct: 0 },
    { question: "Who rules Helheim?", answers: ["Hel", "Odin", "Freya", "Frigg"], correct: 0 },
    { question: "What are the Norse warriors called?", answers: ["Vikings", "Berserkers", "Valkyries", "Einherjar"], correct: 0 },
    { question: "Who are the female warriors?", answers: ["Valkyries", "Vikings", "Berserkers", "Norns"], correct: 0 },
    { question: "What is Ragnarok?", answers: ["End of the world", "Beginning of time", "War of gods", "Great feast"], correct: 0 },
    { question: "Who is the wolf that eats the sun?", answers: ["Fenrir", "Skoll", "Hati", "Jormungandr"], correct: 1 },
    { question: "What is the world serpent called?", answers: ["Jormungandr", "Fenrir", "Nidhogg", "Sleipnir"], correct: 0 },
    { question: "Who is Odin's eight-legged horse?", answers: ["Sleipnir", "Fenrir", "Jormungandr", "Gullinbursti"], correct: 0 },
    { question: "What is the rainbow bridge called?", answers: ["Bifrost", "Asgard", "Midgard", "Yggdrasil"], correct: 0 },
    { question: "Who is the god of light?", answers: ["Balder", "Odin", "Thor", "Loki"], correct: 0 },
    { question: "Who killed Balder?", answers: ["Loki", "Thor", "Odin", "Tyr"], correct: 0 },
    { question: "What is the Norse heaven called?", answers: ["Asgard", "Valhalla", "Midgard", "Helheim"], correct: 0 },
    { question: "Who are the fate goddesses?", answers: ["Norns", "Valkyries", "Disir", "Fylgja"], correct: 0 },
    { question: "What is Thor's chariot pulled by?", answers: ["Goats", "Horses", "Wolves", "Boars"], correct: 0 },
    { question: "Who is the frost giant king?", answers: ["Ymir", "Thrym", "Surtr", "Fafnir"], correct: 0 },
    { question: "What is the Norse hell called?", answers: ["Niflheim", "Helheim", "Muspelheim", "Svartalfheim"], correct: 0 }
  ],
  egyptian: [
    { question: "Who is the sun god?", answers: ["Ra", "Osiris", "Anubis", "Horus"], correct: 0 },
    { question: "Who is the god of the underworld?", answers: ["Osiris", "Ra", "Anubis", "Horus"], correct: 0 },
    { question: "Who is the god of mummification?", answers: ["Anubis", "Osiris", "Ra", "Horus"], correct: 0 },
    { question: "Who is the sky god?", answers: ["Horus", "Ra", "Osiris", "Anubis"], correct: 0 },
    { question: "Who is the goddess of magic?", answers: ["Isis", "Hathor", "Bastet", "Sekhmet"], correct: 0 },
    { question: "Who is the goddess of love?", answers: ["Hathor", "Isis", "Bastet", "Sekhmet"], correct: 0 },
    { question: "Who is the cat goddess?", answers: ["Bastet", "Isis", "Hathor", "Sekhmet"], correct: 0 },
    { question: "Who is the lion goddess?", answers: ["Sekhmet", "Bastet", "Isis", "Hathor"], correct: 0 },
    { question: "Who is the god of the Nile?", answers: ["Hapi", "Ra", "Osiris", "Anubis"], correct: 0 },
    { question: "What is the Egyptian book of the dead called?", answers: ["Book of the Dead", "Book of Life", "Book of Gates", "Book of Caverns"], correct: 0 },
    { question: "Who is the pharaoh's protector?", answers: ["Horus", "Ra", "Osiris", "Anubis"], correct: 0 },
    { question: "What is the Egyptian writing called?", answers: ["Hieroglyphics", "Cuneiform", "Hieratic", "Demotic"], correct: 0 },
    { question: "Who is the god of chaos?", answers: ["Set", "Osiris", "Ra", "Horus"], correct: 0 },
    { question: "Who killed Osiris?", answers: ["Set", "Horus", "Ra", "Anubis"], correct: 0 },
    { question: "What is the Egyptian soul called?", answers: ["Ka", "Ba", "Akh", "Shadow"], correct: 0 },
    { question: "What is the Egyptian heart called?", answers: ["Ib", "Ka", "Ba", "Akh"], correct: 0 },
    { question: "Who is the goddess of truth?", answers: ["Ma'at", "Isis", "Hathor", "Bastet"], correct: 0 },
    { question: "What is the feather of truth called?", answers: ["Feather of Ma'at", "Feather of Isis", "Feather of Ra", "Feather of Horus"], correct: 0 },
    { question: "Who is the god of wisdom?", answers: ["Thoth", "Ra", "Osiris", "Anubis"], correct: 0 },
    { question: "What animal represents Thoth?", answers: ["Ibis", "Falcon", "Jackal", "Cat"], correct: 0 },
    { question: "Who is the god of the desert?", answers: ["Set", "Ra", "Osiris", "Anubis"], correct: 0 },
    { question: "What is the Egyptian pyramid built for?", answers: ["Pharaoh's tomb", "Temple", "Palace", "Fortress"], correct: 0 },
    { question: "Who is the mother of Horus?", answers: ["Isis", "Hathor", "Bastet", "Sekhmet"], correct: 0 },
    { question: "What is the Egyptian crown called?", answers: ["Pschent", "Nemes", "Uraeus", "Atef"], correct: 0 },
    { question: "Who is the god of the sun disk?", answers: ["Aten", "Ra", "Osiris", "Horus"], correct: 0 },
    { question: "What is the Egyptian afterlife called?", answers: ["Field of Reeds", "Heaven", "Paradise", "Elysium"], correct: 0 },
    { question: "Who is the goddess of the west?", answers: ["Hathor", "Isis", "Bastet", "Sekhmet"], correct: 0 },
    { question: "What is the Egyptian boat of the sun called?", answers: ["Solar Barque", "Sun Boat", "Ra's Boat", "Day Boat"], correct: 0 }
  ],
  worldFolklore: [
    { question: "What is King Arthur's sword called?", answers: ["Excalibur", "Caliburn", "Durandal", "Joyeuse"], correct: 0 },
    { question: "Who is Merlin?", answers: ["Wizard", "Knight", "King", "Warrior"], correct: 0 },
    { question: "What is the Holy Grail?", answers: ["Sacred cup", "Sword", "Crown", "Shield"], correct: 0 },
    { question: "Who is Robin Hood's enemy?", answers: ["Sheriff of Nottingham", "King John", "Prince John", "Guy of Gisborne"], correct: 0 },
    { question: "Where do elves live?", answers: ["Forests", "Mountains", "Oceans", "Deserts"], correct: 0 },
    { question: "What is a leprechaun's treasure?", answers: ["Pot of gold", "Silver", "Diamonds", "Rubies"], correct: 0 },
    { question: "Where do leprechauns live?", answers: ["Ireland", "Scotland", "England", "Wales"], correct: 0 },
    { question: "What is a dragon's weakness?", answers: ["Stomach", "Head", "Heart", "Tail"], correct: 0 },
    { question: "What is a phoenix's power?", answers: ["Rebirth", "Flight", "Fire", "Immortality"], correct: 0 },
    { question: "What kills a vampire?", answers: ["Sunlight", "Moonlight", "Starlight", "Candlelight"], correct: 0 },
    { question: "What is a werewolf's weakness?", answers: ["Silver", "Gold", "Iron", "Bronze"], correct: 0 },
    { question: "What is a mermaid's tail?", answers: ["Fish", "Dolphin", "Shark", "Whale"], correct: 0 },
    { question: "What is a unicorn's horn called?", answers: ["Alicorn", "Horn", "Spiral", "Tusk"], correct: 0 },
    { question: "What is a griffin?", answers: ["Lion-eagle hybrid", "Dragon-horse hybrid", "Wolf-bird hybrid", "Snake-lion hybrid"], correct: 0 },
    { question: "What is a cyclops?", answers: ["One-eyed giant", "Three-eyed giant", "Two-eyed giant", "Four-eyed giant"], correct: 0 },
    { question: "What is Medusa's power?", answers: ["Turn to stone", "Poison", "Fire", "Ice"], correct: 0 },
    { question: "What is a banshee?", answers: ["Death messenger", "Warrior", "Healer", "Protector"], correct: 0 },
    { question: "Where do banshees live?", answers: ["Ireland", "Scotland", "England", "Wales"], correct: 0 },
    { question: "What is a selkie?", answers: ["Seal-human", "Fish-human", "Dolphin-human", "Whale-human"], correct: 0 },
    { question: "What is a kappa?", answers: ["Water spirit", "Fire spirit", "Earth spirit", "Air spirit"], correct: 0 },
    { question: "Where do kappas live?", answers: ["Japan", "China", "Korea", "Vietnam"], correct: 0 },
    { question: "What is a yeti?", answers: ["Snow creature", "Mountain creature", "Forest creature", "Desert creature"], correct: 0 },
    { question: "Where do yetis live?", answers: ["Himalayas", "Alps", "Andes", "Rockies"], correct: 0 },
    { question: "What is a djinn?", answers: ["Genie", "Demon", "Angel", "Spirit"], correct: 0 },
    { question: "Where do djinns live?", answers: ["Lamps", "Bottles", "Caves", "Deserts"], correct: 0 },
    { question: "What is a chimera?", answers: ["Multi-headed monster", "Fire-breathing lion", "Flying snake", "Hybrid beast"], correct: 3 },
    { question: "What is a hydra?", answers: ["Multi-headed serpent", "Fire-breathing dragon", "Water monster", "Flying beast"], correct: 0 },
    { question: "What kills a hydra?", answers: ["Fire", "Water", "Ice", "Earth"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Night%20in%20Venice.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('mythosMind_muted', isMuted);
  
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
    return parseInt(localStorage.getItem(`mythosMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('mythosMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`mythosMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('mythosMind_highScore_overall', score);
  }
}

// Update Lives Display
function updateLives() {
  const livesEl = document.getElementById('lives');
  livesEl.textContent = '❤️'.repeat(gameState.lives);
}

// Update Score Display
function updateScore() {
  const scoreEl = document.getElementById('currentScore');
  scoreEl.textContent = gameState.score;
}

// Update Streak Display
function updateStreak() {
  const streakEl = document.getElementById('streak');
  streakEl.textContent = `🔥 ${gameState.streak}x`;
}

// Update Timer Display
function updateTimerDisplay() {
  const timerEl = document.getElementById('timer');
  timerEl.textContent = Math.ceil(gameState.timeLeft);
  
  if (gameState.timeLeft <= 5) {
    timerEl.parentElement.classList.add('warning');
  } else {
    timerEl.parentElement.classList.remove('warning');
  }
}

// Start Timer
function startTimer() {
  gameState.timeLeft = 15;
  updateTimerDisplay();
  
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  gameState.timer = setInterval(() => {
    gameState.timeLeft -= 0.1;
    updateTimerDisplay();
    
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
  document.getElementById('finalScore').textContent = gameState.score;
  document.getElementById('accuracy').textContent = `${accuracy}%`;
  document.getElementById('categoryHighScore').textContent = loadHighScore(gameState.currentCategory);
  
  // Update stars
  document.querySelectorAll('.star-rating span').forEach((star, index) => {
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
  await gameI18n.init('mythos-mind');
  
  // Load mute state
  isMuted = localStorage.getItem('mythosMind_muted') === 'true';
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
  
  // Exit button listener
  document.getElementById('exitBtn').addEventListener('click', exitToStartScreen);
  
  // Game over button listeners
  document.getElementById('replayBtn').addEventListener('click', () => {
    startGame(gameState.currentCategory);
  });
  
  document.getElementById('mainMenuBtn').addEventListener('click', exitToStartScreen);
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Global audio unlock listeners for WebView
document.addEventListener('touchstart', initAudio, { once: true });
document.addEventListener('click', initAudio, { once: true });
