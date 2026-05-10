# Plan — AI Assistant Sprout (Claude Sonnet 4.6)

**Date:** 2026-05-05 19:50
**Author:** Claude (delegated)
**Stack:** React 19 + Vite + Tailwind 4 + Vercel Serverless Functions
**Model:** `claude-sonnet-4-6`
**Deploy target:** Vercel (public)

---

## Goal

Bổ sung trợ lý AI "Sprout" cho MathSprout với 3 năng lực chính:
1. **Giải thích bài khó** — học sinh bấm nút → AI phân tích đề + đưa lời giải song ngữ phù hợp tuổi (grade 1-5).
2. **Đề xuất bài tập cá nhân hoá** — AI đọc lịch sử (đúng/sai/chậm) → đề xuất dạng bài + lý do TẠI SAO.
3. **Đa dạng dạng bài tập lớp 1-5** — mở rộng generators ngoài 4 phép tính cơ bản (thêm so sánh số, thời gian, phân số, hình học, đo lường…).

Architecture: gọi Claude API qua **Vercel Serverless Functions** (`/api/*`) — API key giấu phía server, an toàn khi deploy public.

---

## Phases

| # | File | Status | Mô tả |
|---|------|--------|-------|
| 1 | [phase-01-vercel-functions-setup.md](phase-01-vercel-functions-setup.md) | ⏳ Pending | Vercel Functions + Anthropic SDK + env config + `vercel.json` |
| 2 | [phase-02-sprout-explain-modal.md](phase-02-sprout-explain-modal.md) | ⏳ Pending | Modal "Hỏi Sprout" trên Practice + Result page, streaming bilingual |
| 3 | [phase-03-personalized-recommendation.md](phase-03-personalized-recommendation.md) | ⏳ Pending | Card "Sprout đề xuất bài cho em" trên Dashboard, có lý do |
| 4 | [phase-04-expand-topics-grades-1-5.md](phase-04-expand-topics-grades-1-5.md) | ⏳ Pending | Thêm 7 topics mới (counting, comparison, time, money, fractions, geometry, measurement) + generators |
| 5 | [phase-05-docs-and-cleanup.md](phase-05-docs-and-cleanup.md) | ⏳ Pending | `docs/ai-setup.md`, README update, xoá legacy `js/`, `css/` |

---

## Key Dependencies

- `@anthropic-ai/sdk` — Anthropic official SDK (server-side)
- `vercel` (devDep) — local dev với `vercel dev`
- Env: `ANTHROPIC_API_KEY` (server-only, KHÔNG có tiền tố `VITE_`)

## Cross-cutting decisions

- **Model:** `claude-sonnet-4-6` mặc định, override qua `CLAUDE_MODEL` env
- **Prompt caching:** dùng `cache_control: { type: "ephemeral" }` cho system prompts (tiết kiệm 90% cost)
- **Streaming:** SSE (Server-Sent Events) cho explain → trẻ em thấy chữ chạy ra
- **Recommend:** non-streaming, trả JSON một lần
- **Rate limit:** không cần cho v2.0 (demo STEMFEST), thêm sau nếu deploy production rộng

## Success Criteria (overall)

- [ ] Em Minh điền API key vào `.env.local`, chạy `vercel dev`, app chạy được
- [ ] Bấm "Hỏi Sprout" trên bài sai → modal hiện lời giải song ngữ stream
- [ ] Bấm "Sprout đề xuất bài" trên Dashboard → hiện 3-5 dạng bài đề xuất + lý do
- [ ] Có ít nhất 8 dạng bài tập (4 cũ + ≥4 mới) phủ grades 1-5
- [ ] Deploy Vercel thành công, key giấu phía server (không lộ bundle)

## Open Questions

- (none — sẽ cập nhật khi gặp blocker)
