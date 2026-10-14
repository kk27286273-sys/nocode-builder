// src/app/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import IndustryGrid from '@/components/home/IndustryGrid';

const KAKAO_LINK = 'http://pf.kakao.com/_qxmixiX/chat';
const PHONE_NUMBER = '01029482728';

const values = [
  {
    letter: 'N',
    name: 'Next-Gen',
    description: '차세대 표준의',
    detail:
      '브랜드의 첫인상부터 콘텐츠 구성까지, 다음 세대의 웹 경험을 설계합니다.',
  },
  {
    letter: 'E',
    name: 'Efficient',
    description: '압도적으로 효율적인',
    detail:
      '복잡한 제작 과정은 줄이고, 꼭 필요한 도구와 흐름에 집중합니다.',
  },
  {
    letter: 'X',
    name: 'X-celerated',
    description: '가속화된 성능의',
    detail:
      '가벼운 구조와 최적화된 경험으로 더 빠른 웹사이트를 지향합니다.',
  },
  {
    letter: 'I',
    name: 'Intelligent',
    description: '지능적으로 최적화된',
    detail:
      '콘텐츠와 목적에 맞는 구조로 방문자의 다음 행동을 자연스럽게 안내합니다.',
  },
  {
    letter: 'A',
    name: 'Axia',
    description: '최상의 가치를 만드는',
    detail:
      '보기 좋은 사이트를 넘어, 비즈니스의 가치를 전달하는 결과물을 만듭니다.',
  },
];

function NexiaValues() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-slate-950 px-6 py-24 text-white md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl md:mb-16">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-cyan-300">
            The Nexia Standard
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            이름에 담은 다섯 가지 기준
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            NEXIA는 더 나은 웹사이트 제작 경험을 위한 다섯 가지 가치를 담고
            있습니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
          {values.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <button
                key={item.letter}
                type="button"
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                aria-expanded={isActive}
                className={`group relative min-h-56 overflow-hidden rounded-3xl border p-5 text-left transition-all duration-500 md:min-h-72 md:p-6 ${
                  isActive
                    ? 'border-cyan-300/70 bg-slate-800 shadow-[0_0_40px_rgba(34,211,238,0.12)]'
                    : 'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]'
                } ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}
              >
                {item.letter === 'X' && isActive && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 animate-[nexia-trail_900ms_ease-out_infinite] bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent blur-md"
                  />
                )}

                <span
                  className={`relative block text-6xl font-black tracking-tighter transition-all duration-500 md:text-7xl ${
                    isActive ? 'text-cyan-300' : 'text-white/80'
                  }`}
                >
                  {item.letter}
                </span>

                <div className="relative mt-6">
                  <p className="text-sm font-bold text-white md:text-base">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 md:text-sm">
                    {item.description}
                  </p>

                  <div
                    className={`grid transition-all duration-500 ${
                      isActive
                        ? 'mt-4 grid-rows-[1fr] opacity-100'
                        : 'mt-0 grid-rows-[0fr] opacity-0 md:mt-4 md:grid-rows-[1fr] md:opacity-100'
                    }`}
                  >
                    <p className="overflow-hidden text-xs leading-6 text-slate-300 md:text-sm">
                      {item.detail}
                    </p>
                  </div>
                </div>

                {item.letter === 'X' && (
                  <span className="absolute right-5 top-5 rounded-full border border-cyan-300/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                    Acceleration
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-xs text-slate-500 md:hidden">
          카드를 눌러 Nexia의 각 가치를 확인해 보세요.
        </p>
      </div>
    </section>
  );
}

function PricingSection() {
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
      setupFee: '120만 원~ 별도 협의',
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
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
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
                <p className="text-xs font-semibold text-slate-500">구축비</p>

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

export default function LandingPage() {
  const scrollToTemplates = () => {
    document.getElementById('templates-section')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-slate-900 selection:bg-cyan-100">
      <style jsx global>{`
        @keyframes nexia-trail {
          0% {
            transform: translateX(-120%) skewX(-18deg);
            opacity: 0;
          }

          25% {
            opacity: 1;
          }

          100% {
            transform: translateX(240%) skewX(-18deg);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-black tracking-[0.18em] text-white"
          >
            THsoft
          </Link>

          <a
            href={KAKAO_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            문의하기
          </a>
        </nav>
      </header>

      <section className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-slate-950 px-6 py-32 text-white md:min-h-[780px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_30%,rgba(8,145,178,0.25),transparent_45%),radial-gradient(ellipse_at_20%_80%,rgba(37,99,235,0.18),transparent_40%)]"
        />

        <div
          aria-hidden="true"
          className="absolute -right-32 top-24 -z-10 h-96 w-96 rounded-full border border-cyan-300/10 md:right-10 md:top-20"
        />

        <div
          aria-hidden="true"
          className="absolute -right-20 top-36 -z-10 h-72 w-72 rounded-full border border-cyan-300/10 md:right-24 md:top-36"
        />

        <div className="mx-auto w-full max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.35em] text-cyan-300 md:text-sm">
            The next generation website builder
          </p>

          <h1 className="text-6xl font-black tracking-[-0.07em] md:text-8xl lg:text-9xl">
            NEXIA
          </h1>

          <p className="mt-5 text-2xl font-semibold tracking-tight text-white md:text-4xl">
            Beyond Speed, Beyond Limits.
          </p>

          <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
            THsoft가 운영하는 사업자용 웹사이트 제작·관리 서비스.
            <br className="hidden sm:block" />
            NEXIA와 함께 더 빠르게 만들고, 더 나은 경험을 선보이세요.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToTemplates}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-7 py-4 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              템플릿 둘러보기 <span className="ml-2">→</span>
            </button>

            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/[0.06] px-7 py-4 font-bold text-white transition hover:bg-white/10"
            >
              도입 문의하기
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium text-slate-400 md:text-sm">
            <span>직관적인 사이트 편집</span>
            <span className="text-cyan-400">/</span>
            <span>반응형 템플릿</span>
            <span className="text-cyan-400">/</span>
            <span>성능을 고려한 설계</span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-12 right-[12%] hidden select-none text-[20rem] font-black leading-none text-white/[0.025] lg:block"
        >
          N
        </div>
      </section>

      <NexiaValues />

      <section
        id="templates-section"
        className="scroll-mt-8 px-6 py-24 md:py-32"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl md:mb-16">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Made with Nexia
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              업종에 맞는 템플릿을
              <br className="hidden sm:block" />
              직접 확인하세요
            </h2>

            <p className="mt-5 leading-7 text-slate-600">
              각 카드 오른쪽에서 실제 화면을 바로 확인할 수 있습니다.
              마음에 드는 구성을 고른 뒤 상담을 신청해 주세요.
            </p>
          </div>

          <IndustryGrid />
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-24 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
              Performance, measured
            </p>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              속도는 주장보다
              <br />
              측정으로 확인하세요.
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              사이트 속도는 이미지, 콘텐츠, 기능과 측정 환경에 따라 달라집니다.
              실제 페이지를 기준으로 진단하고 개선 지점을 확인해 보세요.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="mb-5">
              <span className="text-sm font-bold text-slate-900">
                무료 사이트 속도 진단
              </span>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                현재 페이지에서 제공하는 무료 진단 기능을 준비 중입니다.
                지금은 상담을 통해 진단을 신청해 주세요.
              </p>
            </div>

            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              무료 진단 상담 신청하기
            </a>
          </div>
        </div>
      </section>

      <PricingSection />

      <section className="px-6 py-24 text-center md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
            Start with Nexia
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            다음 세대의 웹사이트를
            <br className="hidden sm:block" />
            지금 시작하세요.
          </h2>

          <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-600">
            템플릿을 확인하거나, 프로젝트에 맞는 제작 상담을 신청해 보세요.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              전화 상담하기
            </a>

            <a
              href={KAKAO_LINK}
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-slate-300 px-7 py-4 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              카카오톡 문의하기
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}