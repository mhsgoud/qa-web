import Link from "next/link";
import { CategoryPill } from "@/components/QuestionLink";

type Category = { name: string; slug: string; count: number };

type Props = {
  categories: Category[];
  topicCount: number;
  questionCount: number;
};

export function BrowseTopics({ categories, topicCount, questionCount }: Props) {
  return (
    <section className="shell home-section" aria-labelledby="browse-topics-title">
      <div className="home-section-intro home-section-intro-left">
        <h2 id="browse-topics-title">Browse technology topics</h2>
        <p className="home-section-lead">
          {questionCount.toLocaleString()}+ practical technology answers across {topicCount}+ topics.
          Pick a category to explore questions.
        </p>
      </div>

      <div className="category-grid category-grid-prominent">
        {categories.map((cat) => (
          <CategoryPill key={cat.slug} name={cat.name} count={cat.count} />
        ))}
      </div>

      <p className="home-section-foot">
        <Link href="/browse" className="section-link">
          Browse all topics →
        </Link>
      </p>
    </section>
  );
}
