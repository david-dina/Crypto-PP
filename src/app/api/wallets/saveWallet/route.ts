"use server";
import { prisma } from "@/libs/prismaDb";
import { isAuthorized } from "@/libs/isAuthorized";
import { ethers, JsonRpcProvider,formatEther,formatUnits,getAddress } from "ethers";
import { FaBalanceScale } from "react-icons/fa";

type CuratedTokensType = {
  [key: string]: { name: string; address: string;symbol:string;decimals:number;isNative: boolean }[];
};

// Curated list of tokens for each blockchain
const curatedTokens: CuratedTokensType = {
  'Ethereum': [
    { name: 'Ethereum', address: '0x0000000000000000000000000000000000000000', symbol: 'ETH', decimals: 18, isNative: true },
    { name: 'USD Coin', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC', decimals: 6, isNative: false },
  ],
  'Polygon': [
    { name: 'Polygon', address: '0x0000000000000000000000000000000000001010', symbol: 'MATIC', decimals: 18, isNative: true },
    { name: 'USD Coin (PoS)', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', symbol: 'USDC', decimals: 6, isNative: false },
    { name: 'Tether', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', symbol: 'USDT', decimals: 6, isNative: false },
  ],
  'BinanceWallet': [
    { name: 'Binance Coin', address: '0x0000000000000000000000000000000000000000', symbol: 'BNB', decimals: 18, isNative: true },
    { name: 'Binance USD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', symbol: 'BUSD', decimals: 18, isNative: false },
    { name: 'PancakeSwap', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', symbol: 'CAKE', decimals: 18, isNative: false },
  ],
};

// Helper function to fetch native balance
const fetchBalance = async (address: string, provider: JsonRpcProvider) => {
  const checksumTokenAddress = getAddress(address);
  const balance = await provider.getBalance(checksumTokenAddress);
  return parseFloat(formatEther(balance));
};

const fetchTokenBalances = async (address: string, blockchain: string, provider: JsonRpcProvider) => {
  const tokens = curatedTokens[blockchain] || [];

  // Convert user address to checksum format
  const checksumUserAddress = getAddress(address);

  const balances = await Promise.all(
    tokens.map(async (token) => {
      // Convert token address to checksum format
      const checksumTokenAddress = getAddress(token.address);
      if (token.isNative) {
        const balance = await provider.getBalance(checksumUserAddress);
        return { 
          name: token.name, 
          address: checksumTokenAddress, 
          balance: parseFloat(formatEther(balance)),
          symbol: token.symbol, // Use hardcoded symbol
          decimals: token.decimals, // Use hardcoded decimals
        };
      } else {
        // Fetch the token balance
        const erc20ABI = ['function balanceOf(address) view returns (uint256)'];
        const contract = new ethers.Contract(checksumTokenAddress, erc20ABI, provider);
        const balance = await contract.balanceOf(checksumUserAddress); // Use user's address

        return { 
          name: token.name, 
          address: checksumTokenAddress, 
          balance: parseFloat(formatUnits(balance, token.decimals)), // Use hardcoded decimals
          symbol: token.symbol, // Use hardcoded symbol
          decimals: token.decimals, // Use hardcoded decimals
        };
      }
    })
  );
  return balances;
};

// Helper function to update or create token balances
const updateOrCreateTokenBalance = async (walletId: string, tokenData: { contract: string; tokenName: string; symbol: string; decimals: number; balance: number }) => {
  await prisma.tokenBalance.upsert({
    where: { walletId_contract: { walletId: walletId, contract: tokenData.contract } }, // Unique constraint
    update: { ...tokenData }, // Update existing record
    create: { walletId, ...tokenData }, // Create new record
  });
};
export async function POST(req: Request) {
  try {
    // Parse the request body
    const { address, blockchain, provider } = await req.json();

    // Validate required fields
    if (!address || !blockchain || !provider) {
      return new Response("Missing required wallet data", { status: 400 });
    }

    // Check if the user is authorized
    const { user } = await isAuthorized();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Get the appropriate provider
    let rpcProvider;
    switch (blockchain) {
      case "Ethereum":
        rpcProvider = new JsonRpcProvider("https://mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473");
        break;
      case "Polygon":
        rpcProvider = new JsonRpcProvider("https://polygon-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473");
        break;
      case "Binance Smart Chain":
        rpcProvider = new JsonRpcProvider("https://bsc-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473");
        break;
      default:
        throw new Error("Unsupported blockchain");
    }
    // Fetch the native balance
    const nativeBalance = await fetchBalance(address, rpcProvider);


    // Fetch balances and metadata for curated tokens
    const tokenBalances = await fetchTokenBalances(address, blockchain, rpcProvider);

    let wallet;

    if (user.role === "BUSINESS") {
      // Find the company associated with the user
      const company = await prisma.company.findFirst({
        where: { ownerId: user.id },
      });

      if (!company) {
        return new Response("Company not found for the user", { status: 404 });
      }

      // Save the wallet with the company ID
      wallet = await prisma.wallet.create({
        data: {
          address,
          blockchain,
          balance: nativeBalance || 0.0, // Default to 0.0 if balance is not provided
          provider,
          companyId: company.id,
        },
      });
    } else {
      // Save the wallet with the user ID
      wallet = await prisma.wallet.create({
        data: {
          address,
          blockchain,
          balance: nativeBalance || 0.0, // Default to 0.0 if balance is not provided
          provider,
          userId: user.id,
        },
      });
    }

    // Update or create token balances
    await Promise.all(
      tokenBalances.map((tb) =>
        updateOrCreateTokenBalance(wallet.id, {
          contract: tb.address,
          tokenName: tb.name,
          symbol: tb.symbol,
          decimals: tb.decimals,
          balance: tb.balance,
        })
      )
    );

    // Return the created wallet
    return new Response(JSON.stringify(wallet), { status: 201 });
  } catch (error) {
    console.error("Error saving wallet to database:", error);

    // Handle Prisma-specific errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return new Response("Wallet address already exists", { status: 409 });
    }

    // Generic error response
    return new Response("Failed to save wallet", { status: 500 });
  }
}