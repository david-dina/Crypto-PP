import { getChainConfigByName } from "@/libs/chainConfig";
import { chainNameToKey, getChainTokenConfigByKey } from "@/libs/tokenConfig";
import { ethers, JsonRpcProvider, formatEther, formatUnits } from "ethers";
import { prisma } from "@/libs/prismaDb";


export interface SecondaryTokenBalances {
    name: string; // Token symbol (e.g., "USDC")
    balance: string; // Token balance (e.g., "100.0")
    icon?: string; // Token icon URL (optional)
  }
  


export interface Wallet {
    address: string;
    provider: string;
    blockchain: string;
    providerImage?: string;
  }
  

export async function saveWallet(wallet: Wallet, user: { id: string; role: string }) {
    const { address, provider, blockchain, providerImage } = wallet;
    if (!address || !provider || !blockchain) {
      throw new Error("Missing required wallet fields");
    }
  
    const walletCached = await prisma.wallet.findFirst({
      where: { address, provider, blockchain },
    });
    if (walletCached) {
      return { wallet: walletCached, tokens: [] };
    }
  
    const chainConfig = getChainConfigByName(blockchain);
    if (!chainConfig) {
      console.error("Unsupported chain name:", blockchain);
      return { wallet: null, tokens: [] };
    }
    const chainKey = chainNameToKey(chainConfig.name);
    if (!chainKey) {
      console.error("No matching chainKey found for", chainConfig.name);
      return { wallet: null, tokens: [] };
    }
    const tokensConfig = getChainTokenConfigByKey(chainKey);
    if (!tokensConfig && chainConfig.name !== "sepolia") {
      console.error("No tokens config for chainKey:", chainKey);
      return { wallet: null, tokens: [] };
    }
    console.log("Using RPC provider:", chainConfig.rpcUrl);
    const RPCprovider = new JsonRpcProvider(chainConfig.rpcUrl);
    const balanceBig = await RPCprovider.getBalance(address);
    const balance: number = parseFloat(formatEther(balanceBig));
  
    let savedWallet;
    savedWallet = await prisma.wallet.create({
        data: {
          address,
          providerImage,
          blockchain,
          provider,
          balance,
        },
    })
    const tokenBalances = [];
    if (tokensConfig) {
      for (const token of tokensConfig.tokens) {
        console.log(`Checking balance for ${token.symbol} at address: ${token.address}`);
        const abi = ["function balanceOf(address owner) view returns (uint256)"];
        const tokenContract = new ethers.Contract(token.address, abi, RPCprovider);
        const rawBalance = await tokenContract.balanceOf(address);
        const formattedBalance = formatUnits(rawBalance, token.decimals);
        if (parseFloat(formattedBalance) > 0) {
          const tokenBalance = await prisma.tokenBalance.create({
            data: {
              walletId: savedWallet.id,
              tokenName: token.name,
              balance: parseFloat(formattedBalance),
              symbol: token.symbol,
            },
          });
          tokenBalances.push(tokenBalance);
        }
      }
    }
    await prisma.walletActivity.upsert({
        where: { userId_walletId: { userId: user.id, walletId: savedWallet.id } },
        update: {
            lastUsed: new Date()
        },
        create: {   
            walletId: savedWallet.id,
            userId: user.id,
            lastUsed: new Date()
            
        }
    })
  
    return { wallet: savedWallet, tokens: tokenBalances };
  }