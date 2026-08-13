import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { getAnswer, getPublishedSlugs, isPublished } from "./answers";
import type { Question } from "./types";
import { isHighQualityQuestion } from "./quality";
import { getWinners } from "./winners";

type CsvRow = {
  id: string;
  category: string;
  question: string;
  intent: string;
  slug: string;
  suggested_content_type: string;
};

let cache: Question[] | null = null;
let bySlug: Map<string, Question> | null = null;
let byCategory: Map<string, Question[]> | null = null;

function loadQuestions(): Question[] {
  if (cache) return cache;

  const filePath = path.join(process.cwd(), "data", "tech_questions_10000.csv");
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = Papa.parse<CsvRow>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  cache = parsed.data
    .filter((row) => row.slug && row.question)
    .map((row) => ({
      id: Number(row.id),
      category: row.category.trim(),
      question: row.question.trim(),
      intent: row.intent.trim(),
      slug: row.slug.trim(),
      suggestedContentType: row.suggested_content_type.trim(),
    }));

  bySlug = new Map(cache.map((q) => [q.slug, q]));
  byCategory = new Map();
  for (const q of cache) {
    const list = byCategory.get(q.category) ?? [];
    list.push(q);
    byCategory.set(q.category, list);
  }

  return cache;
}

export function getAllQuestions(): Question[] {
  return loadQuestions();
}

export function getQuestionBySlug(slug: string): Question | undefined {
  loadQuestions();
  return bySlug?.get(slug);
}

export function getCategories(): { name: string; slug: string; count: number }[] {
  loadQuestions();
  return [...(byCategory?.entries() ?? [])]
    .map(([name, items]) => ({
      name,
      slug: categoryToSlug(name),
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getQuestionsByCategory(categorySlug: string): Question[] {
  loadQuestions();
  const entry = [...(byCategory?.entries() ?? [])].find(
    ([name]) => categoryToSlug(name) === categorySlug,
  );
  return entry?.[1] ?? [];
}

export function getCategoryName(categorySlug: string): string | undefined {
  return getCategories().find((c) => c.slug === categorySlug)?.name;
}

export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getFeaturedQuestions(limit = 12): Question[] {
  return getAllQuestions()
    .filter(isHighQualityQuestion)
    .slice(0, limit);
}

export function getRelatedQuestions(question: Question, limit = 8): Question[] {
  const pool = getQuestionsByCategory(categoryToSlug(question.category)).filter(
    (q) => q.slug !== question.slug && isHighQualityQuestion(q),
  );
  return pool.slice(0, limit);
}

export function searchQuestions(query: string, limit = 24): Question[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  return getAllQuestions()
    .map((item) => {
      const hay = `${item.question} ${item.category}`.toLowerCase();
      const score = tokens.reduce(
        (acc, token) => acc + (hay.includes(token) ? 1 : 0),
        0,
      );
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

let publishedQuestionsCache: Question[] | null = null;

function loadPublishedQuestions(): Question[] {
  if (publishedQuestionsCache) return publishedQuestionsCache;

  publishedQuestionsCache = getPublishedSlugs()
    .map((slug) => getQuestionBySlug(slug))
    .filter((q): q is Question => Boolean(q));

  return publishedQuestionsCache;
}

/** Questions that have a published answer — the only ones shown on the public site. */
export function getPublishedQuestions(): Question[] {
  return loadPublishedQuestions();
}

export function getPublishedQuestionBySlug(slug: string): Question | undefined {
  if (!isPublished(slug)) return undefined;
  return getQuestionBySlug(slug);
}

export function getPublishedCategories(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const q of getPublishedQuestions()) {
    counts.set(q.category, (counts.get(q.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, count]) => ({
      name,
      slug: categoryToSlug(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getPublishedCategoryName(categorySlug: string): string | undefined {
  return getPublishedCategories().find((c) => c.slug === categorySlug)?.name;
}

export function getPublishedQuestionsByCategory(categorySlug: string): Question[] {
  return getPublishedQuestions().filter(
    (q) => categoryToSlug(q.category) === categorySlug,
  );
}

export function searchPublishedQuestions(query: string, limit = 24): Question[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);
  return getPublishedQuestions()
    .map((item) => {
      const hay = `${item.question} ${item.category}`.toLowerCase();
      const score = tokens.reduce(
        (acc, token) => acc + (hay.includes(token) ? 1 : 0),
        0,
      );
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

export function getPublishedRelatedQuestions(question: Question, limit = 8): Question[] {
  return getPublishedQuestionsByCategory(categoryToSlug(question.category))
    .filter((q) => q.slug !== question.slug)
    .slice(0, limit);
}

export function getFeaturedPublishedQuestion(): Question | undefined {
  const prioritized = getPublishedQuestionsByPriority(1);
  if (prioritized[0]) return prioritized[0];

  const sorted = getPublishedSlugs()
    .map((slug) => {
      const question = getQuestionBySlug(slug);
      const answer = getAnswer(slug);
      if (!question || !answer) return null;
      return { question, updatedAt: answer.updatedAt };
    })
    .filter((x): x is { question: Question; updatedAt: string } => Boolean(x))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  return sorted[0]?.question;
}

/** Published questions ordered by SEO priority (winners list), then any remaining. */
export function getPublishedQuestionsByPriority(limit?: number): Question[] {
  const bySlug = new Map(getPublishedQuestions().map((q) => [q.slug, q]));
  const ordered: Question[] = [];
  const seen = new Set<string>();

  for (const winner of getWinners()) {
    const q = bySlug.get(winner.slug);
    if (!q) continue;
    ordered.push(q);
    seen.add(q.slug);
    if (limit && ordered.length >= limit) return ordered;
  }

  for (const q of getPublishedQuestions()) {
    if (seen.has(q.slug)) continue;
    ordered.push(q);
    if (limit && ordered.length >= limit) break;
  }

  return ordered;
}
