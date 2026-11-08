import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { validSiteData, validSiteId } from '@/lib/site-policy';

export async function GET(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const id = new URL(request.url).searchParams.get('siteId');
  if (id && !validSiteId(id)) return Response.json({ error: '잘못된 사이트 ID' }, { status: 400 });
  let query = createAdminClient().from('sites').select('id,name,data,template_type').order('name');
  if (id) query = query.eq('id', id);
  const { data, error } = await query;
  if (error) return Response.json({ error: '사이트 조회 실패' }, { status: 503 });
  return Response.json({ data }, { headers: { 'Cache-Control': 'private, no-store' } });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    const id = body.siteId ?? body.id;
    const action = body.action || 'publish';
    if (!validSiteId(id) || !['create','save','publish','unpublish','delete'].includes(action)) return Response.json({ error: '잘못된 요청' }, { status: 400 });
    if (['save','publish'].includes(action) && !validSiteData(body.data)) return Response.json({ error: '사이트 데이터가 필요합니다.' }, { status: 400 });
    const template = body.templateType || body.data?.templateType || 'corporate';
    if (!['corporate','interior','onepage','fitness','legal'].includes(template)) return Response.json({ error: '잘못된 템플릿' }, { status: 400 });
    const { data, error } = await createAdminClient().rpc('manage_builder_site', {
      p_site_id: id, p_action: action, p_data: body.data || {}, p_template: template,
    });
    if (error) return Response.json({ error: '사이트 저장 실패. DB 준비 상태와 사이트 ID를 확인하세요.' }, { status: 409 });
    return Response.json({ success: true, siteId: id, data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: '잘못된 요청입니다.' }, { status: 400 }); }
}
