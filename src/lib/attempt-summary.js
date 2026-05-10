// MathSprout — Compress raw attempt history into a token-friendly summary
// suitable for sending to Claude in /api/recommend.
//
// Raw `state.attempts` can grow to 500 entries. Sending all of them would
// cost too many tokens. This module produces a small object with:
//   - per-topic stats (accuracy, avg time, recent trend)
//   - last 5-10 wrong questions (question text only) so the model can
//     identify specific patterns

const MAX_RECENT_WRONG = 8;
const TREND_WINDOW = 20;

/**
 * @param {Array<object>} attempts - state.attempts entries
 * @returns {{
 *   totalAttempts: number,
 *   perTopic: Record<string, {
 *     attempts: number, correct: number, accuracy: number,
 *     avgTimeSec: number, hintRate: number, recentAccuracy: number
 *   }>,
 *   recentWrong: Array<{ topic: string, q: string, userAnswer: any, correctAnswer: any }>,
 *   recentTrend: { window: number, accuracy: number }
 * }}
 */
export function summarizeAttempts(attempts = []) {
  const perTopic = {};
  for (const a of attempts) {
    const t = a.topic || 'unknown';
    if (!perTopic[t]) {
      perTopic[t] = { attempts: 0, correct: 0, totalTime: 0, hintCount: 0, recent: [] };
    }
    const bucket = perTopic[t];
    bucket.attempts++;
    if (a.isCorrect) bucket.correct++;
    bucket.totalTime += Number(a.timeSpent) || 0;
    if (a.hintUsed) bucket.hintCount++;
    bucket.recent.push(a.isCorrect ? 1 : 0);
    if (bucket.recent.length > 10) bucket.recent.shift();
  }

  const summary = {};
  for (const [topic, b] of Object.entries(perTopic)) {
    const recentSum = b.recent.reduce((s, x) => s + x, 0);
    summary[topic] = {
      attempts: b.attempts,
      correct: b.correct,
      accuracy: b.attempts ? Math.round((b.correct / b.attempts) * 100) : 0,
      avgTimeSec: b.attempts ? Math.round(b.totalTime / b.attempts) : 0,
      hintRate: b.attempts ? Math.round((b.hintCount / b.attempts) * 100) : 0,
      recentAccuracy: b.recent.length
        ? Math.round((recentSum / b.recent.length) * 100)
        : 0
    };
  }

  // Most recent wrong attempts (latest first), trimmed to question text only.
  const recentWrong = [...attempts]
    .reverse()
    .filter((a) => a.isCorrect === false)
    .slice(0, MAX_RECENT_WRONG)
    .map((a) => ({
      topic: a.topic,
      q: clip(a.questionEn || '', 120),
      userAnswer: a.userAnswer,
      correctAnswer: a.answer
    }));

  // Trailing accuracy across all topics (last TREND_WINDOW attempts).
  const tail = attempts.slice(-TREND_WINDOW);
  const tailCorrect = tail.filter((a) => a.isCorrect).length;
  const recentTrend = {
    window: tail.length,
    accuracy: tail.length ? Math.round((tailCorrect / tail.length) * 100) : 0
  };

  return {
    totalAttempts: attempts.length,
    perTopic: summary,
    recentWrong,
    recentTrend
  };
}

function clip(s, max) {
  return s.length > max ? s.slice(0, max) : s;
}
