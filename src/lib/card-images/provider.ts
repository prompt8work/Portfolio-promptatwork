// The image model behind card images. OpenAI's Images API by default; to
// switch providers, replace generateCardImage — nothing else calls the
// model directly.
//
// Server-only env: OPENAI_API_KEY (required), CARD_IMAGE_MODEL (default
// gpt-image-1) and CARD_IMAGE_QUALITY (low | medium | high, default medium).

export type GeneratedImage = { data: Buffer; contentType: string; ext: string; model: string };

export function cardImagesConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function generateCardImage(prompt: string): Promise<GeneratedImage> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");
  const model = process.env.CARD_IMAGE_MODEL || "gpt-image-1";

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size: "1536x1024",
      quality: process.env.CARD_IMAGE_QUALITY || "medium",
      output_format: "webp",
      output_compression: 85,
    }),
  });
  if (!res.ok) {
    throw new Error(`Image generation failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image generation returned no image");
  return { data: Buffer.from(b64, "base64"), contentType: "image/webp", ext: "webp", model };
}
