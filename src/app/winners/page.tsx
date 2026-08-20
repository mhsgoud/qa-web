import Link from "next/link";
import { QuestionLink } from "@/components/QuestionLink";
import { getPublishedQuestionsByPriority } from "@/lib/questions";

export const metadata = {
  title: "All answers",
  description: "Browse published technology answers on AnswerKit, ranked by priority.",
};

export default function WinnersPage() {
  const questions = getPublishedQuestionsByPriority();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">All answers</h1>
      <p className="page-lead">
        Practical tech answers, ordered by search demand. Prefer a topic?{" "}
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
          Nothing here yet.{" "}
          <Link href="/browse">Browse topics</Link> when answers go live.
        </div>
      )}
    </div>
  );
}
