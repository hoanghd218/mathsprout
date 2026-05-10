// MathSprout — Geometry: shape recognition (grade 1-2),
// perimeter / area of squares & rectangles (grade 3-5).

import { randInt, pick } from './utils.js';

const SHAPES = [
  { en: 'square',    vi: 'hình vuông',     emoji: '⬜', sides: 4 },
  { en: 'triangle',  vi: 'hình tam giác',  emoji: '🔺', sides: 3 },
  { en: 'circle',    vi: 'hình tròn',      emoji: '⭕', sides: 0 },
  { en: 'rectangle', vi: 'hình chữ nhật',  emoji: '▭', sides: 4 },
  { en: 'pentagon',  vi: 'hình ngũ giác',  emoji: '⬠', sides: 5 },
  { en: 'hexagon',   vi: 'hình lục giác',  emoji: '⬢', sides: 6 }
];

export function generateGeometry(grade) {
  if (grade <= 2) return generateShapeRecognition(grade);
  return generatePerimeterArea(grade);
}

function generateShapeRecognition(grade) {
  // Limit to first 4 shapes for the youngest students.
  const pool = grade <= 1 ? SHAPES.slice(0, 4) : SHAPES;
  const s = pick(pool);
  const cap = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return {
    topic: 'geometry',
    type: 'numeric',
    grade,
    questionEn: `${s.emoji}  How many sides does a ${s.en} have?`,
    questionVi: `${s.emoji}  ${cap(s.vi)} có mấy cạnh?`,
    answer: s.sides,
    explanation: {
      en: `A ${s.en} has ${s.sides} side${s.sides === 1 ? '' : 's'}.`,
      vi: `${cap(s.vi)} có ${s.sides} cạnh.`
    },
    hint: 'Count the straight edges (a circle has 0).'
  };
}

function generatePerimeterArea(grade) {
  const isSquare = Math.random() < 0.5;
  const isPerimeter = Math.random() < 0.5;
  const sideMax = grade <= 3 ? 10 : 30;

  if (isSquare) {
    const s = randInt(2, sideMax);
    if (isPerimeter) {
      return {
        topic: 'geometry', type: 'numeric', grade,
        questionEn: `Square with side ${s} cm.  Perimeter = ?  cm`,
        questionVi: `Hình vuông cạnh ${s} cm.  Chu vi = ?  cm`,
        answer: s * 4,
        explanation: {
          en: `Perimeter of a square = side × 4 = ${s} × 4 = ${s * 4} cm.`,
          vi: `Chu vi hình vuông = cạnh × 4 = ${s} × 4 = ${s * 4} cm.`
        },
        hint: 'A square has 4 equal sides. Multiply side by 4.'
      };
    }
    return {
      topic: 'geometry', type: 'numeric', grade,
      questionEn: `Square with side ${s} cm.  Area = ?  cm²`,
      questionVi: `Hình vuông cạnh ${s} cm.  Diện tích = ?  cm²`,
      answer: s * s,
      explanation: {
        en: `Area of a square = side × side = ${s} × ${s} = ${s * s} cm².`,
        vi: `Diện tích hình vuông = cạnh × cạnh = ${s} × ${s} = ${s * s} cm².`
      },
      hint: 'Multiply side by itself.'
    };
  }

  // Rectangle
  let a = randInt(2, sideMax);
  let b = randInt(2, sideMax);
  if (a === b) b = b + 1; // make sure it's not a square
  if (isPerimeter) {
    return {
      topic: 'geometry', type: 'numeric', grade,
      questionEn: `Rectangle ${a} cm × ${b} cm.  Perimeter = ?  cm`,
      questionVi: `Hình chữ nhật ${a} cm × ${b} cm.  Chu vi = ?  cm`,
      answer: 2 * (a + b),
      explanation: {
        en: `Perimeter = 2 × (length + width) = 2 × (${a} + ${b}) = ${2 * (a + b)} cm.`,
        vi: `Chu vi = 2 × (dài + rộng) = 2 × (${a} + ${b}) = ${2 * (a + b)} cm.`
      },
      hint: 'Add length + width, then multiply by 2.'
    };
  }
  return {
    topic: 'geometry', type: 'numeric', grade,
    questionEn: `Rectangle ${a} cm × ${b} cm.  Area = ?  cm²`,
    questionVi: `Hình chữ nhật ${a} cm × ${b} cm.  Diện tích = ?  cm²`,
    answer: a * b,
    explanation: {
      en: `Area = length × width = ${a} × ${b} = ${a * b} cm².`,
      vi: `Diện tích = dài × rộng = ${a} × ${b} = ${a * b} cm².`
    },
    hint: 'Multiply length by width.'
  };
}
