"use client";
import { SessionProvider } from "next-auth/react";
import ToastContext from "../context/ToastContext";
import React from "react";

// Import Web3 Onboard
import { init, Web3OnboardProvider } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";

// Initialize Web3 Onboard
const injected = injectedModule();

const web3Onboard = init({
  wallets: [injected], // Injected wallets like MetaMask
  chains: [
    {
      id: "0x1", // Ethereum Mainnet
      token: "ETH",
      label: "Ethereum",
      rpcUrl: "https://mainnet.infura.io/v3/6318caa00e7a48e8a961f00bf056b473",
    },
    {
      id: "0x89", // Polygon
      token: "MATIC",
      label: "Polygon",
      rpcUrl: "https://polygon-rpc.com",
    },
  ],
  appMetadata: {
    name: "Your App Name",
    description: "Your platform description",
    icon: "/favicon.ico",
    logo: "/logo.png",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionProvider>
        <ToastContext />
        {/* Web3 Onboard Provider */}
        <Web3OnboardProvider web3Onboard={web3Onboard}>
          {children}
        </Web3OnboardProvider>
      </SessionProvider>
    </>
  );
}
