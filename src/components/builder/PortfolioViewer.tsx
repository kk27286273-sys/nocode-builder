'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function PortfolioViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  const gallery = (data?.specifics as any)?.gallery || [];

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ color: data?.themeColor || '#000' }}>
        [포트폴리오 미리보기] {data?.company?.name || '회사명을 입력하세요'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {gallery.length > 0 ? (
          gallery.map((item: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-lg bg-slate-50">
              <div className="aspect-square bg-slate-200 rounded mb-2 flex items-center justify-center text-slate-400">이미지</div>
              <h3 className="font-bold">{item?.title || '작품명 없음'}</h3>
              <p className="text-xs text-slate-500">{item?.category || '카테고리'} | {item?.date || '날짜'}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">등록된 작품이 없습니다. 사이드바에서 추가해주세요.</p>
        )}
      </div>
    </div>
  );
}