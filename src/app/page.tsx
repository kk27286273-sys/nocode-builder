'use client';

import React from 'react';
import Link from 'next/link';
import { defaultB2BTemplate } from '@/data/templates';

export default function PreviewPage() {
  const data = defaultB2BTemplate;
  const supportPhone = data?.supportPhone || '010-0000-0000';
  const themeColor = data?.themeColor || '#0284C7';

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans relative selection:bg-sky-600 selection:text-white">
      {/* 미리보기 전용 상단 안내 바 */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2.5 flex items-center justify-between sticky top-0 z-50">
        <span className="font-medium text-slate-300">
          [데모 미리보기] 실제 고객에게 납품되는 B2B 표준 템플릿 화면입니다.
        </span>
        <Link
          href="/"
          className="text-sky-400 hover:underline font-bold text-xs"
        >
          ← TH소프트 홈으로 이동
        </Link>
      </div>

      {/* GNB 헤더 */}
      <header className="h-16 sm:h-20 border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between bg-white/95 backdrop-blur sticky top-8 z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          {data?.company?.logoUrl && (
            <img
              src={data.company.logoUrl}
              alt="Logo"
              className="h-8 sm:h-10 w-auto object-contain shrink-0"
            />
          )}
          <span className="font-extrabold tracking-tight text-xl sm:text-2xl text-slate-900 truncate">
            {data?.company?.name || '기업명'}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 shrink-0">
          {data?.navigation?.navLinks?.map((nav, idx) => (
            <a
              key={idx}
              href={`#${nav.targetId}`}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {nav.label}
            </a>
          ))}
          <a
            href={`tel:${supportPhone}`}
            style={{ backgroundColor: themeColor }}
            className="text-white text-sm font-bold px-5 py-2.5 rounded-full shadow hover:opacity-95 transition whitespace-nowrap flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
            </svg>
            상담 문의
          </a>
        </nav>
      </header>

      {/* 메인 히어로 섹션 */}
      <section className="py-20 sm:py-32 px-4 sm:px-8 text-center bg-gradient-to-b from-slate-50/80 to-white flex flex-col items-center">
        {data?.hero?.badge && (
          <span
            style={{
              color: themeColor,
              backgroundColor: `${themeColor}15`,
            }}
            className="font-bold px-4 py-1.5 rounded-full mb-6 inline-block text-xs sm:text-sm"
          >
            {data.hero.badge}
          </span>
        )}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6 whitespace-pre-line tracking-tight max-w-4xl">
          {data?.hero?.title}
        </h1>
        <p className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed mb-10">
          {data?.hero?.subtitle}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#contact-form"
            style={{ backgroundColor: themeColor }}
            className="text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:opacity-95 transition text-base flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
            </svg>
            빠른 견적 상담 신청
          </a>
        </div>
      </section>

      {/* 파트너사 섹션 */}
      {data?.partnersSection?.enabled && (
        <section className="py-10 border-y border-slate-100 bg-slate-50/50 px-8 text-center">
          <h2 className="font-semibold text-slate-500 mb-6 text-sm">
            {data.partnersSection.title}
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {data.partnersSection.partners.map((partner, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-white rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {partner}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* 주요 실적 지표 섹션 */}
      {data?.stats && (
        <section id="stats" className="py-20 px-8 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-100">
                <div
                  style={{ color: themeColor }}
                  className="font-black text-3xl sm:text-4xl mb-2"
                >
                  {stat.value}
                </div>
                <div className="font-medium text-slate-600 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 솔루션 / 시공분야 섹션 */}
      {data?.solutions && (
        <section id="solutions" className="py-24 px-8 bg-slate-50/30">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {data.solutionsSection?.title || '핵심 시공 분야'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {data.solutionsSection?.subtitle}
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.solutions.map((sol, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-slate-200/70 shadow-sm hover:shadow-md transition"
              >
                <div
                  style={{ backgroundColor: `${themeColor}20` }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 font-bold text-lg"
                >
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{sol.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{sol.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 고객 후기 섹션 */}
      {data?.reviews && (
        <section id="reviews" className="py-24 px-8 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {data.reviewsSection?.title || '고객 만족 후기'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              {data.reviewsSection?.subtitle}
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between"
              >
                <p className="text-slate-700 leading-relaxed mb-6 italic">"{rev.content}"</p>
                <div>
                  <div className="font-bold text-slate-900">{rev.author}</div>
                  <div className="text-xs text-slate-500">{rev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 견적 상담 신청 폼 */}
      <section id="contact-form" className="py-24 px-8 bg-white border-t border-slate-100">
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200/80 rounded-2xl p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <span
              style={{ color: themeColor }}
              className="text-xs font-bold tracking-wider uppercase mb-2 block"
            >
              Online Inquiry
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
              빠른 견적 및 현장 실측 신청
            </h2>
            <p className="text-sm text-slate-600">
              문의 내용을 남겨주시면 확인 후 담당자가 신속히 연락드립니다.
            </p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); alert('견적 상담이 신청되었습니다.'); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                성함 / 담당자명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="홍길동"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="010-1234-5678"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                시공 및 견적 문의 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="시공 장소, 희망 일정, 면적 등 상세 내용을 입력하세요."
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
            </div>

            <button
              type="submit"
              style={{ backgroundColor: themeColor }}
              className="w-full py-3.5 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-95 transition mt-2 cursor-pointer"
            >
              무료 견적 상담 신청하기
            </button>
          </form>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="py-12 px-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <div className="text-base font-bold text-white mb-2">
              {data?.footer?.companyName || '기업명'}
            </div>
            <p className="leading-relaxed">
              대표자: {data?.footer?.ownerName || '대표자명'} | 사업자등록번호: {data?.footer?.businessNumber || '000-00-00000'}
              <br />
              주소: {data?.footer?.address || '서울특별시'}
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm font-semibold text-white mb-1">상담 및 문의</div>
            <div
              style={{ color: themeColor }}
              className="text-xl font-black mb-2"
            >
              {supportPhone}
            </div>
            <p className="text-slate-500">© {data?.footer?.companyName || '기업명'}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 전화 플로팅 버튼 */}
      <a
        href={`tel:${supportPhone}`}
        style={{ backgroundColor: themeColor }}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 text-white rounded-full shadow-2xl transition duration-300 hover:scale-110 active:scale-95"
        title="전화 바로 연결"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1v3.5a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.24 1.02l-2.23 2.09z" />
        </svg>
      </a>
    </div>
  );
}