// MathSprout — /api/health: quick probe to verify env + model config.
// Useful for debugging deployment before testing /api/explain or /api/chat.
//
// Example: curl http://localhost:5173/api/health
// Example response: { "ok": true, "provider": "openrouter", "model": "moonshotai/kimi-k2.6", "timestamp": "..." }

import { MODEL, isReady } from './_lib/llm-client.js';

export default function handler(req, res) {
  res.status(200).json({
    ok: isReady(),
    provider: 'openrouter',
    model: MODEL,
    timestamp: new Date().toISOString(),
    hint: isReady()
      ? 'API key detected — Sprout is ready.'
      : 'OPENROUTER_API_KEY missing. Add it to .env.local (local) or Vercel env vars (prod).'
  });
}
