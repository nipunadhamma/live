/* =========================
PARTICLE CANVAS SETUP
========================= */

const canvasP = document.createElement("canvas");
const ctxP = canvasP.getContext("2d");

document.body.appendChild(canvasP);

canvasP.style.position = "absolute";
canvasP.style.top = "0";
canvasP.style.left = "0";
canvasP.style.width = "100%";
canvasP.style.height = "100%";
canvasP.style.zIndex = "1";
canvasP.style.pointerEvents = "none";

resizeCanvas();

/* =========================
RESIZE
========================= */

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
    canvasP.width = window.innerWidth;
    canvasP.height = window.innerHeight;
}

/* =========================
PARTICLES ARRAY
========================= */

const particles = [];

const PARTICLE_COUNT = 80;

/* create particles */
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * canvasP.width,
        y: Math.random() * canvasP.height,
        size: Math.random() * 2 + 1,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.2
    });
}

/* =========================
ANIMATION LOOP
========================= */

function animateParticles() {
    requestAnimationFrame(animateParticles);

    ctxP.clearRect(0, 0, canvasP.width, canvasP.height);

    for (let p of particles) {
        p.y -= p.speedY;
        p.x += p.speedX;

        /* reset when out of screen */
        if (p.y < -10) {
            p.y = canvasP.height + 10;
            p.x = Math.random() * canvasP.width;
        }

        if (p.x < 0 || p.x > canvasP.width) {
            p.x = Math.random() * canvasP.width;
        }

        /* draw particle */
        ctxP.beginPath();
        ctxP.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctxP.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
        ctxP.shadowBlur = 10;
        ctxP.shadowColor = "gold";

        ctxP.fill();
    }
}

animateParticles();
