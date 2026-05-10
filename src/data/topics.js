// MathSprout — Static data: names, items, word-problem templates, vocab, badges, levels, topics

export const NAMES = [
  'Minh', 'Linh', 'Mai', 'Nam', 'Lan', 'Hoa', 'Huy', 'Anh',
  'Tom', 'Sarah', 'Anna', 'John', 'Emma', 'Leo', 'Mia', 'Ben'
];

export const ITEMS = [
  { en: 'apples',   vi: 'quả táo',       emoji: '🍎' },
  { en: 'pencils',  vi: 'cây bút chì',   emoji: '✏️' },
  { en: 'books',    vi: 'cuốn sách',     emoji: '📚' },
  { en: 'candies',  vi: 'viên kẹo',      emoji: '🍬' },
  { en: 'stars',    vi: 'ngôi sao',      emoji: '⭐' },
  { en: 'flowers',  vi: 'bông hoa',      emoji: '🌸' },
  { en: 'toys',     vi: 'món đồ chơi',   emoji: '🧸' },
  { en: 'cookies',  vi: 'cái bánh quy',  emoji: '🍪' },
  { en: 'oranges',  vi: 'quả cam',       emoji: '🍊' },
  { en: 'balloons', vi: 'quả bóng bay',  emoji: '🎈' },
  { en: 'stickers', vi: 'miếng dán',     emoji: '🏷️' },
  { en: 'cars',     vi: 'chiếc ô tô',    emoji: '🚗' }
];

export const WORD_PROBLEMS = [
  {
    op: '+',
    grades: [1, 2, 3],
    en: '{name} has {x} {item}. {name2} gives {name} {y} more {item}. How many {item} does {name} have now?',
    vi: '{name} có {x} {item_vi}. {name2} cho {name} thêm {y} cái nữa. Bây giờ {name} có bao nhiêu {item_vi}?'
  },
  {
    op: '+',
    grades: [1, 2],
    en: 'There are {x} {item} in a basket. {name} adds {y} more. How many {item} are in the basket now?',
    vi: 'Có {x} {item_vi} trong giỏ. {name} cho thêm {y} cái nữa. Bây giờ trong giỏ có bao nhiêu {item_vi}?'
  },
  {
    op: '-',
    grades: [1, 2, 3],
    en: '{name} has {x} {item}. {name} gives {y} {item} to {name2}. How many {item} does {name} have left?',
    vi: '{name} có {x} {item_vi}. {name} cho {name2} {y} cái. Còn lại bao nhiêu cái?'
  },
  {
    op: '-',
    grades: [2, 3],
    en: 'There were {x} {item} on the table. {name} ate {y} of them. How many are left?',
    vi: 'Có {x} {item_vi} trên bàn. {name} đã ăn {y} cái. Còn lại bao nhiêu?'
  },
  {
    op: '*',
    grades: [2, 3, 4],
    en: 'There are {x} baskets. Each basket has {y} {item}. How many {item} are there in total?',
    vi: 'Có {x} cái giỏ. Mỗi giỏ có {y} {item_vi}. Tổng cộng có bao nhiêu {item_vi}?'
  },
  {
    op: '*',
    grades: [2, 3],
    en: '{name} has {x} bags. Each bag has {y} {item}. How many {item} does {name} have in total?',
    vi: '{name} có {x} cái túi. Mỗi túi có {y} {item_vi}. Tổng cộng {name} có bao nhiêu {item_vi}?'
  },
  {
    op: '/',
    grades: [3, 4, 5],
    en: 'There are {x} {item}. {name} wants to share them equally among {y} friends. How many {item} does each friend get?',
    vi: 'Có {x} {item_vi}. {name} muốn chia đều cho {y} người bạn. Mỗi bạn được bao nhiêu cái?'
  },
  {
    op: '/',
    grades: [3, 4],
    en: '{name} has {x} {item}. {name} puts them equally into {y} boxes. How many {item} are in each box?',
    vi: '{name} có {x} {item_vi}. {name} chia đều vào {y} cái hộp. Mỗi hộp có bao nhiêu {item_vi}?'
  }
];

export const VOCABULARY = {
  add:        { en: 'add / plus',       vi: 'cộng' },
  subtract:   { en: 'subtract / minus', vi: 'trừ' },
  multiply:   { en: 'multiply / times', vi: 'nhân' },
  divide:     { en: 'divide',           vi: 'chia' },
  sum:        { en: 'sum',              vi: 'tổng' },
  difference: { en: 'difference',       vi: 'hiệu' },
  product:    { en: 'product',          vi: 'tích' },
  quotient:   { en: 'quotient',         vi: 'thương' },
  equal:      { en: 'equal',            vi: 'bằng' },
  total:      { en: 'total',            vi: 'tổng cộng' },
  basket:     { en: 'basket',           vi: 'cái giỏ' },
  share:      { en: 'share',            vi: 'chia đều' },
  fraction:   { en: 'fraction',         vi: 'phân số' },
  numerator:  { en: 'numerator',        vi: 'tử số' },
  denominator:{ en: 'denominator',      vi: 'mẫu số' }
};

export const TOPICS = {
  addition:       { name: 'Addition',        name_vi: 'Phép cộng',     emoji: '➕',  symbol: '+'   },
  subtraction:    { name: 'Subtraction',     name_vi: 'Phép trừ',      emoji: '➖',  symbol: '−'   },
  multiplication: { name: 'Multiplication',  name_vi: 'Phép nhân',     emoji: '✖️',  symbol: '×'   },
  division:       { name: 'Division',        name_vi: 'Phép chia',     emoji: '➗',  symbol: '÷'   },
  comparison:     { name: 'Compare numbers', name_vi: 'So sánh số',    emoji: '⚖️',  symbol: '<>'  },
  counting:       { name: 'Counting',        name_vi: 'Đếm số',         emoji: '🔢', symbol: '1·2·3' },
  time:           { name: 'Time',            name_vi: 'Thời gian',      emoji: '🕐', symbol: ':'   },
  money:          { name: 'Money (VND)',     name_vi: 'Tiền VNĐ',       emoji: '💵', symbol: '₫'   },
  measurement:    { name: 'Measurement',     name_vi: 'Đo lường',       emoji: '📏', symbol: 'cm'  },
  geometry:       { name: 'Geometry',        name_vi: 'Hình học',       emoji: '📐', symbol: '▭'   },
  fractions:      { name: 'Fractions',       name_vi: 'Phân số',        emoji: '🍕', symbol: '½'   }
};

// Master list of every topic id, in display order.
export const ALL_TOPIC_IDS = [
  'addition', 'subtraction', 'multiplication', 'division',
  'comparison', 'counting', 'time', 'money',
  'measurement', 'geometry', 'fractions'
];

export const LEVELS = [
  { min: 0,    name: 'Sprout',     emoji: '🌱', desc: 'Just starting!' },
  { min: 100,  name: 'Seedling',   emoji: '🌿', desc: 'Growing up!' },
  { min: 300,  name: 'Young Tree', emoji: '🌳', desc: 'Getting strong!' },
  { min: 600,  name: 'Tree',       emoji: '🌲', desc: 'Standing tall!' },
  { min: 1000, name: 'Big Tree',   emoji: '🎄', desc: 'Mighty tree!' },
  { min: 1500, name: 'Forest',     emoji: '🌳🌲', desc: 'A whole forest!' }
];

export const BADGES = [
  { code: 'first_attempt',         emoji: '🌱', name: 'First Try',           desc: 'Made your first attempt!' },
  { code: 'first_correct',         emoji: '✨', name: 'First Win',           desc: 'Got your first answer right!' },
  { code: 'streak_3',              emoji: '🔥', name: '3-Day Streak',        desc: 'Learned 3 days in a row' },
  { code: 'streak_7',              emoji: '🔥', name: 'Week Warrior',        desc: 'Learned 7 days in a row' },
  { code: 'perfect_10',            emoji: '💯', name: 'Perfect 10',          desc: 'Got 10 in a row right!' },
  { code: 'addition_master',       emoji: '➕', name: 'Addition Master',     desc: 'Mastered Addition (90%+)' },
  { code: 'subtraction_master',    emoji: '➖', name: 'Subtraction Master',  desc: 'Mastered Subtraction (90%+)' },
  { code: 'multiplication_master', emoji: '✖️', name: 'Multi Master',        desc: 'Mastered Multiplication (90%+)' },
  { code: 'division_master',       emoji: '➗', name: 'Division Master',     desc: 'Mastered Division (90%+)' },
  { code: 'bilingual',             emoji: '🌍', name: 'Bilingual Brain',     desc: 'Used bilingual mode 10 times' },
  { code: 'study_5min',            emoji: '⏱️', name: 'Học 5 phút',          desc: 'Đã học 5 phút + 5 XP — Quick start!' },
  { code: 'study_together',        emoji: '🤝', name: 'Học cùng nhau',       desc: '10 phút + 30 XP — Learning together!' },
  { code: 'training',              emoji: '💪', name: 'Tập luyện',           desc: 'Đã tập luyện 15 phút — Trained for 15 minutes!' },
  { code: 'study_focused',         emoji: '😄', name: 'Tập trung học bài',   desc: '20 phút + 120 XP — Focused Study!' },
  { code: 'study_good_kid',        emoji: '🎒', name: 'Bé học bài ngoan',    desc: '25 phút + 140 XP — Good Student!' },
  { code: 'training_pro',          emoji: '💪', name: 'Tập luyện Pro',       desc: '30 phút tập luyện + 15 XP bonus — Pro Trainer!' },
  { code: 'study_talent',          emoji: '🎖️', name: 'Bé tài năng',          desc: '35 phút + 300 XP — Talented Kid!' },
  { code: 'study_concentrate',     emoji: '📖', name: 'Tập trung học bài',   desc: '40 phút + 329 XP — Concentrated Study!' },
  { code: 'training_super',        emoji: '🦸', name: 'Tập luyện siêu năng', desc: '45 phút tập luyện + 100 XP bonus — Super Power Trainer!' },
  { code: 'star_gold',             emoji: '⭐', name: 'Ngôi sao vàng',       desc: '50 phút + 789 XP — Gold Star!' },
  { code: 'star_shining',          emoji: '🌟', name: 'Ngôi sao toả sáng',   desc: '55 phút + 347 XP — Shining Star!' },
  { code: 'star_super_shining',    emoji: '✨', name: 'Ngôi sao siêu sáng',  desc: '1 tiếng 25 phút + 1233 XP — Super Shining Star!' },
  { code: 'played_1_hour',         emoji: '⏰', name: 'Play 1 Hour',         desc: 'Đã chơi đủ 1 tiếng — Played for 1 hour total!' },
  { code: 'played_2_hours',        emoji: '⏳', name: 'Play 2 Hours',        desc: 'Đã chơi đủ 2 tiếng — Played for 2 hours total!' },
  { code: 'star_plus',             emoji: '🌟', name: 'Star+',               desc: 'Mở khoá Star+ — bonus 2 câu warm-up dễ mỗi bài học!' },
  { code: 'fun_math',              emoji: '🎉', name: 'Học toán vui vẻ',     desc: '3 tiếng + 3450 XP → +1147 XP bonus — Fun Math Learning!' },
  { code: 'effort',                emoji: '🔥', name: 'Cố gắng',             desc: 'Mua từ shop — Effort!' },
  { code: 'smart',                 emoji: '🧠', name: 'Thông minh',          desc: 'Mua từ shop — Smart Brain!' },
  { code: 'focus',                 emoji: '🎯', name: 'Tập trung',           desc: 'Mua từ shop — Laser Focus!' },
  { code: 'training_super_max',    emoji: '🦸‍♂️', name: 'Tập luyện siêu năng MAX', desc: 'Mua từ shop — Super Power MAX!' }
];

// Per-question play-time credit awarded toward "Play X Hour" milestones.
// 11s × ~82 câu ≈ 15m, ~327 câu ≈ 1h, ~654 câu ≈ 2h, ~982 câu ≈ 3h.
export const PLAY_TIME_CREDIT_SEC = 11;
export const PLAY_TIME_GOAL_5MIN_SEC = 300;
export const PLAY_TIME_GOAL_10MIN_SEC = 600;
export const PLAY_TIME_GOAL_15MIN_SEC = 900;
export const PLAY_TIME_GOAL_20MIN_SEC = 1200;
export const PLAY_TIME_GOAL_25MIN_SEC = 1500;
export const PLAY_TIME_GOAL_30MIN_SEC = 1800;
export const PLAY_TIME_GOAL_35MIN_SEC = 2100;
export const PLAY_TIME_GOAL_40MIN_SEC = 2400;
export const PLAY_TIME_GOAL_45MIN_SEC = 2700;
export const PLAY_TIME_GOAL_50MIN_SEC = 3000;
export const PLAY_TIME_GOAL_55MIN_SEC = 3300;
export const PLAY_TIME_GOAL_SEC = 3600;
export const PLAY_TIME_GOAL_1H25MIN_SEC = 5100;
export const STUDY_5MIN_BONUS_XP = 5;
export const STUDY_TOGETHER_BONUS_XP = 30;
export const STUDY_FOCUSED_BONUS_XP = 120;
export const STUDY_GOOD_KID_BONUS_XP = 140;
export const TRAINING_PRO_BONUS_XP = 15;
export const STUDY_TALENT_BONUS_XP = 300;
export const STUDY_CONCENTRATE_BONUS_XP = 329;
export const TRAINING_SUPER_BONUS_XP = 100;
export const STAR_GOLD_BONUS_XP = 789;
export const STAR_SHINING_BONUS_XP = 347;
export const STAR_SUPER_SHINING_BONUS_XP = 1233;
export const PLAY_TIME_GOAL_2H_SEC = 7200;
export const PLAY_TIME_GOAL_3H_SEC = 10800;

// Star+ reward: number of easy warm-up questions prepended to each lesson.
export const EASY_BONUS_COUNT = 2;

// "Fun Math" reward — needs 3h play AND ≥3450 XP. Pays 190 + 957 = 1147 XP.
export const FUN_MATH_XP_THRESHOLD = 3450;
export const FUN_MATH_BONUS_XP = 190 + 957;

// Shop: how many warm-up easy questions are pulled from stock per lesson.
// Cap so stock lasts across many lessons (89 stock ÷ 3 ≈ 30 lessons).
export const STOCK_PER_LESSON = 3;

// Shop catalogue. Each item is one-time purchase (after buy → marked owned).
export const SHOP_ITEMS = [
  {
    id: 'pack_easy_15',
    name: 'Gói 15 câu dễ',
    emoji: '📚',
    cost: 350,
    rewards: { easyQuestions: 15, badges: [] }
  },
  {
    id: 'pack_effort',
    name: 'Gói Cố gắng',
    emoji: '🔥',
    cost: 1200,
    rewards: { easyQuestions: 30, badges: ['effort'] }
  },
  {
    id: 'pack_super_max',
    name: 'Gói Siêu năng MAX',
    emoji: '🦸‍♂️',
    cost: 3400,
    rewards: { easyQuestions: 89, badges: ['smart', 'focus', 'training_super_max'] }
  }
];
