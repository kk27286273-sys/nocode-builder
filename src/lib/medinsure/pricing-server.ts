import { createAdminClient } from '@/lib/supabase/admin';
import { initialPolicy, validPolicy } from './plans';

export async function activePricing() {
  if (process.env.NEXT_PUBLIC_PRICING_REVIEW === 'true') {
    return { version: 0, effective_at: null, policy: initialPolicy };
  }
  const { data, error } = await createAdminClient().from('medinsure_pricing_versions')
    .select('version,effective_at,policy').lte('effective_at', new Date().toISOString())
    .order('effective_at', { ascending: false }).order('version', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return { version: 0, effective_at: null, policy: initialPolicy };
  if (!validPolicy(data.policy)) throw new Error('Invalid pricing policy');
  return { version: data.version as number, effective_at: data.effective_at as string, policy: data.policy };
}
