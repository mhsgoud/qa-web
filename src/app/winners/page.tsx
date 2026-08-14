import Link from "next/link";
import { QuestionLink } from "@/components/QuestionLink";
import {
  getPublishedCategories,
  getPublishedQuestionsByPriority,
} from "@/lib/questions";

export const metadata = {
  title: "All answers",
  description: "Browse published technology answers on AnswerKit, ranked by priority.",
};

export default function WinnersPage() {
  const questions = getPublishedQuestionsByPriority();
  const categories = getPublishedCategories();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">All answers</h1>
      <p className="page-lead">
        {questions.length.toLocaleString()} published answer
        {questions.length === 1 ? "" : "s"} across {categories.length} topics,
        ordered by search demand. Prefer a topic?{" "}
        <Link href="/browse">Browse by category</Link>.
      </p>

      {questions.length > 0 ? (
        <div className="question-list">
          {questions.map((q) => (
            <QuestionLink key={q.slug} question={q} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          No published answers yet.{" "}
          <Link href="/browse">Browse topics</Link> will list them here as they go
          live.
        </div>
      )}
    </div>
  );
}
