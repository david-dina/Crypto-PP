"use client";
import { Widget, WidgetConfig } from "@rango-dev/widget-embedded";
import { WalletData } from "@/types/Wallet";

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletData | null;
}

const SwapModal = ({ 
  isOpen, 
  onClose, 
  wallet,
}: SwapModalProps) => {
  if (!wallet) return null;
  console.log("walletProvider", wallet)
  const config: WidgetConfig = {
    to: {
      blockchains: ['ETH', 'BSC', 'POLYGON', 'BASE']
    },
    apiKey: 'c6381a79-2817-4602-83bf-6a641a409e32',
    walletConnectProjectId: 'f7ab18fc1efde74a87711916ac109c69',
    wallets: [wallet.provider],
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
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-dark rounded-xl p-4 w-[480px] max-w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Widget config={config} />
      </div>
    </div>
  );
};

export default SwapModal;