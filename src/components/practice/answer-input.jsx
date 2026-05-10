// MathSprout — Dispatches the right answer-entry widget based on question.type:
//   'numeric'      → number input (default — also used for wordProblem)
//   'choice'       → buttons (used by 'comparison')
//   'time'         → clock display + H:MM text input
//   'fraction'     → two-input fraction widget

import { TextInput } from '../ui/input.jsx';
import { ChoiceButton } from '../ui/button.jsx';
import { ClockDisplay } from './clock-display.jsx';
import { FractionInput } from './fraction-input.jsx';

export function AnswerInput({ question, value, onChange, onEnter, inputRef }) {
  const type = question?.type || 'numeric';

  if (type === 'choice') {
    return (
      <div className="flex gap-3 justify-center mt-2">
        {question.choices.map((c) => (
          <ChoiceButton
            key={c}
            type="button"
            selected={value === c}
            onClick={() => onChange(c)}
            className="text-3xl px-6 py-4 min-w-[68px]"
          >
            {c}
          </ChoiceButton>
        ))}
      </div>
    );
  }

  if (type === 'fraction') {
    return (
      <FractionInput
        value={value}
        onChange={onChange}
        onEnter={onEnter}
        inputRef={inputRef}
      />
    );
  }

  if (type === 'time') {
    return (
      <div className="flex flex-col items-center gap-3">
        {question.clock && (
          <ClockDisplay hour={question.clock.hour} minute={question.clock.minute} />
        )}
        <TextInput
          ref={inputRef}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          placeholder="3:30"
          className="answer-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
        />
      </div>
    );
  }

  // default: numeric
  return (
    <TextInput
      ref={inputRef}
      type="number"
      inputMode="numeric"
      autoComplete="off"
      className="answer-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onEnter?.()}
    />
  );
}

/**
 * Validate that the user has entered something usable for this question type.
 * Returns null if OK, or an error message string.
 */
export function validateAnswer(question, value) {
  const type = question?.type || 'numeric';
  const v = String(value ?? '').trim();

  if (type === 'choice') {
    if (!question.choices.includes(v)) return 'Hãy chọn một dấu / Pick a symbol';
    return null;
  }
  if (type === 'fraction') {
    const m = v.match(/^(-?\d+)\/(-?\d+)$/);
    if (!m || m[2] === '0') return 'Hãy nhập phân số n/d / Enter a fraction n/d';
    return null;
  }
  if (type === 'time') {
    if (!/^\d{1,2}:\d{2}$/.test(v)) return 'Nhập theo dạng H:MM / Enter as H:MM';
    return null;
  }
  if (!v) return 'Hãy nhập đáp án / Please enter an answer';
  return null;
}
