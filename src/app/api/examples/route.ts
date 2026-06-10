import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { status: "completed" },
      include: {
        uploads: { take: 1 },
        images: { take: 1 },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    })

    const examples = projects
      .filter(p => p.uploads.length > 0 && p.images.length > 0)
      .map(p => ({
        uploadUrl: p.uploads[0].imageUrl,
        generatedUrl: p.images[0].imageUrl,
        occasion: p.occasion,
        gender: p.gender,
        ethnicity: p.ethnicity,
      }))

    return NextResponse.json({ examples })
  } catch {
    return NextResponse.json({ examples: [] })
  }
}
