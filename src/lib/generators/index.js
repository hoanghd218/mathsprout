// MathSprout — Question generator dispatcher.
// Public API: `generate(topic, grade, opts)` plus re-exports for direct use.

import { generateAddition, generateSubtraction, generateMultiplication, generateDivision } from './core-arithmetic.js';
import { generateWordProblem } from './word-problems.js';
import { generateComparison } from './comparison.js';
import { generateCounting } from './counting.js';
import { generateTime } from './time.js';
import { generateMoney } from './money.js';
import { generateMeasurement } from './measurement.js';
import { generateGeometry } from './geometry.js';
import { generateFractions } from './fractions.js';

export { randInt, pick, gcd, simplifyFraction } from './utils.js';
export {
  generateAddition,
  generateSubtraction,
  generateMultiplication,
  generateDivision
} from './core-arithmetic.js';
export { generateWordProblem } from './word-problems.js';
export { generateComparison } from './comparison.js';
export { generateCounting } from './counting.js';
export { generateTime } from './time.js';
export { generateMoney } from './money.js';
export { generateMeasurement } from './measurement.js';
export { generateGeometry } from './geometry.js';
export { generateFractions } from './fractions.js';

const TOPIC_GENERATORS = {
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
  division: generateDivision,
  comparison: generateComparison,
  counting: generateCounting,
  time: generateTime,
  money: generateMoney,
  measurement: generateMeasurement,
  geometry: generateGeometry,
  fractions: generateFractions
};

const ARITHMETIC_TOPICS = ['addition', 'subtraction', 'multiplication', 'division'];

/**
 * Build one question for the given topic + grade.
 * For arithmetic topics, ~30% chance of being a word-problem variant.
 */
export function generate(topic, grade, opts = {}) {
  const useWordProblem = ARITHMETIC_TOPICS.includes(topic) && (
    opts.wordProblem !== undefined ? opts.wordProblem : Math.random() < 0.3
  );

  if (useWordProblem) {
    const opMap = { addition: '+', subtraction: '-', multiplication: '*', division: '/' };
    const wp = generateWordProblem(grade, opMap[topic]);
    if (wp) return wp;
  }

  const fn = TOPIC_GENERATORS[topic] || TOPIC_GENERATORS.addition;
  return fn(grade);
}
