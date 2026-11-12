import { ownedSite, siteError, SiteAccessError } from '@/lib/site-access';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db, uid, id } = await ownedSite(request, body.siteId);
    if (!body.templateData || typeof body.templateData !== 'object') throw new SiteAccessError(400, '본문이 필요합니다.');
    const { data, error } = await db.from('sites').update({ data: body.templateData, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', uid).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new SiteAccessError(404, '사이트 소유권이 변경되었습니다.');
    return Response.json({ success: true, siteId: id });
  } catch(error) { return siteError(error); }
}
