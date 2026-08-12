import Link from "next/link";
import type { Question } from "@/lib/types";
import { categoryToSlug } from "@/lib/questions";

export function QuestionLink({ question }: { question: Question }) {
  return (
    <Link href={`/q/${question.slug}`} className="question-link">
      <span className="question-link-title">{question.question}</span>
      <span className="question-link-meta">
        {question.category} · {question.intent}
      </span>
    </Link>
  );
}

export function CategoryPill({
  name,
  count,
}: {
  name: string;
  count?: number;
}) {
  return (
    <Link href={`/category/${categoryToSlug(name)}`} className="category-pill">
      <span>{name}</span>
      {typeof count === "number" ? <span className="pill-count">{count}</span> : null}
    </Link>
  );
}
