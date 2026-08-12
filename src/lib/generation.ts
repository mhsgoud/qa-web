/**
 * Contract for AI-generated answers.
 * Goal: useful, specific pages — not thin template spam that search engines demote.
 *
 * Generation rules (enforce in the future pipeline):
 * 1. Lead with a direct answer in ≤2 sentences (specific claim, not "it depends" alone).
 * 2. Include platform splits when relevant (iOS/Android, Windows/macOS).
 * 3. Prefer concrete steps over generic "benefits / disadvantages" filler.
 * 4. Add at least one caveat or failure mode.
 * 5. FAQs must be real follow-ups, not rephrasings of the H1.
 * 6. Never invent product UI labels — mark uncertain UI paths as "varies by version".
 * 7. Human review required before status becomes "published".
 * 8. Do not publish pages whose only value is keyword coverage.
 */

export type GenerationBrief = {
  slug: string;
  question: string;
  category: string;
  intent: string;
  contentType: string;
  mustInclude: string[];
  avoid: string[];
};

export function buildGenerationBrief(input: {
  slug: string;
  question: string;
  category: string;
  intent: string;
  contentType: string;
}): GenerationBrief {
  return {
    ...input,
    mustInclude: [
      "directAnswer",
      "platform-specific steps when applicable",
      "at least one caveat",
      "2–4 genuine FAQs",
    ],
    avoid: [
      "generic benefits/disadvantages sections with no specifics",
      "repeating the question as the answer",
      "fabricated statistics",
      "keyword stuffing",
      "identical section templates across unrelated topics",
    ],
  };
}
