import { AnswerPreview } from "@/components/home/AnswerPreview";
import { AskFallback } from "@/components/home/AskFallback";
import { BrowseTopics } from "@/components/home/BrowseTopics";
import { CompareSection } from "@/components/home/CompareSection";
import { HomeHero } from "@/components/home/HomeHero";
import { PopularQuestions } from "@/components/home/PopularQuestions";
import { TrustChecklist } from "@/components/home/TrustChecklist";
import { WhyAnswerKit } from "@/components/home/WhyAnswerKit";
import { getPublishedCategories, getPublishedQuestions } from "@/lib/questions";

const POPULAR_SLUGS = [
  "how-do-i-free-up-storage-on-my-phone",
];

function getPopularQuestions() {
  const published = getPublishedQuestions();
  const publishedSlugs = new Set(published.map((q) => q.slug));

  const picked = POPULAR_SLUGS.map((slug) =>
    publishedSlugs.has(slug) ? published.find((q) => q.slug === slug) : undefined,
  ).filter((q): q is NonNullable<typeof q> => Boolean(q));

  if (picked.length >= 6) return picked.slice(0, 8);

  for (const q of published) {
    if (picked.length >= 8) break;
    if (!picked.some((p) => p.slug === q.slug)) picked.push(q);
  }

  return picked;
}

export default function HomePage() {
  const categories = getPublishedCategories();
  const popular = getPopularQuestions();
  const answerCount = getPublishedQuestions().length;

  return (
    <>
      <HomeHero />
      <WhyAnswerKit />
      <AnswerPreview />
      <BrowseTopics
        categories={categories}
        topicCount={categories.length}
        questionCount={answerCount}
      />
      {popular.length > 0 ? <PopularQuestions questions={popular} /> : null}
      <CompareSection />
      <TrustChecklist />
      <AskFallback />
    </>
  );
}
