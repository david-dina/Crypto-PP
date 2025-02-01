"use server";
import { isAuthorized } from "@/libs/isAuthorized";
import {saveWallet, Wallet} from "@/libs/WalletSave"


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

    // Process each wallet in the list
    const savedResults = await Promise.all(
      wallets.map(async (wallet: Wallet) => {
        return saveWallet(wallet, user);
      })
    );

    // Extract wallets and tokens from the results
    const savedWallets = savedResults.map(result => result.wallet);
    const savedTokens = savedResults.flatMap(result => result.tokens);

    // Log the number of wallets and tokens being saved
    console.log(`Processed ${savedWallets.length} wallets and ${savedTokens.length} tokens`);

    // Return the created/updated wallets and tokens
    return new Response("Successfully saved wallets", { status: 200 });
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
