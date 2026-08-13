/**
 * Generate answer JSON files for priority questions.
 *
 * Usage:
 *   npm run answers:generate              # top 20, skip existing
 *   npm run answers:generate -- --limit 5
 *   npm run answers:generate -- --force   # overwrite existing
 *   npm run answers:generate -- --slug=how-do-i-clone-an-ssd
 *   npm run answers:generate -- --with-images
 *
 * Requires OPENAI_API_KEY in .env for AI generation.
 */

import fs from "node:fs";
import path from "node:path";
import type { AnswerContent } from "../src/lib/types";
import { generateImagesForAnswer } from "./lib/answer-images";

type WinnerRow = {
  rank: number;
  slug: string;
  question: string;
  category: string;
  suggestedTool?: string;
};

type Brief = {
  mustInclude?: string[];
  avoid?: string[];
  suggestedTool?: string;
};

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const WINNERS_FILE = path.join(ROOT, "data", "winners.json");
const BRIEFS_DIR = path.join(ROOT, "data", "briefs");

/** Load .env from project root (no extra dependency). */
function loadEnv(): { loaded: boolean; hasKey: boolean } {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) {
    return { loaded: false, hasKey: false };
  }

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
    // Overwrite empty/missing values (Windows often has empty env vars set)
    if (!process.env[key]) process.env[key] = value;
  }

  return {
    loaded: true,
    hasKey: Boolean(process.env.OPENAI_API_KEY?.trim()),
  };
}

function parseArgs() {
  const args = process.argv.slice(2);
  const slugArg = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  return {
    limit: Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 20),
    force: args.includes("--force"),
    templateOnly: args.includes("--template-only"),
    withImages: args.includes("--with-images"),
    slug: slugArg,
  };
}

function loadWinners(limit: number, slug?: string): WinnerRow[] {
  const rows = JSON.parse(fs.readFileSync(WINNERS_FILE, "utf8")) as WinnerRow[];
  if (slug) {
    const match = rows.find((r) => r.slug === slug);
    if (!match) throw new Error(`Slug not found in data/winners.json: ${slug}`);
    return [match];
  }
  return rows.slice(0, limit);
}

function findBrief(slug: string): Brief | undefined {
  if (!fs.existsSync(BRIEFS_DIR)) return undefined;
  const match = fs
    .readdirSync(BRIEFS_DIR)
    .find((f) => f.endsWith(`-${slug}.json`));
  if (!match) return undefined;
  return JSON.parse(fs.readFileSync(path.join(BRIEFS_DIR, match), "utf8")) as Brief;
}

function buildPrompt(winner: WinnerRow, brief?: Brief) {
  return `Write a practical technology answer page as JSON.

Question: ${winner.question}
Category: ${winner.category}
Slug: ${winner.slug}
Suggested tool idea: ${brief?.suggestedTool ?? winner.suggestedTool ?? "none"}

Must include:
${(brief?.mustInclude ?? ["directAnswer", "platform-specific steps", "caveats", "2-4 FAQs"]).map((x) => `- ${x}`).join("\n")}

Avoid:
${(brief?.avoid ?? ["generic benefits/disadvantages filler", "repeating the question", "fabricated statistics", "keyword stuffing"]).map((x) => `- ${x}`).join("\n")}

Return ONLY valid JSON matching this schema:
{
  "slug": "${winner.slug}",
  "directAnswer": "string (1-2 specific sentences)",
  "summary": "string",
  "sections": [{ "id": "kebab-case", "heading": "string", "body": "string" }],
  "steps": [{ "title": "string", "detail": "string" }],
  "faqs": [{ "question": "string", "answer": "string" }],
  "caveats": ["string"],
  "relatedToolIdeas": ["string"],
  "status": "draft",
  "updatedAt": "${new Date().toISOString().slice(0, 10)}"
}

Rules:
- Be specific and accurate. If UI paths vary by version, say so.
- Use 2-4 sections and 2-4 steps when it's a how-to.
- Include 2-3 FAQs that are real follow-ups.
- status must be "draft" (human review required before publish).`;
}

function makeTemplate(winner: WinnerRow): AnswerContent {
  return {
    slug: winner.slug,
    directAnswer:
      "This answer is a draft stub. Replace with a specific 1–2 sentence answer.",
    summary: `Draft for: ${winner.question}. Add context and what the reader will learn.`,
    sections: [
      {
        id: "todo",
        heading: "TODO — write this section",
        body: `Replace with practical guidance for: ${winner.question}`,
      },
    ],
    steps: [],
    faqs: [],
    caveats: ["Review and verify all steps before publishing."],
    relatedToolIdeas: winner.suggestedTool ? [winner.suggestedTool] : [],
    status: "draft",
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

async function generateWithOpenAI(prompt: string): Promise<AnswerContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Use --template-only or add it to .env");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write accurate, concise tech help content. Output only valid JSON. Never invent exact menu paths you are unsure about — note when paths vary.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${err}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from OpenAI");

  return JSON.parse(content) as AnswerContent;
}

function writeAnswer(answer: AnswerContent) {
  fs.mkdirSync(ANSWERS_DIR, { recursive: true });
  const filePath = path.join(ANSWERS_DIR, `${answer.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(answer, null, 2) + "\n");
  return filePath;
}

async function main() {
  const env = loadEnv();
  const { limit, force, templateOnly, withImages, slug } = parseArgs();
  const winners = loadWinners(limit, slug);

  console.log(`Generating answers for top ${winners.length} winners...`);
  if (withImages) {
    console.log("Mode: with-images (illustrations after text generation)");
  }
  if (env.loaded) {
    console.log(
      env.hasKey
        ? "Loaded OPENAI_API_KEY from .env"
        : "Found .env but OPENAI_API_KEY is missing or empty",
    );
  } else {
    console.log("No .env file found — create one from .env.example");
  }

  if (templateOnly) {
    console.log("Mode: template-only (no API calls)");
  } else if (!process.env.OPENAI_API_KEY?.trim()) {
    console.log("No OPENAI_API_KEY — creating templates only. Set key in .env for AI generation.");
  } else {
    console.log(`Model: ${process.env.OPENAI_MODEL ?? "gpt-4o-mini"}`);
    if (!force) {
      console.log("Tip: existing answer files are skipped. Use --force to overwrite stubs with AI content.");
    }
  }

  let created = 0;
  let skipped = 0;

  for (const winner of winners) {
    const outPath = path.join(ANSWERS_DIR, `${winner.slug}.json`);
    const exists = fs.existsSync(outPath);

    if (exists && !force && !withImages) {
      console.log(`skip  ${winner.slug} (exists)`);
      skipped++;
      continue;
    }

    let answer: AnswerContent;

    if (exists && !force) {
      answer = JSON.parse(fs.readFileSync(outPath, "utf8")) as AnswerContent;
      console.log(`load  ${winner.slug} (existing text)`);
    } else if (templateOnly || !process.env.OPENAI_API_KEY) {
      answer = makeTemplate(winner);
    } else {
      const brief = findBrief(winner.slug);
      const prompt = buildPrompt(winner, brief);
      console.log(`gen   ${winner.slug}...`);
      answer = await generateWithOpenAI(prompt);
      answer.slug = winner.slug;
      answer.status = "draft";
      answer.updatedAt = new Date().toISOString().slice(0, 10);
    }

    if (withImages && process.env.OPENAI_API_KEY?.trim()) {
      console.log(`images ${winner.slug}...`);
      answer.images = await generateImagesForAnswer(winner.slug, answer, winner.question, {
        force,
      });
      answer.updatedAt = new Date().toISOString().slice(0, 10);
    }

    const file = writeAnswer(answer);
    console.log(`write ${file}`);
    created++;

    // Gentle rate limit between API calls
    if (!templateOnly && process.env.OPENAI_API_KEY) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  console.log(`\nDone. Created/updated: ${created}, skipped: ${skipped}`);
  console.log(`Answers live in data/answers/*.json`);
  console.log(`Edit status to "reviewed" or "published" after human review.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
