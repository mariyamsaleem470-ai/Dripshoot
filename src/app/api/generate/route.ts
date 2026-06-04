import fs from "fs";
import path from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import Replicate from "replicate";

export const runtime = "nodejs";

// ─── Provider setup ──────────────────────────────────────────────────────────

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

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

const QUALITY_MODE: Record<string, string> = {
  standard: "performance",
  high:     "balanced",
  ultra:    "quality",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildPrompt(
  side: string,
  gender: string,
  ethnicity: string,
  occasion: string,
  ageGroup: string,
  category: string,
  background: string,
  fabricStyle?: string,
): string {
  const ageLabel = (AGE_LABEL[ageGroup] ?? `${ethnicity} ${gender} model`)
    .replace("{ethnicity}", ethnicity)
    .replace("{gender}", gender);
  const sideStr = SIDE_SUFFIX[side] ?? "";
  const catHint =
    (category === "fabric-male" || category === "fabric-female") && fabricStyle
      ? FABRIC_CATEGORY_HINT(fabricStyle)
      : (CATEGORY_HINT[category] ?? "fashion photography");
  return `${ageLabel}, ${occasion} setting, ${background} background, ${catHint}${sideStr ? ", " + sideStr : ""}, professional fashion photography`;
}

async function uploadToCloudinary(imageUrl: string): Promise<string> {
  const result = await cloudinary.uploader.upload(imageUrl, {
    folder: "dripshoots",
    resource_type: "image",
  });
  return result.secure_url;
}

async function generateWithReplicate(garmentImageUrl: string, prompt: string): Promise<string[]> {
  const output = await replicate.run("cuuupid/idm-vton", {
    input: {
      human_img: "https://images.unsplash.com/photo-1619367997523-7d2f0ec59a09?w=768",
      garm_img: garmentImageUrl,
      garment_des: prompt,
      category: "upper_body",
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 30,
      seed: 42,
    },
  }) as string[];
  return output;
}

async function generateWithPhotta(garmentImageUrl: string, productType: string): Promise<string[]> {
  const res = await fetch("https://ai.photta.app/api/v1/tryon/apparel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PHOTTA_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_type: productType || "top",
      product_images: [garmentImageUrl],
      mannequin_id: "mnq_athena_ts",
      pose_id: "pose_standing_front",
      resolution: "2K",
      aspect_ratio: "3:4",
    }),
  });
  const data = await res.json();
  const id = data.data.id;

  for (let i = 0; i < 80; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const poll = await fetch(`https://ai.photta.app/api/v1/tryon/apparel/${id}`, {
      headers: { Authorization: `Bearer ${process.env.PHOTTA_API_KEY}` },
    });
    const result = await poll.json();
    if (result.data.status === "completed") return [result.data.output_url];
    if (result.data.status === "failed") throw new Error("Photta generation failed");
  }
  throw new Error("Photta timeout");
}

async function generateWithFashn(
  base64Image: string,
  prompt: string,
  nImages: number,
  qualityMode: string,
  apiKey: string,
): Promise<string[]> {
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
        generation_mode: qualityMode,
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
    ageGroup, category, background, sides, numImages, quality, fabricStyle,
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

  // Read garment file for Fashn.ai (base64) and for Cloudinary upload (local path)
  const garmentFilePath = path.join(process.cwd(), "public", garmentImageUrl);
  let base64Image = "";
  try {
    const fileBuffer = fs.readFileSync(garmentFilePath);
    base64Image = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`;
  } catch (err) {
    console.error("[/api/generate] failed to read garment file:", garmentFilePath, err);
    return Response.json({ error: "Failed to read uploaded file" }, { status: 500 });
  }

  const apiKey = process.env.FASHN_API_KEY ?? "";

  // Lazily upload garment to Cloudinary once for Replicate/Photta paths
  let garmentPublicUrl: string | null = null;
  async function getGarmentPublicUrl(): Promise<string> {
    if (!garmentPublicUrl) {
      garmentPublicUrl = await uploadToCloudinary(garmentFilePath);
      console.log("[/api/generate] garment uploaded to Cloudinary:", garmentPublicUrl);
    }
    return garmentPublicUrl;
  }

  const allImages: string[] = [];

  for (const side of sidesArr) {
    const prompt = buildPrompt(
      side, gender, ethnicity, occasion,
      resolvedAgeGroup, resolvedCategory, resolvedBackground,
      fabricStyle as string | undefined,
    );
    console.log(`[/api/generate] side="${side}" quality="${resolvedQuality}" prompt="${prompt}"`);

    let generatedUrls: string[] = [];

    try {
      if (resolvedQuality === "ultra") {
        const productType =
          resolvedCategory === "clothing" ? "top"
          : resolvedCategory === "shoes" ? "bottom"
          : "dress";
        generatedUrls = await generateWithPhotta(await getGarmentPublicUrl(), productType);
      } else if (resolvedQuality === "standard") {
        generatedUrls = await generateWithReplicate(await getGarmentPublicUrl(), prompt);
      } else {
        // high (default) → Fashn.ai
        if (!apiKey) return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });
        const qualityMode = QUALITY_MODE[resolvedQuality] ?? "balanced";
        generatedUrls = await generateWithFashn(base64Image, prompt, nImages, qualityMode, apiKey);
      }
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
