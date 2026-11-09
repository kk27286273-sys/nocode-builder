import { createClient } from '@supabase/supabase-js';
import { medinsureAuthUrl } from './medinsure';

const auth = { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false };

export function verifyMedinsureUser(token: string) {
  const key = process.env.NEXT_PUBLIC_MEDINSURE_SUPABASE_PUBLISHABLE_KEY;
  if (!key?.startsWith('sb_publishable_')) throw new Error('MedinSure Auth is not configured');
  return createClient(medinsureAuthUrl, key, { auth }).auth.getUser(token);
}
