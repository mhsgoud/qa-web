import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { SearchBox } from "@/components/SearchBox";
import { SITE } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="home-hero">
      <div className="home-hero-media" aria-hidden>
        <Image
          src="/home-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-hero-photo"
        />
        <div className="home-hero-scrim" />
        <div className="home-hero-glow" />
      </div>

      <div className="shell home-hero-inner">
        <Link href="/" className="home-hero-brand" aria-label={SITE.name}>
          <BrandLogo variant="hero" />
        </Link>

        <h1 className="home-hero-title">
          <span>{SITE.hero.line1}</span>{" "}
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
      </div>
    </section>
  );
}
