const PARTS = [
  {
    title: "Short answer",
    body: "The solution in one or two sentences at the top of the page.",
  },
  {
    title: "Steps",
    body: "Numbered actions you can follow — settings paths, apps, and platform notes when they matter.",
  },
  {
    title: "Caveats & FAQ",
    body: "What can go wrong, and the follow-up questions people usually ask next.",
  },
] as const;

export function WhyAnswerKit() {
  return (
    <section className="home-why" aria-labelledby="why-answerkit-title">
      <div className="shell">
        <div className="home-why-head">
          <p className="section-kicker">How it works</p>
          <h2 id="why-answerkit-title">Every page is built the same way</h2>
          <p>
            Each answer starts with the fix, then the steps — not a stack of search
            results or a forum thread.
          </p>
        </div>

        <ol className="benefit-list">
          {PARTS.map((item, i) => (
            <li key={item.title}>
              <span className="benefit-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
