let angle = 0;

/* =========================
CANVAS SETUP
========================= */

const canvas = document.getElementById("visualizerCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 300;
canvas.height = 300;

/* =========================
AUDIO SETUP
========================= */

const audio = document.getElementById("audio");

let audioCtx;
let analyser;
let source;
let dataArray;

/* =========================
START AUDIO
========================= */

audio.addEventListener("play", () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();

        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
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
    GLOW INTENSITY (FIXED ORDER)
    ========================= */

    let bass = 0;

    for (let i = 0; i < 10; i++) {
        bass += dataArray[i];
    }

    bass = bass / 10;

    const glow = bass / 255;

    /* =========================
    BACKGROUND GLOW
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

    for (let i = 0; i < dataArray.length; i++) {

        const a = (i / dataArray.length) * Math.PI * 2;

        const barHeight = dataArray[i] / 2;

        const x1 = centerX + Math.cos(a) * radius;
        const y1 = centerY + Math.sin(a) * radius;

        const x2 = centerX + Math.cos(a) * (radius + barHeight);
        const y2 = centerY + Math.sin(a) * (radius + barHeight);

        const alpha = dataArray[i] / 255;

        ctx.strokeStyle = `rgba(255,215,0,${alpha})`;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    /* =========================
    CENTER CORE (FIXED)
    ========================= */

    ctx.beginPath();
    ctx.arc(centerX, centerY, 22 + glow * 10, 0, Math.PI * 2);

    ctx.fillStyle = `rgba(255,215,0,${0.7 + glow * 0.3})`;

    ctx.shadowBlur = 30 + glow * 50;
    ctx.shadowColor = "gold";

    ctx.fill();

    /* =========================
    DHARMA CHAKRA
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
}
