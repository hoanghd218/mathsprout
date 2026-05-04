/* MathSprout — Backend server
 * Serves static files + proxies AI calls to Anthropic Claude.
 * The API key NEVER leaves the server — clients only see /api/ai/* responses.
 */

require('dotenv').config();
const path = require('path');
const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const PORT = process.env.PORT || 8000;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const API_KEY = process.env.ANTHROPIC_API_KEY;

const app = express();
app.use(express.json({ limit: '256kb' }));
app.use(express.static(__dirname));

const client = API_KEY ? new Anthropic({ apiKey: API_KEY }) : null;

function aiUnavailable(res) {
  return res.status(503).json({
    error: 'ai_unavailable',
    message_en: "Sprout AI is offline. Ask a grown-up to set up the API key.",
    message_vi: "Sprout AI chưa kích hoạt. Nhờ người lớn cài API key giúp nhé!"
  });
}

/* ============== AI: Explain a question ============== */
app.post('/api/ai/explain', async (req, res) => {
  if (!client) return aiUnavailable(res);

  const { questionEn, questionVi, correctAnswer, userAnswer, grade, topic } = req.body || {};
  if (!questionEn || correctAnswer === undefined) {
    return res.status(400).json({ error: 'missing_fields' });
  }

  const system = `You are Sprout 🌱, a friendly bilingual math tutor for children grade 1-5.
Your job: explain ONE math problem in a way that a ${grade || 3}-grader can understand.

RULES:
- Reply with a JSON object: { "explanation_en": "...", "explanation_vi": "...", "tip_en": "...", "tip_vi": "..." }
- Use VERY simple words. Short sentences. 1 step per sentence.
- Use friendly tone with emoji where helpful (🌱✨🍎).
- Vietnamese must be natural for a Vietnamese kid (not literal translation).
- The explanation must walk through the steps to GET the answer, not just state it.
- Keep each language to 4-7 short sentences max.
- "tip" is one short memory trick or rule the kid can use next time.
- DO NOT include any other text outside the JSON object.`;

  const user = `Topic: ${topic || 'math'}
Grade: ${grade || 3}
Question (English): ${questionEn}
Question (Vietnamese): ${questionVi || '(none)'}
Correct answer: ${correctAnswer}
${userAnswer !== undefined ? `Student's answer: ${userAnswer} (was wrong)` : ''}

Explain how to solve this problem.`;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 800,
      system,
      messages: [{ role: 'user', content: user }]
    });

    const text = msg.content.map(b => b.text || '').join('').trim();
    let parsed;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch (e) {
      parsed = { explanation_en: text, explanation_vi: '', tip_en: '', tip_vi: '' };
    }
    res.json(parsed);
  } catch (err) {
    console.error('AI explain error:', err.message);
    res.status(500).json({ error: 'ai_error', message: err.message });
  }
});

/* ============== AI: Personalized recommendations ============== */
app.post('/api/ai/recommend', async (req, res) => {
  if (!client) return aiUnavailable(res);

  const { grade, recentAttempts, skillMap, nickname } = req.body || {};
  if (!skillMap) return res.status(400).json({ error: 'missing_fields' });

  const system = `You are Sprout 🌱, a friendly bilingual math coach for children grade 1-5.
Look at a student's recent practice and suggest what to study next.

RULES:
- Reply with a JSON object only:
  {
    "summary_en": "1-2 friendly sentences about the student's progress",
    "summary_vi": "tương tự bằng tiếng Việt",
    "recommendations": [
      { "topic": "<one of: addition, subtraction, multiplication, division, power, fraction, decimal, bodmas, pattern, placevalue, comparison, rounding>",
        "difficulty": "easy|medium|hard",
        "count": <integer 3-10>,
        "reason_en": "Why this — kid-friendly, 1-2 sentences",
        "reason_vi": "tương tự bằng tiếng Việt" }
    ]
  }
- Give 3-5 recommendations, in priority order.
- Focus on weak topics first (mastery < 50 or many wrong answers).
- Mix in 1 easy review topic for confidence.
- ONLY recommend topics the student's grade can do (grade ${grade || 3}).
- Use very simple Vietnamese suitable for a kid.
- DO NOT include any text outside the JSON.`;

  const recentSummary = (recentAttempts || []).slice(-20).map(a =>
    `[${a.topic}] ${a.questionEn} → answer:${a.answer} student:${a.userAnswer} ${a.isCorrect ? '✓' : '✗'} (${a.timeSpent}s${a.hintUsed ? ', hint' : ''})`
  ).join('\n');

  const user = `Student: ${nickname || 'a kid'}, grade ${grade || 3}
Skill map (mastery 0-100):
${Object.entries(skillMap).map(([k, v]) => `- ${k}: mastery=${v.mastery}, attempts=${v.attempts}, correct=${v.correct}`).join('\n')}

Last 20 attempts:
${recentSummary || '(no attempts yet)'}

Suggest what to practice next, and explain WHY for each suggestion.`;

  try {
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content: user }]
    });

    const text = msg.content.map(b => b.text || '').join('').trim();
    let parsed;
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      parsed = JSON.parse(text.slice(jsonStart, jsonEnd + 1));
    } catch (e) {
      return res.status(500).json({ error: 'parse_error', raw: text });
    }
    res.json(parsed);
  } catch (err) {
    console.error('AI recommend error:', err.message);
    res.status(500).json({ error: 'ai_error', message: err.message });
  }
});

/* ============== Health ============== */
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    aiEnabled: !!client,
    model: MODEL,
    version: '1.1.0'
  });
});

app.listen(PORT, () => {
  console.log(`🌱 MathSprout running at http://localhost:${PORT}`);
  console.log(`   AI: ${client ? `enabled (${MODEL})` : 'DISABLED — set ANTHROPIC_API_KEY in .env'}`);
});
