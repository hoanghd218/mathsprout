/* MathSprout — AI assistant client (talks to /api/ai/*).
 * The API key lives on the server only — see server.js + .env.example.
 */
(function () {
  let aiEnabled = null; // null = unknown, true/false after /api/health

  async function checkHealth() {
    try {
      const r = await fetch('/api/health');
      if (!r.ok) { aiEnabled = false; return aiEnabled; }
      const j = await r.json();
      aiEnabled = !!j.aiEnabled;
      return aiEnabled;
    } catch (e) {
      aiEnabled = false;
      return false;
    }
  }

  async function explain(question, userAnswer) {
    const r = await fetch('/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionEn: question.questionEn,
        questionVi: question.questionVi,
        correctAnswer: question.answer,
        userAnswer,
        grade: question.grade,
        topic: question.topic
      })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.message_en || err.message || 'AI request failed');
    }
    return r.json();
  }

  async function recommend(state) {
    const r = await fetch('/api/ai/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grade: state.user?.grade,
        nickname: state.user?.nickname,
        skillMap: state.skillMap,
        recentAttempts: state.attempts.slice(-30)
      })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.message_en || err.message || 'AI request failed');
    }
    return r.json();
  }

  window.AI = { checkHealth, explain, recommend, isEnabled: () => aiEnabled };
})();
