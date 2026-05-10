// MathSprout — Bilingual word-problem generator using fillable templates
// from data/topics.js (WORD_PROBLEMS, NAMES, ITEMS).

import { NAMES, ITEMS, WORD_PROBLEMS, TOPICS } from '../../data/topics.js';
import { randInt, pick } from './utils.js';
import { rangeForGrade } from './core-arithmetic.js';

function fillTemplate(template, slots) {
  let out = template;
  for (const k in slots) {
    out = out.replace(new RegExp(`{${k}}`, 'g'), slots[k]);
  }
  return out;
}

const OP_TO_TOPIC = { '+': 'addition', '-': 'subtraction', '*': 'multiplication', '/': 'division' };
const OP_TO_VI = { '+': 'cộng', '-': 'trừ', '*': 'nhân', '/': 'chia' };

export function generateWordProblem(grade, opFilter) {
  const candidates = WORD_PROBLEMS.filter((p) =>
    p.grades.includes(grade) && (!opFilter || p.op === opFilter)
  );
  if (candidates.length === 0) return null;

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

  const slots = { name, name2, x, y, item: item.en, item_vi: item.vi };

  let answer;
  switch (tpl.op) {
    case '+': answer = x + y; break;
    case '-': answer = x - y; break;
    case '*': answer = x * y; break;
    case '/': answer = x / y; break;
    default:  answer = 0;
  }

  const opName = OP_TO_TOPIC[tpl.op];
  const opVi = OP_TO_VI[tpl.op];

  return {
    topic: opName,
    type: 'wordProblem',
    grade,
    item,
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
