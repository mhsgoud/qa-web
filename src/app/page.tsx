import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { HeroHeadline } from "@/components/HeroHeadline";
import { CategoryPill, QuestionLink } from "@/components/QuestionLink";
import { HowItWorks, TrustStrip } from "@/components/HowItWorks";
import { SearchBox } from "@/components/SearchBox";
import { getCategories, getQuestionBySlug } from "@/lib/questions";
import { SITE } from "@/lib/site";
import { getTopWinners } from "@/lib/winners";

export default function HomePage() {
  const categories = getCategories().slice(0, 12);
  const winners = getTopWinners(8);
  const featured = winners
    .map((w) => getQuestionBySlug(w.slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const topicCount = getCategories().length;

  return (
    <>
      <section className="hero-center">
        <div className="shell hero-center-inner">
          <BrandIcon size={52} className="hero-mark" />
          <p className="eyebrow">Technology Q&amp;A</p>
          <HeroHeadline />
          <p className="hero-lead">{SITE.description}</p>

          <div className="hero-search-wrap">
            <SearchBox large hero />
          </div>

          <p className="hero-meta">
            {topicCount} topics · popular searches below
          </p>

          <div className="hero-chips">
            {winners.slice(0, 5).map((w) => (
              <Link key={w.slug} href={`/q/${w.slug}`} className="hero-chip">
                {w.question}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustStrip />
      <HowItWorks />

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
