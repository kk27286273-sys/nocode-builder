'use client';

import React from 'react';
import { B2BTemplateData } from '@/data/templates';

interface LivePreviewProps {
  data: B2BTemplateData;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export default function LivePreview({ data, zoom, setZoom }: LivePreviewProps) {
  const themeColor = data?.themeColor || '#2563EB';

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-900/10">
      {/* 줌 컨트롤 바 */}
      <div className="h-12 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
        <span className="text-xs font-semibold text-slate-500 tracking-wider">
          1200px Desktop Workspace Canvas (Live Preview)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.max(50, z - 10))}
            className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded text-slate-700 transition"
          >
            -
          </button>
          <span className="text-xs font-semibold text-slate-700 w-12 text-center">{zoom}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(120, z + 10))}
            className="w-7 h-7 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded text-slate-700 transition"
          >
            +
          </button>
          <button
            onClick={() => setZoom(100)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-xs font-medium rounded text-slate-700 transition ml-1"
          >
            100%
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8 flex justify-center items-start">
        <div
          style={{
            width: '1200px',
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
          }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 overflow-hidden shrink-0 transition-transform duration-75 text-slate-900"
        >
          {/* 프리뷰 GNB */}
          <div className="h-20 border-b border-slate-100 flex items-center justify-between px-10 bg-white/95 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              {data.company?.logoUrl && (
                <img src={data.company.logoUrl} alt="Logo" className="h-8 max-w-[120px] object-contain" />
              )}
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                {data?.company?.name || '기업명'}
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm font-semibold text-slate-600">
              {(data?.navigation?.navLinks || []).map((link, idx) => (
                <span key={idx} className="hover:text-slate-900 transition-colors cursor-default">
                  {link.label}
                </span>
              ))}
              <span
                style={{ backgroundColor: themeColor }}
                className="px-5 py-2.5 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/20 cursor-default"
              >
                상담 신청
              </span>
            </div>
          </div>

          {/* [1번 개선: 히어로 5대 모던 애니메이션 & 2번 개선: 입체 쉐도우 버튼] */}
          <div className="relative py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-center px-8 border-b border-slate-100 overflow-hidden">
            {/* 애니메이션 1: 배경 앰비언트 글로우 오브 */}
            <div
              style={{ backgroundColor: themeColor }}
              className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[130px] opacity-15 pointer-events-none animate-pulse"
            />

            {/* 격자 무늬 배경 */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              {/* 애니메이션 2: 펄싱 배지 캡슐 */}
              <span
                style={{ color: themeColor, borderColor: `${themeColor}33`, backgroundColor: `${themeColor}10` }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border shadow-sm transition-transform hover:scale-105 duration-300"
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeColor }} />
                {data?.hero?.badge || 'Enterprise Professional Service'}
              </span>

              {/* 애니메이션 3: 선명하고 중후한 타이틀 */}
              <h2 className="text-5xl font-black text-slate-900 mb-6 whitespace-pre-line tracking-tight leading-[1.2]">
                {data?.hero?.title}
              </h2>

              <p className="text-lg text-slate-600 mb-10 whitespace-pre-line max-w-2xl mx-auto leading-relaxed font-normal">
                {data?.hero?.subtitle}
              </p>

              {/* [2번 개선] 입체 쉐도우 & 호버 인터랙티브 CTA 버튼 세트 */}
              <div className="flex justify-center gap-5 mb-12">
                <span
                  style={{
                    backgroundColor: themeColor,
                    boxShadow: `0 10px 25px -5px ${themeColor}55, 0 8px 10px -6px ${themeColor}33`,
                  }}
                  className="px-8 py-4 text-white font-extrabold rounded-xl text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 cursor-pointer inline-flex items-center gap-2"
                >
                  무료 컨설팅 신청하기
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="px-8 py-4 bg-white/90 backdrop-blur border border-slate-300 text-slate-800 font-extrabold rounded-xl text-sm shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-400 hover:shadow-md active:translate-y-0 cursor-pointer">
                  솔루션 살펴보기
                </span>
              </div>

              {/* 애니메이션 4: 부유하는 그래픽 배너 */}
              {data.hero?.mediaUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 transition-all duration-500 hover:shadow-3xl hover:-translate-y-1">
                  <img src={data.hero.mediaUrl} alt="Hero Banner" className="w-full h-84 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* 파트너사 */}
          {data?.partnersSection?.enabled && (data?.partnersSection?.partners || []).length > 0 && (
            <div className="py-10 bg-white border-b border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-6">
                {data?.partnersSection?.title}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 text-slate-500 font-bold text-sm tracking-tight">
                {(data?.partnersSection?.partners || []).map((partner, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-colors">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 실적 지표 */}
          {data?.stats && data.stats.length > 0 && (
            <div className="py-16 bg-slate-50/50 border-b border-slate-100 px-10">
              <div className="flex flex-wrap justify-center items-center gap-8 text-center max-w-5xl mx-auto">
                {data.stats.map((st, i) => (
                  <div key={i} className="flex-1 min-w-[200px] p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <div style={{ color: themeColor }} className="text-4xl font-black mb-1 tracking-tight">
                      {st?.value}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">{st?.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 솔루션 */}
          {data?.solutions && data.solutions.length > 0 && (
            <div className="py-24 px-10 bg-white border-b border-slate-100">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  {data?.solutionsSection?.title || '신뢰할 수 있는 전용 솔루션 라인업'}
                </h3>
                <p className="text-sm text-slate-500 font-normal">
                  {data?.solutionsSection?.subtitle || '기업 비즈니스 성장에 특화된 모듈'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {data.solutions.map((item, idx) => (
                  <div key={idx} className="w-84 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                    {item?.image ? (
                      <div className="h-48 bg-slate-100 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-lg text-slate-900 mb-2">{item?.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{item?.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 후기 */}
          {data?.reviews && data.reviews.length > 0 && (
            <div className="py-24 px-10 bg-slate-50/60 border-b border-slate-100">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  {data?.reviewsSection?.title || '함께한 고객사 평가'}
                </h3>
                <p className="text-sm text-slate-500 font-normal">
                  {data?.reviewsSection?.subtitle || '실제 서비스를 도입한 기업들의 반응입니다.'}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {data.reviews.map((rev, idx) => (
                  <div key={idx} className="w-84 bg-white p-7 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <p className="text-sm text-slate-700 italic mb-6 leading-relaxed">
                      "{rev?.content}"
                    </p>
                    <div className="pt-4 border-t border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{rev?.author}</p>
                      <p className="text-xs text-slate-400 font-medium">{rev?.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ */}
          {data?.faqs && data.faqs.length > 0 && (
            <div className="py-24 px-10 bg-white border-b border-slate-100">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">자주 묻는 질문</h3>
                  <p className="text-sm text-slate-500">도입 전 가장 문의가 많은 내용입니다.</p>
                </div>
                <div className="space-y-4">
                  {data.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/70">
                      <h4 className="font-bold text-sm text-slate-900 mb-2">{faq?.question}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{faq?.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 푸터 */}
          <div className="bg-slate-950 text-slate-400 py-16 px-10 text-xs">
            <span className="text-white font-bold text-base block mb-4 tracking-tight">{data?.footer?.companyName}</span>
            <div className="border-t border-slate-800/80 pt-6 space-y-2 text-slate-400 leading-relaxed font-normal">
              <p>대표자: {data?.footer?.ownerName} | 사업자등록번호: {data?.footer?.businessNumber}</p>
              <p>주소: {data?.footer?.address}</p>
              <p>이메일: {data?.footer?.contactEmail} | 고객지원: {data?.supportPhone}</p>
              <p className="pt-4 text-slate-500">
                © {new Date().getFullYear()} {data?.footer?.companyName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}