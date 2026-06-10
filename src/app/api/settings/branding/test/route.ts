import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      brandingLogoPublicId: true,
      brandingPosition: true,
      brandingSize: true,
      brandingOpacity: true,
    },
  });

  if (!user?.brandingLogoPublicId) {
    return Response.json({ error: "No logo uploaded" }, { status: 400 });
  }

  const testImageUrl = "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=768";
  const uploaded = await cloudinary.uploader.upload(testImageUrl, {
    folder: "dripshoots/test",
  });

  const sanitizedPublicId = user.brandingLogoPublicId.replace(/\//g, ":");

  const gravityMap: Record<string, string> = {
    "north_west": "north_west",
    "north_east": "north_east",
    "south_west": "south_west",
    "south_east": "south_east",
  };
  const gravity = gravityMap[user.brandingPosition ?? "south_east"] ?? "south_east";

  const brandedUrl = cloudinary.url(uploaded.public_id, {
    transformation: [
      {
        overlay: sanitizedPublicId,
        width: user.brandingSize || 100,
        crop: "scale",
      },
      {
        flags: "layer_apply",
        gravity: gravity,
        x: 15,
        y: 15,
      },
    ],
    secure: true,
  });

  return Response.json({ previewUrl: brandedUrl });
}
