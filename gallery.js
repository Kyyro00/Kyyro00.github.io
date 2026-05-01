// Mouse-reactive floating gallery script

(() => {
      const container = document.getElementById('galleryInner');
      if (!container) return;

      const floats = Array.from(container.querySelectorAll('.floating'));

      let mouseX = 0, mouseY = 0;
      let winW = window.innerWidth, winH = window.innerHeight;

      window.addEventListener('resize', () => { winW = window.innerWidth; winH = window.innerHeight; });

      window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - winW / 2;
            mouseY = e.clientY - winH / 2;
      });

      // gentle follow using requestAnimationFrame
      function render() {
            floats.forEach(el => {
                  const depth = parseFloat(el.dataset.depth) || 0.08;
                  const tx = mouseX * depth;
                  const ty = mouseY * depth;
                  const rotate = tx * 0.02;
                  el.style.transform = `translate3d(calc(-50% + ${tx}px), calc(-50% + ${ty}px), 0) rotate(${rotate}deg)`;
            });
            requestAnimationFrame(render);
      }

      // initial minor animation loop to keep floating feeling
      floats.forEach((el, i) => {
            const delay = (i % 3) * 300;
            el.style.transition = 'transform 220ms linear';
            setTimeout(() => {
                  el.style.transition = 'transform 160ms linear';
            }, delay);
      });

      render();
})();
// Gallery specific scripts

window.onmousemove = e => {
  const mouseX = e.clientX,
        mouseY = e.clientY;
  
  const xDecimal = mouseX / window.innerWidth,
        yDecimal = mouseY / window.innerHeight;
  
  const maxX = gallery.offsetWidth - window.innerWidth,
        maxY = gallery.offsetHeight - window.innerHeight;
  
  const panX = maxX * xDecimal * -1,
        panY = maxY * yDecimal * -1;
  
  gallery.animate({
    transform: `translate(${panX}px, ${panY}px)`
  }, {
    duration: 4000,
    fill: "forwards",
    easing: "ease"
  })
}ery specific scripts

