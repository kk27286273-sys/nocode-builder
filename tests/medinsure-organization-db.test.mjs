import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const { PGlite } = await import(process.env.MEDINSURE_PGLITE_MODULE || '@electric-sql/pglite');

test('server-only seat transaction enforces delegation, capacity and organization isolation', async () => {
  const db = new PGlite();
  const sql = await readFile(new URL('../supabase/02_medinsure_organization_proposal.sql', import.meta.url), 'utf8');
  const id = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create role service_role bypassrls;
      create schema auth;
      create table auth.users (id uuid primary key, email text);
    `);
    await db.exec(sql);
    await db.exec(`
      insert into auth.users(id) values ('${id(1)}'), ('${id(2)}'), ('${id(3)}'), ('${id(4)}'), ('${id(5)}');
      insert into medinsure.organizations values ('${id(10)}', 'A'), ('${id(20)}', 'B');
      insert into medinsure.memberships values
        ('${id(10)}', '${id(1)}', 'branch_manager', true),
        ('${id(10)}', '${id(2)}', 'assistant_manager', true),
        ('${id(10)}', '${id(3)}', 'agent', true),
        ('${id(10)}', '${id(4)}', 'agent', true),
        ('${id(20)}', '${id(5)}', 'agent', true);
      insert into medinsure.organization_subscriptions values
        ('${id(10)}', 1, 'active', now() + interval '1 month', null),
        ('${id(20)}', 1, 'active', now() + interval '1 month', null);
    `);
    const change = (org, actor, assigns, revokes) => db.query(
      'select medinsure.change_seats($1, $2, $3::uuid[], $4::uuid[]) as assigned',
      [id(org), id(actor), assigns.map(id), revokes.map(id)],
    );
    await db.exec('set role authenticated');
    await assert.rejects(change(10, 2, [3], []), { code: '42501' });
    await db.exec('set role service_role');
    await assert.rejects(change(20, 2, [5], []), /organization_access_denied/);
    await assert.rejects(change(10, 3, [4], []), /organization_access_denied/);
    await assert.rejects(change(10, 2, [5], []), /target_not_active_member/);
    assert.equal((await change(10, 2, [3], [])).rows[0].assigned, 1);
    await assert.rejects(change(10, 2, [3], []), /already_assigned/);
    await assert.rejects(change(10, 2, [4], []), /seat_limit_exceeded/);
    assert.equal((await change(10, 2, [4], [3])).rows[0].assigned, 1);
    await assert.rejects(change(10, 2, [3, 5], [4]), /target_not_active_member/);
    const audit = await db.query('select target_id, is_assigned from medinsure.seat_audit order by id');
    assert.deepEqual(audit.rows, [
      { target_id: id(3), is_assigned: true },
      { target_id: id(3), is_assigned: false },
      { target_id: id(4), is_assigned: true },
    ]);
    await db.exec(`
      reset role;
      update medinsure.memberships set role = 'agent' where user_id = '${id(2)}';
      update medinsure.organization_subscriptions set status = 'suspended' where organization_id = '${id(10)}';
      set role service_role;
    `);
    await assert.rejects(change(10, 2, [], [4]), /organization_access_denied/);
    await assert.rejects(change(10, 1, [3], [4]), /subscription_not_assignable/);
    assert.equal((await change(10, 1, [], [4])).rows[0].assigned, 0);
    await db.query(`insert into public.medinsure_test_orders
      (id,buyer_id,customer_key,plan,seats,amount,organization_name,consent_version)
      values ($1,$2,$3,'solo',1,22000,'Test Solo','test')`, [id(30), id(5), id(31)]);
    const activate = () => db.query('select public.medinsure_activate_test_order($1,$2,$3)', [id(30), id(5), 'test-payment']);
    const entitlement = async () => (await db.query(
      "select public.medinsure_organization($1,null,null,'entitlement','{}') as data", [id(5)],
    )).rows[0].data.allowed;
    await assert.rejects(activate(), /invalid_test_order/);
    assert.equal(await entitlement(), false);
    await db.query("update public.medinsure_test_orders set status = 'confirming' where id = $1", [id(30)]);
    await activate();
    assert.equal(await entitlement(), true);
    await assert.rejects(activate(), /invalid_test_order/);
  } finally {
    await db.close();
  }
});
