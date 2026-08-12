import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnswerArticle } from "@/components/AnswerArticle";
import { isIndexable, getPublishedSlugs } from "@/lib/answers";
import { getAnswer, getPlaceholderAnswer } from "@/lib/content";
import {
  getQuestionBySlug,
  getRelatedQuestions,
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
  const question = getQuestionBySlug(slug);
  if (!question) return { title: "Question not found" };

  const answer = getAnswer(slug);
  const description =
    answer?.directAnswer ??
    `Clear answer to: ${question.question}`;

  const indexable = isIndexable(slug);

  return {
    title: question.question,
    description,
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
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
