/* MathSprout — UI helpers (router, toasts, confetti, voice) */

(function () {
  function $(sel)  { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  /* Hash-based routing — show one page at a time */
  function navigate(pageId) {
    $$('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');
    window.scrollTo(0, 0);
    if (window.location.hash !== '#' + pageId) {
      window.location.hash = pageId;
    }
  }

  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function celebrate() {
    if (typeof window.confetti !== 'function') return;
    window.confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4ADE80', '#FCD34D', '#C4B5FD', '#60A5FA', '#FB923C']
    });
  }

  /* Web Speech API — read English math out loud */
  function speak(text, lang = 'en-US') {
    if (!('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.9;
      u.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.warn('Speech failed:', e);
    }
  }

  window.UI = { $, $$, navigate, showToast, celebrate, speak };
})();
