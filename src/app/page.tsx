import { AnswerPreview } from "@/components/home/AnswerPreview";
import { AskFallback } from "@/components/home/AskFallback";
import { BrowseTopics } from "@/components/home/BrowseTopics";
import { HomeHero } from "@/components/home/HomeHero";
import { PopularQuestions } from "@/components/home/PopularQuestions";
import { WhyAnswerKit } from "@/components/home/WhyAnswerKit";
import {
  getPublishedCategories,
  getPublishedQuestions,
  getPublishedQuestionsByPriority,
} from "@/lib/questions";

export default function HomePage() {
  const categories = getPublishedCategories().slice(0, 12);
  const popular = getPublishedQuestionsByPriority(16);
  const answerCount = getPublishedQuestions().length;
  const topicCount = getPublishedCategories().length;

  return (
    <>
      <HomeHero answerCount={answerCount} topicCount={topicCount} />
      <WhyAnswerKit answerCount={answerCount} />
      <AnswerPreview />
      <BrowseTopics
        categories={categories}
        topicCount={topicCount}
        questionCount={answerCount}
      />
      {popular.length > 0 ? <PopularQuestions questions={popular} /> : null}
      <AskFallback />
    </>
  );
}
