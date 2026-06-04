import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 50,
  growth: 200,
  pro: 500,
  agency: 1500,
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

  const users = await prisma.user.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      credits: u.credits,
      creditsUsed: u.creditsUsed,
      creditsLimit: u.creditsLimit,
      projectsCount: u._count.projects,
      createdAt: u.createdAt,
    })),
  });
}

export async function PATCH(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { userId, action, plan, amount } = await request.json();

  if (!userId || !action) {
    return Response.json({ error: "userId and action required" }, { status: 400 });
  }

  if (action === "setPlan") {
    if (!plan || !(plan in PLAN_LIMITS)) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }
    const limit = PLAN_LIMITS[plan];
    await prisma.user.update({
      where: { id: userId },
      data: { plan, creditsLimit: limit, credits: limit },
    });
  } else if (action === "addCredits") {
    const n = parseInt(amount, 10);
    if (isNaN(n) || n <= 0) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: n } },
    });
  } else if (action === "reset") {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { creditsLimit: true } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });
    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.creditsLimit },
    });
  } else {
    return Response.json({ error: "Unknown action" }, { status: 400 });
  }

  return Response.json({ success: true });
}
