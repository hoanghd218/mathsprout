// MathSprout — Skip counting: "5, 10, 15, ?, 25". Grades 1-2.
// Question type: 'numeric' — student fills the missing number.

import { randInt, pick } from './utils.js';

export function generateCounting(grade) {
  const steps = grade <= 1 ? [1, 2, 5] : [2, 5, 10];
  const step = pick(steps);
  const start = randInt(1, 5) * step;

  // Sequence of 5 numbers; the 4th is the missing one.
  const seq = [start, start + step, start + 2 * step, '?', start + 4 * step];
  const answer = start + 3 * step;

  return {
    topic: 'counting',
    type: 'numeric',
    grade,
    questionEn: `Count by ${step}:  ${seq.join(',  ')}`,
    questionVi: `Đếm nhảy ${step}:  ${seq.join(',  ')}`,
    answer,
    explanation: {
      en: `Each step adds ${step}, so the missing number is ${start + 2 * step} + ${step} = ${answer}.`,
      vi: `Mỗi bước cộng thêm ${step}, vậy số còn thiếu là ${start + 2 * step} + ${step} = ${answer}.`
    },
    hint: `Add ${step} to the previous number.`
  };
}
