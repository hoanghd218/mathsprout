// MathSprout — Compare numbers (<, =, >). Grades 1-3.
// Question type: 'choice' — student picks from 3 buttons.

import { randInt } from './utils.js';

export function generateComparison(grade) {
  const max = grade <= 1 ? 20 : grade <= 2 ? 100 : 1000;
  const a = randInt(1, max);
  // 20% of the time force equality (otherwise too rare with random pairs).
  const b = Math.random() < 0.2 ? a : randInt(1, max);

  const correct = a > b ? '>' : a < b ? '<' : '=';
  const correctEn = correct === '>' ? 'greater than' : correct === '<' ? 'less than' : 'equal to';
  const correctVi = correct === '>' ? 'lớn hơn' : correct === '<' ? 'nhỏ hơn' : 'bằng';

  return {
    topic: 'comparison',
    type: 'choice',
    grade,
    questionEn: `Which symbol fits?  ${a}  __  ${b}`,
    questionVi: `Dấu nào đúng?  ${a}  __  ${b}`,
    choices: ['<', '=', '>'],
    answer: correct,
    explanation: {
      en: `${a} ${correct} ${b} because ${a} is ${correctEn} ${b}.`,
      vi: `${a} ${correct} ${b} vì ${a} ${correctVi} ${b}.`
    },
    hint: 'The wider end of the symbol points to the bigger number.'
  };
}
