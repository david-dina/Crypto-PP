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

    // Parse pagination parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Determine query filters based on user role
    const whereClause = user.role === "BUSINESS"
      ? { companyId: (await prisma.company.findFirst({
            where: { ownerId: user.id },
          }))?.id } // Fetch company ID
      : { userId: user.id };

    if (!whereClause) {
      return new Response("No wallets found", { status: 404 });
    }

    // Count total wallets
    const total = await prisma.wallet.count({
      where: whereClause,
    });

    // Fetch paginated wallets
    const wallets = await prisma.wallet.findMany({
      where: whereClause,
      select: {
        id: true,
        address: true,
        blockchain: true,
        balance: true,
        provider: true,
        providerImage:true,
        updatedAt: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Fetch tokenBalances for the wallets
    const walletIds = wallets.map((wallet) => wallet.id);
    const tokenBalances = await prisma.tokenBalance.findMany({
      where: {
        walletId: { in: walletIds },
      },
      select: {
        walletId: true,
        tokenName: true,
        balance: true,
        icon: true, // Include the icon field
      },
    });

    // Combine wallets with their tokenBalances
    const formattedWallets = wallets.map((wallet) => {
      const nativeTokenSymbol = getNativeTokenSymbol(wallet.blockchain);

      return {
        ...wallet,
        tokenBalances: tokenBalances
          .filter((tb) => tb.walletId === wallet.id && tb.tokenName !== nativeTokenSymbol) // Match balances by wallet ID and exclude native tokens
          .map((tb) => ({
            tokenName: tb.tokenName,
            walletId: tb.walletId,
            balance: tb.balance,
            icon: tb.icon, // Include the icon field
          })), // Map to remove walletId from balances
      };
    });

    // Return the wallets with pagination metadata
    return new Response(
      JSON.stringify({
        success: true,
        data: formattedWallets,
        page,
        limit,
        total,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wallets:", error);

    // Handle Prisma-specific errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Response("Database error", { status: 500 });
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      return new Response("Validation error", { status: 400 });
    }

    // Generic error response
    return new Response("Failed to fetch wallets", { status: 500 });
  }
}

// Helper function to get the native token symbol for a blockchain
function getNativeTokenSymbol(blockchain: string): string {
  switch (blockchain) {
    case "Ethereum":
      return "ETH";
    case "Polygon":
      return "MATIC";
    case "BinanceSmartChain":
      return "BNB";
    case "Bitcoin":
      return "BTC";
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
  }
}
