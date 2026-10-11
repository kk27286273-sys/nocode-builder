// src/components/templates/LegalTaxLayout.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CONSULTATION_LINK = 'http://pf.kakao.com/_qxmixiX/chat';
const PHONE_NUMBER = '01029482728';

const CASE_STUDIES = [
  {
    id: 1,
    year: 2024,
    month: 10,
    title: '대규모 상속세 감면 성공',
    category: '세무',
    description: '재산가 상속 건에서 절세 전략 수립으로 3억 원 이상 절감',
    result: '절세액 3.2억 원',
    color: 'from-blue-600 to-blue-700',
  },
  {
    id: 2,
    year: 2024,
    month: 8,
    title: '근로자 부당해고 판정 취소',
    category: '노무',
    description: '부당해고 사건에서 1심 승소, 원직복직 및 손해배상 확보',
    result: '원직복직 + 배상금 확보',
    color: 'from-emerald-600 to-emerald-700',
  },
];

const CREDENTIALS = [
  {
    title: '법무법인 대표변호사',
    description: '15년 이상 기업법·상사법 전담',
    icon: '⚖️',
  },
  {
    title: '공인회계사·세무사 겸임',
    description: '재무·세무 자문 통합 서비스',
    icon: '📊',
  },
];

export default function LegalTaxLayout() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-black text-slate-900">
            Law & Tax
          </Link>
          <a
            href={CONSULTATION_LINK}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            상담 신청
          </a>
        </nav>
      </header>

      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-32 text-white md:py-48">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(37,99,235,0.15),transparent_50%)]"
        />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            승소와 절세,
            <br />
            신뢰를 증명하는
            <br />
            압도적 속도
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            15년 이상의 경험과 성공 사례로 뒷받침되는 법률·세무·노무 자문.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={CONSULTATION_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              상담 신청하기 →
            </a>
          </div>
        </div>
      </section>

      {/* 자격 섹션 */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            전문성으로 신뢰를 쌓습니다
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {CREDENTIALS.map((cred, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-8"
              >
                <div className="text-4xl">{cred.icon}</div>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {cred.title}
                </h3>
                <p className="mt-2 text-slate-600">{cred.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section className="bg-slate-50 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            최근 성공 사례
          </h2>
          <div className="mt-10 space-y-6">
            {CASE_STUDIES.map((caseItem) => (
              <div
                key={caseItem.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {caseItem.category}
                    </span>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">
                      {caseItem.title}
                    </h3>
                  </div>
                  <span className="text-sm font-bold text-slate-400">
                    {caseItem.year}
                  </span>
                </div>
                <p className="mt-3 text-slate-600">{caseItem.description}</p>
                <div className={`mt-4 inline-block rounded-lg bg-gradient-to-r ${caseItem.color} px-4 py-2 text-sm font-bold text-white`}>
                  ✓ {caseItem.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 상담 폼 */}
      <section className="px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl rounded-3xl border-2 border-blue-300 bg-blue-50 p-8 md:p-12">
          <h2 className="text-3xl font-bold text-slate-900">
            비밀 보장 1:1 상담
          </h2>
          <p className="mt-3 text-slate-600">
            변호사 비밀유지 특권으로 완벽하게 보호됩니다.
          </p>
          <form className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="이름"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500"
            />
            <input
              type="tel"
              placeholder="연락처"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500"
            />
            <textarea
              placeholder="상담 내용"
              rows={4}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
            >
              상담 신청하기
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-slate-900 px-6 py-12 text-slate-400">
        <div className="mx-auto max-w-7xl">
          <h3 className="text-lg font-bold text-white">Law & Tax</h3>
          <p className="mt-2 text-sm">신뢰를 기반으로 한 법률·세무·노무 자문</p>
          <p className="mt-4 text-xs">© 2026 Law & Tax. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}