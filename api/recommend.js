// MathSprout — /api/recommend: personalized practice plan as strict JSON.
// Non-streaming: returns one JSON object describing 3-5 recommended drills,
// with bilingual reasoning citing the student's actual stats.

import { client, MODEL, isReady } from './_lib/llm-client.js';
import {
  buildRecommendSystemPrompt,
  buildRecommendUserMessage
} from './_lib/prompts.js';

export const maxDuration = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Use POST' });
  }
  if (!isReady()) {
    return res.status(503).json({
      error: 'OPENROUTER_API_KEY not configured. See /api/health.'
    });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body' }); }
  }

  const { skillMap, recentSummary = {}, grade = 2, age = 7 } = body || {};

  if (!skillMap || typeof skillMap !== 'object') {
    return res.status(400).json({ error: 'Missing required field: skillMap (object)' });
  }

  const safeGrade = clamp(Number(grade) || 2, 1, 5);
  const safeAge = clamp(Number(age) || 7, 5, 12);

  try {
    const result = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 1500,
      // Kimi K2.6 is a reasoning model; without this, CoT eats the full
      // max_tokens budget and the model returns empty content (502).
      reasoning: { enabled: false },
      messages: [
        { role: 'system', content: buildRecommendSystemPrompt(safeGrade, safeAge) },
        {
          role: 'user',
          content: buildRecommendUserMessage({
            skillMap,
            recentSummary,
            grade: safeGrade,
            age: safeAge
          })
        }
      ]
    });

    const rawText = result.choices?.[0]?.message?.content || '';
    const parsed = parseJsonLoose(rawText);

    if (!parsed || !Array.isArray(parsed.recommendations)) {
      console.error('[/api/recommend] invalid JSON from model. Raw:', rawText);
      return res.status(502).json({
        error: 'Model returned invalid JSON',
        raw: rawText.slice(0, 500)
      });
    }

    res.status(200).json(parsed);
  } catch (err) {
    console.error('[/api/recommend] error:', err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
}

// ---- helpers ----

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

// Defensive JSON parse: strips ```json fences if model added them despite instructions.
function parseJsonLoose(text) {
  const cleaned = text
    .replace(/^\s*```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch { return null; }
    }
    return null;
  }
}
