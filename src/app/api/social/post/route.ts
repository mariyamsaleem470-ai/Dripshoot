import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { imageUrls, caption, platform } = await req.json();

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.makeWebhookUrl) {
    return Response.json({ error: "Make webhook URL not configured. Go to Settings → Integrations." }, { status: 400 });
  }

  // Call Make.com webhook
  const makeRes = await fetch(user.makeWebhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      imageUrls,
      caption,
      platform,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!makeRes.ok) {
    return Response.json({ error: "Failed to trigger Make.com webhook." }, { status: 500 });
  }

  return Response.json({ success: true });
}
