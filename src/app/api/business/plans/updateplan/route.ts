import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { PlanStatus } from '@prisma/client';
import { PLAN_CONFIG } from "@/config/constants";

export async function PUT(req: Request) {
  try {
    console.log('Starting plan update process');
    
    // 1. Check user authorization
    const { user } = await isAuthorized();
    console.log("authorized user")
    if (!user) {
      console.log('Unauthorized access attempt');
      return new Response(JSON.stringify({
        error: "Unauthorized: Please log in"
      }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    console.log('reading')
    console.log(req)
    const requestBody = await req.json();
    console.log('Received request body:', JSON.stringify(requestBody, null, 2));
    // Directly destructure known variables from the JSON body
    let { 
      id,
      name, 
      description, 
      features, 
      billingCycles, 
      billingCyclesPrices,
      acceptedCoins,
      status = PlanStatus.PRIVATE  // Default to PRIVATE if not specified
    } = requestBody;
    
    // Optional: Add logging if needed
    console.log('Received plan update:', { 
      id,
      name, 
      description, 
      features, 
      billingCycles, 
      billingCyclesPrices,
      acceptedCoins,
      status
    });

    // 3. Validate required fields
    if (!id) {
      console.error('Plan update failed: Missing plan ID');
      return new Response(JSON.stringify({
        error: "Missing plan ID",
        details: "A valid plan ID is required for updating a plan"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    if (!name || !billingCycles || !Array.isArray(billingCycles)) {
      console.log('Invalid plan data', { id, name, billingCycles });
      return new Response(JSON.stringify({
        error: "Invalid plan data"
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 4. Find the existing company
    const company = await prisma.company.findFirst({
      where: { ownerId: user.id },
      select: { id: true }
    });

    if (!company) {
      console.error(`No company found for user ${user.id}`);
      return new Response(JSON.stringify({
        error: "Company not found",
        details: "Unable to locate the company associated with this user"
      }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // Validate billing cycles and prices
    if (!billingCycles || billingCycles.length === 0) {
      console.warn('No billing cycles provided, using default');
      billingCycles = ['MONTHLY']; // Default fallback
    }

    // Validate billing cycle prices
    const validBillingCyclesPrices = {
      DAILY: billingCyclesPrices?.DAILY || 0,
      WEEKLY: billingCyclesPrices?.WEEKLY || 0,
      MONTHLY: billingCyclesPrices?.MONTHLY || 0,
      YEARLY: billingCyclesPrices?.YEARLY || 0
    };

    console.log('Validated Billing Cycles Prices:', validBillingCyclesPrices);

    // 5. Additional validations
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

    // 6. Update the plan in the database
    console.log('Attempting to update plan', { 
      planId: id, 
      companyId: company.id, 
      billingCycles,
      billingCyclesPrices: validBillingCyclesPrices
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
            const price = validBillingCyclesPrices[cycle] || 0;
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

    return new Response(JSON.stringify({
      message: "Plan updated successfully",
      planId: updatedPlan.id
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error("Detailed error updating plan:", error, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(JSON.stringify({
      error: "An unexpected error occurred while updating the plan",
      details: error.message || 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};