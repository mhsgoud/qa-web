import Link from "next/link";

type Category = { name: string; slug: string; count?: number };

type Props = {
  categories: Category[];
};

export function BrowseTopics({ categories }: Props) {
  return (
    <section className="home-topics" aria-labelledby="browse-topics-title">
      <div className="shell">
        <div className="home-topics-head">
          <div>
            <p className="section-kicker">Library</p>
            <h2 id="browse-topics-title">Browse by topic</h2>
            <p className="home-section-lead">
              Jump into a category and find the fix you need.
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
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
