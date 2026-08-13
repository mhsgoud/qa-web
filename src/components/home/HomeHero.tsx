import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { getAnswer } from "@/lib/content";
import {
  getFeaturedPublishedQuestion,
  getPublishedQuestionsByPriority,
} from "@/lib/questions";
import { SITE } from "@/lib/site";

type Props = {
  answerCount: number;
  topicCount: number;
};

function shortLabel(question: string) {
  return question.replace(/^How do I /i, "").replace(/\?$/, "");
}

export function HomeHero({ answerCount, topicCount }: Props) {
  const question = getFeaturedPublishedQuestion();
  const answer = question ? getAnswer(question.slug) : undefined;
  const firstStep = answer?.steps?.[0];
  const tryLinks = getPublishedQuestionsByPriority(4).filter(
    (q) => q.slug !== question?.slug,
  ).slice(0, 3);

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

          {answerCount > 0 ? (
            <p className="home-hero-stats">
              <Link href="/winners">{answerCount.toLocaleString()} answers</Link>
              <span aria-hidden>·</span>
              <Link href="/browse">
                {topicCount} {topicCount === 1 ? "topic" : "topics"}
              </Link>
            </p>
          ) : null}

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
                      {shortLabel(item.question)}
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
                <span className="hero-answer-live">Featured</span>
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
