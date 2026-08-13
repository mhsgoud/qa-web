import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getAnswer } from "@/lib/content";
import { getFeaturedPublishedQuestion, getPublishedQuestions } from "@/lib/questions";
import { SITE } from "@/lib/site";

export function HomeHero() {
  const question = getFeaturedPublishedQuestion();
  const answer = question ? getAnswer(question.slug) : undefined;
  const firstStep = answer?.steps?.[0];
  const tryLinks = getPublishedQuestions().slice(0, 3);

  return (
    <section className="home-hero">
      <div className="home-hero-glow" aria-hidden />
      <div className="home-hero-grid-bg" aria-hidden />
      <div className="shell home-hero-grid">
        <div className="home-hero-copy">
          <p className="section-kicker home-hero-kicker">Technology Q&amp;A</p>
          <h1 className="home-hero-title">
            <span>{SITE.hero.line1}</span>
            <span className="home-hero-title-accent">{SITE.hero.line2}</span>
          </h1>
          <p className="home-hero-subhead">{SITE.hero.subhead}</p>

          <div className="home-hero-search">
            <SearchBox
              large
              hero
              showIcon
              placeholder="Ask a technology question…"
              buttonLabel="Search"
            />
          </div>

          {tryLinks.length > 0 ? (
            <div className="home-try">
              <span className="home-try-label">Try</span>
              <ul className="home-try-list">
                {tryLinks.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/q/${item.slug}`} className="home-try-chip">
                      {item.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {question && answer ? (
          <aside className="home-hero-visual" aria-label="Example answer">
            <div className="hero-answer">
              <div className="hero-answer-chrome" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <div className="hero-answer-top">
                <span className="hero-answer-live">Example</span>
                <span className="hero-answer-cat">{question.category}</span>
              </div>
              <h2 className="hero-answer-q">{question.question}</h2>
              <div className="hero-answer-direct">
                <p className="hero-answer-label">Short answer</p>
                <p className="hero-answer-text">{answer.directAnswer}</p>
              </div>
              {firstStep ? (
                <div className="hero-answer-step">
                  <span>1</span>
                  <div>
                    <strong>{firstStep.title}</strong>
                    <p>{firstStep.detail}</p>
                  </div>
                </div>
              ) : null}
              <Link href={`/q/${question.slug}`} className="hero-answer-link">
                See full answer →
              </Link>
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}
