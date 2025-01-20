import { prisma } from "@/libs/prismadb";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { PlanStatus } from '@prisma/client';
import { PLAN_CONFIG } from "@/config/constants";

export const PUT = async (req: Request) => {
  try {
    // 1. Validate session
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    const { user } = sessionId 
      ? await lucia.validateSession(sessionId) 
      : { user: null };

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { 
      id,
      name, 
      description, 
      features, 
      billingCycles, 
      acceptedCoins,
      status = PlanStatus.PRIVATE  // Default to PRIVATE if not specified
    } = body;

    // 3. Validate required fields
    if (!id || !name || !billingCycles || !Array.isArray(billingCycles)) {
      return new Response("Invalid plan data", { status: 400 });
    }

    // Additional validations
    const NAME_MAX_LENGTH = PLAN_CONFIG.NAME_MAX_LENGTH;
    const DESCRIPTION_MAX_LENGTH = PLAN_CONFIG.DESCRIPTION_MAX_LENGTH;

    // Name validation
    if (name.length > NAME_MAX_LENGTH) {
      return new Response(JSON.stringify({
        error: `Plan name must be ${NAME_MAX_LENGTH} characters or less`
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Description validation (if provided)
    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      return new Response(JSON.stringify({
        error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Update the plan
    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: {
        name,
        description: description || '',
        features: features || {},
        acceptedCoins: acceptedCoins || [],
        status: status,
        // Upsert billing cycles
        billingCycles: {
          upsert: billingCycles.map((cycle: { cycle: string, price: number }) => ({
            where: {
              planId_cycle: {
                planId: id,
                cycle: cycle.cycle
              }
            },
            update: {
              price: cycle.price
            },
            create: {
              cycle: cycle.cycle,
              price: cycle.price
            }
          }))
        }
      },
      include: {
        billingCycles: true
      }
    });

    // 5. Return the updated plan
    return new Response(JSON.stringify({
      id: updatedPlan.id,
      name: updatedPlan.name,
      description: updatedPlan.description,
      price: updatedPlan.billingCycles[0]?.price || 0,
      billingCycles: updatedPlan.billingCycles.map(cycle => cycle.cycle),
      billingCyclesPrices: updatedPlan.billingCycles.reduce((acc, cycle) => {
        acc[cycle.cycle] = cycle.price;
        return acc;
      }, {}),
      companyId: updatedPlan.companyId,
      status: updatedPlan.status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // 6. Handle errors
    console.error("Error updating plan:", error);
    
    // Ensure we return a valid JSON response
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while updating the plan';
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
