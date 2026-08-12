type Props = {
  size?: number;
  className?: string;
};

/** Question mark → clear answer beam. Visual metaphor for Clarify. */
export function BrandLogo({ size = 32, className = "" }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="url(#brand-bg)" />
      {/* Question hook */}
      <path
        d="M11 12.5c0-2.2 1.8-4 4-4s4 1.8 4 4c0 1.5-.8 2.8-2 3.5-.8.5-1.3 1.2-1.3 2"
        stroke="#a8e635"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="15" cy="22" r="1.25" fill="#a8e635" />
      {/* Answer beam / clarity ray */}
      <path
        d="M20 8l7 8-7 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <defs>
        <linearGradient id="brand-bg" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d7a63" />
          <stop offset="1" stopColor="#085242" />
        </linearGradient>
      </defs>
    </svg>
  );
}
