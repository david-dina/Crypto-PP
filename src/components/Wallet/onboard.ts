import Onboard from "@web3-onboard/core";
import injectedModule from "@web3-onboard/injected-wallets";
import wagmi from "@web3-onboard/wagmi";

// Chain Configurations
const chains = [
  {
    id: "0x1", // Ethereum Mainnet
    token: "ETH",
    label: "Ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY", // Replace with your Infura Key
  },
  {
    id: "0x89", // Polygon Mainnet
    token: "MATIC",
    label: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
  },
  {
    id: "0x38", // Binance Smart Chain
    token: "BNB",
    label: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
  },
  {
    id: "0xa", // Optimism
    token: "ETH",
    label: "Optimism",
    rpcUrl: "https://mainnet.optimism.io",
  },
  {
    id: "0xa4b1", // Arbitrum One
    token: "ETH",
    label: "Arbitrum One",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
];

// Injected Wallet Module (MetaMask, etc.)
const injected = injectedModule();

// Initialize Onboard
const onboard = Onboard({
  wagmi, // Enables Wagmi support
  wallets: [injected], // Use injected wallets
  chains,
  appMetadata: {
    name: "Crypto Platform",
    description: "Multi-Chain Wallet Dashboard",
    icon: "/favicon.ico", // Replace with your icon
    logo: "/logo.png", // Replace with your logo
  },
  accountCenter: {
    desktop: { enabled: true, position: "topRight" },
    mobile: { enabled: true, position: "top" },
  },
  notify: {
    enabled: true,
    position: "bottomRight",
  },
});

export default onboard;
