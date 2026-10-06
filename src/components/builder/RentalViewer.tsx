'use client';
import React from 'react';
import { B2BTemplateData } from '@/types/template';

export default function RentalViewer({ data }: { data: B2BTemplateData }) {
  return (
    <div className="p-10 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-4" style={{ color: data.themeColor }}>
        [렌탈샵 미리보기] {data.company.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {(data.specifics as any)?.products?.map((prod: any, idx: number) => (
          <div key={idx} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-bold text-lg">{prod.name}</h3>
            <p className="text-sky-600 font-bold">{prod.price} {prod.rentalPeriod}</p>
          </div>
        ))}
        {! (data.specifics as any)?.products?.length && <p>등록된 상품이 없습니다.</p>}
      </div>
    </div>
  );
}