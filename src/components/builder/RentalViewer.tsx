'use client';

import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function RentalViewer({ data }: { data: B2BTemplateData }) {
  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-400 font-sans">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  const specifics = (data.specifics as any) || {};
  const products = specifics?.products || [];
  const themeColor = data?.themeColor || '#0284c7';

  // 에디터 폰트 크기 슬라이더 값 매핑 (기본값 설정)
  const fontSizes = {
    heroTitle: data.fontSizes?.heroTitle || 36,
    subTitle: data.fontSizes?.subTitle || 18,
    sectionTitle: data.fontSizes?.sectionTitle || 24,
    bodyText: data.fontSizes?.bodyText || 15,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 pb-24">
      {/* 상단 네비게이션 / 헤더 */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-extrabold text-xl tracking-tight" style={{ color: themeColor }}>
            {data?.company?.name || '렌탈 샵'}
          </span>
          {data?.company?.phone && (
            <a
              href={`tel:${data.company.phone}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ backgroundColor: themeColor }}
            >
              📞 문의전화: {data.company.phone}
            </a>
          )}
        </div>
      </header>

      {/* 히어로 섹션 */}
      <section className="bg-white border-b border-slate-100 py-16 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1
            className="font-extrabold tracking-tight text-slate-900 leading-tight"
            style={{ fontSize: `${fontSizes.heroTitle}px` }}
          >
            {data?.company?.name || '스마트한 렌탈 서비스'}
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
            {data?.company?.description || '합리적인 가격대의 고품질 렌탈 상품을 제안합니다.'}
          </p>
        </div>
      </section>

      {/* 상품 목록 섹션 */}
      <main className="max-w-6xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h2
            className="font-extrabold text-slate-900 flex items-center gap-3 tracking-tight"
            style={{ fontSize: `${fontSizes.sectionTitle}px` }}
          >
            <span className="w-1.5 h-6 rounded-full" style={{ backgroundColor: themeColor }}></span>
            추천 상품 리스트
          </h2>
          <span className="text-xs font-semibold text-slate-400">총 {products.length}개 상품</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map((prod: any, idx: number) => (
              <div
                key={idx}
                className="group flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-200"
              >
                <div className="aspect-square bg-slate-100 overflow-hidden relative">
                  <img
                    src={prod?.image || 'https://via.placeholder.com/400?text=Rental+Product'}
                    alt={prod?.name || '상품 이미지'}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3
                      className="font-bold text-slate-900 mb-1"
                      style={{ fontSize: `${Math.max(16, fontSizes.bodyText + 2)}px` }}
                    >
                      {prod?.name || '상품명 없음'}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2">
                      {prod?.description || '간단한 제품 스펙 및 옵션 구성 설명입니다.'}
                    </p>
                  </div>
                  <div className="flex items-baseline justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs font-medium text-slate-400">월 렌탈료</span>
                    <p className="font-extrabold text-lg" style={{ color: themeColor }}>
                      {Number(prod?.price || 0).toLocaleString()}원
                      <span className="text-xs font-normal text-slate-500 ml-1">/ {prod?.rentalPeriod || '월'}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm">등록된 렌탈 상품이 없습니다. 에디터에서 상품을 추가해 보세요.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}