import fs from "node:fs";
import path from "node:path";
import type { AnswerContent } from "./types";

const ANSWERS_DIR = path.join(process.cwd(), "data", "answers");

const cache = new Map<string, AnswerContent | null>();

function isAnswerFile(name: string) {
  return name.endsWith(".json") && !name.startsWith("_");
}

function answerPath(slug: string) {
  return path.join(ANSWERS_DIR, `${slug}.json`);
}

function validateAnswer(data: unknown, file: string): AnswerContent {
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid answer JSON in ${file}`);
  }

  const answer = data as AnswerContent;
  const required = ["slug", "directAnswer", "summary", "sections", "status", "updatedAt"] as const;

  for (const key of required) {
    if (!(key in answer) || answer[key] === undefined || answer[key] === "") {
      throw new Error(`Missing "${key}" in ${file}`);
    }
  }

  if (!Array.isArray(answer.sections) || answer.sections.length === 0) {
    throw new Error(`"sections" must be a non-empty array in ${file}`);
  }

  if (!["draft", "reviewed", "published"].includes(answer.status)) {
    throw new Error(`Invalid status in ${file}`);
  }

  return answer;
}

function readAnswerFile(slug: string): AnswerContent | undefined {
  const filePath = answerPath(slug);
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;
  return validateAnswer(parsed, `${slug}.json`);
}

export function getAnswer(slug: string): AnswerContent | undefined {
  if (cache.has(slug)) {
    return cache.get(slug) ?? undefined;
  }

  try {
    const answer = readAnswerFile(slug);
    cache.set(slug, answer ?? null);
    return answer;
  } catch (err) {
    console.warn(`Skipping invalid answer file for "${slug}":`, err);
    cache.set(slug, null);
    return undefined;
  }
}

export function getAllAnswers(): AnswerContent[] {
  if (!fs.existsSync(ANSWERS_DIR)) return [];

  const answers: AnswerContent[] = [];
  for (const file of fs.readdirSync(ANSWERS_DIR)) {
    if (!isAnswerFile(file)) continue;
    const slug = file.replace(/\.json$/, "");
    const answer = getAnswer(slug);
    if (answer) answers.push(answer);
  }
  return answers;
}

export function getAnswersByStatus(
  status: AnswerContent["status"],
): AnswerContent[] {
  return getAllAnswers().filter((a) => a.status === status);
}

/** Slugs with status "published" — only these are pre-rendered and in the sitemap. */
export function getPublishedSlugs(): string[] {
  return getAnswersByStatus("published").map((a) => a.slug);
}

export function getPublishedCount(): number {
  return getPublishedSlugs().length;
}

export function isPublished(slug: string): boolean {
  return getAnswer(slug)?.status === "published";
}

export function isIndexable(slug: string): boolean {
  return isPublished(slug);
}

export function getAnswerSlugs(): string[] {
  if (!fs.existsSync(ANSWERS_DIR)) return [];
  return fs
    .readdirSync(ANSWERS_DIR)
    .filter(isAnswerFile)
    .map((f) => f.replace(/\.json$/, ""));
}

export function answerExists(slug: string): boolean {
  return fs.existsSync(answerPath(slug));
}

export function clearAnswerCache() {
  cache.clear();
}
