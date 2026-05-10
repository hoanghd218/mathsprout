// MathSprout — Singleton OpenAI-compatible client pointed at OpenRouter.
// Loaded by all /api/* serverless functions. Reads OPENROUTER_API_KEY from env.

import OpenAI from 'openai';

const apiKey = process.env.OPENROUTER_API_KEY;

// Default model: Moonshot AI Kimi K2.6 via OpenRouter (override via OPENROUTER_MODEL).
export const MODEL = process.env.OPENROUTER_MODEL || 'moonshotai/kimi-k2.6';

// Optional referer / app title headers — OpenRouter uses these for attribution.
const SITE_URL = process.env.OPENROUTER_SITE_URL || 'https://mathsprout.app';
const APP_TITLE = process.env.OPENROUTER_APP_TITLE || 'MathSprout';

// Lazy-init: when key missing, /api/health still responds with ok:false instead of crashing.
export const client = apiKey
  ? new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
      defaultHeaders: {
        'HTTP-Referer': SITE_URL,
        'X-Title': APP_TITLE
      }
    })
  : null;

export const isReady = () => Boolean(apiKey);
