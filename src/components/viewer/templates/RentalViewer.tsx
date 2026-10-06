import React from 'react';
import { SiteData } from '@/types/template';

export const RentalViewer = ({ data }: { data: SiteData }) => {
  const { company, style, specifics } = data;
  const rentalData = specifics as any; // RentalShopData 타입 캐스팅

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* GNB: 쇼핑몰 스타일 (카테고리 중심) */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <img src={company.logoUrl} alt="logo" className="h-7" />
        <div className="flex gap-6 text-sm font-medium">
          {rentalData.categories?.map((cat: any, i: number) => (
            <a key={i} href="#" className="hover:text-sky-600 transition">{cat.name}</a>
          ))}
          <a href="#apply" className="text-sky-600 font-bold">렌탈신청</a>
        </div >
      </nav>

      {/* 히어로: 혜택 강조형 */}
      <section className="py-16 px-6 bg-white text-center border-b border-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">합리적인 {company.name} 렌탈 서비스</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">초기 비용 부담 없이 최고의 제품을 경험하세요. <br/>최적의 맞춤 플랜을 제안해 드립니다.</p>
      </section>

      {/* 상품 리스트: 카드 그리드 형태 */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rentalData.products?.map((product: any, idx: number) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="relative h-52 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div className="absolute top-3 left-3 flex gap-1">
                  {product.tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-white/90 text-[10px] font-bold rounded-full text-slate-600">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-slate-900 mb-2">{product.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-lg font-extrabold text-sky-600">{product.price}원</span>
                  <span className="text-xs text-slate-400">/ {product.rentalPeriod}</span>
                </div>
                <button className="w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition">상세보기 및 신청</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 렌탈 프로세스: 단계별 안내 */}
      <section className="py-20 bg-white px-6 border-t border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-12">간편한 신청 절차</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {rentalData.rentalProcess?.map((step: any, idx: number) => (
              <div key={idx} className="relative flex flex-col items-center">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.step}
                </div>
                <h4 className="font-bold text-sm mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500">{step.description}</p>
                {idx < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-slate-200 -z-10"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center text-xs">
        <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};