import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  return Response.json({ makeWebhookUrl: user?.makeWebhookUrl ?? "" });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { makeWebhookUrl } = await req.json();
  await prisma.user.upsert({
    where: { clerkId: userId },
    update: { makeWebhookUrl },
    create: { clerkId: userId, email: "", makeWebhookUrl },
  });
  return Response.json({ success: true });
}
