"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";


export interface SecondaryTokenBalances {
  name: string; // Token symbol (e.g., "USDC")
  balance: string; // Token balance (e.g., "100.0")
  icon?: string; // Token icon URL (optional)
}
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { wallets } = await req.json();

    // Validate required fields
    if (!wallets || !Array.isArray(wallets)) {
      return new Response("Missing or invalid wallet data", { status: 400 });
    }

    // Check if the user is authorized
    const { user } = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Log the number of wallets and tokens being saved
    console.log(`Processing ${wallets.length} wallets with ${wallets.reduce((acc, wallet) => acc + (wallet.secondaryTokens?.length || 0), 0)} tokens`);

    // Process each wallet in the list
    const savedWallets = await Promise.all(
      wallets.map(async (wallet: { address: string; provider: string; blockchain: string; balance?: number; providerImage?:string; secondaryTokens?: SecondaryTokenBalances[] }) => {
        const { address, provider, blockchain, balance = 0.0, secondaryTokens,providerImage} = wallet;

        // Validate wallet fields
        if (!address || !provider || !blockchain) {
          throw new Error("Missing required wallet fields");
        }

        // Validate secondary tokens (if provided)
        if (secondaryTokens) {
          secondaryTokens.forEach((token) => {
            if (!token.name || !token.balance) {
              throw new Error("Missing required token fields");
            }
          });
        }

        // Upsert the wallet (create new entry for each blockchain)
        let savedWallet;
        if (user.role === "BUSINESS") {
          const company = await prisma.company.findFirst({
            where: { ownerId: user.id },
          });
          if (!company) {
            throw new Error("Company not found for the user");
          }
          savedWallet = await prisma.wallet.upsert({
            where: { address_provider_blockchain: { address, provider, blockchain } }, // Unique constraint
            update: { balance }, // Update balance if wallet exists
            create: {
              address,
              providerImage,
              blockchain,
              provider,
              balance,
              companyId: company.id,
            },
          });
        } else {
          savedWallet = await prisma.wallet.upsert({
            where: { address_provider_blockchain: { address, provider, blockchain } }, // Unique constraint
            update: { balance }, // Update balance if wallet exists
            create: {
              address,
              blockchain,
              providerImage,
              provider,
              balance,
              userId: user.id,
            },
          });
        }

        // Upsert secondary tokens (if provided)
        if (secondaryTokens && secondaryTokens.length > 0) {
          await Promise.all(
            secondaryTokens.map((token) => {
              // Skip native tokens (e.g., ETH, MATIC, BNB)
              const nativeTokenSymbol = getNativeTokenSymbol(blockchain);
              if (token.name === nativeTokenSymbol) {
                console.warn(`Skipping native token ${nativeTokenSymbol} for blockchain ${blockchain}`);
                return;
              }

              return prisma.tokenBalance.upsert({
                where: {
                  walletId_tokenName: {
                    walletId: savedWallet.id,
                    tokenName: token.name,
                  },
                },
                update: {
                  balance: parseFloat(token.balance),
                  icon: token.icon || null, // Update icon if provided
                },
                create: {
                  walletId: savedWallet.id,
                  tokenName: token.name,
                  balance: parseFloat(token.balance),
                  icon: token.icon || null, // Save the token icon if available
                },
              });
            })
          );
        }

        return savedWallet;
      })
    );

    // Return the created/updated wallets
    return new Response(JSON.stringify(savedWallets), { status: 201 });
  } catch (error) {
    console.error("Error saving/updating wallets to database:", error);

    // Handle Prisma-specific errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return new Response("Wallet address already exists for this blockchain", { status: 409 });
    }

    // Generic error response
    return new Response("Failed to save/update wallets", { status: 500 });
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