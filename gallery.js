// Mouse-reactive floating gallery (smoothed, pointer + touch)

(() => {
  const container = document.getElementById('galleryInner');
  if (!container) return;

  const floats = Array.from(container.querySelectorAll('.floating'));
  const items = floats.map((el) => ({
    el,
    depth: parseFloat(el.dataset.depth) || 0.08,
    lastTx: null,
    lastTy: null,
    lastRot: null,
  }));
  const infoTitle = document.getElementById('galleryInfoTitle');
  const infoText = document.getElementById('galleryInfoText');
  const infoPanel = document.getElementById('galleryInfo');
  let infoHideTimer = null;
  let rafId = null;

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

    if (infoPanel && !infoPanel.classList.contains('is-hidden')) {
      infoPanel.classList.remove('animate__fadeIn');
      infoPanel.classList.add('animate__animated', 'animate__fadeOut');

      const handlePanelFadeOutEnd = () => {
        infoPanel.removeEventListener('animationend', handlePanelFadeOutEnd);
        infoPanel.classList.remove('animate__fadeOut');
        infoPanel.classList.add('is-hidden');
      };

      infoPanel.addEventListener('animationend', handlePanelFadeOutEnd, { once: true });
    }
  }

  // state
  let pointerX = 0, pointerY = 0;
  let targetX = 0, targetY = 0;
  let width = window.innerWidth, height = window.innerHeight;
  let idleFrames = 0;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, n) => a + (b - a) * n;

  window.addEventListener('resize', () => { width = window.innerWidth; height = window.innerHeight; });

  function onPointer(e) {
    const x = (e.clientX ?? e.touches?.[0]?.clientX) ?? width/2;
    const y = (e.clientY ?? e.touches?.[0]?.clientY) ?? height/2;
    // center-relative coordinates
    pointerX = x - width / 2;
    pointerY = y - height / 2;
    startLoop();
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

  function startLoop() {
    if (rafId !== null) return;
    idleFrames = 0;
    rafId = requestAnimationFrame(animate);
  }

  // animation loop with smoothing and auto-pause when idle
  function animate() {
    // smooth target follow
    targetX = lerp(targetX, pointerX, 0.1);
    targetY = lerp(targetY, pointerY, 0.1);

    let changed = false;

    items.forEach((item) => {
      const tx = clamp(targetX * item.depth, -120, 120);
      const ty = clamp(targetY * item.depth, -120, 120);
      const rot = (tx / 100) * (item.depth * 6);

      const isFirstPaint = item.lastTx === null || item.lastTy === null || item.lastRot === null;
      const moved = isFirstPaint || Math.abs(tx - item.lastTx) > 0.15 || Math.abs(ty - item.lastTy) > 0.15 || Math.abs(rot - item.lastRot) > 0.03;
      if (!moved) return;

      changed = true;
      item.lastTx = tx;
      item.lastTy = ty;
      item.lastRot = rot;
      item.el.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rot}deg)`;
    });

    if (changed) {
      idleFrames = 0;
    } else {
      idleFrames += 1;
    }

    // stop loop after short idle period to reduce CPU/GPU usage
    if (idleFrames > 18) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });

  // initialize
  floats.forEach((el) => {
    const setInfo = () => {
      if (!infoTitle || !infoText) return;

      if (infoPanel) {
        infoPanel.classList.remove('is-hidden', 'animate__fadeOut');
        infoPanel.classList.add('animate__animated', 'animate__fadeIn');

        const handlePanelFadeInEnd = () => {
          infoPanel.removeEventListener('animationend', handlePanelFadeInEnd);
          infoPanel.classList.remove('animate__fadeIn');
        };

        infoPanel.addEventListener('animationend', handlePanelFadeInEnd, { once: true });
      }

      swapWithFade(infoTitle, el.dataset.title || 'Imagen');
      swapWithFade(infoText, el.dataset.description || 'Sin descripcion disponible.');

      if (infoHideTimer) clearTimeout(infoHideTimer);
      infoHideTimer = setTimeout(() => {
        hideInfoWithFade();
      }, 5000);
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
  startLoop();
})();

