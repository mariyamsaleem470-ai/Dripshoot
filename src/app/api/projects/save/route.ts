import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";

  const { projectName, originalImage, generatedImages, gender, ethnicity, occasion } =
    await request.json();

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: projectName ?? `${occasion} · ${ethnicity} ${gender}`,
      status: "completed",
      gender,
      ethnicity,
      occasion,
      uploads: {
        create: [{ imageUrl: originalImage }],
      },
      images: {
        create: (generatedImages as string[]).map((imageUrl) => ({ imageUrl })),
      },
    },
  });

  return Response.json({ project });
}
