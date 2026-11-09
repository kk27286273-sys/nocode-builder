import { getPublicRelease, noReleaseCache, releaseOrigin } from '@/lib/medinsure/releases';

export async function GET() {
  const headers = noReleaseCache;
  try {
    const release = await getPublicRelease();
    if (!release) return Response.json({ error: 'no_public_release' }, { status: 404, headers });
    return Response.json({
      latest_version: release.version,
      minimum_version: release.minimum_version ?? '0.0.0',
      download_url: `${releaseOrigin}/api/medinsure/download?release=${release.release_id}`,
      sha256: release.sha256,
    }, { headers });
  } catch { return Response.json({ error: 'policy_unavailable' }, { status: 503, headers }); }
}
