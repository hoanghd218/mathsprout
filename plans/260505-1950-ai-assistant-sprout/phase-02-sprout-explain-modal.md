# Phase 2 — AI Assistant Sprout Modal (Explain Hard Problems)

## Context Links
- [phase-01-vercel-functions-setup.md](phase-01-vercel-functions-setup.md) — phụ thuộc
- [src/pages/result-page.jsx](../../src/pages/result-page.jsx) — sẽ thêm nút
- [src/pages/practice-page.jsx](../../src/pages/practice-page.jsx) — sẽ thêm nút

## Overview
- **Priority:** P0
- **Status:** ⏳ Pending
- **Estimate:** ~90 phút

## Key Insights
- Học sinh lớp 1-5 cần ngôn ngữ ĐƠN GIẢN, ví dụ trực quan (đếm que, vẽ hình, nhóm đồ vật)
- Lời giải song ngữ: tiếng Anh trước (vì app dạy Toán bằng tiếng Anh), tiếng Việt theo sau
- Stream giúp UX cảm giác "Sprout đang suy nghĩ" — phù hợp tâm lý trẻ em
- Modal cần đóng được dễ dàng (ESC, click outside, nút X)

## Requirements

### Functional
- Nút "🌱 Hỏi Sprout" hiển thị ở:
  - **Result page** khi sai (luôn) hoặc đúng nhưng có nút "Hỏi sâu hơn" (optional)
  - **Practice page** khi học sinh bí (sau 30s) — gợi ý nhẹ
- Modal mở ra với header "Sprout đang giải thích..."
- 2 sections song ngữ: 🇬🇧 English, 🇻🇳 Tiếng Việt
- Mỗi section có nút 🔊 đọc to (Web Speech API đã có)
- Stream chữ chạy real-time
- Có nút "Hiểu rồi! 👍" để đóng modal

### Non-functional
- Modal accessible: focus trap, ESC đóng, aria-labels
- Latency: first token < 2s
- Token usage: max 800 output tokens (đủ giải thích, không lan man)

## Architecture

```
ResultPage / PracticePage
    │
    │ click "Hỏi Sprout"
    ▼
<SproutModal question={...} userAnswer={...} grade={user.grade} age={user.age} />
    │
    │ useEffect → streamExplain(...)
    ▼
src/lib/sprout-api.js → fetch('/api/explain', {stream})
    │
    ▼
api/explain.js → Anthropic stream → SSE chunks
    │
    ▼
Modal renders chunks into 2 panels (parsing markers)
```

### Prompt structure (`api/_lib/prompts.js`)
System prompt có **prompt caching** (cache_control ephemeral):

```
You are Sprout 🌱, a friendly bilingual math tutor for Vietnamese
elementary school students (grades 1-5). You explain math problems
in age-appropriate language using:
- Concrete examples (counting fingers, grouping toys, drawing)
- Step-by-step reasoning
- Both English (primary) and Vietnamese (translation)

OUTPUT FORMAT (strict):
<en>
[English explanation here, simple sentences, ≤6 sentences]
</en>
<vi>
[Vietnamese translation, child-friendly tone, ≤6 sentences]
</vi>

Adapt vocabulary to grade {grade} (age {age}):
- Grade 1-2: simplest words, lots of "let's count together!"
- Grade 3-4: introduce "groups", "equal parts"
- Grade 5: can use "fraction", "decimal", "percentage"
```

User message: `Question: {q.questionEn}. Student answered: {userAnswer} (correct answer: {q.answer}). Was correct: {isCorrect}. Help explain.`

## Related Code Files

### Create
- `api/_lib/prompts.js` — function `buildExplainPrompt({grade, age})` + `buildExplainUser({...})`
- `src/components/sprout-assistant/sprout-modal.jsx` — main modal component
- `src/components/sprout-assistant/sprout-button.jsx` — reusable trigger button (claymorphism)
- `src/components/sprout-assistant/use-explain-stream.js` — custom hook quản lý stream state

### Modify
- `api/explain.js` — implement đầy đủ với prompts.js
- `src/pages/result-page.jsx` — thêm `<SproutButton>` ở result card
- `src/pages/practice-page.jsx` — thêm `<SproutButton>` (mờ) sau 30s không trả lời
- `src/index.css` — animation cho modal (slide-up, claymorphism)

## Implementation Steps

1. **Build `api/_lib/prompts.js`** — `buildExplainSystemPrompt(grade, age)` + `buildExplainUserMessage({...})`
2. **Wire `api/explain.js`** — gọi `client.messages.stream` với `system: [{type:'text', text:..., cache_control:{type:'ephemeral'}}]`
3. **Build SSE parser in `src/lib/sprout-api.js`**
   - `streamExplain({...payload, onEnglishChunk, onVietnameseChunk, onDone, onError})`
   - Parser: detect `<en>` `<vi>` tags, route chunks vào 2 callbacks
4. **Create `use-explain-stream.js` hook**
   - State: `{englishText, vietnameseText, status: 'idle'|'streaming'|'done'|'error'}`
   - `start({question, userAnswer, ...})` → gọi `streamExplain`
5. **Create `<SproutModal>`**
   - Portal vào `document.body`
   - Backdrop blur, ESC handler, focus trap (đơn giản: focus close button on mount)
   - 2 panels song ngữ với 🔊 button
   - Loading state: 🌱 mascot bouncing
   - Error state: "Sprout đang nghỉ ngơi, thử lại sau nhé"
6. **Create `<SproutButton>`** — wrapper styled button có badge `🌱`
7. **Wire vào `result-page.jsx`**
   - Sau result card, thêm `<SproutButton onClick={openModal}>🌱 Hỏi Sprout giải thích sâu hơn</SproutButton>`
   - State `[modalOpen, setModalOpen]`
8. **Wire vào `practice-page.jsx`**
   - useEffect timer 30s → set `[showSproutHint, true]`
   - Nếu shown, hiện `<SproutButton variant="ghost">🌱 Cần Sprout giúp?</SproutButton>` cạnh Hint
9. **Test:**
   - Trả lời sai → bấm Hỏi Sprout → modal stream song ngữ
   - Đọc to bằng nút 🔊
   - Đóng bằng ESC + nút X + click backdrop

## Todo List
- [ ] Build `api/_lib/prompts.js` (explain only)
- [ ] Wire `api/explain.js` đầy đủ
- [ ] Implement `streamExplain` parser
- [ ] Create `use-explain-stream.js`
- [ ] Build `<SproutModal>`
- [ ] Build `<SproutButton>`
- [ ] Add to `result-page.jsx`
- [ ] Add to `practice-page.jsx` (delayed hint)
- [ ] CSS animation slide-up
- [ ] Manual test 5 questions các grades

## Success Criteria
- Bấm Hỏi Sprout → modal stream chữ song ngữ trong < 5s
- Câu trả lời thực sự dễ hiểu cho lớp 1-2 (test bằng vài ví dụ)
- 🔊 đọc to đúng tiếng Anh / tiếng Việt
- Modal đóng được 3 cách (ESC, X, click outside)

## Risk Assessment
- **Risk:** Claude trả về không đúng format `<en>/<vi>` → parser hỏng. **Mitigation:** prompt nghiêm ngặt + fallback: nếu không có tag, gom tất vào English panel.
- **Risk:** Token cost cao nếu spam. **Mitigation:** prompt cache (90% off), debounce nút.

## Security Considerations
- Validate `grade` ∈ [1,5], `age` ∈ [5,12], `userAnswer.length < 100` ở `api/explain.js`
- Strip HTML/scripts từ question trước khi nhúng vào prompt (đã là string thuần từ generators, vẫn nên defensive)

## Next Steps
- Phase 3: Recommendation card
- Có thể quay lại phase này thêm nút "Hỏi tiếp" (multi-turn) sau khi v2.0 stable
