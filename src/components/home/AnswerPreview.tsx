import Link from "next/link";
import { getAnswer } from "@/lib/content";
import { getQuestionBySlug } from "@/lib/questions";
import { HOME_PREVIEW_SLUG } from "@/lib/site";

export function AnswerPreview() {
  const question = getQuestionBySlug(HOME_PREVIEW_SLUG);
  const answer = getAnswer(HOME_PREVIEW_SLUG);

  if (!question || !answer) return null;

  const steps = answer.steps?.slice(0, 4) ?? [];
  const caveat = answer.caveats?.[0];

  return (
    <section className="home-preview" aria-labelledby="answer-preview-title">
      <div className="shell">
        <div className="home-section-intro">
          <h2 id="answer-preview-title">See an AnswerKit answer</h2>
          <p className="home-section-lead">
            Every page puts the answer first, then steps and caveats — not a wall of filler.
          </p>
        </div>

        <article className="preview-card">
          <header className="preview-header">
            <p className="eyebrow">{question.category}</p>
            <h3 className="preview-question">{question.question}</h3>
          </header>

          <section className="preview-block preview-direct">
            <p className="preview-label">Short answer</p>
            <p className="preview-direct-text">{answer.directAnswer}</p>
          </section>

          {steps.length > 0 ? (
            <section className="preview-block">
              <p className="preview-label">How to check</p>
              <ol className="preview-steps">
                {steps.map((step, i) => (
                  <li key={step.title}>
                    <strong>{i + 1}. {step.title}</strong>
                    <span>{step.detail}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {caveat ? (
            <section className="preview-block preview-caveat">
              <p className="preview-label">Important</p>
              <p>{caveat}</p>
            </section>
          ) : null}

          <footer className="preview-footer">
            <Link href={`/q/${HOME_PREVIEW_SLUG}`} className="preview-cta">
              Read the full answer →
            </Link>
          </footer>
        </article>
      </div>
    </section>
  );
}
