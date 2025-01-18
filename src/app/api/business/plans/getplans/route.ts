"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    // Check if the user is authorized
    const { user } = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Determine query filters based on user role
    const whereClause = user.role === "BUSINESS"
      ? { companyId: (await prisma.company.findFirst({
            where: { ownerId: user.id },
          }))?.id }
      : null;

    if (!whereClause) {
      return new Response("No company found", { status: 404 });
    }

    // Fetch plans
    const plans = await prisma.plan.findMany({
      where: whereClause,
      orderBy: {
        position: 'asc'
      },
      select: {
        id: true,
        name: true,
        price: true,
        billingCycles: true,
        isTiered: true,
        tierGroupId: true,
        position: true,
        features: true,
      },
    });

    // Return the plans
    return new Response(
      JSON.stringify({
        success: true,
        data: plans,
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error("Error fetching plans:", error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response("Database error", { status: 500 });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new Response("Validation error", { status: 400 });
    }

    // Generic error response
    return new Response("Failed to fetch plans", { status: 500 });
  }
}
