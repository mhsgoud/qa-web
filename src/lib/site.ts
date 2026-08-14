export const SITE = {
  name: "AnswerKit",
  tagline: "Find answers. Fast.",
  description:
    "Clear, step-by-step answers to real technology questions — phones, PCs, storage, Wi‑Fi, and more.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://answerkit.site",
  hero: {
    line1: "Get unstuck.",
    line2: "Get a clear answer.",
    subhead:
      "A growing library of practical tech answers — phones, PCs, storage, Wi‑Fi, security, and more. Solution first, then clear steps.",
  },
} as const;
