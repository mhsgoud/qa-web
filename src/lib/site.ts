export const SITE = {
  name: "AnswerKit",
  tagline: "Find answers. Fast.",
  description:
    "Clear, step-by-step answers to real technology questions — phones, PCs, storage, Wi‑Fi, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://answerkit.site",
  hero: {
    line1: "Clear tech answers,",
    line2: "built to fix things.",
    subhead:
      "Practical fixes for phones, PCs, storage, and Wi‑Fi — short answer first, then the steps.",
  },
} as const;
