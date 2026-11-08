import { createAdminClient } from './supabase/admin';
import { normalizeDomain, validSiteId } from './site-policy';

export async function findDomain(host: string) {
  const domain = normalizeDomain(host);
  if (!domain) return null;
  const { data, error } = await createAdminClient().from('site_domains')
    .select('site_id,domain').eq('domain', domain).eq('status', 'active').maybeSingle();
  if (error) throw new Error('Domain lookup unavailable');
  return data as { site_id: string; domain: string } | null;
}

export async function getPublication(siteId: string) {
  if (!validSiteId(siteId)) return null;
  const { data, error } = await createAdminClient().from('site_publications')
    .select('site_id,data,template_type,revision').eq('site_id', siteId).eq('is_public', true).maybeSingle();
  if (error) throw new Error('Publication lookup unavailable');
  return data;
}
