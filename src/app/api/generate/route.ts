import fs from "fs";
import path from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40; // 2 minutes max per side

const AGE_LABEL: Record<string, string> = {
  adult:       "{ethnicity} adult {gender} model",
  teen:        "{ethnicity} teen {gender} model, approximately 15 years old",
  "kids-6-12": "{ethnicity} child {gender} model, approximately 9 years old",
  "kids-2-5":  "{ethnicity} young child {gender} model, approximately 3 years old",
  toddler:     "{ethnicity} toddler model, approximately 1 year old",
};

const SIDE_SUFFIX: Record<string, string> = {
  front:             "",
  back:              "back view",
  "side-profile":    "side profile view",
  "side-view":       "side view",
  "top-down":        "top down view",
  "detail-close-up": "detail close-up shot",
  "interior-shot":   "interior shot",
};

const CATEGORY_HINT: Record<string, string> = {
  clothing: "fashion clothing photography",
  shoes:    "footwear photography, full body or feet focus",
  jewelry:  "jewelry editorial photography, close-up detail",
  bags:     "handbag product photography",
  hats:     "headwear photography, upper body",
};

const QUALITY_MODE: Record<string, string> = {
  standard: "performance",
  high:     "balanced",
  ultra:    "quality",
};

function buildPrompt(
  side: string,
  gender: string,
  ethnicity: string,
  occasion: string,
  ageGroup: string,
  category: string,
  background: string,
): string {
  const ageLabel = (AGE_LABEL[ageGroup] ?? `${ethnicity} ${gender} model`)
    .replace("{ethnicity}", ethnicity)
    .replace("{gender}", gender);
  const sideStr = SIDE_SUFFIX[side] ?? "";
  const catHint = CATEGORY_HINT[category] ?? "fashion photography";
  return `${ageLabel}, ${occasion} setting, ${background} background, ${catHint}${sideStr ? ", " + sideStr : ""}, professional fashion photography`;
}

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[/api/generate] request body:", JSON.stringify({ ...body, garmentImageUrl: body.garmentImageUrl }));

  const {
    garmentImageUrl, gender, ethnicity, occasion,
    ageGroup, category, background, sides, numImages, quality,
  } = body;

  if (!garmentImageUrl || !gender || !ethnicity || !occasion) {
    const missing = { garmentImageUrl, gender, ethnicity, occasion };
    console.warn("[/api/generate] missing fields:", missing);
    return Response.json(
      { error: "Missing required fields: garmentImageUrl, gender, ethnicity, occasion", received: missing },
      { status: 400 }
    );
  }

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });
  }

  const filePath = path.join(process.cwd(), "public", garmentImageUrl);
  let base64Image: string;
  try {
    const fileBuffer = fs.readFileSync(filePath);
    base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
  } catch (err) {
    console.error("[/api/generate] failed to read file:", filePath, err);
    return Response.json({ error: "Failed to read uploaded file" }, { status: 500 });
  }

  const sidesArr: string[] = Array.isArray(sides) && sides.length > 0 ? sides : ["front"];
  const nImages: number = typeof numImages === "number" && numImages >= 1 && numImages <= 4 ? numImages : 1;
  const qualityMode = QUALITY_MODE[quality as string] ?? "balanced";
  const resolvedAgeGroup = (ageGroup as string) ?? "adult";
  const resolvedCategory = (category as string) ?? "clothing";
  const resolvedBackground = (background as string) ?? "Studio White";

  const allImages: string[] = [];

  for (const side of sidesArr) {
    const prompt = buildPrompt(side, gender, ethnicity, occasion, resolvedAgeGroup, resolvedCategory, resolvedBackground);
    const fashnPayload = {
      model_name: "product-to-model",
      inputs: {
        product_image: base64Image,
        prompt,
        num_images: nImages,
        output_format: "png",
        generation_mode: qualityMode,
      },
    };
    console.log(`[/api/generate] side="${side}" prompt="${prompt}"`);

    const runRes = await fetch(`${FASHN_BASE}/run`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(fashnPayload),
    });

    if (!runRes.ok) {
      const text = await runRes.text();
      console.error("[/api/generate] FASHN /run error:", runRes.status, text);
      return Response.json({ error: `Failed to start generation: ${text}` }, { status: runRes.status });
    }

    const { id } = await runRes.json();
    console.log(`[/api/generate] side="${side}" job id:`, id);

    let sideOutput: string[] | null = null;

    for (let i = 0; i < MAX_POLLS; i++) {
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

      const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (!statusRes.ok) {
        const text = await statusRes.text();
        console.error("[/api/generate] FASHN /status error:", statusRes.status, text);
        return Response.json({ error: "Failed to poll generation status" }, { status: statusRes.status });
      }

      const statusData = await statusRes.json();
      console.log(`[/api/generate] side="${side}" poll ${i + 1}:`, statusData.status);
      const { status, output, error } = statusData;

      if (status === "completed") {
        sideOutput = output as string[];
        break;
      }

      if (status === "failed") {
        return Response.json({ error: error ?? "Generation failed" }, { status: 500 });
      }
    }

    if (!sideOutput) {
      return Response.json({ error: `Generation timed out on side: ${side}` }, { status: 504 });
    }

    allImages.push(...sideOutput);
  }

  // Download CDN images and save locally
  const generatedDir = path.join(process.cwd(), "public", "generated");
  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  const localImages: string[] = [];
  const timestamp = Date.now();
  for (let i = 0; i < allImages.length; i++) {
    const imageUrl = allImages[i];
    try {
      const imgRes = await fetch(imageUrl);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const filename = `generated-${timestamp}-${i}.jpg`;
      fs.writeFileSync(path.join(generatedDir, filename), buffer);
      localImages.push(`/generated/${filename}`);
    } catch (dlErr) {
      console.error("[/api/generate] failed to download image:", imageUrl, dlErr);
      localImages.push(imageUrl); // fall back to CDN URL on error
    }
  }

  // Save project to DB if user is authenticated
  try {
    const { userId } = await auth();
    if (userId) {
      const clerkUser = await currentUser();
      const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
      const user = await prisma.user.upsert({
        where: { clerkId: userId },
        create: { clerkId: userId, email },
        update: { email },
      });
      await prisma.project.create({
        data: {
          userId: user.id,
          name: `${resolvedCategory} · ${occasion} · ${ethnicity} ${gender}`,
          status: "completed",
          gender,
          ethnicity,
          occasion,
          uploads: { create: [{ imageUrl: garmentImageUrl }] },
          images: { create: localImages.map((imageUrl) => ({ imageUrl })) },
        },
      });
      console.log("[/api/generate] project saved to DB for user:", userId);
    }
  } catch (dbErr) {
    console.error("[/api/generate] failed to save project to DB:", dbErr);
  }

  return Response.json({ images: localImages });
}
