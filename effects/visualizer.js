
let angle = 0;


/* =========================
CANVAS SETUP
========================= */

const canvas = document.getElementById("visualizerCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

/* =========================
AUDIO CONTEXT SETUP
========================= */

const audio = document.getElementById("audio");

let audioCtx;
let analyser;
let source;
let dataArray;

/* =========================
INIT AUDIO CONTEXT (on play)
========================= */

audio.addEventListener("play", () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();

        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
    }

    draw();
});

/* =========================
DRAW LOOP
========================= */

function draw() {
    requestAnimationFrame(draw);

    if (!analyser) return;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const radius = 80;

    /* =========================
    BACKGROUND GLOW CIRCLE
    ========================= */

    const gradient = ctx.createRadialGradient(
        centerX, centerY, 10,
        centerX, centerY, 120
    );

    gradient.addColorStop(0, "rgba(255,215,0,0.3)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, 120, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    /* =========================
    CIRCULAR BARS
    ========================= */

    const bars = dataArray.length;

    for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;

        const barHeight = dataArray[i] / 2;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;

        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        const alpha = dataArray[i] / 255;

        ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

   /* =========================
CENTER CORE (POLISHED)
========================= */

ctx.beginPath();
ctx.arc(centerX, centerY, 22 + glow * 10, 0, Math.PI * 2);

ctx.fillStyle = `rgba(255,215,0,${0.8 + glow})`;

ctx.shadowBlur = 30 + glow * 50;
ctx.shadowColor = "gold";

ctx.fill();
/* =========================
BEAT INTENSITY
========================= */

let bass = 0;

for (let i = 0; i < 10; i++) {
    bass += dataArray[i];
}

bass = bass / 10;

/* glow intensity based on bass */
const glow = bass / 255;
    /* =========================
DHARMA CHAKRA ROTATION
========================= */

angle += 0.01;

ctx.save();
ctx.translate(centerX, centerY);
ctx.rotate(angle);

ctx.strokeStyle = "rgba(255,215,0,0.4)";
ctx.lineWidth = 1;

for (let i = 0; i < 8; i++) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.lineTo(0, 60);
    ctx.stroke();
}

ctx.restore();
