import { getPublicRelease, noReleaseCache, releaseIdPattern } from '@/lib/medinsure/releases';
import { redirectRelease } from '@/lib/medinsure/release-download';

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get('release');
    const release = id !== null && !releaseIdPattern.test(id)
      ? null : await getPublicRelease(id === null ? 'legacy-download' : 'update', id ?? undefined);
    if (!release) return Response.json({ error: '공개 파일이 없습니다.' }, { status: 404, headers: noReleaseCache });
    const extension = release.object_path.endsWith('.zip') ? 'zip' : 'exe';
    return await redirectRelease(release.object_path, `MedinSure-${release.version}.${extension}`);
  } catch {
    return Response.json({ error: '다운로드 서버를 사용할 수 없습니다.' }, { status: 503, headers: noReleaseCache });
  }
}
