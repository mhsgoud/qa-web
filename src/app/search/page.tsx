import type { Metadata } from "next";
import { QuestionLink } from "@/components/QuestionLink";
import { SearchBox } from "@/components/SearchBox";
import { searchQuestions } from "@/lib/questions";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export const metadata: Metadata = {
  title: "Search",
  description: "Search AnswerKit’s technology question library.",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const results = searchQuestions(q, 40);

  return (
    <div className="shell search-page">
      <h1 className="page-title">Search</h1>
      <p className="page-lead">Find a question, then open the answer page.</p>
      <SearchBox initialQuery={q} large />

      <div style={{ marginTop: "1.75rem" }}>
        {q ? (
          results.length > 0 ? (
            <>
              <p className="page-lead">
                {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
              </p>
              <div className="question-list">
                {results.map((item) => (
                  <QuestionLink key={item.slug} question={item} />
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              No matches for “{q}”. Try fewer words or a category name like
              WiFi, GPUs, or Windows.
            </div>
          )
        ) : (
          <div className="empty-state">Type a question or keyword above.</div>
        )}
      </div>
    </div>
  );
}
