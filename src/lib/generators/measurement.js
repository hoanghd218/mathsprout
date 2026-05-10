// MathSprout — Unit conversions (length / weight / volume). Grades 2-5.
// Question type: 'numeric'.

import { randInt, pick } from './utils.js';

const CONVERSIONS = {
  'cm-mm': { factor: 10,   from: 'cm', to: 'mm' },
  'm-cm':  { factor: 100,  from: 'm',  to: 'cm' },
  'kg-g':  { factor: 1000, from: 'kg', to: 'g'  },
  'l-ml':  { factor: 1000, from: 'l',  to: 'ml' }
};

export function generateMeasurement(grade) {
  const kinds =
    grade <= 3 ? ['cm-mm', 'm-cm'] :
    grade <= 4 ? ['cm-mm', 'm-cm', 'kg-g'] :
    ['cm-mm', 'm-cm', 'kg-g', 'l-ml'];

  const kind = pick(kinds);
  const conv = CONVERSIONS[kind];
  const input = randInt(1, grade <= 3 ? 10 : 20);
  const answer = input * conv.factor;

  return {
    topic: 'measurement',
    type: 'numeric',
    grade,
    questionEn: `${input} ${conv.from} = ?  ${conv.to}`,
    questionVi: `${input} ${conv.from} = ?  ${conv.to}`,
    answer,
    explanation: {
      en: `1 ${conv.from} = ${conv.factor} ${conv.to}, so ${input} ${conv.from} = ${input} × ${conv.factor} = ${answer} ${conv.to}.`,
      vi: `1 ${conv.from} = ${conv.factor} ${conv.to}, vậy ${input} ${conv.from} = ${input} × ${conv.factor} = ${answer} ${conv.to}.`
    },
    hint: `Multiply by ${conv.factor}.`
  };
}
