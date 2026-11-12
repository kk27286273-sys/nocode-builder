import Link from 'next/link';

export default function NexiaPricing() {
  const commonFeatures = [
    '기본 SEO(검색엔진 최적화)',
    '도메인 제공',
    '서버 관리',
    '보안 관리',
  ];

  const plans = [
    {
      name: 'Basic',
      koreanName: '베이직',
      purpose: '기본 소개',
      pages: '1페이지',
      customers: '소규모 사업자',
      revision: '3영업일 이내',
      report: '없음',
      optimization: '기본 수준',
      setupFee: '70만 원',
      monthlyFee: '59,000원',
      description:
        '사업자와 서비스를 간결하게 소개하는 기본형 홈페이지입니다.',
      highlight: false,
      cta: 'Basic 선택하기',
    },
    {
      name: 'Pro',
      koreanName: '프로',
      purpose: '일반 기업 홈페이지',
      pages: '최대 5페이지',
      customers: '일반 기업·전문업체',
      revision: '72시간 이내',
      report: '없음',
      optimization: '기본 수준',
      setupFee: '100만 원',
      monthlyFee: '79,000원',
      description:
        '기업과 전문업체의 서비스 정보를 체계적으로 구성하는 표준형입니다.',
      highlight: true,
      cta: 'Pro 선택하기',
    },
    {
      name: 'Premium',
      koreanName: '프리미엄',
      purpose: '확장형·우선관리',
      pages: '최대 8페이지',
      customers: '콘텐츠·사업 분야가 많은 기업',
      revision: '단순 수정 24시간 이내',
      report: '제공',
      optimization: '정기 점검',
      setupFee: '120만 원 (부가세 포함)',
      monthlyFee: '99,000원',
      description:
        '다양한 콘텐츠와 사업 분야를 운영하는 기업을 위한 확장형입니다.',
      highlight: false,
      cta: 'Premium 상담하기',
    },
  ];

  const details = [
    { label: '핵심 목적', key: 'purpose' },
    { label: '페이지', key: 'pages' },
    { label: '주요 고객', key: 'customers' },
    { label: '수정 대응', key: 'revision' },
    { label: '월간 리포트', key: 'report' },
    { label: '최적화 관리', key: 'optimization' },
  ] as const;

  return (
    <section aria-label="NEXIA 상세 요금제" className="pt-10 pb-2">
      <div className="mx-auto max-w-7xl">
        <div className="sr-only">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Flexible Plans
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            비즈니스에 맞는 홈페이지 플랜
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            필요한 페이지 수와 관리 범위에 따라 적합한 플랜을 선택하세요.
            모든 플랜에는 기본 SEO, 도메인, 서버 관리와 보안 관리가 포함됩니다.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative rounded-3xl border p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                plan.highlight
                  ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-lg ring-2 ring-blue-100'
                  : 'border-slate-200 bg-white hover:border-slate-900'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white">
                  가장 인기
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    {plan.name}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {plan.koreanName}
                  </h3>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {plan.pages}
                </span>
              </div>

              <p className="mt-4 min-h-12 text-sm leading-6 text-slate-600">
                {plan.description}
              </p>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-500">구축비 (별도 계약)</p>

                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {plan.setupFee}
                </p>

                <p className="mt-4 text-xs font-semibold text-slate-500">
                  월 이용료
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-600">
                  {plan.monthlyFee}
                </p>
              </div>

              <div className="mt-6 space-y-4 text-sm">
                {details.map((detail) => (
                  <div
                    key={detail.key}
                    className="flex items-start justify-between gap-4 border-b border-slate-100 pb-3 last:border-0"
                  >
                    <span className="shrink-0 text-slate-500">
                      {detail.label}
                    </span>

                    <span className="text-right font-semibold text-slate-800">
                      {plan[detail.key]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <p className="mb-3 text-sm font-bold text-slate-900">
                  기본 제공
                </p>

                <ul className="space-y-2">
                  {commonFeatures.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-900 px-4 py-3 text-xs leading-5 text-slate-100">
                {plan.name === 'Premium'
                  ? '단순 텍스트·이미지·연락처 수정은 24시간 이내 대응합니다. 구조 변경과 외부 연동은 별도 협의합니다.'
                  : '텍스트·이미지·연락처 변경은 기본 범위에서 지원합니다. 구조 변경과 외부 연동은 별도 협의합니다.'}
              </div>

              <Link
                href={`/pay?plan=${plan.name.toLowerCase()}`}
                className={`mt-8 block w-full rounded-xl px-6 py-4 text-center font-bold transition ${
                  plan.highlight
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-600">온라인 카드 결제는 월 관리비만 청구합니다. 구축비는 제작 범위와 지급 일정을 별도 계약으로 확인합니다.</p>

          <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
          <p className="text-sm font-bold text-amber-900">추가 서비스</p>

          <div className="mt-4 grid gap-4 text-sm text-amber-900 md:grid-cols-2">
            <p>• 새 버튼 추가: 1개당 1만 원</p>
            <p>• 새 섹션 추가: 1개당 3만 원</p>
            <p>• 새 페이지 추가: 1페이지당 5만 원</p>
            <p>• 외부 서비스 연동: 별도 견적</p>
          </div>
        </div>
      </div>
    </section>
  );
}

