"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import ToastContext from "../context/ToastContext";

// Web3 Onboard Imports
import { init, Web3OnboardProvider } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

// Import Wallet Context
import { WalletProvider } from "@/components/Wallet/WalletContext";

// Type for Children
interface RootLayoutProps {
  children: React.ReactNode;
}

// Initialize Injected Wallets (MetaMask, etc.)
const injected = injectedModule();

// Web3 Onboard Configuration
const web3Onboard = init({
  wallets: [injected], // Injected wallets (MetaMask, etc.)
  chains: [
    {
      id: "0x1", // Ethereum Mainnet
      token: "ETH",
      label: "Ethereum",
      rpcUrl: "https://mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473", // Replace with your Infura ID
    },
    {
      id: "0x89", // Polygon Mainnet
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon-rpc.com", // Polygon RPC
    },
  ],
  appMetadata: {
    name: "Crypto-PP", // Replace with your app name
    description: "Decentralized Payment Platform",
    icon: "/favicon.ico", // Replace with your icon
    logo: "/logo.png", // Replace with your logo
  },
  accountCenter: {
    desktop: {
      enabled: true,
      position: "topRight", // Position wallet interface
    },
    mobile: {
      enabled: true,
      position: "topRight",
    },
  },
  theme: "dark", // Set default theme (dark or light)
});

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <SessionProvider>
      <ToastContext />
      {/* Web3 Onboard Provider */}
      <Web3OnboardProvider web3Onboard={web3Onboard}>
        {/* Wallet Context Provider */}
        <WalletProvider>{children}</WalletProvider>
      </Web3OnboardProvider>
    </SessionProvider>
  );
};

export default RootLayout;
