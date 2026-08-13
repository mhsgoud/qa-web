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
        {questions.length} published answer{questions.length === 1 ? "" : "s"},
        ordered by search demand and usefulness. Open any question for a direct
        answer and steps.
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
