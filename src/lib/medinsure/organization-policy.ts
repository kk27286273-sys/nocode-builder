export type OrganizationRole = 'branch_manager' | 'assistant_manager' | 'agent';

export type OrganizationPermission =
  | 'view_dashboard'
  | 'manage_staff'
  | 'manage_seats'
  | 'view_billing_status'
  | 'manage_billing'
  | 'manage_contract'
  | 'manage_assistant_managers'
  | 'view_own_entitlement';

const permissions = {
  branch_manager: [
    'view_dashboard', 'manage_staff', 'manage_seats', 'view_billing_status',
    'manage_billing', 'manage_contract', 'manage_assistant_managers', 'view_own_entitlement',
  ],
  assistant_manager: [
    'view_dashboard', 'manage_staff', 'manage_seats', 'view_billing_status',
    'view_own_entitlement',
  ],
  agent: ['view_own_entitlement'],
} satisfies Record<OrganizationRole, OrganizationPermission[]>;

// Supply the active membership loaded by the server for the authenticated user.
export function hasOrganizationPermission(
  membership: { organizationId: string; role: OrganizationRole } | null,
  organizationId: string,
  permission: OrganizationPermission,
): boolean {
  if (!membership || membership.organizationId !== organizationId) return false;
  const allowed: readonly OrganizationPermission[] = permissions[membership.role];
  return allowed.includes(permission);
}

const BILLING_GRACE_MS = 72 * 60 * 60 * 1000;

export function isSeatAccessAllowed(
  hasSeat: boolean,
  subscription: {
    status: 'active' | 'past_due' | 'suspended' | 'ended';
    paidThrough: number;
    paymentFailedAt: number | null;
  },
  now: number,
): boolean {
  if (!hasSeat) return false;
  if (subscription.status === 'active') return now < subscription.paidThrough;
  if (subscription.status !== 'past_due' || subscription.paymentFailedAt === null) return false;
  return now >= subscription.paymentFailedAt && now < subscription.paymentFailedAt + BILLING_GRACE_MS;
}
