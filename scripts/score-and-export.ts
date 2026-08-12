import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { buildGenerationBrief } from "../src/lib/generation";
import { scoreAll, pickWinners, type ScoredQuestion } from "../src/lib/scoring";
import type { Question } from "../src/lib/types";

const ROOT = process.cwd();
const DATA = path.join(ROOT, "data");

function loadQuestions(): Question[] {
  const raw = fs.readFileSync(path.join(DATA, "tech_questions_10000.csv"), "utf8");
  const parsed = Papa.parse<Record<string, string>>(raw, {
    header: true,
    skipEmptyLines: true,
  });

  return parsed.data
    .filter((row) => row.slug && row.question)
    .map((row) => ({
      id: Number(row.id),
      category: row.category.trim(),
      question: row.question.trim(),
      intent: row.intent.trim(),
      slug: row.slug.trim(),
      suggestedContentType: row.suggested_content_type.trim(),
    }));
}

function toCsv(rows: ScoredQuestion[]) {
  const header = [
    "rank",
    "id",
    "priority_score",
    "volume_score",
    "commercial_score",
    "competition_score",
    "ease_score",
    "content_difficulty",
    "volume_band",
    "commercial_band",
    "competition_band",
    "quality_pass",
    "category",
    "question",
    "primary_keyword",
    "intent",
    "slug",
    "article_title",
    "monetization_type",
    "suggested_tool",
    "reason",
  ];

  const escape = (value: string | number | boolean) => {
    const s = String(value);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const lines = [header.join(",")];
  rows.forEach((row, index) => {
    lines.push(
      [
        index + 1,
        row.id,
        row.priorityScore,
        row.volumeScore,
        row.commercialScore,
        row.competitionScore,
        row.easeScore,
        row.contentDifficulty,
        row.volumeBand,
        row.commercialBand,
        row.competitionBand,
        row.qualityPass,
        row.category,
        row.question,
        row.primaryKeyword,
        row.intent,
        row.slug,
        row.articleTitle,
        row.monetizationType,
        row.suggestedTool,
        row.reason,
      ]
        .map(escape)
        .join(","),
    );
  });
  return lines.join("\n");
}

function writeBriefs(winners: ScoredQuestion[]) {
  const briefsDir = path.join(DATA, "briefs");
  fs.mkdirSync(briefsDir, { recursive: true });

  const index = winners.map((w, i) => {
    const brief = {
      rank: i + 1,
      ...buildGenerationBrief({
        slug: w.slug,
        question: w.question,
        category: w.category,
        intent: w.intent,
        contentType: w.suggestedContentType,
      }),
      scores: {
        priority: w.priorityScore,
        volume: w.volumeScore,
        commercial: w.commercialScore,
        competition: w.competitionScore,
        ease: w.easeScore,
        contentDifficulty: w.contentDifficulty,
      },
      bands: {
        volume: w.volumeBand,
        commercial: w.commercialBand,
        competition: w.competitionBand,
      },
      primaryKeyword: w.primaryKeyword,
      articleTitle: w.articleTitle,
      monetizationType: w.monetizationType,
      suggestedTool: w.suggestedTool,
      reason: w.reason,
      url: `/q/${w.slug}`,
      status: "queued",
    };

    fs.writeFileSync(
      path.join(briefsDir, `${String(i + 1).padStart(3, "0")}-${w.slug}.json`),
      JSON.stringify(brief, null, 2),
    );
    return brief;
  });

  fs.writeFileSync(
    path.join(DATA, "winners_briefs.json"),
    JSON.stringify(index, null, 2),
  );
}

function main() {
  const questions = loadQuestions();
  const scored = scoreAll(questions);
  const winners500 = pickWinners(scored, 500);
  const winners100 = winners500.slice(0, 100);

  fs.writeFileSync(path.join(DATA, "scored_questions_10000.csv"), toCsv(scored));
  fs.writeFileSync(path.join(DATA, "winners.csv"), toCsv(winners500));
  fs.writeFileSync(path.join(DATA, "winners_500.csv"), toCsv(winners500));
  fs.writeFileSync(path.join(DATA, "winners_100.csv"), toCsv(winners100));

  fs.writeFileSync(
    path.join(DATA, "winners.json"),
    JSON.stringify(
      winners500.map((w, i) => ({
        rank: i + 1,
        id: w.id,
        slug: w.slug,
        question: w.question,
        category: w.category,
        priorityScore: w.priorityScore,
        volumeScore: w.volumeScore,
        commercialScore: w.commercialScore,
        competitionScore: w.competitionScore,
        easeScore: w.easeScore,
        contentDifficulty: w.contentDifficulty,
        volumeBand: w.volumeBand,
        commercialBand: w.commercialBand,
        competitionBand: w.competitionBand,
        monetizationType: w.monetizationType,
        suggestedTool: w.suggestedTool,
        primaryKeyword: w.primaryKeyword,
        articleTitle: w.articleTitle,
        reason: w.reason,
      })),
      null,
      2,
    ),
  );

  // Keep a compact top-100 mirror for the homepage/API
  fs.writeFileSync(
    path.join(DATA, "winners_100.json"),
    JSON.stringify(
      winners100.map((w, i) => ({
        rank: i + 1,
        slug: w.slug,
        question: w.question,
        category: w.category,
        priorityScore: w.priorityScore,
        monetizationType: w.monetizationType,
        suggestedTool: w.suggestedTool,
      })),
      null,
      2,
    ),
  );

  writeBriefs(winners500);

  const top = winners100.slice(0, 15);
  console.log(`Scored ${scored.length} questions`);
  console.log(`Quality pass: ${scored.filter((s) => s.qualityPass).length}`);
  console.log(`Winners: ${winners500.length} clean opportunities (target up to 500)`);
  console.log("\nTop 15:");
  for (const [i, w] of top.entries()) {
    console.log(
      `${String(i + 1).padStart(2)}. [${w.priorityScore}] ${w.question} (${w.category})`,
    );
  }

  const byCat = winners500.reduce<Record<string, number>>((acc, w) => {
    acc[w.category] = (acc[w.category] ?? 0) + 1;
    return acc;
  }, {});
  console.log("\nTop 500 by category:");
  console.log(
    Object.entries(byCat)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `  ${k}: ${v}`)
      .join("\n"),
  );
}

main();
