import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatusBadge } from "@/components/StatusBadge";
import type { AnswerContent, Question } from "@/lib/types";
import { categoryToSlug } from "@/lib/questions";
import { QuestionLink } from "./QuestionLink";

type Props = {
  question: Question;
  answer: AnswerContent;
  related: Question[];
};

export function AnswerArticle({ question, answer, related }: Props) {
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
            <div className="answer-header-top">
              <p className="eyebrow">{question.category}</p>
              <StatusBadge status={answer.status} />
            </div>
            <h1>{question.question}</h1>
            <p className="answer-meta">
              {question.suggestedContentType} · Updated {answer.updatedAt}
            </p>
          </header>

          <section className="direct-answer card-elevated" aria-label="Direct answer">
            <p className="direct-answer-label">Quick answer</p>
            <p className="direct-answer-text">{answer.directAnswer}</p>
          </section>

          <p className="answer-summary">{answer.summary}</p>

          {answer.steps && answer.steps.length > 0 ? (
            <section className="answer-section card" id="steps">
              <h2>Steps</h2>
              <ol className="step-list">
                {answer.steps.map((step, i) => (
                  <li key={step.title}>
                    <span className="step-index">{i + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          {answer.sections.map((section) => (
            <section key={section.id} className="answer-section card" id={section.id}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          {answer.caveats && answer.caveats.length > 0 ? (
            <section className="answer-section card card-warn" id="caveats">
              <h2>Watch out for</h2>
              <ul>
                {answer.caveats.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {answer.faqs && answer.faqs.length > 0 ? (
            <section className="answer-section" id="faq">
              <h2>FAQ</h2>
              <div className="faq-list">
                {answer.faqs.map((faq) => (
                  <details key={faq.question} className="faq-item">
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {answer.relatedToolIdeas && answer.relatedToolIdeas.length > 0 ? (
            <section className="answer-section tool-teaser">
              <h2>Coming soon</h2>
              <ul>
                {answer.relatedToolIdeas.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
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
