import Link from 'next/link';
import { medinsureOrigin, medinsureDescription } from '@/lib/medinsure/seo';
const questions = [
  ['메딘슈어는 어떤 프로그램인가요?', '메딘슈어(MedinSure)는 보험설계사의 업무를 지원하는 Windows 프로그램입니다. 내부 기능 PROBE로 PDF·Excel 병력 자료를 분석하고 결과 리포트를 확인합니다.'],
  ['누가 사용할 수 있나요?', '보험 업무에서 병력 자료를 확인하고 정리하는 보험설계사를 위한 도구입니다. 결과는 원본 자료와 대조해 확인해야 하며 의료 진단이나 보험금 지급 판단을 대신하지 않습니다.'],
  ['어떻게 설치하고 로그인하나요?', '프로그램 다운로드 안내에서 공개된 Windows 설치 파일을 받아 설치합니다. 분석 기능은 인터넷 연결과 MedinSure 계정 로그인, 서버의 사용 권한 확인이 필요합니다.'],
  ['업데이트는 어떻게 받나요?', '프로그램은 서버에서 공개한 버전 정보를 확인합니다. 업데이트 안내가 표시되면 다운로드와 설치를 진행하세요. 버전에 따라 업데이트가 필요할 수 있으므로 현재 프로그램 안내를 따라 주세요.'],
  ['병력 자료와 분석 결과는 어디에서 처리하나요?', 'PDF·Excel 병력 자료와 분석 결과는 사용자 PC에서 처리하는 구조입니다. 로그인과 사용 권한 확인, 버전 확인은 서버에 연결합니다. 공개 베타에서는 추가 안전성 확인 전까지 실제 고객 의료정보 대신 합성 자료를 사용해 주세요.'],
  ['현재 바로 유료 결제를 해야 하나요?', '현재 공개 베타 안내에 따라 이용해 주세요. 홈페이지의 유료 결제 연동은 준비 중이며, 실제 이용 가능 여부는 로그인 후 서버에서 확인합니다.'],
];
export default function MedinsurePublicInfo() {
  const graph = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', '@id': 'https://thsoft.co.kr/#organization', name: 'THsoft', url: 'https://thsoft.co.kr/' },
    { '@type': 'SoftwareApplication', '@id': medinsureOrigin + '/#software', name: '메딘슈어 | MedinSure', alternateName: 'MedinSure', url: medinsureOrigin + '/', operatingSystem: 'Windows', applicationCategory: 'BusinessApplication', description: medinsureDescription, publisher: { '@id': 'https://thsoft.co.kr/#organization' }, featureList: ['PROBE PDF·Excel 자료 분석', '분석 리포트', '프로그램 업데이트'] },
    { '@type': 'WebSite', '@id': medinsureOrigin + '/#website', name: '메딘슈어 | MedinSure', alternateName: '메딘슈어', url: medinsureOrigin + '/', inLanguage: 'ko-KR' },
  ] };
  return <section aria-labelledby="medinsure-official-info" className="mx-auto max-w-5xl space-y-6 px-6 py-12 text-slate-800">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, '\u003c') }} />
    <h2 id="medinsure-official-info" className="text-3xl font-bold">메딘슈어 | MedinSure 공식 안내</h2>
    <p>{medinsureDescription}</p>
    <p>주요 기능은 PROBE 병력 자료 분석, 결과 리포트 확인 및 프로그램 업데이트입니다. 실제 사용 가능한 범위는 설치된 버전과 계정의 이용 권한에 따라 확인해 주세요.</p>
    <h3 className="text-2xl font-bold">자주 묻는 질문</h3>
    {questions.map(([q,a]) => <details key={q} className="rounded-lg border p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 leading-7">{a}</p></details>)}
    <p className="flex flex-wrap gap-5"><Link className="underline" href="/medinsure/download">설치 파일·다운로드 안내</Link><Link className="underline" href="/medinsure/login">MedinSure 로그인</Link><a className="underline" href="https://thsoft.co.kr/">운영사 THsoft</a></p>
  </section>;
}
