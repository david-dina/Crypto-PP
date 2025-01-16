/******************************************************
 * 1) TOKEN INTERFACES & GLOBAL REGISTRY
 ******************************************************/

// Describes a single token on a specific chain
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: string; // The contract address on this chain
    // Optional fields (logo, coingeckoId, isStablecoin, etc.) can be added
  }
  
  // Each chain config object holds the numeric chainId, a display chainName, and a list of tokens
  export interface ChainTokenConfig {
    chainId: number;
    chainName: string;
    tokens: Token[];
  }
  
  // Keyed by chain name, e.g., "ethereum", "bsc", "polygon", "sepolia"
  export const SUPPORTED_TOKENS: { [chainKey: string]: ChainTokenConfig } = {
    ethereum: {
      chainId: 1,
      chainName: "Ethereum",
      tokens: [
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 6,
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7"
        },
        {
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: 18,
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
        }
        // ... more Ethereum tokens
      ]
    },
    bsc: {
      chainId: 56,
      chainName: "Binance Smart Chain",
      tokens: [
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 18,
          address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d"
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 18,
          address: "0x55d398326f99059ff775485246999027b3197955"
        },
        {
          symbol: "WBNB",
          name: "Wrapped BNB",
          decimals: 18,
          address: "0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
        }
        // ... more BSC tokens
      ]
    },
    polygon: {
      chainId: 137,
      chainName: "Polygon",
      tokens: [
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 6,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 6,
          address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
        },
        {
          symbol: "WMATIC",
          name: "Wrapped MATIC",
          decimals: 18,
          address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
        }
        // ... more Polygon tokens
      ]
    },
    sepolia: {
      chainId: 11155111,
      chainName: "Sepolia",
      tokens: []
    }
  };
  
  /******************************************************
   * 2) HELPER FUNCTIONS
   ******************************************************/
  
  /**
   * Gets the chainKey (e.g., 'ethereum', 'bsc') given a numeric chainId,
   * or returns undefined if not found.
   */
  export function getChainKeyByChainId(chainId: number): string | undefined {
    const entries = Object.entries(SUPPORTED_TOKENS); 
    const foundEntry = entries.find(([, config]) => config.chainId === chainId);
    return foundEntry ? foundEntry[0] : undefined;
  }
  
  /**
   * Retrieves the ChainTokenConfig object by its chain key (e.g., 'bsc').
   */
  export function getChainTokenConfigByKey(chainKey: string): ChainTokenConfig | undefined {
    return SUPPORTED_TOKENS[chainKey];
  }
  
  /**
   * Retrieves the ChainTokenConfig object by numeric chainId.
   */
  export function getChainTokenConfigByChainId(chainId: number): ChainTokenConfig | undefined {
    const chainKey = getChainKeyByChainId(chainId);
    return chainKey ? SUPPORTED_TOKENS[chainKey] : undefined;
  }
  
  /**
   * Returns the list of tokens on a particular chain (by chain key).
   * If chain key is invalid, returns an empty array.
   */
  export function getTokensByChainKey(chainKey: string): Token[] {
    const chainConfig = SUPPORTED_TOKENS[chainKey];
    return chainConfig ? chainConfig.tokens : [];
  }
  
  /**
   * Returns the list of tokens on a particular chain (by numeric chainId).
   * If chainId is not supported, returns an empty array.
   */
  export function getTokensByChainId(chainId: number): Token[] {
    const chainConfig = getChainTokenConfigByChainId(chainId);
    return chainConfig ? chainConfig.tokens : [];
  }
  
  /**
   * Finds a token by contract address on a specific chain key.
   * Returns undefined if not found.
   */
  export function getTokenByAddressOnChainKey(chainKey: string, address: string): Token | undefined {
    const normalized = address.toLowerCase();
    const tokens = getTokensByChainKey(chainKey);
    return tokens.find((t) => t.address.toLowerCase() === normalized);
  }
  
  /**
   * Finds a token by contract address on a specific numeric chainId.
   * Returns undefined if not found.
   */
  export function getTokenByAddressOnChainId(chainId: number, address: string): Token | undefined {
    const normalized = address.toLowerCase();
    const tokens = getTokensByChainId(chainId);
    return tokens.find((t) => t.address.toLowerCase() === normalized);
  }
  
  /**
   * Finds a token by symbol on a specific chain key, case-insensitive.
   * Returns undefined if not found.
   */
  export function getTokenBySymbolOnChainKey(chainKey: string, symbol: string): Token | undefined {
    const tokens = getTokensByChainKey(chainKey);
    return tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
  }
  
  /**
   * Finds a token by symbol on a specific numeric chainId, case-insensitive.
   * Returns undefined if not found.
   */
  export function getTokenBySymbolOnChainId(chainId: number, symbol: string): Token | undefined {
    const tokens = getTokensByChainId(chainId);
    return tokens.find((t) => t.symbol.toLowerCase() === symbol.toLowerCase());
  }
  


export function chainNameToKey(chainName: string): string {
    switch (chainName) {
      case "Ethereum":
        return "ethereum";
      case "Binance Smart Chain":
        return "bsc";
      case "Polygon":
        return "polygon";
      case "Sepolia":
        return "sepolia";
      default:
        throw new Error(`Unsupported chain name: ${chainName}`);
    }
}