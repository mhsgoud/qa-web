import { SearchBox } from "@/components/SearchBox";

export function AskFallback() {
  return (
    <section className="home-ask shell" aria-labelledby="ask-title">
      <div className="ask-card">
        <h2 id="ask-title">Can&apos;t find your answer?</h2>
        <p>
          Ask your technology question and we&apos;ll search the library — or tell you if an answer is
          on the way.
        </p>
        <SearchBox
          large
          hero
          inputId="ask-fallback-search"
          placeholder="What are you trying to do?"
          buttonLabel="Ask AnswerKit"
        />
      </div>
    </section>
  );
}
