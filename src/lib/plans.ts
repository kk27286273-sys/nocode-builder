export type PlanId = 'basic' | 'pro' | 'premium';

export const PLANS: Record<PlanId, {
  name: string;
  setupFee: number;
  monthlyFee: number;
}> = {
  basic:   { name: 'Basic',   setupFee: 700000,  monthlyFee: 59000 },
  pro:     { name: 'Pro',     setupFee: 1000000, monthlyFee: 79000 },
  premium: { name: 'Premium', setupFee: 1200000, monthlyFee: 99000 },
};

export function getPlan(id: string | null) {
  return PLANS[(id as PlanId)] ?? PLANS.pro;
}