"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  initialQuery?: string;
  large?: boolean;
  hero?: boolean;
  inputId?: string;
  placeholder?: string;
  buttonLabel?: string;
  showIcon?: boolean;
};

export function SearchBox({
  initialQuery = "",
  large = false,
  hero = false,
  inputId = "site-search",
  placeholder = "Ask a tech question…",
  buttonLabel = "Search",
  showIcon = false,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const classes = ["search-box", large && "search-box-lg", hero && "search-box-hero"]
    .filter(Boolean)
    .join(" ");

  return (
    <form className={classes} onSubmit={onSubmit} role="search">
      <label className="sr-only" htmlFor={inputId}>
        Search questions
      </label>
      {showIcon ? (
        <span className="search-box-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      ) : null}
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
}
