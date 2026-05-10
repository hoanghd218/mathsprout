// MathSprout — Text input primitive. (React 19: ref is a regular prop)

export function TextInput({ className = '', ref, ...rest }) {
  return <input ref={ref} className={`input-text ${className}`} {...rest} />;
}
