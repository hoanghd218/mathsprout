// MathSprout — Core 4-operation generators (+, −, ×, ÷).
// Range expands by grade so the same generator covers grades 1-5.

import { randInt } from './utils.js';

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

export { rangeForGrade };

export function generateAddition(grade) {
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

export function generateSubtraction(grade) {
  const [min, max] = rangeForGrade(grade, '-');
  let a = randInt(min, max);
  let b = randInt(min, max);
  if (b > a) [a, b] = [b, a];
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

export function generateMultiplication(grade) {
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
    hint: 'Multiplication is repeated addition!'
  };
}

export function generateDivision(grade) {
  const [min, max] = rangeForGrade(grade, '/');
  const b = randInt(min, max);
  const result = randInt(min, max);
  const a = b * result;
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
