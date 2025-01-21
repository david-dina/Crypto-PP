import { prisma } from "@/libs/prismaDb";
import { lucia } from "@/auth";
import {isAuthorized}from "@/libs/isAuthorized"
import { PlanStatus } from '@prisma/client';
import { PLAN_CONFIG } from "@/config/constants";

export const POST = async (req: Request) => {
  try {
    // 1. Validate session
    const {user} = await isAuthorized()

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Find the user's first company
    const company = await prisma.company.findFirst({
      where: { ownerId: user.id },
      select: { id: true, name: true }
    });

    if (!company) {
      return new Response("No company found", { status: 404 });
    }

    // 3. Parse the request body
    const body = await req.json();
    const { 
      name, 
      description, 
      features, 
      billingCycles, 
      acceptedCoins,
      status = PlanStatus.PRIVATE  // Default to PRIVATE if not specified
    } = body;

    // 4. Validate required fields
    if (!name || !billingCycles || !Array.isArray(billingCycles)) {
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

    // 5. Create the plan
    const newPlan = await prisma.plan.create({
      data: {
        name,
        description: description || '',
        companyId: company.id,
        features: features || {},
        acceptedCoins: acceptedCoins || [],
        status: status,
        billingCycles: {
          createMany: {
            data: billingCycles.map((cycle: { cycle: string, price: number }) => ({
              cycle: cycle.cycle,
              price: cycle.price
            }))
          }
        }
      },
      include: {
        billingCycles: true
      }
    });

    // 6. Return the created plan
    return new Response(JSON.stringify({
      id: newPlan.id,
      name: newPlan.name,
      description: newPlan.description,
      price: newPlan.billingCycles[0]?.price || 0,
      billingCycles: newPlan.billingCycles.map(cycle => cycle.cycle),
      companyId: newPlan.companyId,
      status: newPlan.status
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    // 7. Handle errors
    console.error("Error creating plan:", error);
    
    // Ensure we return a valid JSON response
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred while creating the plan';
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
