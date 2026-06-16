import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function toBase64(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith("data:")) return imageUrl;

  let fetchUrl = imageUrl;
  if (!imageUrl.startsWith("http")) {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://dripshoots.com";
    fetchUrl = `${base}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  }

  const res = await fetch(fetchUrl);
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mime = res.headers.get("content-type") ?? "image/jpeg";
  return `data:${mime};base64,${base64}`;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, numImages, scene } = await req.json();

  if (!imageUrl) {
    return Response.json({ error: "Image required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  if ((user.credits ?? 0) < (numImages ?? 1)) {
    return Response.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const fashnKey = process.env.FASHN_API_KEY;
  if (!fashnKey) return Response.json({ error: "Fashn API not configured" }, { status: 500 });

  try {
    const garmentBase64 = await toBase64(imageUrl);
    const results: string[] = [];

    for (let i = 0; i < (numImages ?? 1); i++) {
      const submitRes = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${fashnKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          garment_image: garmentBase64,
          category: "accessories",
          garment_photo_type: "auto",
          nsfw_filter: true,
          return_base64: false,
        }),
      });

      const submitData = await submitRes.json();
      if (!submitData.id) {
        console.error("Fashn submit error:", submitData);
        continue;
      }

      let output: string | null = null;
      for (let poll = 0; poll < 30; poll++) {
        await new Promise(r => setTimeout(r, 3000));
        const statusRes = await fetch(`https://api.fashn.ai/v1/status/${submitData.id}`, {
          headers: { "Authorization": `Bearer ${fashnKey}` },
        });
        const statusData = await statusRes.json();
        console.log(`[/api/generate-jewellery] poll ${poll + 1}:`, statusData.status);

        if (statusData.status === "completed" && statusData.output?.[0]) {
          output = statusData.output[0];
          break;
        }
        if (statusData.status === "failed") {
          console.error("Fashn failed:", statusData.error);
          break;
        }
      }

      if (output) results.push(output);
    }

    if (results.length === 0) {
      return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
    }

    const cloudinaryResults: string[] = [];
    for (const url of results) {
      try {
        const uploaded = await cloudinary.uploader.upload(url, {
          folder: "dripshoots/jewellery-outputs",
          transformation: user.brandingLogoPublicId ? [
            {
              overlay: user.brandingLogoPublicId.replace(/\//g, ":"),
              gravity: user.brandingPosition ?? "south_east",
              opacity: user.brandingOpacity ?? 70,
              width: user.brandingSize ?? 150,
              crop: "scale",
            },
          ] : undefined,
        });
        cloudinaryResults.push(uploaded.secure_url);
      } catch {
        cloudinaryResults.push(url);
      }
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: "Jewellery Shoot",
        status: "completed",
        prompt: scene ?? "accessories",
        category: "jewellery",
        uploads: { create: [{ imageUrl }] },
        images: { create: cloudinaryResults.map(url => ({ imageUrl: url })) },
      },
    });

    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        credits: { decrement: cloudinaryResults.length },
        creditsUsed: { increment: cloudinaryResults.length },
      },
    });

    return Response.json({ results: cloudinaryResults, projectId: project.id });

  } catch (err) {
    console.error("Jewellery generation error:", err);
    return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}
