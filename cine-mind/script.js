// Music: "RetroFuture Clean" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

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
  hollywoodClassics: [
    { question: "Who played the lead role in Casablanca?", answers: ["Humphrey Bogart", "Clark Gable", "Cary Grant", "James Stewart"], correct: 0 },
    { question: "What year was Gone with the Wind released?", answers: ["1939", "1940", "1941", "1938"], correct: 0 },
    { question: "Who directed Citizen Kane?", answers: ["Orson Welles", "Alfred Hitchcock", "John Ford", "Frank Capra"], correct: 0 },
    { question: "What is the name of the ship in Titanic?", answers: ["RMS Titanic", "SS Titanic", "HMS Titanic", "MV Titanic"], correct: 0 },
    { question: "Who played Dorothy in The Wizard of Oz?", answers: ["Judy Garland", "Shirley Temple", "Marilyn Monroe", "Audrey Hepburn"], correct: 0 },
    { question: "What was the first talking film?", answers: ["The Jazz Singer", "The Singing Fool", "Lights of New York", "The Broadway Melody"], correct: 0 },
    { question: "Who played Rick Blaine in Casablanca?", answers: ["Humphrey Bogart", "Paul Henreid", "Claude Rains", "Peter Lorre"], correct: 0 },
    { question: "What year did The Godfather premiere?", answers: ["1972", "1973", "1974", "1971"], correct: 0 },
    { question: "Who directed Psycho?", answers: ["Alfred Hitchcock", "Stanley Kubrick", "Orson Welles", "John Ford"], correct: 0 },
    { question: "What is the highest-grossing film of all time?", answers: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"], correct: 0 },
    { question: "Who played Scarlett O'Hara in Gone with the Wind?", answers: ["Vivien Leigh", "Olivia de Havilland", "Hattie McDaniel", "Joan Crawford"], correct: 0 },
    { question: "What was the first feature-length animated film?", answers: ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Dumbo"], correct: 0 },
    { question: "Who played the Joker in The Dark Knight?", answers: ["Heath Ledger", "Jack Nicholson", "Joaquin Phoenix", "Cesar Romero"], correct: 0 },
    { question: "What year was Star Wars: A New Hope released?", answers: ["1977", "1978", "1976", "1979"], correct: 0 },
    { question: "Who directed Jurassic Park?", answers: ["Steven Spielberg", "George Lucas", "James Cameron", "Ridley Scott"], correct: 0 },
    { question: "What is the name of the shark in Jaws?", answers: ["Bruce", "Jaws", "Great White", "Shark"], correct: 0 },
    { question: "Who played Forrest Gump?", answers: ["Tom Hanks", "Robin Williams", "Jim Carrey", "Tom Cruise"], correct: 0 },
    { question: "What year did Schindler's List win Best Picture?", answers: ["1993", "1994", "1992", "1995"], correct: 0 },
    { question: "Who directed Pulp Fiction?", answers: ["Quentin Tarantino", "Martin Scorsese", "Robert Rodriguez", "The Coen Brothers"], correct: 0 },
    { question: "What is the highest-grossing black and white film?", answers: ["Schindler's List", "Young Frankenstein", "The Artist", "Clerks"], correct: 0 },
    { question: "Who played Hannibal Lecter in The Silence of the Lambs?", answers: ["Anthony Hopkins", "Brian Cox", "Mads Mikkelsen", "Gaspard Ulliel"], correct: 0 },
    { question: "What year did The Shawshank Redemption premiere?", answers: ["1994", "1995", "1993", "1996"], correct: 0 },
    { question: "Who directed The Matrix?", answers: ["The Wachowskis", "James Cameron", "George Lucas", "Steven Spielberg"], correct: 0 },
    { question: "What is the name of the protagonist in The Matrix?", answers: ["Neo", "Morpheus", "Trinity", "Agent Smith"], correct: 0 },
    { question: "Who played Jack Dawson in Titanic?", answers: ["Leonardo DiCaprio", "Brad Pitt", "Johnny Depp", "Tom Cruise"], correct: 0 },
    { question: "What year did The Lord of the Rings: The Fellowship of the Ring premiere?", answers: ["2001", "2002", "2000", "2003"], correct: 0 },
    { question: "Who directed The Lord of the Rings trilogy?", answers: ["Peter Jackson", "Steven Spielberg", "George Lucas", "James Cameron"], correct: 0 },
    { question: "What is the name of the ring in The Lord of the Rings?", answers: ["The One Ring", "The Ring of Power", "The Precious", "The Master Ring"], correct: 0 },
    { question: "Who played Gollum in The Lord of the Rings?", answers: ["Andy Serkis", "Elijah Wood", "Ian McKellen", "Viggo Mortensen"], correct: 0 },
    { question: "What year did The Dark Knight premiere?", answers: ["2008", "2009", "2007", "2010"], correct: 0 }
  ],
  directors: [
    { question: "Who directed Jaws?", answers: ["Steven Spielberg", "George Lucas", "James Cameron", "Ridley Scott"], correct: 0 },
    { question: "Who directed Star Wars?", answers: ["George Lucas", "Steven Spielberg", "James Cameron", "Ridley Scott"], correct: 0 },
    { question: "Who directed Aliens?", answers: ["James Cameron", "Ridley Scott", "Steven Spielberg", "George Lucas"], correct: 0 },
    { question: "Who directed Blade Runner?", answers: ["Ridley Scott", "James Cameron", "Steven Spielberg", "George Lucas"], correct: 0 },
    { question: "Who directed The Godfather?", answers: ["Francis Ford Coppola", "Martin Scorsese", "Stanley Kubrick", "Orson Welles"], correct: 0 },
    { question: "Who directed Taxi Driver?", answers: ["Martin Scorsese", "Francis Ford Coppola", "Stanley Kubrick", "Orson Welles"], correct: 0 },
    { question: "Who directed 2001: A Space Odyssey?", answers: ["Stanley Kubrick", "George Lucas", "Steven Spielberg", "Ridley Scott"], correct: 0 },
    { question: "Who directed Pulp Fiction?", answers: ["Quentin Tarantino", "Martin Scorsese", "Robert Rodriguez", "The Coen Brothers"], correct: 0 },
    { question: "Who directed Reservoir Dogs?", answers: ["Quentin Tarantino", "Martin Scorsese", "Robert Rodriguez", "The Coen Brothers"], correct: 0 },
    { question: "Who directed The Shining?", answers: ["Stanley Kubrick", "Alfred Hitchcock", "John Carpenter", "David Lynch"], correct: 0 },
    { question: "Who directed Rear Window?", answers: ["Alfred Hitchcock", "Stanley Kubrick", "John Carpenter", "David Lynch"], correct: 0 },
    { question: "Who directed Halloween?", answers: ["John Carpenter", "Alfred Hitchcock", "Stanley Kubrick", "David Lynch"], correct: 0 },
    { question: "Who directed Mulholland Drive?", answers: ["David Lynch", "Alfred Hitchcock", "Stanley Kubrick", "John Carpenter"], correct: 0 },
    { question: "Who directed No Country for Old Men?", answers: ["The Coen Brothers", "Quentin Tarantino", "Martin Scorsese", "Steven Spielberg"], correct: 0 },
    { question: "Who directed Fargo?", answers: ["The Coen Brothers", "Quentin Tarantino", "Martin Scorsese", "Steven Spielberg"], correct: 0 },
    { question: "Who directed The Big Lebowski?", answers: ["The Coen Brothers", "Quentin Tarantino", "Martin Scorsese", "Steven Spielberg"], correct: 0 },
    { question: "Who directed Inception?", answers: ["Christopher Nolan", "The Wachowskis", "David Fincher", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed The Dark Knight trilogy?", answers: ["Christopher Nolan", "The Wachowskis", "David Fincher", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed Interstellar?", answers: ["Christopher Nolan", "The Wachowskis", "David Fincher", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed The Matrix?", answers: ["The Wachowskis", "Christopher Nolan", "David Fincher", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed Fight Club?", answers: ["David Fincher", "Christopher Nolan", "The Wachowskis", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed The Social Network?", answers: ["David Fincher", "Christopher Nolan", "The Wachowskis", "Denis Villeneuve"], correct: 0 },
    { question: "Who directed Blade Runner 2049?", answers: ["Denis Villeneuve", "Ridley Scott", "Christopher Nolan", "David Fincher"], correct: 0 },
    { question: "Who directed Dune?", answers: ["Denis Villeneuve", "David Lynch", "Christopher Nolan", "Ridley Scott"], correct: 0 },
    { question: "Who directed Arrival?", answers: ["Denis Villeneuve", "Christopher Nolan", "David Fincher", "The Wachowskis"], correct: 0 },
    { question: "Who directed Pan's Labyrinth?", answers: ["Guillermo del Toro", "Alfonso Cuaron", "Alejandro Gonzalez Inarritu", "Pedro Almodovar"], correct: 0 },
    { question: "Who directed The Shape of Water?", answers: ["Guillermo del Toro", "Alfonso Cuaron", "Alejandro Gonzalez Inarritu", "Pedro Almodovar"], correct: 0 },
    { question: "Who directed Gravity?", answers: ["Alfonso Cuaron", "Guillermo del Toro", "Alejandro Gonzalez Inarritu", "Pedro Almodovar"], correct: 0 },
    { question: "Who directed Birdman?", answers: ["Alejandro Gonzalez Inarritu", "Alfonso Cuaron", "Guillermo del Toro", "Pedro Almodovar"], correct: 0 },
    { question: "Who directed Parasite?", answers: ["Bong Joon-ho", "Park Chan-wook", "Kim Jee-woon", "Lee Chang-dong"], correct: 0 }
  ],
  awardWinners: [
    { question: "Which film won Best Picture in 2020?", answers: ["Parasite", "1917", "Joker", "Once Upon a Time in Hollywood"], correct: 0 },
    { question: "Which film won Best Picture in 2021?", answers: ["Nomadland", "The Trial of the Chicago 7", "Promising Young Woman", "Minari"], correct: 0 },
    { question: "Which film won Best Picture in 2022?", answers: ["CODA", "The Power of the Dog", "Belfast", "West Side Story"], correct: 0 },
    { question: "Which film won Best Picture in 2023?", answers: ["Everything Everywhere All at Once", "All Quiet on the Western Front", "The Fabelmans", "Top Gun: Maverick"], correct: 0 },
    { question: "Who won Best Actor for The Godfather?", answers: ["Marlon Brando", "Al Pacino", "Robert De Niro", "James Caan"], correct: 0 },
    { question: "Who won Best Actress for Silver Linings Playbook?", answers: ["Jennifer Lawrence", "Jessica Chastain", "Naomi Watts", "Emmanuelle Riva"], correct: 0 },
    { question: "Who won Best Director for The Shape of Water?", answers: ["Guillermo del Toro", "Christopher Nolan", "Martin Scorsese", "Jordan Peele"], correct: 0 },
    { question: "Which film won the most Oscars?", answers: ["Ben-Hur, Titanic, The Lord of the Rings: ROTK", "Avatar", "All About Eve", "Gigi"], correct: 0 },
    { question: "Who won Best Supporting Actor for The Godfather?", answers: ["Robert De Niro", "Al Pacino", "James Caan", "John Cazale"], correct: 2 },
    { question: "Who won Best Supporting Actress for The Godfather?", answers: ["Talia Shire", "Diane Keaton", "Morgan Fairchild", "Tuesday Weld"], correct: 0 },
    { question: "Which film won Best Picture in 1975?", answers: ["One Flew Over the Cuckoo's Nest", "Jaws", "Dog Day Afternoon", "Nashville"], correct: 0 },
    { question: "Which film won Best Picture in 1994?", answers: ["Forrest Gump", "Pulp Fiction", "The Shawshank Redemption", "Quiz Show"], correct: 0 },
    { question: "Who won Best Actor for The Revenant?", answers: ["Leonardo DiCaprio", "Matt Damon", "Michael Fassbender", "Eddie Redmayne"], correct: 0 },
    { question: "Who won Best Actress for La La Land?", answers: ["Emma Stone", "Natalie Portman", "Ruth Negga", "Isabelle Huppert"], correct: 0 },
    { question: "Which film won Best Animated Feature in 2002?", answers: ["Spirited Away", "Ice Age", "Lilo & Stitch", "Treasure Planet"], correct: 0 },
    { question: "Who won Best Director for The French Dispatch?", answers: ["Wes Anderson", "Denis Villeneuve", "Jane Campion", "Paul Thomas Anderson"], correct: 0 },
    { question: "Which film won Best Picture in 2024?", answers: ["Oppenheimer", "Poor Things", "Killers of the Flower Moon", "Barbie"], correct: 0 },
    { question: "Who won Best Actor for Oppenheimer?", answers: ["Cillian Murphy", "Paul Giamatti", "Bradley Cooper", "Colman Domingo"], correct: 0 },
    { question: "Who won Best Actress for Poor Things?", answers: ["Emma Stone", "Lily Gladstone", "Sandra Huller", "Annette Bening"], correct: 0 },
    { question: "Who won Best Supporting Actor for Oppenheimer?", answers: ["Robert Downey Jr.", "Robert De Niro", "Ryan Gosling", "Mark Ruffalo"], correct: 0 },
    { question: "Who won Best Supporting Actress for The Holdovers?", answers: ["Da'Vine Joy Randolph", "Emily Blunt", "Jodie Foster", "America Ferrera"], correct: 0 },
    { question: "Which film won Best International Feature in 2020?", answers: ["Parasite", "Corpus Christi", "Honeyland", "Pain and Glory"], correct: 0 },
    { question: "Who won Best Director for The Power of the Dog?", answers: ["Jane Campion", "Steven Spielberg", "Ryusuke Hamaguchi", "Kenneth Branagh"], correct: 0 },
    { question: "Which film won Best Picture in 1997?", answers: ["Titanic", "L.A. Confidential", "Good Will Hunting", "The Full Monty"], correct: 0 },
    { question: "Who won Best Actress for Black Swan?", answers: ["Natalie Portman", "Annette Bening", "Nicole Kidman", "Michelle Williams"], correct: 0 },
    { question: "Who won Best Actor for The King's Speech?", answers: ["Colin Firth", "Jesse Eisenberg", "James Franco", "Jeff Bridges"], correct: 0 },
    { question: "Which film won Best Picture in 2010?", answers: ["The King's Speech", "The Social Network", "Inception", "Black Swan"], correct: 0 },
    { question: "Who won Best Director for The Hurt Locker?", answers: ["Kathryn Bigelow", "James Cameron", "Quentin Tarantino", "Lee Daniels"], correct: 0 },
    { question: "Which film won Best Picture in 2009?", answers: ["The Hurt Locker", "Avatar", "Inglourious Basterds", "Up"], correct: 0 },
    { question: "Who won Best Actress for The Iron Lady?", answers: ["Meryl Streep", "Viola Davis", "Rooney Mara", "Glenn Close"], correct: 0 }
  ],
  popCulture: [
    { question: "What is the highest-grossing superhero film?", answers: ["Avengers: Endgame", "Avengers: Infinity War", "Spider-Man: No Way Home", "Black Panther"], correct: 0 },
    { question: "Who played Iron Man in the MCU?", answers: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], correct: 0 },
    { question: "What is the name of the villain in The Avengers?", answers: ["Thanos", "Loki", "Ultron", "Hela"], correct: 0 },
    { question: "Who played Captain America in the MCU?", answers: ["Chris Evans", "Robert Downey Jr.", "Chris Hemsworth", "Mark Ruffalo"], correct: 0 },
    { question: "What is the name of the superhero team in The Avengers?", answers: ["The Avengers", "The Justice League", "The X-Men", "The Fantastic Four"], correct: 0 },
    { question: "Who played Thor in the MCU?", answers: ["Chris Hemsworth", "Chris Evans", "Robert Downey Jr.", "Mark Ruffalo"], correct: 0 },
    { question: "What is the name of the villain in Black Panther?", answers: ["Killmonger", "Klaw", "M'Baku", "Zuri"], correct: 0 },
    { question: "Who played Spider-Man in the MCU?", answers: ["Tom Holland", "Tobey Maguire", "Andrew Garfield", "Miles Morales"], correct: 0 },
    { question: "What is the name of the villain in Spider-Man: Homecoming?", answers: ["Vulture", "Mysterio", "Green Goblin", "Doctor Octopus"], correct: 0 },
    { question: "Who played Batman in The Dark Knight trilogy?", answers: ["Christian Bale", "Ben Affleck", "Robert Pattinson", "Michael Keaton"], correct: 0 },
    { question: "What is the name of the villain in The Dark Knight?", answers: ["The Joker", "Bane", "Two-Face", "Scarecrow"], correct: 0 },
    { question: "Who played the Joker in The Dark Knight?", answers: ["Heath Ledger", "Jack Nicholson", "Joaquin Phoenix", "Cesar Romero"], correct: 0 },
    { question: "What is the name of the superhero team in Justice League?", answers: ["The Justice League", "The Avengers", "The X-Men", "The Fantastic Four"], correct: 0 },
    { question: "Who played Superman in Man of Steel?", answers: ["Henry Cavill", "Christopher Reeve", "Brandon Routh", "Tyler Hoechlin"], correct: 0 },
    { question: "What is the name of the villain in Man of Steel?", answers: ["General Zod", "Lex Luthor", "Doomsday", "Brainiac"], correct: 0 },
    { question: "Who played Wonder Woman in the DCEU?", answers: ["Gal Gadot", "Lynda Carter", "Adrianne Palicki", "Cobie Smulders"], correct: 0 },
    { question: "What is the name of the villain in Wonder Woman?", answers: ["Ares", "Cheetah", "Circe", "Hippolyta"], correct: 0 },
    { question: "Who played Aquaman in the DCEU?", answers: ["Jason Momoa", "Alan Ritchson", "Justin Hartley", "Lou Diamond Phillips"], correct: 0 },
    { question: "What is the name of the villain in Aquaman?", answers: ["Orm", "Black Manta", "Ocean Master", "King Nereus"], correct: 0 },
    { question: "Who played the Joker in Joker (2019)?", answers: ["Joaquin Phoenix", "Heath Ledger", "Jack Nicholson", "Jared Leto"], correct: 0 },
    { question: "What is the name of the protagonist in Joker?", answers: ["Arthur Fleck", "Jack Napier", "Joker", "Bruce Wayne"], correct: 0 },
    { question: "Who played Wolverine in the X-Men films?", answers: ["Hugh Jackman", "Patrick Stewart", "Ian McKellen", "James McAvoy"], correct: 0 },
    { question: "What is the name of the villain in X-Men: Days of Future Past?", answers: ["Sentinels", "Magneto", "Bolivar Trask", "William Stryker"], correct: 0 },
    { question: "Who played Professor X in the X-Men films?", answers: ["Patrick Stewart", "Ian McKellen", "James McAvoy", "Michael Fassbender"], correct: 0 },
    { question: "What is the name of the superhero team in X-Men?", answers: ["The X-Men", "The Avengers", "The Justice League", "The Fantastic Four"], correct: 0 },
    { question: "Who played Deadpool in the Deadpool films?", answers: ["Ryan Reynolds", "Josh Brolin", "T.J. Miller", "Ed Skrein"], correct: 0 },
    { question: "What is the name of the villain in Deadpool?", answers: ["Ajax", "Francis Freeman", "Colossus", "Cable"], correct: 0 },
    { question: "Who played Black Panther in the MCU?", answers: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o", "Danai Gurira"], correct: 0 },
    { question: "What is the name of the fictional country in Black Panther?", answers: ["Wakanda", "Genosha", "Latveria", "Sokovia"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/RetroFuture%20Clean.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('cineMind_muted', isMuted);
  
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
    return parseInt(localStorage.getItem(`cineMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('cineMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`cineMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('cineMind_highScore_overall', score);
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
function init() {
  // Load mute state
  isMuted = localStorage.getItem('cineMind_muted') === 'true';
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
