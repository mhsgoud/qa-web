import Link from "next/link";
import { CategoryPill } from "@/components/QuestionLink";
import { getPublishedCategories, getPublishedQuestions } from "@/lib/questions";

export const metadata = {
  title: "Browse topics",
  description: "Explore technology question categories on AnswerKit.",
};

export default function BrowsePage() {
  const categories = getPublishedCategories();
  const answerCount = getPublishedQuestions().length;

  return (
    <div className="shell browse-page">
      <h1 className="page-title">Browse topics</h1>
      <p className="page-lead">
        {answerCount.toLocaleString()} published answer
        {answerCount === 1 ? "" : "s"} across {categories.length}{" "}
        {categories.length === 1 ? "topic" : "topics"}. Pick a topic, or{" "}
        <Link href="/winners">see every answer</Link> in priority order.
      </p>
      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryPill key={cat.slug} name={cat.name} count={cat.count} />
        ))}
      </div>
    </div>
  );
}
