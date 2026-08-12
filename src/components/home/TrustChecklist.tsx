import { HOME_TRUST_ITEMS } from "@/lib/site";

export function TrustChecklist() {
  return (
    <section className="home-trust" aria-labelledby="trust-title">
      <div className="shell">
        <div className="home-section-intro">
          <h2 id="trust-title">Answers you can actually trust</h2>
          <p className="home-section-lead">
            Every AnswerKit page is reviewed before publication — so you get clarity, not generic AI filler.
          </p>
        </div>

        <ul className="trust-checklist">
          {HOME_TRUST_ITEMS.map((item) => (
            <li key={item}>
              <span className="trust-check" aria-hidden="true">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
