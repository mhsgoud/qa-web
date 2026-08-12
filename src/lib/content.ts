import { getAnswer as getAnswerFromFile } from "./answers";
import type { AnswerContent } from "./types";

export function getAnswer(slug: string): AnswerContent | undefined {
  return getAnswerFromFile(slug);
}

/** Template used when no answer file exists yet. */
export function getPlaceholderAnswer(question: string): AnswerContent {
  return {
    slug: "",
    directAnswer:
      "This answer is being researched. Check back soon for a clear, step-by-step explanation.",
    summary: `We are preparing a practical answer for “${question}” with steps, caveats, and related tools — not a generic copy-paste explainer.`,
    sections: [
      {
        id: "coming",
        heading: "What you will get on this page",
        body: "A direct answer up top, platform-specific steps where relevant, common mistakes, and short FAQs. Content is reviewed for accuracy before it is marked published.",
      },
    ],
    status: "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}
