import { Cycle, PlanStatus } from '@prisma/client';

export type Plan = {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  price: number;
  billingCycles: Cycle[];
  billingCyclesPrices?: Record<Cycle, number>;
  tokens?: PlanToken[];
  legacyTokens?: {
    symbol: string;
    isActive: boolean;
    activeWallets: {
      address: string;
      blockchain: string;
    }[];
  }[];
  features?: any; // This is Json in Prisma, could be more strictly typed based on your needs
  acceptedCoins?: string[];
  status?: PlanStatus;
}

export interface PlanToken {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  isActive?: boolean;
  activeWallets?: {
    address: string;
    blockchain: string;
  }[];
}