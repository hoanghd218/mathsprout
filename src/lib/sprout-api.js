// MathSprout — Frontend client for Vercel Functions /api/explain and /api/recommend.
// Wraps fetch + SSE parsing so React components stay simple.

/**
 * Stream a bilingual explanation from Claude.
 *
 * Calls /api/explain (POST) and parses Server-Sent Events. The server emits:
 *   data: {"text": "<chunk>"}\n\n
 *   ...
 *   data: [DONE]\n\n
 * On error: data: {"error": "..."}\n\n
 *
 * @param {object} p
 * @param {object} p.question        - { questionEn, questionVi, answer, topic }
 * @param {string|number} p.userAnswer
 * @param {boolean} p.isCorrect
 * @param {number} p.grade           - 1..5
 * @param {number} p.age             - 5..12
 * @param {(text: string) => void} [p.onChunk]
 * @param {() => void} [p.onDone]
 * @param {(err: Error) => void} [p.onError]
 * @returns {Promise<void>}
 */
export async function streamExplain({
  question,
  userAnswer,
  isCorrect,
  grade,
  age,
  onChunk,
  onDone,
  onError
}) {
  try {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, userAnswer, isCorrect, grade, age })
    });

    if (!res.ok || !res.body) {
      const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(errBody.error || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    // SSE events are separated by blank lines (\n\n).
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith('data:')) continue;

        const payload = line.slice(5).trim();
        if (payload === '[DONE]') {
          onDone?.();
          return;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.error) {
            onError?.(new Error(parsed.error));
            return;
          }
          if (parsed.text) onChunk?.(parsed.text);
        } catch {
          // skip malformed event
        }
      }
    }
    onDone?.();
  } catch (err) {
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Stream a bilingual chat reply from Sprout (multi-turn math Q&A).
 *
 * Calls /api/chat (POST) and parses SSE the same way as streamExplain.
 * When `images` is non-empty, the server attaches them to the last user
 * message and routes to a vision-capable model.
 *
 * @param {object} p
 * @param {Array<{role:'user'|'assistant', content:string}>} p.messages
 * @param {number} p.grade   - 1..5
 * @param {number} p.age     - 5..12
 * @param {string[]} [p.images] - data URLs ("data:image/jpeg;base64,...")
 * @param {(text: string) => void} [p.onChunk]
 * @param {() => void} [p.onDone]
 * @param {(err: Error) => void} [p.onError]
 * @param {AbortSignal} [p.signal]
 * @returns {Promise<void>}
 */
export async function streamChat({ messages, grade, age, images, onChunk, onDone, onError, signal }) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, grade, age, images }),
      signal
    });

    if (!res.ok || !res.body) {
      const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(errBody.error || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() || '';

      for (const event of events) {
        const line = event.trim();
        if (!line.startsWith('data:')) continue;

        const payload = line.slice(5).trim();
        if (payload === '[DONE]') {
          onDone?.();
          return;
        }
        try {
          const parsed = JSON.parse(payload);
          if (parsed.error) {
            onError?.(new Error(parsed.error));
            return;
          }
          if (parsed.text) onChunk?.(parsed.text);
        } catch {
          // skip malformed event
        }
      }
    }
    onDone?.();
  } catch (err) {
    if (err?.name === 'AbortError') return;
    onError?.(err instanceof Error ? err : new Error(String(err)));
  }
}

/**
 * Request a personalized recommendation plan (non-stream).
 *
 * @param {object} p
 * @param {object} p.skillMap        - { addition: { mastery, attempts, correct }, ... }
 * @param {object} [p.recentSummary] - compressed per-topic stats + recent errors
 * @param {number} p.grade
 * @param {number} p.age
 * @returns {Promise<{
 *   recommendations: Array<{
 *     topic: string, subtype: string,
 *     title_en: string, title_vi: string,
 *     reason_en: string, reason_vi: string,
 *     difficulty: 'easy'|'medium'|'hard', drill_count: number
 *   }>,
 *   overall_summary_en: string,
 *   overall_summary_vi: string
 * }>}
 */
export async function requestRecommendation({ skillMap, recentSummary, grade, age }) {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillMap, recentSummary, grade, age })
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(errBody.error || `HTTP ${res.status}`);
  }

  return await res.json();
}

/**
 * Quick health check — verify API key is configured + model name.
 * @returns {Promise<{ ok: boolean, model?: string, error?: string }>}
 */
export async function checkHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
