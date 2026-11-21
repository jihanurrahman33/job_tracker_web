export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-display text-xl leading-none ${className}`}
    >
      {/* Three stage bars, the last one marked: the same mark as the favicon */}
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="7" fill="#12263A" />
        <rect
          x="0.5"
          y="0.5"
          width="31"
          height="31"
          rx="6.5"
          fill="none"
          stroke="#F2F4F3"
          strokeOpacity="0.3"
        />
        <rect x="7" y="7.5" width="9" height="4.5" rx="1" fill="#F2F4F3" />
        <rect x="7" y="13.75" width="14" height="4.5" rx="1" fill="#F2F4F3" />
        <rect x="7" y="20" width="18" height="4.5" rx="1" fill="#FFD84A" />
      </svg>
      JobTracker
    </span>
  );
}
