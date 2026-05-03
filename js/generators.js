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
      default:               return generateAddition(grade);
    }
  }

  window.Generators = {
    randInt, pick,
    addition: generateAddition,
    subtraction: generateSubtraction,
    multiplication: generateMultiplication,
    division: generateDivision,
    wordProblem: generateWordProblem,
    generate
  };
})();
