import { getPublicRelease, noReleaseCache } from '@/lib/medinsure/releases';
import { redirectRelease } from '@/lib/medinsure/release-download';

export async function GET() {
  try {
    const setup = await getPublicRelease('setup');
    if (!setup) return Response.json({ error: '공개 설치 파일이 없습니다.' }, { status: 404, headers: noReleaseCache });
    return await redirectRelease(setup.object_path, 'MedinSure-Setup.exe');
  } catch {
    return Response.json({ error: '다운로드 서버를 사용할 수 없습니다.' }, { status: 503, headers: noReleaseCache });
  }
}
