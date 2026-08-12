"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  initialQuery?: string;
  large?: boolean;
};

export function SearchBox({ initialQuery = "", large = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      className={`search-box ${large ? "search-box-lg" : ""}`}
      onSubmit={onSubmit}
      role="search"
    >
      <label className="sr-only" htmlFor="site-search">
        Search questions
      </label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask a tech question…"
        autoComplete="off"
      />
      <button type="submit">Search</button>
    </form>
  );
}
