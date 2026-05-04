/* MathSprout — Question generators (algorithmic + word problem templates) */

(function () {
  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* Number range based on grade & operation */
  function rangeForGrade(grade, op) {
    if (op === '+' || op === '-') {
      if (grade <= 1) return [1, 10];
      if (grade <= 2) return [1, 20];
      if (grade <= 3) return [1, 100];
      if (grade <= 4) return [1, 1000];
      return [1, 10000];
    }
    if (op === '*') {
      if (grade <= 2) return [1, 5];
      if (grade <= 3) return [1, 10];
      if (grade <= 4) return [1, 12];
      return [1, 99];
    }
    if (op === '/') {
      if (grade <= 3) return [2, 5];
      if (grade <= 4) return [2, 10];
      return [2, 12];
    }
    return [1, 10];
  }

  function generateAddition(grade) {
    const [min, max] = rangeForGrade(grade, '+');
    const a = randInt(min, max);
    const b = randInt(min, max);
    return {
      topic: 'addition',
      type: 'numeric',
      grade,
      questionEn: `${a} + ${b} = ?`,
      questionVi: `${a} cộng ${b} bằng bao nhiêu?`,
      answer: a + b,
      explanation: {
        en: `${a} plus ${b} equals ${a + b}.`,
        vi: `${a} cộng ${b} bằng ${a + b}.`
      },
      hint: `Try counting up from ${a}: ${a + 1}, ${a + 2}... ${b} times.`
    };
  }

  function generateSubtraction(grade) {
    const [min, max] = rangeForGrade(grade, '-');
    let a = randInt(min, max);
    let b = randInt(min, max);
    if (b > a) [a, b] = [b, a]; // ensure a >= b for non-negative result
    return {
      topic: 'subtraction',
      type: 'numeric',
      grade,
      questionEn: `${a} − ${b} = ?`,
      questionVi: `${a} trừ ${b} bằng bao nhiêu?`,
      answer: a - b,
      explanation: {
        en: `${a} minus ${b} equals ${a - b}.`,
        vi: `${a} trừ ${b} bằng ${a - b}.`
      },
      hint: `Start at ${a} and count down ${b} times.`
    };
  }

  function generateMultiplication(grade) {
    const [min, max] = rangeForGrade(grade, '*');
    const a = randInt(min, max);
    const b = randInt(min, max);
    const series = Array(a).fill(b).join(' + ');
    return {
      topic: 'multiplication',
      type: 'numeric',
      grade,
      questionEn: `${a} × ${b} = ?`,
      questionVi: `${a} nhân ${b} bằng bao nhiêu?`,
      answer: a * b,
      explanation: {
        en: `${a} times ${b} means adding ${b} to itself ${a} times: ${series} = ${a * b}.`,
        vi: `${a} nhân ${b} có nghĩa là cộng số ${b} với chính nó ${a} lần: ${series} = ${a * b}.`
      },
      hint: `Multiplication is repeated addition!`
    };
  }

  function generateDivision(grade) {
    const [min, max] = rangeForGrade(grade, '/');
    const b = randInt(min, max);
    const result = randInt(min, max);
    const a = b * result; // ensure clean division
    return {
      topic: 'division',
      type: 'numeric',
      grade,
      questionEn: `${a} ÷ ${b} = ?`,
      questionVi: `${a} chia ${b} bằng bao nhiêu?`,
      answer: result,
      explanation: {
        en: `${a} divided by ${b} equals ${result}, because ${b} × ${result} = ${a}.`,
        vi: `${a} chia ${b} bằng ${result}, vì ${b} × ${result} = ${a}.`
      },
      hint: `Think: how many groups of ${b} can you make from ${a}?`
    };
  }

  /* ---------- POWERS & SQUARE ROOTS ---------- */
  function generatePower(grade) {
    /* 50% squares, 25% cubes (grade 5+), 25% square roots */
    const r = Math.random();
    const useCube = grade >= 5 && r < 0.25;
    const useRoot = !useCube && r < 0.5;

    if (useCube) {
      const base = randInt(2, 5);
      return {
        topic: 'power', type: 'numeric', grade,
        questionEn: `${base}³ = ?`,
        questionVi: `${base} mũ 3 bằng bao nhiêu?`,
        answer: base * base * base,
        explanation: {
          en: `${base}³ means ${base} × ${base} × ${base} = ${base * base * base}.`,
          vi: `${base}³ nghĩa là ${base} × ${base} × ${base} = ${base * base * base}.`
        },
        hint: `Multiply ${base} by itself three times.`
      };
    }

    if (useRoot) {
      const base = randInt(2, grade <= 4 ? 9 : 12);
      const sq = base * base;
      return {
        topic: 'power', type: 'numeric', grade,
        questionEn: `√${sq} = ?`,
        questionVi: `Căn bậc hai của ${sq} bằng bao nhiêu?`,
        answer: base,
        explanation: {
          en: `√${sq} = ${base} because ${base} × ${base} = ${sq}.`,
          vi: `√${sq} = ${base} vì ${base} × ${base} = ${sq}.`
        },
        hint: `What number multiplied by itself gives ${sq}?`
      };
    }

    /* squares */
    const base = randInt(2, grade <= 4 ? 9 : 15);
    return {
      topic: 'power', type: 'numeric', grade,
      questionEn: `${base}² = ?`,
      questionVi: `${base} bình phương bằng bao nhiêu?`,
      answer: base * base,
      explanation: {
        en: `${base}² means ${base} × ${base} = ${base * base}.`,
        vi: `${base}² nghĩa là ${base} × ${base} = ${base * base}.`
      },
      hint: `Multiply ${base} by itself.`
    };
  }

  /* ---------- FRACTIONS ---------- */
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  function reduceFrac(n, d) {
    const g = gcd(Math.abs(n), Math.abs(d));
    return [n / g, d / g];
  }
  function fracStr(n, d) {
    if (d === 1) return `${n}`;
    return `${n}/${d}`;
  }

  function generateFraction(grade) {
    /* simple operations: prefer same denominator or small denominators */
    const ops = ['+', '-', '*'];
    if (grade >= 5) ops.push('/');
    const op = pick(ops);

    let n1, d1, n2, d2;
    if (op === '+' || op === '-') {
      /* same denominator for grade 4, mixed for grade 5 */
      d1 = pick([2, 3, 4, 5, 6, 8]);
      d2 = grade >= 5 && Math.random() < 0.5 ? pick([2, 3, 4, 6, 8]) : d1;
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d2 - 1);
      if (op === '-') {
        /* ensure positive result: n1/d1 >= n2/d2 */
        if (n1 * d2 < n2 * d1) { [n1, d1, n2, d2] = [n2, d2, n1, d1]; }
      }
    } else if (op === '*') {
      d1 = pick([2, 3, 4, 5]);
      d2 = pick([2, 3, 4, 5]);
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d2 - 1);
    } else {
      d1 = pick([2, 3, 4]);
      d2 = pick([2, 3, 4]);
      n1 = randInt(1, d1 - 1);
      n2 = randInt(1, d2 - 1);
    }

    let rn, rd;
    if (op === '+') { rn = n1 * d2 + n2 * d1; rd = d1 * d2; }
    else if (op === '-') { rn = n1 * d2 - n2 * d1; rd = d1 * d2; }
    else if (op === '*') { rn = n1 * n2; rd = d1 * d2; }
    else { rn = n1 * d2; rd = d1 * n2; }

    [rn, rd] = reduceFrac(rn, rd);
    const opSym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
    const opVi = { '+': 'cộng', '-': 'trừ', '*': 'nhân', '/': 'chia' }[op];

    return {
      topic: 'fraction', type: 'fraction', grade,
      answerType: 'fraction',
      questionEn: `${n1}/${d1} ${opSym} ${n2}/${d2} = ?`,
      questionVi: `${n1}/${d1} ${opVi} ${n2}/${d2} bằng bao nhiêu?`,
      answer: fracStr(rn, rd),
      answerNumerator: rn,
      answerDenominator: rd,
      explanation: {
        en: `${n1}/${d1} ${opSym} ${n2}/${d2} = ${fracStr(rn, rd)}.`,
        vi: `${n1}/${d1} ${opVi} ${n2}/${d2} = ${fracStr(rn, rd)}.`
      },
      hint: `Write your answer as numerator/denominator (e.g. 3/4). Reduce to simplest form.`
    };
  }

  /* ---------- DECIMALS ---------- */
  function round1(x) { return Math.round(x * 10) / 10; }
  function round2(x) { return Math.round(x * 100) / 100; }

  function generateDecimal(grade) {
    const ops = ['+', '-', '*'];
    const op = pick(ops);
    let a, b, ans;

    if (op === '+' || op === '-') {
      /* one decimal place */
      a = round1(randInt(10, grade <= 4 ? 99 : 199) / 10);
      b = round1(randInt(10, grade <= 4 ? 99 : 199) / 10);
      if (op === '-' && b > a) [a, b] = [b, a];
      ans = op === '+' ? round1(a + b) : round1(a - b);
    } else {
      /* multiplication: decimal × integer */
      a = round1(randInt(11, grade <= 4 ? 50 : 99) / 10);
      b = randInt(2, grade <= 4 ? 5 : 9);
      ans = round1(a * b);
    }

    const opSym = { '+': '+', '-': '−', '*': '×' }[op];
    const opVi = { '+': 'cộng', '-': 'trừ', '*': 'nhân' }[op];

    return {
      topic: 'decimal', type: 'decimal', grade,
      answerType: 'decimal',
      questionEn: `${a} ${opSym} ${b} = ?`,
      questionVi: `${a} ${opVi} ${b} bằng bao nhiêu?`,
      answer: ans,
      explanation: {
        en: `${a} ${opSym} ${b} = ${ans}.`,
        vi: `${a} ${opVi} ${b} = ${ans}.`
      },
      hint: `Line up the decimal points carefully.`
    };
  }

  /* ---------- ORDER OF OPERATIONS (BODMAS) ---------- */
  function generateBodmas(grade) {
    /* Patterns:
       1) a + b × c
       2) a × b - c
       3) (a + b) × c
       4) a × (b - c)
    */
    const pattern = pick(grade <= 4 ? [1, 2, 3] : [1, 2, 3, 4]);
    const small = grade <= 4 ? 9 : 12;
    let a = randInt(2, small), b = randInt(2, small), c = randInt(2, small);
    let questionEn, questionVi, answer;

    if (pattern === 1) {
      answer = a + b * c;
      questionEn = `${a} + ${b} × ${c} = ?`;
      questionVi = `${a} + ${b} × ${c} bằng bao nhiêu?`;
    } else if (pattern === 2) {
      /* ensure positive */
      while (a * b <= c) { a = randInt(2, small); b = randInt(2, small); c = randInt(2, small); }
      answer = a * b - c;
      questionEn = `${a} × ${b} − ${c} = ?`;
      questionVi = `${a} × ${b} − ${c} bằng bao nhiêu?`;
    } else if (pattern === 3) {
      answer = (a + b) * c;
      questionEn = `(${a} + ${b}) × ${c} = ?`;
      questionVi = `(${a} + ${b}) × ${c} bằng bao nhiêu?`;
    } else {
      if (c >= b) [b, c] = [Math.max(b, c), Math.min(b, c)];
      if (b === c) c = Math.max(1, b - 1);
      answer = a * (b - c);
      questionEn = `${a} × (${b} − ${c}) = ?`;
      questionVi = `${a} × (${b} − ${c}) bằng bao nhiêu?`;
    }

    return {
      topic: 'bodmas', type: 'numeric', grade,
      questionEn, questionVi, answer,
      explanation: {
        en: `Remember BODMAS — Brackets, Orders, Division/Multiplication, Addition/Subtraction. Answer: ${answer}.`,
        vi: `Nhớ thứ tự: ngoặc → nhân/chia → cộng/trừ. Đáp án: ${answer}.`
      },
      hint: `Do brackets first, then × and ÷, then + and −.`
    };
  }

  /* ---------- NUMBER PATTERNS (skip counting / arithmetic sequence) ---------- */
  function generatePattern(grade) {
    const maxStep = grade <= 2 ? 5 : grade <= 4 ? 10 : 15;
    const step = randInt(2, maxStep);
    const start = randInt(1, grade <= 2 ? 10 : 30);
    const seq = [start, start + step, start + 2 * step, start + 3 * step];
    const next = start + 4 * step;
    return {
      topic: 'pattern', type: 'numeric', grade,
      questionEn: `What comes next? ${seq.join(', ')}, ?`,
      questionVi: `Số tiếp theo là gì? ${seq.join(', ')}, ?`,
      answer: next,
      explanation: {
        en: `Each number goes up by ${step}. After ${seq[3]} comes ${seq[3]} + ${step} = ${next}.`,
        vi: `Mỗi số tăng thêm ${step}. Sau ${seq[3]} là ${seq[3]} + ${step} = ${next}.`
      },
      hint: `Find the difference between two numbers in a row.`
    };
  }

  /* ---------- PLACE VALUE ---------- */
  function generatePlaceValue(grade) {
    const places = grade <= 2
      ? [{ key: 'tens', en: 'tens', vi: 'hàng chục', factor: 10 },
         { key: 'ones', en: 'ones', vi: 'hàng đơn vị', factor: 1 }]
      : grade <= 3
        ? [{ key: 'hundreds', en: 'hundreds', vi: 'hàng trăm', factor: 100 },
           { key: 'tens', en: 'tens', vi: 'hàng chục', factor: 10 },
           { key: 'ones', en: 'ones', vi: 'hàng đơn vị', factor: 1 }]
        : [{ key: 'thousands', en: 'thousands', vi: 'hàng nghìn', factor: 1000 },
           { key: 'hundreds', en: 'hundreds', vi: 'hàng trăm', factor: 100 },
           { key: 'tens', en: 'tens', vi: 'hàng chục', factor: 10 },
           { key: 'ones', en: 'ones', vi: 'hàng đơn vị', factor: 1 }];
    const num = grade <= 2 ? randInt(11, 99) : grade <= 3 ? randInt(100, 999) : randInt(1000, 9999);
    const place = pick(places);
    const digit = Math.floor(num / place.factor) % 10;
    return {
      topic: 'placevalue', type: 'numeric', grade,
      questionEn: `In ${num}, what digit is in the ${place.en} place?`,
      questionVi: `Trong số ${num}, chữ số nào ở ${place.vi}?`,
      answer: digit,
      explanation: {
        en: `In ${num}, the ${place.en} digit is ${digit}.`,
        vi: `Trong số ${num}, chữ số ở ${place.vi} là ${digit}.`
      },
      hint: `Read the number and look at the ${place.en} column.`
    };
  }

  /* ---------- COMPARISON (>, <, =) — answer encoded as -1, 0, 1 ---------- */
  function generateComparison(grade) {
    const max = grade <= 2 ? 50 : grade <= 3 ? 500 : 9999;
    const a = randInt(1, max);
    let b;
    /* ~20% chance of equality */
    if (Math.random() < 0.2) b = a;
    else b = randInt(1, max);
    const ans = a > b ? '>' : a < b ? '<' : '=';
    const ansLabel = ans === '>' ? 1 : ans === '<' ? -1 : 0;
    return {
      topic: 'comparison', type: 'choice', grade,
      answerType: 'comparison',
      choices: ['<', '=', '>'],
      questionEn: `Compare: ${a} ___ ${b}`,
      questionVi: `So sánh: ${a} ___ ${b}`,
      answer: ans,
      answerLabel: ansLabel,
      explanation: {
        en: `${a} ${ans} ${b} because ${a} is ${ans === '>' ? 'bigger than' : ans === '<' ? 'smaller than' : 'equal to'} ${b}.`,
        vi: `${a} ${ans} ${b} vì ${a} ${ans === '>' ? 'lớn hơn' : ans === '<' ? 'nhỏ hơn' : 'bằng'} ${b}.`
      },
      hint: `Compare digit by digit from the left.`
    };
  }

  /* ---------- ROUNDING ---------- */
  function generateRounding(grade) {
    const tos = grade <= 3 ? [{ to: 10, en: 'ten', vi: 'hàng chục' }]
                           : [{ to: 10, en: 'ten', vi: 'hàng chục' },
                              { to: 100, en: 'hundred', vi: 'hàng trăm' },
                              { to: 1000, en: 'thousand', vi: 'hàng nghìn' }];
    const t = pick(tos);
    const num = randInt(t.to + 5, t.to * 99);
    const rounded = Math.round(num / t.to) * t.to;
    return {
      topic: 'rounding', type: 'numeric', grade,
      questionEn: `Round ${num} to the nearest ${t.en}.`,
      questionVi: `Làm tròn ${num} đến ${t.vi}.`,
      answer: rounded,
      explanation: {
        en: `${num} rounds to ${rounded}. Look at the digit just below the ${t.en} place: 5 or more rounds up, less than 5 rounds down.`,
        vi: `${num} làm tròn thành ${rounded}. Nhìn chữ số ngay sau ${t.vi}: từ 5 trở lên làm tròn lên, dưới 5 làm tròn xuống.`
      },
      hint: `5 hoặc lớn hơn → làm tròn lên. Dưới 5 → làm tròn xuống.`
    };
  }

  function fillTemplate(template, slots) {
    let out = template;
    for (const k in slots) {
      out = out.replace(new RegExp(`{${k}}`, 'g'), slots[k]);
    }
    return out;
  }

  function generateWordProblem(grade, opFilter) {
    const candidates = WORD_PROBLEMS.filter(p =>
      p.grades.includes(grade) && (!opFilter || p.op === opFilter)
    );
    if (candidates.length === 0) return generateAddition(grade);

    const tpl = pick(candidates);
    const [min, max] = rangeForGrade(grade, tpl.op);

    let x, y;
    if (tpl.op === '/') {
      y = randInt(2, Math.max(2, Math.min(max, 5)));
      const result = randInt(2, max);
      x = y * result;
    } else if (tpl.op === '-') {
      x = randInt(min + 5, max);
      y = randInt(min, x - 1);
    } else if (tpl.op === '*') {
      x = randInt(min, max);
      y = randInt(min, max);
    } else {
      x = randInt(min, max);
      y = randInt(min, max);
    }

    const name = pick(NAMES);
    let name2 = pick(NAMES);
    while (name2 === name) name2 = pick(NAMES);
    const item = pick(ITEMS);

    const slots = {
      name, name2,
      x, y,
      item: item.en,
      item_vi: item.vi
    };

    let answer;
    switch (tpl.op) {
      case '+': answer = x + y; break;
      case '-': answer = x - y; break;
      case '*': answer = x * y; break;
      case '/': answer = x / y; break;
    }

    const opName = { '+': 'addition', '-': 'subtraction', '*': 'multiplication', '/': 'division' }[tpl.op];
    const opVi = { '+': 'cộng', '-': 'trừ', '*': 'nhân', '/': 'chia' }[tpl.op];

    return {
      topic: opName,
      type: 'wordProblem',
      grade,
      item: item,
      questionEn: fillTemplate(tpl.en, slots),
      questionVi: fillTemplate(tpl.vi, slots),
      answer,
      explanation: {
        en: `${x} ${tpl.op} ${y} = ${answer}`,
        vi: `${x} ${opVi} ${y} = ${answer}`
      },
      hint: `Find the numbers in the question and apply ${TOPICS[opName].name.toLowerCase()}.`
    };
  }

  /* Dispatch — chooses word problem 30% of the time */
  function generate(topic, grade, opts = {}) {
    const isWordProblem = opts.wordProblem !== undefined
      ? opts.wordProblem
      : Math.random() < 0.3;

    if (isWordProblem) {
      const opMap = { addition: '+', subtraction: '-', multiplication: '*', division: '/' };
      return generateWordProblem(grade, opMap[topic]);
    }

    switch (topic) {
      case 'addition':       return generateAddition(grade);
      case 'subtraction':    return generateSubtraction(grade);
      case 'multiplication': return generateMultiplication(grade);
      case 'division':       return generateDivision(grade);
      case 'power':          return generatePower(grade);
      case 'fraction':       return generateFraction(grade);
      case 'decimal':        return generateDecimal(grade);
      case 'bodmas':         return generateBodmas(grade);
      case 'pattern':        return generatePattern(grade);
      case 'placevalue':     return generatePlaceValue(grade);
      case 'comparison':     return generateComparison(grade);
      case 'rounding':       return generateRounding(grade);
      default:               return generateAddition(grade);
    }
  }

  window.Generators = {
    randInt, pick,
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision,
    power: generatePower,
    fraction: generateFraction,
    decimal: generateDecimal,
    bodmas: generateBodmas,
    pattern: generatePattern,
    placevalue: generatePlaceValue,
    comparison: generateComparison,
    rounding: generateRounding,
    wordProblem: generateWordProblem,
    generate
  };
})();
