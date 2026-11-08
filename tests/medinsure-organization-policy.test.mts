import assert from 'node:assert/strict';
import test from 'node:test';
import { hasOrganizationPermission, isSeatAccessAllowed } from '../src/lib/medinsure/organization-policy.ts';

test('branch and assistant managers can manage seats only in their organization', () => {
  for (const role of ['branch_manager', 'assistant_manager'] as const) {
    const member = { organizationId: 'branch-a', role };
    assert.equal(hasOrganizationPermission(member, 'branch-a', 'manage_seats'), true);
    assert.equal(hasOrganizationPermission(member, 'branch-b', 'manage_seats'), false);
  }
});

test('assistant managers can see billing status but cannot charge or alter contracts or roles', () => {
  const member = { organizationId: 'branch-a', role: 'assistant_manager' } as const;
  assert.equal(hasOrganizationPermission(member, 'branch-a', 'view_billing_status'), true);
  for (const permission of ['manage_billing', 'manage_contract', 'manage_assistant_managers'] as const) {
    assert.equal(hasOrganizationPermission(member, 'branch-a', permission), false);
  }
  assert.equal(hasOrganizationPermission({ ...member, role: 'branch_manager' }, 'branch-a', 'manage_billing'), true);
});

test('agents have no organization administration permissions', () => {
  const member = { organizationId: 'branch-a', role: 'agent' } as const;
  assert.equal(hasOrganizationPermission(member, 'branch-a', 'view_own_entitlement'), true);
  assert.equal(hasOrganizationPermission(member, 'branch-a', 'view_dashboard'), false);
  assert.equal(hasOrganizationPermission(null, 'branch-a', 'view_dashboard'), false);
});

test('payment grace expires at exactly 72 hours and never restores a revoked seat', () => {
  const paymentFailedAt = Date.UTC(2026, 10, 8);
  const subscription = { status: 'past_due', paidThrough: paymentFailedAt, paymentFailedAt } as const;
  const deadline = paymentFailedAt + 72 * 60 * 60 * 1000;
  assert.equal(isSeatAccessAllowed(true, subscription, deadline - 1), true);
  assert.equal(isSeatAccessAllowed(true, subscription, deadline), false);
  assert.equal(isSeatAccessAllowed(false, subscription, deadline - 1), false);
  assert.equal(isSeatAccessAllowed(true, { ...subscription, status: 'suspended' }, deadline - 1), false);
});

test('active entitlement ends at the end of the paid period and resumes after verified payment', () => {
  const paidThrough = Date.UTC(2026, 11, 8);
  const subscription = { status: 'active', paidThrough, paymentFailedAt: null } as const;
  assert.equal(isSeatAccessAllowed(true, subscription, paidThrough - 1), true);
  assert.equal(isSeatAccessAllowed(true, subscription, paidThrough), false);
  assert.equal(isSeatAccessAllowed(true, { ...subscription, paidThrough: paidThrough + 1000 }, paidThrough), true);
});
