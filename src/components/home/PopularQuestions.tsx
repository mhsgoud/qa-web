import Link from "next/link";
import { QuestionLink } from "@/components/QuestionLink";
import type { Question } from "@/lib/types";

type Props = {
  questions: Question[];
};

export function PopularQuestions({ questions }: Props) {
  return (
    <section className="home-popular" aria-labelledby="popular-title">
      <div className="shell">
        <div className="section-head">
          <div>
            <p className="section-kicker">Popular</p>
            <h2 id="popular-title">High-demand questions</h2>
            <p className="section-sub">Top answers, ordered by search priority.</p>
          </div>
          <Link href="/winners" className="section-link">
            All answers →
          </Link>
        </div>

        <div className="question-list question-list-cards">
          {questions.map((q) => (
            <QuestionLink key={q.slug} question={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
