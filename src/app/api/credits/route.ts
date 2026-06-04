import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";

  const user = await prisma.user.upsert({
    where: { clerkId: userId },
    create: { clerkId: userId, email },
    update: { email },
  });

  return Response.json({
    email,
    plan: user.plan,
    credits: user.credits,
    creditsUsed: user.creditsUsed,
    creditsLimit: user.creditsLimit,
    percentage: Math.round((user.creditsUsed / user.creditsLimit) * 100),
  });
}
