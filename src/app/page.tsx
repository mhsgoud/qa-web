import { AnswerPreview } from "@/components/home/AnswerPreview";
import { AskFallback } from "@/components/home/AskFallback";
import { BrowseTopics } from "@/components/home/BrowseTopics";
import { CompareSection } from "@/components/home/CompareSection";
import { HomeHero } from "@/components/home/HomeHero";
import { PopularQuestions } from "@/components/home/PopularQuestions";
import { TrustChecklist } from "@/components/home/TrustChecklist";
import { WhyAnswerKit } from "@/components/home/WhyAnswerKit";
import { getAllQuestions, getCategories, getQuestionBySlug } from "@/lib/questions";
import { getTopWinners } from "@/lib/winners";

const POPULAR_SLUGS = [
  "how-do-i-connect-a-monitor-to-a-laptop",
  "how-do-i-remove-an-apple-id-from-an-iphone",
  "how-do-i-scan-a-qr-code-with-my-phone",
  "how-do-i-fix-a-phone-that-keeps-restarting",
  "how-do-i-clone-an-ssd",
  "how-do-i-check-if-my-gpu-is-bottlenecked",
  "how-do-i-free-up-storage-on-my-phone",
  "why-is-my-wifi-slow",
];

function getPopularQuestions() {
  const picked = POPULAR_SLUGS.map((slug) => getQuestionBySlug(slug)).filter(
    (q): q is NonNullable<typeof q> => Boolean(q),
  );

  if (picked.length >= 6) return picked.slice(0, 8);

  const winners = getTopWinners(8)
    .map((w) => getQuestionBySlug(w.slug))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  const seen = new Set(picked.map((q) => q.slug));
  for (const q of winners) {
    if (picked.length >= 8) break;
    if (!seen.has(q.slug)) {
      picked.push(q);
      seen.add(q.slug);
    }
  }

  return picked;
}

export default function HomePage() {
  const categories = getCategories();
  const popular = getPopularQuestions();

  return (
    <>
      <HomeHero />
      <WhyAnswerKit />
      <AnswerPreview />
      <BrowseTopics
        categories={categories}
        topicCount={categories.length}
        questionCount={getAllQuestions().length}
      />
      <PopularQuestions questions={popular} />
      <CompareSection />
      <TrustChecklist />
      <AskFallback />
    </>
  );
}
