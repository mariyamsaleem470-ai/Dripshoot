import fs from "fs";
import path from "path";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const FASHN_BASE = "https://api.fashn.ai/v1";
const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 40; // 2 minutes max

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[/api/generate] request body:", JSON.stringify(body));

  const { garmentImageUrl, gender, ethnicity, occasion } = body;

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

  const fashnPayload = {
    model_name: "product-to-model",
    inputs: {
      product_image: base64Image,
      prompt: `${ethnicity} ${gender} model, ${occasion} setting, professional fashion photography`,
      num_images: 1,
      output_format: "png",
    },
  };
  console.log("[/api/generate] sending to FASHN (image omitted):", JSON.stringify({ ...fashnPayload, inputs: { ...fashnPayload.inputs, product_image: "[base64]" } }));

  const runRes = await fetch(`${FASHN_BASE}/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(fashnPayload),
  });

  if (!runRes.ok) {
    const text = await runRes.text();
    console.error("[/api/generate] FASHN /run error:", runRes.status, text);
    return Response.json(
      { error: `Failed to start generation: ${text}` },
      { status: runRes.status }
    );
  }

  const runData = await runRes.json();
  console.log("[/api/generate] FASHN /run response:", JSON.stringify(runData));
  const { id } = runData;

  // Poll until complete
  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const statusRes = await fetch(`${FASHN_BASE}/status/${id}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!statusRes.ok) {
      const text = await statusRes.text();
      console.error("[/api/generate] FASHN /status error:", statusRes.status, text);
      return Response.json(
        { error: "Failed to poll generation status" },
        { status: statusRes.status }
      );
    }

    const statusData = await statusRes.json();
    console.log(`[/api/generate] poll ${i + 1}:`, JSON.stringify(statusData));
    const { status, output, error } = statusData;

    if (status === "completed") {
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
              name: `${occasion} · ${ethnicity} ${gender}`,
              status: "completed",
              gender,
              ethnicity,
              occasion,
              uploads: { create: [{ imageUrl: garmentImageUrl }] },
              images: { create: (output as string[]).map((imageUrl) => ({ imageUrl })) },
            },
          });
          console.log("[/api/generate] project saved to DB for user:", userId);
        }
      } catch (dbErr) {
        console.error("[/api/generate] failed to save project to DB:", dbErr);
      }

      return Response.json({ images: output });
    }

    if (status === "failed") {
      return Response.json({ error: error ?? "Generation failed" }, { status: 500 });
    }
  }

  return Response.json({ error: "Generation timed out" }, { status: 504 });
}
