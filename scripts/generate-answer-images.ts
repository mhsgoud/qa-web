/**
 * Generate AI illustrations for an existing answer JSON file.
 *
 * Usage:
 *   npm run answers:images -- --slug=how-do-i-free-up-storage-on-my-phone
 *   npm run answers:images -- --slug=... --force
 */

import fs from "node:fs";
import path from "node:path";
import type { AnswerContent } from "../src/lib/types";
import { generateImagesForAnswer } from "./lib/answer-images";

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const WINNERS_FILE = path.join(ROOT, "data", "winners.json");
const QUESTIONS_FILE = path.join(ROOT, "data", "tech_questions_10000.csv");

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
  const slug = args.find((a) => a.startsWith("--slug="))?.split("=")[1];
  return {
    slug,
    force: args.includes("--force"),
  };
}

function loadQuestionText(slug: string): string {
  if (fs.existsSync(WINNERS_FILE)) {
    const winners = JSON.parse(fs.readFileSync(WINNERS_FILE, "utf8")) as {
      slug: string;
      question: string;
    }[];
    const winner = winners.find((w) => w.slug === slug);
    if (winner) return winner.question;
  }

  if (fs.existsSync(QUESTIONS_FILE)) {
    const csv = fs.readFileSync(QUESTIONS_FILE, "utf8");
    const line = csv.split(/\r?\n/).find((row) => row.includes(slug));
    if (line) {
      const parts = line.split(",");
      const questionIdx = 2;
      if (parts[questionIdx]) {
        return parts[questionIdx].replace(/^"|"$/g, "");
      }
    }
  }

  return slug.replace(/-/g, " ");
}

async function main() {
  loadEnv();
  const { slug, force } = parseArgs();

  if (!slug) {
    throw new Error("Missing --slug=your-question-slug");
  }

  const answerPath = path.join(ANSWERS_DIR, `${slug}.json`);
  if (!fs.existsSync(answerPath)) {
    throw new Error(`Answer file not found: ${answerPath}`);
  }

  const answer = JSON.parse(fs.readFileSync(answerPath, "utf8")) as AnswerContent;
  const question = loadQuestionText(slug);
  const previousStatus = answer.status;

  console.log(`Generating images for: ${slug}`);
  console.log(`Question: ${question}`);
  console.log(`Image model: ${process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1"}`);

  const images = await generateImagesForAnswer(slug, answer, question, { force });

  const updated: AnswerContent = {
    ...answer,
    images,
    updatedAt: new Date().toISOString().slice(0, 10),
    status: previousStatus,
  };

  fs.writeFileSync(answerPath, JSON.stringify(updated, null, 2) + "\n");
  console.log(`\nDone. Wrote ${images.length} images and updated ${answerPath}`);
  for (const img of images) {
    console.log(`  ${img.src} → ${img.attachTo}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
