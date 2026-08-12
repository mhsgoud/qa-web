import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnswerArticle } from "@/components/AnswerArticle";
import { getAnswer, getPlaceholderAnswer } from "@/lib/content";
import {
  getAllQuestions,
  getQuestionBySlug,
  getRelatedQuestions,
} from "@/lib/questions";
import { getWinnerSlugs } from "@/lib/winners";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const winnerSlugs = new Set(getWinnerSlugs());
  const winners = getAllQuestions()
    .filter((q) => winnerSlugs.has(q.slug))
    .map((q) => ({ slug: q.slug }));

  // Ensure winners are built first; pad with early catalog pages if needed
  const extras = getAllQuestions()
    .filter((q) => !winnerSlugs.has(q.slug))
    .slice(0, Math.max(0, 500 - winners.length))
    .map((q) => ({ slug: q.slug }));

  return [...winners, ...extras];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) return { title: "Question not found" };

  const answer = getAnswer(slug);
  const description =
    answer?.directAnswer ??
    `Clear answer to: ${question.question}`;

  const isDraft = !answer || answer.status === "draft";

  return {
    title: question.question,
    description,
    robots: isDraft ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: question.question,
      description,
      type: "article",
    },
    alternates: {
      canonical: `/q/${question.slug}`,
    },
  };
}

export default async function QuestionPage({ params }: Props) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  const answer = getAnswer(slug) ?? {
    ...getPlaceholderAnswer(question.question),
    slug,
  };
  const related = getRelatedQuestions(question, 8);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: question.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: answer.directAnswer,
        },
      },
      ...(answer.faqs ?? []).map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    ],
  };

  return (
    <div className="answer-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnswerArticle question={question} answer={answer} related={related} />
    </div>
  );
}
