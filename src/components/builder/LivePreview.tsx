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
      {/* 줌 배율 컨트롤 바 */}
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
                className="px-5 py-2.5 text-white rounded-xl text-sm font-bold shadow-md shadow-blue-500/10 cursor-default"
              >
                상담 신청
              </span>
            </div>
          </div>

          {/* 프리뷰 Hero (모던 격자 배경 & 글로우 효과) */}
          <div className="relative py-28 bg-gradient-to-b from-slate-50 via-white to-slate-50 text-center px-8 border-b border-slate-100 overflow-hidden">
            {/* 배경 은은한 격자 패턴 */}
            <div
              className="absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10 max-w-4xl mx-auto">
              <span
                style={{ color: themeColor, borderColor: `${themeColor}33`, backgroundColor: `${themeColor}10` }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border"
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                {data?.hero?.badge || 'Enterprise Professional Service'}
              </span>
              <h2 className="text-5xl font-black text-slate-900 mb-6 whitespace-pre-line tracking-tight leading-[1.2]">
                {data?.hero?.title}
              </h2>
              <p className="text-lg text-slate-600 mb-10 whitespace-pre-line max-w-2xl mx-auto leading-relaxed font-normal">
                {data?.hero?.subtitle}
              </p>
              <div className="flex justify-center gap-4 mb-12">
                <span
                  style={{ backgroundColor: themeColor }}
                  className="px-8 py-4 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20"
                >
                  무료 컨설팅 신청
                </span>
                <span className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm shadow-sm">
                  솔루션 살펴보기
                </span>
              </div>
              {data.hero?.mediaUrl && (
                <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100">
                  <img src={data.hero.mediaUrl} alt="Hero Banner" className="w-full h-80 object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* 프리뷰 파트너사 */}
          {data?.partnersSection?.enabled && (data?.partnersSection?.partners || []).length > 0 && (
            <div className="py-10 bg-white border-b border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-6">
                {data?.partnersSection?.title}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-10 text-slate-400 font-bold text-sm tracking-tight">
                {(data?.partnersSection?.partners || []).map((partner, i) => (
                  <span key={i} className="px-3 py-1 rounded bg-slate-50 border border-slate-100 text-slate-500">
                    {partner}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 프리뷰 1. Stats */}
          {data?.stats && data.stats.length > 0 && (
            <div className="py-16 bg-slate-50/50 border-b border-slate-100 px-10">
              <div className="flex flex-wrap justify-center items-center gap-8 text-center max-w-5xl mx-auto">
                {data.stats.map((st, i) => (
                  <div key={i} className="flex-1 min-w-[200px] p-6 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <div style={{ color: themeColor }} className="text-4xl font-black mb-1 tracking-tight">
                      {st?.value}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold">{st?.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 프리뷰 2. 솔루션 */}
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
                  <div key={idx} className="w-84 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
                    {item?.image ? (
                      <div className="h-48 bg-slate-100 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
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

          {/* 프리뷰 3. 고객 후기 */}
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
                  <div key={idx} className="w-84 bg-white p-7 rounded-2xl border border-slate-200/80 flex flex-col justify-between shadow-sm">
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

          {/* 프리뷰 4. FAQ */}
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

          {/* 프리뷰 푸터 */}
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