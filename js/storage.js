/* MathSprout — Storage layer (localStorage wrapper) */

(function () {
  const STORAGE_KEY = 'mathsprout_v1';

  const DEFAULT_STATE = {
    user: null,
    progress: {
      totalXP: 0,
      streakDays: 0,
      lastActiveDate: null
    },
    skillMap: {
      addition:       { mastery: 0, attempts: 0, correct: 0 },
      subtraction:    { mastery: 0, attempts: 0, correct: 0 },
      multiplication: { mastery: 0, attempts: 0, correct: 0 },
      division:       { mastery: 0, attempts: 0, correct: 0 }
    },
    attempts: [],
    badges: [],
    settings: {
      bilingualMode: true,
      voiceReading: false,
      soundVolume: 0.7,
      theme: 'leaf'
    },
    bilingualUseCount: 0,
    currentLesson: null
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return deepClone(DEFAULT_STATE);

      const parsed = JSON.parse(stored);
      const merged = { ...deepClone(DEFAULT_STATE), ...parsed };

      // Ensure skillMap has all required topics
      ['addition', 'subtraction', 'multiplication', 'division'].forEach(t => {
        if (!merged.skillMap[t]) {
          merged.skillMap[t] = { mastery: 0, attempts: 0, correct: 0 };
        }
      });

      return merged;
    } catch (e) {
      console.error('Storage load error:', e);
      return deepClone(DEFAULT_STATE);
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Storage save error:', e);
    }
  }

  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.Storage = {
    KEY: STORAGE_KEY,
    DEFAULT: DEFAULT_STATE,
    load: loadState,
    save: saveState,
    clear: clearState
  };
})();
