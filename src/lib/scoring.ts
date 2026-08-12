import type { Question } from "./types";
import { isHighQualityQuestion, isWinnerCandidate } from "./quality";

export type ScoreBands = "very-low" | "low" | "medium" | "high" | "very-high";

export type ScoredQuestion = Question & {
  primaryKeyword: string;
  volumeScore: number;
  commercialScore: number;
  competitionScore: number; // higher = harder
  easeScore: number; // higher = easier to rank
  contentDifficulty: number; // higher = harder to write well
  qualityPass: boolean;
  priorityScore: number;
  volumeBand: ScoreBands;
  commercialBand: ScoreBands;
  competitionBand: ScoreBands;
  monetizationType: string;
  suggestedTool: string;
  articleTitle: string;
  reason: string;
  categoryOrdinal: number;
};

const CATEGORY_VOLUME: Record<string, number> = {
  Smartphones: 88,
  Windows: 82,
  WiFi: 80,
  AI: 78,
  GPUs: 76,
  Computers: 74,
  macOS: 72,
  Security: 70,
  Storage: 68,
  "Internet Services": 66,
  Networking: 64,
  Monitors: 62,
  Cloud: 60,
  TV: 58,
  "Smart Home": 56,
  USB: 55,
  Bluetooth: 54,
  EVs: 54,
  Printers: 52,
  Audio: 50,
  Software: 50,
  "PC Hardware": 58,
  Web: 48,
  Programming: 46,
  Databases: 42,
  "Developer Tools": 40,
};

const CATEGORY_COMMERCIAL: Record<string, number> = {
  GPUs: 95,
  EVs: 92,
  Monitors: 88,
  Storage: 86,
  Smartphones: 84,
  "PC Hardware": 82,
  Security: 80,
  Cloud: 78,
  "Smart Home": 76,
  TV: 74,
  Audio: 72,
  Printers: 70,
  WiFi: 68,
  Computers: 66,
  USB: 64,
  Networking: 60,
  "Internet Services": 58,
  Windows: 55,
  macOS: 52,
  Bluetooth: 50,
  Software: 48,
  AI: 70,
  Web: 42,
  Programming: 35,
  Databases: 32,
  "Developer Tools": 30,
};

const HIGH_VOLUME_TERMS = [
  ["iphone", 18],
  ["android", 16],
  ["windows", 16],
  ["wifi", 15],
  ["wi-fi", 15],
  ["password", 14],
  ["backup", 13],
  ["chatgpt", 14],
  ["gpu", 13],
  ["rtx", 14],
  ["ssd", 12],
  ["nvme", 11],
  ["icloud", 12],
  ["google", 10],
  ["chrome", 11],
  ["vpn", 13],
  ["router", 12],
  ["bluetooth", 10],
  ["usb-c", 12],
  ["usb c", 12],
  ["macbook", 12],
  ["monitor", 11],
  ["4k", 10],
  ["tesla", 12],
  ["printer", 10],
  ["firewall", 9],
  ["docker", 9],
  ["python", 10],
  ["javascript", 9],
  ["react", 9],
  ["aws", 10],
  ["azure", 9],
  ["openai", 11],
] as const;

const COMMERCIAL_TERMS = [
  ["best", 18],
  ["vs", 16],
  ["worth buying", 20],
  ["worth it", 14],
  ["upgrade", 14],
  ["buy", 16],
  ["compatible", 12],
  ["charger", 14],
  ["cable", 10],
  ["router", 12],
  ["vpn", 16],
  ["ssd", 14],
  ["gpu", 16],
  ["rtx", 16],
  ["monitor", 14],
  ["hosting", 14],
  ["domain", 10],
  ["subscription", 12],
  ["plan", 8],
  ["replace", 10],
  ["external", 8],
  ["wireless", 8],
  ["dock", 10],
  ["hub", 8],
  ["power supply", 12],
  ["ev charger", 18],
  ["home charger", 16],
] as const;

const PROBLEM_TERMS = [
  ["not working", 12],
  ["slow", 10],
  ["draining", 11],
  ["error", 10],
  ["fix", 12],
  ["stuck", 11],
  ["won't", 10],
  ["cant", 8],
  ["can't", 10],
  ["failed", 9],
  ["keeps", 8],
  ["overheating", 11],
  ["disconnected", 9],
] as const;

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function band(score: number): ScoreBands {
  if (score >= 80) return "very-high";
  if (score >= 65) return "high";
  if (score >= 45) return "medium";
  if (score >= 25) return "low";
  return "very-low";
}

function termBoost(text: string, terms: ReadonlyArray<readonly [string, number]>) {
  let total = 0;
  for (const [term, boost] of terms) {
    if (text.includes(term)) total += boost;
  }
  return total;
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).length;
}

export function toPrimaryKeyword(question: string): string {
  return question
    .toLowerCase()
    .replace(/[?.,!]/g, "")
    .replace(/^(how do i|how to|what is|what are|why is|why does|why do|does|is|can i)\s+/i, "")
    .trim();
}

function monetizationType(q: Question, commercial: number, text: string): string {
  if (
    /gpu|rtx|monitor|ssd|nvme|router|vpn|charger|macbook|iphone|tesla|ev\b|hosting/.test(
      text,
    )
  ) {
    return commercial >= 70 ? "Affiliate + AdSense" : "Affiliate";
  }
  if (/backup|transfer|password|fix|error|slow|wifi|windows|android/.test(text)) {
    return "AdSense + tool upsell";
  }
  if (q.category === "Programming" || q.category === "Developer Tools") {
    return "AdSense (low) / newsletter";
  }
  return commercial >= 60 ? "AdSense + affiliate" : "AdSense";
}

function suggestedTool(q: Question, text: string): string {
  if (/ram|memory/.test(text)) return "RAM needs calculator";
  if (/gpu|rtx|graphics/.test(text)) return "GPU comparison tool";
  if (/wifi|wi-fi|router|speed/.test(text)) return "Wi‑Fi speed / channel helper";
  if (/usb|charger|charging|watt/.test(text)) return "USB‑C / charger compatibility checker";
  if (/ssd|nvme|storage|disk/.test(text)) return "Storage speed / upgrade picker";
  if (/monitor|4k|1440|resolution/.test(text)) return "Monitor + GPU match advisor";
  if (/ev|tesla|charging station/.test(text)) return "EV home charger calculator";
  if (/backup|transfer|migrate/.test(text)) return "Backup checklist wizard";
  if (/password|security|vpn/.test(text)) return "Security setup checklist";
  if (q.category === "AI") return "Model / use-case picker";
  return "Related Q&A cluster + checklist";
}

/**
 * Heuristic opportunity score (no paid SEO API).
 * priority ≈ volume × commercial × ease / contentDifficulty
 * Ease = inverse of competition.
 */
export function scoreQuestion(q: Question): ScoredQuestion {
  const text = q.question.toLowerCase();
  const words = wordCount(q.question);
  const qualityPass = isHighQualityQuestion(q);

  let volume = CATEGORY_VOLUME[q.category] ?? 45;
  volume += termBoost(text, HIGH_VOLUME_TERMS);
  volume += termBoost(text, PROBLEM_TERMS) * 0.55;

  if (/^how (do i|to)\b/.test(text)) volume += 10;
  if (/^why\b/.test(text)) volume += 8;
  if (/^what is\b/.test(text)) volume += 12;
  if (/^does\b/.test(text)) volume += 7;
  if (q.intent === "How-to") volume += 6;

  // Sweet-spot length for long-tail demand
  if (words >= 6 && words <= 12) volume += 8;
  else if (words >= 13 && words <= 16) volume += 3;
  else if (words > 18) volume -= 12;
  else if (words < 5) volume += 4; // broad head terms

  // Template / awkward questions get crushed
  if (!qualityPass) volume -= 45;
  if (/without an internet connection/.test(text)) volume -= 25;
  if (/advantages of|disadvantages of|worth it\?|compatible with older devices/.test(text)) {
    volume -= 20;
  }

  let commercial = CATEGORY_COMMERCIAL[q.category] ?? 40;
  commercial += termBoost(text, COMMERCIAL_TERMS);
  if (/fix|error|not working|slow|draining/.test(text)) commercial += 6; // ads intent
  if (/what is|what are|explain/.test(text) && commercial > 50) commercial -= 8;
  if (!qualityPass) commercial -= 30;

  // Competition: higher = harder
  let competition = 40;
  if (words <= 5) competition += 25;
  if (words >= 10 && words <= 16) competition -= 12;
  if (words > 16) competition -= 8;
  if (/^what is\b/.test(text) && words <= 6) competition += 22;
  if (/^how (do i|to)\b/.test(text) && words >= 8) competition -= 10;
  if (termBoost(text, HIGH_VOLUME_TERMS) >= 20) competition += 10;
  if (/vs|best /.test(text)) competition += 14;
  if (q.category === "Programming" || q.category === "Developer Tools") competition += 8;
  if (q.category === "GPUs" || q.category === "AI") competition += 10;
  if (!qualityPass) competition += 25;

  competition = clamp(competition);
  const easeScore = clamp(100 - competition);

  // Content difficulty: specific how-tos easier than deep systems topics
  let contentDifficulty = 40;
  if (q.category === "AI" || q.category === "Databases" || q.category === "Networking") {
    contentDifficulty += 15;
  }
  if (/how (do i|to)\b/.test(text)) contentDifficulty -= 8;
  if (/what is\b/.test(text)) contentDifficulty += 5;
  if (/compare|vs|architecture|encrypt|kernel/.test(text)) contentDifficulty += 12;
  contentDifficulty = clamp(contentDifficulty, 20, 90);

  volume = clamp(volume);
  commercial = clamp(commercial);

  // Core formula: volume × commercial × ease, normalized ~0–100
  // Content difficulty lowers score for topics that are hard to write well.
  const raw =
    ((volume / 100) * (commercial / 100) * (easeScore / 100) * (50 / contentDifficulty)) *
    100;
  const qualityMultiplier = qualityPass ? 1 : 0.05;
  const priorityScore = Math.round(raw * qualityMultiplier * 10) / 10;

  const reasons: string[] = [];
  if (volume >= 70) reasons.push("strong demand signals");
  if (commercial >= 70) reasons.push("high monetization potential");
  if (easeScore >= 60) reasons.push("rankable long-tail shape");
  if (!qualityPass) reasons.push("quality filter failed");
  if (priorityScore >= 80) reasons.push("top-tier opportunity");

  return {
    ...q,
    primaryKeyword: toPrimaryKeyword(q.question),
    volumeScore: Math.round(volume),
    commercialScore: Math.round(commercial),
    competitionScore: Math.round(competition),
    easeScore: Math.round(easeScore),
    contentDifficulty: Math.round(contentDifficulty),
    qualityPass,
    priorityScore,
    volumeBand: band(volume),
    commercialBand: band(commercial),
    competitionBand: band(competition),
    monetizationType: monetizationType(q, commercial, text),
    suggestedTool: suggestedTool(q, text),
    articleTitle: q.question.replace(/\?$/, "") + (q.question.endsWith("?") ? "?" : ""),
    reason: reasons.join("; ") || "balanced mid-tier topic",
    categoryOrdinal: 0,
  };
}

export function scoreAll(questions: Question[]): ScoredQuestion[] {
  const categoryIndex = new Map<string, number>();

  const scored = questions.map((q) => {
    const idx = categoryIndex.get(q.category) ?? 0;
    categoryIndex.set(q.category, idx + 1);
    const result = scoreQuestion(q);

    // Earlier rows in each category are usually natural seeds, not expansions
    let seedBoost = 0;
    if (idx < 20) seedBoost = 12;
    else if (idx < 40) seedBoost = 6;
    else if (idx > 80) seedBoost = -8;

    const volumeScore = Math.max(
      0,
      Math.min(100, result.volumeScore + seedBoost),
    );
    const easeScore = result.easeScore;
    const commercialScore = result.commercialScore;
    const contentDifficulty = result.contentDifficulty;
    const raw =
      ((volumeScore / 100) *
        (commercialScore / 100) *
        (easeScore / 100) *
        (50 / contentDifficulty)) *
      100;
    const priorityScore =
      Math.round(raw * (result.qualityPass ? 1 : 0.05) * 10) / 10;

    return {
      ...result,
      categoryOrdinal: idx,
      volumeScore,
      volumeBand: band(volumeScore),
      priorityScore,
      reason:
        seedBoost > 0 && result.qualityPass
          ? `${result.reason}; early-category seed`
          : result.reason,
    };
  });

  return scored.sort((a, b) => b.priorityScore - a.priorityScore);
}

export function pickWinners(scored: ScoredQuestion[], limit = 500): ScoredQuestion[] {
  const seen = new Set<string>();
  const winners: ScoredQuestion[] = [];

  // CSV structure: first ~22 rows per category are natural seeds; later rows are expansions.
  for (const item of scored) {
    if (!isWinnerCandidate(item)) continue;
    if (item.categoryOrdinal >= 22) continue;
    const key = item.primaryKeyword.replace(/\s+/g, " ").slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    winners.push(item);
    if (winners.length >= limit) break;
  }

  // Optional fill: only slightly later seeds (still early), never deep template rows
  if (winners.length < limit) {
    for (const item of scored) {
      if (!isWinnerCandidate(item)) continue;
      if (item.categoryOrdinal >= 35) continue;
      const key = item.primaryKeyword.replace(/\s+/g, " ").slice(0, 80);
      if (seen.has(key)) continue;
      seen.add(key);
      winners.push(item);
      if (winners.length >= limit) break;
    }
  }

  return winners;
}
