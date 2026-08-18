/**
 * Improve existing answer JSON with a stronger writer model, then a critic model.
 *
 * Usage:
 *   npm run answers:refine -- --slugs=a,b,c
 *   OPENAI_WRITE_MODEL=gpt-4o OPENAI_CRITIC_MODEL=gpt-4o npm run answers:refine -- --slugs=...
 *
 * Keeps slug, images, and status=published.
 */

import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import type { AnswerContent } from "../src/lib/types";

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const QUESTIONS_CSV = path.join(ROOT, "data", "tech_questions_10000.csv");

function loadEnv(): void {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const slugsArg = args.find((a) => a.startsWith("--slugs="))?.split("=")[1];
  const writeModel =
    args.find((a) => a.startsWith("--write-model="))?.split("=")[1] ??
    process.env.OPENAI_WRITE_MODEL ??
    "gpt-4o";
  const criticModel =
    args.find((a) => a.startsWith("--critic-model="))?.split("=")[1] ??
    process.env.OPENAI_CRITIC_MODEL ??
    "gpt-4o";
  return {
    slugs: (slugsArg ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    writeModel,
    criticModel,
    skipCritic: args.includes("--skip-critic"),
  };
}

function questionForSlug(slug: string): { question: string; category: string } {
  const raw = fs.readFileSync(QUESTIONS_CSV, "utf8");
  const parsed = Papa.parse<Record<string, string>>(raw, {
    header: true,
    skipEmptyLines: true,
  });
  const row = parsed.data.find((r) => r.slug?.trim() === slug);
  if (!row?.question) throw new Error(`Slug not in tech_questions_10000.csv: ${slug}`);
  return { category: (row.category || "General").trim(), question: row.question.trim() };
}

async function chatJson(model: string, system: string, user: string): Promise<AnswerContent> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (response.ok) {
      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };
      const content = data.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");
      return JSON.parse(content) as AnswerContent;
    }
    lastError = await response.text();
    if (!(response.status === 429 || response.status >= 500) || attempt === 3) break;
    await new Promise((r) => setTimeout(r, 1000 * attempt * 2));
  }
  throw new Error(`OpenAI API error (${model}): ${lastError}`);
}

const WRITER_SYSTEM =
  "You are a senior tech-support writer. Output only valid JSON. Prefer specific OS/app steps. If a menu path varies by version, say so. Never invent statistics or certifications. Do not add images.";

const CRITIC_SYSTEM =
  "You are a skeptical hardware/OS editor. Output only valid JSON. Fix wrong or vague steps, drop filler, keep platform-specific paths that are real, add a caveat when something is easy to get wrong. Do not add images. Do not weaken accurate warnings.";

function writerPrompt(
  meta: { question: string; category: string },
  draft: AnswerContent,
): string {
  return `Improve this technology answer so it is the best practical page for the query.

Question: ${meta.question}
Category: ${meta.category}
Slug: ${draft.slug}

Current draft JSON:
${JSON.stringify(
  {
    slug: draft.slug,
    directAnswer: draft.directAnswer,
    summary: draft.summary,
    sections: draft.sections,
    steps: draft.steps,
    faqs: draft.faqs,
    caveats: draft.caveats,
    relatedToolIdeas: draft.relatedToolIdeas,
  },
  null,
  2,
)}

Return JSON with keys: slug, directAnswer, summary, sections, steps, faqs, caveats, relatedToolIdeas.
Rules:
- Keep slug exactly "${draft.slug}".
- directAnswer: 1–2 specific sentences that actually answer the question.
- 2–4 sections, 3–5 steps, 2–4 FAQs, 1–3 caveats.
- Name products/OS paths you are sure about (Windows 11, iOS Camera, PS5 HDMI Device Link, Samsung DeX, Carbon Copy Cloner, fsutil).
- Do not mention being an AI.`;
}

function criticPrompt(
  meta: { question: string; category: string },
  candidate: AnswerContent,
): string {
  return `Fact-check and tighten this answer. If a step is wrong, fix it. If it is generic, make it concrete. Keep the same JSON keys.

Question: ${meta.question}
Category: ${meta.category}

JSON:
${JSON.stringify(
  {
    slug: candidate.slug,
    directAnswer: candidate.directAnswer,
    summary: candidate.summary,
    sections: candidate.sections,
    steps: candidate.steps,
    faqs: candidate.faqs,
    caveats: candidate.caveats,
    relatedToolIdeas: candidate.relatedToolIdeas,
  },
  null,
  2,
)}

Keep slug "${candidate.slug}". Return the full improved JSON.`;
}

function mergePublished(original: AnswerContent, improved: AnswerContent): AnswerContent {
  return {
    ...original,
    slug: original.slug,
    directAnswer: improved.directAnswer || original.directAnswer,
    summary: improved.summary || original.summary,
    sections:
      Array.isArray(improved.sections) && improved.sections.length > 0
        ? improved.sections
        : original.sections,
    steps: improved.steps ?? original.steps,
    faqs: improved.faqs ?? original.faqs,
    caveats: improved.caveats ?? original.caveats,
    relatedToolIdeas: improved.relatedToolIdeas ?? original.relatedToolIdeas,
    status: "published",
    updatedAt: new Date().toISOString().slice(0, 10),
    images: original.images,
  };
}

async function main() {
  loadEnv();
  const { slugs, writeModel, criticModel, skipCritic } = parseArgs();
  if (slugs.length === 0) {
    throw new Error("Pass --slugs=slug-one,slug-two");
  }
  if (!process.env.OPENAI_API_KEY?.trim()) {
    throw new Error("OPENAI_API_KEY missing");
  }

  console.log(`Writer: ${writeModel}`);
  console.log(`Critic: ${skipCritic ? "(skipped)" : criticModel}`);

  for (const slug of slugs) {
    const file = path.join(ANSWERS_DIR, `${slug}.json`);
    if (!fs.existsSync(file)) throw new Error(`Missing ${file}`);
    const original = JSON.parse(fs.readFileSync(file, "utf8")) as AnswerContent;
    const meta = questionForSlug(slug);

    console.log(`write ${slug}...`);
    const written = await chatJson(writeModel, WRITER_SYSTEM, writerPrompt(meta, original));
    written.slug = slug;

    let final = written;
    if (!skipCritic) {
      console.log(`critic ${slug}...`);
      final = await chatJson(criticModel, CRITIC_SYSTEM, criticPrompt(meta, written));
      final.slug = slug;
    }

    const merged = mergePublished(original, final);
    fs.writeFileSync(file, JSON.stringify(merged, null, 2) + "\n");
    console.log(`saved ${file}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
