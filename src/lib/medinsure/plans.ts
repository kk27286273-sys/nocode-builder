export const medinsurePlans = [
  { id: 'solo', name: 'Solo', minimum: 1, unit: 22000, discount: 0 },
  { id: 'team', name: 'Team', minimum: 30, unit: 19800, discount: 10 },
  { id: 'business', name: 'Business', minimum: 50, unit: 17600, discount: 20 },
  { id: 'enterprise', name: 'Enterprise', minimum: 100, unit: 15400, discount: 30 },
] as const;

export function quoteMedinsure(planId: unknown, seats: unknown) {
  const plan = medinsurePlans.find((item) => item.id === planId);
  if (!plan || typeof seats !== 'number' || !Number.isSafeInteger(seats) ||
    seats < plan.minimum || seats > 10000 || (plan.id === 'solo' && seats !== 1) ||
    !Number.isSafeInteger(seats * plan.unit)) return null;
  return { plan, seats, amount: seats * plan.unit };
}
