import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({
    connected: !!user.shopifySiteUrl,
    shopifySiteUrl: user.shopifySiteUrl,
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { shopifySiteUrl, shopifyAccessToken } = await req.json();

  const testRes = await fetch(`https://${shopifySiteUrl}/admin/api/2024-01/shop.json`, {
    headers: {
      "X-Shopify-Access-Token": shopifyAccessToken,
      "Content-Type": "application/json",
    },
  });

  if (!testRes.ok) {
    return Response.json({ error: "Invalid credentials" }, { status: 400 });
  }

  await prisma.user.update({
    where: { clerkId: userId },
    data: { shopifySiteUrl, shopifyAccessToken },
  });

  return Response.json({ success: true });
}
