import 'server-only';
import { siteUser, SiteAccessError } from '@/lib/site-access';

// Compatible with the existing Admin 1.0 UID/role/enabled schema.
// Never authorize from email, client metadata, or the shared builder password.
export async function requireThsoftOwner(request: Request) {
  const { db, uid } = await siteUser(request);
  const { data, error } = await db.from('thsoft_admin_roles')
    .select('role,enabled').eq('user_id', uid).maybeSingle();
  if (error) throw new SiteAccessError(503, 'Owner 권한 저장소가 준비되지 않았습니다.');
  if (!data?.enabled || data.role !== 'owner') throw new SiteAccessError(403, 'Owner 권한이 필요합니다.');
  return { db, uid };
}
