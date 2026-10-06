'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function PortfolioViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;
  const specifics = data.specifics as any;
  const gallery = specifics?.gallery || [];
  return (
    <div className="p-10 bg-white min-h-screen font-sans text-slate-900">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: data?.themeColor || '#000' }}>
          {data?.company?.name || '포트폴리오 이름'}
        </h1>
        <p className="text-slate-500 text-lg">{data?.company?.description || '소개를 입력하세요'}</p>
      </header>
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6" style={{ backgroundColor: data?.themeColor }}></span>
          작업 갤러리
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.length > 0 ? (
            gallery.map((item: any, idx: number) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl border bg-slate-50">
                <div className="aspect-video overflow-hidden">
                  <img src={item?.thumbnail || 'https://via.placeholder.com/400'} alt={item?.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-500">{item?.category || '일반'}</span>
                    <span className="text-[10px] text-slate-400">{item?.date || ''}</span>
                  </div>
                  <h3 className="font-bold text-slate-800">{item?.title || '작품명 없음'}</h3>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">등록된 작품이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}
