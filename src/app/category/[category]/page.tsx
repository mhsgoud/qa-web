import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionLink } from "@/components/QuestionLink";
import {
  getCategories,
  getCategoryName,
  getQuestionsByCategory,
} from "@/lib/questions";
import { isHighQualityQuestion } from "@/lib/quality";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = getCategoryName(category);
  if (!name) return { title: "Category not found" };
  return {
    title: `${name} questions`,
    description: `Practical ${name} questions and answers on AnswerKit.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = getCategoryName(category);
  if (!name) notFound();

  const all = getQuestionsByCategory(category);
  const ready = all.filter(isHighQualityQuestion);
  const shown = (ready.length >= 12 ? ready : all).slice(0, 60);

  return (
    <div className="shell category-page">
      <h1 className="page-title">{name}</h1>
      <p className="page-lead">
        Showing {shown.length} of {all.length.toLocaleString()} questions in this
        topic.
      </p>
      <div className="question-list">
        {shown.map((q) => (
          <QuestionLink key={q.slug} question={q} />
        ))}
      </div>
    </div>
  );
}
