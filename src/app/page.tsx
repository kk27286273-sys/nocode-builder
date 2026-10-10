'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ShowroomSlider from '@/components/showroom/ShowroomSlider';

const KAKAO_LINK = 'http://pf.kakao.com/_qxmixiX/chat';
const PHONE_NUMBER = '01029482728';
const PREVIEW_URL =
  'https://thsoft.co.kr/preview?id=00000000-0000-0000-0000-000000000000';

const values = [
  {
    letter: 'N',
    name: 'Next-Gen',
    description: '차세대 표준의',
    detail: '브랜드의 첫인상부터 콘텐츠 구성까지, 다음 세대의 웹 경험을 설계합니다.',
  },
  {
    letter: 'E',
    name: 'Efficient',
    description: '압도적으로 효율적인',
    detail: '복잡한 제작 과정은 줄이고, 꼭 필요한 도구와 흐름에 집중합니다.',
  },
  {
    letter: 'X',
    name: 'X-celerated',
    description: '가속화된 성능의',
    detail: '가벼운 구조와 최적화된 경험으로 더 빠른 웹사이트를 지향합니다.',
  },
  {
    letter: 'I',
    name: 'Intelligent',
    description: '지능적으로 최적화된',
    detail: '콘텐츠와 목적에 맞는 구조로 방문자의 다음 행동을 자연스럽게 안내합니다.',
  },
  {
    letter: 'A',
    name: 'Axia',
    description: '최상의 가치를 만드는',
    detail: '보기 좋은 사이트를 넘어, 비즈니스의 가치를 전달하는 결과물을 만듭니다.',
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
            NEXIA는 더 나은 웹사이트 제작 경험을 위한 다섯 가지 가치를 담고 있습니다.
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
                    ? 'border-cyan-300/70 bg-slate-800 shadow-[0_0_40px_rgba(34,211,238,0.12)] md:col-span-1'
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
          <Link href="/" className="text-xl font-black tracking-[0.18em] text-white">
            NEXIA
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
            비즈니스의 다음 단계를 위한 웹사이트 빌더.
            <br className="hidden sm:block" />
            더 빠르게 만들고, 더 자유롭게 다듬고, 더 나은 경험을 선보이세요.
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
          <div className="mb-12 flex flex-col justify-between gap-5 md:mb-16 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-600">
                Made with Nexia
              </p>
              <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                템플릿을 직접 확인하세요
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                완성된 화면을 둘러보고, Nexia가 만드는 웹 경험을 확인해 보세요.
              </p>
            </div>
            <Link
              href="/preview"
              className="inline-flex w-fit items-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              전체 프리뷰 보기 <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
            <ShowroomSlider />
          </div>

          <div className="mt-8 rounded-3xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-6 md:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-3xl">
                <p className="text-sm font-bold text-sky-700">
                  기기렌탈 · 기업 서비스
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                  B2B 견적 및 사양 안내형
                </h3>
                <p className="mt-2 font-semibold text-slate-700">
                  복잡한 견적 신청을 30초 만에 해결
                </p>

                <p className="mt-5 leading-7 text-slate-600">
                  신속한 사양 비교와 효율성을 강조하는 스카이 블루 테마입니다.
                  제품 라인업과 요금제를 명확히 제시하여 빠른 견적 요청을 유도합니다.
                </p>

                <div className="mt-6">
                  <p className="text-sm font-bold text-slate-900">
                    주요 특화 기능
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm text-slate-700">
                    <li className="rounded-full bg-white px-4 py-2 ring-1 ring-sky-100">
                      제품 스펙 비교표
                    </li>
                    <li className="rounded-full bg-white px-4 py-2 ring-1 ring-sky-100">
                      빠른 견적 요청 CTA
                    </li>
                    <li className="rounded-full bg-white px-4 py-2 ring-1 ring-sky-100">
                      B2B 납품 실적
                    </li>
                  </ul>
                </div>

                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <p className="text-slate-600">
                    <strong className="text-slate-900">추천 대상</strong>
                    <br />
                    사무기기·가전 렌탈, B2B 서비스
                  </p>
                  <p className="text-slate-600">
                    <strong className="text-slate-900">제공 페이지 구성</strong>
                    <br />
                    1. 메인 페이지 · 2. 렌탈 라인업 · 3. 간편 견적요청
                  </p>
                </div>
              </div>

              <a
                href={PREVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-sky-600 px-6 py-4 font-bold text-white transition hover:bg-sky-700"
              >
                실제 템플릿 미리보기
                <span className="ml-2" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
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
            <Link
              href="/preview"
              className="rounded-2xl bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              프리뷰 확인하기
            </Link>
            <a
              href={`tel:${PHONE_NUMBER}`}
              className="rounded-2xl border border-slate-300 px-7 py-4 font-bold text-slate-900 transition hover:bg-slate-100"
            >
              전화 상담하기
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-14 text-slate-400">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 md:flex-row md:items-start md:justify-between">
            <div>
              <Link
                href="/"
                className="text-xl font-black tracking-[0.18em] text-white"
              >
                NEXIA
              </Link>
              <p className="mt-3 text-sm text-slate-500">
                Beyond Speed, Beyond Limits.
              </p>
            </div>
            <div className="flex gap-5 text-sm">
              <a href="/terms" className="transition hover:text-white">
                이용약관
              </a>
              <a href="/privacy" className="transition hover:text-white">
                개인정보처리방침
              </a>
              <a
                href={KAKAO_LINK}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                문의하기
              </a>
            </div>
          </div>

          <div className="space-y-2 pt-8 text-xs leading-6">
            <p className="font-bold text-slate-200">티에이치소프트</p>
            <p>대표자명: 김태헌</p>
            <p>사업자등록번호: 599-18-02634</p>
            <p>
              사업장 주소: 경상북도 구미시 수출대로3길 130, (공단동 우림필유아파트)
              108동 101호
            </p>
            <p>대표번호: 010-2948-2728</p>
            <p>통신판매업신고: 신고 진행 중</p>
            <p className="pt-5 text-slate-600">
              © 2026 TH SOFT. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}