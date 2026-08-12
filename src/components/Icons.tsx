type IconProps = { className?: string };

export function IconQuickAnswer({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h10M14 12l-4-4M14 12l-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="19" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconSteps({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 6h16M4 12h10M4 18h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="12" r="2" fill="currentColor" />
      <circle cx="14" cy="18" r="2" fill="currentColor" />
    </svg>
  );
}

export function IconWarn({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 8v5M12 16h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.3 4.5h3.4L20 18a1.5 1.5 0 01-1.3 2.2H5.3A1.5 1.5 0 014 18l5.3-13.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFaq({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 10a4 4 0 118 0c0 2-2 2.5-2 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconSearch({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ className = "section-icon" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12l4 4L19 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
