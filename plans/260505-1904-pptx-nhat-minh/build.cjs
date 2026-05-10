const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 inches
pres.title = "MathSprout - STEMFEST 2026";
pres.author = "Trần Nhật Minh - Lớp 2A5";

// Color palette - Forest & Moss + Coral accent (sprout/growth theme)
const C = {
  forest: "2C5F2D",      // primary deep green (sprout)
  moss: "97BC62",        // soft moss green
  cream: "FFF8F0",       // background cream
  white: "FFFFFF",
  coral: "F96167",       // warm accent (energy)
  gold: "F9D442",        // sunshine gold (achievement)
  sky: "5DADE2",         // sky blue
  navy: "1E3A5F",        // dark navy text
  textDark: "1A1A2E",
  textMuted: "5D6D7E",
};

const FONT_HEAD = "Arial Black";
const FONT_BODY = "Calibri";

// =========================================================
// SLIDE 1 — TITLE
// =========================================================
const s1 = pres.addSlide();
s1.background = { color: C.forest };

s1.addShape(pres.ShapeType.ellipse, {
  x: -1.5, y: -1.5, w: 4.5, h: 4.5, fill: { color: C.moss }, line: { type: "none" },
});
s1.addShape(pres.ShapeType.ellipse, {
  x: 11.0, y: 5.0, w: 4.5, h: 4.5, fill: { color: C.gold }, line: { type: "none" },
});
s1.addShape(pres.ShapeType.ellipse, {
  x: 10.0, y: -1, w: 2.2, h: 2.2, fill: { color: C.coral, transparency: 30 }, line: { type: "none" },
});

s1.addShape(pres.ShapeType.roundRect, {
  x: 1.0, y: 1.3, w: 4.5, h: 0.7, fill: { color: C.gold }, line: { type: "none" },
  rectRadius: 0.35,
});
s1.addText("🏆 STEMFEST 2026", {
  x: 1.0, y: 1.3, w: 4.5, h: 0.7,
  fontFace: FONT_HEAD, fontSize: 20, color: C.forest, align: "center", valign: "middle", bold: true,
});

s1.addText("🌱", {
  x: 0.7, y: 2.3, w: 2.8, h: 2.8,
  fontSize: 180, align: "center", valign: "middle",
});

s1.addText("MathSprout", {
  x: 3.5, y: 2.5, w: 9.5, h: 1.6,
  fontFace: FONT_HEAD, fontSize: 90, color: C.white, bold: true, align: "left",
});

s1.addText('"10 minutes a day, BIG progress all year"', {
  x: 3.5, y: 4.2, w: 9.5, h: 0.6,
  fontFace: FONT_BODY, fontSize: 22, color: C.gold, italic: true, align: "left",
});

s1.addText("Học Toán bằng Tiếng Anh cho học sinh tiểu học", {
  x: 3.5, y: 4.85, w: 9.5, h: 0.5,
  fontFace: FONT_BODY, fontSize: 18, color: C.moss, align: "left",
});

s1.addShape(pres.ShapeType.roundRect, {
  x: 1.0, y: 6.2, w: 6.5, h: 0.9, fill: { color: C.white }, line: { type: "none" },
  rectRadius: 0.15,
});
s1.addText("👦 Trần Nhật Minh", {
  x: 1.2, y: 6.25, w: 6.3, h: 0.45,
  fontFace: FONT_HEAD, fontSize: 18, color: C.forest, bold: true,
});
s1.addText("Lớp 2A5 - Trường Tiểu học Vinschool", {
  x: 1.2, y: 6.65, w: 6.3, h: 0.4,
  fontFace: FONT_BODY, fontSize: 13, color: C.textMuted,
});

// =========================================================
// SLIDE 2 — PROBLEM
// =========================================================
const s2 = pres.addSlide();
s2.background = { color: C.cream };

s2.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: 0.4, h: 7.5, fill: { color: C.coral }, line: { type: "none" },
});
s2.addText("Vấn đề là gì?", {
  x: 0.9, y: 0.5, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 40, color: C.navy, bold: true,
});
s2.addText("Tại sao em làm dự án này?", {
  x: 0.9, y: 1.3, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 18, color: C.textMuted, italic: true,
});

const problems = [
  { icon: "😰", title: "Khó học Toán bằng Tiếng Anh", desc: "Nhiều bạn không hiểu từ vựng tiếng Anh khi học toán", color: C.coral },
  { icon: "📚", title: "Bài tập giống nhau", desc: "Sách bài tập cố định, không đổi mới mỗi ngày", color: C.gold },
  { icon: "🤷", title: "Không biết mình yếu phần nào", desc: "Không có ai chỉ ra điểm yếu để em luyện thêm", color: C.sky },
  { icon: "😴", title: "Học chán, không vui", desc: "Bài tập khô khan, không có hiệu ứng hấp dẫn", color: C.moss },
];

problems.forEach((p, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.9 + col * 6.2;
  const y = 2.1 + row * 2.5;

  s2.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: 5.9, h: 2.2, fill: { color: C.white }, line: { color: p.color, width: 3 },
    rectRadius: 0.15,
  });

  s2.addShape(pres.ShapeType.ellipse, {
    x: x + 0.3, y: y + 0.4, w: 1.2, h: 1.2, fill: { color: p.color }, line: { type: "none" },
  });
  s2.addText(p.icon, {
    x: x + 0.3, y: y + 0.4, w: 1.2, h: 1.2,
    fontSize: 40, align: "center", valign: "middle",
  });

  s2.addText(p.title, {
    x: x + 1.7, y: y + 0.4, w: 4.0, h: 0.6,
    fontFace: FONT_HEAD, fontSize: 18, color: C.navy, bold: true,
  });
  s2.addText(p.desc, {
    x: x + 1.7, y: y + 1.0, w: 4.0, h: 1.0,
    fontFace: FONT_BODY, fontSize: 13, color: C.textDark,
  });
});

// =========================================================
// SLIDE 3 — SOLUTION (MathSprout)
// =========================================================
const s3 = pres.addSlide();
s3.background = { color: C.cream };

s3.addShape(pres.ShapeType.rect, {
  x: 0, y: 0, w: 13.333, h: 1.6, fill: { color: C.forest }, line: { type: "none" },
});
s3.addText("Giải pháp của em: MathSprout 🌱", {
  x: 0.7, y: 0.4, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 36, color: C.white, bold: true,
});

s3.addShape(pres.ShapeType.roundRect, {
  x: 0.7, y: 2.0, w: 5.5, h: 5.0, fill: { color: C.moss }, line: { type: "none" },
  rectRadius: 0.2,
});
s3.addText("🌱", {
  x: 0.7, y: 2.2, w: 5.5, h: 2.8,
  fontSize: 180, align: "center", valign: "middle",
});
s3.addText("Web App", {
  x: 0.7, y: 5.2, w: 5.5, h: 0.5,
  fontFace: FONT_BODY, fontSize: 18, color: C.cream, align: "center",
});
s3.addText("MathSprout", {
  x: 0.7, y: 5.7, w: 5.5, h: 0.8,
  fontFace: FONT_HEAD, fontSize: 36, color: C.white, bold: true, align: "center",
});
s3.addText("10 phút mỗi ngày!", {
  x: 0.7, y: 6.5, w: 5.5, h: 0.5,
  fontFace: FONT_BODY, fontSize: 14, color: C.gold, italic: true, align: "center",
});

s3.addText("MathSprout là gì?", {
  x: 6.7, y: 2.0, w: 6.0, h: 0.6,
  fontFace: FONT_HEAD, fontSize: 24, color: C.coral, bold: true,
});

const features = [
  { icon: "🌐", text: "Học Toán bằng Tiếng Anh, có dịch sang Tiếng Việt" },
  { icon: "🤖", text: "AI thông minh đề xuất bài tập theo điểm yếu" },
  { icon: "🎯", text: "Bài tập tự sinh — không bao giờ lặp lại" },
  { icon: "🎉", text: "Vui như chơi game với mầm cây, sao và huy hiệu" },
];

features.forEach((f, i) => {
  const y = 2.8 + i * 1.0;
  s3.addShape(pres.ShapeType.roundRect, {
    x: 6.7, y: y, w: 6.0, h: 0.85, fill: { color: C.white }, line: { color: C.moss, width: 2 },
    rectRadius: 0.1,
  });
  s3.addText(f.icon, {
    x: 6.85, y: y, w: 0.9, h: 0.85,
    fontSize: 26, align: "center", valign: "middle",
  });
  s3.addText(f.text, {
    x: 7.8, y: y, w: 4.8, h: 0.85,
    fontFace: FONT_BODY, fontSize: 14, color: C.textDark, valign: "middle",
  });
});

// =========================================================
// SLIDE 4 — KEY FEATURES (3-column grid)
// =========================================================
const s4 = pres.addSlide();
s4.background = { color: C.cream };

s4.addText("Tính năng nổi bật ⭐", {
  x: 0.7, y: 0.5, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 40, color: C.forest, bold: true,
});
s4.addText("9 tính năng giúp việc học Toán vui và hiệu quả hơn", {
  x: 0.7, y: 1.3, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 16, color: C.textMuted, italic: true,
});

const keyFeatures = [
  { icon: "🔢", title: "4 phép tính", desc: "Cộng, trừ, nhân, chia bằng tiếng Anh", color: C.coral },
  { icon: "📖", title: "Word Problems", desc: "Bài toán có lời văn biến hóa", color: C.sky },
  { icon: "🔊", title: "Đọc to câu hỏi", desc: "Web Speech API đọc tiếng Anh chuẩn", color: C.gold },
  { icon: "🌱", title: "Mầm cây lớn dần", desc: "Theo XP và streak hàng ngày", color: C.moss },
  { icon: "🗺️", title: "Skill Map", desc: "Bản đồ kỹ năng từng chủ đề", color: C.coral },
  { icon: "📈", title: "Progress Chart", desc: "Biểu đồ tiến độ 7 ngày", color: C.sky },
  { icon: "🏅", title: "10 Huy hiệu", desc: "Achievement badges hấp dẫn", color: C.gold },
  { icon: "🎉", title: "Confetti", desc: "Hiệu ứng vui khi trả lời đúng", color: C.moss },
  { icon: "💾", title: "Lưu Offline", desc: "Hoạt động cả khi không có mạng", color: C.coral },
];

keyFeatures.forEach((f, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.7 + col * 4.15;
  const y = 2.0 + row * 1.75;

  s4.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: 3.95, h: 1.55, fill: { color: C.white }, line: { color: f.color, width: 2 },
    rectRadius: 0.12,
  });

  s4.addText(f.icon, {
    x: x + 0.1, y: y + 0.15, w: 1.0, h: 1.25,
    fontSize: 32, align: "center", valign: "middle",
  });

  s4.addText(f.title, {
    x: x + 1.1, y: y + 0.2, w: 2.7, h: 0.5,
    fontFace: FONT_HEAD, fontSize: 16, color: f.color, bold: true,
  });

  s4.addText(f.desc, {
    x: x + 1.1, y: y + 0.7, w: 2.7, h: 0.8,
    fontFace: FONT_BODY, fontSize: 11, color: C.textDark,
  });
});

// =========================================================
// SLIDE 5 — AI ADAPTIVE LEARNING (star feature)
// =========================================================
const s5 = pres.addSlide();
s5.background = { color: C.navy };

s5.addShape(pres.ShapeType.ellipse, {
  x: -1, y: -1, w: 3, h: 3, fill: { color: C.coral, transparency: 60 }, line: { type: "none" },
});
s5.addShape(pres.ShapeType.ellipse, {
  x: 11.5, y: 5.5, w: 3.5, h: 3.5, fill: { color: C.gold, transparency: 50 }, line: { type: "none" },
});

s5.addShape(pres.ShapeType.roundRect, {
  x: 0.7, y: 0.5, w: 3.5, h: 0.6, fill: { color: C.coral }, line: { type: "none" },
  rectRadius: 0.3,
});
s5.addText("⭐ ĐIỂM SÁNG", {
  x: 0.7, y: 0.5, w: 3.5, h: 0.6,
  fontFace: FONT_HEAD, fontSize: 16, color: C.white, align: "center", valign: "middle", bold: true,
});

s5.addText("AI Adaptive Learning", {
  x: 0.7, y: 1.3, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 44, color: C.gold, bold: true,
});
s5.addText("AI thông minh đề xuất bài tập riêng cho mỗi bạn", {
  x: 0.7, y: 2.2, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 18, color: C.moss, italic: true,
});

const steps = [
  { num: "1", icon: "📊", title: "Phân tích", desc: "AI xem bạn làm đúng/sai phần nào", color: C.coral },
  { num: "2", icon: "🎯", title: "Tìm điểm yếu", desc: "Xác định kỹ năng cần luyện thêm", color: C.gold },
  { num: "3", icon: "✨", title: "Đề xuất bài", desc: "Tự sinh bài tập phù hợp cho bạn", color: C.moss },
];

steps.forEach((s, i) => {
  const x = 0.7 + i * 4.2;
  const y = 3.4;

  s5.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: 3.9, h: 3.1, fill: { color: C.white }, line: { type: "none" },
    rectRadius: 0.2,
  });

  s5.addShape(pres.ShapeType.ellipse, {
    x: x + 1.45, y: y - 0.4, w: 1.0, h: 1.0, fill: { color: s.color }, line: { color: C.white, width: 4 },
  });
  s5.addText(s.num, {
    x: x + 1.45, y: y - 0.4, w: 1.0, h: 1.0,
    fontFace: FONT_HEAD, fontSize: 32, color: C.white, bold: true, align: "center", valign: "middle",
  });

  s5.addText(s.icon, {
    x: x, y: y + 0.7, w: 3.9, h: 1.0,
    fontSize: 60, align: "center", valign: "middle",
  });

  s5.addText(s.title, {
    x: x, y: y + 1.7, w: 3.9, h: 0.6,
    fontFace: FONT_HEAD, fontSize: 22, color: C.navy, bold: true, align: "center",
  });

  s5.addText(s.desc, {
    x: x + 0.2, y: y + 2.3, w: 3.5, h: 0.7,
    fontFace: FONT_BODY, fontSize: 13, color: C.textDark, align: "center",
  });

  if (i < 2) {
    s5.addText("➜", {
      x: x + 3.85, y: y + 1.2, w: 0.45, h: 0.7,
      fontSize: 28, color: C.gold, align: "center", valign: "middle", bold: true,
    });
  }
});

s5.addText("→ Mỗi bạn có một lộ trình học riêng, không ai giống ai!", {
  x: 0.7, y: 6.85, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 16, color: C.gold, italic: true, align: "center",
});

// =========================================================
// SLIDE 6 — TECH STACK
// =========================================================
const s6 = pres.addSlide();
s6.background = { color: C.cream };

s6.addText("Em làm bằng gì? 🛠️", {
  x: 0.7, y: 0.5, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 40, color: C.forest, bold: true,
});
s6.addText("Công nghệ em đã học và sử dụng", {
  x: 0.7, y: 1.3, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 16, color: C.textMuted, italic: true,
});

const techs = [
  { name: "React 19", purpose: "Xây dựng giao diện", icon: "⚛️", color: C.sky },
  { name: "Vite 6", purpose: "Chạy dev server siêu nhanh", icon: "⚡", color: C.gold },
  { name: "Tailwind CSS 4", purpose: "Trang trí đẹp cho web", icon: "🎨", color: C.coral },
  { name: "JavaScript", purpose: "Ngôn ngữ lập trình chính", icon: "📜", color: C.moss },
  { name: "Web Speech API", purpose: "Đọc to câu hỏi tiếng Anh", icon: "🔊", color: C.sky },
  { name: "localStorage", purpose: "Lưu dữ liệu trên máy", icon: "💾", color: C.coral },
];

techs.forEach((t, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = 0.7 + col * 6.2;
  const y = 2.1 + row * 1.6;

  s6.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: 5.9, h: 1.4, fill: { color: C.white }, line: { color: t.color, width: 3 },
    rectRadius: 0.15,
  });

  s6.addShape(pres.ShapeType.ellipse, {
    x: x + 0.25, y: y + 0.2, w: 1.0, h: 1.0, fill: { color: t.color }, line: { type: "none" },
  });
  s6.addText(t.icon, {
    x: x + 0.25, y: y + 0.2, w: 1.0, h: 1.0,
    fontSize: 32, align: "center", valign: "middle",
  });

  s6.addText(t.name, {
    x: x + 1.4, y: y + 0.2, w: 4.3, h: 0.55,
    fontFace: FONT_HEAD, fontSize: 20, color: C.navy, bold: true,
  });
  s6.addText(t.purpose, {
    x: x + 1.4, y: y + 0.75, w: 4.3, h: 0.5,
    fontFace: FONT_BODY, fontSize: 13, color: C.textMuted,
  });
});

// =========================================================
// SLIDE 7 — DEMO FLOW
// =========================================================
const s7 = pres.addSlide();
s7.background = { color: C.cream };

s7.addText("Cách dùng MathSprout 🚀", {
  x: 0.7, y: 0.5, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 40, color: C.forest, bold: true,
});
s7.addText("9 bước đơn giản — bắt đầu chỉ trong 1 phút!", {
  x: 0.7, y: 1.3, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 16, color: C.textMuted, italic: true,
});

const demoSteps = [
  { n: "1", t: "Welcome", d: "Bấm GET STARTED", c: C.coral },
  { n: "2", t: "Đăng ký", d: "Tên + tuổi + lớp + buddy", c: C.gold },
  { n: "3", t: "Dashboard", d: "Xem mầm cây + streak", c: C.moss },
  { n: "4", t: "Practice", d: "Làm 10 bài toán", c: C.sky },
  { n: "5", t: "Result", d: "Xem đúng/sai song ngữ", c: C.coral },
  { n: "6", t: "XP mới", d: "Quay về Dashboard", c: C.gold },
  { n: "7", t: "Skill Map", d: "Xem điểm mạnh/yếu", c: C.moss },
  { n: "8", t: "Progress", d: "Biểu đồ 7 ngày", c: C.sky },
  { n: "9", t: "Badges", d: "Sưu tập huy hiệu", c: C.coral },
];

demoSteps.forEach((s, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const x = 0.7 + col * 4.2;
  const y = 2.0 + row * 1.7;

  s7.addShape(pres.ShapeType.roundRect, {
    x: x, y: y, w: 3.95, h: 1.5, fill: { color: C.white }, line: { type: "none" },
    rectRadius: 0.15,
  });

  s7.addShape(pres.ShapeType.ellipse, {
    x: x + 0.2, y: y + 0.3, w: 0.9, h: 0.9, fill: { color: s.c }, line: { type: "none" },
  });
  s7.addText(s.n, {
    x: x + 0.2, y: y + 0.3, w: 0.9, h: 0.9,
    fontFace: FONT_HEAD, fontSize: 28, color: C.white, bold: true, align: "center", valign: "middle",
  });

  s7.addText(s.t, {
    x: x + 1.25, y: y + 0.3, w: 2.6, h: 0.5,
    fontFace: FONT_HEAD, fontSize: 18, color: C.navy, bold: true,
  });
  s7.addText(s.d, {
    x: x + 1.25, y: y + 0.85, w: 2.6, h: 0.5,
    fontFace: FONT_BODY, fontSize: 12, color: C.textMuted,
  });
});

// =========================================================
// SLIDE 8 — FUTURE PLANS
// =========================================================
const s8 = pres.addSlide();
s8.background = { color: C.cream };

s8.addText("🚀 Hướng phát triển", {
  x: 0.7, y: 0.5, w: 12.0, h: 1.0,
  fontFace: FONT_HEAD, fontSize: 40, color: C.coral, bold: true,
});
s8.addText("Kế hoạch v2.0 — em sẽ làm tiếp những tính năng này", {
  x: 0.7, y: 1.3, w: 12.0, h: 0.5,
  fontFace: FONT_BODY, fontSize: 16, color: C.textMuted, italic: true,
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 0.7, y: 2.1, w: 6.0, h: 5.0, fill: { color: C.moss }, line: { type: "none" },
  rectRadius: 0.2,
});
s8.addText("✅ Đã có (v1.0)", {
  x: 0.9, y: 2.3, w: 5.6, h: 0.6,
  fontFace: FONT_HEAD, fontSize: 22, color: C.white, bold: true,
});

const v1Items = [
  "✓ 4 phép tính + Word Problems",
  "✓ Song ngữ Anh-Việt",
  "✓ AI Adaptive Learning",
  "✓ Skill Map + Progress Chart",
  "✓ 10 Huy hiệu",
  "✓ Lưu offline (localStorage)",
];
v1Items.forEach((item, i) => {
  s8.addText(item, {
    x: 0.9, y: 3.0 + i * 0.65, w: 5.6, h: 0.55,
    fontFace: FONT_BODY, fontSize: 15, color: C.white, bold: true,
  });
});

s8.addShape(pres.ShapeType.roundRect, {
  x: 7.0, y: 2.1, w: 5.6, h: 5.0, fill: { color: C.coral }, line: { type: "none" },
  rectRadius: 0.2,
});
s8.addText("🚧 Sắp có (v2.0)", {
  x: 7.2, y: 2.3, w: 5.2, h: 0.6,
  fontFace: FONT_HEAD, fontSize: 22, color: C.white, bold: true,
});

const v2Items = [
  { icon: "🤖", text: "AI Chatbot Sprout" },
  { icon: "🎮", text: "Mini-games (Bubble Pop)" },
  { icon: "🏆", text: "Class Leaderboard" },
  { icon: "👨‍👩‍👧", text: "Parent Mode (báo cáo email)" },
  { icon: "📱", text: "Mobile App (PWA)" },
];
v2Items.forEach((item, i) => {
  s8.addText(item.icon, {
    x: 7.2, y: 3.0 + i * 0.75, w: 0.7, h: 0.6,
    fontSize: 24, align: "center", valign: "middle",
  });
  s8.addText(item.text, {
    x: 7.95, y: 3.0 + i * 0.75, w: 4.5, h: 0.6,
    fontFace: FONT_BODY, fontSize: 15, color: C.white, bold: true, valign: "middle",
  });
});

// =========================================================
// SLIDE 9 — THANK YOU
// =========================================================
const s9 = pres.addSlide();
s9.background = { color: C.forest };

s9.addShape(pres.ShapeType.ellipse, {
  x: -2, y: -2, w: 5, h: 5, fill: { color: C.moss }, line: { type: "none" },
});
s9.addShape(pres.ShapeType.ellipse, {
  x: 10.5, y: 4.5, w: 4, h: 4, fill: { color: C.gold }, line: { type: "none" },
});
s9.addShape(pres.ShapeType.ellipse, {
  x: 11, y: -1, w: 2, h: 2, fill: { color: C.coral, transparency: 30 }, line: { type: "none" },
});

s9.addText("🌱", {
  x: 0.7, y: 0.8, w: 12.0, h: 2.0,
  fontSize: 130, align: "center", valign: "middle",
});

s9.addText("CẢM ƠN", {
  x: 0.7, y: 2.7, w: 12.0, h: 1.4,
  fontFace: FONT_HEAD, fontSize: 100, color: C.white, bold: true, align: "center",
});

s9.addText("các thầy cô và các bạn đã lắng nghe!", {
  x: 0.7, y: 4.2, w: 12.0, h: 0.7,
  fontFace: FONT_BODY, fontSize: 26, color: C.gold, italic: true, align: "center",
});

s9.addText("💖 Em mong MathSprout sẽ giúp các bạn học Toán vui hơn 💖", {
  x: 0.7, y: 5.0, w: 12.0, h: 0.6,
  fontFace: FONT_BODY, fontSize: 18, color: C.moss, align: "center",
});

s9.addShape(pres.ShapeType.roundRect, {
  x: 4.0, y: 5.9, w: 5.3, h: 1.2, fill: { color: C.white }, line: { type: "none" },
  rectRadius: 0.15,
});
s9.addText("Trần Nhật Minh", {
  x: 4.0, y: 6.0, w: 5.3, h: 0.55,
  fontFace: FONT_HEAD, fontSize: 24, color: C.forest, bold: true, align: "center",
});
s9.addText("Lớp 2A5 - Vinschool · STEMFEST 2026", {
  x: 4.0, y: 6.55, w: 5.3, h: 0.5,
  fontFace: FONT_BODY, fontSize: 14, color: C.textMuted, align: "center",
});

pres.writeFile({ fileName: "/Users/hoangtran/Documents/Github/mathsprout/plans/260505-1904-pptx-nhat-minh/mathsprout-stemfest-2026.pptx" })
  .then(fn => console.log("Created:", fn));
