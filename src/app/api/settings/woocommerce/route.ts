import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  return Response.json({
    connected: !!user?.wpSiteUrl,
    wpSiteUrl: user?.wpSiteUrl ?? "",
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { wpSiteUrl, wpConsumerKey, wpConsumerSecret, wpAppPassword } = await req.json();

  // Test WooCommerce connection
  const testRes = await fetch(
    `${wpSiteUrl}/wp-json/wc/v3/products?per_page=1`,
    {
      headers: {
        Authorization: "Basic " + btoa(wpConsumerKey + ":" + wpConsumerSecret),
      },
    }
  );

  if (!testRes.ok) {
    return Response.json(
      { error: "Connection failed. Check your credentials." },
      { status: 400 }
    );
  }

  // Save credentials to DB
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { wpSiteUrl, wpConsumerKey, wpConsumerSecret, wpAppPassword },
    create: {
      clerkId: userId,
      email: "",
      wpSiteUrl,
      wpConsumerKey,
      wpConsumerSecret,
      wpAppPassword,
    },
  });

  return Response.json({ success: true });
}
