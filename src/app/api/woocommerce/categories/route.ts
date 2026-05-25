import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.wpSiteUrl || !user?.wpConsumerKey || !user?.wpConsumerSecret) {
    return Response.json({ error: "WooCommerce not connected." }, { status: 400 });
  }

  const res = await fetch(
    `${user.wpSiteUrl}/wp-json/wc/v3/product_categories?per_page=100`,
    {
      headers: {
        Authorization:
          "Basic " + btoa(user.wpConsumerKey + ":" + user.wpConsumerSecret),
      },
    }
  );

  if (!res.ok) {
    return Response.json({ error: "Failed to fetch categories." }, { status: 502 });
  }

  const data = await res.json();
  return Response.json({ categories: data });
}
