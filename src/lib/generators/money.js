// MathSprout — Money (Vietnamese đồng). Add up bills/coins. Grades 2-5.
// Question type: 'numeric' — student types the total in đồng (digits only).

import { randInt, pick } from './utils.js';

export function generateMoney(grade) {
  // Available denominations grow by grade.
  const denoms =
    grade <= 2 ? [1000, 2000, 5000] :
    grade <= 3 ? [1000, 2000, 5000, 10000] :
    [1000, 2000, 5000, 10000, 20000, 50000, 100000];

  const itemCount = grade <= 2 ? randInt(2, 3) : randInt(2, 4);
  const items = [];
  let total = 0;
  for (let i = 0; i < itemCount; i++) {
    const v = pick(denoms);
    items.push(v);
    total += v;
  }

  const itemsStr = items.map((v) => `${v.toLocaleString('vi-VN')}đ`).join(' + ');
  const sumExpr = items.join(' + ');

  return {
    topic: 'money',
    type: 'numeric',
    grade,
    questionEn: `How much in total?  ${itemsStr}  =  ?`,
    questionVi: `Tổng số tiền là bao nhiêu?  ${itemsStr}  =  ?`,
    answer: total,
    explanation: {
      en: `Add the amounts: ${sumExpr} = ${total}đ.`,
      vi: `Cộng các tờ tiền lại: ${sumExpr} = ${total}đ.`
    },
    hint: 'Add up all the amounts. Type the total number (no đ symbol).'
  };
}
