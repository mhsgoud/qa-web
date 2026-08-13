import Link from "next/link";

type Category = { name: string; slug: string; count: number };

type Props = {
  categories: Category[];
  topicCount: number;
  questionCount: number;
};

export function BrowseTopics({ categories, topicCount, questionCount }: Props) {
  return (
    <section className="home-topics" aria-labelledby="browse-topics-title">
      <div className="shell">
        <div className="home-topics-head">
          <div>
            <p className="section-kicker">Library</p>
            <h2 id="browse-topics-title">Browse by topic</h2>
            <p className="home-section-lead">
              {questionCount.toLocaleString()} published answer
              {questionCount === 1 ? "" : "s"} across {topicCount}{" "}
              {topicCount === 1 ? "topic" : "topics"}.
            </p>
          </div>
          <Link href="/browse" className="section-link">
            All topics →
          </Link>
        </div>

        {categories.length > 0 ? (
          <ul className="topic-grid">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link href={`/category/${cat.slug}`} className="topic-link">
                  <span className="topic-name">{cat.name}</span>
                  <span className="topic-count">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
