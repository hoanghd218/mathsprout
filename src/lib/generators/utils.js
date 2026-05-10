// MathSprout — Shared random helpers used by all topic generators.

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Greatest common divisor — used by fractions to simplify results.
export function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function simplifyFraction(n, d) {
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}
