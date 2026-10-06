'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function PortfolioViewer({ data }: { data: B2BTemplateData }) {
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ color: data.themeColor }}>
        [포트폴리오 미리보기] {data.company.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {(data.specifics as any)?.gallery?.map((item: any, idx: number) => (
          <div key={idx} className="p-4 border rounded-lg bg-slate-50">
            <div className="aspect-square bg-slate-200 rounded mb-2 flex items-center justify-center text-slate-400">이미지</div>
            <h3 className="font-bold">{item.title}</h3>
            <p className="text-xs text-slate-500">{item.category} | {item.date}</p>
          </div>
        ))}
        {! (data.specifics as any)?.gallery?.length && <p>등록된 작품이 없습니다.</p>}
      </div>
    </div>
  );
}