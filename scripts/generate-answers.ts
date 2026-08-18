/**
 * Generate answer JSON files for priority questions.
 *
 * Usage:
 *   npm run answers:generate              # top 20, skip existing
 *   npm run answers:generate -- --limit 5
 *   npm run answers:generate -- --force   # overwrite existing
 *   npm run answers:generate -- --slug=how-do-i-clone-an-ssd
 *   npm run answers:generate -- --with-images
 *   npm run answers:generate -- --source=scored --limit=1000
 *
 * Requires OPENAI_API_KEY in .env for AI generation.
 */

import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
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
const WINNERS_1000_FILE = path.join(ROOT, "data", "winners_1000.json");
const SCORED_FILE = path.join(ROOT, "data", "scored_questions_10000.csv");
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
  const sourceArg = args.find((a) => a.startsWith("--source="))?.split("=")[1];
  return {
    limit: Number(args.find((a) => a.startsWith("--limit="))?.split("=")[1] ?? 20),
    force: args.includes("--force"),
    templateOnly: args.includes("--template-only"),
    withImages: args.includes("--with-images"),
    source: (sourceArg === "scored" || sourceArg === "winners1000"
      ? sourceArg
      : "winners") as "scored" | "winners" | "winners1000",
    concurrency: Math.max(
      1,
      Number(args.find((a) => a.startsWith("--concurrency="))?.split("=")[1] ?? 4),
    ),
    slug: slugArg,
    model: args.find((a) => a.startsWith("--model="))?.split("=")[1],
  };
}

function loadFromScored(limit: number, slug?: string): WinnerRow[] {
  const raw = fs.readFileSync(SCORED_FILE, "utf8");
  const parsed = Papa.parse<Record<string, string>>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data
    .filter((row) => row.slug && row.question)
    .map((row, index) => ({
      rank: Number(row.rank) || index + 1,
      slug: row.slug.trim(),
      question: row.question.trim(),
      category: (row.category || "General").trim(),
      suggestedTool: row.suggested_tool?.trim() || undefined,
      priorityScore: Number(row.priority_score) || 0,
    }))
    .sort((a, b) => b.priorityScore - a.priorityScore || a.rank - b.rank);

  if (slug) {
    const match = rows.find((r) => r.slug === slug);
    if (!match) throw new Error(`Slug not found in scored CSV: ${slug}`);
    return [match];
  }

  return rows.slice(0, limit).map((row, i) => ({
    rank: i + 1,
    slug: row.slug,
    question: row.question,
    category: row.category,
    suggestedTool: row.suggestedTool,
  }));
}

function loadWinners(
  limit: number,
  slug?: string,
  source: "scored" | "winners" | "winners1000" = "winners",
): WinnerRow[] {
  if (source === "scored") return loadFromScored(limit, slug);

  const file = source === "winners1000" ? WINNERS_1000_FILE : WINNERS_FILE;
  const rows = JSON.parse(fs.readFileSync(file, "utf8")) as WinnerRow[];
  if (slug) {
    const match = rows.find((r) => r.slug === slug);
    if (!match) throw new Error(`Slug not found in ${path.basename(file)}: ${slug}`);
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

async function generateWithOpenAI(prompt: string, retries = 3): Promise<AnswerContent> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Use --template-only or add it to .env");
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  let lastError = "unknown error";

  for (let attempt = 1; attempt <= retries; attempt++) {
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

    if (response.ok) {
      const data = (await response.json()) as {
        choices: { message: { content: string } }[];
      };
      const content = data.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");
      return JSON.parse(content) as AnswerContent;
    }

    lastError = await response.text();
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === retries) break;
    await new Promise((r) => setTimeout(r, 1000 * attempt * 2));
  }

  throw new Error(`OpenAI API error: ${lastError}`);
}

function writeAnswer(answer: AnswerContent) {
  fs.mkdirSync(ANSWERS_DIR, { recursive: true });
  const filePath = path.join(ANSWERS_DIR, `${answer.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(answer, null, 2) + "\n");
  return filePath;
}

async function mapPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let next = 0;
  async function run() {
    while (true) {
      const index = next++;
      if (index >= items.length) return;
      await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => run()));
}

async function main() {
  const env = loadEnv();
  const { limit, force, templateOnly, withImages, source, concurrency, slug, model } =
    parseArgs();
  if (model) process.env.OPENAI_MODEL = model;
  const winners = loadWinners(limit, slug, source);

  console.log(
    `Generating answers for top ${winners.length} from ${source}` +
      (slug ? ` (slug=${slug})` : "") +
      "...",
  );
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
    console.log(`Concurrency: ${concurrency}`);
    if (!force) {
      console.log("Tip: existing answer files are skipped. Use --force to overwrite stubs with AI content.");
    }
  }

  let created = 0;
  let skipped = 0;
  let failed = 0;

  const queue = winners.filter((winner) => {
    const outPath = path.join(ANSWERS_DIR, `${winner.slug}.json`);
    const exists = fs.existsSync(outPath);
    if (exists && !force && !withImages) {
      console.log(`skip  ${winner.slug} (exists)`);
      skipped++;
      return false;
    }
    return true;
  });

  console.log(`Queued for generation: ${queue.length}`);

  await mapPool(queue, templateOnly || !process.env.OPENAI_API_KEY ? 1 : concurrency, async (winner) => {
    const outPath = path.join(ANSWERS_DIR, `${winner.slug}.json`);
    const exists = fs.existsSync(outPath);

    try {
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
    } catch (err) {
      failed++;
      console.error(`fail  ${winner.slug}:`, err);
    }
  });

  console.log(`\nDone. Created/updated: ${created}, skipped: ${skipped}, failed: ${failed}`);
  console.log(`Answers live in data/answers/*.json`);
  console.log(`Edit status to "reviewed" or "published" after human review.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
