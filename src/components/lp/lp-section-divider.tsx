type LpSectionDividerProps = {
  className?: string;
};

export function LpSectionDivider({ className = "" }: LpSectionDividerProps) {
  return (
    <div className={`relative w-full ${className}`.trim()} aria-hidden="true">
      <svg
        viewBox="0 0 1440 72"
        preserveAspectRatio="none"
        className="block h-10 w-full sm:h-12 lg:h-14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lp-section-divider-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-orange)" />
            <stop offset="48%" stopColor="var(--brand-blue)" />
            <stop offset="100%" stopColor="var(--brand-cyan)" />
          </linearGradient>
          <filter id="lp-section-divider-glow" x="-20%" y="-200%" width="140%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lp-section-divider-ambient" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <path
          d="M -40 52 Q 720 10 1480 52"
          fill="none"
          stroke="url(#lp-section-divider-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.35"
          filter="url(#lp-section-divider-ambient)"
        />
        <path
          d="M -40 52 Q 720 10 1480 52"
          fill="none"
          stroke="url(#lp-section-divider-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#lp-section-divider-glow)"
        />
      </svg>
    </div>
  );
}
