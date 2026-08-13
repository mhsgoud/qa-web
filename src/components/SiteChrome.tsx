import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { MobileNav } from "@/components/MobileNav";
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
        <div className="footer-col footer-links">
          <Link href="/browse">Browse topics</Link>
          <Link href="/winners">All answers</Link>
          <Link href="/search">Search</Link>
        </div>
        <p className="footer-meta">
          © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}
        </p>
      </div>
    </footer>
  );
}
