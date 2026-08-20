import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestionLink } from "@/components/QuestionLink";
import {
  getPublishedCategories,
  getPublishedCategoryName,
  getPublishedQuestionsByCategory,
} from "@/lib/questions";

type Props = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return getPublishedCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const name = getPublishedCategoryName(category);
  if (!name) return { title: "Category not found" };
  return {
    title: `${name} questions`,
    description: `Practical ${name} questions and answers on AnswerKit.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const name = getPublishedCategoryName(category);
  if (!name) notFound();

  const questions = getPublishedQuestionsByCategory(category);

  return (
    <div className="shell category-page">
      <p className="page-back">
        <Link href="/browse">← All topics</Link>
      </p>
      <h1 className="page-title">{name}</h1>
      <p className="page-lead">
        Practical {name} questions and answers, listed by priority.
      </p>
      <div className="question-list">
        {questions.map((q) => (
          <QuestionLink key={q.slug} question={q} />
        ))}
      </div>
    </div>
  );
}
