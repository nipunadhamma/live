/* =========================
ELEMENTS
========================= */

const audio = document.getElementById("audio");
const audioFile = document.getElementById("audioFile");

const playBtn = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const stopBtn = document.getElementById("stopBtn");

const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const volume = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreenBtn");

/* =========================
LOAD AUDIO
========================= */

audioFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audio.src = url;
});

/* =========================
PLAY CONTROLS
========================= */

playBtn.addEventListener("click", () => audio.play());

pauseBtn.addEventListener("click", () => audio.pause());

stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
});

/* =========================
TIME UPDATE
========================= */

audio.addEventListener("loadedmetadata", () => {
    seekBar.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

/* =========================
SEEK
========================= */

seekBar.addEventListener("input", () => {
    audio.currentTime = seekBar.value;
});

/* =========================
VOLUME
========================= */

volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

/* =========================
FULLSCREEN
========================= */

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

/* =========================
FORMAT TIME
========================= */

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/* =========================
AUTO HIDE UI (SMOOTH + STABLE)
========================= */

let uiTimeout;

function showUI() {
    document.getElementById("controls").style.opacity = "1";
    document.getElementById("bottomPanel").style.opacity = "1";
}

function hideUI() {
    document.getElementById("controls").style.opacity = "0";
    document.getElementById("bottomPanel").style.opacity = "0";
}

function resetUIHideTimer() {
    showUI();

    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => {
        hideUI();
    }, 3000);
}

/* better than raw mousemove spam */
document.addEventListener("mousemove", resetUIHideTimer);
document.addEventListener("keydown", resetUIHideTimer);
document.addEventListener("click", resetUIHideTimer);

/* initial state */
resetUIHideTimer();
