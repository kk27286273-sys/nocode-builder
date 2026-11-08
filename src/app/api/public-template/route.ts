import { createAdminClient } from '@/lib/supabase/admin';
import { isPlatformHost, requestHost } from '@/lib/site-policy';
export async function GET(request: Request) {
  if (!isPlatformHost(requestHost(request))) return new Response(null, { status: 404 });
  const template = new URL(request.url).searchParams.get('templateId');
  if (!template || !['corporate','interior','onepage','fitness','legal'].includes(template)) return new Response(null, { status: 404 });
  try {
    const { data, error } = await createAdminClient().from('site_publications').select('data,template_type').eq('template_type',template).eq('is_public',true).order('site_id').limit(1).maybeSingle();
    if (error) throw error;
    return data ? Response.json(data, { headers: { 'Cache-Control': 'no-store' } }) : new Response(null, { status: 404 });
  } catch { return new Response(null, { status: 503 }); }
}
