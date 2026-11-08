import { POST as manage } from '../manage/sites/route';
import { requireAdmin } from '@/lib/admin-auth';
export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  try {
    const body = await request.json();
    return manage(new Request(request.url, { method: 'POST', headers: request.headers, body: JSON.stringify({ siteId: body.id, data: body.content, action: 'publish' }) }));
  } catch { return Response.json({ error: '잘못된 요청' }, { status: 400 }); }
}
