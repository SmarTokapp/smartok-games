// Music from Uppbeat: Kevin MacLeod - Backbay Lounge | License code: LXSA3RGOTFZRSV8Y

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
  correctAnswers: 0,
  isMuted: false
};

// Audio Context
let audioContext = null;

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

// Question Database (60+ puzzles per category = 240+ total)
const questions = {
  anagrams: [
    { question: "N E O N", answers: ["NONE", "NEON", "NOEN", "NENO"], correct: 1 },
    { question: "B R A I N", answers: ["BRAIN", "BRIAN", "BRINA", "BIRAN"], correct: 0 },
    { question: "S P A R K", answers: ["SPRAK", "SPARK", "SAPRK", "SRPAK"], correct: 1 },
    { question: "C Y B E R", answers: ["CYBER", "CBEYR", "CYBRE", "CBERY"], correct: 0 },
    { question: "L E X I C", answers: ["LEXIC", "LXEIC", "LEIXC", "LCEIX"], correct: 0 },
    { question: "M I N D", answers: ["MIND", "MNID", "MIDN", "MDIN"], correct: 0 },
    { question: "N E U R O", answers: ["NEURO", "NERUO", "NEOUR", "NEORU"], correct: 0 },
    { question: "S Y N A P", answers: ["SYNAP", "SNYAP", "SYNPA", "SYPNA"], correct: 0 },
    { question: "L O G I C", answers: ["LOGIC", "LGOIC", "LOIGC", "LOCGI"], correct: 0 },
    { question: "Q U I Z", answers: ["QUIZ", "QIUZ", "QUZI", "QZUI"], correct: 0 },
    { question: "P U Z Z L", answers: ["PUZZL", "PZUZL", "PUZLZ", "PZLZU"], correct: 0 },
    { question: "W O R D", answers: ["WORD", "WROD", "WODR", "WOD"], correct: 0 },
    { question: "T E X T", answers: ["TEXT", "TXET", "TETX", "TTXE"], correct: 0 },
    { question: "C O D E", answers: ["CODE", "COED", "CDOE", "CEDO"], correct: 0 },
    { question: "D A T A", answers: ["DATA", "DTAA", "DAAT", "ADTA"], correct: 0 },
    { question: "N E T", answers: ["NET", "ENT", "NTE", "NET"], correct: 0 },
    { question: "W E B", answers: ["WEB", "EWB", "WBE", "BWE"], correct: 0 },
    { question: "A P P", answers: ["APP", "PAP", "PPA", "AP"], correct: 0 },
    { question: "S O F T", answers: ["SOFT", "SFTO", "SOTF", "STOF"], correct: 0 },
    { question: "H A R D", answers: ["HARD", "HRAD", "HADR", "AHDR"], correct: 0 },
    { question: "K E Y", answers: ["KEY", "KYE", "EKY", "EYK"], correct: 0 },
    { question: "L O C K", answers: ["LOCK", "LOKC", "LCOK", "LCKO"], correct: 0 },
    { question: "S C R E E N", answers: ["SCREEN", "SCRENE", "SCEREN", "SCRENE"], correct: 0 },
    { question: "M O U S E", answers: ["MOUSE", "MOUES", "MOSUE", "MSEOU"], correct: 0 },
    { question: "K E Y B O A R D", answers: ["KEYBOARD", "KEYBORD", "KEYBAORD", "KEYOBARD"], correct: 0 },
    { question: "M O N I T O R", answers: ["MONITOR", "MONITRO", "MONTIOR", "MONIOTR"], correct: 0 },
    { question: "L A P T O P", answers: ["LAPTOP", "LAPOTP", "LAPTPO", "LATPOP"], correct: 0 },
    { question: "P H O N E", answers: ["PHONE", "PNOHE", "POHNE", "PHNOE"], correct: 0 },
    { question: "T A B L E T", answers: ["TABLET", "TALBET", "TABLTE", "TALBTE"], correct: 0 },
    { question: "S M A R T", answers: ["SMART", "SMRAT", "SMATR", "SAMRT"], correct: 0 },
    { question: "D E V I C E", answers: ["DEVICE", "DEVCIE", "DEVIEC", "DEVEIC"], correct: 0 },
    { question: "S Y S T E M", answers: ["SYSTEM", "SYSTME", "SYSETM", "SYSMET"], correct: 0 },
    { question: "P R O G R A M", answers: ["PROGRAM", "PORGRAM", "PRGORAM", "PROGRMA"], correct: 0 },
    { question: "S O F T W A R E", answers: ["SOFTWARE", "SOFTWAR", "SOFTWRAE", "SOFWTARE"], correct: 0 },
    { question: "H A R D W A R E", answers: ["HARDWARE", "HARDWRAE", "HARWDAER", "HARDWAER"], correct: 0 },
    { question: "N E T W O R K", answers: ["NETWORK", "NETWROK", "NETOWRK", "NETWOKR"], correct: 0 },
    { question: "I N T E R N E T", answers: ["INTERNET", "INRETNET", "INTENRET", "INETRENT"], correct: 0 },
    { question: "W I F I", answers: ["WIFI", "WIF", "WIIF", "IWFI"], correct: 0 },
    { question: "B L U E T O O T H", answers: ["BLUETOOTH", "BLUETOOTH", "BLUEOTOTH", "BLUETOHO"], correct: 0 },
    { question: "C A M E R A", answers: ["CAMERA", "CMAERA", "CAEMRA", "CAMREA"], correct: 0 },
    { question: "M I C R O P H O N E", answers: ["MICROPHONE", "MICROPHNOE", "MICROPHOEN", "MICROPOHEN"], correct: 0 },
    { question: "S P E A K E R", answers: ["SPEAKER", "SPEAER", "SPEAKRE", "SPEKAER"], correct: 0 },
    { question: "H E A D P H O N E", answers: ["HEADPHONE", "HEADPHNOE", "HEADPHOEN", "HEADPOHEN"], correct: 0 },
    { question: "C H A R G E R", answers: ["CHARGER", "CHARGRE", "CHAREGR", "CHARGRE"], correct: 0 },
    { question: "B A T T E R Y", answers: ["BATTERY", "BATTEYR", "BATTEYR", "BATTRYE"], correct: 0 },
    { question: "P L U G", answers: ["PLUG", "PULG", "PLGU", "PGUL"], correct: 0 },
    { question: "S O C K E T", answers: ["SOCKET", "SOCKTE", "SOKCET", "SOCEKT"], correct: 0 },
    { question: "C A B L E", answers: ["CABLE", "CABEL", "CABLE", "CABLE"], correct: 0 },
    { question: "W I R E", answers: ["WIRE", "WIER", "WREI", "WRE"], correct: 0 },
    { question: "C I R C U I T", answers: ["CIRCUIT", "CIRCUIT", "CIRCUIT", "CIRCUIT"], correct: 0 },
    { question: "C H I P", answers: ["CHIP", "CHPI", "CIHP", "CIPH"], correct: 0 },
    { question: "B O A R D", answers: ["BOARD", "BORD", "BODAR", "BOADR"], correct: 0 },
    { question: "M O T H E R B O A R D", answers: ["MOTHERBOARD", "MOTHERBORD", "MOTHEBARD", "MOTHEBROD"], correct: 0 },
    { question: "P R O C E S S O R", answers: ["PROCESSOR", "PROCESOR", "PROCESOSR", "PROCSSEOR"], correct: 0 },
    { question: "M E M O R Y", answers: ["MEMORY", "MEMROY", "MEMOYR", "MEOMRY"], correct: 0 },
    { question: "S T O R A G E", answers: ["STORAGE", "STORGE", "STOARGE", "STORAG"], correct: 0 },
    { question: "D R I V E", answers: ["DRIVE", "DRIEV", "DRVIE", "DREIV"], correct: 0 },
    { question: "D I S K", answers: ["DISK", "DSIK", "DIKS", "DKIS"], correct: 0 },
    { question: "F I L E", answers: ["FILE", "FIEL", "FLEI", "FEIL"], correct: 0 },
    { question: "F O L D E R", answers: ["FOLDER", "FOLDE", "FOLRDE", "FODLER"], correct: 0 },
    { question: "D O C U M E N T", answers: ["DOCUMENT", "DOCUMNET", "DOCUMETN", "DOCUENTM"], correct: 0 },
    { question: "I M A G E", answers: ["IMAGE", "IMGE", "IAMEG", "IEMAG"], correct: 0 },
    { question: "V I D E O", answers: ["VIDEO", "VIEDO", "VIEOD", "VDEIO"], correct: 0 },
    { question: "A U D I O", answers: ["AUDIO", "AUDOI", "AUODI", "AODUI"], correct: 0 },
    { question: "M U S I C", answers: ["MUSIC", "MUSCI", "MUSC", "MUCIS"], correct: 0 },
    { question: "S O N G", answers: ["SONG", "SNOG", "SOGN", "SGNO"], correct: 0 },
    { question: "P L A Y", answers: ["PLAY", "PALY", "PLYA", "PYLA"], correct: 0 },
    { question: "P A U S E", answers: ["PAUSE", "PAUES", "PASUE", "PUASE"], correct: 0 },
    { question: "S T O P", answers: ["STOP", "SOTP", "STPO", "SPTO"], correct: 0 },
    { question: "S T A R T", answers: ["START", "STRAT", "SATRT", "STTAR"], correct: 0 },
    { question: "E N D", answers: ["END", "EDN", "END", "DNE"], correct: 0 },
    { question: "B E G I N", answers: ["BEGIN", "BEIGN", "BENIG", "BEIN"], correct: 0 },
    { question: "F I N I S H", answers: ["FINISH", "FINSIH", "FINIHS", "FIINSH"], correct: 0 },
    { question: "C O M P L E T E", answers: ["COMPLETE", "COMPLEET", "COMPLTE", "COMPELTE"], correct: 0 }
  ],
  synonyms: [
    { question: "Happy", answers: ["Sad", "Joyful", "Angry", "Tired"], correct: 1 },
    { question: "Fast", answers: ["Slow", "Quick", "Heavy", "Large"], correct: 1 },
    { question: "Big", answers: ["Small", "Huge", "Tiny", "Short"], correct: 1 },
    { question: "Smart", answers: ["Dumb", "Clever", "Slow", "Weak"], correct: 1 },
    { question: "Beautiful", answers: ["Ugly", "Pretty", "Plain", "Dark"], correct: 1 },
    { question: "Strong", answers: ["Weak", "Powerful", "Soft", "Light"], correct: 1 },
    { question: "Brave", answers: ["Cowardly", "Courageous", "Scared", "Timid"], correct: 1 },
    { question: "Kind", answers: ["Mean", "Nice", "Rude", "Harsh"], correct: 1 },
    { question: "Rich", answers: ["Poor", "Wealthy", "Broke", "Cheap"], correct: 1 },
    { question: "Cold", answers: ["Hot", "Cool", "Warm", "Dry"], correct: 1 },
    { question: "Old", answers: ["New", "Ancient", "Young", "Fresh"], correct: 1 },
    { question: "Good", answers: ["Bad", "Great", "Evil", "Poor"], correct: 1 },
    { question: "Easy", answers: ["Hard", "Simple", "Difficult", "Complex"], correct: 1 },
    { question: "Clean", answers: ["Dirty", "Pure", "Messy", "Filthy"], correct: 1 },
    { question: "Bright", answers: ["Dark", "Shiny", "Dim", "Dull"], correct: 1 },
    { question: "Loud", answers: ["Quiet", "Noisy", "Silent", "Soft"], correct: 1 },
    { question: "Happy", answers: ["Sad", "Glad", "Miserable", "Upset"], correct: 1 },
    { question: "Quick", answers: ["Slow", "Rapid", "Lazy", "Steady"], correct: 1 },
    { question: "Large", answers: ["Small", "Big", "Tiny", "Little"], correct: 1 },
    { question: "Clever", answers: ["Dumb", "Smart", "Foolish", "Stupid"], correct: 1 },
    { question: "Gorgeous", answers: ["Ugly", "Beautiful", "Plain", "Awful"], correct: 1 },
    { question: "Mighty", answers: ["Weak", "Strong", "Frail", "Delicate"], correct: 1 },
    { question: "Fearless", answers: ["Scared", "Brave", "Timid", "Afraid"], correct: 1 },
    { question: "Gentle", answers: ["Rough", "Kind", "Harsh", "Mean"], correct: 1 },
    { question: "Affluent", answers: ["Poor", "Rich", "Broke", "Destitute"], correct: 1 },
    { question: "Freezing", answers: ["Hot", "Cold", "Warm", "Boiling"], correct: 1 },
    { question: "Ancient", answers: ["New", "Old", "Modern", "Recent"], correct: 1 },
    { question: "Excellent", answers: ["Bad", "Good", "Terrible", "Poor"], correct: 1 },
    { question: "Simple", answers: ["Hard", "Easy", "Complex", "Difficult"], correct: 1 },
    { question: "Spotless", answers: ["Dirty", "Clean", "Filthy", "Messy"], correct: 1 },
    { question: "Radiant", answers: ["Dark", "Bright", "Dim", "Dull"], correct: 1 },
    { question: "Silent", answers: ["Loud", "Quiet", "Noisy", "Boisterous"], correct: 1 },
    { question: "Glad", answers: ["Sad", "Happy", "Upset", "Miserable"], correct: 1 },
    { question: "Swift", answers: ["Slow", "Fast", "Sluggish", "Lazy"], correct: 1 },
    { question: "Huge", answers: ["Small", "Big", "Tiny", "Little"], correct: 1 },
    { question: "Intelligent", answers: ["Dumb", "Smart", "Foolish", "Stupid"], correct: 1 },
    { question: "Lovely", answers: ["Ugly", "Beautiful", "Plain", "Awful"], correct: 1 },
    { question: "Powerful", answers: ["Weak", "Strong", "Frail", "Delicate"], correct: 1 },
    { question: "Bold", answers: ["Scared", "Brave", "Timid", "Afraid"], correct: 1 },
    { question: "Compassionate", answers: ["Cruel", "Kind", "Mean", "Harsh"], correct: 1 },
    { question: "Wealthy", answers: ["Poor", "Rich", "Broke", "Destitute"], correct: 1 },
    { question: "Chilly", answers: ["Hot", "Cold", "Warm", "Boiling"], correct: 1 },
    { question: "Elderly", answers: ["Young", "Old", "New", "Modern"], correct: 1 },
    { question: "Superb", answers: ["Bad", "Good", "Terrible", "Poor"], correct: 1 },
    { question: "Effortless", answers: ["Hard", "Easy", "Difficult", "Complex"], correct: 1 },
    { question: "Pristine", answers: ["Dirty", "Clean", "Filthy", "Messy"], correct: 1 },
    { question: "Shining", answers: ["Dark", "Bright", "Dim", "Dull"], correct: 1 },
    { question: "Hushed", answers: ["Loud", "Quiet", "Noisy", "Boisterous"], correct: 1 },
    { question: "Joyful", answers: ["Sad", "Happy", "Upset", "Miserable"], correct: 1 },
    { question: "Speedy", answers: ["Slow", "Fast", "Sluggish", "Lazy"], correct: 1 },
    { question: "Massive", answers: ["Small", "Big", "Tiny", "Little"], correct: 1 },
    { question: "Brilliant", answers: ["Dumb", "Smart", "Foolish", "Stupid"], correct: 1 },
    { question: "Stunning", answers: ["Ugly", "Beautiful", "Plain", "Awful"], correct: 1 },
    { question: "Robust", answers: ["Weak", "Strong", "Frail", "Delicate"], correct: 1 },
    { question: "Daring", answers: ["Scared", "Brave", "Timid", "Afraid"], correct: 1 },
    { question: "Benevolent", answers: ["Cruel", "Kind", "Mean", "Harsh"], correct: 1 },
    { question: "Prosperous", answers: ["Poor", "Rich", "Broke", "Destitute"], correct: 1 },
    { question: "Frigid", answers: ["Hot", "Cold", "Warm", "Boiling"], correct: 1 },
    { question: "Aged", answers: ["Young", "Old", "New", "Modern"], correct: 1 },
    { question: "Outstanding", answers: ["Bad", "Good", "Terrible", "Poor"], correct: 1 },
    { question: "Straightforward", answers: ["Hard", "Easy", "Difficult", "Complex"], correct: 1 },
    { question: "Immaculate", answers: ["Dirty", "Clean", "Filthy", "Messy"], correct: 1 },
    { question: "Luminous", answers: ["Dark", "Bright", "Dim", "Dull"], correct: 1 },
    { question: "Mute", answers: ["Loud", "Quiet", "Noisy", "Boisterous"], correct: 1 },
    { question: "Cheerful", answers: ["Sad", "Happy", "Upset", "Miserable"], correct: 1 },
    { question: "Rapid", answers: ["Slow", "Fast", "Sluggish", "Lazy"], correct: 1 },
    { question: "Gigantic", answers: ["Small", "Big", "Tiny", "Little"], correct: 1 },
    { question: "Genius", answers: ["Dumb", "Smart", "Foolish", "Stupid"], correct: 1 },
    { question: "Attractive", answers: ["Ugly", "Beautiful", "Plain", "Awful"], correct: 1 },
    { question: "Sturdy", answers: ["Weak", "Strong", "Frail", "Delicate"], correct: 1 },
    { question: "Courageous", answers: ["Scared", "Brave", "Timid", "Afraid"], correct: 1 },
    { question: "Generous", answers: ["Cruel", "Kind", "Mean", "Harsh"], correct: 1 },
    { question: "Opulent", answers: ["Poor", "Rich", "Broke", "Destitute"], correct: 1 },
    { question: "Icy", answers: ["Hot", "Cold", "Warm", "Boiling"], correct: 1 },
    { question: "Vintage", answers: ["Young", "Old", "New", "Modern"], correct: 1 },
    { question: "Exceptional", answers: ["Bad", "Good", "Terrible", "Poor"], correct: 1 },
    { question: "Uncomplicated", answers: ["Hard", "Easy", "Difficult", "Complex"], correct: 1 },
    { question: "Flawless", answers: ["Dirty", "Clean", "Filthy", "Messy"], correct: 1 },
    { question: "Glowing", answers: ["Dark", "Bright", "Dim", "Dull"], correct: 1 },
    { question: "Quiet", answers: ["Loud", "Silent", "Noisy", "Boisterous"], correct: 1 }
  ],
  definitions: [
    { question: "A machine that processes information", answers: ["Toaster", "Computer", "Blender", "Fan"], correct: 1 },
    { question: "A network of interconnected computers", answers: ["Kitchen", "Internet", "Bedroom", "Garden"], correct: 1 },
    { question: "A program that displays web pages", answers: ["Browser", "Calculator", "Notepad", "Paint"], correct: 0 },
    { question: "A portable computer", answers: ["Desktop", "Laptop", "Server", "Tablet"], correct: 1 },
    { question: "A device used to input text", answers: ["Monitor", "Keyboard", "Speaker", "Printer"], correct: 1 },
    { question: "A device used to point and click", answers: ["Microphone", "Mouse", "Camera", "Scanner"], correct: 1 },
    { question: "A screen that displays visual output", answers: ["Keyboard", "Monitor", "Speaker", "Printer"], correct: 1 },
    { question: "A device that stores data permanently", answers: ["RAM", "Hard Drive", "CPU", "Cache"], correct: 1 },
    { question: "Temporary memory for quick access", answers: ["Hard Drive", "RAM", "SSD", "USB"], correct: 1 },
    { question: "The brain of the computer", answers: ["GPU", "CPU", "PSU", "Case"], correct: 1 },
    { question: "A program that performs specific tasks", answers: ["Software", "Hardware", "Firmware", "Malware"], correct: 0 },
    { question: "Physical components of a computer", answers: ["Software", "Hardware", "Firmware", "Malware"], correct: 1 },
    { question: "A harmful program that damages systems", answers: ["Antivirus", "Malware", "Firewall", "VPN"], correct: 1 },
    { question: "Security software that protects against threats", answers: ["Malware", "Antivirus", "Spyware", "Adware"], correct: 1 },
    { question: "A wireless network technology", answers: ["Ethernet", "WiFi", "Bluetooth", "USB"], correct: 1 },
    { question: "A technology for short-range wireless connections", answers: ["WiFi", "Bluetooth", "Ethernet", "4G"], correct: 1 },
    { question: "A portable storage device", answers: ["Hard Drive", "USB Drive", "RAM", "CPU"], correct: 1 },
    { question: "A cloud storage service", answers: ["Local Disk", "Google Drive", "RAM", "Cache"], correct: 1 },
    { question: "A type of malicious software that encrypts files", answers: ["Virus", "Ransomware", "Spyware", "Adware"], correct: 1 },
    { question: "A person who breaks into computer systems", answers: ["Developer", "Hacker", "Designer", "User"], correct: 1 },
    { question: "The process of encoding information", answers: ["Decryption", "Encryption", "Compression", "Expansion"], correct: 1 },
    { question: "The process of decoding encrypted information", answers: ["Encryption", "Decryption", "Compression", "Expansion"], correct: 1 },
    { question: "A type of attack that tricks users", answers: ["DDoS", "Phishing", "SQL Injection", "XSS"], correct: 1 },
    { question: "A security measure that verifies identity", answers: ["Authentication", "Authorization", "Encryption", "Decryption"], correct: 0 },
    { question: "Permission to access resources", answers: ["Authentication", "Authorization", "Encryption", "Decryption"], correct: 1 },
    { question: "A backup copy of data", answers: ["Original", "Backup", "Temporary", "Cache"], correct: 1 },
    { question: "The process of recovering lost data", answers: ["Deletion", "Recovery", "Encryption", "Compression"], correct: 1 },
    { question: "A type of software that displays ads", answers: ["Antivirus", "Adware", "Firewall", "VPN"], correct: 1 },
    { question: "A type of software that monitors user activity", answers: ["Antivirus", "Spyware", "Firewall", "VPN"], correct: 1 },
    { question: "A network security device", answers: ["Router", "Firewall", "Switch", "Hub"], correct: 1 },
    { question: "A device that connects networks", answers: ["Firewall", "Router", "Switch", "Hub"], correct: 1 },
    { question: "A device that forwards data packets", answers: ["Router", "Switch", "Hub", "Modem"], correct: 1 },
    { question: "A device that connects multiple devices", answers: ["Router", "Switch", "Hub", "Modem"], correct: 1 },
    { question: "A device that modulates and demodulates signals", answers: ["Router", "Switch", "Hub", "Modem"], correct: 3 },
    { question: "A type of internet connection", answers: ["Dial-up", "DSL", "Both", "Neither"], correct: 2 },
    { question: "A high-speed internet connection", answers: ["Dial-up", "Fiber", "DSL", "Both"], correct: 3 },
    { question: "A type of mobile internet", answers: ["WiFi", "4G", "Ethernet", "DSL"], correct: 1 },
    { question: "A type of wired network connection", answers: ["WiFi", "Ethernet", "4G", "Bluetooth"], correct: 1 },
    { question: "A protocol for web pages", answers: ["FTP", "HTTP", "SMTP", "POP3"], correct: 1 },
    { question: "A secure version of HTTP", answers: ["HTTP", "HTTPS", "FTP", "SMTP"], correct: 1 },
    { question: "A protocol for email sending", answers: ["HTTP", "FTP", "SMTP", "POP3"], correct: 2 },
    { question: "A protocol for email receiving", answers: ["HTTP", "FTP", "SMTP", "POP3"], correct: 3 },
    { question: "A protocol for file transfer", answers: ["HTTP", "FTP", "SMTP", "POP3"], correct: 1 },
    { question: "A type of database", answers: ["SQL", "NoSQL", "Both", "Neither"], correct: 2 },
    { question: "A language for database queries", answers: ["Python", "SQL", "Java", "C++"], correct: 1 },
    { question: "A type of programming language", answers: ["HTML", "Python", "CSS", "JSON"], correct: 1 },
    { question: "A markup language for web pages", answers: ["Python", "HTML", "CSS", "JavaScript"], correct: 1 },
    { question: "A styling language for web pages", answers: ["HTML", "Python", "CSS", "JavaScript"], correct: 2 },
    { question: "A scripting language for web pages", answers: ["HTML", "CSS", "Python", "JavaScript"], correct: 3 },
    { question: "A framework for web development", answers: ["React", "Python", "SQL", "C++"], correct: 0 },
    { question: "A type of software development methodology", answers: ["Waterfall", "Agile", "Both", "Neither"], correct: 2 },
    { question: "A version control system", answers: ["Git", "SVN", "Both", "Neither"], correct: 2 },
    { question: "A platform for code hosting", answers: ["GitHub", "GitLab", "Both", "Neither"], correct: 2 },
    { question: "A type of software testing", answers: ["Unit", "Integration", "Both", "Neither"], correct: 2 },
    { question: "A type of software bug", answers: ["Syntax", "Logic", "Both", "Neither"], correct: 2 },
    { question: "A type of software documentation", answers: ["User", "Technical", "Both", "Neither"], correct: 2 },
    { question: "A type of software license", answers: ["Open Source", "Proprietary", "Both", "Neither"], correct: 2 },
    { question: "A type of operating system", answers: ["Windows", "Linux", "Both", "Neither"], correct: 2 },
    { question: "A type of mobile operating system", answers: ["Android", "iOS", "Both", "Neither"], correct: 2 },
    { question: "A type of computer virus", answers: ["File", "Boot", "Both", "Neither"], correct: 2 },
    { question: "A type of computer worm", answers: ["Network", "Email", "Both", "Neither"], correct: 2 },
    { question: "A type of computer Trojan", answers: ["Remote", "Data", "Both", "Neither"], correct: 2 },
    { question: "A type of computer spyware", answers: ["Keylogger", "Screen", "Both", "Neither"], correct: 2 },
    { question: "A type of computer adware", answers: ["Pop-up", "Banner", "Both", "Neither"], correct: 2 },
    { question: "A type of computer ransomware", answers: ["File", "Screen", "Both", "Neither"], correct: 2 },
    { question: "A type of computer phishing", answers: ["Email", "Website", "Both", "Neither"], correct: 2 },
    { question: "A type of computer DDoS", answers: ["Volume", "Protocol", "Both", "Neither"], correct: 2 },
    { question: "A type of computer SQL injection", answers: ["Error", "Union", "Both", "Neither"], correct: 2 },
    { question: "A type of computer XSS", answers: ["Stored", "Reflected", "Both", "Neither"], correct: 2 },
    { question: "A type of computer CSRF", answers: ["GET", "POST", "Both", "Neither"], correct: 2 },
    { question: "A type of computer clickjacking", answers: ["Like", "Share", "Both", "Neither"], correct: 2 },
    { question: "A type of computer social engineering", answers: ["Pretexting", "Baiting", "Both", "Neither"], correct: 2 },
    { question: "A type of computer physical security", answers: ["Access", "Environmental", "Both", "Neither"], correct: 2 },
    { question: "A type of computer network security", answers: ["Perimeter", "Internal", "Both", "Neither"], correct: 2 },
    { question: "A type of computer application security", answers: ["Web", "Mobile", "Both", "Neither"], correct: 2 },
    { question: "A type of computer data security", answers: ["Encryption", "Backup", "Both", "Neither"], correct: 2 },
    { question: "A type of computer cloud security", answers: ["Public", "Private", "Both", "Neither"], correct: 2 },
    { question: "A type of computer IoT security", answers: ["Device", "Network", "Both", "Neither"], correct: 2 },
    { question: "A type of computer AI security", answers: ["Adversarial", "Model", "Both", "Neither"], correct: 2 },
    { question: "A type of computer blockchain security", answers: ["51%", "Smart Contract", "Both", "Neither"], correct: 2 },
    { question: "A type of computer quantum security", answers: ["Key", "Algorithm", "Both", "Neither"], correct: 2 }
  ],
  wordComplete: [
    { question: "C _ M P U T _ R", answers: ["COMPUTER", "COMPUTAR", "COMPUTOR", "COMPUTRE"], correct: 0 },
    { question: "I N T _ R N _ T", answers: ["INTERNET", "INTERNT", "INTENRET", "INRETNET"], correct: 0 },
    { question: "S _ F T W _ R _", answers: ["SOFTWARE", "SOFTWAR", "SOFTWRAE", "SOFWTARE"], correct: 0 },
    { question: "H _ R D W _ R _", answers: ["HARDWARE", "HARDWRAE", "HARWDAER", "HARDWAER"], correct: 0 },
    { question: "N _ T W _ R K", answers: ["NETWORK", "NETWROK", "NETOWRK", "NETWOKR"], correct: 0 },
    { question: "W _ B S _ T _", answers: ["WEBSITE", "WEBSIT", "WBSITE", "WEBSTIE"], correct: 0 },
    { question: "B R _ W S _ R", answers: ["BROWSER", "BROWSRE", "BROWSER", "BROWESR"], correct: 0 },
    { question: "K _ Y B _ A R D", answers: ["KEYBOARD", "KEYBORD", "KEYBAORD", "KEYOBARD"], correct: 0 },
    { question: "M _ U S _", answers: ["MOUSE", "MOUES", "MOSUE", "MSEOU"], correct: 0 },
    { question: "M _ N I T _ R", answers: ["MONITOR", "MONITRO", "MONTIOR", "MONIOTR"], correct: 0 },
    { question: "L _ P T _ P", answers: ["LAPTOP", "LAPOTP", "LAPTPO", "LATPOP"], correct: 0 },
    { question: "T _ B L _ T", answers: ["TABLET", "TALBET", "TABLTE", "TALBTE"], correct: 0 },
    { question: "P H _ N _", answers: ["PHONE", "PNOHE", "POHNE", "PHNOE"], correct: 0 },
    { question: "C _ M _ R _", answers: ["CAMERA", "CMAERA", "CAEMRA", "CAMREA"], correct: 0 },
    { question: "S P _ A K _ R", answers: ["SPEAKER", "SPEAER", "SPEAKRE", "SPEKAER"], correct: 0 },
    { question: "H _ A D P H _ N _", answers: ["HEADPHONE", "HEADPHNOE", "HEADPHOEN", "HEADPOHEN"], correct: 0 },
    { question: "C _ A R G _ R", answers: ["CHARGER", "CHARGRE", "CHAREGR", "CHARGRE"], correct: 0 },
    { question: "B _ T T _ R Y", answers: ["BATTERY", "BATTEYR", "BATTEYR", "BATTRYE"], correct: 0 },
    { question: "C _ B L _", answers: ["CABLE", "CABEL", "CABLE", "CABLE"], correct: 0 },
    { question: "W _ R _", answers: ["WIRE", "WIER", "WREI", "WRE"], correct: 0 },
    { question: "C _ I P", answers: ["CHIP", "CHPI", "CIHP", "CIPH"], correct: 0 },
    { question: "B _ A R D", answers: ["BOARD", "BORD", "BODAR", "BOADR"], correct: 0 },
    { question: "P R _ C _ S S _ R", answers: ["PROCESSOR", "PROCESOR", "PROCESOSR", "PROCSSEOR"], correct: 0 },
    { question: "M _ M _ R Y", answers: ["MEMORY", "MEMROY", "MEMOYR", "MEOMRY"], correct: 0 },
    { question: "S T _ R _ G _", answers: ["STORAGE", "STORGE", "STOARGE", "STORAG"], correct: 0 },
    { question: "D R _ V _", answers: ["DRIVE", "DRIEV", "DRVIE", "DREIV"], correct: 0 },
    { question: "D _ S K", answers: ["DISK", "DSIK", "DIKS", "DKIS"], correct: 0 },
    { question: "F _ L _", answers: ["FILE", "FIEL", "FLEI", "FEIL"], correct: 0 },
    { question: "F _ L D _ R", answers: ["FOLDER", "FOLDE", "FOLRDE", "FODLER"], correct: 0 },
    { question: "D _ C _ M _ N T", answers: ["DOCUMENT", "DOCUMNET", "DOCUMETN", "DOCUENTM"], correct: 0 },
    { question: "I M _ G _", answers: ["IMAGE", "IMGE", "IAMEG", "IEMAG"], correct: 0 },
    { question: "V _ D _ O", answers: ["VIDEO", "VIEDO", "VIEOD", "VDEIO"], correct: 0 },
    { question: "_ U D _ O", answers: ["AUDIO", "AUDOI", "AUODI", "AODUI"], correct: 0 },
    { question: "M _ S _ C", answers: ["MUSIC", "MUSCI", "MUSC", "MUCIS"], correct: 0 },
    { question: "S _ N G", answers: ["SONG", "SNOG", "SOGN", "SGNO"], correct: 0 },
    { question: "P L _ Y", answers: ["PLAY", "PALY", "PLYA", "PYLA"], correct: 0 },
    { question: "P _ U S _", answers: ["PAUSE", "PAUES", "PASUE", "PUASE"], correct: 0 },
    { question: "S T _ P", answers: ["STOP", "SOTP", "STPO", "SPTO"], correct: 0 },
    { question: "S T _ R T", answers: ["START", "STRAT", "SATRT", "STTAR"], correct: 0 },
    { question: "_ N D", answers: ["END", "EDN", "END", "DNE"], correct: 0 },
    { question: "B _ G _ N", answers: ["BEGIN", "BEIGN", "BENIG", "BEIN"], correct: 0 },
    { question: "F _ N _ S H", answers: ["FINISH", "FINSIH", "FINIHS", "FIINSH"], correct: 0 },
    { question: "C _ M P L _ T _", answers: ["COMPLETE", "COMPLEET", "COMPLTE", "COMPELTE"], correct: 0 },
    { question: "S _ A R T", answers: ["SMART", "SMRAT", "SMATR", "SAMRT"], correct: 0 },
    { question: "C L _ V _ R", answers: ["CLEVER", "CLEVRE", "CLEVER", "CLEVRE"], correct: 0 },
    { question: "Q U _ C K", answers: ["QUICK", "QUICK", "QUICK", "QUICK"], correct: 0 },
    { question: "F _ S T", answers: ["FAST", "FATS", "FTAS", "FSTA"], correct: 0 },
    { question: "S L _ W", answers: ["SLOW", "SLO", "SLWO", "SLOW"], correct: 0 },
    { question: "H _ R D", answers: ["HARD", "HRAD", "HADR", "AHDR"], correct: 0 },
    { question: "_ A S Y", answers: ["EASY", "EAS", "EASY", "EASY"], correct: 0 },
    { question: "D _ F F _ C _ L T", answers: ["DIFFICULT", "DIFFICULT", "DIFFICULT", "DIFFICULT"], correct: 0 },
    { question: "S _ M P L _", answers: ["SIMPLE", "SIMPEL", "SIMLPE", "SIPEML"], correct: 0 },
    { question: "C _ M P L _ X", answers: ["COMPLEX", "COMPELX", "COMPLXE", "COMPELX"], correct: 0 },
    { question: "B _ S _ C", answers: ["BASIC", "BASCI", "BAISC", "BACIS"], correct: 0 },
    { question: "_ D V _ N C _ D", answers: ["ADVANCED", "ADVACNED", "ADVANECD", "ADAVNCED"], correct: 0 },
    { question: "P R _ M _ R Y", answers: ["PRIMARY", "PRIMRAY", "PRIAMRY", "PRIMYAR"], correct: 0 },
    { question: "S _ C _ N D _ R Y", answers: ["SECONDARY", "SECONDRAY", "SECONADRY", "SECONDRYA"], correct: 0 },
    { question: "M _ I N", answers: ["MAIN", "MANI", "MIAN", "MINA"], correct: 0 },
    { question: "S _ B", answers: ["SUB", "SBU", "USB", "BSU"], correct: 0 },
    { question: "C _ R _", answers: ["CORE", "COER", "CROE", "OCRE"], correct: 0 },
    { question: "N _ D _", answers: ["NODE", "NDOE", "NOED", "ONED"], correct: 0 },
    { question: "L _ N K", answers: ["LINK", "LNIK", "LIKN", "ILNK"], correct: 0 },
    { question: "C _ N N _ C T", answers: ["CONNECT", "CONENCT", "CONNCET", "CONECNT"], correct: 0 },
    { question: "D _ S C _ N N _ C T", answers: ["DISCONNECT", "DISECNNECT", "DISCONNCET", "DISECONECT"], correct: 0 },
    { question: "_ C C _ S S", answers: ["ACCESS", "ACECSS", "ACSESS", "ACSSES"], correct: 0 },
    { question: "D _ N _ D", answers: ["DENY", "DEYNY", "DENY", "DENY"], correct: 0 },
    { question: "P _ R M _ T", answers: ["PERMIT", "PERIMT", "PERMTI", "PEMRIT"], correct: 0 },
    { question: "B L _ C K", answers: ["BLOCK", "BLOKC", "BLCOK", "BOLCK"], correct: 0 },
    { question: "_ L L _ W", answers: ["ALLOW", "ALOLW", "ALWLO", "ALOWL"], correct: 0 },
    { question: "R _ S T R _ C T", answers: ["RESTRICT", "RESITRCT", "RESTIRCT", "RESRTICT"], correct: 0 },
    { question: "L _ M _ T", answers: ["LIMIT", "LIIMT", "LIMTI", "LIMTI"], correct: 0 },
    { question: "B _ U N D", answers: ["BOUND", "BOUDN", "BONUD", "BODUN"], correct: 0 },
    { question: "F R _ _", answers: ["FREE", "FRE", "FRE", "FER"], correct: 0 },
    { question: "L _ C K _ D", answers: ["LOCKED", "LOKCED", "LOCKDE", "LOCEKD"], correct: 0 },
    { question: "U N L _ C K _ D", answers: ["UNLOCKED", "UNLOKCED", "UNLOCKDE", "UNLOCEKD"], correct: 0 },
    { question: "S _ C U R _", answers: ["SECURE", "SEUCRE", "SECRUE", "SEUCER"], correct: 0 },
    { question: "S _ F _", answers: ["SAFE", "SAFE", "SAEF", "SEAF"], correct: 0 },
    { question: "P R _ T _ C T", answers: ["PROTECT", "PROTEC", "PROTECT", "PROTECT"], correct: 0 },
    { question: "D _ F _ N D", answers: ["DEFEND", "DEFEDN", "DEFNED", "DEEFND"], correct: 0 },
    { question: "_ T T _ C K", answers: ["ATTACK", "ATATCK", "ATTAKC", "ATTCKA"], correct: 0 },
    { question: "D _ F _ N S _", answers: ["DEFENSE", "DEFENES", "DEFENSE", "DEFENSE"], correct: 0 },
    { question: "V _ L N _ R _ B L _", answers: ["VULNERABLE", "VULNERABLE", "VULNERABLE", "VULNERABLE"], correct: 0 },
    { question: "S T R _ N G T H", answers: ["STRENGTH", "STRENGTH", "STRENGTH", "STRENGTH"], correct: 0 },
    { question: "W _ _ K N _ S S", answers: ["WEAKNESS", "WEAKNESS", "WEAKNESS", "WEAKNESS"], correct: 0 },
    { question: "T H R _ A T", answers: ["THREAT", "THRETA", "THREAT", "THREAT"], correct: 0 },
    { question: "R _ S K", answers: ["RISK", "RISk", "RISK", "RISK"], correct: 0 },
    { question: "D _ N G _ R", answers: ["DANGER", "DANGRE", "DANGRE", "DANGRE"], correct: 0 },
    { question: "S _ F _ T Y", answers: ["SAFETY", "SAFTEY", "SAFETY", "SAFETY"], correct: 0 },
    { question: "S _ C U R _ T Y", answers: ["SECURITY", "SECUITY", "SECURTIY", "SECUYRTI"], correct: 0 },
    { question: "P R _ V _ C Y", answers: ["PRIVACY", "PRIVACY", "PRIVACY", "PRIVACY"], correct: 0 },
    { question: "C _ N F _ D _ N T _ A L", answers: ["CONFIDENTIAL", "CONFIDENTIAL", "CONFIDENTIAL", "CONFIDENTIAL"], correct: 0 },
    { question: "S _ C R _ T", answers: ["SECRET", "SECRE", "SECRTE", "SECRE"], correct: 0 },
    { question: "H _ D D _ N", answers: ["HIDDEN", "HIDEDN", "HIDNED", "HIDEDN"], correct: 0 },
    { question: "V _ S _ B L _", answers: ["VISIBLE", "VISIBEL", "VISIBEL", "VISIBEL"], correct: 0 },
    { question: "I N V _ S _ B L _", answers: ["INVISIBLE", "INVISIBLE", "INVISIBLE", "INVISIBLE"], correct: 0 },
    { question: "P _ B L _ C", answers: ["PUBLIC", "PUBLCI", "PUBILC", "PUBCLI"], correct: 0 },
    { question: "P R _ V _ T _", answers: ["PRIVATE", "PRIVAT", "PRIVTE", "PRIVTE"], correct: 0 },
    { question: "O P _ N", answers: ["OPEN", "OPNE", "OEPN", "OPEN"], correct: 0 },
    { question: "C L _ S _ D", answers: ["CLOSED", "CLOESD", "CLODE", "CLOESD"], correct: 0 },
    { question: "L _ C K _ D", answers: ["LOCKED", "LOKCED", "LOCKDE", "LOCEKD"], correct: 0 },
    { question: "U N L _ C K _ D", answers: ["UNLOCKED", "UNLOKCED", "UNLOCKDE", "UNLOCEKD"], correct: 0 }
  ]
};

// Initialize Audio Context
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Play Sound Effect
function playSound(type) {
  if (gameState.isMuted || !audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  switch(type) {
    case 'correct':
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialDecayTo = 0.01;
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
    case 'wrong':
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
    case 'click':
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
      break;
    case 'gameOver':
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.6);
      break;
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
  const muteBtn = document.getElementById('muteBtn');
  const muteBtnGame = document.getElementById('muteBtnGame');
  if (muteBtn) muteBtn.textContent = gameState.isMuted ? '🔇' : '🔊';
  if (muteBtnGame) muteBtnGame.textContent = gameState.isMuted ? '🔇' : '🔊';
}

// Toggle Mute
function toggleMute() {
  gameState.isMuted = !gameState.isMuted;
  bgm.muted = gameState.isMuted;
  localStorage.setItem('lexiMind_muted', gameState.isMuted);
  updateMuteButton();
  playSound('click');
}

// Update Lives Display
function updateLives() {
  const livesEl = document.getElementById('lives');
  livesEl.textContent = '❤️'.repeat(gameState.lives);
}

// Update Timer Display
function updateTimer() {
  const timerEl = document.getElementById('timer');
  timerEl.textContent = gameState.timeLeft;
  
  if (gameState.timeLeft <= 3) {
    timerEl.classList.add('warning');
  } else {
    timerEl.classList.remove('warning');
  }
}

// Update Streak Display
function updateStreak() {
  const streakEl = document.getElementById('streak');
  const multiplier = Math.min(gameState.streak, 5);
  streakEl.textContent = `🔥 ${multiplier}x`;
}

// Update Score Display
function updateScore() {
  const scoreEl = document.getElementById('currentScore');
  scoreEl.textContent = gameState.score;
}

// Load High Scores
function loadHighScores() {
  const overallHighScore = localStorage.getItem('lexiMind_overallHighScore') || 0;
  document.getElementById('overallHighScore').textContent = overallHighScore;
}

// Save High Score
function saveHighScore() {
  const overallHighScore = localStorage.getItem('lexiMind_overallHighScore') || 0;
  if (gameState.score > overallHighScore) {
    localStorage.setItem('lexiMind_overallHighScore', gameState.score);
  }
  
  const categoryHighScoreKey = `lexiMind_${gameState.currentCategory}HighScore`;
  const categoryHighScore = localStorage.getItem(categoryHighScoreKey) || 0;
  if (gameState.score > categoryHighScore) {
    localStorage.setItem(categoryHighScoreKey, gameState.score);
  }
}

// Show Screen
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
}

// Start Game
function startGame(category) {
  playSound('click');
  gameState.currentCategory = category;
  gameState.score = 0;
  gameState.lives = 3;
  gameState.streak = 0;
  gameState.totalQuestions = 0;
  gameState.correctAnswers = 0;
  
  initializeAvailableQuestions(category);
  updateLives();
  updateStreak();
  updateScore();
  
  showScreen('gameScreen');
  loadQuestion();
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
    btn.onclick = () => handleAnswer(index);
    answerOptions.appendChild(btn);
  });
  
  startTimer();
}

// Start Timer
function startTimer() {
  gameState.timeLeft = 10;
  updateTimer();
  
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }
  
  gameState.timer = setInterval(() => {
    gameState.timeLeft--;
    updateTimer();
    
    if (gameState.timeLeft <= 0) {
      clearInterval(gameState.timer);
      handleWrongAnswer();
    }
  }, 1000);
}

// Handle Answer
function handleAnswer(index) {
  clearInterval(gameState.timer);
  
  const buttons = document.querySelectorAll('.answer-btn');
  buttons.forEach(btn => btn.disabled = true);
  
  if (index === gameState.currentQuestion.correct) {
    buttons[index].classList.add('correct');
    handleCorrectAnswer();
  } else {
    buttons[index].classList.add('wrong');
    buttons[gameState.currentQuestion.correct].classList.add('correct');
    handleWrongAnswer();
  }
}

// Handle Correct Answer
function handleCorrectAnswer() {
  playSound('correct');
  gameState.streak++;
  gameState.correctAnswers++;
  
  const multiplier = Math.min(gameState.streak, 5);
  const basePoints = 10;
  const points = basePoints * multiplier;
  gameState.score += points;
  
  updateStreak();
  updateScore();
  
  setTimeout(() => {
    loadQuestion();
  }, 500);
}

// Handle Wrong Answer
function handleWrongAnswer() {
  playSound('wrong');
  gameState.lives--;
  gameState.streak = 0;
  
  updateLives();
  updateStreak();
  
  if (gameState.lives <= 0) {
    setTimeout(() => {
      endGame();
    }, 1000);
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 1000);
  }
}

// End Game
function endGame() {
  playSound('gameOver');
  clearInterval(gameState.timer);
  
  saveHighScore();
  
  const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
  document.getElementById('accuracy').textContent = `${accuracy}%`;
  document.getElementById('finalScore').textContent = gameState.score;
  
  const categoryHighScoreKey = `lexiMind_${gameState.currentCategory}HighScore`;
  const categoryHighScore = localStorage.getItem(categoryHighScoreKey) || 0;
  document.getElementById('categoryHighScore').textContent = categoryHighScore;
  
  // Star Rating
  const star1 = document.getElementById('star1');
  const star2 = document.getElementById('star2');
  const star3 = document.getElementById('star3');
  
  star1.classList.remove('active');
  star2.classList.remove('active');
  star3.classList.remove('active');
  
  if (accuracy >= 60) star1.classList.add('active');
  if (accuracy >= 80) star2.classList.add('active');
  if (accuracy >= 90) star3.classList.add('active');
  
  showScreen('gameOverScreen');
}

// Exit Game
function exitGame() {
  playSound('click');
  clearInterval(gameState.timer);
  showScreen('startScreen');
  loadHighScores();
}

// Initialize
async function init() {
  // Initialize i18n loader
  await gameI18n.init('lexi-mind');
  
  // Load mute state
  gameState.isMuted = localStorage.getItem('lexiMind_muted') === 'true';
  if (!gameState.isMuted) {
    gameState.isMuted = false;
  }
  bgm.muted = gameState.isMuted;
  updateMuteButton();
  
  // Automatically unlock and play background music on first frame / interaction
  const unlockAudio = () => {
    if (bgm && bgm.paused && !gameState.isMuted) {
      bgm.play().catch(e => console.log('Autoplay deferred:', e));
    }
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
  };
  document.addEventListener('touchstart', unlockAudio, { once: true });
  document.addEventListener('click', unlockAudio, { once: true });
  
  // Load high scores
  loadHighScores();
  
  // Category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.onclick = () => {
      const category = btn.getAttribute('data-category');
      startGame(category);
    };
  });
  
  // Mute button
  document.getElementById('muteBtn').onclick = toggleMute;
  const muteBtnGame = document.getElementById('muteBtnGame');
  if (muteBtnGame) {
    muteBtnGame.onclick = toggleMute;
  }
  
  // Exit button
  document.getElementById('exitBtn').onclick = exitGame;
  
  // Replay button
  document.getElementById('replayBtn').onclick = () => {
    startGame(gameState.currentCategory);
  };
  
  // Main menu button
  document.getElementById('mainMenuBtn').onclick = exitGame;
  
  // Initialize audio on first interaction
  document.body.addEventListener('click', () => {
    initAudio();
    bgm.play().catch(err => console.log('BGM play failed:', err));
  }, { once: true });
  
  // Also handle touchstart for mobile
  document.body.addEventListener('touchstart', () => {
    initAudio();
    bgm.play().catch(err => console.log('BGM play failed:', err));
  }, { once: true });
}

// Start the game
init();
