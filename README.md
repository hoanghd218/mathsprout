# 🌱 MathSprout

Web app trợ lý học **Toán bằng tiếng Anh** cho học sinh tiểu học (lớp 1-5), có hỗ trợ song ngữ Anh-Việt và AI đề xuất bài tập theo điểm yếu.

> **"10 minutes a day, BIG progress all year"**
> *(10 phút mỗi ngày — Tiến bộ lớn cả năm)*

Dự án dự thi **STEMFEST 2026** — Vinschool Ocean Park
Tác giả: **Trần Nhật Minh** — Lớp 2

---

## 🚀 Cách chạy

**Cách 1 (đơn giản nhất)**: Bấm đôi vào file `index.html` để mở bằng trình duyệt mặc định.

**Cách 2 (khuyên dùng)**: Chạy local web server để tránh CORS:
```bash
cd "Nhat Minh Math App"
python3 -m http.server 8000
# Mở http://localhost:8000
```

**Không cần cài đặt thư viện gì** — Tailwind CSS và confetti tải qua CDN.

---

## ✅ Tính năng v1.0 (MVP)

- ✅ Welcome + Đăng ký nhanh (nickname + tuổi + lớp + buddy)
- ✅ Dashboard với mầm cây 🌱 + streak 🔥 + XP ⭐
- ✅ Bài tập 4 phép tính (+, −, ×, ÷) bằng tiếng Anh
- ✅ Word problems (bài toán có lời văn) với template biến hóa
- ✅ Toggle song ngữ Anh-Việt
- ✅ Đọc to câu hỏi (Web Speech API)
- ✅ **Adaptive Learning Engine** — AI đề xuất bài theo điểm yếu
- ✅ Skill Map — bản đồ kỹ năng từng topic
- ✅ Progress chart — biểu đồ tiến độ 7 ngày
- ✅ Achievements / Badges (10 huy hiệu)
- ✅ Hint khi cần
- ✅ Confetti khi trả lời đúng 🎉
- ✅ 100% lưu offline (localStorage)

## 🚧 Tính năng v2.0 (sẽ thêm sau)

- AI Chatbot Sprout (cần API key Claude)
- Mini-games (Bubble Pop)
- Class Leaderboard thật (cần Supabase)
- Parent Mode email reports
- Mobile app (PWA)

---

## 📁 Cấu trúc thư mục

```
Nhat Minh Math App/
├── index.html              ← Trang chính (mở file này)
├── css/
│   └── style.css           ← CSS tùy chỉnh
├── js/
│   ├── data.js             ← Dữ liệu tĩnh (templates, vocab, badges)
│   ├── storage.js          ← Lưu/đọc localStorage
│   ├── generators.js       ← Sinh bài tập tự động
│   ├── recommender.js      ← AI Adaptive Learning Engine
│   ├── ui.js               ← Helpers (navigate, toast, confetti)
│   └── app.js              ← Logic chính của app
├── PROJECT_DOC.md          ← Tài liệu thuyết trình (cho giám khảo)
├── WIREFRAMES.md           ← Sơ đồ giao diện chi tiết
└── README.md               ← (file này)
```

---

## 🛠 Tech Stack

| Công nghệ | Mục đích |
|---|---|
| HTML5 | Cấu trúc trang |
| Tailwind CSS (CDN) | Thiết kế giao diện |
| Vanilla JavaScript | Logic, không dùng framework |
| localStorage | Lưu dữ liệu cục bộ |
| Web Speech API | Đọc to tiếng Anh (built-in browser) |
| canvas-confetti (CDN) | Hiệu ứng 🎉 |
| Google Fonts (Quicksand, Nunito) | Font dễ thương |

---

## 🧪 Test app

Sau khi mở `index.html`:

1. **Welcome** → bấm "GET STARTED"
2. **Sign up** → nhập tên (vd: "Minh"), chọn tuổi 7, lớp 2, buddy 🌱 → bấm NEXT
3. **Dashboard** → xem mầm cây + bấm "START TODAY'S LESSON"
4. **Practice** → làm 10 bài, bấm SUBMIT mỗi câu
5. **Result** → xem đúng/sai + giải thích song ngữ → Next Question
6. Sau 10 câu → quay về Dashboard với XP mới
7. Bấm **Skill Map** → xem em giỏi/yếu phần nào
8. Bấm **Progress** → xem biểu đồ ngày
9. Bấm **Badges** → xem huy hiệu

**Reset data**: Settings → "Reset All Data"

---

## 📜 License

Free for everyone. Made with ❤️ for kids learning math.
