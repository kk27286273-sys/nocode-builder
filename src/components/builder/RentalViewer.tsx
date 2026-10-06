'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function RentalViewer({ data }: { data: B2BTemplateData }) {
  if (!data) return <div className="p-10">데이터를 불러오는 중입니다...</div>;

  const products = (data?.specifics as any)?.products || [];

  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ color: data?.themeColor || '#000' }}>
        [렌탈샵 미리보기] {data?.company?.name || '회사명을 입력하세요'}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {products.length > 0 ? (
          products.map((prod: any, idx: number) => (
            <div key={idx} className="p-4 border rounded-lg shadow-sm bg-white">
              <h3 className="font-bold text-lg">{prod?.name || '상품명 없음'}</h3>
              <p className="text-sky-600 font-bold">{prod?.price || '0'} {prod?.rentalPeriod || '원'}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500">등록된 상품이 없습니다. 사이드바에서 추가해주세요.</p>
        )}
      </div>
    </div>
  );
}