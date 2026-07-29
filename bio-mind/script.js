// Music: "Devonshire Waltz Moderato" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

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
  timeLeft: 10,
  totalQuestions: 0,
  correctAnswers: 0
};

// Audio Engine
let audioContext = null;
let backgroundMusic = null;
let isMuted = false;

// Question Database (30 questions per category = 120 total)
const questions = {
  wildKingdom: [
    { question: "What is the fastest land animal?", answers: ["Cheetah", "Lion", "Gazelle", "Horse"], correct: 0 },
    { question: "Which animal has the longest lifespan?", answers: ["Tortoise", "Elephant", "Whale", "Parrot"], correct: 0 },
    { question: "What is a group of lions called?", answers: ["Pride", "Pack", "Herd", "Flock"], correct: 0 },
    { question: "Which bird can fly backwards?", answers: ["Hummingbird", "Eagle", "Sparrow", "Owl"], correct: 0 },
    { question: "What is the largest mammal?", answers: ["Blue Whale", "Elephant", "Giraffe", "Hippo"], correct: 0 },
    { question: "Which animal has the strongest bite?", answers: ["Saltwater Crocodile", "Lion", "Shark", "Hippo"], correct: 0 },
    { question: "What is a baby deer called?", answers: ["Fawn", "Cub", "Calf", "Kit"], correct: 0 },
    { question: "Which animal sleeps standing up?", answers: ["Horse", "Dog", "Cat", "Cow"], correct: 0 },
    { question: "What is the only mammal that can fly?", answers: ["Bat", "Squirrel", "Lemur", "Flying Fox"], correct: 0 },
    { question: "Which animal has the best sense of smell?", answers: ["Bloodhound", "Bear", "Shark", "Elephant"], correct: 0 },
    { question: "What is a group of wolves called?", answers: ["Pack", "Pride", "Herd", "Flock"], correct: 0 },
    { question: "Which animal can change its color?", answers: ["Chameleon", "Octopus", "Lizard", "Frog"], correct: 0 },
    { question: "What is the largest cat species?", answers: ["Tiger", "Lion", "Leopard", "Jaguar"], correct: 0 },
    { question: "Which animal has the longest tongue?", answers: ["Chameleon", "Giraffe", "Anteater", "Frog"], correct: 1 },
    { question: "What is a baby kangaroo called?", answers: ["Joey", "Cub", "Calf", "Pup"], correct: 0 },
    { question: "Which animal can regrow its tail?", answers: ["Lizard", "Snake", "Turtle", "Crocodile"], correct: 0 },
    { question: "What is the smallest mammal?", answers: ["Bumblebee Bat", "Mouse", "Shrew", "Hamster"], correct: 0 },
    { question: "Which animal has the largest eyes?", answers: ["Giant Squid", "Ostrich", "Elephant", "Tiger"], correct: 0 },
    { question: "What is a group of elephants called?", answers: ["Herd", "Pack", "Pride", "Flock"], correct: 0 },
    { question: "Which animal can hold its breath the longest?", answers: ["Cuvier's Beaked Whale", "Dolphin", "Seal", "Penguin"], correct: 0 },
    { question: "What is the fastest bird?", answers: ["Peregrine Falcon", "Eagle", "Hawk", "Ostrich"], correct: 0 },
    { question: "Which animal has the thickest skin?", answers: ["Sperm Whale", "Elephant", "Hippo", "Rhino"], correct: 0 },
    { question: "What is a baby sheep called?", answers: ["Lamb", "Calf", "Kid", "Fawn"], correct: 0 },
    { question: "Which animal can see in the dark best?", answers: ["Owl", "Cat", "Dog", "Bat"], correct: 0 },
    { question: "What is the largest reptile?", answers: ["Saltwater Crocodile", "Komodo Dragon", "Anaconda", "Alligator"], correct: 0 },
    { question: "Which animal has the most teeth?", answers: ["Giant Armadillo", "Shark", "Dolphin", "Crocodile"], correct: 0 },
    { question: "What is a group of fish called?", answers: ["School", "Pack", "Herd", "Flock"], correct: 0 },
    { question: "Which animal can run on water?", answers: ["Basilisk Lizard", "Cheetah", "Ostrich", "Kangaroo"], correct: 0 },
    { question: "What is the loudest animal?", answers: ["Sperm Whale", "Elephant", "Lion", "Howler Monkey"], correct: 0 },
    { question: "Which animal has the longest migration?", answers: ["Arctic Tern", "Monarch Butterfly", "Humpback Whale", "Caribou"], correct: 0 }
  ],
  dnaGenetics: [
    { question: "What does DNA stand for?", answers: ["Deoxyribonucleic Acid", "Dinucleic Acid", "Deoxyribose Acid", "Double Nucleic Acid"], correct: 0 },
    { question: "How many chromosomes do humans have?", answers: ["46", "23", "44", "48"], correct: 0 },
    { question: "What is the basic unit of heredity?", answers: ["Gene", "Chromosome", "DNA", "Cell"], correct: 0 },
    { question: "Who discovered the structure of DNA?", answers: ["Watson and Crick", "Mendel", "Darwin", "Franklin"], correct: 0 },
    { question: "What shape is DNA?", answers: ["Double Helix", "Triple Helix", "Single Strand", "Spiral"], correct: 0 },
    { question: "What are the four bases of DNA?", answers: ["A, T, C, G", "A, U, C, G", "A, T, U, G", "A, T, C, U"], correct: 0 },
    { question: "What is a mutation?", answers: ["Change in DNA sequence", "Cell division", "Protein synthesis", "Gene expression"], correct: 0 },
    { question: "What is RNA?", answers: ["Ribonucleic Acid", "Ribosomal Acid", "Ribonucleic Atom", "Ribosomal Atom"], correct: 0 },
    { question: "What base pairs with Adenine in DNA?", answers: ["Thymine", "Cytosine", "Guanine", "Uracil"], correct: 0 },
    { question: "What is a genome?", answers: ["Complete set of genes", "Single gene", "Chromosome", "DNA strand"], correct: 0 },
    { question: "What is cloning?", answers: ["Creating genetic copy", "Gene modification", "DNA sequencing", "Cell division"], correct: 0 },
    { question: "What is CRISPR?", answers: ["Gene editing tool", "DNA sequencing method", "Protein synthesis", "Cell division"], correct: 0 },
    { question: "What determines eye color?", answers: ["Multiple genes", "Single gene", "Chromosome", "DNA type"], correct: 0 },
    { question: "What is a dominant trait?", answers: ["Always expressed", "Sometimes expressed", "Never expressed", "Recessive"], correct: 0 },
    { question: "What is a recessive trait?", answers: ["Only expressed when homozygous", "Always expressed", "Never expressed", "Dominant"], correct: 0 },
    { question: "What is a Punnett square?", answers: ["Predicts inheritance", "DNA structure", "Gene mapping", "Cell division"], correct: 0 },
    { question: "What is a phenotype?", answers: ["Physical appearance", "Genetic makeup", "DNA sequence", "Chromosome"], correct: 0 },
    { question: "What is a genotype?", answers: ["Genetic makeup", "Physical appearance", "DNA structure", "Cell type"], correct: 0 },
    { question: "What is a heterozygous genotype?", answers: ["Two different alleles", "Two same alleles", "One allele", "No alleles"], correct: 0 },
    { question: "What is a homozygous genotype?", answers: ["Two same alleles", "Two different alleles", "One allele", "No alleles"], correct: 0 },
    { question: "What is genetic engineering?", answers: ["Modifying DNA", "Studying genes", "Sequencing DNA", "Cloning cells"], correct: 0 },
    { question: "What is a stem cell?", answers: ["Undifferentiated cell", "Specialized cell", "Dead cell", "Cancer cell"], correct: 0 },
    { question: "What is mitosis?", answers: ["Cell division", "DNA replication", "Protein synthesis", "Gene expression"], correct: 0 },
    { question: "What is meiosis?", answers: ["Sex cell division", "Body cell division", "DNA replication", "Protein synthesis"], correct: 0 },
    { question: "What is a chromosome?", answers: ["DNA structure", "Protein", "Cell", "Gene"], correct: 0 },
    { question: "What is a telomere?", answers: ["End of chromosome", "Start of gene", "DNA sequence", "Protein"], correct: 0 },
    { question: "What is epigenetics?", answers: ["Gene expression changes", "DNA sequence changes", "Cell division", "Mutation"], correct: 0 },
    { question: "What is a plasmid?", answers: ["Circular DNA", "Linear DNA", "Protein", "Cell"], correct: 0 },
    { question: "What is transgenic?", answers: ["Contains foreign DNA", "Modified DNA", "Synthetic DNA", "Original DNA"], correct: 0 },
    { question: "What is a karyotype?", answers: ["Chromosome picture", "DNA sequence", "Gene map", "Cell structure"], correct: 0 }
  ],
  humanBody: [
    { question: "What is the largest organ in the human body?", answers: ["Skin", "Liver", "Brain", "Heart"], correct: 0 },
    { question: "How many bones are in the adult human body?", answers: ["206", "208", "204", "210"], correct: 0 },
    { question: "What is the hardest substance in the human body?", answers: ["Tooth enamel", "Bone", "Skull", "Nail"], correct: 0 },
    { question: "What pumps blood throughout the body?", answers: ["Heart", "Lungs", "Brain", "Liver"], correct: 0 },
    { question: "How many chambers does the human heart have?", answers: ["4", "2", "3", "5"], correct: 0 },
    { question: "What is the body's largest muscle?", answers: ["Gluteus maximus", "Quadriceps", "Hamstrings", "Biceps"], correct: 0 },
    { question: "What organ filters blood?", answers: ["Kidneys", "Liver", "Heart", "Lungs"], correct: 0 },
    { question: "What is the body's control center?", answers: ["Brain", "Heart", "Spine", "Nerves"], correct: 0 },
    { question: "How many lungs do humans have?", answers: ["2", "1", "3", "4"], correct: 0 },
    { question: "What is the body's longest bone?", answers: ["Femur", "Tibia", "Humerus", "Spine"], correct: 0 },
    { question: "What carries oxygen in the blood?", answers: ["Red blood cells", "White blood cells", "Platelets", "Plasma"], correct: 0 },
    { question: "What fights infection?", answers: ["White blood cells", "Red blood cells", "Platelets", "Plasma"], correct: 0 },
    { question: "What helps blood clot?", answers: ["Platelets", "Red blood cells", "White blood cells", "Plasma"], correct: 0 },
    { question: "What is the liquid part of blood?", answers: ["Plasma", "Platelets", "Red blood cells", "White blood cells"], correct: 0 },
    { question: "What organ produces insulin?", answers: ["Pancreas", "Liver", "Kidney", "Heart"], correct: 0 },
    { question: "What is the body's pH level?", answers: ["7.4", "7.0", "6.5", "8.0"], correct: 0 },
    { question: "What connects muscles to bones?", answers: ["Tendons", "Ligaments", "Cartilage", "Muscle fibers"], correct: 0 },
    { question: "What connects bones to bones?", answers: ["Ligaments", "Tendons", "Cartilage", "Muscle"], correct: 0 },
    { question: "What protects the brain?", answers: ["Skull", "Spine", "Ribs", "Skin"], correct: 0 },
    { question: "What protects the heart and lungs?", answers: ["Rib cage", "Skull", "Spine", "Pelvis"], correct: 0 },
    { question: "What is the body's temperature?", answers: ["98.6°F", "97°F", "100°F", "95°F"], correct: 0 },
    { question: "What organ stores energy?", answers: ["Liver", "Heart", "Kidney", "Brain"], correct: 0 },
    { question: "What breaks down food?", answers: ["Stomach", "Heart", "Lungs", "Brain"], correct: 0 },
    { question: "What absorbs nutrients?", answers: ["Small intestine", "Stomach", "Large intestine", "Liver"], correct: 0 },
    { question: "What absorbs water?", answers: ["Large intestine", "Small intestine", "Stomach", "Kidney"], correct: 0 },
    { question: "What produces bile?", answers: ["Liver", "Pancreas", "Stomach", "Gallbladder"], correct: 0 },
    { question: "What stores bile?", answers: ["Gallbladder", "Liver", "Pancreas", "Stomach"], correct: 0 },
    { question: "What is the body's defense system?", answers: ["Immune system", "Nervous system", "Digestive system", "Circulatory system"], correct: 0 },
    { question: "What detects light?", answers: ["Eyes", "Ears", "Nose", "Skin"], correct: 0 },
    { question: "What detects sound?", answers: ["Ears", "Eyes", "Nose", "Skin"], correct: 0 },
    { question: "What detects smell?", answers: ["Nose", "Eyes", "Ears", "Tongue"], correct: 0 }
  ],
  ecosystems: [
    { question: "What is the primary source of energy for ecosystems?", answers: ["Sun", "Wind", "Water", "Soil"], correct: 0 },
    { question: "What is a producer?", answers: ["Makes its own food", "Eats plants", "Eats animals", "Decomposer"], correct: 0 },
    { question: "What is a consumer?", answers: ["Eats other organisms", "Makes own food", "Decomposer", "Producer"], correct: 0 },
    { question: "What is a decomposer?", answers: ["Breaks down dead matter", "Makes own food", "Eats plants", "Eats animals"], correct: 0 },
    { question: "What is a food chain?", answers: ["Energy flow path", "Food web", "Ecosystem", "Biome"], correct: 0 },
    { question: "What is a food web?", answers: ["Interconnected food chains", "Single chain", "Ecosystem", "Biome"], correct: 0 },
    { question: "What is a biome?", answers: ["Large ecosystem", "Small ecosystem", "Food chain", "Habitat"], correct: 0 },
    { question: "What is a habitat?", answers: ["Where organism lives", "What organism eats", "How organism moves", "Organism type"], correct: 0 },
    { question: "What is biodiversity?", answers: ["Variety of life", "Single species", "Ecosystem size", "Food chain"], correct: 0 },
    { question: "What is photosynthesis?", answers: ["Making food from light", "Eating food", "Decomposing", "Reproducing"], correct: 0 },
    { question: "What gas do plants release?", answers: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], correct: 0 },
    { question: "What gas do plants take in?", answers: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], correct: 0 },
    { question: "What is the greenhouse effect?", answers: ["Trapping heat", "Cooling earth", "Making rain", "Creating wind"], correct: 0 },
    { question: "What causes climate change?", answers: ["Greenhouse gases", "Sunlight", "Rain", "Wind"], correct: 0 },
    { question: "What is deforestation?", answers: ["Cutting down forests", "Planting trees", "Growing crops", "Building cities"], correct: 0 },
    { question: "What is pollution?", answers: ["Harmful substances in environment", "Clean water", "Fresh air", "Healthy soil"], correct: 0 },
    { question: "What is a keystone species?", answers: ["Critical to ecosystem", "Rare species", "Common species", "Endangered species"], correct: 0 },
    { question: "What is an invasive species?", answers: ["Non-native harmful species", "Native species", "Endangered species", "Extinct species"], correct: 0 },
    { question: "What is extinction?", answers: ["Species gone forever", "Species endangered", "Species rare", "Species common"], correct: 0 },
    { question: "What is conservation?", answers: ["Protecting nature", "Destroying nature", "Ignoring nature", "Studying nature"], correct: 0 },
    { question: "What is sustainability?", answers: ["Meeting needs without harming future", "Using all resources", "Ignoring environment", "Quick growth"], correct: 0 },
    { question: "What is a wetland?", answers: ["Water-saturated land", "Dry land", "Mountain", "Desert"], correct: 0 },
    { question: "What is a coral reef?", answers: ["Marine ecosystem", "Forest", "Desert", "Grassland"], correct: 0 },
    { question: "What is a rainforest?", answers: ["Dense forest with high rainfall", "Dry forest", "Cold forest", "Small forest"], correct: 0 },
    { question: "What is a desert?", answers: ["Dry area with little rain", "Wet area", "Cold area", "Forest area"], correct: 0 },
    { question: "What is a tundra?", answers: ["Cold treeless biome", "Hot desert", "Rainforest", "Grassland"], correct: 0 },
    { question: "What is a grassland?", answers: ["Area with grasses", "Forest", "Desert", "Tundra"], correct: 0 },
    { question: "What is the water cycle?", answers: ["Water movement through earth", "Water in ocean", "Water in river", "Water in lake"], correct: 0 },
    { question: "What is the carbon cycle?", answers: ["Carbon movement through earth", "Oxygen cycle", "Nitrogen cycle", "Water cycle"], correct: 0 },
    { question: "What is the nitrogen cycle?", answers: ["Nitrogen movement through earth", "Carbon cycle", "Oxygen cycle", "Water cycle"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Devonshire%20Waltz%20Moderato.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('bioMind_muted', isMuted);
  
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
    return parseInt(localStorage.getItem(`bioMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('bioMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`bioMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('bioMind_highScore_overall', score);
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
  const percentage = (gameState.timeLeft / 10) * 100;
  timerBar.style.width = `${percentage}%`;
  
  if (percentage < 30) {
    timerBar.style.background = 'linear-gradient(90deg, #ff0000, #ff6600)';
  } else if (percentage < 60) {
    timerBar.style.background = 'linear-gradient(90deg, #ff6600, #ffcc00)';
  } else {
    timerBar.style.background = 'linear-gradient(90deg, #00ff87, #00f3ff)';
  }
}

// Start Timer
function startTimer() {
  gameState.timeLeft = 10;
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
async function init() {
  // Initialize i18n loader
  await gameI18n.init('bio-mind');
  
  // Load mute state
  isMuted = localStorage.getItem('bioMind_muted') === 'true';
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
