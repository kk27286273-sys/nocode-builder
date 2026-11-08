import { createAdminClient } from '@/lib/supabase/admin';

export const releaseBucket = 'medinsure-installers';
export const validVersion = (value: unknown): value is string =>
  typeof value === 'string' && /^(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})$/.test(value);

export function compareVersions(a: string, b: string) {
  const target = b.split('.').map(Number);
  return a.split('.').map((part, index) => Number(part) - target[index]).find((difference) => difference !== 0) ?? 0;
}

export async function getPublicRelease() {
  if (process.env.VERCEL_ENV === 'preview') return null;
  const db = createAdminClient();
  const { data: channel, error } = await db.from('medinsure_release_policies').select('release_id,minimum_version')
    .order('id', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  if (!channel?.release_id) return null;
  const { data, error: releaseError } = await db.from('medinsure_releases')
    .select('version, notes, object_path, size_bytes, sha256').eq('id', channel.release_id).single();
  if (releaseError) throw releaseError;
  return { ...data, minimum_version: channel.minimum_version as string | null };
}
