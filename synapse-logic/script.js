// Music from Uppbeat: Kevin MacLeod - Eastern Thought | License code: XDB1NKHBSYZNRBLB

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

// Question Database (60+ puzzles per category = 240+ total)
const questions = {
  fastMath: [
    { question: "7 × 8 = ?", answers: ["54", "56", "58", "60"], correct: 1 },
    { question: "12 × 11 = ?", answers: ["121", "132", "143", "154"], correct: 1 },
    { question: "15 × 9 = ?", answers: ["125", "135", "145", "155"], correct: 1 },
    { question: "18 ÷ 3 = ?", answers: ["5", "6", "7", "8"], correct: 1 },
    { question: "144 ÷ 12 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "25 × 4 = ?", answers: ["90", "95", "100", "105"], correct: 2 },
    { question: "36 ÷ 6 = ?", answers: ["4", "5", "6", "7"], correct: 2 },
    { question: "9 × 13 = ?", answers: ["107", "117", "127", "137"], correct: 1 },
    { question: "48 ÷ 8 = ?", answers: ["5", "6", "7", "8"], correct: 1 },
    { question: "14 × 7 = ?", answers: ["88", "98", "108", "118"], correct: 1 },
    { question: "81 ÷ 9 = ?", answers: ["7", "8", "9", "10"], correct: 2 },
    { question: "23 × 3 = ?", answers: ["59", "69", "79", "89"], correct: 1 },
    { question: "64 ÷ 4 = ?", answers: ["14", "15", "16", "17"], correct: 2 },
    { question: "17 × 5 = ?", answers: ["75", "85", "95", "105"], correct: 1 },
    { question: "100 ÷ 5 = ?", answers: ["18", "19", "20", "21"], correct: 2 },
    { question: "11 × 11 = ?", answers: ["111", "121", "131", "141"], correct: 1 },
    { question: "72 ÷ 6 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "19 × 4 = ?", answers: ["66", "76", "86", "96"], correct: 1 },
    { question: "56 ÷ 7 = ?", answers: ["6", "7", "8", "9"], correct: 2 },
    { question: "13 × 8 = ?", answers: ["94", "104", "114", "124"], correct: 1 },
    { question: "45 ÷ 9 = ?", answers: ["4", "5", "6", "7"], correct: 1 },
    { question: "22 × 6 = ?", answers: ["122", "132", "142", "152"], correct: 1 },
    { question: "96 ÷ 8 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "16 × 7 = ?", answers: ["102", "112", "122", "132"], correct: 1 },
    { question: "63 ÷ 7 = ?", answers: ["7", "8", "9", "10"], correct: 2 },
    { question: "28 × 3 = ?", answers: ["74", "84", "94", "104"], correct: 1 },
    { question: "80 ÷ 4 = ?", answers: ["18", "19", "20", "21"], correct: 2 },
    { question: "15 × 8 = ?", answers: ["110", "120", "130", "140"], correct: 1 },
    { question: "54 ÷ 6 = ?", answers: ["7", "8", "9", "10"], correct: 2 },
    { question: "24 × 5 = ?", answers: ["110", "120", "130", "140"], correct: 1 },
    // Fast multiplication & division
    { question: "19 × 6 = ?", answers: ["104", "114", "124", "134"], correct: 1 },
    { question: "156 ÷ 12 = ?", answers: ["11", "12", "13", "14"], correct: 2 },
    { question: "14 × 14 = ?", answers: ["186", "196", "206", "216"], correct: 1 },
    { question: "225 ÷ 15 = ?", answers: ["13", "14", "15", "16"], correct: 2 },
    { question: "27 × 4 = ?", answers: ["98", "108", "118", "128"], correct: 1 },
    { question: "168 ÷ 14 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "23 × 7 = ?", answers: ["151", "161", "171", "181"], correct: 1 },
    { question: "192 ÷ 16 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "31 × 5 = ?", answers: ["145", "155", "165", "175"], correct: 1 },
    { question: "272 ÷ 17 = ?", answers: ["14", "15", "16", "17"], correct: 2 },
    { question: "18 × 11 = ?", answers: ["188", "198", "208", "218"], correct: 1 },
    { question: "252 ÷ 18 = ?", answers: ["12", "13", "14", "15"], correct: 2 },
    { question: "26 × 6 = ?", answers: ["146", "156", "166", "176"], correct: 1 },
    { question: "288 ÷ 24 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "34 × 3 = ?", answers: ["92", "102", "112", "122"], correct: 1 },
    { question: "306 ÷ 17 = ?", answers: ["16", "17", "18", "19"], correct: 2 },
    { question: "29 × 4 = ?", answers: ["106", "116", "126", "136"], correct: 1 },
    { question: "324 ÷ 18 = ?", answers: ["16", "17", "18", "19"], correct: 2 },
    { question: "37 × 5 = ?", answers: ["175", "185", "195", "205"], correct: 1 },
    { question: "364 ÷ 14 = ?", answers: ["24", "25", "26", "27"], correct: 2 },
    { question: "42 × 6 = ?", answers: ["242", "252", "262", "272"], correct: 1 },
    { question: "378 ÷ 21 = ?", answers: ["16", "17", "18", "19"], correct: 2 },
    { question: "48 × 7 = ?", answers: ["326", "336", "346", "356"], correct: 1 },
    { question: "432 ÷ 18 = ?", answers: ["22", "23", "24", "25"], correct: 2 },
    { question: "56 × 8 = ?", answers: ["438", "448", "458", "468"], correct: 1 },
    { question: "504 ÷ 21 = ?", answers: ["22", "23", "24", "25"], correct: 2 },
    // Percentage calculations
    { question: "20% of 80 = ?", answers: ["14", "16", "18", "20"], correct: 1 },
    { question: "50% of 240 = ?", answers: ["110", "120", "130", "140"], correct: 1 },
    { question: "25% of 160 = ?", answers: ["30", "40", "50", "60"], correct: 1 },
    { question: "10% of 450 = ?", answers: ["35", "40", "45", "50"], correct: 2 },
    { question: "75% of 200 = ?", answers: ["130", "140", "150", "160"], correct: 2 },
    { question: "30% of 90 = ?", answers: ["25", "27", "29", "31"], correct: 1 },
    { question: "15% of 120 = ?", answers: ["16", "18", "20", "22"], correct: 1 },
    { question: "40% of 250 = ?", answers: ["90", "100", "110", "120"], correct: 1 },
    { question: "60% of 150 = ?", answers: ["80", "90", "100", "110"], correct: 1 },
    { question: "80% of 75 = ?", answers: ["50", "55", "60", "65"], correct: 2 },
    // Squares & square roots
    { question: "13² = ?", answers: ["159", "169", "179", "189"], correct: 1 },
    { question: "√144 = ?", answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "√225 = ?", answers: ["13", "14", "15", "16"], correct: 2 },
    { question: "17² = ?", answers: ["279", "289", "299", "309"], correct: 1 },
    { question: "√256 = ?", answers: ["14", "15", "16", "17"], correct: 2 },
    { question: "19² = ?", answers: ["351", "361", "371", "381"], correct: 1 },
    { question: "√324 = ?", answers: ["16", "17", "18", "19"], correct: 2 },
    { question: "23² = ?", answers: ["519", "529", "539", "549"], correct: 1 },
    { question: "√400 = ?", answers: ["18", "19", "20", "21"], correct: 2 },
    { question: "25² = ?", answers: ["615", "625", "635", "645"], correct: 1 }
  ],
  sequenceLogic: [
    { question: "2, 4, 8, 16, ?", answers: ["24", "32", "40", "48"], correct: 1 },
    { question: "1, 4, 9, 16, ?", answers: ["20", "25", "30", "35"], correct: 1 },
    { question: "3, 6, 9, 12, ?", answers: ["14", "15", "16", "17"], correct: 1 },
    { question: "5, 10, 20, 40, ?", answers: ["60", "70", "80", "90"], correct: 2 },
    { question: "1, 1, 2, 3, 5, ?", answers: ["7", "8", "9", "10"], correct: 1 },
    { question: "2, 6, 18, 54, ?", answers: ["108", "162", "216", "324"], correct: 1 },
    { question: "10, 9, 8, 7, ?", answers: ["5", "6", "7", "8"], correct: 1 },
    { question: "1, 3, 6, 10, ?", answers: ["12", "14", "15", "16"], correct: 2 },
    { question: "4, 8, 12, 16, ?", answers: ["18", "20", "22", "24"], correct: 1 },
    { question: "2, 5, 10, 17, ?", answers: ["24", "26", "28", "30"], correct: 1 },
    { question: "1, 8, 27, 64, ?", answers: ["100", "125", "150", "175"], correct: 1 },
    { question: "3, 12, 48, 192, ?", answers: ["384", "576", "768", "960"], correct: 2 },
    { question: "100, 90, 80, 70, ?", answers: ["50", "55", "60", "65"], correct: 2 },
    { question: "1, 2, 4, 7, 11, ?", answers: ["14", "15", "16", "17"], correct: 2 },
    { question: "2, 4, 16, 256, ?", answers: ["4096", "8192", "16384", "32768"], correct: 2 },
    { question: "6, 11, 16, 21, ?", answers: ["24", "25", "26", "27"], correct: 2 },
    { question: "1, 5, 25, 125, ?", answers: ["500", "625", "750", "875"], correct: 1 },
    { question: "12, 24, 36, 48, ?", answers: ["54", "56", "58", "60"], correct: 3 },
    { question: "2, 3, 5, 8, 13, ?", answers: ["18", "19", "20", "21"], correct: 3 },
    { question: "4, 9, 16, 25, ?", answers: ["30", "32", "34", "36"], correct: 3 },
    { question: "1, 4, 7, 10, ?", answers: ["11", "12", "13", "14"], correct: 2 },
    { question: "8, 4, 2, 1, ?", answers: ["0.25", "0.5", "0.75", "1"], correct: 1 },
    { question: "3, 9, 27, 81, ?", answers: ["162", "243", "324", "405"], correct: 1 },
    { question: "5, 25, 125, 625, ?", answers: ["1250", "2500", "3125", "3750"], correct: 2 },
    { question: "2, 7, 12, 17, ?", answers: ["20", "21", "22", "23"], correct: 2 },
    { question: "1, 10, 100, 1000, ?", answers: ["5000", "10000", "15000", "20000"], correct: 1 },
    { question: "6, 18, 54, 162, ?", answers: ["324", "486", "648", "810"], correct: 1 },
    { question: "4, 7, 10, 13, ?", answers: ["14", "15", "16", "17"], correct: 2 },
    { question: "2, 8, 32, 128, ?", answers: ["256", "512", "768", "1024"], correct: 1 },
    { question: "9, 18, 27, 36, ?", answers: ["40", "42", "44", "45"], correct: 3 },
    // Geometric sequences
    { question: "3, 9, 27, 81, ?", answers: ["162", "243", "324", "405"], correct: 1 },
    { question: "5, 15, 45, 135, ?", answers: ["270", "405", "540", "675"], correct: 1 },
    { question: "4, 12, 36, 108, ?", answers: ["216", "324", "432", "540"], correct: 1 },
    { question: "2, 6, 18, 54, ?", answers: ["108", "162", "216", "324"], correct: 1 },
    { question: "7, 21, 63, 189, ?", answers: ["378", "567", "756", "945"], correct: 1 },
    // Alternating step additions (+2, -1, +2, -1)
    { question: "1, 3, 2, 4, 3, ?", answers: ["4", "5", "6", "7"], correct: 1 },
    { question: "5, 7, 6, 8, 7, ?", answers: ["8", "9", "10", "11"], correct: 1 },
    { question: "10, 12, 11, 13, 12, ?", answers: ["13", "14", "15", "16"], correct: 1 },
    { question: "2, 4, 3, 5, 4, ?", answers: ["5", "6", "7", "8"], correct: 1 },
    { question: "8, 10, 9, 11, 10, ?", answers: ["11", "12", "13", "14"], correct: 1 },
    // Fibonacci variations
    { question: "2, 2, 4, 6, 10, ?", answers: ["14", "16", "18", "20"], correct: 1 },
    { question: "3, 3, 6, 9, 15, ?", answers: ["21", "24", "27", "30"], correct: 1 },
    { question: "4, 4, 8, 12, 20, ?", answers: ["28", "32", "36", "40"], correct: 1 },
    { question: "5, 5, 10, 15, 25, ?", answers: ["35", "40", "45", "50"], correct: 1 },
    { question: "1, 2, 3, 5, 8, ?", answers: ["11", "12", "13", "14"], correct: 2 },
    // Prime number progressions
    { question: "2, 3, 5, 7, ?", answers: ["9", "11", "13", "15"], correct: 1 },
    { question: "3, 5, 7, 11, ?", answers: ["13", "15", "17", "19"], correct: 0 },
    { question: "5, 7, 11, 13, ?", answers: ["15", "17", "19", "21"], correct: 1 },
    { question: "7, 11, 13, 17, ?", answers: ["19", "21", "23", "25"], correct: 0 },
    { question: "11, 13, 17, 19, ?", answers: ["21", "23", "25", "27"], correct: 1 },
    // Squared step patterns (+1, +4, +9, +16)
    { question: "1, 2, 6, 15, ?", answers: ["28", "31", "34", "37"], correct: 1 },
    { question: "2, 3, 7, 16, ?", answers: ["29", "32", "35", "38"], correct: 1 },
    { question: "3, 4, 8, 17, ?", answers: ["30", "33", "36", "39"], correct: 1 },
    { question: "4, 5, 9, 18, ?", answers: ["31", "34", "37", "40"], correct: 1 },
    { question: "5, 6, 10, 19, ?", answers: ["32", "35", "38", "41"], correct: 1 },
    // Mixed patterns
    { question: "1, 4, 2, 5, 3, ?", answers: ["4", "5", "6", "7"], correct: 2 },
    { question: "10, 20, 15, 30, 25, ?", answers: ["40", "45", "50", "55"], correct: 2 },
    { question: "2, 6, 4, 12, 8, ?", answers: ["16", "20", "24", "28"], correct: 2 },
    { question: "3, 9, 6, 18, 15, ?", answers: ["30", "33", "36", "39"], correct: 2 },
    { question: "5, 15, 10, 30, 20, ?", answers: ["40", "50", "60", "70"], correct: 2 },
    // Advanced sequences
    { question: "1, 2, 6, 24, ?", answers: ["96", "120", "144", "168"], correct: 1 },
    { question: "2, 3, 12, 21, ?", answers: ["42", "48", "54", "60"], correct: 1 },
    { question: "3, 4, 20, 21, ?", answers: ["42", "63", "84", "105"], correct: 1 },
    { question: "4, 5, 30, 31, ?", answers: ["62", "93", "124", "155"], correct: 1 },
    { question: "5, 6, 42, 43, ?", answers: ["86", "129", "172", "215"], correct: 1 }
  ],
  equationBalance: [
    { question: "5 + 3 ? 8", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "12 - 4 ? 6", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "3 × 4 ? 10", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "20 ÷ 4 ? 5", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "7 + 8 ? 15", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "9 × 2 ? 18", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "25 - 10 ? 10", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "16 ÷ 2 ? 9", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "6 + 6 ? 11", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "8 × 3 ? 25", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "30 - 15 ? 12", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "36 ÷ 6 ? 7", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "11 + 9 ? 20", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 5 ? 24", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "40 - 20 ? 15", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "49 ÷ 7 ? 8", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "14 + 6 ? 19", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "4 × 9 ? 35", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "50 - 25 ? 22", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "64 ÷ 8 ? 9", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "13 + 7 ? 21", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "6 × 7 ? 40", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "60 - 30 ? 28", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "81 ÷ 9 ? 10", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "15 + 5 ? 22", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "7 × 6 ? 45", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "70 - 35 ? 32", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "100 ÷ 10 ? 11", answers: ["<", ">", "=", "≠"], correct: 0 },
    { question: "18 + 2 ? 19", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "8 × 8 ? 62", answers: ["<", ">", "=", "≠"], correct: 1 },
    // Missing operator puzzles
    { question: "12 [?] 4 = 48", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "20 [?] 5 = 4", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "15 [?] 3 = 18", answers: ["+", "-", "×", "÷"], correct: 0 },
    { question: "24 [?] 6 = 4", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "7 [?] 8 = 56", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "36 [?] 6 = 6", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "9 [?] 9 = 81", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "45 [?] 5 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "11 [?] 7 = 4", answers: ["+", "-", "×", "÷"], correct: 1 },
    { question: "32 [?] 4 = 8", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "14 [?] 2 = 28", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "27 [?] 3 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "6 [?] 12 = 72", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "42 [?] 7 = 6", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "8 [?] 5 = 40", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "54 [?] 9 = 6", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "13 [?] 7 = 91", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "63 [?] 7 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "16 [?] 4 = 4", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "5 [?] 15 = 75", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "72 [?] 8 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "18 [?] 2 = 36", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "81 [?] 9 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "4 [?] 16 = 64", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "48 [?] 6 = 8", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "12 [?] 12 = 144", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "90 [?] 10 = 9", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "17 [?] 3 = 51", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "56 [?] 8 = 7", answers: ["+", "-", "×", "÷"], correct: 3 },
    { question: "9 [?] 11 = 99", answers: ["+", "-", "×", "÷"], correct: 2 },
    { question: "64 [?] 4 = 16", answers: ["+", "-", "×", "÷"], correct: 3 },
    // Side-by-side comparison equations
    { question: "3 × 8 ? 5 × 5", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "4 × 6 ? 3 × 8", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "7 × 7 ? 6 × 8", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "9 × 4 ? 6 × 6", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 9 ? 3 × 15", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "8 × 8 ? 7 × 9", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "6 × 7 ? 4 × 10", answers: ["<", ">", "=", "≠"], correct: 1 },
    { question: "12 × 3 ? 4 × 9", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 12 ? 6 × 10", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "8 × 5 ? 4 × 10", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "7 × 6 ? 3 × 14", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "9 × 5 ? 3 × 15", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "11 × 4 ? 2 × 22", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "6 × 8 ? 4 × 12", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "10 × 7 ? 5 × 14", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "8 × 9 ? 6 × 12", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 16 ? 8 × 10", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "7 × 9 ? 3 × 21", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "12 × 6 ? 8 × 9", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "4 × 15 ? 6 × 10", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "9 × 7 ? 3 × 21", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "8 × 11 ? 4 × 22", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "6 × 13 ? 3 × 26", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 18 ? 6 × 15", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "7 × 12 ? 4 × 21", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "10 × 9 ? 6 × 15", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "8 × 13 ? 4 × 26", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "9 × 11 ? 3 × 33", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "6 × 14 ? 7 × 12", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "5 × 20 ? 4 × 25", answers: ["<", ">", "=", "≠"], correct: 2 },
    { question: "12 × 8 ? 6 × 16", answers: ["<", ">", "=", "≠"], correct: 2 }
  ],
  memoryMatrix: [
    { question: "Remember: 7, 3, 9, 1. What was the 2nd number?", answers: ["7", "3", "9", "1"], correct: 1 },
    { question: "Remember: 5, 8, 2, 6. What was the 3rd number?", answers: ["5", "8", "2", "6"], correct: 2 },
    { question: "Remember: 4, 1, 7, 3. What was the 1st number?", answers: ["4", "1", "7", "3"], correct: 0 },
    { question: "Remember: 9, 2, 5, 8. What was the 4th number?", answers: ["9", "2", "5", "8"], correct: 3 },
    { question: "Remember: 6, 4, 8, 1. What was the 2nd number?", answers: ["6", "4", "8", "1"], correct: 1 },
    { question: "Remember: 3, 7, 2, 9. What was the 3rd number?", answers: ["3", "7", "2", "9"], correct: 2 },
    { question: "Remember: 1, 5, 9, 4. What was the 1st number?", answers: ["1", "5", "9", "4"], correct: 0 },
    { question: "Remember: 8, 3, 6, 2. What was the 4th number?", answers: ["8", "3", "6", "2"], correct: 3 },
    { question: "Remember: 2, 9, 4, 7. What was the 2nd number?", answers: ["2", "9", "4", "7"], correct: 1 },
    { question: "Remember: 5, 1, 8, 3. What was the 3rd number?", answers: ["5", "1", "8", "3"], correct: 2 },
    { question: "Remember: 7, 4, 1, 6. What was the 1st number?", answers: ["7", "4", "1", "6"], correct: 0 },
    { question: "Remember: 9, 6, 3, 8. What was the 4th number?", answers: ["9", "6", "3", "8"], correct: 3 },
    { question: "Remember: 4, 8, 2, 5. What was the 2nd number?", answers: ["4", "8", "2", "5"], correct: 1 },
    { question: "Remember: 1, 7, 5, 9. What was the 3rd number?", answers: ["1", "7", "5", "9"], correct: 2 },
    { question: "Remember: 6, 2, 9, 4. What was the 1st number?", answers: ["6", "2", "9", "4"], correct: 0 },
    { question: "Remember: 3, 5, 8, 1. What was the 4th number?", answers: ["3", "5", "8", "1"], correct: 3 },
    { question: "Remember: 8, 1, 4, 7. What was the 2nd number?", answers: ["8", "1", "4", "7"], correct: 1 },
    { question: "Remember: 2, 6, 9, 3. What was the 3rd number?", answers: ["2", "6", "9", "3"], correct: 2 },
    { question: "Remember: 5, 9, 1, 8. What was the 1st number?", answers: ["5", "9", "1", "8"], correct: 0 },
    { question: "Remember: 7, 3, 6, 2. What was the 4th number?", answers: ["7", "3", "6", "2"], correct: 3 },
    { question: "Remember: 1, 4, 8, 5. What was the 2nd number?", answers: ["1", "4", "8", "5"], correct: 1 },
    { question: "Remember: 9, 2, 5, 7. What was the 3rd number?", answers: ["9", "2", "5", "7"], correct: 2 },
    { question: "Remember: 4, 7, 3, 9. What was the 1st number?", answers: ["4", "7", "3", "9"], correct: 0 },
    { question: "Remember: 6, 8, 1, 4. What was the 4th number?", answers: ["6", "8", "1", "4"], correct: 3 },
    { question: "Remember: 3, 9, 4, 2. What was the 2nd number?", answers: ["3", "9", "4", "2"], correct: 1 },
    { question: "Remember: 8, 5, 2, 6. What was the 3rd number?", answers: ["8", "5", "2", "6"], correct: 2 },
    { question: "Remember: 2, 1, 7, 9. What was the 1st number?", answers: ["2", "1", "7", "9"], correct: 0 },
    { question: "Remember: 5, 3, 8, 4. What was the 4th number?", answers: ["5", "3", "8", "4"], correct: 3 },
    { question: "Remember: 9, 4, 6, 1. What was the 2nd number?", answers: ["9", "4", "6", "1"], correct: 1 },
    { question: "Remember: 7, 2, 5, 8. What was the 3rd number?", answers: ["7", "2", "5", "8"], correct: 2 },
    // 5-number sequences
    { question: "Remember: 3, 7, 2, 9, 5. What was the 2nd number?", answers: ["3", "7", "2", "9"], correct: 1 },
    { question: "Remember: 8, 1, 6, 4, 3. What was the 4th number?", answers: ["8", "1", "6", "4"], correct: 3 },
    { question: "Remember: 5, 9, 2, 7, 1. What was the 3rd number?", answers: ["5", "9", "2", "7"], correct: 2 },
    { question: "Remember: 4, 6, 8, 3, 2. What was the 1st number?", answers: ["4", "6", "8", "3"], correct: 0 },
    { question: "Remember: 7, 1, 5, 9, 4. What was the 5th number?", answers: ["7", "1", "5", "9"], correct: 3 },
    { question: "Remember: 2, 8, 3, 6, 1. What was the 2nd number?", answers: ["2", "8", "3", "6"], correct: 1 },
    { question: "Remember: 9, 4, 7, 2, 5. What was the 4th number?", answers: ["9", "4", "7", "2"], correct: 3 },
    { question: "Remember: 6, 3, 1, 8, 4. What was the 3rd number?", answers: ["6", "3", "1", "8"], correct: 2 },
    { question: "Remember: 1, 5, 9, 2, 7. What was the 1st number?", answers: ["1", "5", "9", "2"], correct: 0 },
    { question: "Remember: 8, 2, 4, 6, 3. What was the 5th number?", answers: ["8", "2", "4", "6"], correct: 3 },
    // Highest/Lowest number queries
    { question: "Remember: 7, 3, 9, 1. What was the HIGHEST number?", answers: ["7", "3", "9", "1"], correct: 2 },
    { question: "Remember: 5, 8, 2, 6. What was the LOWEST number?", answers: ["5", "8", "2", "6"], correct: 2 },
    { question: "Remember: 4, 1, 7, 3. What was the HIGHEST number?", answers: ["4", "1", "7", "3"], correct: 2 },
    { question: "Remember: 9, 2, 5, 8. What was the LOWEST number?", answers: ["9", "2", "5", "8"], correct: 1 },
    { question: "Remember: 6, 4, 8, 1. What was the HIGHEST number?", answers: ["6", "4", "8", "1"], correct: 2 },
    { question: "Remember: 3, 7, 2, 9. What was the LOWEST number?", answers: ["3", "7", "2", "9"], correct: 2 },
    { question: "Remember: 1, 5, 9, 4. What was the HIGHEST number?", answers: ["1", "5", "9", "4"], correct: 2 },
    { question: "Remember: 8, 3, 6, 2. What was the LOWEST number?", answers: ["8", "3", "6", "2"], correct: 3 },
    { question: "Remember: 2, 9, 4, 7. What was the HIGHEST number?", answers: ["2", "9", "4", "7"], correct: 1 },
    { question: "Remember: 5, 1, 8, 3. What was the LOWEST number?", answers: ["5", "1", "8", "3"], correct: 1 },
    // Last number queries
    { question: "Remember: 7, 3, 9, 1. What was the LAST number?", answers: ["7", "3", "9", "1"], correct: 3 },
    { question: "Remember: 5, 8, 2, 6. What was the LAST number?", answers: ["5", "8", "2", "6"], correct: 3 },
    { question: "Remember: 4, 1, 7, 3. What was the LAST number?", answers: ["4", "1", "7", "3"], correct: 3 },
    { question: "Remember: 9, 2, 5, 8. What was the LAST number?", answers: ["9", "2", "5", "8"], correct: 3 },
    { question: "Remember: 6, 4, 8, 1. What was the LAST number?", answers: ["6", "4", "8", "1"], correct: 3 },
    { question: "Remember: 3, 7, 2, 9. What was the LAST number?", answers: ["3", "7", "2", "9"], correct: 3 },
    { question: "Remember: 1, 5, 9, 4. What was the LAST number?", answers: ["1", "5", "9", "4"], correct: 3 },
    { question: "Remember: 8, 3, 6, 2. What was the LAST number?", answers: ["8", "3", "6", "2"], correct: 3 },
    { question: "Remember: 2, 9, 4, 7. What was the LAST number?", answers: ["2", "9", "4", "7"], correct: 3 },
    { question: "Remember: 5, 1, 8, 3. What was the LAST number?", answers: ["5", "1", "8", "3"], correct: 3 },
    // 6-number sequences with diverse queries
    { question: "Remember: 3, 7, 2, 9, 5, 1. What was the 3rd number?", answers: ["3", "7", "2", "9"], correct: 2 },
    { question: "Remember: 8, 4, 6, 2, 9, 3. What was the 5th number?", answers: ["8", "4", "6", "2"], correct: 3 },
    { question: "Remember: 5, 1, 8, 3, 7, 4. What was the HIGHEST number?", answers: ["5", "1", "8", "3"], correct: 2 },
    { question: "Remember: 9, 2, 6, 4, 1, 7. What was the LOWEST number?", answers: ["9", "2", "6", "4"], correct: 3 },
    { question: "Remember: 4, 8, 3, 6, 2, 5. What was the LAST number?", answers: ["4", "8", "3", "6"], correct: 3 },
    { question: "Remember: 7, 1, 5, 9, 4, 2. What was the 2nd number?", answers: ["7", "1", "5", "9"], correct: 1 },
    { question: "Remember: 2, 6, 9, 3, 8, 1. What was the 4th number?", answers: ["2", "6", "9", "3"], correct: 3 },
    { question: "Remember: 3, 5, 8, 2, 7, 4. What was the HIGHEST number?", answers: ["3", "5", "8", "2"], correct: 2 },
    { question: "Remember: 6, 9, 1, 4, 7, 3. What was the LOWEST number?", answers: ["6", "9", "1", "4"], correct: 2 },
    { question: "Remember: 8, 2, 5, 7, 1, 6. What was the LAST number?", answers: ["8", "2", "5", "7"], correct: 3 }
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
    backgroundMusic = new Audio('https://incompetech.com/music/royalty-free/mp3-royaltyfree/Eastern%20Thought.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
  }
}

// Toggle Music
function toggleMusic() {
  isMuted = !isMuted;
  localStorage.setItem('synapseLogic_muted', isMuted);
  
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
    return parseInt(localStorage.getItem(`synapseLogic_highScore_${category}`)) || 0;
  }
  return parseInt(localStorage.getItem('synapseLogic_highScore_overall')) || 0;
}

// Save High Score
function saveHighScore(score, category = null) {
  if (category) {
    const currentHigh = loadHighScore(category);
    if (score > currentHigh) {
      localStorage.setItem(`synapseLogic_highScore_${category}`, score);
    }
  }
  const currentOverall = loadHighScore();
  if (score > currentOverall) {
    localStorage.setItem('synapseLogic_highScore_overall', score);
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
    timerBar.style.background = 'linear-gradient(90deg, #00f3ff, #ff00ff)';
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
  await gameI18n.init('synapse-logic');
  
  // Load mute state
  isMuted = localStorage.getItem('synapseLogic_muted') === 'true';
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
