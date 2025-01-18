export type Plan = {
  id: string;
  companyId: string;
  name: string;
  price: number;
  billingCycles: string[];
  isTiered: boolean;
  tierGroupId?: string | null;
  position?: number | null;
  features?: any; // This is Json in Prisma, could be more strictly typed based on your needs
} 