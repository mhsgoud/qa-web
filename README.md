# AnswerKit

Technology Q&A at [answerkit.tech](https://answerkit.tech).

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Fill in answers

Answers live as JSON files in `data/answers/`. Copy `data/answers/_template.json` and rename it to your slug:

```
data/answers/how-do-i-connect-a-monitor-to-a-laptop.json
```

Required fields: `slug`, `directAnswer`, `summary`, `sections`, `status`, `updatedAt`.

Status workflow:

- `draft` — generated or in progress (noindex, not pre-built)
- `reviewed` — human-checked preview (noindex, not pre-built)
- `published` — live for SEO (indexed, pre-built at deploy, in sitemap)

### Generate with OpenAI

1. Get an API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Create `.env` in the project root:

```bash
cp .env.example .env
```

3. Add your key:

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

4. Run generation:

```bash
npm run answers:generate              # top 20, skip existing
npm run answers:generate -- --limit=50
npm run answers:generate -- --force     # overwrite stubs
npm run answers:generate -- --slug=how-do-i-clone-an-ssd
```

Output goes to `data/answers/[slug].json` with `"status": "draft"`.

5. **Review each file** — fix inaccuracies, then change status to `reviewed` or `published`.

6. Restart dev server if needed: `npm run dev`

Cost ballpark: ~$0.01–0.03 per answer with `gpt-4o-mini` (20 answers ≈ $0.20–0.60).

## Score opportunities

```bash
npm run score
```

Writes:

- `data/scored_questions_10000.csv` — full scored catalog
- `data/winners.csv` / `data/winners.json` — clean priority list (wave 1)
- `data/winners_100.csv` — top 100 cut
- `data/briefs/*.json` — generation briefs for each winner

Scoring formula (heuristic, no paid SEO API):

`priority ≈ volume × commercial × ease ÷ contentDifficulty`

with a hard quality gate that drops templated CSV expansions.

## What’s included

- Landing page with search and topic browse
- `/q/[slug]` answer pages for all 10,000 questions
- `/winners` priority queue for content generation
- Sample hand-written answers (quality bar for later AI generation)
- FAQ JSON-LD on answer pages

## Content strategy

Do not bulk-publish thin AI pages. Generate → review → mark `published`. See `src/lib/generation.ts` for the content contract.
