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
            <h2 id="popular-title">Popular tech questions</h2>
            <p className="section-sub">Published answers people are looking for.</p>
          </div>
          <Link href="/browse" className="section-link">
            See more →
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
