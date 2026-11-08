import Link from 'next/link';
import { notFound } from 'next/navigation';

const documents = {
  terms: { title: '이용약관', paragraphs: [
    'MedinSure는 Windows 분석 프로그램의 계정, 구독, 이용권 관리 서비스를 제공합니다.',
    '개인은 본인 계정으로 계약합니다. 단체는 조직 대표가 계약과 결제를 관리하고, 지점장 또는 보조 관리자가 이용권을 배정합니다.',
    '구독은 월 단위로 갱신됩니다. 최소 의무 기간과 중도해지 위약금은 없으며, 다음 갱신을 중단하면 결제한 기간이 끝날 때까지 이용할 수 있습니다.',
    '정기결제 실패 시 72시간 유예하고, 미납이 계속되면 이용권을 정지합니다. 확인된 재결제 이후 이용권을 복구합니다.',
  ] },
  privacy: { title: '개인정보처리방침', paragraphs: [
    '계정 식별자와 이메일은 인증에, 조직 소속과 이용권 배정 상태는 조직 운영과 EXE 권한 확인에 사용합니다. 주문·결제 정보는 구독과 거래기록 관리에 사용합니다.',
    '고객 병력, PDF·Excel 원본, 분석 결과와 리포트는 설계사 PC에서만 처리하도록 설계합니다. 이 자료는 조직 관리 화면이나 감사 로그에서 다루지 않습니다.',
    '항목별 보유기간, 처리 위탁·국외이전 및 개인정보 보호 문의처는 실제 공급업체와 데이터 흐름을 확인한 뒤 게시합니다.',
  ] },
  refund: { title: '청약철회·환불정책', paragraphs: [
    '관계 법령에 따른 청약철회 및 환불 권리를 보장합니다.',
    '최초 결제 후 7일 이내 실질적 미사용을 확인하면 추가 혜택으로 전액 환불합니다. 일반적인 월 갱신 때마다 이 혜택이 새로 생기지는 않습니다.',
    '다음 갱신 중단 신청은 이미 결제한 이용 기간을 유지합니다. 법정·약정 환불, 중복 결제, 오청구와 장애에 대한 처리는 별도입니다.',
    '단체의 실질적 미사용 확인 방법, 부분 환불 산식, 신청 연락처는 운영 확정 후 게시합니다.',
  ] },
};

export default async function LegalPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  if (!Object.hasOwn(documents, document)) notFound();
  const content = documents[document as keyof typeof documents];
  return <main className="mx-auto min-h-[55vh] max-w-3xl px-6 py-16">
    <Link href="/medinsure" className="text-blue-800">MedinSure 홈</Link>
    <h1 className="mt-6 text-4xl font-black">{content.title}</h1>
    <p className="mt-4 rounded bg-amber-50 p-3 text-sm">운영 검토용 초안 · 시행일 미정</p>
    <div className="mt-6 space-y-4 text-slate-700">{content.paragraphs.map((text) => <p key={text}>{text}</p>)}</div>
  </main>;
}
