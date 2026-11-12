import 'server-only';
import { createAdminClient } from '@/lib/supabase/admin';

export const SITE_FIELDS = 'id,name,data,content,template_type,updated_at';
export class SiteAccessError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export async function siteUser(request: Request) {
  const match = /^Bearer ([^\s]+)$/.exec(request.headers.get('authorization') || '');
  if (!match) throw new SiteAccessError(401, '개인 계정으로 로그인해 주세요.');
  const db = createAdminClient();
  const { data, error } = await db.auth.getUser(match[1]);
  if (error || !data.user || data.user.is_anonymous || !data.user.email_confirmed_at) throw new SiteAccessError(401, '이메일 인증을 완료한 계정으로 로그인해 주세요.');
  return { db, uid: data.user.id };
}
export async function ownedSite(request: Request, id: unknown) {
  const context = await siteUser(request);
  if (typeof id !== 'string' || !id.trim() || id.length > 200) throw new SiteAccessError(400, '사이트 ID를 확인해 주세요.');
  const { data, error } = await context.db.from('sites').select('id').eq('id', id).eq('user_id', context.uid).maybeSingle();
  if (error) throw new SiteAccessError(503, '소유권 확인을 완료하지 못했습니다.');
  if (!data) throw new SiteAccessError(404, '편집 가능한 사이트를 찾을 수 없습니다.');
  return { ...context, id };
}
export function siteError(error: unknown) {
  return Response.json({ error: error instanceof SiteAccessError ? error.message : '사이트 처리 중 오류가 발생했습니다.' },
    { status: error instanceof SiteAccessError ? error.status : 500, headers: { 'Cache-Control': 'no-store' } });
}
