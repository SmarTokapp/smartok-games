// Cosmo Mind: Quantum Quest - Educational Trivia Game
// Deep space-themed fast-paced quiz game with streak multipliers and sound effects
// Music: "Equatorial Complex" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

// Use universal i18n loader
function t(key) {
    return gameI18n.t(key);
}

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
        { question: "What is a neutron star?", answers: ["A star made of neutrons", "A star with no mass", "A dying sun", "A gas giant"], correct: 0 },
        { question: "What is a white dwarf?", answers: ["A young star", "A stellar remnant", "A black hole", "A nebula"], correct: 1 },
        { question: "What is the Great Red Spot on Jupiter?", answers: ["A volcano", "A giant storm", "A crater", "An ocean"], correct: 1 },
        { question: "What is a pulsar?", answers: ["A rotating neutron star", "A black hole", "A planet", "A comet"], correct: 0 },
        { question: "What is the Kuiper Belt?", answers: ["A region of asteroids", "A region beyond Neptune with icy objects", "A star cluster", "A galaxy"], correct: 1 },
        { question: "What is the Oort Cloud?", answers: ["A dust cloud", "A spherical shell of icy objects", "A star cluster", "A nebula"], correct: 1 },
        { question: "What is a quasar?", answers: ["A star", "An extremely bright active galactic nucleus", "A planet", "A comet"], correct: 1 },
        { question: "What is cosmic microwave background radiation?", answers: ["Heat from stars", "Radiation from the Big Bang", "Solar radiation", "Gamma rays"], correct: 1 },
        { question: "What is the name of our galaxy's supermassive black hole?", answers: ["Centaurus A", "Sagittarius A*", "Cygnus X-1", "M87*"], correct: 1 },
        { question: "What is an exoplanet?", answers: ["A planet in our solar system", "A planet outside our solar system", "A moon", "A star"], correct: 1 },
        { question: "What is the asteroid belt between?", answers: ["Earth and Mars", "Mars and Jupiter", "Jupiter and Saturn", "Saturn and Uranus"], correct: 1 },
        { question: "What is a nebula?", answers: ["A star", "A cloud of gas and dust", "A black hole", "A galaxy"], correct: 1 },
        { question: "What is the closest galaxy to the Milky Way?", answers: ["Andromeda", "Triangulum", "Sombrero", "Whirlpool"], correct: 0 },
        { question: "What is the Hubble constant?", answers: ["Rate of universe expansion", "Star temperature", "Galaxy brightness", "Planet size"], correct: 0 },
        { question: "What is dark energy?", answers: ["Energy from stars", "Mysterious force accelerating universe expansion", "Black hole energy", "Solar energy"], correct: 1 },
        { question: "What is a red giant?", answers: ["A small star", "A dying star in late stage", "A young star", "A black hole"], correct: 1 },
        { question: "What is the main sequence?", answers: ["A galaxy type", "Star's stable phase burning hydrogen", "A planet orbit", "A black hole phase"], correct: 1 },
        { question: "What is the Schwarzschild radius?", answers: ["Radius of a star", "Radius of event horizon", "Radius of a planet", "Radius of a galaxy"], correct: 1 },
        { question: "What is the Goldilocks zone?", answers: ["A star cluster", "Habitable zone around a star", "A galaxy region", "A black hole region"], correct: 1 },
        { question: "What is a protostar?", answers: ["A dying star", "A forming star", "A black hole", "A planet"], correct: 1 },
        { question: "What is the Local Group?", answers: ["A star cluster", "Our galaxy cluster", "A planet system", "A black hole group"], correct: 1 },
        { question: "What is the cosmic web?", answers: ["A spider web in space", "Large-scale structure of universe", "A nebula", "A galaxy"], correct: 1 },
        { question: "What is the Big Bang theory?", answers: ["Universe started from a singularity and expanded", "Universe is eternal", "Universe is contracting", "Universe is static"], correct: 0 }
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
        { question: "What is the Pauli Exclusion Principle?", answers: ["Two fermions cannot occupy same quantum state", "Energy conservation", "Momentum conservation", "Angular momentum"], correct: 0 },
        { question: "What is an atom's nucleus made of?", answers: ["Electrons only", "Protons and neutrons", "Neutrons only", "Protons only"], correct: 1 },
        { question: "What is E=mc²?", answers: ["Energy equals mass times speed of light squared", "Force equals mass times acceleration", "Power equals voltage times current", "Momentum equals mass times velocity"], correct: 0 },
        { question: "What is gravity?", answers: ["A magnetic force", "Force of attraction between masses", "Nuclear force", "Electromagnetic force"], correct: 1 },
        { question: "What is the strong nuclear force?", answers: ["Holds nucleus together", "Causes gravity", "Electromagnetic force", "Weak force"], correct: 0 },
        { question: "What is the weak nuclear force?", answers: ["Holds nucleus together", "Responsible for radioactive decay", "Causes gravity", "Electromagnetic force"], correct: 1 },
        { question: "What is antimatter?", answers: ["Matter with negative mass", "Matter with opposite charge to normal matter", "Dark matter", "Energy"], correct: 1 },
        { question: "What is a boson?", answers: ["Particle with half-integer spin", "Particle with integer spin", "Massless particle only", "Charged particle only"], correct: 1 },
        { question: "What is a fermion?", answers: ["Particle with half-integer spin", "Particle with integer spin", "Massless particle only", "Charged particle only"], correct: 0 },
        { question: "What is the Higgs boson?", answers: ["Gives particles mass", "Causes gravity", "Creates light", "Forms nucleus"], correct: 0 },
        { question: "What is quantum superposition?", answers: ["System exists in multiple states simultaneously", "Particles moving at light speed", "Energy conservation", "Wave interference"], correct: 0 },
        { question: "What is the photoelectric effect?", answers: ["Light ejecting electrons from metal", "Sound producing light", "Heat producing electricity", "Magnetism producing light"], correct: 0 },
        { question: "What is special relativity?", answers: ["Physics of moving objects at constant velocity", "Physics of gravity", "Quantum mechanics", "Thermodynamics"], correct: 0 },
        { question: "What is general relativity?", answers: ["Physics of moving objects", "Theory of gravity as curved spacetime", "Quantum mechanics", "Electromagnetism"], correct: 1 },
        { question: "What is time dilation?", answers: ["Time passes slower at high speeds", "Time passes faster at high speeds", "Time is constant", "Time reverses"], correct: 0 },
        { question: "What is length contraction?", answers: ["Objects appear shorter at high speeds", "Objects appear longer at high speeds", "Objects don't change", "Objects disappear"], correct: 0 },
        { question: "What is the speed of light?", answers: ["Universal speed limit", "Variable speed", "Slowest speed", "Infinite speed"], correct: 0 },
        { question: "What is quantum decoherence?", answers: ["Loss of quantum behavior", "Gaining quantum behavior", "Creating entanglement", "Measuring position"], correct: 0 },
        { question: "What is a quantum bit (qubit)?", answers: ["Classical bit", "Superposition of 0 and 1", "Only 0", "Only 1"], correct: 1 },
        { question: "What is quantum computing?", answers: ["Uses quantum mechanics for computation", "Classical computing", "Analog computing", "Mechanical computing"], correct: 0 },
        { question: "What is the Planck constant?", answers: ["Fundamental constant of quantum mechanics", "Speed of light", "Gravitational constant", "Boltzmann constant"], correct: 0 },
        { question: "What is quantum field theory?", answers: ["Combines quantum mechanics and special relativity", "Classical mechanics", "General relativity", "Thermodynamics"], correct: 0 }
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
        { question: "What is the Earth's rotation period?", answers: ["24 hours", "12 hours", "48 hours", "365 days"], correct: 0 },
        { question: "What is the Earth's mantle?", answers: ["Layer between crust and core", "Earth's surface", "Outer atmosphere", "Ocean floor"], correct: 0 },
        { question: "What is the Earth's crust?", answers: ["Outermost solid layer", "Inner core", "Atmosphere", "Mantle"], correct: 0 },
        { question: "What is the deepest point in Earth's oceans?", answers: ["Mariana Trench", "Puerto Rico Trench", "Java Trench", "Philippine Trench"], correct: 0 },
        { question: "What is the highest mountain on Earth?", answers: ["Mount Everest", "K2", "Mount Kilimanjaro", "Mount Fuji"], correct: 0 },
        { question: "What is the Ring of Fire?", answers: ["Area of volcanic activity around Pacific", "A forest fire", "A desert region", "An ocean current"], correct: 0 },
        { question: "What is a convergent boundary?", answers: ["Plates moving toward each other", "Plates moving apart", "Plates sliding past each other", "Stationary plates"], correct: 0 },
        { question: "What is a divergent boundary?", answers: ["Plates moving toward each other", "Plates moving apart", "Plates sliding past each other", "Stationary plates"], correct: 1 },
        { question: "What is a transform boundary?", answers: ["Plates moving toward each other", "Plates moving apart", "Plates sliding past each other", "Stationary plates"], correct: 2 },
        { question: "What is the ozone layer?", answers: ["Layer protecting from UV radiation", "Layer of oxygen", "Layer of carbon dioxide", "Layer of nitrogen"], correct: 0 },
        { question: "What is the troposphere?", answers: ["Lowest atmospheric layer", "Highest atmospheric layer", "Middle layer", "Outer layer"], correct: 0 },
        { question: "What is the stratosphere?", answers: ["Layer above troposphere containing ozone", "Lowest layer", "Outermost layer", "Core layer"], correct: 0 },
        { question: "What is the mesosphere?", answers: ["Layer where meteors burn up", "Lowest layer", "Highest layer", "Ocean layer"], correct: 0 },
        { question: "What is the thermosphere?", answers: ["Layer with auroras and satellites", "Lowest layer", "Ocean layer", "Core layer"], correct: 0 },
        { question: "What is the hydrosphere?", answers: ["All water on Earth", "All land on Earth", "All atmosphere", "All life"], correct: 0 },
        { question: "What is the lithosphere?", answers: ["Rigid outer part of Earth", "Water layer", "Atmosphere", "Core"], correct: 0 },
        { question: "What is the asthenosphere?", answers: ["Ductile layer below lithosphere", "Rigid layer", "Atmosphere", "Core"], correct: 0 },
        { question: "What is Pangaea?", answers: ["Ancient supercontinent", "Current continent", "Ocean", "Mountain range"], correct: 0 },
        { question: "What is continental drift?", answers: ["Continents moving over geologic time", "Continents stationary", "Ocean movement", "Atmospheric movement"], correct: 0 },
        { question: "What is a volcano?", answers: ["Opening in Earth's crust", "Mountain only", "Ocean trench", "Glacier"], correct: 0 },
        { question: "What is an earthquake?", answers: ["Shaking of Earth's crust", "Volcanic eruption", "Ocean wave", "Atmospheric storm"], correct: 0 },
        { question: "What is the Richter scale?", answers: ["Measures earthquake magnitude", "Measures wind speed", "Measures temperature", "Measures ocean depth"], correct: 0 }
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
        { question: "What is the Kármán line?", answers: ["Boundary between Earth's atmosphere and space", "Equator", "Prime meridian", "International date line"], correct: 0 },
        { question: "What was the Apollo 11 mission?", answers: ["First Moon landing", "First space station", "First satellite", "First Mars landing"], correct: 0 },
        { question: "Who was the first person to walk on the Moon?", answers: ["Buzz Aldrin", "Neil Armstrong", "Michael Collins", "Yuri Gagarin"], correct: 1 },
        { question: "What is the Hubble Space Telescope?", answers: ["Ground-based telescope", "Space telescope orbiting Earth", "Radio telescope", "Solar telescope"], correct: 1 },
        { question: "What is the James Webb Space Telescope?", answers: ["Infrared space telescope", "Visible light telescope", "Radio telescope", "X-ray telescope"], correct: 0 },
        { question: "What is NASA?", answers: ["Russian space agency", "US space agency", "European space agency", "Chinese space agency"], correct: 1 },
        { question: "What is ESA?", answers: ["US space agency", "European Space Agency", "Russian space agency", "Chinese space agency"], correct: 1 },
        { question: "What is SpaceX?", answers: ["Government space agency", "Private aerospace company", "Telescope manufacturer", "Rocket fuel company"], correct: 1 },
        { question: "What is a Mars rover?", answers: ["Space station", "Vehicle exploring Mars surface", "Telescope", "Satellite"], correct: 1 },
        { question: "What was the first successful Mars rover?", answers: ["Curiosity", "Sojourner", "Perseverance", "Spirit"], correct: 1 },
        { question: "What is the Space Shuttle?", answers: ["Reusable spacecraft", "One-time rocket", "Space station", "Satellite"], correct: 0 },
        { question: "What is a launch pad?", answers: ["Where rockets are launched", "Where satellites are built", "Where astronauts train", "Where telescopes are made"], correct: 0 },
        { question: "What is mission control?", answers: ["Facility managing space missions", "Space station", "Launch pad", "Telescope"], correct: 0 },
        { question: "What is a geostationary orbit?", answers: ["Orbit matching Earth's rotation", "Polar orbit", "Elliptical orbit", "Lunar orbit"], correct: 0 },
        { question: "What is a low Earth orbit?", answers: ["Closest orbit to Earth", "Farthest orbit from Earth", "Lunar orbit", "Martian orbit"], correct: 0 },
        { question: "What is the Voyager program?", answers: ["Space probes exploring outer solar system", "Moon landing program", "Space station program", "Telescope program"], correct: 0 },
        { question: "What is the Curiosity rover?", answers: ["Mars rover studying geology", "Moon rover", "Space telescope", "Satellite"], correct: 0 },
        { question: "What is the Perseverance rover?", answers: ["Mars rover searching for signs of life", "Moon rover", "Space telescope", "Satellite"], correct: 0 },
        { question: "What is the Artemis program?", answers: ["NASA's Moon landing program", "Mars exploration program", "Space station program", "Telescope program"], correct: 0 },
        { question: "What is a space capsule?", answers: ["Spacecraft for human transport", "Type of telescope", "Launch vehicle", "Satellite"], correct: 0 },
        { question: "What is a booster rocket?", answers: ["Provides initial thrust", "Steers spacecraft", "Contains crew", "Orbits Earth"], correct: 0 },
        { question: "What is the Roscosmos?", answers: ["Russian space agency", "US space agency", "European space agency", "Chinese space agency"], correct: 0 }
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

// Initialize
async function init() {
    // Initialize i18n loader
    await gameI18n.init('cosmo-mind');
    
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
}

// Start the game
init();

// Update audio toggle button icon based on initial state
updateAudioToggleIcon();

// Initialize
loadHighScores();
