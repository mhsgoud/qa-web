import fs from "node:fs";
import path from "node:path";

export type WinnerRecord = {
  rank: number;
  id?: number;
  slug: string;
  question: string;
  category: string;
  priorityScore: number;
  volumeScore?: number;
  commercialScore?: number;
  competitionScore?: number;
  monetizationType: string;
  suggestedTool: string;
  primaryKeyword?: string;
};

let cache: WinnerRecord[] | null = null;

export function getWinners(): WinnerRecord[] {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "data", "winners.json");
  if (!fs.existsSync(filePath)) return [];
  cache = JSON.parse(fs.readFileSync(filePath, "utf8")) as WinnerRecord[];
  return cache;
}

export function getTopWinners(limit = 12): WinnerRecord[] {
  return getWinners().slice(0, limit);
}

export function getWinnerSlugs(): string[] {
  return getWinners().map((w) => w.slug);
}

export function isWinnerSlug(slug: string): boolean {
  return getWinnerSlugs().includes(slug);
}
