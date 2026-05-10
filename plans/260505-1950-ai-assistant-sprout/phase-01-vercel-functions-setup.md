# Phase 1 — Vercel Functions + Anthropic SDK Setup

## Context Links
- [.env.example](../../.env.example) — đã tạo
- [vite.config.js](../../vite.config.js)
- [package.json](../../package.json)

## Overview
- **Priority:** P0 (foundation — các phase sau phụ thuộc)
- **Status:** ⏳ Pending
- **Estimate:** ~45 phút

## Key Insights
- Vercel auto-detect `/api/**.js` files → triển khai thành Serverless Functions
- `vercel dev` đọc `.env.local` cho local dev (không phải `vite dev`)
- Khi build Vite static, Vercel route `/api/*` → functions, các path khác → `dist/`
- `@anthropic-ai/sdk` Node SDK đã hỗ trợ streaming + prompt caching out-of-the-box

## Requirements

### Functional
- `/api/explain` — POST endpoint, nhận `{ question, userAnswer, isCorrect, grade, age, language }`, trả SSE stream
- `/api/recommend` — POST endpoint, nhận `{ skillMap, recentAttempts, grade, age }`, trả JSON một lần
- `/api/health` — GET, trả `{ ok: true, model: "..." }` (debug)

### Non-functional
- Cold start < 2s
- Stream latency: first token < 1.5s
- Lỗi 401/timeout → trả JSON error rõ ràng cho client xử lý

## Architecture

```
Browser  ─── fetch /api/explain ──▶ Vercel Function (Node 20)
                                        │
                                        ├─ Anthropic SDK
                                        │  └─ Claude Sonnet 4.6
                                        │
                                        └─ SSE stream chunks back
```

- API key đọc từ `process.env.ANTHROPIC_API_KEY` (KHÔNG ở client)
- Build prompt từ template trong `api/_lib/prompts.js` (shared between functions)

## Related Code Files

### Create
- `vercel.json` — runtime config + rewrites (nếu cần)
- `api/explain.js` — endpoint giải thích
- `api/recommend.js` — endpoint đề xuất
- `api/health.js` — endpoint kiểm tra
- `api/_lib/anthropic-client.js` — singleton Anthropic client + model config
- `api/_lib/prompts.js` — shared system prompts (sẽ chi tiết ở phase 2-3)
- `src/lib/sprout-api.js` — frontend fetch wrapper

### Modify
- `package.json` — add `@anthropic-ai/sdk`, `vercel` (dev), script `dev:vercel`
- `.gitignore` — add `.vercel/` (đã có rồi, verify)
- `README.md` — sửa "Cách chạy" thành `vercel dev`

## Implementation Steps

1. **Install deps**
   ```bash
   npm install @anthropic-ai/sdk
   npm install -D vercel
   ```

2. **Create `vercel.json`**
   ```json
   {
     "functions": {
       "api/**/*.js": { "runtime": "nodejs20.x", "maxDuration": 30 }
     }
   }
   ```

3. **Create `api/_lib/anthropic-client.js`**
   - Init `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })`
   - Export `client` + `MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-6'`

4. **Create `api/health.js`**
   - Return `{ ok: !!process.env.ANTHROPIC_API_KEY, model: MODEL }`
   - Test: `curl http://localhost:3000/api/health`

5. **Skeleton `api/explain.js`** (full prompt logic ở phase 2)
   - Validate body
   - Set `Content-Type: text/event-stream`
   - Loop `client.messages.stream(...)` → write `data: {...}\n\n`
   - End with `data: [DONE]\n\n`

6. **Skeleton `api/recommend.js`** (full prompt logic ở phase 3)
   - Validate body
   - `client.messages.create(...)` non-stream
   - Return JSON

7. **Create `src/lib/sprout-api.js`**
   - `streamExplain({ question, ..., onChunk })` — fetch + ReadableStream parser
   - `requestRecommendation({ skillMap, ... })` — fetch + json()

8. **Update `package.json` scripts**
   ```json
   "dev": "vercel dev",
   "dev:vite": "vite",
   "build": "vite build",
   "preview": "vite preview"
   ```

9. **Test end-to-end skeleton**
   - `cp .env.example .env.local` + paste key
   - `vercel dev` → mở `localhost:3000`
   - Curl `/api/health` → `{ok: true, model: "claude-sonnet-4-6"}`
   - From browser DevTools console: test `fetch('/api/explain', {method:'POST', body: JSON.stringify({question:'2+2'})})` → see stream

## Todo List
- [ ] Install `@anthropic-ai/sdk` + `vercel`
- [ ] Create `vercel.json`
- [ ] Create `api/_lib/anthropic-client.js`
- [ ] Create `api/health.js`
- [ ] Skeleton `api/explain.js` (echo Claude response)
- [ ] Skeleton `api/recommend.js`
- [ ] Create `src/lib/sprout-api.js`
- [ ] Update `package.json` scripts
- [ ] Test `vercel dev` + `/api/health`
- [ ] Test stream from browser console

## Success Criteria
- `vercel dev` chạy, port 3000 mở
- `/api/health` trả 200 với model đúng
- `/api/explain` nhận POST, stream chunks về client (chưa cần prompt hoàn chỉnh)

## Risk Assessment
- **Risk:** API key sai/hết quota → 401. **Mitigation:** `/api/health` báo rõ, frontend fallback graceful.
- **Risk:** Vercel function cold start chậm. **Mitigation:** chấp nhận cho v2.0; sau này có thể chuyển Edge Runtime.

## Security Considerations
- API key CHỈ ở `process.env`, KHÔNG bao giờ trả về client
- CORS: mặc định same-origin (Vercel route nội bộ) → không cần cấu hình thêm
- Validate input length (max 2KB body) để tránh abuse

## Next Steps
- Phase 2: Hoàn thiện prompt template + frontend modal cho explain
- Phase 3: Hoàn thiện prompt JSON + Dashboard card cho recommend
