/******************************************************
 * 1) CHAIN CONFIG INTERFACE & GLOBAL REGISTRY
 ******************************************************/

// Each chain has a decimal ID, a matching hex string,
// a display name, an RPC URL, an explorer, and a native currency.
export interface ChainConfig {
    chainId: number; 
    hexChainId: string; 
    name: string;
    rpcUrl: string;
    blockExplorerUrl: string;
    nativeCurrencySymbol: string;
  }
  
  // A global object storing info about each supported chain.
  export const SUPPORTED_CHAINS: { [key: string]: ChainConfig } = {
    ethereum: {
      chainId: 1,
      hexChainId: "0x1",
      name: "Ethereum",
      rpcUrl: "https://mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473",
      blockExplorerUrl: "https://etherscan.io",
      nativeCurrencySymbol: "ETH"
    },
    bsc: {
      chainId: 56,
      hexChainId: "0x38",
      name: "Binance Smart Chain",
      rpcUrl: "https://bsc-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473",
      blockExplorerUrl: "https://bscscan.com",
      nativeCurrencySymbol: "BNB"
    },
    polygon: {
      chainId: 137,
      hexChainId: "0x89",
      name: "Polygon",
      rpcUrl: "https://polygon-mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473",
      blockExplorerUrl: "https://polygonscan.com",
      nativeCurrencySymbol: "MATIC"
    },
    sepolia: {
      chainId: 11155111,
      hexChainId: "0xaa36a7",
      name: "Sepolia",
      rpcUrl: "https://sepolia.infura.io/v3/6318caa00e7a48e8a961f00bf056b473",
      blockExplorerUrl: "https://sepolia.etherscan.io",
      nativeCurrencySymbol: "ETH"
    }
  };
  
  /******************************************************
   * 2) HELPER FUNCTIONS
   ******************************************************/
  
  /**
   * Given a decimal chainId, returns the corresponding ChainConfig if supported.
   * Otherwise returns undefined.
   */
  export function getChainConfigByDecimalId(chainId: number): ChainConfig | undefined {
    // Loop through the SUPPORTED_CHAINS and find a match by chainId
    return Object.values(SUPPORTED_CHAINS).find((config) => config.chainId === chainId);
  }
  
  /**
   * Given a hex chainId, returns the corresponding ChainConfig if supported.
   * Otherwise returns undefined.
   */
  export function getChainConfigByHexId(hexId: string): ChainConfig | undefined {
    // Convert hex to lowercase just for consistency
    const normalizedHex = hexId.toLowerCase();
    return Object.values(SUPPORTED_CHAINS).find(
      (config) => config.hexChainId.toLowerCase() === normalizedHex
    );
  }

  export function getChainConfigByName(chainName: string): ChainConfig | undefined {
    const normalizedName = chainName.toLowerCase();
    return Object.values(SUPPORTED_CHAINS).find(
      (config) => config.name.toLowerCase() === normalizedName
    );
  }
  
  /**
   * Checks if a given hex chainId is supported in SUPPORTED_CHAINS.
   */
  export function isSupportedChain(hexId: string): boolean {
    return !!getChainConfigByHexId(hexId);
  }
  
  /**
   * Detects which chain the user's wallet is currently on, returning a friendly name
   * (Ethereum, Binance Smart Chain, Polygon, Sepolia) if supported,
   * or "Unsupported Chain (ID: {chainId})" if not recognized.
   */
  export async function detectBlockchain(provider: any): Promise<string> {
    try {
      if (provider?.request && typeof provider.request === "function") {
        // Request the chain ID from the connected wallet
        const chainIdHex = await provider.request({ method: "eth_chainId" });
  
        // Check if we support this hex ID
        const chainConfig = getChainConfigByHexId(chainIdHex);
        if (chainConfig) {
          return chainConfig.name;
        }
  
        // If not found in our registry, label it unsupported
        return `Unsupported Chain (ID: ${chainIdHex})`;
      }
      return "Unsupported Chain";
    } catch (error) {
      console.error("Error detecting blockchain:", error);
      return "Unsupported Chain";
    }
  }
  
  /**
   * Convenience function: returns the chain name if supported,
   * or throws an error if not.
   */
  export async function requireSupportedChain(provider: any): Promise<string> {
    const chainName = await detectBlockchain(provider);
    if (chainName.startsWith("Unsupported Chain")) {
      throw new Error(chainName);
    }
    return chainName;
  }
  