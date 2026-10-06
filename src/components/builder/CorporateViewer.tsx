'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function CorporateViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  const specifics = data.specifics as any;
  const services = specifics?.services ?? [];
  const history = specifics?.history ?? [];

  return (
    <div className="p-10 bg-white min-h-screen font-sans text-slate-900">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: data?.themeColor || '#000' }}>
          {data?.company?.name || '회사명을 입력하세요'}
        </h1>
        <p className="text-slate-500 text-lg">{data?.company?.description || '회사 설명을 입력하세요'}</p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6" style={{ color: data?.themeColor || '#000' }}>
          사업 영역
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service: any, idx: number) => (
              <div key={idx} className="p-6 border rounded-xl bg-white">
                <h3 className="text-xl font-bold mb-2" style={{ color: data?.themeColor || '#000' }}>
                  {service?.title || '서비스명 없음'}
                </h3>
                <p className="text-slate-600 text-sm">{service?.description || '서비스 설명을 입력해주세요.'}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-500" style={{ fontStyle: 'italic' }}>
              등록된 사업 영역이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6" style={{ color: data?.themeColor || '#000' }}>
          기업 연혁
        </h2>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 border-l-2 pl-6" style={{ borderColor: data?.themeColor }}>
                <span className="font-bold text-slate-800 min-w-[100px]">{item?.year || '연도'}</span>
                <span className="text-slate-600">{item?.content || '내용을 입력해주세요.'}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">등록된 연혁이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}