import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (
    !user?.wpSiteUrl ||
    !user?.wpConsumerKey ||
    !user?.wpConsumerSecret ||
    !user?.wpAppPassword
  ) {
    return Response.json({ error: "WooCommerce not connected." }, { status: 400 });
  }

  const {
    title,
    description,
    shortDescription,
    regularPrice,
    salePrice,
    sku,
    stockQuantity,
    categoryId,
    tags,
    status,
    featuredImageUrl,
    galleryImageUrls,
    variations,
    attributes,
  } = await req.json();

  const { wpSiteUrl, wpConsumerKey, wpConsumerSecret, wpAppPassword } = user;
  const wcAuth = "Basic " + btoa(wpConsumerKey + ":" + wpConsumerSecret);
  const wpAuth = "Basic " + btoa("admin:" + wpAppPassword);

  // Step 1 — Upload featured image to WordPress media library
  const featuredBlob = await fetch(featuredImageUrl).then((r) => r.blob());
  const featuredMediaRes = await fetch(`${wpSiteUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      Authorization: wpAuth,
      "Content-Disposition": "attachment; filename=featured.jpg",
      "Content-Type": "image/jpeg",
    },
    body: featuredBlob,
  });

  if (!featuredMediaRes.ok) {
    return Response.json({ error: "Failed to upload featured image." }, { status: 502 });
  }

  const featuredMedia = await featuredMediaRes.json();
  const featuredMediaId: number = featuredMedia.id;

  // Step 2 — Upload gallery images
  const galleryIds: number[] = [];
  for (const imageUrl of galleryImageUrls ?? []) {
    const blob = await fetch(imageUrl).then((r) => r.blob());
    const mediaRes = await fetch(`${wpSiteUrl}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: wpAuth,
        "Content-Disposition": "attachment; filename=gallery.jpg",
        "Content-Type": "image/jpeg",
      },
      body: blob,
    });
    if (mediaRes.ok) {
      const media = await mediaRes.json();
      galleryIds.push(media.id);
    }
  }

  // Step 3 — Create WooCommerce product
  const productRes = await fetch(`${wpSiteUrl}/wp-json/wc/v3/products`, {
    method: "POST",
    headers: {
      Authorization: wcAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: title,
      type: attributes?.length > 0 ? "variable" : "simple",
      status,
      description,
      short_description: shortDescription,
      regular_price: regularPrice,
      sale_price: salePrice || "",
      images: [
        { id: featuredMediaId },
        ...galleryIds.map((id) => ({ id })),
      ],
      categories: categoryId ? [{ id: parseInt(categoryId) }] : [],
      tags: (tags as string)
        .split(",")
        .map((t: string) => ({ name: t.trim() }))
        .filter((t: { name: string }) => t.name),
      sku,
      manage_stock: true,
      stock_quantity: parseInt(stockQuantity) || 100,
      attributes: (attributes ?? []).map(
        (attr: { name: string; values: string[] }) => ({
          name: attr.name,
          variation: true,
          visible: true,
          options: attr.values,
        })
      ),
    }),
  });

  if (!productRes.ok) {
    const err = await productRes.json().catch(() => ({}));
    return Response.json(
      { error: err?.message ?? "Failed to create product." },
      { status: 502 }
    );
  }

  const product = await productRes.json();
  const productId: number = product.id;

  // Step 4 — Create variations (if any)
  for (const variation of variations ?? []) {
    await fetch(`${wpSiteUrl}/wp-json/wc/v3/products/${productId}/variations`, {
      method: "POST",
      headers: {
        Authorization: wcAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        regular_price: regularPrice,
        manage_stock: true,
        stock_quantity: variation.stockQuantity || parseInt(stockQuantity) || 100,
        attributes: variation.attributes,
      }),
    });
  }

  return Response.json({ success: true, productUrl: product.permalink });
}
