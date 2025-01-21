import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { PlanStatus } from '@prisma/client';
import { PLAN_CONFIG } from "@/config/constants";

export async function PUT(req: Request) {
  try {
    console.log('Starting plan update process');
    
    // 1. Check user authorization
    const {user} = await isAuthorized();
    if (!user) {
      console.log('Unauthorized access attempt');
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Parse the request body
    let body;
    try {
      body = await req.json();
      console.log('Received body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return new Response("Invalid request body", { status: 400 });
    }

    const { 
      id,
      name, 
      description, 
      features, 
      billingCycles, 
      billingCyclesPrices,
      acceptedCoins,
      status = PlanStatus.PRIVATE  // Default to PRIVATE if not specified
    } = body;

    // 3. Validate required fields
    if (!id || !name || !billingCycles || !Array.isArray(billingCycles)) {
      console.log('Invalid plan data', { id, name, billingCycles });
      return new Response("Invalid plan data", { status: 400 });
    }

    // 4. Additional validations
    const NAME_MAX_LENGTH = PLAN_CONFIG.NAME_MAX_LENGTH;
    const DESCRIPTION_MAX_LENGTH = PLAN_CONFIG.DESCRIPTION_MAX_LENGTH;

    // Name validation
    if (name.length > NAME_MAX_LENGTH) {
      console.log(`Plan name exceeds max length of ${NAME_MAX_LENGTH}`);
      return new Response(JSON.stringify({
        error: `Plan name must be ${NAME_MAX_LENGTH} characters or less`
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Description validation (if provided)
    if (description && description.length > DESCRIPTION_MAX_LENGTH) {
      console.log(`Description exceeds max length of ${DESCRIPTION_MAX_LENGTH}`);
      return new Response(JSON.stringify({
        error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 5. Find the user's first company
    const company = await prisma.company.findFirst({
      where: { ownerId: user.id },
      select: { id: true }
    });

    if (!company) {
      console.log('No company found for user');
      return new Response("No company found", { status: 404 });
    }

    // 6. Update the plan in the database
    console.log('Attempting to update plan', { 
      planId: id, 
      companyId: company.id, 
      billingCycles,
      billingCyclesPrices
    });

    const updatedPlan = await prisma.plan.update({
      where: { 
        id,
        companyId: company.id
      },
      data: {
        name, 
        description, 
        features,
        status,
        acceptedCoins: acceptedCoins || [],
        billingCycles: {
          deleteMany: {}, // Remove existing billing cycles
          create: billingCycles.map(cycle => {
            const price = billingCyclesPrices?.[cycle] || 0;
            console.log(`Cycle: ${cycle}, Price: ${price}`);
            return {
              cycle: cycle,
              price: price
            };
          })
        }
      }
    });

    console.log('Plan updated successfully', { planId: updatedPlan.id });

    return new Response("Successful", { status: 200 });

  } catch (error) {
    console.error("Detailed error updating plan:", error, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({
      error: "An unexpected error occurred while updating the plan",
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
