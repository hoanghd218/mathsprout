// MathSprout — /api/chat: bilingual math Q&A chatbot with optional image input.
// Streams text deltas as Server-Sent Events:
//   data: {"text":"<chunk>"}\n\n
//   ...
//   data: [DONE]\n\n
//
// On error: data: {"error":"..."}\n\n then close.
//
// Body shape:
// {
//   messages: [
//     { role: 'user' | 'assistant', content: '...' },
//     ...
//   ],
//   grade: 1..5,
//   age:   5..12,
//   images?: ['data:image/jpeg;base64,...', ...]   // attached to LAST user message
// }
//
// When `images` is non-empty, the last user message is converted to a multimodal
// content array and the request is routed to a vision-capable model
// (default: google/gemini-2.5-flash via OpenRouter).

import { client, MODEL, isReady } from './_lib/llm-client.js';
import { buildChatSystemPrompt } from './_lib/prompts.js';

export const maxDuration = 30;

const MAX_TURNS = 16;
const MAX_MSG_LEN = 2000;
const MAX_IMAGES = 1;
// Vision model for image input — Gemini 2.5 Flash is fast, cheap, strong vision.
const VISION_MODEL = process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.5-flash';

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

  const { messages, grade = 2, age = 7, images } = body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages must be a non-empty array' });
  }

  const safeGrade = clamp(Number(grade) || 2, 1, 5);
  const safeAge = clamp(Number(age) || 7, 5, 12);
  const safeImages = sanitiseImages(images);

  // Sanitise + trim history. Keep last MAX_TURNS turns; ensure first message is user.
  const cleaned = sanitiseMessages(messages).slice(-MAX_TURNS);
  while (cleaned.length && cleaned[0].role !== 'user') cleaned.shift();
  if (cleaned.length === 0) {
    return res.status(400).json({ error: 'No valid user messages found' });
  }

  // Attach images to LAST user message → multimodal content array.
  if (safeImages.length > 0) {
    const lastIdx = findLastUserIdx(cleaned);
    if (lastIdx >= 0) {
      const last = cleaned[lastIdx];
      const textPart = typeof last.content === 'string' ? last.content : '';
      cleaned[lastIdx] = {
        role: 'user',
        content: [
          { type: 'text', text: textPart || 'Giúp em giải bài này / Please help me solve this.' },
          ...safeImages.map(url => ({ type: 'image_url', image_url: { url } }))
        ]
      };
    }
  }

  const modelToUse = safeImages.length > 0 ? VISION_MODEL : MODEL;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    const stream = await client.chat.completions.create({
      model: modelToUse,
      max_tokens: 800,
      stream: true,
      // Disable Kimi K2.6 reasoning trace — speeds up TTFT and frees the
      // token budget for the actual kid-friendly chat reply. (No-op on Gemini.)
      reasoning: { enabled: false },
      messages: [
        { role: 'system', content: buildChatSystemPrompt(safeGrade, safeAge) },
        ...cleaned
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
    console.error('[/api/chat] error:', err);
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

function sanitiseMessages(arr) {
  const out = [];
  for (const m of arr) {
    if (!m || typeof m !== 'object') continue;
    const role = m.role === 'assistant' ? 'assistant' : m.role === 'user' ? 'user' : null;
    if (!role) continue;
    const content = clip(typeof m.content === 'string' ? m.content : '', MAX_MSG_LEN);
    if (!content.trim()) continue;
    out.push({ role, content });
  }
  return out;
}

function sanitiseImages(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter(u => typeof u === 'string' && u.startsWith('data:image/'))
    .slice(0, MAX_IMAGES);
}

function findLastUserIdx(arr) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].role === 'user') return i;
  }
  return -1;
}
