interface StarsProps {
  value: number;
  className?: string;
  size?: number;
}

const STAR =
  "M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z";

/** Read-only star row. Filled stars use the current text colour. */
export function Stars({ value, className = "", size = 18 }: StarsProps) {
  const filled = Math.round(value);
  return (
    <span
      className={`inline-flex gap-0.5 ${className}`}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={STAR}
            fill="currentColor"
            fillOpacity={i <= filled ? 1 : 0.22}
          />
        </svg>
      ))}
    </span>
  );
}
