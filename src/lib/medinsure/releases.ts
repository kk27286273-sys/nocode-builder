import { createAdminClient } from '@/lib/supabase/admin';

export const releaseBucket = 'medinsure-installers';
export const releaseOrigin = 'https://medinsure.co.kr';
export const noReleaseCache = {
  'Cache-Control': 'private, no-store',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};
export const releaseIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
export type ArtifactKind = 'setup' | 'update';
export const validVersion = (value: unknown): value is string =>
  typeof value === 'string' && /^(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})\.(0|[1-9]\d{0,4})$/.test(value);

export function compareVersions(a: string, b: string) {
  const target = b.split('.').map(Number);
  return a.split('.').map((part, index) => Number(part) - target[index]).find((difference) => difference !== 0) ?? 0;
}

export function approvedArtifact(version: string, kind: ArtifactKind, sha256: string) {
  // Trusted release-engineering input, independently produced from verified build artifacts.
  const catalog = JSON.parse(process.env.MEDINSURE_APPROVED_ARTIFACTS || '{}');
  const expected = catalog?.[version]?.[kind];
  return typeof expected === 'string' && /^[a-f0-9]{64}$/i.test(expected) && expected.toLowerCase() === sha256;
}

export async function getPublicRelease(kind: ArtifactKind | 'legacy-download' = 'update', updateId?: string) {
  if (process.env.VERCEL_ENV === 'preview') return null;
  const db = createAdminClient();
  let policyQuery = db.from('medinsure_release_policies').select('id,release_id,setup_release_id,minimum_version');
  if (updateId !== undefined) policyQuery = policyQuery.eq('release_id', updateId);
  const { data: channel, error } = await policyQuery.order('id', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  const artifactId = kind === 'setup' ? channel?.setup_release_id : channel?.release_id;
  if (!channel || !artifactId) return null;
  const { data, error: releaseError } = await db.from('medinsure_releases')
    .select('version,notes,object_path,size_bytes,sha256,artifact_kind').eq('id', artifactId).single();
  if (releaseError) throw releaseError;
  if (kind === 'setup' && (data.artifact_kind !== 'setup' || !data.object_path.endsWith('.exe'))) return null;
  if (kind === 'update' && (!['update', 'legacy'].includes(data.artifact_kind) || !data.object_path.endsWith('.zip'))) return null;
  return { ...data, release_id: artifactId as string, minimum_version: channel.minimum_version as string | null };
}
