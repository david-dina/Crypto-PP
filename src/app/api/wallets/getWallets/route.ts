"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { Prisma } from "@prisma/client";
import {saveWallet} from "@/libs/WalletSave";
import {WalletData} from "@/types/Wallet";

// Input type for wallet connections
export async function POST(req: Request) {
  try {
    // Check authorization
    const { user } = await isAuthorized();
    if (!user) {
      console.error('Unauthorized user attempt');
      return new Response("Unauthorized", { status: 401 });
    }

    console.log("Parsing request body");
    const { wallets } = await req.json();
    console.log('Received wallets:', wallets);

    // Process each wallet connection
    const results = await Promise.all(wallets.map(async (connection) => {
      console.log('Processing connection:', connection);
      
      // Try to find the existing wallet
      let wallet = await prisma.wallet.findFirst({
        where: {
          address: connection.address,
          provider: connection.provider,
          blockchain: connection.blockchain,
        },
      });
      
      console.log('Found existing wallet:', wallet);

      // If the wallet doesn't exist, create it using saveWallet
      if (!wallet) {
        console.log('Creating new wallet for:', connection);
        const { wallet: newWallet, tokens } = await saveWallet(connection, user);
        if (!newWallet || !tokens) {
          console.error('Failed to create wallet:', connection);
          return {wallet: null, tokens: []};
        }
        console.log('Created new wallet:', newWallet);
        return { wallet: newWallet, tokens };
      }

      const tokens = await prisma.tokenBalance.findMany({
        where: {
          walletId: wallet.id,
        },
        select: {
          walletId: true,
          tokenName: true,
          balance: true,
          symbol: true,
        },
      });
      
      console.log('Found tokens for wallet:', tokens);
      await prisma.walletActivity.upsert({
        where: { userId_walletId: { userId: user.id, walletId: wallet.id } },
        update: {
            lastUsed: new Date()
        },
        create: {   
            walletId: wallet.id,
            userId: user.id,
            lastUsed: new Date()
        }
    })
      return { wallet,tokens};
    }));

    // Filter out null wallets
    const filteredResults = results.filter(result => result.wallet !== null);

    // Transform the results array to match the WalletData interface and return the formatted results
    const formattedResults: WalletData[] = filteredResults.map(({ wallet, tokens}) => ({
      id: wallet.id,
      address: wallet.address,
      blockchain: wallet.blockchain,
      provider: wallet.provider,
      providerImage: wallet.providerImage || undefined,
      balance: wallet.balance.toString(), // Ensure this is a string
      updatedAt: wallet.updatedAt.toISOString(), // Ensure this is a string
      tokenBalances: tokens.map(token => ({
        tokenName: token.tokenName,
        balance: token.balance.toString(), // Convert balance to string if necessary
        icon: token.symbol || undefined // Assuming icon is optional
      }))
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: formattedResults
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
    case "Sepolia":
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
