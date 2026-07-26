// Muse Mind: Culture & Arts - Game Script

// Question Database - 30 questions per category (120 total)
const questions = {
    masterpieces: [
        { question: "Who painted the Mona Lisa?", answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 0 },
        { question: "The Starry Night was painted by which artist?", answers: ["Vincent van Gogh", "Claude Monet", "Pablo Picasso", "Salvador Dalí"], correct: 0 },
        { question: "Which artist sculpted David?", answers: ["Michelangelo", "Donatello", "Leonardo da Vinci", "Raphael"], correct: 0 },
        { question: "The Persistence of Memory features melting what?", answers: ["Clocks", "Candles", "Faces", "Buildings"], correct: 0 },
        { question: "Who painted The Birth of Venus?", answers: ["Sandro Botticelli", "Leonardo da Vinci", "Raphael", "Michelangelo"], correct: 0 },
        { question: "The Girl with a Pearl Earring was painted by?", answers: ["Johannes Vermeer", "Rembrandt", "Frans Hals", "Jan Steen"], correct: 0 },
        { question: "Which artist is known for cut-out paper works?", answers: ["Henri Matisse", "Pablo Picasso", "Wassily Kandinsky", "Marc Chagall"], correct: 0 },
        { question: "The Scream was painted by which Norwegian artist?", answers: ["Edvard Munch", "Henrik Ibsen", "Edvard Grieg", "Knut Hamsun"], correct: 0 },
        { question: "Who painted Guernica?", answers: ["Pablo Picasso", "Salvador Dalí", "Joan Miró", "Francisco Goya"], correct: 0 },
        { question: "The Last Supper depicts which biblical event?", answers: ["Jesus' final meal with disciples", "Crucifixion", "Resurrection", "Baptism"], correct: 0 },
        { question: "Which artist is known for water lily paintings?", answers: ["Claude Monet", "Pierre-Auguste Renoir", "Édouard Manet", "Paul Cézanne"], correct: 0 },
        { question: "Who created the sculpture The Thinker?", answers: ["Auguste Rodin", "Michelangelo", "Donatello", "Bernini"], correct: 0 },
        { question: "The Night Watch was painted by which Dutch master?", answers: ["Rembrandt", "Johannes Vermeer", "Frans Hals", "Jan Steen"], correct: 0 },
        { question: "Which artist pioneered Pointillism?", answers: ["Georges Seurat", "Claude Monet", "Vincent van Gogh", "Paul Cézanne"], correct: 0 },
        { question: "Who painted American Gothic?", answers: ["Grant Wood", "Edward Hopper", "Andrew Wyeth", "Norman Rockwell"], correct: 0 },
        { question: "The School of Athens was painted by?", answers: ["Raphael", "Michelangelo", "Leonardo da Vinci", "Donatello"], correct: 0 },
        { question: "Which artist is known for Campbell's Soup Cans?", answers: ["Andy Warhol", "Roy Lichtenstein", "Jasper Johns", "Robert Rauschenberg"], correct: 0 },
        { question: "Who painted The Great Wave off Kanagawa?", answers: ["Katsushika Hokusai", "Utagawa Hiroshige", "Katsushika Hokushi", "Utagawa Kuniyoshi"], correct: 0 },
        { question: "The Creation of Adam is part of which ceiling?", answers: ["Sistine Chapel", "St. Peter's Basilica", "Pantheon", "Colosseum"], correct: 0 },
        { question: "Which artist painted Les Demoiselles d'Avignon?", answers: ["Pablo Picasso", "Henri Matisse", "Georges Braque", "André Derain"], correct: 0 },
        { question: "Who is known for drip painting technique?", answers: ["Jackson Pollock", "Willem de Kooning", "Mark Rothko", "Franz Kline"], correct: 0 },
        { question: "The Arnolfini Portrait was painted by?", answers: ["Jan van Eyck", "Hieronymus Bosch", "Pieter Bruegel", "Albrecht Dürer"], correct: 0 },
        { question: "Which artist created The Kiss?", answers: ["Gustav Klimt", "Egon Schiele", "Oskar Kokoschka", "Alphonse Mucha"], correct: 0 },
        { question: "Who painted Nighthawks?", answers: ["Edward Hopper", "Grant Wood", "Andrew Wyeth", "Norman Rockwell"], correct: 0 },
        { question: "The Garden of Earthly Delights was painted by?", answers: ["Hieronymus Bosch", "Pieter Bruegel", "Jan van Eyck", "Albrecht Dürer"], correct: 0 },
        { question: "Which artist is known for Blue Period works?", answers: ["Pablo Picasso", "Claude Monet", "Vincent van Gogh", "Henri Matisse"], correct: 0 },
        { question: "Who painted Liberty Leading the People?", answers: ["Eugène Delacroix", "Jacques-Louis David", "Théodore Géricault", "Jean-Auguste Dominique Ingres"], correct: 0 },
        { question: "The Las Meninas was painted by which Spanish artist?", answers: ["Diego Velázquez", "Francisco Goya", "El Greco", "Bartolomé Esteban Murillo"], correct: 0 },
        { question: "Which artist created Composition VII?", answers: ["Wassily Kandinsky", "Piet Mondrian", "Kazimir Malevich", "Theo van Doesburg"], correct: 0 },
        { question: "Who painted The Hay Wain?", answers: ["John Constable", "J.M.W. Turner", "Thomas Gainsborough", "Joshua Reynolds"], correct: 0 }
    ],
    music: [
        { question: "Who composed The Four Seasons?", answers: ["Antonio Vivaldi", "Johann Sebastian Bach", "George Frideric Handel", "Wolfgang Amadeus Mozart"], correct: 0 },
        { question: "Beethoven's Symphony No. 9 is also known as?", answers: ["Choral", "Pastoral", "Eroica", "Fate"], correct: 0 },
        { question: "Which composer wrote The Magic Flute?", answers: ["Wolfgang Amadeus Mozart", "Giuseppe Verdi", "Giacomo Puccini", "Richard Wagner"], correct: 0 },
        { question: "Who composed Swan Lake?", answers: ["Pyotr Ilyich Tchaikovsky", "Igor Stravinsky", "Sergei Rachmaninoff", "Dmitri Shostakovich"], correct: 0 },
        { question: "The Rite of Spring was composed by?", answers: ["Igor Stravinsky", "Claude Debussy", "Maurice Ravel", "Erik Satie"], correct: 0 },
        { question: "Who composed Clair de Lune?", answers: ["Claude Debussy", "Maurice Ravel", "Erik Satie", "Francis Poulenc"], correct: 0 },
        { question: "Bach's Brandenburg Concertos consist of how many works?", answers: ["6", "4", "5", "8"], correct: 0 },
        { question: "Who composed Carmen?", answers: ["Georges Bizet", "Giuseppe Verdi", "Giacomo Puccini", "Jules Massenet"], correct: 0 },
        { question: "Which composer wrote Symphony No. 5 'From the New World'?", answers: ["Antonín Dvořák", "Bedřich Smetana", "Leoš Janáček", "Bohuslav Martinů"], correct: 0 },
        { question: "Who composed The Planets?", answers: ["Gustav Holst", "Ralph Vaughan Williams", "Edward Elgar", "Benjamin Britten"], correct: 0 },
        { question: "Mozart composed over how many symphonies?", answers: ["41", "30", "50", "45"], correct: 0 },
        { question: "Who composed Boléro?", answers: ["Maurice Ravel", "Claude Debussy", "Erik Satie", "Francis Poulenc"], correct: 0 },
        { question: "Which composer wrote Messiah?", answers: ["George Frideric Handel", "Johann Sebastian Bach", "Antonio Vivaldi", "Wolfgang Amadeus Mozart"], correct: 0 },
        { question: "Who composed Nocturnes?", answers: ["Frédéric Chopin", "Franz Liszt", "Robert Schumann", "Johannes Brahms"], correct: 0 },
        { question: "The Marriage of Figaro was composed by?", answers: ["Wolfgang Amadeus Mozart", "Giuseppe Verdi", "Giacomo Puccini", "Richard Wagner"], correct: 0 },
        { question: "Who composed La Traviata?", answers: ["Giuseppe Verdi", "Giacomo Puccini", "Richard Wagner", "Gioachino Rossini"], correct: 0 },
        { question: "Which composer wrote Peer Gynt?", answers: ["Edvard Grieg", "Jean Sibelius", "Carl Nielsen", "Niels Gade"], correct: 0 },
        { question: "Who composed Pictures at an Exhibition?", answers: ["Modest Mussorgsky", "Nikolai Rimsky-Korsakov", "Alexander Borodin", "César Cui"], correct: 0 },
        { question: "Schubert's Unfinished Symphony is numbered?", answers: ["8", "7", "9", "6"], correct: 0 },
        { question: "Who composed The Ring Cycle?", answers: ["Richard Wagner", "Giuseppe Verdi", "Giacomo Puccini", "Richard Strauss"], correct: 0 },
        { question: "Which composer wrote Hungarian Dances?", answers: ["Johannes Brahms", "Franz Liszt", "Antonín Dvořák", "Béla Bartók"], correct: 0 },
        { question: "Who composed Porgy and Bess?", answers: ["George Gershwin", "Irving Berlin", "Cole Porter", "Jerome Kern"], correct: 0 },
        { question: "The Blue Danube was composed by?", answers: ["Johann Strauss II", "Johann Strauss I", "Franz Lehár", "Emmerich Kálmán"], correct: 0 },
        { question: "Who composed West Side Story?", answers: ["Leonard Bernstein", "Stephen Sondheim", "Andrew Lloyd Webber", "Claude-Michel Schönberg"], correct: 0 },
        { question: "Which composer wrote Pavane for a Dead Princess?", answers: ["Maurice Ravel", "Claude Debussy", "Erik Satie", "Francis Poulenc"], correct: 0 },
        { question: "Who composed Symphonie Fantastique?", answers: ["Hector Berlioz", "Franz Liszt", "Richard Wagner", "Giacomo Meyerbeer"], correct: 0 },
        { question: "The Nutcracker was composed by?", answers: ["Pyotr Ilyich Tchaikovsky", "Igor Stravinsky", "Sergei Rachmaninoff", "Dmitri Shostakovich"], correct: 0 },
        { question: "Who composed Fantasia on a Theme by Thomas Tallis?", answers: ["Ralph Vaughan Williams", "Gustav Holst", "Edward Elgar", "Benjamin Britten"], correct: 0 },
        { question: "Which composer wrote Turkish Rondo?", answers: ["Wolfgang Amadeus Mozart", "Ludwig van Beethoven", "Franz Joseph Haydn", "Muzio Clementi"], correct: 0 },
        { question: "Who composed Appalachian Spring?", answers: ["Aaron Copland", "Charles Ives", "Samuel Barber", "Leonard Bernstein"], correct: 0 }
    ],
    literature: [
        { question: "Who wrote Romeo and Juliet?", answers: ["William Shakespeare", "Christopher Marlowe", "Ben Jonson", "John Donne"], correct: 0 },
        { question: "The Odyssey was written by?", answers: ["Homer", "Virgil", "Sophocles", "Euripides"], correct: 0 },
        { question: "Who wrote Pride and Prejudice?", answers: ["Jane Austen", "Charlotte Brontë", "Emily Brontë", "George Eliot"], correct: 0 },
        { question: "Don Quixote was written by which Spanish author?", answers: ["Miguel de Cervantes", "Gabriel García Márquez", "Jorge Luis Borges", "Pablo Neruda"], correct: 0 },
        { question: "Who wrote Crime and Punishment?", answers: ["Fyodor Dostoevsky", "Leo Tolstoy", "Anton Chekhov", "Ivan Turgenev"], correct: 0 },
        { question: "The Divine Comedy was written by?", answers: ["Dante Alighieri", "Giovanni Boccaccio", "Francesco Petrarch", "Niccolò Machiavelli"], correct: 0 },
        { question: "Who wrote 1984?", answers: ["George Orwell", "Aldous Huxley", "Ray Bradbury", "Kurt Vonnegut"], correct: 0 },
        { question: "The Iliad is an epic poem about which war?", answers: ["Trojan War", "Persian Wars", "Peloponnesian War", "Punic Wars"], correct: 0 },
        { question: "Who wrote War and Peace?", answers: ["Leo Tolstoy", "Fyodor Dostoevsky", "Anton Chekhov", "Ivan Turgenev"], correct: 0 },
        { question: "The Great Gatsby was written by?", answers: ["F. Scott Fitzgerald", "Ernest Hemingway", "John Steinbeck", "William Faulkner"], correct: 0 },
        { question: "Who wrote Les Misérables?", answers: ["Victor Hugo", "Alexandre Dumas", "Émile Zola", "Gustave Flaubert"], correct: 0 },
        { question: "The Canterbury Tales was written by?", answers: ["Geoffrey Chaucer", "William Langland", "John Gower", "Thomas Malory"], correct: 0 },
        { question: "Who wrote Moby-Dick?", answers: ["Herman Melville", "Nathaniel Hawthorne", "Mark Twain", "Edgar Allan Poe"], correct: 0 },
        { question: "Faust was written by which German author?", answers: ["Johann Wolfgang von Goethe", "Friedrich Schiller", "Heinrich Heine", "Thomas Mann"], correct: 0 },
        { question: "Who wrote Jane Eyre?", answers: ["Charlotte Brontë", "Emily Brontë", "Anne Brontë", "George Eliot"], correct: 0 },
        { question: "The Count of Monte Cristo was written by?", answers: ["Alexandre Dumas", "Victor Hugo", "Jules Verne", "Émile Zola"], correct: 0 },
        { question: "Who wrote Wuthering Heights?", answers: ["Emily Brontë", "Charlotte Brontë", "Anne Brontë", "Jane Austen"], correct: 0 },
        { question: "The Brothers Karamazov was written by?", answers: ["Fyodor Dostoevsky", "Leo Tolstoy", "Anton Chekhov", "Ivan Turgenev"], correct: 0 },
        { question: "Who wrote Frankenstein?", answers: ["Mary Shelley", "Bram Stoker", "Edgar Allan Poe", "H.P. Lovecraft"], correct: 0 },
        { question: "The Adventures of Huckleberry Finn was written by?", answers: ["Mark Twain", "Herman Melville", "Nathaniel Hawthorne", "Washington Irving"], correct: 0 },
        { question: "Who wrote Madame Bovary?", answers: ["Gustave Flaubert", "Émile Zola", "Victor Hugo", "Honoré de Balzac"], correct: 0 },
        { question: "The Aeneid was written by?", answers: ["Virgil", "Homer", "Ovid", "Horace"], correct: 0 },
        { question: "Who wrote The Picture of Dorian Gray?", answers: ["Oscar Wilde", "Bram Stoker", "Robert Louis Stevenson", "H.G. Wells"], correct: 0 },
        { question: "Anna Karenina was written by?", answers: ["Leo Tolstoy", "Fyodor Dostoevsky", "Anton Chekhov", "Ivan Turgenev"], correct: 0 },
        { question: "Who wrote The Catcher in the Rye?", answers: ["J.D. Salinger", "Jack Kerouac", "William S. Burroughs", "Allen Ginsberg"], correct: 0 },
        { question: "The Metamorphosis was written by?", answers: ["Franz Kafka", "Thomas Mann", "Hermann Hesse", "Stefan Zweig"], correct: 0 },
        { question: "Who wrote To Kill a Mockingbird?", answers: ["Harper Lee", "William Faulkner", "Tennessee Williams", "Truman Capote"], correct: 0 },
        { question: "One Hundred Years of Solitude was written by?", answers: ["Gabriel García Márquez", "Jorge Luis Borges", "Julio Cortázar", "Mario Vargas Llosa"], correct: 0 },
        { question: "Who wrote Heart of Darkness?", answers: ["Joseph Conrad", "Rudyard Kipling", "H.G. Wells", "Robert Louis Stevenson"], correct: 0 },
        { question: "The Lord of the Rings was written by?", answers: ["J.R.R. Tolkien", "C.S. Lewis", "J.K. Rowling", "George R.R. Martin"], correct: 0 }
    ],
    heritage: [
        { question: "The Taj Mahal is located in which Indian city?", answers: ["Agra", "Delhi", "Mumbai", "Jaipur"], correct: 0 },
        { question: "Machu Picchu is located in which country?", answers: ["Peru", "Bolivia", "Ecuador", "Colombia"], correct: 0 },
        { question: "The Great Wall of China spans approximately how many miles?", answers: ["13,000", "5,000", "8,000", "15,000"], correct: 0 },
        { question: "The Colosseum was built in which ancient city?", answers: ["Rome", "Athens", "Constantinople", "Alexandria"], correct: 0 },
        { question: "Petra is located in which modern-day country?", answers: ["Jordan", "Egypt", "Israel", "Saudi Arabia"], correct: 0 },
        { question: "The Acropolis is located in which Greek city?", answers: ["Athens", "Sparta", "Corinth", "Thebes"], correct: 0 },
        { question: "Angkor Wat is a temple complex in which country?", answers: ["Cambodia", "Thailand", "Vietnam", "Laos"], correct: 0 },
        { question: "The Alhambra is located in which Spanish city?", answers: ["Granada", "Seville", "Córdoba", "Toledo"], correct: 0 },
        { question: "Stonehenge is located in which country?", answers: ["England", "Scotland", "Ireland", "Wales"], correct: 0 },
        { question: "The Pyramids of Giza are located near which city?", answers: ["Cairo", "Alexandria", "Luxor", "Aswan"], correct: 0 },
        { question: "The Hagia Sophia is located in which city?", answers: ["Istanbul", "Ankara", "Izmir", "Bursa"], correct: 0 },
        { question: "The Forbidden City was the imperial palace of which dynasty?", answers: ["Ming and Qing", "Han", "Tang", "Song"], correct: 0 },
        { question: "Chichen Itza is located in which country?", answers: ["Mexico", "Guatemala", "Belize", "Honduras"], correct: 0 },
        { question: "The Parthenon was dedicated to which Greek goddess?", answers: ["Athena", "Hera", "Aphrodite", "Artemis"], correct: 0 },
        { question: "The Karnak Temple complex is located in which country?", answers: ["Egypt", "Sudan", "Libya", "Ethiopia"], correct: 0 },
        { question: "The Statue of Liberty was a gift from which country?", answers: ["France", "England", "Germany", "Italy"], correct: 0 },
        { question: "The Neuschwanstein Castle is located in which country?", answers: ["Germany", "Austria", "Switzerland", "France"], correct: 0 },
        { question: "The Dome of the Rock is located in which city?", answers: ["Jerusalem", "Mecca", "Medina", "Damascus"], correct: 0 },
        { question: "The Winter Palace is located in which Russian city?", answers: ["Saint Petersburg", "Moscow", "Kiev", "Warsaw"], correct: 0 },
        { question: "The Arc de Triomphe commemorates which event?", answers: ["Napoleonic victories", "French Revolution", "World War I", "World War II"], correct: 0 },
        { question: "The Sydney Opera House is located in which country?", answers: ["Australia", "New Zealand", "South Africa", "Canada"], correct: 0 },
        { question: "The Brandenburg Gate is located in which city?", answers: ["Berlin", "Munich", "Hamburg", "Frankfurt"], correct: 0 },
        { question: "The Tower of London was originally built as a?", answers: ["Fortress and palace", "Prison only", "Church", "Market"], correct: 0 },
        { question: "The Palace of Versailles was built by which French king?", answers: ["Louis XIV", "Louis XVI", "Louis XV", "Louis XIII"], correct: 0 },
        { question: "The Moai statues are found on which island?", answers: ["Easter Island", "Galapagos Islands", "Hawaii", "Madagascar"], correct: 0 },
        { question: "The Lincoln Memorial is located in which US city?", answers: ["Washington D.C.", "New York", "Philadelphia", "Boston"], correct: 0 },
        { question: "The Temple of Heaven is located in which Chinese city?", answers: ["Beijing", "Shanghai", "Xi'an", "Guangzhou"], correct: 0 },
        { question: "The Leaning Tower of Pisa is located in which Italian city?", answers: ["Pisa", "Rome", "Florence", "Venice"], correct: 0 },
        { question: "The Banaue Rice Terraces are located in which country?", answers: ["Philippines", "Vietnam", "Thailand", "Indonesia"], correct: 0 },
        { question: "The Karnak Temple was dedicated to which Egyptian god?", answers: ["Amun-Ra", "Ra", "Osiris", "Anubis"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Chill.mp3');
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
