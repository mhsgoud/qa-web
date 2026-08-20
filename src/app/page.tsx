import { AnswerPreview } from "@/components/home/AnswerPreview";
import { AskFallback } from "@/components/home/AskFallback";
import { BrowseTopics } from "@/components/home/BrowseTopics";
import { HomeHero } from "@/components/home/HomeHero";
import { PopularQuestions } from "@/components/home/PopularQuestions";
import { WhyAnswerKit } from "@/components/home/WhyAnswerKit";
import {
  getPublishedCategories,
  getPublishedQuestionsByPriority,
} from "@/lib/questions";

export default function HomePage() {
  const categories = getPublishedCategories().slice(0, 12);
  const popular = getPublishedQuestionsByPriority(16);

  return (
    <>
      <HomeHero />
      <WhyAnswerKit />
      <AnswerPreview />
      <BrowseTopics categories={categories} />
      {popular.length > 0 ? <PopularQuestions questions={popular} /> : null}
      <AskFallback />
    </>
  );
}
