export const SITE = {
  name: "AnswerKit",
  tagline: "Find answers. Fast.",
  description:
    "Clear answers to real technology questions — with steps, caveats, and tools when they help.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://answerkit.tech",
} as const;
