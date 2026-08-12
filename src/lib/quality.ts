import type { Question } from "./types";

const TEMPLATE_SUFFIXES = [
  /\s+for beginners\??$/i,
  /\s+for a laptop\??$/i,
  /\s+for a desktop( pc)?\??$/i,
  /\s+for gaming\??$/i,
  /\s+for work\??$/i,
  /\s+for students\??$/i,
  /\s+with a router\??$/i,
  /\s+without an internet connection\??$/i,
];

const TEMPLATE_HOWTO_VERBS =
  /^(how do i|how to) (set up|use|test|check|reset|update|connect|configure|troubleshoot|improve|safely use)\b/i;

/** Objects that only appear when a problem seed was verb-expanded. */
const PROBLEM_OBJECTS = [
  /\bmy ssd slow\b/i,
  /\bmy hard drive slow\b/i,
  /\ban ssd fail suddenly\b/i,
  /\ba hard drive fail\b/i,
  /\bmy gpu crash\b/i,
  /\bgpu crash under load\b/i,
  /\bmy gpu usage low\b/i,
  /\bgpu usage low in games\b/i,
  /\bmy gpu usage at 100\b/i,
  /\bgpu usage at 100 percent\b/i,
  /\bmy wifi slow\b/i,
  /\bmy phone battery draining\b/i,
  /\bmy phone charging slowly\b/i,
  /\bphone get hot\b/i,
  /\bwindows update stuck\b/i,
  /\bfsr work on\b/i,
  /\bdlss improve\b/i,
  /\bray tracing reduce\b/i,
  /\bfail suddenly\b/i,
  /\bworth it for\b/i,
  /\bdraining so fast\b/i,
  /\bcharging slowly\b/i,
  /\bkeeps disconnecting\b/i,
  /\busing so much (ram|cpu)\b/i,
];

const TEMPLATE_MODIFIERS = [
  /\swith bluetooth headphones\b/i,
  /\swith an ev\b/i,
  /\swith a smart tv\b/i,
  /\swhen traveling\b/i,
  /\swithout installing software\b/i,
  /\son a slow connection\b/i,
  /\swith a vpn\b/i,
  /\swith a router\b/i,
];

/**
 * Natural search-style questions only.
 * Seed CSV expands each topic into template variants — those fail here.
 */
export function isHighQualityQuestion(q: Question): boolean {
  const text = q.question.trim();
  const words = text.replace(/\?/g, "").split(/\s+/).filter(Boolean);

  if (words.length < 4 || words.length > 16) return false;
  if (TEMPLATE_SUFFIXES.some((re) => re.test(text))) return false;
  if (TEMPLATE_MODIFIERS.some((re) => re.test(text))) return false;

  // Classic post-seed template rows
  if (/^what is my /i.test(text)) return false;
  if (/^how does my /i.test(text)) return false;
  if (/ important\?$/i.test(text)) return false;
  if (/^what are the advantages of /i.test(text)) return false;
  if (/^what are the disadvantages of /i.test(text)) return false;
  if (/compatible with older devices/i.test(text)) return false;
  if (/^is .+ safe\?$/i.test(text)) return false;
  if (/^how does .+ work\?$/i.test(text)) return false;
  if (/^what should i know about /i.test(text)) return false;
  if (/^is my /i.test(text)) return false;

  // Mangled from "How long does X usually last?"
  if (/\busually last\b/i.test(text)) return false;

  // Mangled comparisons: "How do I check NVMe faster than SATA?"
  if (/^how do i .+\bfaster than\b/i.test(text)) return false;

  // Problem statements only valid as why/fix queries
  if (/\b(running slowly|freeze randomly|monitor flickering)\b/i.test(text)) {
    if (!/^(why\b|how do i fix\b)/i.test(text)) return false;
  }

  // Verb expansions of problem statements
  if (TEMPLATE_HOWTO_VERBS.test(text) && PROBLEM_OBJECTS.some((re) => re.test(text))) {
    return false;
  }

  // Catch-all: howto template verb + problem adjective/clause as object
  if (
    TEMPLATE_HOWTO_VERBS.test(text) &&
    /\b(slow|stuck|draining|crash|crashing|fail suddenly|usage low|usage at 100|get hot|overheating|not working|worth it|flickering)\b/i.test(
      text,
    )
  ) {
    if (!/^how do i (fix|repair|diagnose|recover|speed up)\b/i.test(text)) {
      return false;
    }
  }

  // "How do I set up SSD storage?" / "use ray tracing?" — bare concept, not a real task
  if (/^how do i (set up|use|troubleshoot|test|configure)\b/i.test(text)) {
    const rest = text
      .replace(/^how do i (set up|use|troubleshoot|test|configure)\s+/i, "")
      .replace(/\?$/, "");
    const hasArticle = /^(a|an|my|the)\s/i.test(rest);
    const hasComplement = /\b(to|for|from|on|with|in|into|without|using|that)\b/i.test(rest);
    if (!hasArticle && !hasComplement) return false;
  }

  // "How do I check/update/connect {bare concept}?"
  if (/^how do i (check|reset|update|connect)\s+[a-z0-9][a-z0-9 +\-/]{1,40}\?$/i.test(text)) {
    const rest = text
      .replace(/^how do i (check|reset|update|connect)\s+/i, "")
      .replace(/\?$/, "");
    if (
      /^(ssd storage|hdd storage|nvme|sata|ray tracing|dlss|amd fsr|path tracing|frame generation|wifi\s*\d|bluetooth|gpu bottlenecking)$/i.test(
        rest,
      )
    ) {
      return false;
    }
  }

  if (/^how do i set up .+\bwork\b/i.test(text)) return false;

  const naturalOpen =
    /^(how do i |how to |how (much|many|long|far|often) |why (is|does|do|can|won'?t) |what is (?!my )|what causes |what is the difference |what happens |does |do |can |should i |is (?!my )|are )/i;
  if (!naturalOpen.test(text)) return false;

  if (/worth (it|upgrading)/i.test(text) && /\b(slow|stuck|draining|crash|hot|fail)\b/i.test(text)) {
    return false;
  }

  if (/\bphone get hot\b/i.test(text)) return false;
  if (/\bmy wifi slow\b/i.test(text)) return false;

  // More mangled expansions
  if (/the difference between/i.test(text) && !/^what is the difference between/i.test(text)) {
    return false;
  }
  if (/^can my /i.test(text)) return false;
  if (/^does my (phone|wifi|gpu|ssd|computer|tv) /i.test(text)) return false;
  if (/^why is my .+ not working\?/i.test(text)) return false;
  if (/^how (much|long) does my /i.test(text)) return false;
  if (/\bkeep disconnecting\b/i.test(text) && !/^why\b/i.test(text)) return false;
  if (/\bcompatible with\b/i.test(text) && /^how do i\b/i.test(text)) return false;
  if (/\bworth upgrading\b/i.test(text) && /^how do i\b/i.test(text)) return false;
  if (/\bhave better range\b/i.test(text) && !/^why\b/i.test(text)) return false;
  if (
    /^how do i (set up|use|troubleshoot|test|check|reset|update|connect) (a|an) (gpu|ssd|monitor|cpu|ev)\?$/i.test(
      text,
    )
  ) {
    return false;
  }

  // Grammar wreckage from template engines
  if (/\bit cost to\b/i.test(text)) return false;
  if (/^how do i \w+ i /i.test(text)) return false;
  if (/\bcheaper than\b/i.test(text) && /^how do i\b/i.test(text)) return false;
  if (/\brouter reach\b/i.test(text) && !/^how far\b/i.test(text)) return false;
  if (/\bwindows need\b/i.test(text)) return false;
  if (/\bfail (at home|on windows|on macos|on android|on iphone|with a)\b/i.test(text)) {
    return false;
  }
  if (/^does .+ use a lot of power\?/i.test(text)) return false;
  if (/^how do i (reset|update|connect) .+ clock speed/i.test(text)) return false;
  if (/^why is .+ not working\?/i.test(text) && !/\b(wifi|internet|printer|bluetooth)\b/i.test(text)) {
    // Keep real "why is X not working" for devices; reject concept mashups later via seed window
  }

  return true;
}

/** Extra-strict gate for the published winners list. */
export function isWinnerCandidate(q: Question): boolean {
  if (!isHighQualityQuestion(q)) return false;
  const text = q.question;

  // Prefer actionable / diagnostic queries over ultra-broad definitions for wave 1
  if (/^what is [a-z0-9 +\-]{1,20}\?$/i.test(text)) return false;

  // Late template leftovers that still sneak past
  if (/and older technology/i.test(text)) return false;
  if (/\bgaming pc need\b/i.test(text)) return false;
  if (/\bwindows need\b/i.test(text)) return false;
  if (/^how do i (set up|use|troubleshoot|test|check|reset|update|connect) (cloud computing|ac charging)\?/i.test(text)) {
    return false;
  }
  if (/^how do i (set up|use|troubleshoot|test) my .+ (offline|printing blank pages|not recognized)\?/i.test(text)) {
    return false;
  }
  if (/have better range not working/i.test(text)) return false;
  if (/^why is path tracing not working/i.test(text)) return false;

  return true;
}

export function qualityLabel(q: Question): "ready" | "needs-review" {
  return isHighQualityQuestion(q) ? "ready" : "needs-review";
}
