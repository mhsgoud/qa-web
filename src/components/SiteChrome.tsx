import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
import { SearchBox } from "@/components/SearchBox";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/winners", label: "Answers" },
  { href: "/search", label: "Search" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <BrandLogo variant="header" priority />
        </Link>
        <nav className="header-nav desktop-only" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-search desktop-only">
          <SearchBox
            inputId="header-search"
            placeholder="Search answers…"
            buttonLabel="Go"
          />
        </div>
        <MobileNav />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div className="footer-col footer-brand-col">
          <BrandLogo variant="footer" />
          <p className="footer-note">{SITE.description}</p>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Explore</p>
          <div className="footer-links">
            <Link href="/browse">Browse topics</Link>
            <Link href="/winners">All answers</Link>
            <Link href="/search">Search</Link>
          </div>
        </div>
        <div className="footer-col">
          <p className="footer-heading">Library</p>
          <div className="footer-links">
            <Link href="/category/smartphones">Smartphones</Link>
            <Link href="/category/storage">Storage</Link>
            <Link href="/category/windows">Windows</Link>
            <Link href="/category/wifi">Wi‑Fi</Link>
          </div>
        </div>
        <p className="footer-meta">
          © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
