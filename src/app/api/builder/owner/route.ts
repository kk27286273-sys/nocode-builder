import { requireThsoftOwner } from '@/lib/thsoft-owner';
import { siteError } from '@/lib/site-access';

export async function GET(request: Request) {
  try {
    const { uid } = await requireThsoftOwner(request);
    return Response.json({ uid, role: 'owner' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return siteError(error); }
}
