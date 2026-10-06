'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function CorporateViewer({ data }: { data: B2BTemplateData }) {
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ color: data.themeColor }}>
        [기업형 미리보기] {data.company.name}
      </h1>
      <p className="text-slate-600 mb-8">사이드바에서 기업 정보를 수정하면 여기에 실시간으로 반영됩니다.</p>
      <div className="p-6 bg-slate-50 border rounded-xl">
        <h2 className="text-xl font-bold mb-2">회사 인사말</h2>
        <p className="text-slate-700 whitespace-pre-wrap">{(data.specifics as any)?.about?.greeting || '인사말을 입력해주세요.'}</p>
      </div>
    </div>
  );
}