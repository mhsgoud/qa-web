import { BrandLogo } from "./BrandLogo";
import { IconCheck, IconQuickAnswer, IconSearch, IconSteps } from "./Icons";

const STEPS = [
  {
    icon: IconSearch,
    title: "Ask",
    body: "Search a real tech question — the way people type it into Google.",
  },
  {
    icon: IconQuickAnswer,
    title: "Answer",
    body: "Get a direct answer up top, then steps, caveats, and FAQs below.",
  },
  {
    icon: IconSteps,
    title: "Act",
    body: "Follow platform-specific steps to fix, set up, or decide what to buy.",
  },
  {
    icon: IconCheck,
    title: "Done",
    body: "Leave with clarity — not a wall of generic filler.",
  },
];

export function HowItWorks() {
  return (
    <section className="shell how-it-works" aria-labelledby="how-it-works-title">
      <div className="section-head">
        <div>
          <h2 id="how-it-works-title">Question → clear answer</h2>
          <p className="section-sub">Every page follows the same useful structure.</p>
        </div>
      </div>
      <ol className="flow-steps">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <li key={step.title} className="flow-step">
              <div className="flow-step-icon-wrap">
                <Icon className="flow-step-icon" />
                <span className="flow-step-num">{i + 1}</span>
              </div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
              {i < STEPS.length - 1 ? <span className="flow-connector" aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function TrustStrip() {
  return (
    <section className="shell trust-strip" aria-label="What makes Clarify different">
      <div className="trust-item">
        <BrandLogo size={28} />
        <div>
          <strong>Direct first</strong>
          <span>The answer is visible before you scroll.</span>
        </div>
      </div>
      <div className="trust-item">
        <span className="trust-dot trust-dot-review" />
        <div>
          <strong>Human reviewed</strong>
          <span>AI drafts are checked before publish.</span>
        </div>
      </div>
      <div className="trust-item">
        <span className="trust-dot trust-dot-seo" />
        <div>
          <strong>Built for search</strong>
          <span>Structured for Google and AI answers.</span>
        </div>
      </div>
    </section>
  );
}
