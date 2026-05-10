// MathSprout — Trigger button for opening the Sprout AI assistant modal.
// Two variants: 'primary' (filled green, prominent) and 'ghost' (subtle hint).

export function SproutButton({
  className = '',
  variant = 'primary',
  children,
  ...rest
}) {
  const base = variant === 'ghost' ? 'sprout-btn-ghost' : 'sprout-btn-primary';
  return (
    <button type="button" className={`${base} ${className}`} {...rest}>
      <span className="sprout-mascot" aria-hidden="true">🌱</span>
      <span>{children}</span>
    </button>
  );
}
