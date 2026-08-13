import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AnswerFigure, imagesForAttach } from "@/components/AnswerFigure";
import { IconFaq, IconSteps, IconWarn } from "@/components/Icons";
import { SectionHeading } from "@/components/SectionHeading";
import { QuestionLink } from "@/components/QuestionLink";
import type { AnswerContent, Question } from "@/lib/types";
import { categoryToSlug } from "@/lib/questions";

type Props = {
  question: Question;
  answer: AnswerContent;
  related: Question[];
};

function Prose({ text }: { text: string }) {
  const parts = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return <p>{text}</p>;
  }

  return (
    <>
      {parts.map((part) => (
        <p key={part.slice(0, 48)}>{part}</p>
      ))}
    </>
  );
}

export function AnswerArticle({ question, answer, related }: Props) {
  const heroImages = imagesForAttach(answer.images, "hero");

  const toc = [
    ...(answer.steps?.length ? [{ id: "steps", label: "Steps" }] : []),
    ...answer.sections.map((s) => ({ id: s.id, label: s.heading })),
    ...(answer.caveats?.length ? [{ id: "caveats", label: "Watch out for" }] : []),
    ...(answer.faqs?.length ? [{ id: "faq", label: "FAQ" }] : []),
  ];

  return (
    <div className="answer-layout">
      <div className="answer-main">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: question.category, href: `/category/${categoryToSlug(question.category)}` },
            { label: question.question },
          ]}
        />

        <article className="answer-article">
          <header className="answer-header">
            <p className="eyebrow">{question.category}</p>
            <h1>{question.question}</h1>
            <p className="answer-meta">Updated {answer.updatedAt}</p>
          </header>

          <section className="direct-answer card-elevated" aria-label="Direct answer">
            <div className="direct-answer-head">
              <span className="direct-answer-badge">✓</span>
              <p className="direct-answer-label">Quick answer</p>
            </div>
            <p className="direct-answer-text">{answer.directAnswer}</p>
          </section>

          {answer.summary ? <p className="answer-summary">{answer.summary}</p> : null}

          {heroImages.map((image) => (
            <AnswerFigure key={image.id} image={image} priority />
          ))}

          {answer.steps && answer.steps.length > 0 ? (
            <section className="answer-section card" id="steps">
              <SectionHeading icon={<IconSteps />}>Steps</SectionHeading>
              <ol className="step-list">
                {answer.steps.map((step, i) => {
                  const stepImages = imagesForAttach(answer.images, `step-${i}`);
                  return (
                    <li key={`${i}-${step.title}`}>
                      <span className="step-index">{i + 1}</span>
                      <div className="step-body">
                        <h3>{step.title}</h3>
                        <Prose text={step.detail} />
                        {stepImages.map((image) => (
                          <AnswerFigure key={image.id} image={image} />
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          {answer.sections.map((section) => {
            const sectionImages = imagesForAttach(answer.images, section.id);
            return (
              <section key={section.id} className="answer-section card" id={section.id}>
                <h2>{section.heading}</h2>
                <div className="answer-prose">
                  <Prose text={section.body} />
                </div>
                {sectionImages.map((image) => (
                  <AnswerFigure key={image.id} image={image} />
                ))}
              </section>
            );
          })}

          {answer.caveats && answer.caveats.length > 0 ? (
            <section className="answer-section card card-warn" id="caveats">
              <SectionHeading icon={<IconWarn />}>Watch out for</SectionHeading>
              <ul>
                {answer.caveats.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {answer.faqs && answer.faqs.length > 0 ? (
            <section className="answer-section" id="faq">
              <SectionHeading icon={<IconFaq />}>FAQ</SectionHeading>
              <div className="faq-list">
                {answer.faqs.map((faq) => (
                  <details key={faq.question} className="faq-item">
                    <summary>{faq.question}</summary>
                    <Prose text={faq.answer} />
                  </details>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>

      {toc.length > 1 ? (
        <aside className="answer-aside desktop-only" aria-label="On this page">
          <p className="aside-title">On this page</p>
          <nav>
            <ul>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      ) : null}

      {related.length > 0 ? (
        <section className="answer-related shell-wide">
          <h2>Related questions</h2>
          <div className="question-list">
            {related.map((q) => (
              <QuestionLink key={q.slug} question={q} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
