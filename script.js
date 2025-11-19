document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const textInput = document.getElementById('text-input');
    const displayArea = document.getElementById('display-area');
    const inputArea = document.getElementById('input-area');
    const wordDisplay = document.getElementById('word-display');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const wpmSlider = document.getElementById('wpm-slider');
    const wpmValue = document.getElementById('wpm-value');
    const progressBar = document.getElementById('progress-bar');
    const chunkSelect = document.getElementById('chunk-select');

    // State
    let words = [];
    let currentIndex = 0;
    let isPlaying = false;
    let intervalId = null;
    let wpm = 300;
    let wordsPerChunk = 1;

    // Initialize
    wpmSlider.value = wpm;
    wpmValue.textContent = wpm;

    // Event Listeners
    wpmSlider.addEventListener('input', (e) => {
        wpm = parseInt(e.target.value);
        wpmValue.textContent = wpm;
        if (isPlaying) {
            stopReading();
            startReading();
        }
    });

    chunkSelect.addEventListener('change', (e) => {
        wordsPerChunk = parseInt(e.target.value);
        if (isPlaying) {
            stopReading();
            startReading();
        }
    });

    startBtn.addEventListener('click', () => {
        if (words.length === 0) {
            const text = textInput.value.trim();
            if (!text) return;
            processText(text);
        }

        toggleView(true);
        startReading();
    });

    pauseBtn.addEventListener('click', () => {
        stopReading();
        toggleControls(false);
    });

    resetBtn.addEventListener('click', () => {
        stopReading();
        resetApp();
    });

    // Functions
    function processText(text) {
        // Simple split by whitespace, filtering empty strings
        words = text.split(/\s+/).filter(word => word.length > 0);
        currentIndex = 0;
        updateProgress();
    }

    function toggleView(showReader) {
        if (showReader) {
            inputArea.classList.add('hidden');
            displayArea.classList.remove('hidden');
        } else {
            inputArea.classList.remove('hidden');
            displayArea.classList.add('hidden');
        }
    }

    function toggleControls(playing) {
        if (playing) {
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
        } else {
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            startBtn.textContent = currentIndex > 0 ? 'Resume' : 'Start Reading';
        }
    }

    function startReading() {
        if (currentIndex >= words.length) {
            currentIndex = 0;
        }

        isPlaying = true;
        toggleControls(true);

        // Calculate interval based on WPM and words per chunk
        // WPM is words per minute.
        // If we show N words at a time, the delay should be N times longer to maintain the same WPM.
        const interval = (60000 / wpm) * wordsPerChunk;

        intervalId = setInterval(() => {
            if (currentIndex >= words.length) {
                stopReading();
                toggleControls(false);
                startBtn.textContent = 'Start Reading'; // Reset to start when finished
                currentIndex = 0; // Reset index
                updateProgress();
                return;
            }

            const chunk = words.slice(currentIndex, currentIndex + wordsPerChunk).join(' ');
            displayWord(chunk);
            currentIndex += wordsPerChunk;
            updateProgress();
        }, interval);
    }

    function stopReading() {
        isPlaying = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function resetApp() {
        stopReading();
        words = [];
        currentIndex = 0;
        toggleView(false);
        toggleControls(false);
        startBtn.textContent = 'Start Reading';
        wordDisplay.textContent = 'Ready';
        updateProgress();
    }

    function updateProgress() {
        const progress = words.length > 0 ? Math.min((currentIndex / words.length) * 100, 100) : 0;
        progressBar.style.width = `${progress}%`;
    }

    function displayWord(word) {
        // If displaying multiple words, just show them centered without highlighting
        if (wordsPerChunk > 1) {
            wordDisplay.textContent = word;
            return;
        }

        // Find the "optimal recognition point" (ORP) - roughly center or slightly left of center
        const centerIndex = Math.floor(word.length / 2);
        const firstPart = word.substring(0, centerIndex);
        const pivot = word[centerIndex];
        const lastPart = word.substring(centerIndex + 1);

        wordDisplay.innerHTML = `${firstPart}<span class="highlight-syllable">${pivot}</span>${lastPart}`;
    }
});
