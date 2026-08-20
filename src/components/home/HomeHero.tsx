import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SearchBox } from "@/components/SearchBox";
import { getPublishedQuestionsByPriority } from "@/lib/questions";
import { SITE } from "@/lib/site";

function shortLabel(question: string) {
  return question.replace(/^How do I /i, "").replace(/\?$/, "");
}

export function HomeHero() {
  const tryLinks = getPublishedQuestionsByPriority(6).slice(0, 3);

  return (
    <section className="home-hero">
      <div className="home-hero-atmosphere" aria-hidden>
        <div className="home-hero-glow" />
        <div className="home-hero-plane" />
      </div>

      <div className="shell home-hero-inner">
        <div className="home-hero-brand">
          <BrandLogo variant="hero" priority />
        </div>

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
          <p className="home-hero-examples">
            <span className="home-hero-examples-label">Examples:</span>
            {tryLinks.map((item, i) => (
              <span key={item.slug}>
                {i > 0 ? <span className="home-hero-examples-sep" aria-hidden>·</span> : null}
                <Link href={`/q/${item.slug}`}>{shortLabel(item.question)}</Link>
              </span>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
