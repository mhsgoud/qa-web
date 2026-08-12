import { SearchBox } from "@/components/SearchBox";

export function AskFallback() {
  return (
    <section className="home-ask" aria-labelledby="ask-title">
      <div className="shell">
        <div className="ask-panel">
          <h2 id="ask-title">Can&apos;t find your answer?</h2>
          <p>Ask what you&apos;re trying to do — we&apos;ll search the library.</p>
          <SearchBox
            large
            hero
            inputId="ask-fallback-search"
            placeholder="What are you trying to do?"
            buttonLabel="Ask AnswerKit"
          />
        </div>
      </div>
    </section>
  );
}
