import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 50,
  growth: 200,
  pro: 500,
  agency: 1500,
};

const PKR_PLAN_LIMITS: Record<string, number> = {
  free_trial: 15,
  starter:    60,
  growth:     200,
  pro:        500,
};

async function verifyAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? "";
  if (email !== process.env.ADMIN_EMAIL) return null;
  return email;
}

export async function GET(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status");

  const users = await prisma.user.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    include: { _count: { select: { projects: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      plan: u.plan,
      pkrPlan: u.pkrPlan,
      status: u.status,
      credits: u.credits,
      creditsUsed: u.creditsUsed,
      creditsLimit: u.creditsLimit,
      projectsCount: u._count.projects,
      createdAt: u.createdAt,
      approvedAt: u.approvedAt,
      approvedBy: u.approvedBy,
    })),
  });
}

export async function PATCH(request: Request) {
  const admin = await verifyAdmin();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { userId, action, plan, pkrPlan, amount } = await request.json();

  if (!userId || !action) {
    return Response.json({ error: "userId and action required" }, { status: 400 });
  }

  if (action === "approve") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        status: "active",
        credits: 15,
        creditsLimit: 15,
        plan: "free_trial",
        approvedAt: new Date(),
        approvedBy: admin,
      },
    });
  } else if (action === "reject") {
    await prisma.user.update({
      where: { id: userId },
      data: { status: "rejected" },
    });
  } else if (action === "setPlan") {
    if (pkrPlan !== undefined) {
      if (!(pkrPlan in PKR_PLAN_LIMITS)) {
        return Response.json({ error: "Invalid pkrPlan" }, { status: 400 });
      }
      const limit = PKR_PLAN_LIMITS[pkrPlan];
      await prisma.user.update({
        where: { id: userId },
        data: { pkrPlan, credits: limit, creditsLimit: limit },
      });
    } else {
      if (!plan || !(plan in PLAN_LIMITS)) {
        return Response.json({ error: "Invalid plan" }, { status: 400 });
      }
      const limit = PLAN_LIMITS[plan];
      await prisma.user.update({
        where: { id: userId },
        data: { plan, credits: limit, creditsLimit: limit },
      });
    }
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
