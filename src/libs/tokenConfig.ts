/******************************************************
 * 1) TOKEN INTERFACES & GLOBAL REGISTRY
 ******************************************************/

// Describes a single token on a specific chain
export interface Token {
    symbol: string;
    name: string;
    decimals: number;
    address: string; // The contract address on this chain
    logoUrl?: string;
    coingeckoId?: string;
    type?: 'native' | 'erc20';
    isStablecoin?: boolean;
    explorerUrl?: string;
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
          symbol: "ETH",
          name: "Ethereum",
          decimals: 18,
          address: "0x0000000000000000000000000000000000000000",
          type: "native",
          isStablecoin: false
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 6,
          address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 6,
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "WETH",
          name: "Wrapped Ether",
          decimals: 18,
          address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
          type: "erc20",
          isStablecoin: false
        }
        // ... more Ethereum tokens
      ]
    },
    bsc: {
      chainId: 56,
      chainName: "Binance Smart Chain",
      tokens: [
        {
          symbol: "BNB",
          name: "Binance Coin",
          decimals: 18,
          address: "0x0000000000000000000000000000000000000000",
          type: "native",
          isStablecoin: false
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 18,
          address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 18,
          address: "0x55d398326f99059ff775485246999027b3197955",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "WBNB",
          name: "Wrapped BNB",
          decimals: 18,
          address: "0xBB4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
          type: "erc20",
          isStablecoin: false
        }
        // ... more BSC tokens
      ]
    },
    polygon: {
      chainId: 137,
      chainName: "Polygon",
      tokens: [
        {
          symbol: "MATIC",
          name: "Polygon",
          decimals: 18,
          address: "0x0000000000000000000000000000000000000000",
          type: "native",
          isStablecoin: false
        },
        {
          symbol: "USDC",
          name: "USD Coin",
          decimals: 6,
          address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "USDT",
          name: "Tether USD",
          decimals: 6,
          address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
          type: "erc20",
          isStablecoin: true
        },
        {
          symbol: "WMATIC",
          name: "Wrapped MATIC",
          decimals: 18,
          address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
          type: "erc20",
          isStablecoin: false
        }
        // ... more Polygon tokens
      ]
    },
    sepolia: {
      chainId: 11155111,
      chainName: "Sepolia",
      tokens: [
        {
          symbol: "ETH",
          name: "Sepolia Ether",
          decimals: 18,
          address: "0x0000000000000000000000000000000000000000",
          type: "native",
          isStablecoin: false
        }
      ]
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
  
  /**
   * Returns all supported chain configurations
   */
  export function getAllChains(): ChainTokenConfig[] {
    return Object.values(SUPPORTED_TOKENS);
  }
  
  /**
   * Checks if a token is supported on a specific chain
   */
  export function isTokenSupported(chainId: number, tokenAddress: string): boolean {
    return !!getTokenByAddressOnChainId(chainId, tokenAddress);
  }
  
  /**
   * Returns only stablecoin tokens for a given chain
   */
  export function getStablecoins(chainId: number): Token[] {
    return getTokensByChainId(chainId).filter((token) => token.isStablecoin);
  }
  
  /**
   * Returns the native token (ETH, MATIC, etc.) for a given chain
   */
  export function getNativeTokenForChain(chainId: number): Token | undefined {
    return getTokensByChainId(chainId).find((token) => token.type === 'native');
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
  
  /**
   * Returns all tokens (both native and non-native) for a given chain
   */
  export function getAllTokensForChain(chainId: number): Token[] {
    return getTokensByChainId(chainId);
  }
  
  /**
   * Returns only non-native (ERC20) tokens for a given chain
   */
  export function getNonNativeTokensForChain(chainId: number): Token[] {
    return getTokensByChainId(chainId).filter((token) => token.type === 'erc20');
  }
  
  /**
   * Converts various chain name formats to our supported chain keys
   * Handles common variations in chain names from different sources
   */
  export function normalizeChainNameToKey(chainName: string): string {
    const normalized = chainName.trim().toLowerCase();
    
    switch (normalized) {
        case 'ethereum':
        case 'eth':
        case 'mainnet':
            return 'ethereum';
            
        case 'binance smart chain':
        case 'bsc':
        case 'bnb chain':
        case 'binance':
            return 'bsc';
            
        case 'polygon':
        case 'matic':
        case 'polygon mainnet':
            return 'polygon';
            
        case 'sepolia':
        case 'sepolia testnet':
            return 'sepolia';
            
        default:
            throw new Error(`Unsupported chain name: ${chainName}`);
    }
  }