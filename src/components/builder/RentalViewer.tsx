'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function RentalViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  const specifics = data.specifics as any;
  const products = specifics?.products || [];

  return (
    <div className="p-10 bg-white min-h-screen font-sans text-slate-900">
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold mb-2" style={{ color: data?.themeColor || '#000' }}>
          {data?.company?.name || '렌탈 샵 이름'}
        </h1>
        <p className="text-slate-500 text-lg">{data?.company?.description || '상품 설명을 입력하세요'}</p>
      </header>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-6" style={{ backgroundColor: data?.themeColor }}></span>
          추천 상품 리스트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length > 0 ? (
            products.map((prod: any, idx: number) => (
              <div key={idx} className="p-6 border rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-square bg-slate-100 rounded-lg mb-4 overflow-hidden">
                  <img src={prod?.image || 'https://via.placeholder.com/300'} alt={prod?.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold mb-2">{prod?.name || '상품명 없음'}</h3>
                <p className="text-lg font-bold" style={{ color: data?.themeColor }}>
                  {prod?.price || '0'}원 / {prod?.rentalPeriod || '월'}
                </p>
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic">등록된 상품이 없습니다.</p>
          )}
        </div>
      </section>
    </div>
  );
}