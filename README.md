# 🌱 MathSprout

Web app trợ lý học **Toán bằng tiếng Anh** cho học sinh tiểu học (lớp 1-5), có hỗ trợ song ngữ Anh-Việt và **AI Sprout Assistant** (Claude Sonnet 4.6) để giải thích bài khó + đề xuất bài tập cá nhân hoá theo điểm yếu.

> **"10 minutes a day, BIG progress all year"**
> *(10 phút mỗi ngày — Tiến bộ lớn cả năm)*

Dự án dự thi **STEMFEST 2026** — Vinschool Ocean Park
Tác giả: **Trần Nhật Minh** — Lớp 2

---

## 🚀 Cách chạy

### Yêu cầu
- Node.js ≥ 18
- API key Anthropic Claude (xem [`docs/ai-setup.md`](docs/ai-setup.md))

### Cài và chạy

```bash
# 1. Cài deps
npm install

# 2. Tạo file env và điền API key
cp .env.example .env.local       # hoặc dùng .env trực tiếp cũng OK
# → mở file vừa tạo, paste ANTHROPIC_API_KEY

# 3. Chạy dev (Vite + middleware /api/*)
npm run dev          # → http://localhost:5173

# Kiểm tra setup AI:
# → mở http://localhost:5173/api/health
```

> `npm run dev` chạy Vite có middleware mount `/api/*` từ folder `api/` — không cần Vercel CLI / login. Production deploy vẫn dùng Vercel Functions như cũ. Nếu muốn parity với production khi dev: `npm run dev:vercel` (cần `npx vercel login` + `link` trước).

> Chi tiết setup + deploy Vercel: **[docs/ai-setup.md](docs/ai-setup.md)**

### Build production

```bash
npm run build
npm run preview      # xem bản build
```

---

## ✅ Tính năng v2.0

### Học tập
- ✅ Welcome + Đăng ký nhanh (nickname + tuổi + lớp + buddy)
- ✅ Dashboard với mầm cây 🌱 + streak 🔥 + XP ⭐
- ✅ **11 dạng bài tập** phủ lớp 1-5 (xem mục dưới)
- ✅ Word problems (bài toán có lời văn) với template biến hóa
- ✅ Toggle song ngữ Anh-Việt
- ✅ Đọc to câu hỏi (Web Speech API)
- ✅ Adaptive Learning Engine — đề xuất bài theo điểm yếu (rule-based)
- ✅ Skill Map — bản đồ kỹ năng từng topic
- ✅ Progress chart — biểu đồ tiến độ 7 ngày
- ✅ Achievements / Badges (10 huy hiệu)
- ✅ Hint khi cần
- ✅ Confetti khi trả lời đúng 🎉

### AI Sprout Assistant 🌱 (mới)
- ✅ **Hỏi Sprout giải thích** — bấm trên kết quả → AI giải song ngữ, có nút đọc to
- ✅ **Cần Sprout giúp** — sau 30s không trả lời, hiện nút gợi ý nhẹ
- ✅ **Sprout đề xuất bài cho em** — AI phân tích lịch sử + đề xuất 3-5 dạng bài có lý do cụ thể (vd "em sai 4/10 phép trừ có nhớ")
- ✅ **Chat trợ lý giải bài tập** — em gõ câu hỏi HOẶC bấm 📷 chụp/upload ảnh đề bài → Sprout đọc ảnh + giải step-by-step theo lớp 1-5. Ảnh mờ/thiếu data → Sprout hỏi lại bilingual. Vision tự động dùng Gemini 2.5 Flash, text-only vẫn dùng Kimi K2.6.
- ✅ Stream real-time, prompt caching giảm 90% cost
- ✅ Cá nhân hoá ngôn ngữ theo grade/age (lớp 1 dùng từ đơn giản, lớp 5 dùng "fraction/decimal")

### Lưu trữ
- ✅ 100% offline-first (localStorage `mathsprout_v1`)
- ✅ Migration tự động khi thêm topic mới

## 🚧 Tính năng v3.0 (sẽ thêm sau)

- Mini-games (Bubble Pop)
- Class Leaderboard thật (cần Supabase)
- Parent Mode email reports
- Mobile app (PWA)
- Rate limit AI cho deploy public

---

## 📚 11 dạng bài tập (lớp 1-5)

| # | Topic | Vi | Lớp |
|---|---|---|---|
| 1 | Addition         | Phép cộng        | 1-5 |
| 2 | Subtraction      | Phép trừ         | 1-5 |
| 3 | Multiplication   | Phép nhân        | 2-5 |
| 4 | Division         | Phép chia        | 3-5 |
| 5 | Comparison       | So sánh số (<, =, >) | 1-3 |
| 6 | Counting         | Đếm nhảy (2, 5, 10) | 1-2 |
| 7 | Time             | Đọc đồng hồ (SVG) | 2-5 |
| 8 | Money (VND)      | Tính tiền        | 2-5 |
| 9 | Measurement      | Đổi đơn vị (cm/mm, m/cm, kg/g, l/ml) | 2-5 |
| 10| Geometry         | Hình học (cạnh, chu vi, diện tích) | 1-5 |
| 11| Fractions        | Phân số          | 4-5 |

---

## 📁 Cấu trúc thư mục

```
mathsprout/
├── api/                          ← Vercel Serverless Functions (Node)
│   ├── _lib/
│   │   ├── anthropic-client.js   ← SDK singleton + model 'claude-sonnet-4-6'
│   │   └── prompts.js            ← System prompts song ngữ + cached
│   ├── health.js                 ← GET /api/health
│   ├── explain.js                ← POST /api/explain (SSE stream)
│   └── recommend.js              ← POST /api/recommend (JSON)
├── src/
│   ├── main.jsx
│   ├── app.jsx                   ← Routes + providers
│   ├── index.css                 ← Tailwind v4 + claymorphism
│   ├── data/
│   │   └── topics.js             ← TOPICS, NAMES, ITEMS, WORD_PROBLEMS, BADGES, LEVELS
│   ├── lib/
│   │   ├── generators/           ← 11 topic generators (1 file/topic)
│   │   │   ├── index.js          ← dispatcher `generate(topic, grade)`
│   │   │   ├── core-arithmetic.js
│   │   │   ├── word-problems.js
│   │   │   ├── comparison.js
│   │   │   ├── counting.js
│   │   │   ├── time.js
│   │   │   ├── money.js
│   │   │   ├── measurement.js
│   │   │   ├── geometry.js
│   │   │   ├── fractions.js
│   │   │   └── utils.js
│   │   ├── recommender.js        ← Rule-based engine + isAnswerCorrect
│   │   ├── storage.js            ← localStorage + migration
│   │   ├── speech.js             ← Web Speech API
│   │   ├── celebrate.js          ← canvas-confetti
│   │   ├── sprout-api.js         ← Frontend client cho /api/*
│   │   ├── attempt-summary.js    ← Nén attempts cho recommend prompt
│   │   └── recommendation-cache.js ← Cache 30 phút /api/recommend
│   ├── context/
│   │   └── app-context.jsx       ← useReducer + START_FOCUSED_LESSON
│   ├── components/
│   │   ├── ui/                   ← button, input, toast (claymorphism)
│   │   ├── layout/               ← page-header
│   │   ├── practice/             ← answer-input, clock-display, fraction-input
│   │   └── sprout-assistant/     ← sprout-modal, sprout-button, sprout-recommendation-card,
│   │                               recommendation-item, use-explain-stream
│   └── pages/                    ← welcome, signup, dashboard, practice, result,
│                                   skill-map, progress, achievements, settings
├── docs/
│   └── ai-setup.md               ← Hướng dẫn setup AI + deploy Vercel
├── plans/                        ← Plan files cho các feature lớn
├── .env.example                  ← Template env (key thật ở .env.local)
├── package.json                  ← `npm run dev` → `vercel dev --listen 3000`
├── vite.config.js
└── README.md
```

---

## 🛠 Tech Stack

| Công nghệ | Mục đích |
|---|---|
| React 19 | UI framework |
| Vite 6 | Dev server + build |
| Tailwind CSS 4 | Utility classes |
| React Router 7 | Client-side routing |
| **Vercel Functions** | Serverless `/api/*` (Node 20) |
| **@anthropic-ai/sdk** | Claude Sonnet 4.6 client |
| canvas-confetti | Hiệu ứng 🎉 |
| Web Speech API | Đọc to (built-in browser) |
| Google Fonts (Quicksand, Nunito, Baloo 2) | Font dễ thương |
| localStorage (`mathsprout_v1`) | Lưu dữ liệu cục bộ |

---

## 🧪 Test app

Sau khi `npm run dev`:

1. **Welcome** → bấm "GET STARTED"
2. **Sign up** → nhập tên (vd: "Minh"), chọn tuổi 7, lớp 2, buddy 🌱 → bấm NEXT
3. **Dashboard** → xem mầm cây + bấm "START TODAY'S LESSON"
4. **Practice** → làm 10 bài, bấm SUBMIT mỗi câu
   - Đợi 30s không trả lời → nút **🌱 Cần Sprout giúp?** xuất hiện
5. **Result** → xem đúng/sai + giải thích cứng song ngữ
   - Bấm **🌱 Hỏi Sprout** → modal stream giải thích từ AI
6. Sau 10 câu → quay về Dashboard
7. Trên Dashboard → bấm **✨ Sprout đề xuất bài cho em** → 3-5 đề xuất có lý do
   - Bấm "Luyện 5 bài" → vào practice tập trung topic đó
8. Bấm **Skill Map** → xem em giỏi/yếu phần nào (11 topic)
9. Bấm **Progress** → xem biểu đồ ngày
10. Bấm **Badges** → xem huy hiệu

**Reset data**: Settings → "Reset All Data"

---

## 📜 License

Free for everyone. Made with ❤️ for kids learning math.
