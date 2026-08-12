import fs from "node:fs";
import Papa from "papaparse";

const d = Papa.parse<Record<string, string>>(
  fs.readFileSync("data/winners_500.csv", "utf8"),
  { header: true, skipEmptyLines: true },
).data;

console.log("count", d.length);
console.log("\n--- 200-220 ---");
d.slice(199, 220).forEach((r, i) => console.log(`${200 + i}. ${r.question}`));
console.log("\n--- 480-500 ---");
d.slice(479).forEach((r, i) => console.log(`${480 + i}. ${r.question}`));

const junk = d.filter((r) =>
  /the difference between|usually last|fail at home|it cost to|running slowly with|for beginners|compatible with older|advantages of/i.test(
    r.question,
  ),
);
console.log("\njunk leftover", junk.length);
junk.slice(0, 10).forEach((j) => console.log(" -", j.question));
