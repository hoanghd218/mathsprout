// MathSprout — Fractions. Grade 4: same-denominator add/subtract.
// Grade 5: multiply fraction by integer (or simplify).
// Question type: 'fraction' — answer encoded as "n/d" string.

import { randInt, pick, simplifyFraction } from './utils.js';

export function generateFractions(grade) {
  if (grade <= 4) return generateSameDenominator(grade);
  return generateMultiplyByInteger(grade);
}

function generateSameDenominator(grade) {
  const den = pick([3, 4, 5, 6, 8, 10]);
  let a = randInt(1, den - 1);
  let b = randInt(1, den - 1);

  if (a + b < den) {
    // addition
    const sum = a + b;
    const ans = simplifyFraction(sum, den);
    return {
      topic: 'fractions', type: 'fraction', grade,
      questionEn: `${a}/${den} + ${b}/${den}  =  ?`,
      questionVi: `${a}/${den} + ${b}/${den}  =  ?`,
      answer: `${ans.n}/${ans.d}`,
      explanation: {
        en: `Same denominator → add the numerators: ${a} + ${b} = ${sum}. So ${sum}/${den} = ${ans.n}/${ans.d}.`,
        vi: `Cùng mẫu số → cộng các tử số: ${a} + ${b} = ${sum}. Vậy ${sum}/${den} = ${ans.n}/${ans.d}.`
      },
      hint: 'Add the top numbers; keep the bottom number.'
    };
  }

  // Switch to subtraction so the result stays a proper fraction.
  if (b > a) [a, b] = [b, a];
  const diff = a - b;
  const ans = simplifyFraction(diff, den);
  return {
    topic: 'fractions', type: 'fraction', grade,
    questionEn: `${a}/${den} − ${b}/${den}  =  ?`,
    questionVi: `${a}/${den} − ${b}/${den}  =  ?`,
    answer: `${ans.n}/${ans.d}`,
    explanation: {
      en: `Same denominator → subtract the numerators: ${a} − ${b} = ${diff}. So ${diff}/${den} = ${ans.n}/${ans.d}.`,
      vi: `Cùng mẫu số → trừ các tử số: ${a} − ${b} = ${diff}. Vậy ${diff}/${den} = ${ans.n}/${ans.d}.`
    },
    hint: 'Subtract the top numbers; keep the bottom number.'
  };
}

function generateMultiplyByInteger(grade) {
  const den = pick([2, 3, 4, 5, 6, 8]);
  const num = randInt(1, den - 1);
  const k = randInt(2, 5);
  const newNum = num * k;
  const ans = simplifyFraction(newNum, den);

  return {
    topic: 'fractions', type: 'fraction', grade,
    questionEn: `${num}/${den}  ×  ${k}  =  ?`,
    questionVi: `${num}/${den}  ×  ${k}  =  ?`,
    answer: `${ans.n}/${ans.d}`,
    explanation: {
      en: `Multiply only the numerator by ${k}: ${num} × ${k} = ${newNum}. So ${newNum}/${den} = ${ans.n}/${ans.d}.`,
      vi: `Chỉ nhân tử số với ${k}: ${num} × ${k} = ${newNum}. Vậy ${newNum}/${den} = ${ans.n}/${ans.d}.`
    },
    hint: 'Multiply only the top number; the bottom stays the same.'
  };
}
