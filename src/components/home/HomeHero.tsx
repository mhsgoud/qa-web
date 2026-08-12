import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { HOME_TRY_SEARCHES, SITE } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="shell home-hero-inner">
        <h1 className="home-hero-title">
          <span>{SITE.hero.line1}</span>
          <span className="home-hero-title-accent">{SITE.hero.line2}</span>
        </h1>

        <p className="home-hero-subhead">{SITE.hero.subhead}</p>
        <p className="home-hero-detail">{SITE.hero.detail}</p>

        <div className="home-hero-search">
          <SearchBox
            large
            hero
            showIcon
            placeholder="Ask a technology question…"
            buttonLabel="Search"
          />
        </div>

        <div className="home-try">
          <span className="home-try-label">Try:</span>
          <ul className="home-try-list">
            {HOME_TRY_SEARCHES.map((item) => (
              <li key={item.slug}>
                <Link href={`/q/${item.slug}`}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
