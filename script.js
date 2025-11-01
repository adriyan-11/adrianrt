
const mainMenu = document.querySelector(".mainMenu")
const closeMenu = document.querySelector(".closeMenu")
const openMenu = document.querySelector(".openMenu")
const menu_items = document.querySelectorAll("nav .mainMenu li a")

openMenu.addEventListener("click", show)
closeMenu.addEventListener("click", close)

// Close menu when you click on a menu item
menu_items.forEach((item) => {
  item.addEventListener("click", () => {
    close()
  })
})

function show() {
  mainMenu.style.display = "flex"
  mainMenu.style.top = "0"
}

function close() {
  mainMenu.style.top = "-100%"
}

// Add resize event listener to handle menu visibility on screen size change
window.addEventListener("resize", () => {
  if (window.innerWidth > 800) {
    mainMenu.style.display = "flex"
    mainMenu.style.top = "0"
  } else {
    mainMenu.style.display = "none"
    mainMenu.style.top = "-100%"
  }
})























/* Slideshow JS */


document.addEventListener('DOMContentLoaded', function() {
    // Photo Slideshow Logic
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    // Function to show the next slide
    function showNextSlide() {
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide (loop back to 0 if at end)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Show new slide
        slides[currentSlide].classList.add('active');
    }

    // Initialize: Show the first slide
    if (slides.length > 0) {
        slides[0].classList.add('active');
        
        // Auto-advance every 3 seconds (adjust as needed)
        setInterval(showNextSlide, 1000);
    }

    // Music Player Logic (now handled by HTML autoplay; no JS needed here)
});

/* Continuous right-to-left marquee-style slideshow */
(function() {
  const container = document.querySelector('.slideshow-container');
  if (!container) return;

  // Collect existing .slide images and move them into a track
  const images = Array.from(container.querySelectorAll('.slide'));
  if (images.length === 0) return;

  // Create track element
  const track = document.createElement('div');
  track.className = 'slide-track';

  // Move images into track
  images.forEach(img => track.appendChild(img));

  // Duplicate slides to allow seamless looping
  images.forEach(img => {
    const clone = img.cloneNode(true);
    track.appendChild(clone);
  });

  // Clear container and append track
  container.innerHTML = '';
  container.appendChild(track);

  // Compute total width of one set of slides (originals) including gaps
  // Use getBoundingClientRect after appending to the DOM
  requestAnimationFrame(() => {
    const firstSetWidth = images.reduce((sum, img) => sum + img.getBoundingClientRect().width, 0) + (images.length - 1) * 10; // 10px gap from CSS

    // Determine animation duration based on width (pixels per second)
    const pxPerSecond = 200; // speed: increase to go faster
    const duration = Math.max(8, firstSetWidth / pxPerSecond);

    // Apply CSS animation to track
    const animationName = `scroll-${Date.now()}`;
    const keyframes = `@keyframes ${animationName} { from { transform: translateX(0); } to { transform: translateX(-${firstSetWidth}px); } }`;

    // Inject keyframes into a style tag
    const style = document.createElement('style');
    style.innerHTML = keyframes + ` .slide-track { animation: ${animationName} ${duration}s linear infinite; }`;
    document.head.appendChild(style);

    // Pause on hover
    container.addEventListener('mouseenter', () => container.classList.add('pause'));
    container.addEventListener('mouseleave', () => container.classList.remove('pause'));
  });
})();

/* Center detection: add .center to the slide nearest the visible container center */
(function() {
  const container = document.querySelector('.slideshow-container');
  if (!container) return;

  let track = container.querySelector('.slide-track');
  if (!track) return;

  let rafId = null;
  let lastCentered = null;
  let lastCheck = 0;

  function updateCenter() {
    const now = performance.now();
    // throttle to ~100ms
    if (now - lastCheck < 90) {
      rafId = requestAnimationFrame(updateCenter);
      return;
    }
    lastCheck = now;
    const slides = Array.from(track.querySelectorAll('.slide'));
    if (slides.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;

    let nearest = null;
    let nearestDist = Infinity;

    slides.forEach(slide => {
      const r = slide.getBoundingClientRect();
      const slideCenter = r.left + r.width / 2;
      const dist = Math.abs(slideCenter - centerX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = slide;
      }
    });

    // Only update DOM when the centered slide actually changes
    if (nearest && nearest !== lastCentered) {
      if (lastCentered) lastCentered.classList.remove('center');
      nearest.classList.add('center');
      lastCentered = nearest;
    }

    rafId = requestAnimationFrame(updateCenter);
  }

  // Start checking when the page is visible
  function start() {
    if (!rafId) updateCenter();
  }
  function stop() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  // Start updates
  start();

  // Restart on resize (recompute positions)
  window.addEventListener('resize', () => {
    // small debounce
    stop();
    setTimeout(start, 120);
  });



  // Keep center detection running even when user hovers so the pop-up remains automatic
})();
















  /* Auto-update copyright year in index.html */
  (function updateCopyrightYear(){
    try {
      const el = document.getElementById('year');
      if (el) el.textContent = new Date().getFullYear();
    } catch (e) { /* ignore on pages without the element */ }
  })();

  /* Total run time display for about.html */
  (function runTimeCounter(){
    const el = document.getElementById('runTime');
    if (!el) return;

    // Read start from data-start attribute (ISO string). Default: 2020-01-01
    const startAttr = el.getAttribute('data-start') || '2020-01-01T00:00:00Z';
    const start = new Date(startAttr);
    if (isNaN(start)) {
      el.textContent = 'Invalid start date';
      return;
    }

    function formatElapsed(ms) {
      const totalSec = Math.floor(ms / 1000);
      const years = Math.floor(totalSec / (3600*24*365));
      const days = Math.floor((totalSec % (3600*24*365)) / (3600*24));
      const hours = Math.floor((totalSec % (3600*24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      const parts = [];
      if (years) parts.push(years + 'y');
      if (days) parts.push(days + 'd');
      parts.push(String(hours).padStart(2,'0') + 'h');
      parts.push(String(minutes).padStart(2,'0') + 'm');
      parts.push(String(seconds).padStart(2,'0') + 's');
      return parts.join(' ');
    }

    function update() {
      const now = new Date();
      const elapsed = now - start;
      el.textContent = formatElapsed(elapsed);
    }

    update();
    setInterval(update, 1000);
  })();