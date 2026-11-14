import type { Metadata } from 'next';
export const medinsureOrigin = 'https://medinsure.co.kr';
export const medinsureDescription = '메딘슈어(MedinSure)는 보험설계사를 위한 Windows 업무 지원 프로그램입니다. PROBE로 PDF·Excel 병력 자료를 분석하고 결과 리포트를 확인할 수 있습니다.';
export function medinsureMetadata(title: string, description: string, path = '/', index = true): Metadata {
  const url = medinsureOrigin + path;
  return {
    metadataBase: new URL(medinsureOrigin), title: { absolute: title }, description,
    applicationName: '메딘슈어 | MedinSure', alternates: { canonical: url },
    robots: { index, follow: true },
    openGraph: { type: 'website', locale: 'ko_KR', siteName: '메딘슈어 | MedinSure', title, description, url,
      images: [{ url: medinsureOrigin + '/medinsure/opengraph-image', width: 1200, height: 630, alt: 'MedinSure · PROBE' }] },
    twitter: { card: 'summary_large_image', title, description, images: [medinsureOrigin + '/medinsure/opengraph-image'] },
  };
}
export function verificationMetadata(): Metadata['verification'] {
  // Accept only verification values, never HTML, URLs, credentials or scripts.
  const token = (v: string | undefined) => v && /^[A-Za-z0-9_-]{8,200}$/.test(v) ? v : undefined;
  const google = token(process.env.MEDINSURE_GOOGLE_SITE_VERIFICATION);
  const naver = token(process.env.MEDINSURE_NAVER_SITE_VERIFICATION);
  return { ...(google ? { google } : {}), ...(naver ? { other: { 'naver-site-verification': naver } } : {}) };
}
