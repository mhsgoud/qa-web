import fs from "node:fs";
import Papa from "papaparse";

const d = Papa.parse<Record<string, string>>(
  fs.readFileSync("data/tech_questions_10000.csv", "utf8"),
  { header: true, skipEmptyLines: true },
).data;

// Show first 25 per a few categories — usually the natural seeds
for (const cat of ["GPUs", "WiFi", "Smartphones", "Storage", "Windows"]) {
  console.log(`\n=== ${cat} (first 25) ===`);
  d.filter((r) => r.category === cat)
    .slice(0, 25)
    .forEach((r) => console.log(r.id, r.question));
}

// Verb expansion detection
const verbs =
  /^(how do i|how to) (set up|use|test|check|reset|update|connect|configure|troubleshoot|improve|safely use|fix) /i;
const problems =
  /\b(crash|crashing|usage low|usage at 100|not working|draining|charging slowly|stuck|worth it|get hot|overheating|slow)\b/i;

let verbProblem = 0;
for (const r of d) {
  if (verbs.test(r.question) && problems.test(r.question)) verbProblem++;
}
console.log("\nverb+problem expansions", verbProblem);
