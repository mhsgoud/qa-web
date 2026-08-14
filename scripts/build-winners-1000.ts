/**
 * Build data/winners_1000.json:
 * 1) all curated winners.json rows (preserve published set)
 * 2) fill with quality-gated scored questions up to 1000
 */
import fs from "node:fs";
import Papa from "papaparse";
import { scoreAll } from "../src/lib/scoring";
import { isWinnerCandidate } from "../src/lib/quality";
import type { Question } from "../src/lib/types";

type Row = {
  rank: number;
  slug: string;
  question: string;
  category: string;
  priorityScore?: number;
  suggestedTool?: string;
};

const winners = JSON.parse(fs.readFileSync("data/winners.json", "utf8")) as Row[];
const seen = new Set(winners.map((w) => w.slug));
const top: Row[] = winners.map((w, i) => ({
  rank: i + 1,
  slug: w.slug,
  question: w.question,
  category: w.category,
  priorityScore: w.priorityScore,
  suggestedTool: w.suggestedTool,
}));

const raw = fs.readFileSync("data/tech_questions_10000.csv", "utf8");
const parsed = Papa.parse<Record<string, string>>(raw, {
  header: true,
  skipEmptyLines: true,
});
const questions: Question[] = parsed.data
  .filter((row) => row.slug && row.question)
  .map((row) => ({
    id: Number(row.id),
    category: row.category.trim(),
    question: row.question.trim(),
    intent: row.intent.trim(),
    slug: row.slug.trim(),
    suggestedContentType: row.suggested_content_type.trim(),
  }));

const scored = scoreAll(questions);

function tryAdd(item: (typeof scored)[number], fillMode: boolean) {
  if (top.length >= 1000) return;
  if (seen.has(item.slug)) return;
  if (!isWinnerCandidate(item)) return;
  if (fillMode) {
    if (/^is .+ worth it\?/i.test(item.question)) return;
    if (
      !/^(how do i |why is my |what is the difference |how (much|long|many) |should i |does )/i.test(
        item.question,
      )
    ) {
      return;
    }
    const words = item.question.replace(/\?/g, "").split(/\s+/).filter(Boolean);
    if (words.length < 6) return;
  }
  seen.add(item.slug);
  top.push({
    rank: top.length + 1,
    slug: item.slug,
    question: item.question,
    category: item.category,
    priorityScore: item.priorityScore,
    suggestedTool: item.suggestedTool,
  });
}

for (const maxOrd of [35, 50, 80, 120, 200]) {
  for (const item of scored) {
    if (item.categoryOrdinal >= maxOrd) continue;
    tryAdd(item, false);
  }
  console.log(`after winners+ord<${maxOrd}: ${top.length}`);
}

for (const maxOrd of [400, 9999]) {
  for (const item of scored) {
    if (item.categoryOrdinal >= maxOrd) continue;
    tryAdd(item, true);
  }
  console.log(`fill ord<${maxOrd}: ${top.length}`);
  if (top.length >= 1000) break;
}

// re-rank
const rows = top.slice(0, 1000).map((w, i) => ({ ...w, rank: i + 1 }));
fs.writeFileSync("data/winners_1000.json", JSON.stringify(rows, null, 2));
fs.writeFileSync("data/publish_batch_1000.json", JSON.stringify(rows, null, 2));
console.log("wrote", rows.length, "includes winners", winners.length);
console.log(
  "ssd health?",
  rows.some((r) => r.slug === "how-do-i-check-ssd-health"),
);
