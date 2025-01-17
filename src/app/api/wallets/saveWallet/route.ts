"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { getChainConfigByName } from "@/libs/chainConfig";
import { chainNameToKey, getChainTokenConfigByKey } from "@/libs/tokenConfig";
import { ethers, JsonRpcProvider,formatEther,formatUnits} from "ethers";

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
    console.log(`Processing ${wallets.length} wallets s`);

    // Process each wallet in the list
    const savedWallets = await Promise.all(
      wallets.map(async (wallet: { address: string; provider: string; blockchain: string; providerImage?:string;}) => {
        const { address, provider, blockchain,providerImage} = wallet;
        if (!address || !provider || !blockchain) {
          throw new Error("Missing required wallet fields");
        }

        const walletCached = await prisma.wallet.findFirst({
          where: { address: address, provider: provider, blockchain: blockchain },
        });
        if (walletCached) {
        return walletCached;
        }
        const chainConfig = getChainConfigByName(blockchain);
        if (!chainConfig) {
          console.error("Unsupported chain name:", blockchain);
          return;
        }
        const chainKey = chainNameToKey(chainConfig.name);
        if (!chainKey) {
          console.error("No matching chainKey found for", chainConfig.name);
          return;
        }
        const tokensConfig = getChainTokenConfigByKey(chainKey);
        if (!tokensConfig && (chainConfig.name !== "sepolia")) {
          console.error("No tokens config for chainKey:", chainKey);
          return;
        }
        console.log("Using RPC provider:", chainConfig.rpcUrl);
        const RPCprovider = new JsonRpcProvider(chainConfig.rpcUrl);
        const balanceBig = await RPCprovider.getBalance(address);
        const balance: number = parseFloat(formatEther(balanceBig));


        let savedWallet;
        if (user.role === "BUSINESS") {
          const company = await prisma.company.findFirst({
            where: { ownerId: user.id },
          });
          if (!company) {
            throw new Error("Company not found for the user");
          }
          savedWallet = await prisma.wallet.create({
            data: {
              address,
              providerImage,
              blockchain,
              provider,
              balance,
              companyId: company.id,
            },
          });
        } else {
          savedWallet = await prisma.wallet.create({
            data: {
              address,
              blockchain,
              providerImage,
              provider,
              balance,
              userId: user.id,
            },
          });
        }
        if (!tokensConfig) {
          return
        }
        for (const token of tokensConfig.tokens) {
          console.log(`Checking balance for ${token.symbol} at address: ${token.address}`);
          const abi = ["function balanceOf(address owner) view returns (uint256)"];
          const tokenContract = new ethers.Contract(token.address, abi, RPCprovider);
          const rawBalance = await tokenContract.balanceOf(address);
          const formattedBalance = formatUnits(rawBalance, token.decimals);
          if (parseFloat(formattedBalance) > 0) {
            return prisma.tokenBalance.create({
              data: {
                walletId: savedWallet.id,
                tokenName: token.name,
                balance: parseFloat(formattedBalance),
                symbol: token.symbol,
              },
            });
          }
        }
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
