(function(){
  // Very small lazy-loader: sets loading=lazy and uses thumbnails if available.
  const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

  function setUpImages() {
    const imgs = Array.from(document.querySelectorAll('.slideshow-container img, .gallery-container img'));
    if (!imgs.length) return;

    imgs.forEach(img => {
      if (img.dataset.handled) return;
      img.dataset.handled = '1';

      const orig = img.getAttribute('src');
      if (!orig) return;
      img.dataset.full = orig;
      const base = orig.split('/').pop();
      img.dataset.thumb = `assets/thumbs/${base.split('.').slice(0,-1).join('.')}.jpg`;

      // For gallery grid / polaroid images: do not overwrite the src — leave the original so they display immediately.
      const isGallery = !!(img.closest('.gallery-container') || img.closest('.polaroid'));
      img.loading = 'lazy';
      img.classList.add('lazy-img');

      if (isGallery) {
        // keep original src so polaroids are visible even if thumbnails aren't generated
        console.debug('[lazyload] gallery image, leaving src as', img.dataset.full);
        return;
      }

      // For slideshow / large images: try thumbnails first, otherwise placeholder to avoid heavy initial downloads
      console.debug('[lazyload] slideshow image, thumb:', img.dataset.thumb);
      fetch(img.dataset.thumb, { method: 'HEAD' }).then(res => {
        if (res.ok) {
          img.src = img.dataset.thumb;
          console.debug('[lazyload] using thumb', img.dataset.thumb);
        } else {
          img.src = PLACEHOLDER;
          console.debug('[lazyload] thumb not found, using placeholder for', img.dataset.full);
        }
      }).catch(() => {
        img.src = PLACEHOLDER;
        console.debug('[lazyload] thumb check failed, using placeholder for', img.dataset.full);
      });
    });

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.full) {
            el.src = el.dataset.full;
            delete el.dataset.full;
          }
          obs.unobserve(el);
        });
      }, { rootMargin: '200px 0px' });

      imgs.forEach(i => io.observe(i));
    } else {
      // fallback immediate progressive load
      window.addEventListener('scroll', () => {
        imgs.forEach(i => {
          if (i.dataset.full) {
            const r = i.getBoundingClientRect();
            if (r.top < window.innerHeight + 200) {
              i.src = i.dataset.full;
              delete i.dataset.full;
            }
          }
        });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setUpImages);
  else setUpImages();
})();
