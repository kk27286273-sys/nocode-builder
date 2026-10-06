'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function CorporateViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  // 데이터 안전하게 추출
  const specifics = data.specifics as any;
  const services = specifics?.services || [];
  const history = specifics?.history || [];

  return (
    <div className="p-10 bg-white min-h-screen font-sans text-slate-900">
      {/* 헤더 섹션 */}
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: data?.themeColor || '#000' }}>
          {data?.company?.name || '회사명을 입력하세요'}
        </h1>
        <p className="text-slate-500 text-lg">{data?.company?.description || '회사 설명을 입력하세요'}</p>
      </header>

      {/* 인사말 섹션 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6" style={{ backgroundColor: data?.themeColor }}></span>
          CEO 인사말
        </h2>
        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {specifics?.about?.greeting || '인사말을 입력해주세요.'}
          </p>
        </div>
      </section>

      {/* 사업영역 섹션 - 추가됨 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6" style={{ backgroundColor: data?.themeColor }}></span>
          사업 영역
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service: any, idx: number) => (
              <div key={idx} className="p-6 border rounded-xl hover:shadow-md transition-shadow bg-white">
                <h3 className="text-xl font-bold mb-3" style={{ color: data?.themeColor }}>
                  {service?.title || '서비스명 없음'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {service?.description || '서비스 설명을 입력해주세요.'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">등록된 사업 영역이 없습니다.</p>
          )}
        </div>
      </section>

      {/* 기업 연혁 섹션 - 추가됨 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6" style={{ backgroundColor: data?.themeColor }}></span>
          기업 연혁
        </h2>
        <div className="space-y-4">
          {history.length > 0 ? (
            history.map((item: any, idx: number) => (
              <div key={idx} className="flex gap-4 p-4 border-l-2 pl-6 relative" style={{ borderColor: data?.themeColor }}>
                <span className="font-bold text-slate-800 min-w-[100px]">{item?.year || '연도'}</span>
                <span className="text-slate-600">{item?.content || '내용을 입력해주세요.'}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">등록된 연혁이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}