import Link from "next/link";
import { getWinners } from "@/lib/winners";

export const metadata = {
  title: "Priority questions",
  description:
    "Highest-opportunity technology questions ranked by estimated search demand, commercial value, and rankability.",
};

export default function WinnersPage() {
  const winners = getWinners();

  return (
    <div className="shell browse-page">
      <h1 className="page-title">Priority questions</h1>
      <p className="page-lead">
        {winners.length} cleaned opportunities from the 10,000-question seed list,
        ranked by volume × commercial value × ease (inverse competition). These are
        the first pages to generate and review — not bulk AI spam.
      </p>

      <div className="question-list">
        {winners.map((w) => (
          <Link key={w.slug} href={`/q/${w.slug}`} className="question-link">
            <span className="question-link-title">
              #{w.rank} · {w.question}
            </span>
            <span className="question-link-meta">
              {w.category} · score {w.priorityScore} · {w.monetizationType}
              {" · "}
              {w.suggestedTool}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
