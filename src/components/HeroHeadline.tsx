export function HeroHeadline() {
  return (
    <h1 className="hero-headline">
      <span className="hero-headline-line hero-headline-q">
        You ask the question<span className="hero-headline-mark">?</span>
      </span>

      <span className="hero-headline-bridge" aria-hidden="true">
        <span className="hero-headline-bridge-line" />
        <svg viewBox="0 0 16 16" fill="none" className="hero-headline-bridge-arrow">
          <path
            d="M3 8h8M9 5l3 3-3 3"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="hero-headline-line hero-headline-a">
        We give you the <em>answer</em>.
      </span>
    </h1>
  );
}
