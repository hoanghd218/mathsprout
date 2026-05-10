# 🌱 Sprout AI — Setup Guide

Hướng dẫn lấy API key Claude và chạy MathSprout với AI Sprout Assistant.

---

## 1. Lấy API key

1. Đăng ký / đăng nhập: https://console.anthropic.com
2. Vào **Settings → API Keys** → bấm **Create Key**
3. Đặt tên (vd `mathsprout-dev`), copy key dạng `sk-ant-api03-...`

> ⚠️ **Quan trọng:** key chỉ hiện một lần — copy ngay vào nơi an toàn.

---

## 2. Cấu hình local (chạy trên máy em Minh)

```bash
# Trong thư mục dự án:
cp .env.example .env.local
```

Mở `.env.local`, thay giá trị placeholder bằng key thật:

```
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXX...
```

Chạy app:

```bash
npm install
npm run dev
# → mở http://localhost:5173
```

> `npm run dev` chạy Vite dev server có middleware tự mount `/api/*` (xem `vite.config.js`). Không cần Vercel CLI / login khi dev local.
>
> Muốn parity với production: `npm run dev:vercel` (cần `npx vercel login` + `npx vercel link` trước).

---

## 3. Kiểm tra setup

Mở trình duyệt vào: **http://localhost:5173/api/health**

Kết quả mong đợi:

```json
{
  "ok": true,
  "model": "claude-sonnet-4-6",
  "timestamp": "2026-05-05T...",
  "hint": "API key detected — Sprout is ready."
}
```

Nếu `"ok": false` → kiểm tra lại file `.env.local`.

---

## 4. Test Sprout trong app

1. Vào **/practice**, làm 1 bài → ấn **Submit**
2. Trên Result page → ấn nút **🌱 Hỏi Sprout giải thích**
   → Modal mở ra, chữ song ngữ chạy stream từ Claude
3. Quay lại **Dashboard** → ấn **✨ Sprout đề xuất bài cho em**
   → Sau 2-5s, hiện 3-5 đề xuất bài tập có lý do
4. Trong khi đang luyện, đợi 30s không trả lời → nút **Cần Sprout giúp?** xuất hiện

---

## 5. Deploy lên Vercel (production)

### Lần đầu

```bash
# Login Vercel
npx vercel login

# Link project (lần đầu)
npx vercel link

# Thêm API key vào Vercel env (PROD + Preview + Dev)
npx vercel env add ANTHROPIC_API_KEY
# → paste key, chọn cả 3 môi trường

# Deploy
npx vercel --prod
```

### Lần sau

```bash
npx vercel --prod
```

Hoặc nối GitHub repo với Vercel → mỗi commit lên `main` tự deploy.

---

## 6. Troubleshooting

| Triệu chứng | Nguyên nhân | Cách xử lý |
|---|---|---|
| `/api/health` trả `ok: false` | Chưa có key | Kiểm tra `.env.local` (local) hoặc Vercel env (prod) |
| `401 Unauthorized` | Key sai / hết hạn | Tạo key mới ở console.anthropic.com |
| `429 Too Many Requests` | Hết quota / rate limit | Đợi vài phút hoặc upgrade plan |
| Modal mở nhưng không có chữ | Key OK nhưng request lỗi | Mở DevTools → Network → xem `/api/explain` response |
| `vercel dev` báo "command not found" | Vercel CLI chưa cài | Chạy `npm install` lại, hoặc `npm i -g vercel` |
| Stream chậm / cắt giữa chừng | Mạng yếu / timeout | `maxDuration` đã set 30s, nâng lên trong `api/explain.js` nếu cần |

---

## 7. Cost dự kiến

Model **Claude Sonnet 4.6** giá:
- Input:  $3 / 1M tokens
- Output: $15 / 1M tokens
- **Prompt caching: 90% off** input cho phần system prompt → đã bật mặc định

Mỗi lần em Minh "Hỏi Sprout":
- Input: ~250 tokens (system cached + question)
- Output: ~400 tokens
- **Cost ≈ $0.007** (khoảng 170đ VN)

→ 100 lần hỏi/ngày ≈ **17,000đ** ($0.70 USD).

Đề xuất bài tập (recommend) tốn nhiều hơn ~2x do output JSON dài hơn, nhưng có cache 30 phút phía client nên thường chỉ 2-3 lần/ngày.

---

## 8. Bảo mật

✅ **Đã làm sẵn:**
- API key chỉ ở phía server (Vercel Function), KHÔNG nhúng vào bundle JS
- `.env.local` đã trong `.gitignore` — không commit
- Validate input ở `/api/*` (clamp grade 1-5, age 5-12, max body size)
- Prompt caching → giảm cost 90%

⚠️ **Nên làm trước khi public rộng:**
- Thêm rate-limit per IP (vd Upstash Redis + Vercel middleware) — chưa có
- Thêm CAPTCHA nếu bị bot abuse — chưa có
- Monitor token usage qua Anthropic console

---

## 9. Disable AI tạm thời

Nếu hết quota hoặc muốn demo offline:
- Xóa `ANTHROPIC_API_KEY` khỏi env → các nút Sprout sẽ báo lỗi gracefully
- App vẫn chạy bình thường (4 phép tính + 7 topic mới + skill map + badges)
