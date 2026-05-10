// MathSprout — Analog clock SVG used by 'time' questions.
// Hour hand rotates 30°/hour + 0.5°/minute. Minute hand rotates 6°/minute.

export function ClockDisplay({ hour, minute, size = 180 }) {
  const minuteAngle = minute * 6;
  const hourAngle = (hour % 12) * 30 + minute * 0.5;

  // Number positions: i=0 → "12" at top, then clockwise.
  const labels = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className="mx-auto block"
      role="img"
      aria-label={`Clock showing ${hour}:${String(minute).padStart(2, '0')}`}
    >
      <circle cx="100" cy="100" r="92" fill="#FEF3C7" stroke="#92400E" strokeWidth="4" />

      {labels.map((n, i) => {
        const a = (i * 30 - 90) * Math.PI / 180;
        const x = 100 + 76 * Math.cos(a);
        const y = 100 + 76 * Math.sin(a);
        return (
          <text
            key={n}
            x={x}
            y={y + 5}
            textAnchor="middle"
            fontSize="15"
            fontWeight="800"
            fill="#92400E"
          >
            {n}
          </text>
        );
      })}

      {/* Hour hand (short, dark) */}
      <line
        x1="100" y1="100" x2="100" y2="58"
        stroke="#1F2937" strokeWidth="6" strokeLinecap="round"
        transform={`rotate(${hourAngle} 100 100)`}
      />
      {/* Minute hand (long, red) */}
      <line
        x1="100" y1="100" x2="100" y2="32"
        stroke="#EF4444" strokeWidth="4" strokeLinecap="round"
        transform={`rotate(${minuteAngle} 100 100)`}
      />
      <circle cx="100" cy="100" r="6" fill="#1F2937" />
    </svg>
  );
}
