import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return Response.json({ error: 'authentication_required' }, { status: 401, headers });
  try {
    const db = createAdminClient();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError && (!authError.status || authError.status >= 500)) throw authError;
    if (authError || !user) return Response.json({ error: 'invalid_session' }, { status: 401, headers });
    const { data, error } = await db.rpc('medinsure_organization', {
      actor: user.id, verified_email: null, org: null, action: 'entitlement', payload: {},
    });
    if (error) throw error;
    return Response.json(data, { headers });
  } catch {
    return Response.json({ error: 'verification_unavailable' }, { status: 503, headers });
  }
}
