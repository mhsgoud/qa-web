import Link from "next/link";
import { MobileNav } from "@/components/MobileNav";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/browse", label: "Browse" },
  { href: "/winners", label: "Priority" },
  { href: "/search", label: "Search" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span className="brand-text">
            <span className="brand-name">{SITE.name}</span>
            <span className="brand-tagline">{SITE.tagline}</span>
          </span>
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
        <div className="footer-col">
          <p className="footer-brand">{SITE.name}</p>
          <p className="footer-note">{SITE.tagline}</p>
        </div>
        <div className="footer-col footer-links">
          <Link href="/browse">Browse topics</Link>
          <Link href="/winners">Priority questions</Link>
          <Link href="/search">Search</Link>
        </div>
        <p className="footer-meta">
          © {new Date().getFullYear()} {SITE.name}. Practical tech answers.
        </p>
      </div>
    </footer>
  );
}
