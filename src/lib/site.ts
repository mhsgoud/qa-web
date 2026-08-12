export const SITE = {
  name: "Clarify",
  tagline: "Tech answers that get to the point",
  description:
    "Clear answers to real technology questions — with steps, caveats, and tools when they help.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
