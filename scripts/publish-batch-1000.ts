/**
 * Set status=published on all answers in data/winners_1000.json.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ANSWERS_DIR = path.join(ROOT, "data", "answers");
const BATCH = JSON.parse(
  fs.readFileSync(path.join(ROOT, "data", "winners_1000.json"), "utf8"),
) as { slug: string }[];

let published = 0;
let missing = 0;
const today = new Date().toISOString().slice(0, 10);

for (const { slug } of BATCH) {
  const file = path.join(ANSWERS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) {
    missing++;
    continue;
  }
  const answer = JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>;
  answer.status = "published";
  answer.updatedAt = today;
  fs.writeFileSync(file, JSON.stringify(answer, null, 2) + "\n");
  published++;
}

console.log(`published=${published} missing=${missing} target=${BATCH.length}`);
