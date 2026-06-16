import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrl, prompt, numImages, category } = await req.json();

  if (!imageUrl || !prompt) {
    return Response.json({ error: "Image and prompt required" }, { status: 400 });
  }

  // Check credits
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  if ((user.credits ?? 0) < (numImages ?? 1)) {
    return Response.json({ error: "Insufficient credits" }, { status: 402 });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) return Response.json({ error: "Replicate not configured" }, { status: 500 });

  const results: string[] = [];

  try {
    // Generate numImages one by one (bria model)
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
              image: imageUrl,
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

      if (data.error) {
        console.error("Replicate error:", data.error);
        continue;
      }

      // Output can be array or single URL
      const output = data.output;
      if (Array.isArray(output) && output.length > 0) {
        results.push(output[0]);
      } else if (typeof output === "string") {
        results.push(output);
      }
    }

    if (results.length === 0) {
      return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
    }

    // Deduct credits
    await prisma.user.update({
      where: { clerkId: userId },
      data: { credits: { decrement: results.length } },
    });

    // Save to project DB (optional — save as generated images)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.generatedImage.createMany as any)({
      data: results.map((url) => ({
        userId: user.id,
        imageUrl: url,
        prompt: prompt,
        category: category ?? "product",
      })),
    }).catch(() => {
      // If generatedImage model doesn't have category field yet, skip silently
    });

    return Response.json({ results });

  } catch (err) {
    console.error("Product generation error:", err);
    return Response.json({ error: "Generation failed. Try again." }, { status: 500 });
  }
}
