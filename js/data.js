/* MathSprout — Static data: names, items, word-problem templates, vocabulary, badges */

window.NAMES = [
  'Minh', 'Linh', 'Mai', 'Nam', 'Lan', 'Hoa', 'Huy', 'Anh',
  'Tom', 'Sarah', 'Anna', 'John', 'Emma', 'Leo', 'Mia', 'Ben'
];

window.ITEMS = [
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

/* Word problem templates — each becomes thousands of variations after slot-filling */
window.WORD_PROBLEMS = [
  /* ADDITION */
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

  /* SUBTRACTION */
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

  /* MULTIPLICATION */
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

  /* DIVISION */
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

/* Math vocabulary EN-VI for tooltip / Sprout chat */
window.VOCABULARY = {
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

/* Topics with display info */
window.TOPICS = {
  addition:       { name: 'Addition',       name_vi: 'Phép cộng',          emoji: '➕', symbol: '+' },
  subtraction:    { name: 'Subtraction',    name_vi: 'Phép trừ',           emoji: '➖', symbol: '−' },
  multiplication: { name: 'Multiplication', name_vi: 'Phép nhân',          emoji: '✖️', symbol: '×' },
  division:       { name: 'Division',       name_vi: 'Phép chia',          emoji: '➗', symbol: '÷' },
  power:          { name: 'Powers & Roots', name_vi: 'Lũy thừa & căn',     emoji: '🔢', symbol: '²' },
  fraction:       { name: 'Fractions',      name_vi: 'Phân số',            emoji: '🍰', symbol: '½' },
  decimal:        { name: 'Decimals',       name_vi: 'Số thập phân',       emoji: '🔟', symbol: '·' },
  bodmas:         { name: 'Order of Ops',   name_vi: 'Thứ tự phép tính',   emoji: '🧠', symbol: '()' },
  pattern:        { name: 'Number Patterns', name_vi: 'Quy luật dãy số',   emoji: '🔁', symbol: '…' },
  placevalue:     { name: 'Place Value',     name_vi: 'Giá trị theo hàng', emoji: '🏷️', symbol: '#' },
  comparison:     { name: 'Compare Numbers', name_vi: 'So sánh số',        emoji: '⚖️', symbol: '<>' },
  rounding:       { name: 'Rounding',        name_vi: 'Làm tròn',          emoji: '🎯', symbol: '~' }
};

/* Levels — based on total XP */
window.LEVELS = [
  { min: 0,    name: 'Sprout',     emoji: '🌱', desc: 'Just starting!' },
  { min: 100,  name: 'Seedling',   emoji: '🌿', desc: 'Growing up!' },
  { min: 300,  name: 'Young Tree', emoji: '🌳', desc: 'Getting strong!' },
  { min: 600,  name: 'Tree',       emoji: '🌲', desc: 'Standing tall!' },
  { min: 1000, name: 'Big Tree',   emoji: '🎄', desc: 'Mighty tree!' },
  { min: 1500, name: 'Forest',     emoji: '🌳🌲', desc: 'A whole forest!' }
];

/* Badges */
window.BADGES = [
  { code: 'first_attempt',         emoji: '🌱', name: 'First Try',           desc: 'Made your first attempt!' },
  { code: 'first_correct',         emoji: '✨', name: 'First Win',           desc: 'Got your first answer right!' },
  { code: 'streak_3',              emoji: '🔥', name: '3-Day Streak',        desc: 'Learned 3 days in a row' },
  { code: 'streak_7',              emoji: '🔥', name: 'Week Warrior',        desc: 'Learned 7 days in a row' },
  { code: 'perfect_10',            emoji: '💯', name: 'Perfect 10',          desc: 'Got 10 in a row right!' },
  { code: 'addition_master',       emoji: '➕', name: 'Addition Master',     desc: 'Mastered Addition (90%+)' },
  { code: 'subtraction_master',    emoji: '➖', name: 'Subtraction Master',  desc: 'Mastered Subtraction (90%+)' },
  { code: 'multiplication_master', emoji: '✖️', name: 'Multi Master',        desc: 'Mastered Multiplication (90%+)' },
  { code: 'division_master',       emoji: '➗', name: 'Division Master',     desc: 'Mastered Division (90%+)' },
  { code: 'power_master',          emoji: '🔢', name: 'Power Master',        desc: 'Mastered Powers & Roots (90%+)' },
  { code: 'fraction_master',       emoji: '🍰', name: 'Fraction Master',     desc: 'Mastered Fractions (90%+)' },
  { code: 'decimal_master',        emoji: '🔟', name: 'Decimal Master',      desc: 'Mastered Decimals (90%+)' },
  { code: 'bodmas_master',         emoji: '🧠', name: 'BODMAS Master',       desc: 'Mastered Order of Ops (90%+)' },
  { code: 'bilingual',             emoji: '🌍', name: 'Bilingual Brain',     desc: 'Used bilingual mode 10 times' }
];
