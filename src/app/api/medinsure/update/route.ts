import { getPublicRelease } from '@/lib/medinsure/releases';

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const release = await getPublicRelease();
    if (!release) return Response.json({ error: 'no_public_release' }, { status: 404, headers });
    return Response.json({
      latest_version: release.version,
      minimum_version: release.minimum_version ?? '0.0.0',
      download_url: 'https://medinsure.co.kr/api/medinsure/download',
    }, { headers });
  } catch { return Response.json({ error: 'policy_unavailable' }, { status: 503, headers }); }
}
