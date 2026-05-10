// MathSprout — /api/explain: bilingual streaming explanation of a math problem.
// Streams text deltas as Server-Sent Events:
//   data: {"text":"<chunk>"}\n\n
//   ...
//   data: [DONE]\n\n
//
// On error: data: {"error":"..."}\n\n then close.

import { client, MODEL, isReady } from './_lib/llm-client.js';
import {
  buildExplainSystemPrompt,
  buildExplainUserMessage
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

  const { question, userAnswer, isCorrect, grade = 2, age = 7 } = body || {};

  if (!question || !question.questionEn || question.answer === undefined) {
    return res.status(400).json({
      error: 'Missing required fields: question.questionEn and question.answer'
    });
  }

  const safeGrade = clamp(Number(grade) || 2, 1, 5);
  const safeAge = clamp(Number(age) || 7, 5, 12);

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 800,
      stream: true,
      // Disable Kimi K2.6 reasoning trace — speeds up TTFT and frees the
      // token budget for the actual kid-friendly explanation.
      reasoning: { enabled: false },
      messages: [
        { role: 'system', content: buildExplainSystemPrompt(safeGrade, safeAge) },
        {
          role: 'user',
          content: buildExplainUserMessage({
            questionEn: clip(question.questionEn, 500),
            questionVi: clip(question.questionVi, 500),
            userAnswer: clip(String(userAnswer ?? ''), 100),
            correctAnswer: clip(String(question.answer), 100),
            isCorrect: Boolean(isCorrect),
            topic: clip(String(question.topic || 'math'), 50)
          })
        }
      ]
    });

    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[/api/explain] error:', err);
    try {
      res.write(`data: ${JSON.stringify({ error: err.message || 'Unknown error' })}\n\n`);
      res.end();
    } catch {
      res.status(500).json({ error: err.message || 'Unknown error' });
    }
  }
}

// ---- helpers ----

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function clip(s, max) {
  if (typeof s !== 'string') return '';
  return s.length > max ? s.slice(0, max) : s;
}
