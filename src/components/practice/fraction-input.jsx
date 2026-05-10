// MathSprout — Two-input widget for entering a fraction "n/d".
// The parent stores `value` as a string ("3/4"); this component parses it
// in/out so the rest of the practice flow stays simple.

export function FractionInput({ value, onChange, onEnter, inputRef }) {
  const [num = '', den = ''] = (value || '').split('/');

  function update(newNum, newDen) {
    onChange(`${newNum}/${newDen}`);
  }

  function handleKey(e) {
    if (e.key === 'Enter') onEnter?.();
  }

  return (
    <div className="fraction-input">
      <input
        ref={inputRef}
        type="number"
        inputMode="numeric"
        className="fraction-input-cell"
        value={num}
        onChange={(e) => update(e.target.value, den)}
        onKeyDown={handleKey}
        placeholder="n"
        aria-label="Numerator (top)"
      />
      <div className="fraction-bar" aria-hidden="true" />
      <input
        type="number"
        inputMode="numeric"
        className="fraction-input-cell"
        value={den}
        onChange={(e) => update(num, e.target.value)}
        onKeyDown={handleKey}
        placeholder="d"
        aria-label="Denominator (bottom)"
      />
    </div>
  );
}
