import { isAuthorized } from "@/libs/isAuthorized";
import { prisma } from "@/libs/prismaDb";

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const plans = searchParams.get("plans");
  
  const { user } = await isAuthorized();
  if (!user) {
    return new Response("Not Authorized", { status: 401 });
  }
  
  if (!plans) {
    return new Response("Missing plansID", { status: 400 });
  }

  const plan = await prisma.plan.findUnique({
    where: { id: plans },
    include: { 
      company: true 
    }
  });

  if (!plan) {
    return new Response("Plan not found", { status: 404 });
  }

  if (plan.company.ownerId !== user.id) {
    return new Response("Not Authorized", { status: 401 });
  }

  await prisma.plan.delete({
    where: { id: plans }
  });

  return new Response(JSON.stringify({ message: "Plan deleted successfully" }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}