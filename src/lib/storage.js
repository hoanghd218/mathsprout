// MathSprout — localStorage helpers (legacy v1 key preserved)

import { ALL_TOPIC_IDS } from '../data/topics.js';

export const STORAGE_KEY = 'mathsprout_v1';

const emptySkill = () => ({ mastery: 0, attempts: 0, correct: 0 });

function buildDefaultSkillMap() {
  const map = {};
  for (const id of ALL_TOPIC_IDS) map[id] = emptySkill();
  return map;
}

export const DEFAULT_STATE = {
  user: null,
  progress: {
    totalXP: 0,
    streakDays: 0,
    lastActiveDate: null
  },
  skillMap: buildDefaultSkillMap(),
  attempts: [],
  badges: [],
  settings: {
    bilingualMode: true,
    voiceReading: false,
    soundVolume: 0.7,
    theme: 'leaf'
  },
  bilingualUseCount: 0,
  playTimeSec: 0,
  easyQuestionStock: 0,
  shopPurchases: [],
  currentLesson: null
};

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return deepClone(DEFAULT_STATE);

    const parsed = JSON.parse(stored);
    const merged = { ...deepClone(DEFAULT_STATE), ...parsed };

    // Migration: ensure every topic id has a skillMap entry so newly added
    // topics (e.g. 'fractions' added in v2) appear for returning users.
    if (!merged.skillMap) merged.skillMap = {};
    for (const id of ALL_TOPIC_IDS) {
      if (!merged.skillMap[id]) merged.skillMap[id] = emptySkill();
    }
    // Migration: playTimeSec was added with the "Play 1 Hour" badge.
    if (typeof merged.playTimeSec !== 'number') merged.playTimeSec = 0;
    // Migration: shop fields.
    if (typeof merged.easyQuestionStock !== 'number') merged.easyQuestionStock = 0;
    if (!Array.isArray(merged.shopPurchases)) merged.shopPurchases = [];

    return merged;
  } catch (e) {
    console.error('Storage load error:', e);
    return deepClone(DEFAULT_STATE);
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
