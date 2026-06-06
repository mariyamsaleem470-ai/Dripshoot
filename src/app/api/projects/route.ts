import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return Response.json({ projects: [] });

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: { uploads: true, images: true, reels: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({ projects });
}
