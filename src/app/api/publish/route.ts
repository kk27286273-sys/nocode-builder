import { ownedSite, siteError, SiteAccessError } from '@/lib/site-access';
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { db, uid, id } = await ownedSite(request, body.id);
    if (!body.content || typeof body.content !== 'object') throw new SiteAccessError(400, '본문이 필요합니다.');
    const { data, error } = await db.from('sites').update({ content: body.content, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', uid).select('id').maybeSingle();
    if (error) throw error;
    if (!data) throw new SiteAccessError(404, '사이트 소유권이 변경되었습니다.');
    return Response.json({ success: true });
  } catch(error) { return siteError(error); }
}
