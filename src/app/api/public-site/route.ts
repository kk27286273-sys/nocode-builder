import { getPublication } from '@/lib/public-sites';
import { createAdminClient } from '@/lib/supabase/admin';
import { isAdmin } from '@/lib/admin-auth';
import { isPlatformHost, requestHost, validSiteId } from '@/lib/site-policy';

export async function GET(request: Request) {
  if (!isPlatformHost(requestHost(request))) return new Response(null, { status: 404 });
  const id = new URL(request.url).searchParams.get('siteId');
  if (!validSiteId(id)) return new Response(null, { status: 404 });
  try {
    let data;
    if (isAdmin(request)) {
      const result = await createAdminClient().from('sites').select('data').eq('id', id).maybeSingle();
      if (result.error) throw result.error;
      data = result.data?.data;
    } else { data = (await getPublication(id))?.data; }
    if (!data) return new Response(null, { status: 404 });
    return Response.json(data, { headers: { 'Cache-Control': 'private, no-store' } });
  } catch { return Response.json({ error: '사이트 조회를 사용할 수 없습니다.' }, { status: 503 }); }
}
