export type Rate = { threshold: number; discount: number; id?: string };
export type PricingPolicy = { individualBase: number; gaBase: number; individual: Rate[]; ga: Rate[] };
export const initialPolicy: PricingPolicy = {
  individualBase: 22000, gaBase: 22000,
  individual: [{ threshold: 1, discount: 0 }, { threshold: 3, discount: 10 }, { threshold: 6, discount: 15 }, { threshold: 12, discount: 20 }],
  ga: [{ threshold: 2, discount: 0 }, { threshold: 30, discount: 10 }, { threshold: 50, discount: 20 }, { threshold: 100, discount: 30 }],
};

export function validPolicy(value: unknown): value is PricingPolicy {
  if (!value || typeof value !== 'object') return false;
  const p = value as PricingPolicy;
  const integer = (n: number, min: number, max: number) => Number.isInteger(n) && n >= min && n <= max;
  const rates = (items: Rate[], min: number, max: number) => Array.isArray(items) && items.length > 0 && items.length <= 30 &&
    items.every((row) => row && integer(row.threshold, min, max) && integer(row.discount, 0, 99) &&
      (row.id === undefined || (typeof row.id === 'string' && /^\d{1,4}$/.test(row.id)))) &&
    new Set(items.map((row) => row.threshold)).size === items.length &&
    new Set(items.map((row) => row.id ?? String(row.threshold))).size === items.length;
  return integer(p.individualBase, 100, 1000000) && integer(p.gaBase, 100, 1000000) &&
    rates(p.individual, 1, 36) && rates(p.ga, 2, 1000) && p.ga.some((r) => r.threshold === 2);
}

export function plansFor(policy: PricingPolicy) {
  const unit = (base: number, discount: number) => Math.round(base * (100 - discount) / 100);
  return [
    ...policy.individual.map((rate) => ({
      id: `personal-${rate.id ?? rate.threshold}`, name: `${rate.threshold}개월`, group: 'individual' as const,
      minimum: 1, months: rate.threshold, unit: unit(policy.individualBase, rate.discount), discount: rate.discount,
    })),
    ...policy.ga.map((rate) => ({
      id: `ga-${rate.id ?? rate.threshold}`, name: `GA ${rate.threshold}명 이상`, group: 'ga' as const,
      minimum: rate.threshold, months: 1, unit: unit(policy.gaBase, rate.discount), discount: rate.discount,
    })),
  ];
}
export const medinsurePlans = plansFor(initialPolicy);

export function quoteMedinsure(planId: unknown, seats: unknown, policy = initialPolicy) {
  const plans = plansFor(policy);
  const requested = plans.find((item) => item.id === planId);
  if (!requested || typeof seats !== 'number' || !Number.isSafeInteger(seats) || seats > 10000) return null;
  if (requested.group === 'individual' && seats !== 1) return null;
  if (requested.group === 'ga' && seats < 2) return null;
  const plan = requested.group === 'individual' ? requested :
    plans.filter((item) => item.group === 'ga' && item.minimum <= seats).sort((a, b) => b.minimum - a.minimum)[0];
  return { plan, seats, amount: plan.unit * seats * plan.months };
}
