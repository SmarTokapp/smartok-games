// Music: "The Sky of our Ancestors" by Kevin MacLeod (incompetech.com) - Licensed under CC BY 4.0

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

// Shuffle Bag System - Track available question indices for each category
let availableQuestions = {
  "worldFacts": [],
  "scienceMyths": [],
  "humanBody": [],
  "historyLore": []
};

// Question Database (60 questions per category = 240 total)
const questions = {
  worldFacts: [
    { question: "The Great Wall of China is visible from space with the naked eye.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Australia is both a country and a continent.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Sahara Desert is the largest desert in the world.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Antarctica is the coldest continent on Earth.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Nile River is the longest river in the world.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Mount Everest is the tallest mountain above sea level.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Pacific Ocean is the largest ocean on Earth.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Greenland is the world's largest island.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Amazon Rainforest produces 20% of the world's oxygen.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Dead Sea is the lowest point on Earth's land surface.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Vatican City is the smallest country in the world.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Russia has the most time zones of any country.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The equator passes through Brazil.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Japan consists of over 6,000 islands.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Grand Canyon is in Colorado.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Eiffel Tower was built for the 1889 World's Fair.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Statue of Liberty was a gift from France.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Colosseum is in Rome, Italy.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Taj Mahal was built as a tomb.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Machu Picchu is in Peru.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Great Barrier Reef is off the coast of Australia.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Aurora Borealis is also known as the Northern Lights.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Bermuda Triangle is officially recognized as a dangerous area.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Amazon River flows through Brazil.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Himalayas are the youngest mountain range.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Mariana Trench is the deepest part of the ocean.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Arctic Ocean is the smallest ocean.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Panama Canal connects the Atlantic and Pacific Oceans.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Suez Canal connects the Mediterranean Sea and the Red Sea.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The International Date Line is a straight line.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Antarctic Desert is the largest desert in the world.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Amazon River is the second longest river in the world.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Canada has the most lakes in the world.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Atacama Desert is the driest non-polar desert.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Lake Baikal is the world's deepest lake.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Caspian Sea is the largest inland body of water.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Mount Kilimanjaro is the highest mountain in Africa.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Andes is the longest mountain range.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Ganges River is considered sacred in Hinduism.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Mississippi River flows through 10 US states.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Angel Falls is the highest waterfall in the world.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Danube River flows through more countries than any other river.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Sahara is the largest hot desert in the world.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Nile flows north into the Mediterranean Sea.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Mount Fuji is an active volcano.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Great Barrier Reef is visible from space.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Philippines consists of over 7,000 islands.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The English Channel separates England from France.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Ural Mountains separate Europe from Asia.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Ring of Fire is a major area of volcanic activity.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Yellowstone Caldera is a supervolcano.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Matterhorn is on the border of Switzerland and Italy.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Victoria Falls is on the Zambezi River.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Maldives is the lowest country in the world.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Red Sea is between Africa and Asia.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Black Sea is connected to the Mediterranean.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Bering Strait separates Alaska from Russia.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Strait of Gibraltar connects the Atlantic to the Mediterranean.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Cape of Good Hope is at the southern tip of Africa.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Isthmus of Panama connects North and South America.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Gulf of Mexico is part of the Atlantic Ocean.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Bay of Bengal is the largest bay in the world.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Hudson Bay is in Canada.", answers: ["TRUE", "FALSE"], correct: 0 }
  ],
  scienceMyths: [
    { question: "Humans use only 10% of their brains.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Water boils at 100 degrees Celsius at sea level.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The sun is a star.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Light travels faster than sound.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Earth is flat.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Gravity is the same everywhere on Earth.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The moon has its own light source.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Diamonds are made from compressed coal.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Lightning never strikes the same place twice.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Great Wall of China is visible from the Moon.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Goldfish have a 3-second memory.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Bulls hate the color red.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Hair and fingernails continue to grow after death.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "We have five senses.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Shaving hair makes it grow back thicker.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Cracking your knuckles causes arthritis.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Eating carrots improves night vision.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Coffee stunts your growth.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The sun is Yellow.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Seasons are caused by Earth's distance from the sun.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "There is no gravity in space.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "A penny dropped from the Empire State Building can kill you.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Toilets flush in opposite directions in different hemispheres.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Alcohol warms you up.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Vikings wore horned helmets.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Napoleon was short.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Einstein failed math.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Sugar makes kids hyperactive.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "You lose most body heat through your head.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Dogs sweat by panting.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Coriolis effect determines toilet flush direction.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Water conducts electricity.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The moon has a dark side.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Earth is closer to the sun in summer.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Oxygen is flammable.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Sahara is the world's largest desert.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Chameleons change color to match their surroundings.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Touching a toad gives you warts.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Penguins tip over watching airplanes.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Bats are blind.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Ostriches bury their heads in sand.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Lemmings commit mass suicide.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans evolved from monkeys.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The tongue map is real.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Swallowed gum stays in your stomach for 7 years.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "MSG causes headaches.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Microwaves cook from the inside out.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Different alcohols cause different hangovers.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "You should wait an hour after eating before swimming.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Carrots improve vision.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The five-second rule is valid.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Cracking joints causes arthritis.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Reading in dim light damages eyes.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Coffee is dehydrating.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Detox diets remove toxins.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Starvation mode slows metabolism significantly.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Muscle turns to fat when you stop exercising.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Spot reduction is possible.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "You need 8 glasses of water daily.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Night air makes you sick.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Vitamin C prevents colds.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Feed a cold, starve a fever.", answers: ["TRUE", "FALSE"], correct: 1 }
  ],
  humanBody: [
    { question: "The human heart has four chambers.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Adults have 206 bones.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human brain weighs about 3 pounds.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans have 23 pairs of chromosomes.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The liver is the largest internal organ.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Blood is blue inside the body.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans have five senses.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The tongue is the strongest muscle in the body.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Fingernails grow faster than toenails.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans are born with all their eggs.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human eye can distinguish about 10 million colors.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body is made mostly of water.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Babies have more bones than adults.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human nose can distinguish over 1 trillion scents.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human stomach can digest metal.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans share about 50% of their DNA with bananas.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human body produces about 1 liter of saliva daily.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human heart beats about 100,000 times per day.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans blink about 15-20 times per minute.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human skin is the largest organ.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans have unique fingerprints.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has about 600 muscles.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Blood takes about 20 seconds to circulate the body.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human brain uses 20% of the body's energy.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans grow fastest during puberty.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has about 5 liters of blood.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans can survive without food longer than without water.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body temperature is 98.6°F.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans have about 10,000 taste buds.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human skeleton renews itself every 10 years.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The left lung is smaller than the right lung.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body contains enough carbon to make 900 pencils.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The small intestine is about 20 feet long.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans shed about 50 pounds of skin in a lifetime.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human brain contains 86 billion neurons.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Blood is red in both arteries and veins.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The strongest bone in the human body is the femur.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans have 32 teeth as adults.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The cornea is the only part of the body with no blood supply.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body produces about 1.5 liters of urine daily.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The thighbone is stronger than concrete.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans breathe about 20,000 times per day.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human body has 12 pairs of ribs.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The stomach lining regenerates every 3 days.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Humans share 60% of their DNA with fruit flies.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human heart pumps about 2,000 gallons of blood daily.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The liver can regenerate itself completely.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Humans have about 100,000 hairs on their head.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human body has 206 bones at birth.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The appendix has no function.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The brain feels pain.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Hair grows from the root, not the tip.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has 5 senses.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The average human lifespan is 100 years.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The tongue print is unique like fingerprints.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has 78 organs.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The bladder can hold about 16 ounces of urine.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body produces about 1 quart of sweat daily.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The human eye can see about 10 million colors.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has 33 vertebrae.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The skin accounts for 15% of body weight.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has 2 kidneys.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The pancreas produces insulin.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The human body has 12 cranial nerves.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The spleen filters blood.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The gallbladder stores bile.", answers: ["TRUE", "FALSE"], correct: 1 }
  ],
  historyLore: [
    { question: "Cleopatra was Egyptian.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The pyramids were built by slaves.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Titanic sank on its maiden voyage.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "World War II ended in 1945.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Berlin Wall fell in 1989.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Declaration of Independence was signed in 1776.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Wright brothers invented the airplane.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "Christopher Columbus discovered America.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Roman Empire fell in 476 AD.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Renaissance began in Italy.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The French Revolution started in 1789.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Civil War was fought over slavery.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Magna Carta was signed in 1215.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Black Death killed about 75 million people.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Industrial Revolution began in Britain.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Great Depression started in 1929.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Vietnam War ended in 1975.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Cold War was between the US and USSR.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Space Race began in the 1950s.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The internet was invented in the 1960s.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The first moon landing was in 1969.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The fall of the Roman Empire was caused by barbarian invasions.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Trojan Horse is a historical fact.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Hanging Gardens of Babylon existed.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Library of Alexandria was destroyed by fire.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Mayans predicted the world would end in 2012.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Knights Templar were real.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Salem witch trials happened in Massachusetts.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Boston Tea Party was in 1773.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Louisiana Purchase doubled the size of the US.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Julius Caesar was assassinated in 44 BC.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The American Civil War ended in 1865.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The French Revolution ended the monarchy.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Spanish Armada was defeated in 1588.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Battle of Waterloo was in 1815.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Russian Revolution was in 1917.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Berlin Wall was built in 1961.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The first World War began in 1914.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Pearl Harbor attack was in 1941.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The D-Day invasion was in 1944.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Hiroshima bombing was in 1945.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Cuban Missile Crisis was in 1962.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The fall of Constantinople was in 1453.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Mongol Empire was the largest contiguous empire.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "Alexander the Great conquered Egypt.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The ancient Olympics began in Greece.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Great Fire of London was in 1666.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The French Revolution led to Napoleon's rise.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Declaration of Independence was signed on July 4.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Gettysburg Address was in 1863.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Emancipation Proclamation freed all slaves.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Battle of Hastings was in 1066.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Magna Carta established the principle of limited government.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Spanish Inquisition began in 1478.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Gutenberg Bible was printed in 1455.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Renaissance was a rebirth of classical learning.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Enlightenment emphasized reason and science.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Industrial Revolution began with textile manufacturing.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Bolshevik Revolution led to the Soviet Union.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Treaty of Versailles ended World War I.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The League of Nations was formed after WWI.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The United Nations was founded in 1945.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Iron Curtain divided Europe during the Cold War.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Berlin Wall divided East and West Berlin.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Apollo 11 mission landed on the moon.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The Space Shuttle program began in 1981.", answers: ["TRUE", "FALSE"], correct: 0 },
    { question: "The Chernobyl disaster was in 1986.", answers: ["TRUE", "FALSE"], correct: 1 },
    { question: "The fall of the Soviet Union was in 1991.", answers: ["TRUE", "FALSE"], correct: 0 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/The%20Sky%20of%20our%20Ancestors.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('novaMind_muted', isMuted);
  
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

// Shuffle Bag System - Refill and shuffle category indices
function refillAndShuffleCategory(category) {
  const totalQuestions = questions[category].length;
  const indices = Array.from({ length: totalQuestions }, (_, i) => i);
  availableQuestions[category] = shuffleArray(indices);
}

// Get Next Question using Shuffle Bag
function getNextQuestion() {
  const category = gameState.currentCategory;
  
  // Refill if empty
  if (availableQuestions[category].length === 0) {
    refillAndShuffleCategory(category);
  }
  
  // Pop the next index
  const nextIndex = availableQuestions[category].pop();
  return questions[category][nextIndex];
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
    return parseInt(localStorage.getItem(`novaMind_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('novaMind_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`novaMind_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('novaMind_highScore_overall', score);
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
  
  if (gameState.timeLeft <= 3) {
    timerEl.parentElement.classList.add('warning');
  } else {
    timerEl.parentElement.classList.remove('warning');
  }
}

// Start Timer
function startTimer() {
  gameState.timeLeft = 10;
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
  
  // Create True button
  const trueBtn = document.createElement('button');
  trueBtn.className = 'answer-btn btn-true';
  trueBtn.textContent = 'TRUE';
  trueBtn.onclick = () => handleAnswer(0, trueBtn);
  answerOptions.appendChild(trueBtn);
  
  // Create False button
  const falseBtn = document.createElement('button');
  falseBtn.className = 'answer-btn btn-false';
  falseBtn.textContent = 'FALSE';
  falseBtn.onclick = () => handleAnswer(1, falseBtn);
  answerOptions.appendChild(falseBtn);
  
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
  
  // Initialize shuffle bag for this category
  refillAndShuffleCategory(category);
  
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
  await gameI18n.init('nova-mind');
  
  // Load mute state
  isMuted = localStorage.getItem('novaMind_muted') === 'true';
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
