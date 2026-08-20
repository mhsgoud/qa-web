import Link from "next/link";
import { CategoryPill } from "@/components/QuestionLink";
import { getPublishedCategories } from "@/lib/questions";

export const metadata = {
  title: "Browse topics",
  description: "Explore technology question categories on AnswerKit.",
};

export default function BrowsePage() {
  const categories = getPublishedCategories();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">Browse topics</h1>
      <p className="page-lead">
        Pick a topic, or <Link href="/winners">see every answer</Link> in one list.
      </p>
      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryPill key={cat.slug} name={cat.name} />
        ))}
      </div>
    </div>
  );
}
