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
LOAD AUDIO FILE
========================= */

audioFile.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
});

/* =========================
PLAY / PAUSE / STOP
========================= */

playBtn.addEventListener("click", () => {
    audio.play();
});

pauseBtn.addEventListener("click", () => {
    audio.pause();
});

stopBtn.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;
});

/* =========================
TIME UPDATE
========================= */

audio.addEventListener("loadedmetadata", () => {
    seekBar.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
    seekBar.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

/* =========================
SEEK BAR
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
    const elem = document.documentElement;

    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        elem.requestFullscreen();
    }
});

/* =========================
FORMAT TIME
========================= */

function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
