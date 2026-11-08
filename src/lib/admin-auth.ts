import { timingSafeEqual } from 'node:crypto';
import { isPlatformHost, requestHost } from './site-policy';

export function isAdmin(request: Request): boolean {
  if (!isPlatformHost(requestHost(request))) return false;
  const expected = process.env.ADMIN_ACCESS_TOKEN;
  const cookie = (request.headers.get('cookie') || '').split(';').map(s => s.trim()).find(s => s.startsWith('nexia_admin_session='));
  const actual = cookie?.slice('nexia_admin_session='.length);
  if (!actual || !expected) return false;
  const a = Buffer.from(actual), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Existing account model is a global THsoft operator, never a customer login. */
export function requireAdmin(request: Request): Response | null {
  if (!isAdmin(request)) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 });
  if (!['GET', 'HEAD'].includes(request.method)) {
    try {
      const origin = new URL(request.headers.get('origin') || '');
      if (origin.host.toLowerCase() !== request.headers.get('host')?.toLowerCase() || !['https:', 'http:'].includes(origin.protocol)) throw new Error();
    } catch {
      return Response.json({ error: '허용되지 않은 요청 출처입니다.' }, { status: 403 });
    }
  }
  return null;
}
