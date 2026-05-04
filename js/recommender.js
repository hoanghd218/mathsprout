/* MathSprout — Adaptive Learning Engine
 * Tracks mastery per topic, recommends next lesson based on weak/strong areas,
 * updates XP, streak, and unlocks badges.
 */

(function () {
  const TOPICS_LIST = ['addition', 'subtraction', 'multiplication', 'division',
                       'power', 'fraction', 'decimal', 'bodmas',
                       'pattern', 'placevalue', 'comparison', 'rounding'];

  /* What topics is this grade allowed to practice? */
  function getEligibleTopics(grade) {
    if (grade <= 1) return ['addition', 'subtraction', 'pattern', 'comparison'];
    if (grade <= 2) return ['addition', 'subtraction', 'multiplication',
                            'pattern', 'placevalue', 'comparison'];
    if (grade <= 3) return ['addition', 'subtraction', 'multiplication', 'division',
                            'power', 'pattern', 'placevalue', 'comparison', 'rounding'];
    if (grade <= 4) return ['addition', 'subtraction', 'multiplication', 'division',
                            'power', 'fraction', 'decimal', 'bodmas',
                            'pattern', 'placevalue', 'comparison', 'rounding'];
    return TOPICS_LIST;
  }

  /* Build the next 10-question lesson based on user's skill map */
  function getNextLesson(state, count = 10) {
    const grade = state.user?.grade || 2;
    const eligible = getEligibleTopics(grade);

    const topicStats = eligible.map(topic => {
      const stats = state.skillMap[topic] || { mastery: 0, attempts: 0 };
      return { topic, ...stats };
    });

    /* Classify topics by mastery */
    const weak = topicStats.filter(s => s.attempts >= 3 && s.mastery < 30);
    const medium = topicStats.filter(s => s.attempts >= 3 && s.mastery >= 30 && s.mastery < 70);
    const strong = topicStats.filter(s => s.mastery >= 70);
    const untouched = topicStats.filter(s => s.attempts < 3);

    const questions = [];
    let recommendation = '';

    if (weak.length > 0) {
      /* Focus on weakest topic — 70% focus + 30% review */
      const focus = weak.sort((a, b) => a.mastery - b.mastery)[0];
      recommendation = `focus_weak:${focus.topic}`;

      const focusCount = Math.ceil(count * 0.7);
      const reviewCount = count - focusCount;

      for (let i = 0; i < focusCount; i++) {
        questions.push(Generators.generate(focus.topic, grade));
      }
      const reviewTopic = strong[0]?.topic || untouched[0]?.topic || eligible[0];
      for (let i = 0; i < reviewCount; i++) {
        questions.push(Generators.generate(reviewTopic, grade));
      }
    } else if (untouched.length > 0) {
      /* Introduce a new topic */
      const next = untouched[0];
      recommendation = `learn_new:${next.topic}`;
      for (let i = 0; i < count; i++) {
        questions.push(Generators.generate(next.topic, grade));
      }
    } else if (medium.length > 0) {
      /* Improve medium topics — 50% focus + 30% review + 20% mixed */
      const focus = medium[0];
      recommendation = `improve:${focus.topic}`;
      for (let i = 0; i < count; i++) {
        const useTopic = i < Math.ceil(count * 0.5)
          ? focus.topic
          : Generators.pick(eligible);
        questions.push(Generators.generate(useTopic, grade));
      }
    } else {
      /* All mastered — mixed practice */
      recommendation = 'practice_all';
      for (let i = 0; i < count; i++) {
        questions.push(Generators.generate(Generators.pick(eligible), grade));
      }
    }

    return {
      questions,
      recommendation,
      currentIndex: 0,
      startedAt: Date.now()
    };
  }

  /* Parse user input by question type and check correctness */
  function gcdLocal(a, b) { return b === 0 ? a : gcdLocal(b, a % b); }
  function checkAnswer(question, userAnswer) {
    const raw = String(userAnswer).trim();
    if (!raw) return { isCorrect: false, parsed: null };

    if (question.answerType === 'fraction') {
      /* accept "a/b" or whole number */
      const m = raw.match(/^(-?\d+)\s*\/\s*(\d+)$/);
      let n, d;
      if (m) { n = parseInt(m[1], 10); d = parseInt(m[2], 10); }
      else if (/^-?\d+$/.test(raw)) { n = parseInt(raw, 10); d = 1; }
      else return { isCorrect: false, parsed: raw };
      if (d === 0) return { isCorrect: false, parsed: raw };
      const ok = n * question.answerDenominator === d * question.answerNumerator;
      return { isCorrect: ok, parsed: `${n}/${d}` };
    }

    if (question.answerType === 'comparison') {
      const norm = raw.replace(/\s+/g, '');
      return { isCorrect: norm === question.answer, parsed: norm };
    }

    if (question.answerType === 'decimal') {
      const v = parseFloat(raw);
      if (Number.isNaN(v)) return { isCorrect: false, parsed: raw };
      const ok = Math.abs(v - question.answer) < 0.01;
      return { isCorrect: ok, parsed: v };
    }

    /* default: integer comparison */
    const v = parseInt(raw, 10);
    if (Number.isNaN(v)) return { isCorrect: false, parsed: raw };
    return { isCorrect: v === question.answer, parsed: v };
  }

  /* Record a single attempt; mutates state and returns metadata */
  function recordAttempt(state, question, userAnswer, timeSpent, hintUsed) {
    const check = checkAnswer(question, userAnswer);
    const userAns = check.parsed;
    const isCorrect = check.isCorrect;

    const attempt = {
      id: 'att_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: Date.now(),
      topic: question.topic,
      grade: question.grade,
      questionEn: question.questionEn,
      answer: question.answer,
      userAnswer: userAns,
      isCorrect,
      timeSpent,
      hintUsed
    };

    state.attempts.push(attempt);
    /* Cap history to last 500 attempts to control localStorage size */
    if (state.attempts.length > 500) state.attempts.shift();

    /* Update mastery for the topic */
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

    /* XP only on correct answer */
    let xpGained = 0;
    if (isCorrect) {
      xpGained = hintUsed ? 5 : 10;
      state.progress.totalXP += xpGained;
    }

    /* Streak */
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

    /* Check newly-earned badges */
    const newBadges = checkBadges(state);

    return { attempt, isCorrect, xpGained, newBadges };
  }

  function checkBadges(state) {
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

    /* Last 10 all correct? */
    const last10 = state.attempts.slice(-10);
    if (last10.length === 10 && last10.every(a => a.isCorrect) && !has('perfect_10')) {
      state.badges.push('perfect_10');
      newBadges.push('perfect_10');
    }

    /* Topic masters (mastery >= 90) */
    Object.keys(state.skillMap).forEach(topic => {
      const code = topic + '_master';
      if (state.skillMap[topic].mastery >= 90 && !has(code)) {
        state.badges.push(code);
        newBadges.push(code);
      }
    });

    return newBadges;
  }

  function getCurrentLevel(xp) {
    let lv = LEVELS[0];
    for (const level of LEVELS) {
      if (xp >= level.min) lv = level;
    }
    return lv;
  }

  function getNextLevel(xp) {
    for (const level of LEVELS) {
      if (level.min > xp) return level;
    }
    return LEVELS[LEVELS.length - 1];
  }

  window.Recommender = {
    getNextLesson,
    recordAttempt,
    checkBadges,
    getCurrentLevel,
    getNextLevel,
    getEligibleTopics
  };
})();
