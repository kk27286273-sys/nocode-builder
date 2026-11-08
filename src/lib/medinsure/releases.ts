import { createAdminClient } from '@/lib/supabase/admin';

export const releaseBucket = 'medinsure-installers';

export async function getPublicRelease() {
  if (process.env.MEDINSURE_RELEASES_ENABLED !== 'true') return null;
  const db = createAdminClient();
  const { data: channel, error } = await db.from('medinsure_release_channel').select('release_id').maybeSingle();
  if (error) throw error;
  if (!channel?.release_id) return null;
  const { data, error: releaseError } = await db.from('medinsure_releases')
    .select('version, notes, object_path, size_bytes, sha256').eq('id', channel.release_id).single();
  if (releaseError) throw releaseError;
  return data;
}
