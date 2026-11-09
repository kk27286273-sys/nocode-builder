import { createClient } from '@supabase/supabase-js';

export const medinsureAuthUrl = 'https://wplmbvrylxpdjhyooovx.supabase.co';

let browserClient: ReturnType<typeof createClient> | undefined;

export function getMedinsureAuthClient() {
  const key = process.env.NEXT_PUBLIC_MEDINSURE_SUPABASE_PUBLISHABLE_KEY;
  if (!key?.startsWith('sb_publishable_')) throw new Error('MedinSure Auth is not configured');
  return browserClient ??= createClient(medinsureAuthUrl, key);
}
