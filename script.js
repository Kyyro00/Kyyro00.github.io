const btn = document.getElementById("btn");

function createRevealText() {
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
  }
}

function removeRevealText() {
  let reveal = document.getElementById("reveal-text");
  if (reveal) {
    reveal.remove();
  }
}

btn.addEventListener("click", () => {
  let reveal = document.getElementById("reveal-text");
  if (!reveal) {
    createRevealText();
    localStorage.setItem("revealTextVisible", "true");
    return;
  }

  removeRevealText();
  localStorage.setItem("revealTextVisible", "false");
});

if (localStorage.getItem("revealTextVisible") === "true") {
  createRevealText();
}

const canvas = document.createElement("canvas");
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "100";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Calculate navbar height dynamically from the actual navbar element
const navbar = document.querySelector(".navbar");
const navbarHeight = navbar ? navbar.offsetHeight : 60; // fallback 60px if navbar not found

let particles = [];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    // Start from navbar height (stars fall from the control bar)
    y: navbarHeight - Math.random() * (navbarHeight * 0.5),
    size: Math.random() * 3,
    velocityY: 0.7,  // Add velocity property for bounce effect
    maxBounces: Math.floor(Math.random() * 2) + 1, // 1-3 random bounces
    bounceCount: 0 // Track how many times bounced
  };
}

// Start with a few particles
for (let i = 0; i < 10; i++) {
  particles.push(createParticle());
}

// Get the H1 element for collision detection
const h1 = document.querySelector("h1");

function getH1Bounds() {
  if (!h1) return null;
  const rect = h1.getBoundingClientRect();
  return {
    top: rect.top,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right
  };
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Randomly create new particles (15% chance each frame to create 2-5 new ones)
  if (Math.random() < 0.15) {
    const newCount = Math.floor(Math.random() * 4) + 2; // 2-5 new particles
    for (let i = 0; i < newCount; i++) {
      particles.push(createParticle());
    }
  }
  
  const h1Bounds = getH1Bounds();
  
  particles.forEach((p, index) => {
    ctx.fillStyle = "white";
    ctx.fillRect(p.x, p.y, p.size, p.size);
    
    // Check collision with H1
    if (h1Bounds && 
        p.y + p.size >= h1Bounds.top && 
        p.y <= h1Bounds.bottom &&
        p.x + p.size >= h1Bounds.left &&
        p.x <= h1Bounds.right &&
        p.bounceCount < p.maxBounces) {
      // Only bounce if particle hasn't reached max bounces
      p.bounceCount++;
      p.velocityY = -Math.abs(p.velocityY) * 1; // Bounce with damping
      p.y = h1Bounds.top - p.size - 5;
    }
    
    p.y += p.velocityY;
    
    // Gravity effect: gradually increase downward velocity
    p.velocityY += 0.03;
    
    if (p.y > canvas.height) {
      // Remove particle when it goes off screen
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();