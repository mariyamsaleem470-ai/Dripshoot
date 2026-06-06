import fs, { existsSync } from "fs";
import path from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
export const runtime = "nodejs";

// ─── Provider setup ──────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Constants ───────────────────────────────────────────────────────────────

const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

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

const FABRIC_CATEGORY_HINT = (fabricStyle: string) =>
  `wearing a ${fabricStyle} made from this fabric, South Asian fashion`;

const SUIT_OPTIONS = [
  "italian-with-tie",
  "italian-without-tie",
  "double-button",
  "prince-suit",
  "long-coat",
  "italian-big-flaps",
];

const QUALITY_MODE: Record<string, string> = {
  standard: "performance",
  high:     "balanced",
  ultra:    "quality",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPrompt(
  category: string,
  side: string,
  gender: string,
  ethnicity: string,
  occasion: string,
  ageGroup: string,
  background: string,
  fabricStyle?: string,
  suitStyle?: string,
): string {
  if (fabricStyle && SUIT_OPTIONS.includes(fabricStyle)) {
    return `wearing a ${fabricStyle.replace(/-/g, " ")} suit, ${ethnicity} ${gender} model, ${occasion} setting, ${background} background, professional fashion photography`;
  }

  const ageLabel = (AGE_LABEL[ageGroup] ?? `${ethnicity} ${gender} model`)
    .replace("{ethnicity}", ethnicity)
    .replace("{gender}", gender);
  const sideStr = SIDE_SUFFIX[side] ?? "";
  const catHint =
    (category === "fabric-male" || category === "fabric-female") && fabricStyle
      ? FABRIC_CATEGORY_HINT(fabricStyle)
      : (CATEGORY_HINT[category] ?? "fashion photography");
  const suitStr = suitStyle ? `, wearing a ${suitStyle.replace(/-/g, " ")} suit` : "";
  return `${ageLabel}${suitStr}, ${occasion.toLowerCase()} setting, ${background.toLowerCase()} background, ${catHint}${sideStr ? ", " + sideStr : ""}, professional fashion photography, high quality`;
}

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "dripshoots",
    resource_type: "image",
  });
  return result.secure_url;
}

async function generateWithFashn(
  base64Image: string,
  prompt: string,
  nImages: number,
  qualityMode: string,
  apiKey: string,
  fabricStyle?: string,
): Promise<string[]> {
  const categoryField =
    (fabricStyle?.toLowerCase().includes("shalwar") || fabricStyle?.toLowerCase().includes("kameez"))
      ? "full_body"
      : "upper_body";

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model_name: "product-to-model",
      inputs: {
        product_image: base64Image,
        prompt,
        num_images: nImages,
        output_format: "png",
        generation_mode: "fast",
      },
    }),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    throw new Error(`FASHN /run error ${runRes.status}: ${text}`);
  }

  const { id } = await runRes.json();
  console.log("[/api/generate] Fashn job id:", id);

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) {
      const text = await statusRes.text();
      throw new Error(`FASHN /status error ${statusRes.status}: ${text}`);
    }
    const { status, output, error } = await statusRes.json();
    console.log(`[/api/generate] Fashn poll ${i + 1}:`, status);
    if (status === "completed") return output as string[];
    if (status === "failed") throw new Error(error ?? "Fashn generation failed");
  }

  throw new Error("Fashn generation timed out");
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });

  const body = await request.json();
  console.log("[/api/generate] request body:", JSON.stringify({ ...body, garmentImageUrl: body.garmentImageUrl }));

  const {
    garmentImageUrl, gender, ethnicity, occasion,
    ageGroup, category, background, sides, numImages, quality, fabricStyle, suitStyle, customPrompt,
  } = body;

  if (!garmentImageUrl || !gender || !ethnicity || !occasion) {
    const missing = { garmentImageUrl, gender, ethnicity, occasion };
    console.warn("[/api/generate] missing fields:", missing);
    return Response.json(
      { error: "Missing required fields: garmentImageUrl, gender, ethnicity, occasion", received: missing },
      { status: 400 }
    );
  }

  const sidesArr: string[] = Array.isArray(sides) && sides.length > 0 ? sides : ["front"];
  const nImages: number = typeof numImages === "number" && numImages >= 1 && numImages <= 4 ? numImages : 1;
  const requiredCredits = sidesArr.length * nImages;

  if (user.credits < requiredCredits) {
    return Response.json(
      { error: "insufficient_credits", required: requiredCredits, available: user.credits },
      { status: 402 }
    );
  }

  const resolvedQuality = (quality as string) ?? "high";
  const resolvedAgeGroup = (ageGroup as string) ?? "adult";
  const resolvedCategory = (category as string) ?? "clothing";
  const resolvedBackground = (background as string) ?? "Studio White";

  // Read garment file for Fashn.ai (base64)
  const garmentFilePath = path.join(process.cwd(), "public", garmentImageUrl);
  console.log("[/api/generate] reading garment file:", garmentFilePath);

  if (!existsSync(garmentFilePath)) {
    console.error("[/api/generate] file not found:", garmentFilePath);
    return Response.json({ error: "Garment file not found. Please upload again." }, { status: 400 });
  }

  let base64Image = "";
  try {
    const fileBuffer = fs.readFileSync(garmentFilePath);
    base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
  } catch (err) {
    console.error("[/api/generate] failed to read garment file:", garmentFilePath, err);
    return Response.json({ error: "Failed to read uploaded file" }, { status: 500 });
  }

  const apiKey = process.env.FASHN_API_KEY ?? "";

  if (!apiKey) return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });

  const allImages: string[] = [];

  for (const side of sidesArr) {
    const prompt = (customPrompt as string | undefined) || buildPrompt(
      resolvedCategory, side, gender, ethnicity, occasion,
      resolvedAgeGroup, resolvedBackground,
      fabricStyle as string | undefined,
      suitStyle as string | undefined,
    );
    console.log(`[/api/generate] side="${side}" quality="${resolvedQuality}" prompt="${prompt}"`);

    let generatedUrls: string[] = [];

    try {
      const qualityMode = "performance";
      generatedUrls = await generateWithFashn(base64Image, prompt, nImages, qualityMode, apiKey, fabricStyle as string | undefined);
    } catch (genErr) {
      console.error(`[/api/generate] generation error for side="${side}":`, genErr);
      return Response.json({ error: String(genErr) }, { status: 500 });
    }

    // Upload each result to Cloudinary
    for (const url of generatedUrls) {
      try {
        const cloudinaryUrl = await uploadToCloudinary(url);
        allImages.push(cloudinaryUrl);
      } catch (upErr) {
        console.error("[/api/generate] Cloudinary upload failed:", url, upErr);
        allImages.push(url); // fall back to source URL
      }
    }
  }

  // Deduct credits and save project with Cloudinary URLs
  const totalImagesGenerated = allImages.length;
  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        credits: { decrement: totalImagesGenerated },
        creditsUsed: { increment: totalImagesGenerated },
      },
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
        images: { create: allImages.map((imageUrl) => ({ imageUrl })) },
      },
    });
    console.log("[/api/generate] project saved, credits deducted for user:", userId);
  } catch (dbErr) {
    console.error("[/api/generate] failed to save project/deduct credits:", dbErr);
  }

  return Response.json({ images: allImages });
}
