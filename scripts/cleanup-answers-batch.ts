/**
 * Keep only answer JSON for slugs in data/winners_1000.json.
 * Deletes junk drafts from the aborted scored-CSV run.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const BATCH = path.join(ROOT, "data", "winners_1000.json");

const keep = new Set(
  (JSON.parse(fs.readFileSync(BATCH, "utf8")) as { slug: string }[]).map((r) => r.slug),
);

let removed = 0;
let kept = 0;
for (const file of fs.readdirSync(ANSWERS_DIR)) {
  if (!file.endsWith(".json")) continue;
  const slug = file.replace(/\.json$/, "");
  if (keep.has(slug)) {
    kept++;
    continue;
  }
  fs.unlinkSync(path.join(ANSWERS_DIR, file));
  removed++;
}

console.log(`kept ${kept}, removed ${removed}, target ${keep.size}`);
const missing = [...keep].filter((slug) => !fs.existsSync(path.join(ANSWERS_DIR, `${slug}.json`)));
console.log(`missing answers to generate: ${missing.length}`);
fs.writeFileSync(
  path.join(ROOT, "data", "missing_answers.json"),
  JSON.stringify(missing, null, 2),
);
