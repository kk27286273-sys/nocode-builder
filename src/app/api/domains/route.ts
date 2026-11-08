import { randomBytes } from 'node:crypto';
import { resolveTxt } from 'node:dns/promises';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizeDomain, isPlatformHost, validSiteId } from '@/lib/site-policy';

export async function GET(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const id = new URL(request.url).searchParams.get('siteId');
  if (!validSiteId(id)) return Response.json({ error: '사이트 ID가 필요합니다.' }, { status: 400 });
  const { data, error } = await createAdminClient().from('site_domains').select('*').eq('site_id', id).order('domain');
  return error ? Response.json({ error: '도메인 조회 실패' }, { status: 503 }) : Response.json({ data }, { headers: { 'Cache-Control': 'private, no-store' } });
}
export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const { siteId, domain: input, action = 'register' } = await request.json();
    const domain = normalizeDomain(input);
    if (!validSiteId(siteId) || !domain || isPlatformHost(domain) || !['register','verify','activate','disable','delete'].includes(action)) return Response.json({ error: '사이트 ID 또는 도메인이 올바르지 않습니다.' }, { status: 400 });
    const db = createAdminClient();
    const site = await db.from('sites').select('id').eq('id', siteId).maybeSingle();
    if (site.error) throw site.error;
    if (!site.data) return Response.json({ error: '사이트를 찾을 수 없습니다.' }, { status: 404 });
    if (action === 'register') {
      const token = randomBytes(24).toString('hex');
      const { error } = await db.from('site_domains').insert({ site_id: siteId, domain, verification_token: token, status: 'pending' });
      if (error) return Response.json({ error: '이미 등록되었거나 등록할 수 없는 도메인입니다.' }, { status: 409 });
      return Response.json({ success: true, status: 'pending', txtName: `_thsoft-verification.${domain}`, txtValue: `thsoft-site=${token}` });
    }
    const { data: existing, error } = await db.from('site_domains').select('*').eq('domain', domain).eq('site_id', siteId).maybeSingle();
    if (error) throw error;
    if (!existing) return Response.json({ error: '도메인 매핑을 찾을 수 없습니다.' }, { status: 404 });
    if (action === 'verify') {
      let records: string[][];
      try { records = await resolveTxt(`_thsoft-verification.${domain}`); }
      catch { return Response.json({ error: 'DNS TXT 레코드를 확인할 수 없습니다.' }, { status: 409 }); }
      if (!records.some(parts => parts.join('') === `thsoft-site=${existing.verification_token}`)) return Response.json({ error: '도메인 소유권 확인 실패' }, { status: 409 });
    }
    if (action === 'activate' && !existing.verified_at) return Response.json({ error: '먼저 DNS 소유권 확인이 필요합니다.' }, { status: 409 });
    const result = action === 'delete'
      ? await db.from('site_domains').delete().eq('domain', domain).eq('site_id', siteId)
      : await db.from('site_domains').update(action === 'verify'
        ? { status: existing.status === 'active' ? 'active' : 'verified', verified_at: new Date().toISOString() }
        : { status: action === 'activate' ? 'active' : 'disabled' }).eq('domain', domain).eq('site_id', siteId);
    if (result.error) throw result.error;
    return Response.json({ success: true });
  } catch { return Response.json({ error: '도메인 처리 실패' }, { status: 400 }); }
}
