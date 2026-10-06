'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function CorporateViewer({ data }: { data: B2BTemplateData }) {
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-sans">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const specifics = (data.specifics as any) || {};
  const businessAreas = specifics?.businessAreas || [];
  const history = specifics?.history || [];
  const greeting = specifics?.about?.greeting || '인사말을 입력해주세요.';
  const themeColor = data?.themeColor || '#0f172a';

  // 에디터 폰트 크기 슬라이더 값 매핑
  const fontSizes = {
    heroTitle: data.fontSizes?.companyName || 36,
    subTitle: data.fontSizes?.companyDesc || 18,
    sectionTitle: data.fontSizes?.sectionTitle || 24,
    bodyText: data.fontSizes?.bodyText || 15,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-24">
      {/* 상단 네비게이션 / 헤더 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight" style={{ color: themeColor }}>
            {data?.company?.name || '기업 뷰어'}
          </span>
          {data?.company?.phone && (
            <a
              href={`tel:${data.company.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              📞 대표번호: {data.company.phone}
            </a>
          )}
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-white border-b border-slate-100 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1
            className="font-extrabold tracking-tight text-slate-900 leading-tight"
            style={{ fontSize: `${fontSizes.heroTitle}px` }}
          >
            {data?.company?.name || '회사명을 입력하세요'}
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
            {data?.company?.description || '회사 설명을 입력하세요'}
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">
        {/* 회사 소개 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
            <h2
              className="font-extrabold text-slate-900 tracking-tight"
              style={{ fontSize: `${fontSizes.sectionTitle}px` }}
            >
              회사 소개
            </h2>
          </div>
          <div className="p-8 md:p-12 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <p 
              className="text-slate-700 leading-relaxed whitespace-pre-wrap"
              style={{ fontSize: `${fontSizes.bodyText}px` }}
            >
              {greeting}
            </p>
          </div>
        </section>

        {/* 사업 영역 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
            <h2
              className="font-extrabold text-slate-900 tracking-tight"
              style={{ fontSize: `${fontSizes.sectionTitle}px` }}
            >
              사업 영역
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessAreas.length > 0 ? (
              businessAreas.map((area: any, idx: number) => (
                <div 
                  key={idx} 
                  className="group p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <h3 
                    className="font-bold mb-3 transition-colors group-hover:opacity-80" 
                    style={{ color: themeColor, fontSize: `${Math.max(18, fontSizes.bodyText + 3)}px` }}
                  >
                    {area?.title || '서비스명 없음'}
                  </h3>
                  <p 
                    className="text-slate-600 leading-relaxed" 
                    style={{ fontSize: `${fontSizes.bodyText}px` }}
                  >
                    {area?.description || '서비스 설명을 입력해주세요.'}
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">등록된 사업 영역이 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* 기업 연혁 섹션 */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
            <h2
              className="font-extrabold text-slate-900 tracking-tight"
              style={{ fontSize: `${fontSizes.sectionTitle}px` }}
            >
              기업 연혁
            </h2>
          </div>
          <div className="relative space-y-6 before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {history.length > 0 ? (
              history.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-12 group">
                  {/* 타임라인 포인트 */}
                  <div 
                    className="absolute left-0 top-1.5 w-8 h-8 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-110" 
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm group-hover:border-slate-300 transition-colors">
                    <span className="font-extrabold text-slate-900 block mb-1" style={{ fontSize: `${Math.max(16, fontSizes.bodyText + 1)}px` }}>
                      {item?.year || '연도'}
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-700" style={{ fontSize: `${fontSizes.bodyText}px` }}>
                        {item?.title || '제목 없음'}
                      </span>
                      <span className="text-slate-500 text-sm leading-relaxed" style={{ fontSize: `${Math.max(13, fontSizes.bodyText - 2)}px` }}>
                        {item?.content || '내용을 입력해주세요.'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 text-sm">등록된 연혁이 없습니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}