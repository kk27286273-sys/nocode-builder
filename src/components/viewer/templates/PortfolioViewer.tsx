import React from 'react';
import { SiteData } from '@/types/template';

export const PortfolioViewer = ({ data }: { data: SiteData }) => {
  const { company, style, specifics } = data;
  const portData = specifics as any; // PortfolioData 타입 캐스팅

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* GNB: 미니멀 스타일 */}
      <nav className="px-6 py-6 flex justify-between items-center">
        <img src={company.logoUrl} alt="logo" className="h-6" />
        <div className="flex gap-6 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="text-sky-600">Work</a>
          <a href="#" className="hover:text-sky-600 transition">About</a>
          <a href="#" className="hover:text-sky-600 transition">Contact</a>
        </div>
      </nav>

      {/* 히어로: 예술적 감성 */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
          CREATIVE <br/> <span className="text-sky-600">PORTFOLIO</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm uppercase tracking-widest">
          {company.name} - 우리는 가치를 시각화하여 경험을 설계합니다.
        </p>
      </section>

      {/* 필터 태그 */}
      <section className="flex justify-center gap-3 px-6 mb-12">
        <button className="px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full">All</button>
        {portData.filterTags?.map((tag: string, i: number) => (
          <button key={i} className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-full hover:bg-slate-200 transition">
            {tag}
          </button>
        ))}
      </section>

      {/* 포트폴리오 그리드: Masonry 스타일 지향 */}
      <section className="px-6 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {portData.gallery?.map((item: any, idx: number) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 mb-4">
                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-sky-600/80 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center text-white font-bold text-lg">
                  View Project
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.category} · {item.date}</p>
                </div>
                <span className="text-xs font-mono text-slate-300">0{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-slate-50 py-20 px-6 text-center border-t border-slate-100">
        <p className="text-slate-400 text-xs">© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
      </footer>
    </div>
  );
};