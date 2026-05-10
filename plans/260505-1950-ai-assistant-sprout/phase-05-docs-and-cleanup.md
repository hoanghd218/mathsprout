# Phase 5 — Docs + Cleanup Legacy

## Context Links
- [README.md](../../README.md) — cần cập nhật
- `js/`, `css/` legacy folders (đã bị xóa trong git status nhưng cần verify)

## Overview
- **Priority:** P2
- **Status:** ⏳ Pending
- **Estimate:** ~30 phút

## Key Insights
- README hiện liệt kê "AI Chatbot Sprout (cần API key Claude)" trong v2.0 → giờ đã có, cần move lên v1.0
- Người dùng cần hướng dẫn rõ: lấy key, deploy Vercel, troubleshoot
- Legacy `js/`, `css/`, `js/app.js`, `js/data.js`, etc. trong git status là D (deleted) — cần `git rm` clean

## Requirements

### Functional
- `docs/ai-setup.md` — hướng dẫn step-by-step
- `docs/codebase-summary.md` — cập nhật cấu trúc mới (api/, components/sprout-assistant/, generators/)
- README.md — Cách chạy với `vercel dev`, link tới docs/ai-setup.md
- `.gitignore` — verify có `.vercel/`, `.env*.local`
- Xóa legacy files

### Non-functional
- Hướng dẫn ngắn gọn, có ảnh chụp màn hình (placeholder text vì không generate ảnh được)

## Related Code Files

### Create
- `docs/ai-setup.md`
- `docs/codebase-summary.md` (nếu chưa có)

### Modify
- `README.md`
- `.gitignore` (verify)

### Delete
- `css/style.css`, `js/app.js`, `js/data.js`, `js/generators.js`, `js/recommender.js`, `js/storage.js`, `js/ui.js` (đã D, chỉ cần commit)

## Implementation Steps

1. **Write `docs/ai-setup.md`** — chi tiết:
   - Lấy API key tại console.anthropic.com
   - Copy `.env.example` → `.env.local`, paste key
   - `npm install -g vercel` (nếu chưa)
   - `npm install`
   - `vercel dev` (thay cho `npm run dev`)
   - Test `http://localhost:3000/api/health`
   - Deploy: `vercel link` → `vercel env add ANTHROPIC_API_KEY` → `vercel --prod`
   - Troubleshoot: 401 (key sai), 429 (hết quota), CORS (không gặp)
2. **Update `README.md`:**
   - Section "🚀 Cách chạy" thay `npm run dev` thành `vercel dev`
   - Section "✅ Tính năng v1.0" thêm "AI Sprout Assistant", "Personalized recommendations", topics mới
   - Section "🚧 v2.0" xóa "AI Chatbot" (đã có), giữ Mini-games / Leaderboard
   - Thêm link tới `docs/ai-setup.md`
3. **Write `docs/codebase-summary.md`** — high-level overview:
   - Routes
   - State management
   - API surface (Vercel functions)
   - Generators system
4. **Cleanup legacy:**
   - `git rm css/style.css js/*.js` (these are D in status)
   - Verify `index.html` không reference chúng (đã verify từ build, vẫn check)
5. **Smoke test:**
   - Clean `npm install` từ đầu
   - `vercel dev` từ scratch theo đúng docs
   - Build production: `npm run build` không lỗi

## Todo List
- [ ] Write `docs/ai-setup.md`
- [ ] Update README.md (run instructions, features list)
- [ ] Write `docs/codebase-summary.md`
- [ ] `git rm` legacy js/ css/ files
- [ ] Verify `.gitignore` includes `.vercel/`, `.env.local`
- [ ] Smoke test full flow per docs

## Success Criteria
- Người mới clone repo → đọc README → setup chạy được trong < 10 phút
- Deploy Vercel theo docs thành công
- `git status` clean sau cleanup

## Risk Assessment
- (low risk phase)

## Security Considerations
- Verify KHÔNG commit `.env.local` hay `.vercel/` (chỉ `.env.example`)

## Next Steps
- Submit PR
- Demo STEMFEST 2026
