// Loopback-only browser rehearsal with synthetic accounts and a real PGlite DB.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.MEDINSURE_PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const id = (n) => `00000000-0000-0000-0000-${String(n).padStart(12, '0')}`;
const organizationId = id(10);
const users = ['manager', 'assistant', 'agent', 'invitee'].map((name, index) => ({
  id: id(index + 1), email: `${name}@example.test`, email_confirmed_at: new Date().toISOString(),
  aud: 'authenticated', role: 'authenticated', app_metadata: {}, user_metadata: {},
}));
await db.exec(`
  create role anon; create role authenticated; create role service_role bypassrls;
  create schema auth; create table auth.users (id uuid primary key, email text);
`);
await db.exec(await readFile(new URL('../supabase/02_medinsure_organization_proposal.sql', import.meta.url), 'utf8'));
for (const user of users) await db.query('insert into auth.users values ($1,$2)', [user.id, user.email]);
await db.query("insert into medinsure.organizations values ($1,'메딘슈어 테스트 지점')", [organizationId]);
for (const [index, role] of ['branch_manager', 'assistant_manager', 'agent'].entries()) {
  await db.query('insert into medinsure.memberships values ($1,$2,$3,true)', [organizationId, users[index].id, role]);
}
await db.query("insert into medinsure.organization_subscriptions values ($1, 2, 'active', now() + interval '30 days', null)", [organizationId]);
await db.exec('set role service_role');

const sampleSite = {
  id: 'medinsure', name: 'MedinSure', template_type: 'corporate',
  data: { templateType: 'corporate', company: { name: 'MedinSure' },
    hero: { badge: '메딘슈어', title: 'MedinSure', subtitle: '설계사의 필수 분석 도구' } },
};

createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info, x-supabase-api-version, prefer',
    'Access-Control-Allow-Methods': 'POST, GET, PATCH, OPTIONS',
    'Content-Type': 'application/json',
  };
  function send(status, body) { res.writeHead(status, headers); res.end(JSON.stringify(body)); }
  if (req.method === 'OPTIONS') { res.writeHead(204, headers); res.end(); return; }
  const url = new URL(req.url, 'http://127.0.0.1');
  try {
    if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const { email, password } = JSON.parse(raw);
      const user = users.find((u) => u.email === email && password === 'medinsure-local');
      if (!user) return send(400, { message: '테스트 계정을 확인해 주세요.' });
      return send(200, { access_token: `fixture-${user.id}`, refresh_token: 'fixture-refresh',
        expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600, token_type: 'bearer', user });
    }
    if (url.pathname === '/auth/v1/user') {
      const user = users.find((u) => req.headers.authorization === `Bearer fixture-${u.id}`);
      return user ? send(200, user) : send(401, { message: 'Invalid token' });
    }
    if (url.pathname === '/auth/v1/logout') return send(200, {});
    if (url.pathname === '/rest/v1/sites') {
      const siteId = url.searchParams.get('id');
      if (req.method === 'GET') return send(200, siteId ? sampleSite : [sampleSite]);
      if (req.method === 'PATCH' && siteId === 'eq.medinsure') {
        let raw = ''; for await (const chunk of req) raw += chunk;
        sampleSite.data = JSON.parse(raw).data;
        res.writeHead(204, headers); res.end(); return;
      }
    }
    if (url.pathname === '/rest/v1/rpc/medinsure_organization' && req.headers.authorization === 'Bearer test-service') {
      let raw = ''; for await (const chunk of req) raw += chunk;
      const { actor, verified_email, org, action, payload } = JSON.parse(raw);
      const { rows } = await db.query('select public.medinsure_organization($1,$2,$3,$4,$5) as data',
        [actor, verified_email, org, action, JSON.stringify(payload)]);
      return send(200, rows[0].data);
    }
    return send(404, { message: 'Fixture endpoint unavailable' });
  } catch (error) {
    return send(400, { code: error.code, message: error.message });
  }
}).listen(54329, '127.0.0.1', () => process.stdout.write('MedinSure test DB ready on 127.0.0.1:54329\n'));
