export const SITE = {
  name: "AnswerKit",
  tagline: "Find answers. Fast.",
  description:
    "Get clear answers to your tech questions — without digging through forums.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://answerkit.site",
  hero: {
    line1: "Get unstuck.",
    line2: "Get a clear answer.",
    subhead:
      "Practical answers to real tech questions — without digging through forums.",
  },
} as const;

export const HOME_BENEFITS = [
  {
    title: "Direct answers",
    body: "Get the answer first. No 1,500-word introduction before the solution.",
  },
  {
    title: "Practical steps",
    body: "Clear instructions with commands, settings, and platform-specific steps when you need them.",
  },
  {
    title: "Human-reviewed",
    body: "AI can draft answers, but every page is checked before publication.",
  },
] as const;

export const HOME_TRUST_ITEMS = [
  "Clear answer first",
  "Practical step-by-step instructions",
  "Platform-specific details",
  "Important warnings and caveats",
  "Sources where appropriate",
  "No generic AI filler",
] as const;

export const COMPARE_ROWS = [
  { label: "What you get", google: "Many results", forums: "Long discussions", answerkit: "Direct answer" },
  { label: "Quality", google: "SEO-heavy pages", forums: "Mixed quality", answerkit: "Structured steps" },
  { label: "Effort", google: "Compare sources yourself", forums: "Read multiple replies", answerkit: "Answer + caveats" },
  { label: "Freshness", google: "Often outdated", forums: "Old threads", answerkit: "Reviewed answers" },
] as const;
