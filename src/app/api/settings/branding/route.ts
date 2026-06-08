import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({
    brandingLogoUrl: user.brandingLogoUrl,
    brandingPosition: user.brandingPosition,
    brandingSize: user.brandingSize,
    brandingOpacity: user.brandingOpacity,
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const position = formData.get("position") as string | null;
  const size = formData.get("size") as string | null;
  const opacity = formData.get("opacity") as string | null;

  let uploadResult: { secure_url: string; public_id: string } | undefined;

  if (file) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

    uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "dripshoots/branding",
      resource_type: "image",
    });
  }

  const user = await prisma.user.update({
    where: { clerkId: userId },
    data: {
      ...(uploadResult && {
        brandingLogoUrl: uploadResult.secure_url,
        brandingLogoPublicId: uploadResult.public_id,
      }),
      brandingPosition: position || "south_east",
      brandingSize: parseInt(size ?? "") || 150,
      brandingOpacity: parseInt(opacity ?? "") || 70,
    },
  });

  return Response.json({ success: true, brandingLogoUrl: user.brandingLogoUrl });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.user.update({
    where: { clerkId: userId },
    data: { brandingLogoUrl: null, brandingLogoPublicId: null },
  });

  return Response.json({ success: true });
}
