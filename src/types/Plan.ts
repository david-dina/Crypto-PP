import { Cycle, PlanStatus } from '@prisma/client';

export type Plan = {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  price: number;
  billingCycles: Cycle[];
  billingCyclesPrices?: Record<Cycle, number>;
  features?: any; // This is Json in Prisma, could be more strictly typed based on your needs
  acceptedCoins?: string[];
  status?: PlanStatus;
}