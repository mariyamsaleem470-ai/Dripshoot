import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = "nodejs";

const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40;

const VIDEO_CREDITS: Record<string, Record<number, number>> = {
  "480p":  { 5: 1,  10: 2  },
  "720p":  { 5: 3,  10: 6  },
  "1080p": { 5: 6,  10: 12 },
};

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });

  const { imageUrl, duration, resolution, motionPrompt } = await request.json();

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) return Response.json({ error: "FASHN_API_KEY not configured" }, { status: 500 });
  if (!imageUrl) return Response.json({ error: "imageUrl required" }, { status: 400 });

  const resolvedResolution: string = resolution ?? "720p";
  const resolvedDuration: number = duration ?? 5;
  const creditCost =
    VIDEO_CREDITS[resolvedResolution]?.[resolvedDuration] ??
    VIDEO_CREDITS["720p"][5];

  if (user.credits < creditCost) {
    return Response.json(
      { error: "insufficient_credits", required: creditCost, available: user.credits },
      { status: 402 }
    );
  }

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model_name: "image-to-video",
      inputs: {
        image: imageUrl,
        duration: resolvedDuration,
        resolution: resolvedResolution,
        prompt: [
          motionPrompt || "model walking gracefully",
          "cinematic camera movement",
          "smooth slow motion",
          "professional fashion film",
          "high end editorial style",
          "soft bokeh background",
          "dramatic lighting",
        ].join(", "),
      },
    }),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    return Response.json({ error: `Failed to start: ${text}` }, { status: runRes.status });
  }

  const { id } = await runRes.json();

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) return Response.json({ error: "Poll failed" }, { status: statusRes.status });
    const { status, output, error } = await statusRes.json();
    if (status === "completed") {
      const result = await cloudinary.uploader.upload(output[0], {
        folder: "dripshoots/videos",
        resource_type: "video",
      });
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          credits: { decrement: creditCost },
          creditsUsed: { increment: creditCost },
        },
      });
      return Response.json({ videoUrl: result.secure_url });
    }
    if (status === "failed") return Response.json({ error: error ?? "Generation failed" }, { status: 500 });
  }

  return Response.json({ error: "Timed out" }, { status: 504 });
}
