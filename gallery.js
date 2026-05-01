// Mouse-reactive floating gallery (smoothed, pointer + touch)

(() => {
  const container = document.getElementById('galleryInner');
  if (!container) return;

  const floats = Array.from(container.querySelectorAll('.floating'));
  const infoTitle = document.getElementById('galleryInfoTitle');
  const infoText = document.getElementById('galleryInfoText');
  let infoHideTimer = null;

  function swapWithFade(el, nextValue) {
    if (!el || typeof nextValue !== 'string') return;
    if (el.textContent === nextValue) return;

    el.classList.remove('animate__fadeOut');
    el.classList.remove('animate__fadeIn');
    el.classList.add('animate__animated', 'animate__fadeOut');

    const handleFadeOutEnd = () => {
      el.removeEventListener('animationend', handleFadeOutEnd);
      el.textContent = nextValue;
      el.classList.remove('animate__fadeOut');
      el.classList.add('animate__fadeIn');

      const handleFadeInEnd = () => {
        el.removeEventListener('animationend', handleFadeInEnd);
        el.classList.remove('animate__fadeIn');
      };

      el.addEventListener('animationend', handleFadeInEnd, { once: true });
    };

    el.addEventListener('animationend', handleFadeOutEnd, { once: true });
  }

  function hideInfoWithFade() {
    [infoTitle, infoText].forEach((el) => {
      if (!el || !el.textContent.trim()) return;

      el.classList.remove('animate__fadeIn');
      el.classList.add('animate__animated', 'animate__fadeOut');

      const handleFadeOutEnd = () => {
        el.removeEventListener('animationend', handleFadeOutEnd);
        el.textContent = '';
        el.classList.remove('animate__fadeOut');
      };

      el.addEventListener('animationend', handleFadeOutEnd, { once: true });
    });
  }

  // state
  let pointerX = 0, pointerY = 0;
  let targetX = 0, targetY = 0;
  let width = window.innerWidth, height = window.innerHeight;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, n) => a + (b - a) * n;

  window.addEventListener('resize', () => { width = window.innerWidth; height = window.innerHeight; });

  function onPointer(e) {
    const x = (e.clientX ?? e.touches?.[0]?.clientX) ?? width/2;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) ?? height/2;
    // center-relative coordinates
    pointerX = x - width / 2;
    pointerY = y - height / 2;
  }

  // pointer + touch
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('touchmove', onPointer, { passive: true });

  // show entrance
  function reveal() {
    floats.forEach((el, i) => {
      setTimeout(() => el.classList.add('show'), i * 80);
    });
  }

  // animation loop with smoothing
  function animate() {
    // smooth target follow
    targetX = lerp(targetX, pointerX, 0.08);
    targetY = lerp(targetY, pointerY, 0.08);

    floats.forEach(el => {
      const depth = parseFloat(el.dataset.depth) || 0.08;
      const tx = clamp(targetX * depth, -120, 120);
      const ty = clamp(targetY * depth, -120, 120);
      const rot = (tx / 100) * (depth * 6);
      el.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rot}deg)`;
    });

    requestAnimationFrame(animate);
  }

  // initialize
  floats.forEach((el) => {
    const setInfo = () => {
      if (!infoTitle || !infoText) return;
      swapWithFade(infoTitle, el.dataset.title || 'Imagen');
      swapWithFade(infoText, el.dataset.description || 'Sin descripcion disponible.');

      if (infoHideTimer) clearTimeout(infoHideTimer);
      infoHideTimer = setTimeout(() => {
        hideInfoWithFade();
      }, 10000);
    };

    el.addEventListener('click', setInfo);
    el.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        setInfo();
      }
    });
  });

  reveal();
  animate();
})();

