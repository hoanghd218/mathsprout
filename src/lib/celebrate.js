// MathSprout — Confetti celebration wrapper

import confetti from 'canvas-confetti';

export function celebrate() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#4ADE80', '#FCD34D', '#C4B5FD', '#60A5FA', '#FB923C']
  });
}
