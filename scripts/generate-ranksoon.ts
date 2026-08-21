/**
 * One-shot: generate + publish answers from data/winners_ranksoon.json
 * Usage: npx tsx scripts/generate-ranksoon.ts
 */
import fs from "node:fs";
import path from "node:path";
import type { AnswerContent } from "../src/lib/types";

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const BATCH = path.join(ROOT, "data", "winners_ranksoon.json");

function loadEnv() {
  const envPath = path.join(ROOT, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/)) {
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

type Row = {
  slug: string;
  question: string;
  category: string;
  suggestedTool?: string;
};

async function generate(row: Row, model: string): Promise<AnswerContent> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const today = new Date().toISOString().slice(0, 10);
  const prompt = `Write a practical technology answer page as JSON.

Question: ${row.question}
Category: ${row.category}
Slug: ${row.slug}

Return ONLY valid JSON:
{
  "slug": "${row.slug}",
  "directAnswer": "1-2 specific sentences with the fix",
  "summary": "string",
  "sections": [{ "id": "kebab-case", "heading": "string", "body": "string" }],
  "steps": [{ "title": "string", "detail": "string" }],
  "faqs": [{ "question": "string", "answer": "string" }],
  "caveats": ["string"],
  "relatedToolIdeas": ["string"],
  "status": "published",
  "updatedAt": "${today}"
}

Rules:
- Accurate, specific UI paths for current Windows 11 / Discord / Steam / AirPods where relevant.
- 3 sections, 4-5 steps, 3 FAQs.
- No fabricated stats. Note when menus vary by version.
- status must be "published".`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You write accurate, concise tech help for SEO how-to pages. Output only valid JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(await response.text());
  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const answer = JSON.parse(data.choices[0]!.message.content!) as AnswerContent;
  answer.slug = row.slug;
  answer.status = "published";
  answer.updatedAt = today;
  return answer;
}

async function main() {
  loadEnv();
  const model = process.env.OPENAI_WRITE_MODEL ?? "gpt-4o";
  const rows = JSON.parse(fs.readFileSync(BATCH, "utf8")) as Row[];
  fs.mkdirSync(ANSWERS_DIR, { recursive: true });

  for (const row of rows) {
    const out = path.join(ANSWERS_DIR, `${row.slug}.json`);
    if (fs.existsSync(out)) {
      console.log(`skip ${row.slug}`);
      continue;
    }
    console.log(`gen  ${row.slug} (${model})`);
    const answer = await generate(row, model);
    fs.writeFileSync(out, JSON.stringify(answer, null, 2) + "\n");
    console.log(`ok   ${row.slug}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
