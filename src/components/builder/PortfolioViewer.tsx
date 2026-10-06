'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function PortfolioViewer({ data }: { data: B2BTemplateData }) {
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-sans">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const specifics = (data.specifics as any) || {};
  const gallery = specifics?.gallery || [];
  const themeColor = data?.themeColor || '#0f172a';

  // 에디터 폰트 크기 슬라이더 값 매핑
  const fontSizes = {
    heroTitle: data.fontSizes?.heroTitle || 38,
    subTitle: data.fontSizes?.subTitle || 18,
    sectionTitle: data.fontSizes?.sectionTitle || 24,
    bodyText: data.fontSizes?.bodyText || 15,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-24">
      {/* 상단 네비게이션 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight" style={{ color: themeColor }}>
            {data?.company?.name || 'PORTFOLIO'}
          </span>
          {data?.company?.phone && (
            <a
              href={`tel:${data.company.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              📞 협업 문의: {data.company.phone}
            </a>
          )}
        </div>
      </header>

      {/* 헤더 섹션 */}
      <section className="py-20 px-6 border-b border-slate-100 bg-slate-50/40">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1
            className="font-extrabold tracking-tight text-slate-900 leading-tight"
            style={{ fontSize: `${fontSizes.heroTitle}px` }}
          >
            {data?.company?.name || 'Creative Portfolio'}
          </h1>
          {data?.company?.subTitle && (
            <p
              className="font-medium text-slate-600 max-w-2xl mx-auto"
              style={{ fontSize: `${fontSizes.subTitle}px` }}
            >
              {data.company.subTitle}
            </p>
          )}
          <p
            className="text-slate-500 max-w-2xl mx-auto leading-relaxed"
            style={{ fontSize: `${fontSizes.bodyText}px` }}
          >
            {data?.company?.description || '수행한 프로젝트와 주요 결과물을 확인하실 수 있습니다.'}
          </p>
        </div>
      </section>

      {/* 갤러리 그리드 섹션 */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-200">
          <h2
            className="font-extrabold text-slate-900 flex items-center gap-3 tracking-tight"
            style={{ fontSize: `${fontSizes.sectionTitle}px` }}
          >
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
            Selected Works
          </h2>
          <span className="text-xs font-semibold text-slate-400">Total {gallery.length}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gallery.length > 0 ? (
            gallery.map((item: any, idx: number) => (
              <div
                key={idx}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="aspect-[4/3] overflow-hidden bg-slate-100 relative">
                  <img
                    src={item?.thumbnail || 'https://via.placeholder.com/600x450?text=Portfolio'}
                    alt={item?.title || '작품 썸네일'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 bg-white/90 backdrop-blur rounded-full text-slate-700 shadow-sm">
                      {item?.category || 'Project'}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between flex-1 gap-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className="font-bold text-slate-800 line-clamp-1"
                      style={{ fontSize: `${Math.max(16, fontSizes.bodyText + 1)}px` }}
                    >
                      {item?.title || '작품명 미정'}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">{item?.date || ''}</span>
                  </div>
                  {item?.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">등록된 프로젝트가 없습니다. 에디터에서 포트폴리오를 추가해 보세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}