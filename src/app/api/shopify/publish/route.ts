import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user?.shopifySiteUrl || !user?.shopifyAccessToken) {
    return Response.json({ error: "Shopify not connected." }, { status: 400 });
  }

  const { title, description, price, images, tags, status, variants } = await req.json();

  const productRes = await fetch(
    `https://${user.shopifySiteUrl}/admin/api/2024-01/products.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": user.shopifyAccessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: {
          title,
          body_html: description,
          status: status || "draft",
          tags: tags || "",
          images: images.map((url: string) => ({ src: url })),
          variants: variants?.length > 0 ? variants : [{ price: price || "0.00" }],
        },
      }),
    }
  );

  if (!productRes.ok) {
    const err = await productRes.json();
    return Response.json({ error: err?.errors ?? "Failed to create product" }, { status: 502 });
  }

  const product = await productRes.json();
  return Response.json({
    success: true,
    productUrl: `https://${user.shopifySiteUrl}/admin/products/${product.product.id}`,
  });
}
