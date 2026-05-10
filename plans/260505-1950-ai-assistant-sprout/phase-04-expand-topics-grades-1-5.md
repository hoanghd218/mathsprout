# Phase 4 — Expand Topics + Generators (Grades 1-5)

## Context Links
- [src/data/topics.js](../../src/data/topics.js) — thêm topic
- [src/lib/generators.js](../../src/lib/generators.js) — thêm generator
- [src/lib/recommender.js](../../src/lib/recommender.js) — `getEligibleTopics(grade)` cập nhật

## Overview
- **Priority:** P1
- **Status:** ⏳ Pending
- **Estimate:** ~3-4 giờ (lớn nhất, nhiều generator + word problem template)

## Key Insights
- Chương trình tiểu học VN (theo SGK Cánh Diều / Kết Nối Tri Thức):
  - **Lớp 1:** đếm 1-100, so sánh, cộng/trừ trong 10/20/100, hình học (vuông/tròn/tam giác)
  - **Lớp 2:** bảng nhân/chia 2-5, đo độ dài (cm/dm/m), thời gian (giờ tròn/nửa giờ), VND, hình học
  - **Lớp 3:** bảng nhân/chia 6-9, chu vi/diện tích cơ bản, đo (m, kg, l), thời gian (phút, giây)
  - **Lớp 4:** phân số (cùng mẫu), số lớn, trung bình cộng, biểu đồ cột
  - **Lớp 5:** phân số khác mẫu/nhân/chia, thập phân, %, diện tích/thể tích, tỉ lệ
- Hiện tại app chỉ có 4 topic số học cơ bản → bổ sung **7 topic mới** = 11 topic tổng
- Mỗi topic mới cần: emoji, name bilingual, range theo grade, generator function, ≥3 word problem template

## Requirements

### Functional — 7 topics mới

| Code | Vi | En | Grades | Emoji |
|------|-----|-----|--------|-------|
| `comparison` | So sánh số | Compare numbers | 1-3 | ⚖️ |
| `counting` | Đếm số (đếm nhảy) | Counting / skip-counting | 1-2 | 🔢 |
| `time` | Thời gian | Time | 2-5 | 🕐 |
| `money` | Tiền VNĐ | Money (VND) | 2-5 | 💵 |
| `measurement` | Đo lường | Measurement | 2-5 | 📏 |
| `geometry` | Hình học | Geometry | 2-5 | 📐 |
| `fractions` | Phân số | Fractions | 4-5 | 🍕 |

### Non-functional
- Mỗi generator < 60 LOC (giữ file generators.js < 500 LOC; nếu vượt → tách thành `generators/` folder)
- Word problem template ≥ 3 cho mỗi topic
- Không thay đổi structure của question object: `{topic, type, grade, questionEn, questionVi, answer, explanation, hint}`

## Architecture

### Tách file (vì sẽ vượt 200 LOC)
```
src/lib/generators/
├── index.js                    ← export `generate(topic, grade, opts)`, picks dispatcher
├── core-arithmetic.js          ← addition, subtraction, multiplication, division (move existing)
├── comparison.js               ← <, >, =
├── counting.js                 ← skip-counting (count by 2, 5, 10)
├── time.js                     ← clock reading, elapsed time
├── money.js                    ← VND coins/notes, change, totals
├── measurement.js              ← length, weight, volume, unit conversion
├── geometry.js                 ← perimeter, area, shape recognition
├── fractions.js                ← simplify, compare, add same denom
└── word-problems.js            ← shared template engine (move from generators.js)
```

Each module exports `generate{TopicName}(grade)` returning question object.

### Sample question shapes

**Comparison (lớp 1):**
```js
{
  topic: 'comparison',
  type: 'choice',
  grade: 1,
  questionEn: 'Which symbol fits? 7 __ 4',
  questionVi: 'Dấu nào đúng? 7 __ 4',
  choices: ['<', '>', '='],
  answer: '>',
  explanation: { en: '7 is greater than 4 because 7 > 4', vi: '7 lớn hơn 4 nên dùng dấu >' },
  hint: 'A bigger number on the left means we use >'
}
```

**Counting (lớp 1-2):**
```js
{
  topic: 'counting',
  type: 'sequence',
  grade: 2,
  questionEn: 'Count by 5: 5, 10, 15, ?, 25',
  questionVi: 'Đếm nhảy 5: 5, 10, 15, ?, 25',
  answer: 20,
  ...
}
```

**Time (lớp 2):**
```js
{
  topic: 'time',
  type: 'clock',
  grade: 2,
  questionEn: 'What time is it? (clock shows 3:00)',
  // SVG clock or text + image
  answer: '3:00',
  ...
}
```

**Fractions (lớp 4):**
```js
{
  topic: 'fractions',
  type: 'fraction',
  grade: 4,
  questionEn: '1/4 + 2/4 = ?',
  questionVi: '1/4 + 2/4 = ?',
  answer: '3/4',
  ...
}
```

→ Question object cần thêm field optional: `type` (đã có), `choices?` (cho multiple choice), `clockTime?` (cho time visual).

### UI changes ở `practice-page.jsx`
- Hiện tại chỉ render `<TextInput type="number">` — KHÔNG đủ cho choices/fraction/time
- Thêm component `<AnswerInput question={q} value={answer} onChange={setAnswer}>` dispatch theo `q.type`:
  - `numeric` → number input (giữ nguyên)
  - `choice` → 3 buttons (`<`, `>`, `=`)
  - `fraction` → 2 number inputs (numerator/denominator)
  - `text` → text input (vd "3:00")

## Related Code Files

### Create
- `src/lib/generators/index.js` (move logic from generators.js)
- `src/lib/generators/core-arithmetic.js`
- `src/lib/generators/comparison.js`
- `src/lib/generators/counting.js`
- `src/lib/generators/time.js`
- `src/lib/generators/money.js`
- `src/lib/generators/measurement.js`
- `src/lib/generators/geometry.js`
- `src/lib/generators/fractions.js`
- `src/lib/generators/word-problems.js`
- `src/components/practice/answer-input.jsx` — dispatch input by type
- `src/components/practice/clock-display.jsx` — SVG analog clock for time questions
- `src/components/practice/fraction-input.jsx` — 2-input fraction widget

### Modify
- `src/data/topics.js` — add 7 new TOPICS entries + new word-problem templates
- `src/lib/recommender.js` — `getEligibleTopics(grade)` mở rộng cho 11 topics
- `src/lib/recommender.js` — `recordAttempt` validate `userAnswer` so với question type (string vs number)
- `src/lib/storage.js` — `DEFAULT_STATE.skillMap` thêm 7 entries mới + migration cho user cũ
- `src/pages/practice-page.jsx` — replace `<TextInput>` bằng `<AnswerInput>`
- `src/pages/result-page.jsx` — handle answer comparison cho non-numeric types
- `src/pages/skill-map-page.jsx` — render thêm 7 topic mới
- `src/index.css` — animation cho clock kim đồng hồ (nếu cần)

### Delete (legacy v0)
- `js/`, `css/` folders (nếu chưa xóa) — sẽ làm ở phase 5

## Implementation Steps

1. **Refactor generators.js → generators/ folder** (giữ behavior)
   - Move 4 hàm cũ + word-problem logic
   - Update import paths trong `recommender.js` + `app-context.jsx`
   - Run `npm run build` verify không gãy
2. **Build generators mới (1 file/topic):**
   - `comparison.js` — random 2 numbers, output `<|>|=`
   - `counting.js` — pick step (2/5/10), generate sequence with one missing
   - `time.js` — pick hour:minute, ask "what time" or "what time is N minutes later"
   - `money.js` — VND amounts, "How much total?" / "How much change?"
   - `measurement.js` — unit conversion (cm↔m, g↔kg) + word problem (length/weight)
   - `geometry.js` — perimeter/area rectangle/square, shape recognition
   - `fractions.js` — same-denom add/sub (grade 4), diff-denom + multiply (grade 5)
3. **Update `topics.js`** — TOPICS, WORD_PROBLEMS bổ sung
4. **Update `storage.js` DEFAULT_STATE.skillMap** + migration trong `loadState()`
5. **Build `<AnswerInput>` component** — switch on q.type
6. **Build `<ClockDisplay>` SVG** — drawn with cx/cy + transform rotate cho kim
7. **Build `<FractionInput>` component**
8. **Update `practice-page.jsx`** dùng `<AnswerInput>` + handle non-numeric submit
9. **Update `recordAttempt`** — `isCorrect` so sánh string nếu type khác numeric
10. **Update `getEligibleTopics(grade)`:**
    ```js
    grade 1 → addition, subtraction, comparison, counting, geometry
    grade 2 → +multiplication, time, money, measurement
    grade 3 → +division
    grade 4 → +fractions
    grade 5 → all
    ```
11. **Update skill-map-page.jsx** to render 11 topics
12. **Test:**
    - Mỗi topic generate 5 câu, kiểm tra answer đúng
    - Practice flow đầy đủ với mỗi loại question type
    - Recommend AI nhận topic mới (đã liệt kê trong prompt phase 3)

## Todo List
- [ ] Refactor generators.js → folder
- [ ] Build comparison.js
- [ ] Build counting.js
- [ ] Build time.js + clock SVG
- [ ] Build money.js
- [ ] Build measurement.js
- [ ] Build geometry.js
- [ ] Build fractions.js + fraction input
- [ ] Update topics.js (TOPICS + WORD_PROBLEMS)
- [ ] Update storage.js skillMap + migration
- [ ] Build `<AnswerInput>` dispatcher
- [ ] Build `<ClockDisplay>`
- [ ] Build `<FractionInput>`
- [ ] Update practice-page.jsx
- [ ] Update recordAttempt for non-numeric
- [ ] Update getEligibleTopics
- [ ] Update skill-map-page.jsx
- [ ] Manual test 5 questions per new topic per applicable grade

## Success Criteria
- 11 topics đều generate được, render đúng UI, chấm đúng answer
- Lớp 1 chỉ thấy topic phù hợp, lớp 5 thấy đủ
- Word problems song ngữ tự nhiên cho mỗi topic
- skill-map hiển thị progress 11 topic
- AI recommend đề xuất được topic mới khi học sinh phù hợp grade

## Risk Assessment
- **Risk:** File quá lớn → khó maintain. **Mitigation:** đã tách folder ngay từ đầu, mỗi file < 100 LOC.
- **Risk:** Migration storage làm hỏng user cũ. **Mitigation:** `loadState()` đã có merge defaults, chỉ cần thêm topic mới với `{mastery:0,attempts:0,correct:0}` mặc định.
- **Risk:** Time/Money culturally specific (VND, format giờ VN). **Mitigation:** dùng VND đơn vị + format `H:MM` quốc tế.

## Security Considerations
- Không có rủi ro mới — pure functions, không IO

## Next Steps
- Phase 5: docs + cleanup legacy
