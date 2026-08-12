import fs from "node:fs";
import Papa from "papaparse";

const d = Papa.parse<Record<string, string>>(
  fs.readFileSync("data/tech_questions_10000.csv", "utf8"),
  { header: true, skipEmptyLines: true },
).data;

const suffixes = [
  "for beginners",
  "for a laptop",
  "for a desktop",
  "for gaming",
  "for work",
  "for students",
  "with a router",
  "without an internet connection",
  "for home",
  "for office",
];

for (const s of suffixes) {
  console.log(s, d.filter((r) => r.question.toLowerCase().includes(s)).length);
}

const templateVerb = /\b(configure|test|reset|update|connect|improve|safely use|check)\b/i;
const broken = d.filter((r) => {
  const q = r.question.toLowerCase();
  return (
    suffixes.some((s) => q.includes(s)) ||
    /phone get hot/.test(q) ||
    /worth it for/.test(q) ||
    (/battery draining|charging slowly/.test(q) &&
      templateVerb.test(q) &&
      !/^why /.test(q) &&
      !/how do i fix/.test(q))
  );
});
console.log("broken-ish count", broken.length);
console.log("--- random mid samples ---");
for (const i of [50, 100, 200, 800, 2000, 4000, 7000]) {
  console.log(d[i]?.id, d[i]?.question);
}
