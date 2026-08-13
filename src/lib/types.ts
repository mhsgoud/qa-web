export type SearchIntent = "Informational" | "How-to" | string;
export type ContentType = "Explainer" | "How-to guide" | string;

export type Question = {
  id: number;
  category: string;
  question: string;
  intent: SearchIntent;
  slug: string;
  suggestedContentType: ContentType;
};

export type AnswerSection = {
  id: string;
  heading: string;
  body: string;
};

export type AnswerStep = {
  title: string;
  detail: string;
};

export type AnswerFaq = {
  question: string;
  answer: string;
};

export type AnswerImage = {
  id: string;
  /** Public URL path, e.g. /answers/{slug}/{id}.png */
  src: string;
  alt: string;
  caption?: string;
  /** "hero", "step-0", "step-1", or a section id */
  attachTo?: string;
};

export type AnswerContent = {
  slug: string;
  /** One-sentence featured answer — keep specific, not filler */
  directAnswer: string;
  summary: string;
  sections: AnswerSection[];
  steps?: AnswerStep[];
  faqs?: AnswerFaq[];
  images?: AnswerImage[];
  caveats?: string[];
  relatedToolIdeas?: string[];
  status: "draft" | "reviewed" | "published";
  updatedAt: string;
};
