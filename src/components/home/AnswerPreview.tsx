import Link from "next/link";
import { getAnswer } from "@/lib/content";
import { getFeaturedPublishedQuestion } from "@/lib/questions";
import { isPublished } from "@/lib/answers";

export function AnswerPreview() {
  const question = getFeaturedPublishedQuestion();
  const answer = question ? getAnswer(question.slug) : undefined;

  if (!question || !answer || !isPublished(question.slug)) return null;

  const steps = answer.steps?.slice(0, 3) ?? [];
  const caveat = answer.caveats?.[0];

  return (
    <section className="home-preview" aria-labelledby="answer-preview-title">
      <div className="shell home-preview-layout">
        <div className="home-preview-copy">
          <p className="section-kicker">How an answer looks</p>
          <h2 id="answer-preview-title">Answer first. Then the steps.</h2>
          <p className="home-section-lead">
            Every page puts the solution up top — then instructions and caveats. No 1,500-word intro.
          </p>
          <Link href={`/q/${question.slug}`} className="btn-primary">
            Read a real answer →
          </Link>
        </div>

        <article className="preview-panel">
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
                    <span className="preview-step-num">{i + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <span>{step.detail}</span>
                    </div>
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
        </article>
      </div>
    </section>
  );
}
