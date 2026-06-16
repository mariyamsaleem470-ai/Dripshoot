import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function toPublicUrl(imageUrl: string): Promise<string> {
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const localPath = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://dripshoots.com"}${localPath}`;
  const uploaded = await cloudinary.uploader.upload(fullUrl, {
    folder: "dripshoots/product-inputs",
  });
  return uploaded.secure_url;
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, prompt, numImages, category } = await req.json();

  if (!imageUrl || !prompt) {
    return Response.json({ error: "Image and prompt required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  if ((user.credits ?? 0) < (numImages ?? 1)) {
    return Response.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return Response.json({ error: "Replicate not configured" }, { status: 500 });

  try {
    const publicImageUrl = await toPublicUrl(imageUrl);
    const results: string[] = [];

    for (let i = 0; i < (numImages ?? 1); i++) {
      const res = await fetch(
        "https://api.replicate.com/v1/models/bria/generate-background/predictions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Prefer": "wait",
          },
          body: JSON.stringify({
            input: {
              fast: true,
              sync: true,
              image: publicImageUrl,
              bg_prompt: prompt,
              force_rmbg: true,
              num_results: 1,
              refine_prompt: true,
              original_quality: true,
              enhance_ref_image: true,
              content_moderation: false,
            },
          }),
        }
      );

      const data = await res.json();
      if (data.error) { console.error("Replicate error:", data.error); continue; }

      const output = data.output;
      if (Array.isArray(output) && output.length > 0) results.push(output[0]);
      else if (typeof output === "string") results.push(output);
    }

    if (results.length === 0) {
      return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
    }

    // Upload results to Cloudinary with brand watermark
    const cloudinaryResults: string[] = [];
    for (const url of results) {
      try {
        const uploaded = await cloudinary.uploader.upload(url, {
          folder: "dripshoots/product-outputs",
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

    // Save to DB as Project
    const categoryLabel = category === "crockery" ? "Crockery" : category === "jewellery" ? "Jewellery" : "Product";
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: `${categoryLabel} Shoot`,
        status: "completed",
        prompt: prompt,
        category: category ?? "product",
        uploads: {
          create: [{ imageUrl: publicImageUrl }],
        },
        images: {
          create: cloudinaryResults.map((url) => ({ imageUrl: url })),
        },
      },
    });

    // Deduct credits
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        credits: { decrement: cloudinaryResults.length },
        creditsUsed: { increment: cloudinaryResults.length },
      },
    });

    return Response.json({ results: cloudinaryResults, projectId: project.id });

  } catch (err) {
    console.error("Product generation error:", err);
    return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}
