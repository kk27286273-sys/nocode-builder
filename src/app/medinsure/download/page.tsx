import Link from 'next/link';
import { getPublicRelease } from '@/lib/medinsure/releases';

export const dynamic = 'force-dynamic';

export default async function DownloadPage() {
  const release = await getPublicRelease('setup').catch(() => null);
  return <main className="mx-auto min-h-[55vh] max-w-3xl px-6 py-16">
    <Link href="/medinsure" className="text-blue-800">MedinSure 홈</Link>
    <h1 className="mt-6 text-4xl font-black">Windows 프로그램 다운로드</h1>
    <p className="mt-4 text-slate-700">설치 파일은 로그인이나 결제 없이 받을 수 있습니다. 분석 기능을 사용하려면 유효한 이용권이 필요합니다.</p>
    {release ? <section className="mt-6 space-y-3 rounded-lg bg-slate-100 p-4">
      <p className="font-bold">버전 {release.version} · {(release.size_bytes / 1048576).toFixed(1)} MB</p>
      <p className="whitespace-pre-wrap">{release.notes}</p>
      <p className="break-all font-mono text-xs">SHA-256 {release.sha256}</p>
      <a href="/api/medinsure/setup" className="inline-block rounded bg-blue-700 px-4 py-2 font-bold text-white">무료 다운로드</a>
    </section> : <p className="mt-6 rounded-lg bg-slate-100 p-4">현재 공개된 설치 파일이 없습니다.</p>}
  </main>;
}
