import Link from "next/link";
import { QuestionLink } from "@/components/QuestionLink";
import { getPublishedQuestions } from "@/lib/questions";

export const metadata = {
  title: "Popular answers",
  description: "Published technology answers on AnswerKit.",
};

export default function WinnersPage() {
  const questions = getPublishedQuestions();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">Popular answers</h1>
      <p className="page-lead">
        {questions.length} published answer{questions.length === 1 ? "" : "s"} on
        AnswerKit right now. More are added as they are written and reviewed.
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
