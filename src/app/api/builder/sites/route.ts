import { ownedSite, siteUser, siteError, SiteAccessError, SITE_FIELDS } from '@/lib/site-access';

export async function GET(request: Request) {
  try {
    const { db, uid } = await siteUser(request);
    const id = new URL(request.url).searchParams.get('id');
    let query = db.from('sites').select(SITE_FIELDS).eq('user_id', uid);
    if (id) query = query.eq('id', id);
    const { data, error } = await query.order('name');
    if (error) throw error;
    if (id && !data?.length) throw new SiteAccessError(404, '편집 가능한 사이트를 찾을 수 없습니다.');
    return Response.json({ data: id ? data[0] : data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return siteError(error); }
}
export async function POST(request: Request) {
  try {
    const { db, uid } = await siteUser(request);
    const body = await request.json();
    if (typeof body.id !== 'string' || !body.id.trim() || body.id.length > 200 || typeof body.name !== 'string') throw new SiteAccessError(400, '사이트 ID와 이름이 필요합니다.');
    const { data, error } = await db.from('sites').insert({ id: body.id, name: body.name, template_type: body.template_type, user_id: uid, updated_at: new Date().toISOString() }).select(SITE_FIELDS).single();
    if (error?.code === '23505') throw new SiteAccessError(409, '이미 사용 중인 사이트 ID입니다.');
    if (error) throw error;
    return Response.json({ data }, { status: 201 });
  } catch (error) { return siteError(error); }
}
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { db, uid, id } = await ownedSite(request, body.id);
    if (!body.data || typeof body.data !== 'object' || Array.isArray(body.data)) throw new SiteAccessError(400, '사이트 본문이 필요합니다.');
    const { data, error } = await db.from('sites').update({ data: body.data, template_type: body.template_type, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', uid).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new SiteAccessError(404, '사이트 소유권이 변경되었습니다.');
    return Response.json({ data });
  } catch (error) { return siteError(error); }
}
export async function DELETE(request: Request) {
  try {
    const { db, uid, id } = await ownedSite(request, new URL(request.url).searchParams.get('id'));
    const { data, error } = await db.from('sites').delete().eq('id', id).eq('user_id', uid).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new SiteAccessError(404, '사이트 소유권이 변경되었습니다.');
    return Response.json({ data });
  } catch (error) { return siteError(error); }
}
