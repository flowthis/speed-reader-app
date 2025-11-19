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

    // State
    let words = [];
    let currentIndex = 0;
    let isPlaying = false;
    let intervalId = null;
    let wpm = 300;

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

        const interval = 60000 / wpm;

        intervalId = setInterval(() => {
            if (currentIndex >= words.length) {
                stopReading();
                toggleControls(false);
                startBtn.textContent = 'Start Reading'; // Reset to start when finished
                currentIndex = 0; // Reset index
                return;
            }

            displayWord(words[currentIndex]);
            currentIndex++;
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
    }

    function displayWord(word) {
        // Find the "optimal recognition point" (ORP) - roughly center or slightly left of center
        // For simplicity in this version, we'll just display the word.
        // To add the "bold syllable" effect requested (or similar focus point):
        
        const centerIndex = Math.floor(word.length / 2);
        const firstPart = word.substring(0, centerIndex);
        const pivot = word[centerIndex];
        const lastPart = word.substring(centerIndex + 1);

        wordDisplay.innerHTML = `${firstPart}<span class="highlight-syllable">${pivot}</span>${lastPart}`;
    }
});
