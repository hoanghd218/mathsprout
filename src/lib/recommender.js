// MathSprout — Adaptive Learning Engine
// Pure functions: lesson recommendation, attempt recording, badge checks, level lookup.
// recordAttempt now MUTATES the passed state object (called inside reducer with a draft copy).

import {
  LEVELS,
  PLAY_TIME_CREDIT_SEC,
  PLAY_TIME_GOAL_5MIN_SEC,
  PLAY_TIME_GOAL_10MIN_SEC,
  PLAY_TIME_GOAL_15MIN_SEC,
  PLAY_TIME_GOAL_20MIN_SEC,
  PLAY_TIME_GOAL_25MIN_SEC,
  PLAY_TIME_GOAL_30MIN_SEC,
  PLAY_TIME_GOAL_35MIN_SEC,
  PLAY_TIME_GOAL_40MIN_SEC,
  PLAY_TIME_GOAL_45MIN_SEC,
  PLAY_TIME_GOAL_50MIN_SEC,
  PLAY_TIME_GOAL_55MIN_SEC,
  PLAY_TIME_GOAL_SEC,
  PLAY_TIME_GOAL_1H25MIN_SEC,
  PLAY_TIME_GOAL_2H_SEC,
  PLAY_TIME_GOAL_3H_SEC,
  EASY_BONUS_COUNT,
  FUN_MATH_XP_THRESHOLD,
  FUN_MATH_BONUS_XP,
  STUDY_5MIN_BONUS_XP,
  STUDY_TOGETHER_BONUS_XP,
  STUDY_FOCUSED_BONUS_XP,
  STUDY_GOOD_KID_BONUS_XP,
  TRAINING_PRO_BONUS_XP,
  STUDY_TALENT_BONUS_XP,
  STUDY_CONCENTRATE_BONUS_XP,
  TRAINING_SUPER_BONUS_XP,
  STAR_GOLD_BONUS_XP,
  STAR_SHINING_BONUS_XP,
  STAR_SUPER_SHINING_BONUS_XP,
  STOCK_PER_LESSON
} from '../data/topics.js';
import { generate, pick } from './generators/index.js';

// Progressive topic unlock by Vietnamese primary-school grade.
// Lower grades = simpler topics only. By grade 5 the student sees everything.
const GRADE_TOPICS = {
  1: ['addition', 'subtraction', 'comparison', 'counting', 'geometry'],
  2: ['addition', 'subtraction', 'multiplication', 'comparison', 'counting',
      'time', 'money', 'measurement', 'geometry'],
  3: ['addition', 'subtraction', 'multiplication', 'division', 'comparison',
      'counting', 'time', 'money', 'measurement', 'geometry'],
  4: ['addition', 'subtraction', 'multiplication', 'division',
      'time', 'money', 'measurement', 'geometry', 'fractions'],
  5: ['addition', 'subtraction', 'multiplication', 'division',
      'time', 'money', 'measurement', 'geometry', 'fractions']
};

export function getEligibleTopics(grade) {
  return GRADE_TOPICS[grade] || GRADE_TOPICS[2];
}

/**
 * Prepend warm-up easy questions (one grade lower, min 1) to each lesson:
 * - Star+ badge: permanent EASY_BONUS_COUNT extra warm-ups every lesson.
 * - Shop stock: consumes up to STOCK_PER_LESSON from `easyQuestionStock`.
 * Mutates `state.easyQuestionStock` — caller must pass a clone.
 */
function prependEasyBonus(state, questions, eligible, grade) {
  const easyGrade = Math.max(1, grade - 1);
  const warmUps = [];

  if (state.badges?.includes('star_plus')) {
    for (let i = 0; i < EASY_BONUS_COUNT; i++) {
      warmUps.push(generate(pick(eligible), easyGrade));
    }
  }

  const fromStock = Math.min(state.easyQuestionStock || 0, STOCK_PER_LESSON);
  for (let i = 0; i < fromStock; i++) {
    warmUps.push(generate(pick(eligible), easyGrade));
  }
  state.easyQuestionStock = (state.easyQuestionStock || 0) - fromStock;

  return warmUps.length ? [...warmUps, ...questions] : questions;
}

/**
 * Compare a student's typed answer against the question's correct answer.
 * Numeric questions → integer comparison. Everything else → trimmed,
 * lower-cased string comparison (handles 'choice', 'fraction', 'time', 'text').
 */
export function isAnswerCorrect(question, userAnswer) {
  const correct = question.answer;
  if (typeof correct === 'number') {
    const n = parseInt(String(userAnswer).trim(), 10);
    return Number.isFinite(n) && n === correct;
  }
  return String(userAnswer).trim().toLowerCase() === String(correct).trim().toLowerCase();
}

export function getNextLesson(state, count = 10) {
  const grade = state.user?.grade || 2;
  const eligible = getEligibleTopics(grade);

  const topicStats = eligible.map(topic => {
    const stats = state.skillMap[topic] || { mastery: 0, attempts: 0 };
    return { topic, ...stats };
  });

  const weak = topicStats.filter(s => s.attempts >= 3 && s.mastery < 30);
  const medium = topicStats.filter(s => s.attempts >= 3 && s.mastery >= 30 && s.mastery < 70);
  const strong = topicStats.filter(s => s.mastery >= 70);
  const untouched = topicStats.filter(s => s.attempts < 3);

  const questions = [];
  let recommendation = '';

  if (weak.length > 0) {
    const focus = weak.sort((a, b) => a.mastery - b.mastery)[0];
    recommendation = `focus_weak:${focus.topic}`;

    const focusCount = Math.ceil(count * 0.7);
    const reviewCount = count - focusCount;

    for (let i = 0; i < focusCount; i++) {
      questions.push(generate(focus.topic, grade));
    }
    const reviewTopic = strong[0]?.topic || untouched[0]?.topic || eligible[0];
    for (let i = 0; i < reviewCount; i++) {
      questions.push(generate(reviewTopic, grade));
    }
  } else if (untouched.length > 0) {
    const next = untouched[0];
    recommendation = `learn_new:${next.topic}`;
    for (let i = 0; i < count; i++) {
      questions.push(generate(next.topic, grade));
    }
  } else if (medium.length > 0) {
    const focus = medium[0];
    recommendation = `improve:${focus.topic}`;
    for (let i = 0; i < count; i++) {
      const useTopic = i < Math.ceil(count * 0.5)
        ? focus.topic
        : pick(eligible);
      questions.push(generate(useTopic, grade));
    }
  } else {
    recommendation = 'practice_all';
    for (let i = 0; i < count; i++) {
      questions.push(generate(pick(eligible), grade));
    }
  }

  return {
    questions: prependEasyBonus(state, questions, eligible, grade),
    recommendation,
    currentIndex: 0,
    startedAt: Date.now()
  };
}

/**
 * Record one attempt. Mutates `state`. Returns metadata.
 * Caller should pass a deep-cloned state (reducer pattern).
 */
export function recordAttempt(state, question, userAnswer, timeSpent, hintUsed) {
  const isCorrect = isAnswerCorrect(question, userAnswer);
  // Store user's answer in its native form: number when numeric, otherwise the
  // trimmed string (so '<', '3/4', '3:30' survive the round-trip into history).
  const storedUserAnswer = typeof question.answer === 'number'
    ? parseInt(String(userAnswer).trim(), 10)
    : String(userAnswer).trim();

  const attempt = {
    id: 'att_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
    timestamp: Date.now(),
    topic: question.topic,
    grade: question.grade,
    questionEn: question.questionEn,
    answer: question.answer,
    userAnswer: storedUserAnswer,
    isCorrect,
    timeSpent,
    hintUsed
  };

  state.attempts.push(attempt);
  if (state.attempts.length > 500) state.attempts.shift();

  // "Play X Hour" reward — fixed credit per question, capped at the 3h max goal.
  state.playTimeSec = Math.min(
    PLAY_TIME_GOAL_3H_SEC,
    (state.playTimeSec || 0) + PLAY_TIME_CREDIT_SEC
  );

  const skill = state.skillMap[question.topic] || { mastery: 0, attempts: 0, correct: 0 };
  skill.attempts++;
  if (isCorrect) skill.correct++;

  let delta;
  if (isCorrect) {
    delta = (hintUsed || timeSpent > 30) ? 4 : 8;
  } else {
    delta = -5;
  }
  skill.mastery = Math.max(0, Math.min(100, skill.mastery + delta));
  state.skillMap[question.topic] = skill;

  let xpGained = 0;
  if (isCorrect) {
    xpGained = hintUsed ? 5 : 10;
    state.progress.totalXP += xpGained;
  }

  const today = new Date().toISOString().split('T')[0];
  if (state.progress.lastActiveDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (state.progress.lastActiveDate === yesterday) {
      state.progress.streakDays++;
    } else {
      state.progress.streakDays = 1;
    }
    state.progress.lastActiveDate = today;
  }

  const newBadges = checkBadges(state);

  return { attempt, isCorrect, xpGained, newBadges };
}

export function checkBadges(state) {
  const newBadges = [];
  const has = (code) => state.badges.includes(code);

  if (state.attempts.length >= 1 && !has('first_attempt')) {
    state.badges.push('first_attempt');
    newBadges.push('first_attempt');
  }

  const correctCount = state.attempts.filter(a => a.isCorrect).length;
  if (correctCount >= 1 && !has('first_correct')) {
    state.badges.push('first_correct');
    newBadges.push('first_correct');
  }

  if (state.progress.streakDays >= 3 && !has('streak_3')) {
    state.badges.push('streak_3');
    newBadges.push('streak_3');
  }
  if (state.progress.streakDays >= 7 && !has('streak_7')) {
    state.badges.push('streak_7');
    newBadges.push('streak_7');
  }

  const last10 = state.attempts.slice(-10);
  if (last10.length === 10 && last10.every(a => a.isCorrect) && !has('perfect_10')) {
    state.badges.push('perfect_10');
    newBadges.push('perfect_10');
  }

  const t = state.playTimeSec || 0;
  if (t >= PLAY_TIME_GOAL_5MIN_SEC && !has('study_5min')) {
    state.progress.totalXP += STUDY_5MIN_BONUS_XP;
    state.badges.push('study_5min');
    newBadges.push('study_5min');
  }
  if (t >= PLAY_TIME_GOAL_10MIN_SEC && !has('study_together')) {
    state.progress.totalXP += STUDY_TOGETHER_BONUS_XP;
    state.badges.push('study_together');
    newBadges.push('study_together');
  }
  if (t >= PLAY_TIME_GOAL_15MIN_SEC && !has('training')) {
    state.badges.push('training');
    newBadges.push('training');
  }
  if (t >= PLAY_TIME_GOAL_20MIN_SEC && !has('study_focused')) {
    state.progress.totalXP += STUDY_FOCUSED_BONUS_XP;
    state.badges.push('study_focused');
    newBadges.push('study_focused');
  }
  if (t >= PLAY_TIME_GOAL_25MIN_SEC && !has('study_good_kid')) {
    state.progress.totalXP += STUDY_GOOD_KID_BONUS_XP;
    state.badges.push('study_good_kid');
    newBadges.push('study_good_kid');
  }
  if (t >= PLAY_TIME_GOAL_30MIN_SEC && !has('training_pro')) {
    state.progress.totalXP += TRAINING_PRO_BONUS_XP;
    state.badges.push('training_pro');
    newBadges.push('training_pro');
  }
  if (t >= PLAY_TIME_GOAL_35MIN_SEC && !has('study_talent')) {
    state.progress.totalXP += STUDY_TALENT_BONUS_XP;
    state.badges.push('study_talent');
    newBadges.push('study_talent');
  }
  if (t >= PLAY_TIME_GOAL_40MIN_SEC && !has('study_concentrate')) {
    state.progress.totalXP += STUDY_CONCENTRATE_BONUS_XP;
    state.badges.push('study_concentrate');
    newBadges.push('study_concentrate');
  }
  if (t >= PLAY_TIME_GOAL_45MIN_SEC && !has('training_super')) {
    state.progress.totalXP += TRAINING_SUPER_BONUS_XP;
    state.badges.push('training_super');
    newBadges.push('training_super');
  }
  if (t >= PLAY_TIME_GOAL_50MIN_SEC && !has('star_gold')) {
    state.progress.totalXP += STAR_GOLD_BONUS_XP;
    state.badges.push('star_gold');
    newBadges.push('star_gold');
  }
  if (t >= PLAY_TIME_GOAL_55MIN_SEC && !has('star_shining')) {
    state.progress.totalXP += STAR_SHINING_BONUS_XP;
    state.badges.push('star_shining');
    newBadges.push('star_shining');
  }
  if ((state.playTimeSec || 0) >= PLAY_TIME_GOAL_SEC && !has('played_1_hour')) {
    state.badges.push('played_1_hour');
    newBadges.push('played_1_hour');
  }
  if (t >= PLAY_TIME_GOAL_1H25MIN_SEC && !has('star_super_shining')) {
    state.progress.totalXP += STAR_SUPER_SHINING_BONUS_XP;
    state.badges.push('star_super_shining');
    newBadges.push('star_super_shining');
  }
  if ((state.playTimeSec || 0) >= PLAY_TIME_GOAL_2H_SEC && !has('played_2_hours')) {
    state.badges.push('played_2_hours');
    newBadges.push('played_2_hours');
  }
  if ((state.playTimeSec || 0) >= PLAY_TIME_GOAL_2H_SEC && !has('star_plus')) {
    state.badges.push('star_plus');
    newBadges.push('star_plus');
  }

  // "Học toán vui vẻ" — compound reward: 3h play + XP threshold; pays bonus XP.
  if (
    (state.playTimeSec || 0) >= PLAY_TIME_GOAL_3H_SEC &&
    (state.progress.totalXP || 0) >= FUN_MATH_XP_THRESHOLD &&
    !has('fun_math')
  ) {
    state.progress.totalXP += FUN_MATH_BONUS_XP;
    state.badges.push('fun_math');
    newBadges.push('fun_math');
  }

  // Only award master badges for the original 4 arithmetic topics — these are
  // the codes pre-defined in BADGES. New topics don't have badges (yet).
  const MASTER_BADGE_TOPICS = ['addition', 'subtraction', 'multiplication', 'division'];
  MASTER_BADGE_TOPICS.forEach(topic => {
    const code = topic + '_master';
    const skill = state.skillMap[topic];
    if (skill && skill.mastery >= 90 && !has(code)) {
      state.badges.push(code);
      newBadges.push(code);
    }
  });

  return newBadges;
}

/**
 * Build a lesson focused on a specific topic — used when the student
 * accepts an AI recommendation ("Luyện 5 bài về phép trừ có nhớ").
 */
export function getFocusedLesson(state, topic, count = 5) {
  const grade = state.user?.grade || 2;
  const eligible = getEligibleTopics(grade);
  const safeTopic = eligible.includes(topic) ? topic : eligible[0];

  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(generate(safeTopic, grade));
  }

  return {
    questions: prependEasyBonus(state, questions, eligible, grade),
    recommendation: `ai_focus:${safeTopic}`,
    currentIndex: 0,
    startedAt: Date.now()
  };
}

export function getCurrentLevel(xp) {
  let lv = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.min) lv = level;
  }
  return lv;
}

export function getNextLevel(xp) {
  for (const level of LEVELS) {
    if (level.min > xp) return level;
  }
  return LEVELS[LEVELS.length - 1];
}
