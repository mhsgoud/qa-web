import Link from "next/link";
import { CategoryPill, QuestionLink } from "@/components/QuestionLink";
import { SearchBox } from "@/components/SearchBox";
import { getAllQuestions, getCategories, getQuestionBySlug } from "@/lib/questions";
import { SITE } from "@/lib/site";
import { getTopWinners, getWinners } from "@/lib/winners";
import { getPublishedCount } from "@/lib/answers";

export default function HomePage() {
  const categories = getCategories().slice(0, 12);
  const winners = getTopWinners(8);
  const featured = winners
    .map((w) => getQuestionBySlug(w.slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const totalQuestions = getAllQuestions().length;
  const priorityCount = getWinners().length;
  const publishedCount = getPublishedCount();

  return (
    <>
      <section className="shell hero">
        <p className="eyebrow">Technology Q&amp;A</p>
        <h1 className="hero-brand">
          Answers that get to the <em>point</em>
        </h1>
        <p className="hero-lead">{SITE.description}</p>

        <div className="hero-stats">
          <div className="stat-chip">
            <span className="stat-value">{totalQuestions.toLocaleString()}</span>
            <span className="stat-label">questions</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{priorityCount}</span>
            <span className="stat-label">priority topics</span>
          </div>
          <div className="stat-chip">
            <span className="stat-value">{publishedCount}</span>
            <span className="stat-label">published</span>
          </div>
        </div>

        <div className="hero-panel">
          <p className="hero-panel-label">Search the library</p>
          <SearchBox large />
          <p className="hero-panel-hint">
            Try &ldquo;clone SSD&rdquo;, &ldquo;WiFi slow&rdquo;, or &ldquo;remove Apple ID&rdquo;
          </p>
        </div>
      </section>

      <section className="shell section">
        <div className="section-head">
          <div>
            <h2>Browse by topic</h2>
            <p className="section-sub">Pick a category to explore questions.</p>
          </div>
          <Link href="/browse" className="section-link">
            All topics →
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategoryPill key={cat.slug} name={cat.name} count={cat.count} />
          ))}
        </div>
      </section>

      <section className="shell section section-last">
        <div className="section-head">
          <div>
            <h2>Popular right now</h2>
            <p className="section-sub">Highest-opportunity questions to answer first.</p>
          </div>
          <Link href="/winners" className="section-link">
            Full list →
          </Link>
        </div>
        <div className="question-list">
          {featured.map((q) => (
            <QuestionLink key={q.slug} question={q} />
          ))}
        </div>
      </section>
    </>
  );
}
