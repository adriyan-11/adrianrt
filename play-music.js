(function(){
  // Try to autoplay background music; if blocked, try muted autoplay; if still blocked show a play/unmute button.
  const ID = 'background-music';
  const BTN_ID = 'music-play-button';

  function createButton(text) {
    const btn = document.createElement('button');
    btn.id = BTN_ID;
    btn.type = 'button';
    btn.setAttribute('aria-label', text || 'Play background music');
    btn.innerHTML = text || '▶';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 99999,
      padding: '10px 14px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px'
    });
    return btn;
  }

  async function tryPlayAudio(audioEl) {
    if (!audioEl) return;
    audioEl.loop = true;

    // First try normal play (may be blocked)
    try {
      await audioEl.play();
      // success
      audioEl.muted = false;
      removeButton();
      return;
    } catch (e) {
      // blocked
    }

    // Try muted autoplay (often allowed)
    try {
      audioEl.muted = true;
      await audioEl.play();
      // succeeded muted; show an unmute button
      showButton('🔊');
      return;
    } catch (e) {
      // muted autoplay also blocked -> show play button
      showButton('▶');
    }
  }

  function removeButton() {
    const existing = document.getElementById(BTN_ID);
    if (existing) existing.remove();
  }

  function showButton(label) {
    removeButton();
    const btn = createButton(label);
    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const audioEl = document.getElementById(ID);
      if (!audioEl) {
        removeButton();
        return;
      }
      try {
        audioEl.muted = false;
        await audioEl.play();
        removeButton();
      } catch (err) {
        // If still fails, keep button and maybe change label
        btn.innerHTML = '▶';
      }
    });
    document.body.appendChild(btn);
  }

  function init() {
    const audioEl = document.getElementById(ID);
    if (!audioEl) return;
    // Defer attempt to after a short delay (page may still be loading assets)
    setTimeout(() => tryPlayAudio(audioEl), 300);

    // Also try to unmute/play on any user gesture (click/keydown)
    function userGesture() {
      const audioEl2 = document.getElementById(ID);
      if (!audioEl2) return;
      if (audioEl2.paused) {
        audioEl2.muted = false;
        audioEl2.play().then(() => removeButton()).catch(()=>{});
      } else if (audioEl2.muted) {
        audioEl2.muted = false;
        removeButton();
      }
    }
    ['click', 'keydown', 'touchstart'].forEach(evt => {
      window.addEventListener(evt, userGesture, { once: true, passive: true });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
