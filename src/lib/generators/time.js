// MathSprout — Read the analog clock. Grades 2-5.
// Question type: 'time' — answer is "H:MM" string. Practice page renders ClockDisplay.

import { randInt, pick } from './utils.js';

export function generateTime(grade) {
  // Grade 2: hour and half-hour. Grade 3: quarters. Grade 4-5: 5-min intervals.
  let minute;
  if (grade <= 2) minute = pick([0, 30]);
  else if (grade <= 3) minute = pick([0, 15, 30, 45]);
  else minute = randInt(0, 11) * 5;

  const hour = randInt(1, 12);
  const timeStr = `${hour}:${String(minute).padStart(2, '0')}`;

  const minutePhraseEn =
    minute === 0   ? `o'clock` :
    minute === 15  ? `quarter past ${hour}` :
    minute === 30  ? `half past ${hour}` :
    minute === 45  ? `quarter to ${hour === 12 ? 1 : hour + 1}` :
    `${minute} minutes past ${hour}`;

  return {
    topic: 'time',
    type: 'time',
    grade,
    questionEn: `What time is it?  (Type as H:MM, e.g. 3:30)`,
    questionVi: `Mấy giờ rồi?  (Nhập H:MM, ví dụ 3:30)`,
    clock: { hour, minute },
    answer: timeStr,
    explanation: {
      en: `The hour hand points near ${hour} and the minute hand at ${minute}. So it is ${timeStr} (${minutePhraseEn}).`,
      vi: `Kim giờ ở gần số ${hour}, kim phút chỉ ${minute} phút. Vậy là ${timeStr}.`
    },
    hint: 'Short hand → hours.  Long hand → minutes.'
  };
}
