// MathSprout — Global app state via Context + useReducer with localStorage sync.
// Reducer is pure: returns new state object. Side effects (storage write) happen in effect.

import { createContext, useContext, useEffect, useReducer } from 'react';
import { loadState, saveState, clearState, deepClone } from '../lib/storage.js';
import {
  recordAttempt as runRecordAttempt,
  getNextLesson,
  getFocusedLesson
} from '../lib/recommender.js';
import { SHOP_ITEMS } from '../data/topics.js';

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'SIGN_UP': {
      return { ...state, user: action.user };
    }

    case 'START_LESSON': {
      // Clone first so getNextLesson can safely consume easyQuestionStock.
      const next = deepClone(state);
      next.currentLesson = getNextLesson(next, action.count ?? 10);
      return next;
    }

    case 'START_FOCUSED_LESSON': {
      const next = deepClone(state);
      next.currentLesson = getFocusedLesson(next, action.topic, action.count ?? 5);
      return next;
    }

    case 'RECORD_ATTEMPT': {
      // recordAttempt mutates — clone first so React sees a new reference
      const next = deepClone(state);
      const meta = runRecordAttempt(
        next,
        action.question,
        action.userAnswer,
        action.timeSpent,
        action.hintUsed
      );
      // Stash the result so the reducer caller can read it via lastResult
      next.lastResult = { ...meta, question: action.question, userAnswer: action.userAnswer };
      return next;
    }

    case 'ADVANCE_QUESTION': {
      if (!state.currentLesson) return state;
      const lesson = { ...state.currentLesson, currentIndex: state.currentLesson.currentIndex + 1 };
      return { ...state, currentLesson: lesson };
    }

    case 'FINISH_LESSON': {
      return { ...state, currentLesson: null };
    }

    case 'TOGGLE_BILINGUAL': {
      const next = deepClone(state);
      next.settings.bilingualMode = !next.settings.bilingualMode;
      next.bilingualUseCount = (next.bilingualUseCount || 0) + 1;
      if (next.bilingualUseCount >= 10 && !next.badges.includes('bilingual')) {
        next.badges.push('bilingual');
        next.lastBilingualBadge = true;
      } else {
        next.lastBilingualBadge = false;
      }
      return next;
    }

    case 'CONSUME_BILINGUAL_BADGE': {
      return { ...state, lastBilingualBadge: false };
    }

    case 'BUY_SHOP_ITEM': {
      const item = SHOP_ITEMS.find(i => i.id === action.itemId);
      if (!item) return state;
      // Repeatable: only XP gates the purchase. Badges already-owned are skipped.
      if ((state.progress.totalXP || 0) < item.cost) {
        return { ...state, lastShopResult: { ok: false, itemId: item.id } };
      }
      const next = deepClone(state);
      next.progress.totalXP -= item.cost;
      next.shopPurchases = [...(next.shopPurchases || []), item.id];
      next.easyQuestionStock = (next.easyQuestionStock || 0) + (item.rewards.easyQuestions || 0);
      const newBadges = [];
      for (const code of item.rewards.badges || []) {
        if (!next.badges.includes(code)) {
          next.badges.push(code);
          newBadges.push(code);
        }
      }
      next.lastShopResult = { ok: true, itemId: item.id, newBadges };
      return next;
    }

    case 'CONSUME_SHOP_RESULT': {
      return { ...state, lastShopResult: null };
    }

    case 'RESET': {
      clearState();
      return loadState();
    }

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
