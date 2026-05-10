// MathSprout — Tiny localStorage cache for /api/recommend results.
// Prevents spam-clicking from burning tokens. TTL = 30 minutes.

const CACHE_KEY = 'mathsprout_rec_cache_v1';
const TTL_MS = 30 * 60 * 1000;

/**
 * @param {string} userKey - opaque per-user key (e.g. nickname + grade)
 * @returns {object|null} cached payload, or null if expired/missing
 */
export function getCachedRecommendation(userKey) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw);
    const entry = map[userKey];
    if (!entry) return null;
    if (Date.now() - entry.savedAt > TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export function setCachedRecommendation(userKey, data) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[userKey] = { savedAt: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    // best-effort cache; ignore quota errors
  }
}

export function clearCachedRecommendation(userKey) {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return;
    const map = JSON.parse(raw);
    delete map[userKey];
    localStorage.setItem(CACHE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}
