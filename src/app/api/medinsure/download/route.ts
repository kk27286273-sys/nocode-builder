import { createAdminClient } from '@/lib/supabase/admin';
import { getPublicRelease, releaseBucket } from '@/lib/medinsure/releases';
import { createReleaseDownload } from '@/lib/medinsure/r2';

export async function GET() {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    const release = await getPublicRelease();
    if (!release) return Response.json({ error: '공개 설치 파일이 없습니다.' }, { status: 404, headers });
    const filename = `MedinSure-${release.version}.${release.object_path.endsWith('.zip') ? 'zip' : 'exe'}`;
    if (release.object_path.startsWith('r2/')) {
      const location = await createReleaseDownload(release.object_path, filename);
      return new Response(null, { status: 302, headers: { ...headers, Location: location } });
    }
    const { data, error } = await createAdminClient().storage.from(releaseBucket)
      .createSignedUrl(release.object_path, 60, { download: filename });
    if (error) throw error;
    return new Response(null, { status: 302, headers: { ...headers, Location: data.signedUrl } });
  } catch {
    return Response.json({ error: '다운로드 서버를 사용할 수 없습니다.' }, { status: 503, headers });
  }
}
