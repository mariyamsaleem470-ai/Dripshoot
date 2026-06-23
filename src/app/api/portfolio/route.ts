import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const projects = await prisma.project.findMany({
    where: { status: "completed" },
    include: { uploads: true, images: true, reels: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const filtered = projects.filter(p => p.images.length > 0 || p.reels.length > 0);

  return Response.json({ projects: filtered });
}
