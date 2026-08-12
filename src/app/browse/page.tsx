import { CategoryPill } from "@/components/QuestionLink";
import { getCategories } from "@/lib/questions";

export const metadata = {
  title: "Browse topics",
  description: "Explore technology question categories on AnswerKit.",
};

export default function BrowsePage() {
  const categories = getCategories();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">Browse topics</h1>
      <p className="page-lead">
        {categories.reduce((n, c) => n + c.count, 0).toLocaleString()} questions
        across {categories.length} categories. Start with a topic, then open a
        question page.
      </p>
      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryPill key={cat.slug} name={cat.name} count={cat.count} />
        ))}
      </div>
    </div>
  );
}
