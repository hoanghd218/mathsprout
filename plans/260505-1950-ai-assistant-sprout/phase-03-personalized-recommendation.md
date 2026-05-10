# Phase 3 — AI Personalized Recommendation Card

## Context Links
- [phase-01-vercel-functions-setup.md](phase-01-vercel-functions-setup.md)
- [src/pages/dashboard-page.jsx](../../src/pages/dashboard-page.jsx) — sẽ thêm card
- [src/lib/recommender.js](../../src/lib/recommender.js) — recommend cũ (rule-based) vẫn giữ làm fallback

## Overview
- **Priority:** P1
- **Status:** ⏳ Pending
- **Estimate:** ~75 phút

## Key Insights
- Recommend cũ (rule-based) trong `recommender.js` đã tốt nhưng KHÔNG giải thích "tại sao"
- AI có thể nhìn pattern phức tạp: "em sai 80% bài subtraction CÓ NHỚ nhưng đúng 100% subtraction không nhớ" → đề xuất chính xác
- Trả JSON cứng để frontend render card đẹp, không cần stream
- KHÔNG thay thế recommender cũ — bổ sung. Rule-based vẫn dùng để generate `currentLesson.questions` nhanh.

## Requirements

### Functional
- Card "✨ Sprout đề xuất bài cho em" trên Dashboard, dưới recommendation cũ
- Bấm card → gọi `/api/recommend` → loading 1-3s → hiện kết quả
- Kết quả gồm:
  - **3-5 dạng bài** đề xuất (vd: "Subtraction with regrouping", "Mixed word problems")
  - **Lý do song ngữ** ngắn gọn cho mỗi dạng
  - **Nút "Bắt đầu luyện"** cho mỗi dạng → spawn lesson tập trung topic đó
- Cache kết quả 30 phút (localStorage) để tránh spam API

### Non-functional
- Response < 5s
- Token: max 1500 output (JSON ~500-800 tokens)

## Architecture

```
Dashboard
    │
    │ click "Sprout đề xuất"
    ▼
sprout-api.js → fetch('/api/recommend', {body: {skillMap, recentAttempts.slice(-50), grade, age}})
    │
    ▼
api/recommend.js → Anthropic non-stream + prompt cache
    │
    ▼
Returns:
{
  recommendations: [
    {
      topic: "subtraction",
      subtype: "with_regrouping",
      title_en: "Subtraction with regrouping",
      title_vi: "Phép trừ có nhớ",
      reason_en: "You got 4/10 right on regrouping but 9/10 on no-regrouping",
      reason_vi: "Em làm đúng 9/10 phép trừ không nhớ nhưng chỉ 4/10 phép trừ có nhớ",
      difficulty: "medium",
      drill_count: 5
    }, ...
  ],
  overall_summary_en: "Focus on regrouping techniques this week",
  overall_summary_vi: "Tuần này tập trung kỹ thuật mượn/nhớ"
}
```

### Prompt (`api/_lib/prompts.js`)

System (cached):
```
You are Sprout 🌱, an adaptive math tutor analyzing a Vietnamese
elementary student's performance. Output STRICT JSON ONLY (no
prose, no markdown). Schema:

{ "recommendations": [{ topic, subtype, title_en, title_vi,
  reason_en, reason_vi, difficulty: "easy|medium|hard", drill_count }],
  "overall_summary_en": "...", "overall_summary_vi": "..." }

Rules:
- Pick 3-5 recommendations.
- Identify SPECIFIC weakness patterns (regrouping, multiplication
  table gaps, word-problem comprehension, etc.) — not just topic-level.
- Reasons must reference numbers ("4/10 correct", "avg 25s vs 10s").
- Use age-appropriate Vietnamese.
- Available topics: addition, subtraction, multiplication, division,
  comparison, time, money, fractions, geometry, measurement.
- Match difficulty to grade {grade}.
```

User: `Student data: grade={grade}, age={age}, skillMap={...}, last50Attempts=[...summary stats per topic, recent error patterns...]`

(Compress attempts to per-topic stats + last 10 wrong examples to save tokens.)

## Related Code Files

### Create
- `src/components/sprout-assistant/sprout-recommendation-card.jsx` — main card
- `src/components/sprout-assistant/recommendation-item.jsx` — single recommendation row
- `src/lib/recommendation-cache.js` — localStorage cache (30 min TTL)
- `src/lib/attempt-summary.js` — compress attempts → token-friendly summary

### Modify
- `api/_lib/prompts.js` — add `buildRecommendSystemPrompt(grade, age)` + `buildRecommendUserMessage(...)`
- `api/recommend.js` — implement đầy đủ
- `src/lib/sprout-api.js` — add `requestRecommendation(...)`
- `src/pages/dashboard-page.jsx` — thêm `<SproutRecommendationCard>` dưới recommendation cũ
- `src/context/app-context.jsx` — thêm action `START_FOCUSED_LESSON` (lesson tập trung 1 subtype)
- `src/lib/recommender.js` — thêm `getFocusedLesson(state, topic, count)` để spawn từ rec AI

## Implementation Steps

1. **Build `attempt-summary.js`**
   - Input: `state.attempts` (mảng dài)
   - Output: `{ perTopic: { addition: {total, correct, avgTime, ...}, ... }, recentErrors: [last10WrongQuestions] }`
   - Mục đích: nén ~500 attempts xuống ~20 dòng JSON
2. **Build prompt functions** in `api/_lib/prompts.js`
3. **Wire `api/recommend.js`** với JSON response (set `Content-Type: application/json`)
4. **Build `requestRecommendation` in sprout-api.js**
   - Try/catch JSON.parse, validate schema (basic)
5. **Build `recommendation-cache.js`** — `getCached(userId)` / `setCached(userId, data)` với TTL
6. **Build `<SproutRecommendationCard>`**
   - States: `idle | loading | error | ready`
   - `idle`: nút lớn "✨ Hỏi Sprout em nên luyện gì?"
   - `loading`: skeleton với 🌱 spinner
   - `ready`: list `<RecommendationItem>` + summary
7. **Build `<RecommendationItem>`**
   - Topic emoji + title bilingual + reason + difficulty badge + nút "Luyện 5 bài"
8. **Wire `START_FOCUSED_LESSON` reducer** + `getFocusedLesson` generator
   - Nhận `{topic, subtype, count}` → generate 5 bài cùng dạng
9. **Add card to dashboard**
   - Dưới recommendation card hiện tại, trên grid 2x2 nav
10. **Test:**
    - Tài khoản mới (chưa có data) → AI đề xuất "untouched topics"
    - Tài khoản có nhiều attempt → AI đọc đúng pattern weakness
    - Bấm "Luyện 5 bài" → vào practice với đúng topic

## Todo List
- [ ] Build `attempt-summary.js`
- [ ] Build recommend prompts in `api/_lib/prompts.js`
- [ ] Wire `api/recommend.js`
- [ ] Add `requestRecommendation` to sprout-api.js
- [ ] Build `recommendation-cache.js`
- [ ] Build `<SproutRecommendationCard>`
- [ ] Build `<RecommendationItem>`
- [ ] Add `START_FOCUSED_LESSON` reducer
- [ ] Add `getFocusedLesson` to recommender.js
- [ ] Add card to dashboard-page.jsx
- [ ] Test with empty + populated state

## Success Criteria
- Card hiện đúng 3-5 đề xuất với lý do bilingual cụ thể
- Lý do có dẫn chứng số liệu thật từ skillMap
- Bấm "Luyện 5 bài" navigate đúng vào practice với topic chỉ định
- Cache 30 phút hoạt động (lần thứ 2 mở dashboard không gọi API)

## Risk Assessment
- **Risk:** Claude trả JSON sai format → app crash. **Mitigation:** validate schema, fallback hiện rule-based recommendation cũ.
- **Risk:** Trẻ em bấm spam tốn API. **Mitigation:** cache 30 min + disable button while loading + max 5 calls/day per user (localStorage counter).

## Security Considerations
- Validate input ở `/api/recommend` — `attempts` array max 100 items, mỗi item < 200 bytes
- KHÔNG truyền PII qua prompt (chỉ topic stats, không tên thật)

## Next Steps
- Phase 4: Topic mới sẽ tự động có sẵn trong recommend (vì prompt liệt kê 10 topics)
