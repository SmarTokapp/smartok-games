// Pixel Painter: Color Reveal
// A relaxing pixel art coloring game. Select a color from the palette and
// tap matching numbered cells to paint them. Reveal the hidden pixel art.
// Original game for SmarTokGames — no trademarked names used.

function t(key) {
    return gameI18n.t(key);
}

// Color palette: number -> CSS color. Shared across all levels.
const COLORS = {
    1: '#00f3ff',   // cyan
    2: '#ff4c68',   // red
    3: '#ffdd00',   // gold
    4: '#00ffaa',   // green
    5: '#a855f7',   // purple
    6: '#f59e0b',   // amber
    7: '#ec4899',   // pink
    8: '#1a1a2e',   // dark (background/shadow)
    9: '#e0e0e0',   // light gray
};

// Extended palette for Free Paint mode (16 colors).
// Keys 1-9 are shared with puzzle COLORS; 10-16 are Free Paint additions.
const FREE_PAINT_COLORS = {
    ...COLORS,
    10: '#3b82f6',   // blue
    11: '#f97316',   // orange
    12: '#10b981',   // emerald
    13: '#8b5cf6',   // violet
    14: '#ffffff',   // white
    15: '#6b7280',   // grey
    16: '#92400e',   // brown
};

// Free Paint canvas dimensions
const FREE_PAINT_SIZE = 16;

// Pixel art levels. 0 = empty (transparent, not painted).
// Each level: { name, rows, cols, grid (flat array), }
// Grid values are color numbers from COLORS above, or 0 for empty cells.
const LEVELS = [
    {
        name: 'Sword',
        rows: 8, cols: 8,
        grid: [
            0, 0, 0, 3, 0, 0, 0, 0,
            0, 0, 0, 3, 0, 0, 0, 0,
            0, 0, 0, 3, 0, 0, 0, 0,
            0, 0, 0, 3, 0, 0, 0, 0,
            0, 0, 0, 3, 0, 0, 0, 0,
            0, 0, 2, 2, 2, 0, 0, 0,
            0, 0, 0, 6, 0, 0, 0, 0,
            0, 0, 6, 6, 6, 0, 0, 0,
        ]
    },
    {
        name: 'Potion',
        rows: 8, cols: 8,
        grid: [
            0, 0, 6, 6, 6, 0, 0, 0,
            0, 0, 6, 6, 6, 0, 0, 0,
            0, 0, 9, 9, 9, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 0,
            0, 1, 4, 4, 1, 1, 0, 0,
            0, 1, 4, 4, 1, 1, 0, 0,
            0, 0, 1, 1, 1, 0, 0, 0,
        ]
    },
    {
        name: 'Alien',
        rows: 8, cols: 8,
        grid: [
            0, 0, 4, 4, 4, 4, 0, 0,
            0, 4, 4, 4, 4, 4, 4, 0,
            4, 4, 9, 9, 9, 9, 4, 4,
            4, 4, 2, 9, 9, 2, 4, 4,
            4, 4, 9, 9, 9, 9, 4, 4,
            4, 4, 4, 4, 4, 4, 4, 4,
            0, 4, 4, 4, 4, 4, 4, 0,
            0, 0, 4, 0, 0, 4, 0, 0,
        ]
    },
    {
        name: 'Heart',
        rows: 8, cols: 8,
        grid: [
            0, 2, 2, 0, 0, 2, 2, 0,
            2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2,
            2, 2, 2, 2, 2, 2, 2, 2,
            0, 2, 2, 2, 2, 2, 2, 0,
            0, 0, 2, 2, 2, 2, 0, 0,
            0, 0, 0, 2, 2, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ]
    },
    {
        name: 'Star',
        rows: 8, cols: 8,
        grid: [
            0, 0, 0, 3, 3, 0, 0, 0,
            0, 0, 0, 3, 3, 0, 0, 0,
            3, 3, 3, 3, 3, 3, 3, 3,
            3, 3, 3, 3, 3, 3, 3, 3,
            0, 3, 3, 3, 3, 3, 3, 0,
            0, 3, 3, 3, 3, 3, 3, 0,
            0, 3, 3, 0, 0, 3, 3, 0,
            3, 3, 0, 0, 0, 0, 3, 3,
        ]
    },
    {
        name: 'Rocket',
        rows: 8, cols: 8,
        grid: [
            0, 0, 1, 1, 1, 0, 0, 0,
            0, 0, 1, 9, 1, 0, 0, 0,
            0, 0, 1, 9, 1, 0, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 0,
            0, 1, 1, 1, 1, 1, 0, 0,
            0, 2, 1, 1, 1, 2, 0, 0,
            0, 0, 6, 1, 6, 0, 0, 0,
            0, 0, 6, 6, 6, 0, 0, 0,
        ]
    },
];

// Game State
const gameState = {
    currentScreen: 'start',
    currentLevel: 0,
    mode: 'puzzle',      // 'puzzle' or 'free'
    selectedColor: null,
    paintedCells: [],   // boolean per cell index (puzzle mode)
    freePaintCells: [], // color number per cell index (free paint mode), 0 = unpainted
    totalPaintable: 0,
    paintedCount: 0,
    levelsUnlocked: parseInt(localStorage.getItem('pixelPainter_unlocked')) || 1
};

// Background Music
const bgm = new Audio('bgm.mp3');
bgm.loop = true;
bgm.volume = 0.2;

let isMuted = localStorage.getItem('pixelPainter_muted') === 'true';
if (isMuted) bgm.muted = true;

let hasInteracted = false;
function enableAudio() {
    if (!hasInteracted) {
        hasInteracted = true;
        if (!isMuted) bgm.play().catch(e => console.log('Audio play failed:', e));
    }
}

const unlockAudio = () => {
    if (bgm && bgm.paused && !isMuted) bgm.play().catch(e => console.log('Autoplay deferred:', e));
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('click', unlockAudio);
};
document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });

// Audio Context for sound effects
let audioContext = null;
function initAudio() {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

function playSound(type) {
    if (!audioContext || isMuted) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.connect(gain);
    gain.connect(audioContext.destination);
    const now = audioContext.currentTime;

    if (type === 'paint') {
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.linearRampToValueAtTime(1000, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
        osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'select') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    } else if (type === 'complete') {
        const freqs = [523, 659, 784, 1047, 1319];
        freqs.forEach((f, i) => {
            const o = audioContext.createOscillator();
            const g = audioContext.createGain();
            o.connect(g); g.connect(audioContext.destination);
            o.frequency.setValueAtTime(f, now + i * 0.12);
            g.gain.setValueAtTime(0.25, now + i * 0.12);
            g.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.25);
            o.start(now + i * 0.12); o.stop(now + i * 0.12 + 0.25);
        });
    } else if (type === 'click') {
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
        osc.start(now); osc.stop(now + 0.05);
    }
}

// DOM Elements
const screens = {
    start: document.getElementById('startScreen'),
    game: document.getElementById('gameScreen'),
    levelComplete: document.getElementById('levelCompleteScreen'),
    levelSelect: document.getElementById('levelSelectScreen')
};

const el = {
    highScoreValue: document.getElementById('highScoreValue'),
    startBtn: document.getElementById('startBtn'),
    exitGameBtn: document.getElementById('exitGameBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    levelName: document.getElementById('levelName'),
    progressValue: document.getElementById('progressValue'),
    pixelGrid: document.getElementById('pixelGrid'),
    palette: document.getElementById('palette'),
    feedbackOverlay: document.getElementById('feedbackOverlay'),
    feedbackIcon: document.getElementById('feedbackIcon'),
    feedbackText: document.getElementById('feedbackText'),
    completedArtPreview: document.getElementById('completedArtPreview'),
    completedArtName: document.getElementById('completedArtName'),
    nextLevelBtn: document.getElementById('nextLevelBtn'),
    levelMenuBtn: document.getElementById('levelMenuBtn'),
    mainMenuBtn: document.getElementById('mainMenuBtn'),
    levelGrid: document.getElementById('levelGrid'),
    freePaintBtn: document.getElementById('freePaintBtn'),
    clearCanvasBtn: document.getElementById('clearCanvasBtn'),
    progressDisplay: document.getElementById('progressDisplay')
};

// Initialize
async function init() {
    await gameI18n.init('pixel-painter');
    el.highScoreValue.textContent = gameState.levelsUnlocked;

    el.startBtn.addEventListener('click', () => {
        initAudio();
        playSound('click');
        showLevelSelect();
    });

    el.nextLevelBtn.addEventListener('click', () => {
        playSound('click');
        const next = gameState.currentLevel + 1;
        if (next < LEVELS.length) {
            loadLevel(next);
            showScreen('game');
        } else {
            showLevelSelect();
        }
    });

    el.levelMenuBtn.addEventListener('click', () => {
        playSound('click');
        showLevelSelect();
    });

    el.mainMenuBtn.addEventListener('click', () => {
        playSound('click');
        showScreen('start');
        el.highScoreValue.textContent = gameState.levelsUnlocked;
    });

    el.exitGameBtn.addEventListener('click', () => {
        playSound('click');
        showLevelSelect();
    });

    el.freePaintBtn.addEventListener('click', () => {
        initAudio();
        playSound('click');
        loadFreePaint();
        showScreen('game');
    });

    el.clearCanvasBtn.addEventListener('click', () => {
        playSound('click');
        clearCanvas();
    });

    el.audioToggleBtn.addEventListener('click', toggleAudio);
    const audioToggleBtnGame = document.getElementById('audioToggleBtnGame');
    if (audioToggleBtnGame) audioToggleBtnGame.addEventListener('click', toggleAudio);
    const audioToggleBtnSelect = document.getElementById('audioToggleBtnSelect');
    if (audioToggleBtnSelect) audioToggleBtnSelect.addEventListener('click', toggleAudio);

    // Credits modal
    const creditsBtn = document.getElementById('creditsBtn');
    const creditsModal = document.getElementById('creditsModal');
    const closeCreditsBtn = document.getElementById('closeCreditsBtn');
    if (creditsBtn) creditsBtn.addEventListener('click', () => { playSound('click'); creditsModal.classList.add('show'); });
    if (closeCreditsBtn) closeCreditsBtn.addEventListener('click', () => { playSound('click'); creditsModal.classList.remove('show'); });
    if (creditsModal) creditsModal.addEventListener('click', (e) => { if (e.target === creditsModal) creditsModal.classList.remove('show'); });

    updateAudioToggleIcon();
}

function toggleAudio() {
    isMuted = !isMuted;
    bgm.muted = isMuted;
    localStorage.setItem('pixelPainter_muted', isMuted);
    updateAudioToggleIcon();
    if (isMuted) bgm.pause();
    else if (hasInteracted) bgm.play().catch(e => console.log('Audio play failed:', e));
}

function updateAudioToggleIcon() {
    const icon = isMuted ? '🔇' : '🔊';
    el.audioToggleBtn.textContent = icon;
    document.querySelectorAll('.sound-toggle-btn').forEach(b => b.textContent = icon);
}

function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    gameState.currentScreen = name;
}

function showLevelSelect() {
    renderLevelGrid();
    showScreen('levelSelect');
}

function renderLevelGrid() {
    el.levelGrid.innerHTML = '';
    LEVELS.forEach((level, idx) => {
        const card = document.createElement('button');
        card.className = 'level-card' + (idx >= gameState.levelsUnlocked ? ' locked' : '');
        const icon = document.createElement('span');
        icon.className = 'level-card-icon';
        icon.textContent = idx >= gameState.levelsUnlocked ? '🔒' : getLevelIcon(idx);
        const name = document.createElement('span');
        name.className = 'level-card-name';
        name.textContent = idx >= gameState.levelsUnlocked ? '???' : level.name;
        card.appendChild(icon);
        card.appendChild(name);
        if (idx < gameState.levelsUnlocked) {
            card.addEventListener('click', () => {
                playSound('click');
                loadLevel(idx);
                showScreen('game');
            });
        }
        el.levelGrid.appendChild(card);
    });
}

function getLevelIcon(idx) {
    const icons = ['⚔️', '🧪', '👽', '❤️', '⭐', '🚀'];
    return icons[idx] || '🎨';
}

function loadLevel(levelIdx) {
    gameState.currentLevel = levelIdx;
    gameState.mode = 'puzzle';
    const level = LEVELS[levelIdx];
    gameState.selectedColor = null;
    gameState.paintedCells = new Array(level.grid.length).fill(false);
    gameState.paintedCount = 0;
    gameState.totalPaintable = level.grid.filter(v => v !== 0).length;

    el.levelName.textContent = level.name;
    // Show progress, hide clear canvas button for puzzle mode
    el.progressDisplay.style.display = 'flex';
    el.clearCanvasBtn.style.display = 'none';
    renderGrid(level);
    renderPalette(level);
    updateProgress();
}

// Free Paint mode: large blank canvas, full palette, no win condition.
function loadFreePaint() {
    gameState.mode = 'free';
    gameState.selectedColor = null;
    const size = FREE_PAINT_SIZE;
    gameState.freePaintCells = new Array(size * size).fill(0); // 0 = unpainted

    el.levelName.textContent = t('freePaintTitle');
    // Hide progress, show clear canvas button for free paint mode
    el.progressDisplay.style.display = 'none';
    el.clearCanvasBtn.style.display = 'block';
    renderFreePaintGrid(size);
    renderFreePaintPalette();
}

function renderFreePaintGrid(size) {
    el.pixelGrid.innerHTML = '';
    el.pixelGrid.classList.add('free-paint-grid');
    el.pixelGrid.style.gridTemplateColumns = `repeat(${size}, 20px)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('button');
        cell.className = 'pixel-cell free-paint-cell';
        cell.dataset.idx = i;
        cell.textContent = '';
        cell.addEventListener('click', () => handleFreePaintCellTap(i, cell));
        el.pixelGrid.appendChild(cell);
    }
}

function renderFreePaintPalette() {
    el.palette.innerHTML = '';
    el.palette.classList.add('free-paint-palette');
    const colorNums = Object.keys(FREE_PAINT_COLORS).map(Number).sort((a, b) => a - b);
    colorNums.forEach(colorNum => {
        const btn = document.createElement('button');
        btn.className = 'palette-color';
        btn.style.background = FREE_PAINT_COLORS[colorNum];
        btn.textContent = colorNum;
        btn.dataset.colorNum = colorNum;
        btn.addEventListener('click', () => handleColorSelect(colorNum, btn));
        el.palette.appendChild(btn);
    });
}

function handleFreePaintCellTap(idx, cell) {
    initAudio();
    if (gameState.selectedColor === null) {
        showFeedback('🎨', t('selectColorFirst'));
        return;
    }
    // Paint the cell with the selected color (free — any color on any cell)
    gameState.freePaintCells[idx] = gameState.selectedColor;
    cell.style.background = FREE_PAINT_COLORS[gameState.selectedColor];
    cell.classList.add('painted');
    cell.textContent = '';
    playSound('paint');
}

function clearCanvas() {
    if (gameState.mode !== 'free') return;
    gameState.freePaintCells.fill(0);
    // Re-render the grid cells (clear backgrounds)
    const cells = el.pixelGrid.querySelectorAll('.pixel-cell');
    cells.forEach(cell => {
        cell.style.background = '';
        cell.classList.remove('painted');
        cell.textContent = '';
    });
    showFeedback('🧹', t('canvasCleared'));
}

function renderGrid(level) {
    el.pixelGrid.innerHTML = '';
    el.pixelGrid.classList.remove('free-paint-grid');
    el.palette.classList.remove('free-paint-palette');
    el.pixelGrid.style.gridTemplateColumns = `repeat(${level.cols}, 34px)`;
    level.grid.forEach((colorNum, idx) => {
        const cell = document.createElement('button');
        cell.className = 'pixel-cell';
        if (colorNum === 0) {
            // Empty cell — show nothing, not paintable
            cell.style.background = 'transparent';
            cell.style.cursor = 'default';
            cell.textContent = '';
        } else {
            cell.textContent = colorNum;
            cell.dataset.colorNum = colorNum;
            cell.dataset.idx = idx;
            cell.addEventListener('click', () => handleCellTap(idx, cell));
        }
        el.pixelGrid.appendChild(cell);
    });
}

function renderPalette(level) {
    el.palette.innerHTML = '';
    // Get unique color numbers used in this level
    const usedColors = [...new Set(level.grid.filter(v => v !== 0))].sort((a, b) => a - b);

    usedColors.forEach(colorNum => {
        const btn = document.createElement('button');
        btn.className = 'palette-color';
        btn.style.background = COLORS[colorNum];
        btn.textContent = colorNum;
        btn.dataset.colorNum = colorNum;
        btn.addEventListener('click', () => handleColorSelect(colorNum, btn));
        el.palette.appendChild(btn);
    });
}

function handleColorSelect(colorNum, btn) {
    initAudio();
    playSound('select');
    gameState.selectedColor = colorNum;
    // Update selected state
    el.palette.querySelectorAll('.palette-color').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function handleCellTap(idx, cell) {
    initAudio();
    if (gameState.paintedCells[idx]) return; // already painted
    if (gameState.selectedColor === null) {
        showFeedback('🎨', t('selectColorFirst'));
        return;
    }

    const level = LEVELS[gameState.currentLevel];
    const cellColor = level.grid[idx];

    if (cellColor === gameState.selectedColor) {
        // Correct! Paint the cell
        gameState.paintedCells[idx] = true;
        gameState.paintedCount++;
        cell.style.background = COLORS[cellColor];
        cell.classList.add('painted');
        cell.textContent = '';
        playSound('paint');
        updateProgress();
        checkColorComplete();
        if (gameState.paintedCount >= gameState.totalPaintable) {
            handleLevelComplete();
        }
    } else {
        // Wrong color — hint flash
        cell.classList.add('hint');
        setTimeout(() => cell.classList.remove('hint'), 500);
        playSound('select');
    }
}

function checkColorComplete() {
    const level = LEVELS[gameState.currentLevel];
    const usedColors = [...new Set(level.grid.filter(v => v !== 0))];
    usedColors.forEach(colorNum => {
        const allCellsOfColor = level.grid.map((v, i) => v === colorNum ? i : -1).filter(i => i >= 0);
        const allPainted = allCellsOfColor.every(i => gameState.paintedCells[i]);
        if (allPainted) {
            const paletteBtn = el.palette.querySelector(`[data-color-num="${colorNum}"]`);
            if (paletteBtn && !paletteBtn.classList.contains('complete')) {
                paletteBtn.classList.add('complete');
                paletteBtn.classList.remove('selected');
            }
        }
    });
    // Auto-deselect if current color is complete
    if (gameState.selectedColor !== null) {
        const selBtn = el.palette.querySelector(`[data-color-num="${gameState.selectedColor}"]`);
        if (selBtn && selBtn.classList.contains('complete')) {
            gameState.selectedColor = null;
        }
    }
}

function updateProgress() {
    const pct = gameState.totalPaintable > 0
        ? Math.round((gameState.paintedCount / gameState.totalPaintable) * 100)
        : 0;
    el.progressValue.textContent = pct + '%';
}

function handleLevelComplete() {
    playSound('complete');
    const level = LEVELS[gameState.currentLevel];

    // Unlock next level
    if (gameState.currentLevel + 1 >= gameState.levelsUnlocked && gameState.currentLevel + 1 < LEVELS.length) {
        gameState.levelsUnlocked = gameState.currentLevel + 2;
        localStorage.setItem('pixelPainter_unlocked', gameState.levelsUnlocked);
    }

    // Build the completed art preview
    el.completedArtName.textContent = level.name;
    el.completedArtPreview.innerHTML = '';
    el.completedArtPreview.style.gridTemplateColumns = `repeat(${level.cols}, 16px)`;
    level.grid.forEach(colorNum => {
        const cell = document.createElement('div');
        cell.className = 'preview-cell';
        cell.style.background = colorNum === 0 ? 'transparent' : COLORS[colorNum];
        el.completedArtPreview.appendChild(cell);
    });

    showFeedback('🎉', t('complete'));

    setTimeout(() => {
        showScreen('levelComplete');
    }, 1000);
}

function showFeedback(icon, text) {
    el.feedbackIcon.textContent = icon;
    el.feedbackText.textContent = text;
    el.feedbackOverlay.classList.remove('show');
    void el.feedbackOverlay.offsetWidth;
    el.feedbackOverlay.classList.add('show');
    setTimeout(() => el.feedbackOverlay.classList.remove('show'), 600);
}

// Start
init();
