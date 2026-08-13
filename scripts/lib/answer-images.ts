import fs from "node:fs";
import path from "node:path";
import type { AnswerContent, AnswerImage } from "../../src/lib/types";

export type ImagePlan = {
  id: string;
  attachTo: string;
  prompt: string;
  alt: string;
  caption?: string;
};

const STYLE_PREFIX =
  "Clean flat vector-style tech editorial illustration for a help article. Soft blue and white palette, minimal detail, no readable text or UI labels on screens. ";

function getApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env");
  }
  return apiKey;
}

function getTextModel(): string {
  return process.env.OPENAI_MODEL ?? "gpt-4o-mini";
}

function getImageModel(): string {
  return process.env.OPENAI_IMAGE_MODEL ?? "gpt-image-1";
}

function imageModelFallbacks(): string[] {
  const preferred = getImageModel();
  const defaults = ["gpt-image-1", "dall-e-2", "dall-e-3"];
  return [preferred, ...defaults.filter((m) => m !== preferred)];
}

function getImageSize(): string {
  return process.env.OPENAI_IMAGE_SIZE ?? "1024x1024";
}

export function publicImageDir(slug: string): string {
  return path.join(process.cwd(), "public", "answers", slug);
}

export function publicImagePath(slug: string, imageId: string): string {
  return `/answers/${slug}/${imageId}.png`;
}

export async function planImagesFromAnswer(
  answer: AnswerContent,
  question: string,
): Promise<ImagePlan[]> {
  const apiKey = getApiKey();
  const attachTargets = [
    "hero",
    ...((answer.steps ?? []).map((_, i) => `step-${i}`)),
    ...answer.sections.map((s) => s.id),
  ];

  const context = {
    question,
    directAnswer: answer.directAnswer,
    steps: answer.steps ?? [],
    sections: answer.sections.map((s) => ({ id: s.id, heading: s.heading, body: s.body })),
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: getTextModel(),
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You plan illustration assets for practical tech help articles. Output only valid JSON. Illustrations should be conceptual/educational, not photorealistic fake OS screenshots.",
        },
        {
          role: "user",
          content: `Plan 3-4 illustrations for this answer page.

Question: ${question}
Answer context:
${JSON.stringify(context, null, 2)}

Valid attachTo values (use exactly one per image):
${attachTargets.map((t) => `- ${t}`).join("\n")}

Return JSON:
{
  "imagePlans": [
    {
      "id": "kebab-case-id",
      "attachTo": "hero or step-N or section-id",
      "prompt": "Detailed illustration prompt (no text in image)",
      "alt": "Accessible alt text",
      "caption": "Optional short caption"
    }
  ]
}

Rules:
- Include exactly one hero image (attachTo: "hero").
- Attach remaining images to the most relevant steps (step-0, step-1, ...) when it's a how-to.
- Prompts must describe a generic illustration, not a pixel-perfect OS screenshot.
- Do not duplicate attachTo values.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI planning error ${response.status}: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };

  const content = data.choices[0]?.message?.content;
  if (!content) throw new Error("Empty image plan response from OpenAI");

  const parsed = JSON.parse(content) as { imagePlans?: ImagePlan[] };
  if (!parsed.imagePlans?.length) {
    throw new Error("No image plans returned");
  }

  return parsed.imagePlans;
}

export async function generateImageFile(
  slug: string,
  plan: ImagePlan,
): Promise<AnswerImage> {
  const apiKey = getApiKey();
  const size = getImageSize();
  const fullPrompt = `${STYLE_PREFIX}${plan.prompt}`;
  let lastError = "No image models available";

  for (const model of imageModelFallbacks()) {
    const body: Record<string, unknown> = {
      model,
      prompt: fullPrompt,
      n: 1,
      size,
    };

    if (model.startsWith("dall-e")) {
      body.response_format = "b64_json";
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return saveImageResponse(slug, plan, await response.json());
    }

    const errText = await response.text();
    lastError = errText;

    if (errText.includes("response_format") && body.response_format) {
      delete body.response_format;
      const retry = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (retry.ok) {
        return saveImageResponse(slug, plan, await retry.json());
      }
      lastError = await retry.text();
    }

    const invalidModel =
      errText.includes("does not exist") || errText.includes("invalid_value");
    if (invalidModel) {
      console.warn(`  model ${model} unavailable, trying next...`);
      continue;
    }

    throw new Error(`OpenAI image error for "${plan.id}" ${response.status}: ${errText}`);
  }

  throw new Error(`OpenAI image error for "${plan.id}": ${lastError}`);
}

async function saveImageResponse(
  slug: string,
  plan: ImagePlan,
  data: { data: { b64_json?: string; url?: string }[] },
): Promise<AnswerImage> {
  const item = data.data[0];
  if (!item) throw new Error(`No image data returned for "${plan.id}"`);

  const dir = publicImageDir(slug);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${plan.id}.png`);

  if (item.b64_json) {
    fs.writeFileSync(filePath, Buffer.from(item.b64_json, "base64"));
  } else if (item.url) {
    const imgRes = await fetch(item.url);
    if (!imgRes.ok) {
      throw new Error(`Failed to download image for "${plan.id}": ${imgRes.status}`);
    }
    fs.writeFileSync(filePath, Buffer.from(await imgRes.arrayBuffer()));
  } else {
    throw new Error(`No image payload returned for "${plan.id}"`);
  }

  return {
    id: plan.id,
    src: publicImagePath(slug, plan.id),
    alt: plan.alt,
    caption: plan.caption,
    attachTo: plan.attachTo,
  };
}

export async function generateImagesForAnswer(
  slug: string,
  answer: AnswerContent,
  question: string,
  options: { force?: boolean } = {},
): Promise<AnswerImage[]> {
  if (answer.images?.length && !options.force) {
    return answer.images;
  }

  const plans = await planImagesFromAnswer(answer, question);
  const images: AnswerImage[] = [];

  for (const plan of plans) {
    console.log(`  image ${plan.id} (${plan.attachTo})...`);
    const image = await generateImageFile(slug, plan);
    images.push(image);
    await new Promise((r) => setTimeout(r, 1200));
  }

  return images;
}

export function imagesForAttach(
  images: AnswerImage[] | undefined,
  attachTo: string,
): AnswerImage[] {
  return (images ?? []).filter((img) => img.attachTo === attachTo);
}
