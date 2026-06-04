import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const PLAN_PRICE: Record<string, number> = {
  free: 0,
  starter: 9,
  growth: 29,
  pro: 79,
  agency: 199,
};

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  if (email !== process.env.ADMIN_EMAIL) return null;
  return email;
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const [users, totalProjects, creditAgg] = await Promise.all([
    prisma.user.findMany({ select: { plan: true, creditsUsed: true } }),
    prisma.project.count(),
    prisma.user.aggregate({ _sum: { creditsUsed: true } }),
  ]);

  const totalUsers = users.length;
  const totalCreditsUsed = creditAgg._sum.creditsUsed ?? 0;
  const revenueEstimate = users.reduce((sum, u) => sum + (PLAN_PRICE[u.plan] ?? 0), 0);

  return Response.json({ totalUsers, totalProjects, totalCreditsUsed, revenueEstimate });
}
