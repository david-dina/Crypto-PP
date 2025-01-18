"use client";
import { Widget, WidgetConfig} from "@rango-dev/widget-embedded";
import { WalletData } from "@/types/Wallet";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletData | null;
  onboardInstance: any;
}

const SwapModal = ({ isOpen, onClose, wallet, onboardInstance }: SwapModalProps) => {
  const config: WidgetConfig = {
    to: {
      blockchains: ['ETH', 'BSC', 'POLYGON', 'BASE']
    },
    apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32', // Replace with your API key in production
    walletConnectProjectId: 'f7ab18fc1efde74a87711916ac109c69', // Replace with your project ID
    wallets: ['metamask', 'wallet-connect', 'trust', 'coinbase', 'injected','phantom'], // Add more supported wallets as needed
    trezorManifest: {
      appUrl: 'https://your-app-url.com/',
      email: 'your-email@domain.com'
    },
    tonConnect: {
      manifestUrl: ''
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]" onClick={onClose}>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={(e) => e.stopPropagation()}
      >
        <Widget config={config} />
      </div>
    </div>
  );
};

export default SwapModal;