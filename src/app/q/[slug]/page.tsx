import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnswerArticle } from "@/components/AnswerArticle";
import { getPublishedSlugs, isPublished } from "@/lib/answers";
import { getAnswer } from "@/lib/content";
import {
  getPublishedQuestionBySlug,
  getPublishedRelatedQuestions,
} from "@/lib/questions";

type Props = {
  params: Promise<{ slug: string }>;
};

/** Only published answers are built at deploy time. Others render on first visit. */
export function generateStaticParams() {
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isPublished(slug)) return { title: "Not found" };

  const question = getPublishedQuestionBySlug(slug);
  if (!question) return { title: "Question not found" };

  const answer = getAnswer(slug);
  const description = answer?.directAnswer ?? `Clear answer to: ${question.question}`;

  return {
    title: question.question,
    description,
    robots: { index: true, follow: true },
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
  if (!isPublished(slug)) notFound();

  const question = getPublishedQuestionBySlug(slug);
  if (!question) notFound();

  const answer = getAnswer(slug);
  if (!answer) notFound();

  const related = getPublishedRelatedQuestions(question, 8);

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
