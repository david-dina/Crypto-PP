import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";

export const GET = async (req: Request) => {
  try {
    // 1. Check user authorization
    const {user} = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Find the user's first company
    const company = await prisma.company.findFirst({
      where: { ownerId: user.id },
      select: { id: true }
    });

    // 3. Check if company exists
    if (!company) {
      return new Response("No company found", { status: 404 });
    }

    // 4. Fetch plans for the company
    const plans = await prisma.plan.findMany({
      where: { 
        companyId: company.id,
        // Include all plans for the company owner
        // Adjust this filter as needed for different visibility requirements
        status: {
          in: ['ACTIVE', 'PRIVATE', 'DISABLED','ARCHIVED']
        }
      },
      include: {
        billingCycles: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // 5. Transform plans to include first billing cycle price
    const transformedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.billingCycles[0]?.price || 0,
      features: plan.features,
      acceptedCoins: plan.acceptedCoins,
      billingCycles: plan.billingCycles.map(cycle => cycle.cycle).filter(Boolean),
      companyId: plan.companyId,
      isTiered: plan.isTiered || false,
      status: plan.status
    }));

    // 6. Return successful response
    return new Response(JSON.stringify(transformedPlans), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // 7. Handle errors
    console.error("Error fetching plans:", error);
    return new Response(`${error}`, { status: 500 });
  }
};
