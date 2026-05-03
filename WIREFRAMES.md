# 🎨 MathSprout — WIREFRAMES CHI TIẾT

> **Wireframe** = sơ đồ giao diện (kiểu "bản vẽ phác") — chỉ ra các thành phần trên màn hình mà chưa cần đẹp.

**Quy ước**:
- Wireframe vẽ bằng ASCII (chữ và ký tự đặc biệt) để dễ chỉnh sửa
- Mỗi màn hình kích thước **mobile-first** ~360px (giả lập điện thoại/tablet)
- Sau khi em xác nhận, anh sẽ chuyển sang HTML/CSS thật

---

## 🎨 BẢNG MÀU & FONT (Design System)

### Màu sắc
```
🟢 Primary    : #4ADE80  (Xanh mầm cây — nút chính, accent)
🟡 Accent     : #FCD34D  (Vàng nắng — XP, sao, ngôi sao)
🟣 Secondary  : #C4B5FD  (Tím hoa — game, fun)
🔵 Info       : #60A5FA  (Xanh dương — link, info)
🟠 Warning    : #FB923C  (Cam — streak, lửa)
🔴 Soft Wrong : #FB7185  (Hồng nhẹ — trả lời sai, KHÔNG đỏ doạ trẻ)
⚪ BG Light   : #FEF9C3 → #FFFFFF  (Kem nhẹ → trắng)
⚫ Text       : #1F2937  (Xám đen — chữ chính)
```

### Font
```
Tiêu đề : Quicksand 700 (bold) — chữ tròn vui
Body    : Nunito 400/600 — dễ đọc cho trẻ em
Số      : Fredoka — chữ số to, vui
```

### Kích thước
```
Nút chính : tối thiểu 56px chiều cao (ngón tay nhỏ bấm dễ)
Chữ body  : ≥18px
Chữ tiêu đề: ≥24px
Khoảng cách: nhiều — không chen chúc
```

---

## 📱 14 MÀN HÌNH CHÍNH

---

## 1️⃣ WELCOME / SPLASH SCREEN

**Khi nào hiện**: Mở app lần đầu hoặc khi vào URL chính.

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│            ✨ ✨ ✨                 │
│                                    │
│              🌱                    │  ← Mascot Sprout
│           (animated)               │     vẫy tay, nhảy
│                                    │
│                                    │
│         MathSprout                 │  ← Tên app, font Quicksand
│                                    │     56px, color primary
│                                    │
│   "10 minutes a day,               │  ← Tagline
│    BIG progress all year"          │
│                                    │
│                                    │
│      ┌──────────────────┐         │
│      │  🚀 GET STARTED   │         │  ← Nút chính, lớn, primary
│      └──────────────────┘         │
│                                    │
│     Already have account?          │  ← Text link nhỏ
│         [Log in]                   │
│                                    │
└────────────────────────────────────┘
```

**Tương tác**:
- Bấm "GET STARTED" → đi đến màn 2 (Sign up)
- Bấm "Log in" → đi đến màn login (giả định em đã có tài khoản)

**Animation**:
- Mascot Sprout 🌱 vẫy tay liên tục (Lottie animation)
- Hoa văn ✨ lấp lánh xung quanh

---

## 2️⃣ SIGN UP — Đăng ký đơn giản

**Mục tiêu**: Đăng ký càng dễ càng tốt — học sinh lớp 1 cũng làm được.

```
┌────────────────────────────────────┐
│  ←                                 │  ← Nút back
├────────────────────────────────────┤
│                                    │
│           🌱                       │
│                                    │
│      Hi! Let's get to know you!   │
│      (Chào! Để mình làm quen!)    │
│                                    │
│                                    │
│   What should I call you?          │  ← Hỏi nickname (không hỏi tên thật)
│   (Bạn muốn được gọi là gì?)      │
│   ┌──────────────────────────┐    │
│   │ Type your name...         │    │
│   └──────────────────────────┘    │
│                                    │
│   How old are you?                 │
│   (Bạn bao nhiêu tuổi?)           │
│   ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐         │
│   │6│ │7│ │8│ │9│ │10│ │11│        │  ← Bấm chọn tuổi (6-11)
│   └─┘ └─┘ └─┘ └─┘ └─┘ └─┘         │
│                                    │
│   What grade are you in?           │
│   (Bạn học lớp mấy?)              │
│   ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐             │
│   │1│ │2│ │3│ │4│ │5│              │  ← Bấm chọn lớp (1-5)
│   └─┘ └─┘ └─┘ └─┘ └─┘             │
│                                    │
│   Choose your buddy:               │
│   (Chọn bạn đồng hành:)           │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │ 🌱 │ │ 🐱 │ │ 🐶 │ │ 🤖 │     │  ← Chọn avatar/mascot
│   └────┘ └────┘ └────┘ └────┘    │
│                                    │
│      ┌──────────────────┐         │
│      │   ▶ NEXT          │         │
│      └──────────────────┘         │
│                                    │
└────────────────────────────────────┘
```

**Tương tác**:
- Nhập nickname → bấm tuổi → bấm lớp → chọn buddy → NEXT
- Nếu chưa điền đủ → nút NEXT mờ đi (disabled)
- Lưu tất cả vào `localStorage`

---

## 3️⃣ ONBOARDING — Placement Test (5 câu hỏi)

**Mục tiêu**: AI hỏi 5 câu để biết trình độ của em → tạo lộ trình phù hợp.

```
┌────────────────────────────────────┐
│  ←  Question 1 of 5     ⏱ 30s    │  ← Header: tiến độ + đếm ngược
├────────────────────────────────────┤
│                                    │
│           🌱 Sprout says:          │
│   "Let's check your level!"       │
│   (Mình kiểm tra trình độ nhé!)  │
│                                    │
│                                    │
│   ┌────────────────────────────┐  │
│   │                              │  │
│   │   What is 5 + 3 = ?          │  │  ← Câu hỏi tiếng Anh, font to
│   │                              │  │
│   │   [🇻🇳 Show Vietnamese]      │  │  ← Toggle song ngữ
│   │                              │  │
│   └────────────────────────────┘  │
│                                    │
│                                    │
│   Choose your answer:              │
│                                    │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │ 6  │ │ 7  │ │ 8  │ │ 9  │     │  ← 4 đáp án, nút lớn
│   └────┘ └────┘ └────┘ └────┘    │
│                                    │
│                                    │
│      🔊 Listen to question         │  ← Đọc to bằng Web Speech API
│                                    │
└────────────────────────────────────┘
```

**Logic**:
- 5 câu, mỗi câu khó dần (Grade 1 → Grade 5 questions)
- Sau 5 câu, AI tính level: Beginner / Easy / Medium / Hard
- Lưu placement vào `localStorage.placement = "Easy"`

**Sau khi xong** → Hiện màn hình kết quả:
```
   🎉 Great job!
   You're at Level: 🌱 Sprout (Easy)
   I'll make a 30-day plan for you!

   [ ▶ START LEARNING ]
```

---

## 4️⃣ DASHBOARD — Trang chính

**Khi nào hiện**: Mỗi lần em mở app sau khi đăng nhập.

```
┌────────────────────────────────────┐
│ 🌱 MathSprout    🌱Lv.3 ⭐245 🔔 │  ← Header: tên + level + XP + chuông
├────────────────────────────────────┤
│                                    │
│   Hi Minh! 👋                      │
│   Ready for today's 10 mins?      │
│   (Sẵn sàng cho 10 phút hôm nay?) │
│                                    │
│         ┌─────────────┐           │
│         │             │           │
│         │     🌳      │           │  ← Mầm cây hiện tại (level)
│         │   (animated)│           │     hoa lá rung khi hover
│         │             │           │
│         └─────────────┘           │
│       🔥 7-day streak              │  ← Streak ngày
│       ⭐ 245 / 300 XP to Lv.4     │  ← Thanh XP
│       ████████░░░░ 80%            │
│                                    │
│   ┌──────────────────────────┐    │
│   │  ▶  START TODAY'S LESSON  │    │  ← Nút lớn nhất, primary
│   │     (Today: Multiplication)│   │
│   └──────────────────────────┘    │
│                                    │
│   ─── Or explore ───               │
│                                    │
│   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐│
│   │ 📚  │ │ 🤖  │ │ 📊  │ │ 🎮  ││  ← 4 nút chức năng
│   │Pract│ │ Ask │ │Stats│ │Game ││
│   │ ice │ │Sprout│ │     │ │     ││
│   └─────┘ └─────┘ └─────┘ └─────┘│
│                                    │
│   ┌─────┐ ┌─────┐                 │
│   │ 🏆  │ │ 👨‍👩‍👧 │                  │
│   │Badge│ │Parent│                 │
│   │     │ │     │                  │
│   └─────┘ └─────┘                 │
│                                    │
└────────────────────────────────────┘
```

**Tương tác**:
- Bấm 🌳 mầm cây → animation tưới nước, hoa rơi
- Bấm 🔔 → xem reminder
- Bấm "START TODAY'S LESSON" → đi đến màn 5 (Practice — bài hôm nay)
- Bấm 4 nút nhỏ → đi đến từng chức năng

---

## 5️⃣ PRACTICE SCREEN — Làm bài (Tiếng Anh)

```
┌────────────────────────────────────┐
│ ← Back        Question 3/10  ⭐245 │
├────────────────────────────────────┤
│   ████████░░░░░░░░░  Progress 30% │  ← Thanh tiến độ bài
├────────────────────────────────────┤
│                                    │
│   📘 Topic: Multiplication         │  ← Chủ đề
│                                    │
│                                    │
│   ┌────────────────────────────┐  │
│   │                              │  │
│   │  Sarah has 3 baskets.        │  │  ← Câu hỏi tiếng Anh
│   │  Each basket has 4 apples.   │  │     (word problem)
│   │                              │  │
│   │  How many apples in total?   │  │
│   │                              │  │
│   │  [🇻🇳 Show Vietnamese]       │  │  ← Toggle song ngữ
│   │                              │  │
│   │  🔊 Listen                   │  │  ← Nghe câu hỏi
│   │                              │  │
│   └────────────────────────────┘  │
│                                    │
│   Your answer:                     │
│   ┌──────────────────────────┐    │
│   │       12                  │    │  ← Nhập đáp án
│   └──────────────────────────┘    │
│                                    │
│   ┌─────────┐  ┌──────────────┐   │
│   │ ❓ Hint │  │ ✓ SUBMIT      │   │  ← 2 nút
│   └─────────┘  └──────────────┘   │
│                                    │
│   ─────────────────                │
│   🤖 Ask Sprout for help           │  ← Mở chatbot
│                                    │
└────────────────────────────────────┘
```

---

## 6️⃣ PRACTICE — Bilingual Mode (bật song ngữ)

**Khi bấm "🇻🇳 Show Vietnamese"** ở màn 5:

```
┌────────────────────────────────────┐
│ ← Back        Question 3/10  ⭐245 │
├────────────────────────────────────┤
│   ████████░░░░░░░░░  Progress 30% │
├────────────────────────────────────┤
│                                    │
│   📘 Topic: Multiplication         │
│      (Phép nhân)                   │
│                                    │
│   ┌────────────────────────────┐  │
│   │  🇬🇧 English                 │  │
│   │  Sarah has 3 baskets.        │  │
│   │  Each basket has 4 apples.   │  │
│   │  How many apples in total?   │  │
│   │                              │  │
│   │  ────────────────            │  │
│   │                              │  │
│   │  🇻🇳 Tiếng Việt              │  │  ← Tiếng Việt cạnh dưới
│   │  Sarah có 3 cái giỏ.        │  │
│   │  Mỗi giỏ có 4 quả táo.      │  │
│   │  Hỏi tổng cộng có bao       │  │
│   │  nhiêu quả táo?              │  │
│   │                              │  │
│   │  📚 Vocab:                   │  │  ← Từ vựng quan trọng
│   │  • basket = giỏ              │  │
│   │  • apple = quả táo           │  │
│   │  • total = tổng cộng         │  │
│   │                              │  │
│   │  [🇬🇧 Hide Vietnamese]       │  │
│   │  🔊 Listen                   │  │
│   └────────────────────────────┘  │
│                                    │
│   Your answer: ┌──────────┐       │
│                │   12      │       │
│                └──────────┘       │
│                                    │
│   [❓ Hint]  [✓ SUBMIT]            │
│                                    │
└────────────────────────────────────┘
```

---

## 7️⃣ RESULT SCREEN — Kết quả Đúng/Sai

### 7a. Trả lời ĐÚNG ✅

```
┌────────────────────────────────────┐
│                                    │
│           🎉 🎊 🎉                 │  ← Confetti animation
│                                    │
│              ✅                    │
│                                    │
│         AWESOME!                   │  ← To, vàng, vui
│        (Tuyệt vời!)               │
│                                    │
│   You earned +10 XP ⭐             │
│   Streak: 🔥 7 days kept!          │
│                                    │
│         🌱 Sprout says:            │
│   "Great work! 3 × 4 = 12.         │
│    Multiplication is repeated      │
│    addition: 4+4+4 = 12."         │
│                                    │
│   "Phép nhân là phép cộng         │
│    lặp lại: 4+4+4 = 12 nhé!"      │
│                                    │
│      ┌──────────────────┐         │
│      │  ▶ NEXT QUESTION  │         │
│      └──────────────────┘         │
│                                    │
└────────────────────────────────────┘
```

**Animation**: Confetti rơi 🎉, mascot Sprout nhảy lên, sound "Yay!" vui

### 7b. Trả lời SAI ❌

```
┌────────────────────────────────────┐
│                                    │
│                                    │
│              😅                    │  ← Mặt cười dễ thương, KHÔNG buồn
│                                    │
│        Almost there!               │  ← Khuyến khích, không trách
│      (Gần đúng rồi nhé!)          │
│                                    │
│   Your answer: 7                   │
│   Correct answer: 12               │
│                                    │
│   ❤️❤️❤️❤️ ← Hearts (mất 1 tim)  │  ← 5 tim, mất 1
│                                    │
│         🌱 Sprout says:            │
│   "Don't worry! Let me explain:"  │
│   (Đừng lo! Mình giải thích nhé:) │
│                                    │
│   ┌────────────────────────────┐  │
│   │ Step 1: Sarah has 3 baskets│  │  ← Giải thích từng bước
│   │         Sarah có 3 cái giỏ │  │
│   │                              │  │
│   │ Step 2: Each has 4 apples   │  │
│   │         Mỗi giỏ có 4 táo   │  │
│   │                              │  │
│   │ Step 3: Multiply 3 × 4 = 12 │  │
│   │         Nhân 3 × 4 = 12    │  │
│   └────────────────────────────┘  │
│                                    │
│   [🤖 Still confused? Ask Sprout]  │  ← Mở chatbot nếu cần
│                                    │
│      ┌──────────────────┐         │
│      │  ▶ NEXT QUESTION  │         │
│      └──────────────────┘         │
│                                    │
└────────────────────────────────────┘
```

---

## 8️⃣ AI CHATBOT — Sprout

```
┌────────────────────────────────────┐
│ ← Back     🌱 Chat with Sprout   ⋮│
├────────────────────────────────────┤
│                                    │
│        🌱                          │
│  ┌──────────────────────────┐     │
│  │ Hi Minh! How can I help? │     │  ← Sprout nói (left)
│  │ Mình giúp gì cho bạn?     │     │
│  └──────────────────────────┘     │
│                                    │
│                                    │
│              ┌──────────────────┐ │
│              │ Em không hiểu     │ │  ← User nói (right)
│              │ "fraction" là gì  │ │
│              └──────────────────┘ │
│                                    │
│        🌱                          │
│  ┌──────────────────────────┐     │
│  │ Great question!           │     │
│  │ "Fraction" = phân số.    │     │
│  │                            │     │
│  │ Example: 1/2 (one half)  │     │
│  │ Ví dụ: 1/2 (một nửa)    │     │
│  │                            │     │
│  │ 🍕 Imagine a pizza cut    │     │
│  │ into 2 equal pieces.      │     │
│  │ You eat 1 piece →        │     │
│  │ that's 1/2 of the pizza. │     │
│  │                            │     │
│  │ Want to try a question?  │     │
│  └──────────────────────────┘     │
│  [😊 I get it!] [🤔 Tell me more] │  ← Quick reply buttons
│                                    │
│                                    │
├────────────────────────────────────┤
│  ┌────────────────────────┐ [🎤] │  ← Input + voice button
│  │ Type your question...  │       │
│  └────────────────────────┘ [▶]  │
└────────────────────────────────────┘
```

**Tương tác**:
- Em gõ câu hỏi → bấm ▶ → AI trả lời song ngữ
- Bấm 🎤 → nói câu hỏi (Web Speech API)
- Quick reply: bấm "I get it!" hoặc "Tell me more"
- Lịch sử chat lưu trong `localStorage`

---

## 9️⃣ SKILL MAP — Bản đồ kỹ năng

```
┌────────────────────────────────────┐
│ ← Back        🗺 Your Skill Map   │
├────────────────────────────────────┤
│                                    │
│   Your math superpowers! 💪        │
│   (Sức mạnh toán của bạn!)        │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Addition (Phép cộng)      │    │
│   │ ████████████ 95% 🟢       │    │  ← Xanh = giỏi
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Subtraction (Phép trừ)    │    │
│   │ ██████████░░ 85% 🟢       │    │
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Multiplication (Nhân)     │    │
│   │ ██████░░░░░░ 50% 🟡       │    │  ← Vàng = trung bình
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Division (Chia)           │    │
│   │ ████░░░░░░░░ 30% 🔴       │    │  ← Đỏ = cần luyện
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │ Fractions (Phân số)       │    │
│   │ ░░░░░░░░░░░░ 0% 🔒        │    │  ← Khoá - chưa unlock
│   └──────────────────────────┘    │
│                                    │
│   🌱 Sprout's tip:                 │
│   "Let's practice Division        │
│    today! You'll level up fast."  │
│                                    │
│      ┌──────────────────────┐     │
│      │ ▶ PRACTICE DIVISION  │     │  ← Đề xuất luyện
│      └──────────────────────┘     │
│                                    │
└────────────────────────────────────┘
```

---

## 🔟 PROGRESS — Biểu đồ tiến bộ

```
┌────────────────────────────────────┐
│ ← Back     📊 Your Progress       │
├────────────────────────────────────┤
│                                    │
│   [Daily] [Weekly] [Monthly]       │  ← Tab chọn khoảng thời gian
│                                    │
│   This week:                       │
│                                    │
│   🌱 Tree grew 3 levels! 🎉        │
│                                    │
│   ┌──────────────────────────┐    │
│   │  Minutes per day          │    │
│   │                            │    │
│   │   ▓                        │    │
│   │   ▓ ▓                      │    │
│   │ ▓ ▓ ▓ ▓                   │    │  ← Bar chart (Chart.js)
│   │ ▓ ▓ ▓ ▓ ▓ ▓ ▓             │    │
│   │ M T W T F S S              │    │
│   └──────────────────────────┘    │
│                                    │
│   📊 This week stats:              │
│   • Total time:    72 min          │
│   • Total problems: 48             │
│   • Correct rate:  85%             │
│   • Streak:        🔥 7 days       │
│                                    │
│   🏆 New badges this week:         │
│   ┌────┐ ┌────┐ ┌────┐            │
│   │ 🔥 │ │ 💯 │ │ 🌳 │            │  ← Badges đạt được tuần này
│   │7day│ │Perf│ │Tree│            │
│   └────┘ └────┘ └────┘            │
│                                    │
│   [📤 Share with parents]          │
│                                    │
└────────────────────────────────────┘
```

---

## 1️⃣1️⃣ MINI-GAME: Bubble Pop

**Cách chơi**: Bong bóng có số bay lên, em bấm bong bóng có **đáp án đúng** trước khi nó bay mất.

```
┌────────────────────────────────────┐
│ ← Back   🫧 Bubble Pop  ⏱ 0:30   │
├────────────────────────────────────┤
│   Score: 12  ❤️❤️❤️                │  ← Điểm + tim
├────────────────────────────────────┤
│                                    │
│   ┌──────────────────────────┐    │
│   │   What is 6 × 7?          │    │  ← Câu hỏi cố định trên đỉnh
│   └──────────────────────────┘    │
│                                    │
│                                    │
│         🫧                         │  ← Bong bóng bay lên
│        (35)                        │
│                                    │
│              🫧                    │
│             (42) ← đáp án đúng    │
│                                    │
│      🫧                            │
│     (40)                           │
│                                    │
│                  🫧                │
│                 (48)               │
│                                    │
│                                    │
├────────────────────────────────────┤
│   🌱 Pop the right answer!         │
│      [⏸ Pause]                     │
└────────────────────────────────────┘
```

**Logic**:
- Mỗi 3 giây có 1 bong bóng mới bay lên
- Bấm đúng → +5 điểm, sound "pop!"
- Bấm sai → -1 ❤️
- Bong bóng bay khỏi màn hình → -1 ❤️
- Hết tim → game over, hiện điểm + lưu vào leaderboard

---

## 1️⃣2️⃣ ACHIEVEMENTS / BADGES

```
┌────────────────────────────────────┐
│ ← Back     🏆 Your Achievements   │
├────────────────────────────────────┤
│                                    │
│   12 of 30 badges earned           │
│   ████░░░░░░░░ 40%                 │
│                                    │
│   ─── EARNED (12) ───              │
│                                    │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │ 🌱 │ │ 🔥 │ │ 💯 │ │ 🧮 │     │  ← Badges đã có
│   └────┘ └────┘ └────┘ └────┘    │
│   First   7-day  Perfect Add     │
│                                    │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │ ✖️ │ │ ➗ │ │ 🌳 │ │ 🎯 │     │
│   └────┘ └────┘ └────┘ └────┘    │
│   Mult   Div    Tree    Hunter    │
│                                    │
│                                    │
│   ─── LOCKED (18) ───              │  ← Chưa unlock, hiện mờ
│                                    │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │     │
│   └────┘ └────┘ └────┘ └────┘    │
│   ???    ???    ???    ???        │
│                                    │
│   Tap a badge to see details       │
│                                    │
└────────────────────────────────────┘
```

**Khi bấm 1 badge** → Modal popup:
```
   ┌─────────────────────────┐
   │      🔥                  │
   │   Week Warrior           │
   │ "Learn 7 days in a row"  │
   │                          │
   │ Earned: 02/05/2026       │
   │      [Close]             │
   └─────────────────────────┘
```

---

## 1️⃣3️⃣ PARENT REPORT (Chế độ phụ huynh)

**Mục tiêu**: Bố mẹ xem báo cáo nhanh — không cần kèm con học.

```
┌────────────────────────────────────┐
│ ← Back   👨‍👩‍👧 Parent Report        │
├────────────────────────────────────┤
│                                    │
│   📅 Week of 28/04 - 04/05/2026   │
│                                    │
│   👤 Minh — Lớp 2                  │
│                                    │
│   ⭐ Quick Stats:                  │
│   ┌──────────┐ ┌──────────┐       │
│   │ 72 min   │ │ 48 quest │       │
│   │ Total    │ │  Done    │       │
│   └──────────┘ └──────────┘       │
│   ┌──────────┐ ┌──────────┐       │
│   │  85%     │ │  🔥 7    │       │
│   │ Correct  │ │ Streak   │       │
│   └──────────┘ └──────────┘       │
│                                    │
│   📊 Strengths & Weaknesses:       │
│   ✅ Strong: Addition, Subtraction │
│   ⚠️ Weak: Division                │
│                                    │
│   🤖 Sprout's recommendation:      │
│   "Minh is doing great in addition.│
│    Could use more practice in     │
│    division. We've adjusted the   │
│    daily plan to focus on it."    │
│                                    │
│   ⚙️ Settings:                     │
│   • Daily limit: [30 min ▼]        │
│   • Notification: [On ✅]          │
│   • Send weekly email: [On ✅]     │
│                                    │
│   [📧 Send report to email]        │
│                                    │
└────────────────────────────────────┘
```

---

## 1️⃣4️⃣ SETTINGS

```
┌────────────────────────────────────┐
│ ← Back     ⚙️ Settings            │
├────────────────────────────────────┤
│                                    │
│   👤 Profile                       │
│   ┌──────────────────────────┐    │
│   │ Name: Minh                │    │
│   │ Age: 7                    │    │
│   │ Grade: 2                  │    │
│   │ Buddy: 🌱                 │    │
│   │ [Edit]                    │    │
│   └──────────────────────────┘    │
│                                    │
│   🌐 Language                      │
│   [English Only] [Bilingual ✓] [VN]│
│                                    │
│   🔊 Sound                         │
│   Volume: ━━━━━━━━●━━━━━━ 70%     │
│   Voice reading: [On ✅]           │
│                                    │
│   🎨 Theme                         │
│   ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│   │🌿  │ │💜  │ │🌊  │ │🌌  │     │
│   │Leaf│ │Pink│ │Ocean│ │Space│   │
│   └────┘ └────┘ └────┘ └────┘    │
│                                    │
│   ⏰ Daily reminder                │
│   Remind me at: [19:00 ▼]          │
│                                    │
│   📤 Share MathSprout              │
│   [Copy link]  [QR Code]           │
│                                    │
│   ─────────────────                │
│   ℹ️ About                          │
│   Version: 1.0.0                   │
│   Made with ❤️ by Trần Nhật Minh   │
│                                    │
└────────────────────────────────────┘
```

---

# 🗺 LUỒNG NAVIGATION (User Flow)

```
            [Welcome]
               │
               ▼
         [Sign up]
               │
               ▼
         [Onboarding]
               │
               ▼
        ┌──[Dashboard]──┐
        │       │        │
        ▼       ▼        ▼
  [Practice] [Chatbot] [Progress]
     │           │
     ▼           ▼
  [Result]   [Skill Map]
     │
     ├──→ [Bubble Pop game]
     │
     └──→ [Achievements]
```

---

# 📐 RESPONSIVE — Desktop layout

Trên desktop màn rộng, dashboard sẽ chia 2 cột:

```
┌──────────────────────────────────────────────────────────────────┐
│ 🌱 MathSprout              🌱 Lv.3  ⭐245  🔥7  🔔  ⚙️  👤 Minh │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│   ┌──────────────────────┐    ┌──────────────────────────────┐   │
│   │                       │    │                                │   │
│   │   🌳 Your Tree        │    │   📅 Today's Lesson           │   │
│   │   Day 7 streak 🔥    │    │                                │   │
│   │                       │    │   "Multiplication"            │   │
│   │   ⭐ 245 / 300 XP    │    │   10 questions, ~10 minutes   │   │
│   │                       │    │                                │   │
│   │   [Skill Map]         │    │   [▶ START NOW]              │   │
│   └──────────────────────┘    └──────────────────────────────┘   │
│                                                                    │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│   │ 📚      │ │ 🤖      │ │ 📊      │ │ 🎮      │ │ 🏆      │  │
│   │ Practice│ │ Chatbot │ │ Progress│ │ Game    │ │ Badges  │  │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

# ✅ CHECKLIST sau khi review wireframe

Em check giúp anh xem có cần sửa gì không:

- [ ] Số màn hình (14) — đủ chưa? Cần thêm màn nào?
- [ ] Welcome screen — ổn không?
- [ ] Sign up — cần đơn giản hơn không?
- [ ] Dashboard — cây mầm có ý nghĩa với em chưa?
- [ ] Practice screen — toggle song ngữ rõ ràng chưa?
- [ ] Result screen — phần "trả lời sai" có làm em buồn không?
- [ ] Chatbot — luồng hỏi đáp có ổn không?
- [ ] Skill Map — biểu đồ này có dễ hiểu không?
- [ ] Bubble Pop — game này có vui không? Hay đổi game khác?
- [ ] Parent Report — có nên có không? Hay ẩn vào v2?
- [ ] Màu sắc — em thích bảng màu này không?
- [ ] Mascot 🌱 — em có muốn đổi tên Sprout không?

---

> 🌱 *"Wireframe là bản phác thảo. Sau khi em duyệt, anh sẽ biến nó thành web app thật!"*
