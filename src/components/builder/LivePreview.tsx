'use client';

import React from 'react';
import { B2BTemplateData } from '@/data/templates';

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom, setZoom }: LivePreviewProps) {
  const fs = data?.fontSizes || {};
  const supportPhone = data?.supportPhone || '010-0000-0000';
  const themeColor = data?.themeColor || '#0284C7';

  return (
    <main className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* 상단 줌 컨트롤 바 */}
      <div className="h-12 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">
          미리보기 캔버스 ({zoom}%)
        </span>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
            className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer"
          >
            -
          </button>
          <span className="text-xs font-medium text-slate-600 w-10 sm:w-12 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 10, 150))}
            className="p-1 px-2.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 cursor-pointer"
          >
            +
          </button>
          <button
            onClick={() => setZoom(100)}
            className="ml-1 sm:ml-2 text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 실시간 프리뷰 영역 */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-4 md:p-8 flex justify-center items-start relative">
        <div
          style={{
            width: '1200px',
            maxWidth: '100%',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            marginBottom: `${(1200 * (zoom / 100) - 1200) / 2}px`,
          }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden shrink-0 transition-transform duration-75 text-slate-900 mx-auto relative"
        >
          {/* GNB 네비게이션 헤더 */}
          <header className="h-16 sm:h-20 border-b border-slate-100 px-4 sm:px-8 flex items-center justify-center md:justify-between bg-white/95 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center justify-center md:justify-start gap-2.5 min-w-0">
              {data?.company?.logoUrl && (
                <img
                  src={data.company.logoUrl}
                  alt="Logo"
                  className="h-8 sm:h-10 w-auto object-contain shrink-0"
                />
              )}
              <span
                style={{ fontSize: `${fs.companyName || 20}px` }}
                className="font-extrabold tracking-tight text-slate-900 truncate"
              >
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

          {/* 2열 분할 꽉 찬 프리미엄 히어로 섹션 */}
          <section className="relative py-14 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 -z-10" />

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* 좌측 7컬럼 */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {data?.hero?.badge && (
                  <div
                    style={{
                      color: themeColor,
                      backgroundColor: `${themeColor}20`,
                      borderColor: `${themeColor}40`,
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold"
                  >
                    <span style={{ backgroundColor: themeColor }} className="w-2 h-2 rounded-full animate-pulse" />
                    {data.hero.badge}
                  </div>
                )}

                <h1
                  style={{ fontSize: `${fs.heroTitle || 34}px` }}
                  className="font-black tracking-tight leading-[1.25] text-white whitespace-pre-line"
                >
                  {data?.hero?.title}
                </h1>

                <p
                  style={{ fontSize: `${fs.heroSubtitle || 16}px` }}
                  className="text-slate-300 font-normal leading-relaxed max-w-xl"
                >
                  {data?.hero?.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-300 font-semibold">
                  <div className="flex items-center gap-2">
                    <span style={{ color: themeColor }} className="font-bold">✓</span>
                    <span>100% 본사 직영 정밀 시공 체계</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: themeColor }} className="font-bold">✓</span>
                    <span>공기 준수율 99.8% 달성</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: themeColor }} className="font-bold">✓</span>
                    <span>현장 정밀 실측 및 다이렉트 견적</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span style={{ color: themeColor }} className="font-bold">✓</span>
                    <span>사후 무상 A/S 책임 보증제</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-3">
                  <a
                    href="#contact-form"
                    style={{ backgroundColor: themeColor }}
                    className="px-6 py-3.5 text-white font-bold rounded-xl shadow-lg hover:opacity-95 transition text-sm cursor-pointer"
                  >
                    도면 검토 & 빠른 견적 신청
                  </a>
                </div>
              </div>

              {/* 우측 5컬럼 */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-800 aspect-[4/3] lg:aspect-[4/4]">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80"
                    alt="정밀 시공 현장"
                    className="w-full h-full object-cover brightness-90 hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-700 px-3 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-white">최신 정밀 설비 가동 중</span>
                  </div>

                  <div className="absolute bottom-3 right-3 left-3 bg-slate-900/95 backdrop-blur-md border border-slate-700/90 p-3 rounded-xl shadow-xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">누적 시공 실적</div>
                      <div className="text-base font-black text-white mt-0.5">2,850건+</div>
                    </div>
                    <div className="h-6 w-px bg-slate-700" />
                    <div>
                      <div className="text-[10px] text-slate-400 font-semibold">납기 준수율</div>
                      <div style={{ color: themeColor }} className="text-base font-black mt-0.5">99.8%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 파트너사 / 인증 보증 섹션 */}
          {data?.partnersSection?.enabled && (
            <section className="py-10 border-y border-slate-100 bg-slate-50/50 px-8 text-center">
              <h2
                style={{ fontSize: `${fs.partnersTitle || 16}px` }}
                className="font-semibold text-slate-500 mb-6"
              >
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
            <section id="stats" className="py-16 px-8 bg-white border-b border-slate-100">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                {data.stats.map((stat, idx) => (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div
                      style={{
                        fontSize: `${fs.statsValue || 32}px`,
                        color: themeColor,
                      }}
                      className="font-black mb-2"
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{ fontSize: `${fs.statsLabel || 14}px` }}
                      className="font-medium text-slate-600"
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 솔루션 / 전문 시공 분야 섹션 */}
          {data?.solutions && (
            <section id="solutions" className="py-20 px-8 bg-slate-50/30">
              <div className="max-w-5xl mx-auto text-center mb-16">
                <h2
                  style={{ fontSize: `${fs.sectionTitle || 28}px` }}
                  className="font-bold text-slate-900 mb-4"
                >
                  {data.solutionsSection?.title || '핵심 시공 분야'}
                </h2>
                <p
                  style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
                  className="text-slate-600"
                >
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
            <section id="reviews" className="py-20 px-8 bg-white border-t border-slate-100">
              <div className="max-w-5xl mx-auto text-center mb-16">
                <h2
                  style={{ fontSize: `${fs.sectionTitle || 28}px` }}
                  className="font-bold text-slate-900 mb-4"
                >
                  {data.reviewsSection?.title || '고객 만족 후기'}
                </h2>
                <p
                  style={{ fontSize: `${fs.sectionSubtitle || 16}px` }}
                  className="text-slate-600"
                >
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

          {/* 자주 묻는 질문(FAQ) 섹션 */}
          {data?.faqs && (
            <section className="py-20 px-8 bg-slate-50/50 border-t border-slate-100">
              <div className="max-w-3xl mx-auto">
                <h2
                  style={{ fontSize: `${fs.sectionTitle || 28}px` }}
                  className="font-bold text-slate-900 text-center mb-12"
                >
                  자주 묻는 질문 (FAQ)
                </h2>
                <div className="space-y-4">
                  {data.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                    >
                      <h3
                        style={{ fontSize: `${fs.faqQuestion || 18}px` }}
                        className="font-bold text-slate-900 mb-2 flex items-center gap-2"
                      >
                        <span style={{ color: themeColor }}>Q.</span>
                        {faq.question}
                      </h3>
                      <p
                        style={{ fontSize: `${fs.faqAnswer || 15}px` }}
                        className="text-slate-600 leading-relaxed pl-6"
                      >
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 견적 상담 신청 폼 섹션 */}
          <section id="contact-form" className="py-20 px-8 bg-white border-t border-slate-100">
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

              <form onSubmit={(e) => { e.preventDefault(); alert('견적 문의가 접수되었습니다.'); }} className="space-y-4">
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
                    placeholder="시공 장소(지역), 평수, 희망 일정 등 상세 내용을 적어주세요."
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                  />
                </div>

                <div className="pt-2 pb-1">
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-500 leading-relaxed mb-2.5 max-h-24 overflow-y-auto">
                    <strong>[개인정보 수집 및 이용 안내]</strong><br />
                    1. 수집 항목: 성함, 연락처, 문의 내용<br />
                    2. 수집 목적: 견적 상담 응대 및 현장 방문 일정 안내<br />
                    3. 보유 기간: 문의 처리 완료 후 1년간 보관 후 파기
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      required
                      className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                    <span>
                      <span className="text-red-500">[필수]</span> 개인정보 수집 및 이용에 동의합니다.
                    </span>
                  </label>
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

          {/* 푸터 영역 */}
          {data?.footer && (
            <footer id="contact" className="py-12 px-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                  <div className="text-base font-bold text-white mb-2">
                    {data.footer.companyName}
                  </div>
                  <p className="leading-relaxed">
                    대표자: {data.footer.ownerName} | 사업자등록번호: {data.footer.businessNumber}
                    <br />
                    주소: {data.footer.address}
                    <br />
                    이메일: {data.footer.contactEmail}
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
                  <p className="text-slate-500">© {data.footer.companyName}. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </div>

        {/* 우측 하단 전화 플로팅 버튼 */}
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
    </main>
  );
}