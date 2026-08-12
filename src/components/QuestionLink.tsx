import Link from "next/link";
import type { Question } from "@/lib/types";
import { categoryToSlug } from "@/lib/questions";

const CATEGORY_COLORS: Record<string, string> = {
  Smartphones: "#3b82f6",
  Windows: "#6366f1",
  macOS: "#8b5cf6",
  WiFi: "#0ea5e9",
  GPUs: "#f59e0b",
  Storage: "#10b981",
  Monitors: "#ec4899",
  Security: "#ef4444",
  EVs: "#14b8a6",
  "PC Hardware": "#64748b",
};

function categoryColor(name: string) {
  return CATEGORY_COLORS[name] ?? "#0d7a63";
}

export function QuestionLink({ question }: { question: Question }) {
  const color = categoryColor(question.category);
  return (
    <Link href={`/q/${question.slug}`} className="question-link">
      <span className="question-link-row">
        <span className="category-dot" style={{ background: color }} aria-hidden />
        <span className="question-link-title">{question.question}</span>
      </span>
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
  const color = categoryColor(name);
  return (
    <Link href={`/category/${categoryToSlug(name)}`} className="category-pill">
      <span className="category-dot" style={{ background: color }} aria-hidden />
      <span>{name}</span>
      {typeof count === "number" ? <span className="pill-count">{count}</span> : null}
    </Link>
  );
}
