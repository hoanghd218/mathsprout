# Plan — Homework Helper Assistant (chat + image upload)

**Date:** 2026-05-10
**Branch:** main
**Mode:** /ck:cook (interactive)

## Goal

Mở rộng chat Sprout hiện tại thành "trợ lý giải bài tập":
- HS gõ nội dung bài toán → Sprout giải step-by-step theo lớp
- HS chụp/upload ảnh đề bài → Sprout đọc ảnh + giải
- Nếu ảnh thiếu/mờ/không đủ data → Sprout hỏi lại (vẫn bilingual)
- Phương pháp giải khớp lớp 1-5 (đã có sẵn grade-aware prompt)

## Decisions (đã chốt với user)

| Vấn đề | Quyết định |
|---|---|
| UI placement | Mở rộng page `/chat` hiện tại (KISS, tận dụng history + bilingual) |
| Vision model | Auto-switch `google/gemini-2.5-flash` khi có ảnh; giữ Kimi K2.6 cho text-only |
| Image input | File upload + camera capture (`accept=image/* capture=environment`) |

## Architecture

```
ChatPage (chat-page.jsx)
  ├─ AttachButton → file picker (camera on mobile)
  ├─ ImagePreview (chip dưới input, có nút x để bỏ)
  └─ Composer → useChatStream.send(text, images)
       ↓
useChatStream
  └─ streamChat({ messages, grade, age, images })
       ↓
POST /api/chat { messages, grade, age, images: [base64,...] }
  ├─ images empty → Kimi K2.6 + text content
  └─ images present → Gemini 2.5 Flash + multimodal content array
       ↓
SSE stream → bilingual <en>/<vi> tags → ChatBubble
```

## Phases

| # | Phase | Status |
|---|---|---|
| 1 | API: chat.js multimodal + model auto-switch | pending |
| 2 | Prompt: homework solver instructions trong buildChatSystemPrompt | pending |
| 3 | Frontend: streamChat + useChatStream pass images | pending |
| 4 | UI: chat-page attach button + image preview + bubble | pending |
| 5 | CSS: image styles | pending |
| 6 | Test + docs update | pending |

## Files Affected

**Modify (no new files needed):**
- `api/chat.js` — accept `images`, convert to multimodal, switch model
- `api/_lib/prompts.js` — extend `buildChatSystemPrompt` w/ homework solver rules
- `src/lib/sprout-api.js` — `streamChat` accept `images` param
- `src/components/sprout-assistant/use-chat-stream.js` — `send(text, images)`, store image previews on user msg
- `src/pages/chat-page.jsx` — attach button, preview, image bubble
- `src/index.css` — small additions for image styles
- `README.md` — note feature

**New (1 file only):**
- `src/lib/image-utils.js` — `fileToDataUrl`, `compressImage` (max 1024px JPEG q0.85)

## Key Implementation Details

### Image compression (must)
- Compress client-side to ≤1024px longest edge, JPEG q=0.85
- Reason: vision API tốn token/latency theo size; cell phone photo có thể 4MB+
- Use `<canvas>` API; KISS, no library

### Multimodal payload (OpenAI-compatible)
```js
content: [
  { type: 'text', text: 'Giúp em giải bài này' },
  { type: 'image_url', image_url: { url: 'data:image/jpeg;base64,...' } }
]
```
OpenRouter relays this to Gemini.

### Model auto-switch
```js
const hasImage = messages.some(m => Array.isArray(m.content) && m.content.some(c => c.type === 'image_url'));
const modelToUse = hasImage ? 'google/gemini-2.5-flash' : MODEL;
```

### Prompt addendum (homework solver)
Add to `buildChatSystemPrompt`:
```
Homework Solver mode (when user attaches an image OR asks to solve a specific problem):
- Read the problem carefully (from text or image).
- If image is blurry / cropped / missing key info, DO NOT guess — ask ONE clarifying question (still bilingual).
- Use the grade-${grade} method:
  - Grade 1-2: count, draw, group concrete objects.
  - Grade 3: skip-count, repeated addition for multiplication, simple long division.
  - Grade 4: standard algorithms (column add/sub with regrouping, long mult/div).
  - Grade 5: fractions, decimals, percentages, multi-step word problems.
- Show steps clearly, then state the final answer.
```

## Success Criteria

- [ ] Text-only chat vẫn hoạt động (no regression)
- [ ] Upload ảnh từ desktop → preview hiện → gửi → AI giải bài
- [ ] Trên mobile, nút attach mở camera → chụp → gửi
- [ ] Ảnh mờ/thiếu data → AI hỏi lại bilingual
- [ ] Lớp 1 vs lớp 5 → phương pháp giải khác nhau
- [ ] Build pass, dev server không lỗi console

## Risks

- **Token cost**: ảnh lớn → tốn token. Mitigation: client-side compress 1024px.
- **Privacy**: HS có thể chụp ảnh chứa info cá nhân. Note: ảnh chỉ gửi tới OpenRouter → Gemini, không lưu localStorage.
- **OpenRouter Gemini availability**: nếu API down → fallback message "thử lại sau" (đã có sẵn).

## Out of Scope

- Lưu ảnh vào localStorage / history persistence (chat hiện tại cũng không persist)
- OCR client-side (để Gemini làm)
- Nhiều ảnh cùng lúc (1 ảnh/turn cho KISS)

## Open Questions

- Có cần limit kích thước file (vd: ≤5MB raw) trước compress để tránh OOM trên mobile cũ? → tạm set 10MB raw, compress xuống.
