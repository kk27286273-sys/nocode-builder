import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store' };
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token) return Response.json({ error: 'authentication_required' }, { status: 401, headers });

  try {
    const db = createAdminClient();
    const { data: { user }, error: authError } = await db.auth.getUser(token);
    if (authError && (!authError.status || authError.status >= 500)) throw authError;
    if (authError || !user) return Response.json({ error: 'invalid_session' }, { status: 401, headers });
    if (user.is_anonymous || !user.email_confirmed_at) return Response.json({ allowed: false }, { headers });

    const { data: suspension, error } = await db.from('medinsure_access_suspensions')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();
    if (error) throw error;
    return Response.json({ allowed: suspension === null }, { headers });
  } catch {
    return Response.json({ error: 'verification_unavailable' }, { status: 503, headers });
  }
}
