export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 font-display text-xl leading-none ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <path d="M2 2h13l5 5v13H2z" fill="currentColor" />
        <path d="M15 2v5h5z" fill="#FFD84A" />
        <path
          d="M6 11h10M6 15h7"
          stroke="#F2F4F3"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      JobTracker
    </span>
  );
}
