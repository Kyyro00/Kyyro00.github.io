const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  let reveal = document.getElementById("reveal-text");
  if (!reveal) {
    reveal = document.createElement("p");
    reveal.id = "reveal-text";
    reveal.className = "reveal-text";
    reveal.textContent = "página en servicio, espera a la próxima actualización";
    const normalText = document.querySelector(".normal-text");
    const hero = document.querySelector(".hero");
    if (normalText && hero) {
      hero.insertBefore(reveal, normalText);
    } else if (hero) {
      hero.appendChild(reveal);
    }
    requestAnimationFrame(() => {
      reveal.classList.add("is-visible");
    });
    return;
  }

  reveal.remove();
});

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

for (let i = 0; i < 100; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 3
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    ctx.fillStyle = "white";
    ctx.fillRect(p.x, p.y, p.size, p.size);
    p.y += 0.5;
    if (p.y > canvas.height) p.y = 0;
  });

  requestAnimationFrame(animate);
}

animate();